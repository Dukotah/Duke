"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X, Search, Mail, Check, Send, ChevronDown, Flame, Zap,
  Tag, MapPin, ArrowUpDown, Save, RotateCcw, Calendar, Link,
} from "lucide-react";
import {
  loadTemplates, saveTemplateOverride, resetTemplateOverride, hasOverride,
  personalize, type EmailTemplate,
} from "./emailTemplates";
import { firstName } from "@/lib/outreach";
import { readBookingOverride, writeBookingOverride, resolveBookingUrl } from "@/lib/booking";

const H = { fontFamily: "var(--font-heading)" };
const LIMIT = 50;

interface Lead {
  id: string;
  name: string;
  contact_name: string;
  category: string;
  email: string;
  city: string;
  state: string;
  tier: string;
  outreach_score: number;
  // Enriched (optional): MX-verified deliverability + grade bucket.
  email_status?: string;
  grade?: string;
}

// Dot colour for the enriched email deliverability status.
function deliverabilityDot(status?: string): string {
  switch ((status ?? "").toLowerCase()) {
    case "valid": return "bg-green-400";
    case "risky": return "bg-amber-400";
    case "invalid": return "bg-red-400";
    case "unknown": return "bg-zinc-500";
    default: return "bg-transparent";
  }
}

interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  counties: string[];
  niches: string[];
}

function Select({ value, onChange, children, icon: Icon }: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="relative">
      {Icon && <Icon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--crm-text-3)] pointer-events-none" />}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${Icon ? "pl-8" : "pl-3"} pr-6 py-2 rounded-xl bg-[var(--crm-surface-2)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors appearance-none`}
        style={H}
      >
        {children}
      </select>
      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--crm-text-3)] pointer-events-none" />
    </div>
  );
}

interface BulkOutreachProps {
  repName: string;
  onClose: () => void;
}

export default function BulkOutreach({ repName, onClose }: BulkOutreachProps) {
  // Step: "select" | "compose" | "preview" | "result"
  const [step, setStep] = useState<"select" | "compose" | "preview" | "result">("select");
  // Booking link (personal scheduling override appended to emails when set)
  const [calendlyLink, setCalendlyLink] = useState("");
  const [showCalendlyInput, setShowCalendlyInput] = useState(false);
  const [calendlyDraft, setCalendlyDraft] = useState("");

  // Lead selection state
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [county, setCounty] = useState("");
  const [niche, setNiche] = useState("");
  const [tier, setTier] = useState("");
  // Deliverability filter — default to "deliverable" so the warm-up batch never
  // includes MX-invalid (mostly no-email) addresses.
  const [emailStatus, setEmailStatus] = useState("deliverable");
  const [sortBy, setSortBy] = useState("outreach_score");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);

  // Compose state
  const [templates, setTemplates] = useState<EmailTemplate[]>(() => loadTemplates());
  const [templateKey, setTemplateKey] = useState(templates[0].key);
  const [subject, setSubject] = useState(templates[0].subject);
  const [body, setBody] = useState(templates[0].body);
  const [fromName, setFromName] = useState(repName);
  const [savedFlash, setSavedFlash] = useState(false);

  // Result
  const [result, setResult] = useState<{ sent: number; delivered?: number; failed: number; skipped: number } | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  // Daily sending capacity (warm-up ramp): how many of today's cap are left,
  // and whether sends go out live or are track-only until the domain is verified.
  const [capacity, setCapacity] = useState<{ sentToday: number; dailyCap: number; remaining: number; live: boolean } | null>(null);
  const fetchCapacity = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/outreach");
      if (res.ok) setCapacity(await res.json());
    } catch { /* non-fatal — banner just stays hidden */ }
  }, []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        sortBy,
        hasEmail: "yes",
        ...(q && { q }),
        ...(county && { county }),
        ...(niche && { niche }),
        ...(tier && { tier }),
        ...(emailStatus && { emailStatus }),
      });
      const res = await fetch(`/api/crm/leads?${p}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [q, county, niche, tier, emailStatus, sortBy, page]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: reset pagination when filters change
  useEffect(() => { setPage(1); }, [q, county, niche, tier, emailStatus, sortBy]);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate saved booking link on mount
  useEffect(() => { const saved = readBookingOverride(); setCalendlyLink(saved); setCalendlyDraft(saved); }, []);
  // Load today's sending capacity on mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { fetchCapacity(); }, [fetchCapacity]);

  const saveCalendlyLink = () => {
    const trimmed = calendlyDraft.trim();
    setCalendlyLink(trimmed);
    writeBookingOverride(trimmed);
    setShowCalendlyInput(false);
  };

  const toggleLead = (lead: Lead) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(lead.id)) {
        next.delete(lead.id);
        setSelectedLeads((sl) => sl.filter((l) => l.id !== lead.id));
      } else {
        next.add(lead.id);
        setSelectedLeads((sl) => [...sl, lead]);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (!data) return;
    const allIds = data.leads.map((l) => l.id);
    const allSelected = allIds.every((id) => selected.has(id));
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        allIds.forEach((id) => next.delete(id));
        return next;
      });
      setSelectedLeads((sl) => sl.filter((l) => !allIds.includes(l.id)));
    } else {
      const toAdd = data.leads.filter((l) => !selected.has(l.id));
      setSelected((prev) => {
        const next = new Set(prev);
        allIds.forEach((id) => next.add(id));
        return next;
      });
      setSelectedLeads((sl) => [...sl, ...toAdd]);
    }
  };

  const applyTemplate = (key: string) => {
    setTemplateKey(key);
    const tmpl = templates.find((t) => t.key === key);
    if (tmpl && key !== "custom") {
      setSubject(tmpl.subject);
      setBody(tmpl.body);
    }
  };

  const saveEdits = () => {
    saveTemplateOverride(templateKey, subject, body);
    setTemplates((prev) => prev.map((t) => (t.key === templateKey ? { ...t, subject, body } : t)));
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const resetEdits = () => {
    resetTemplateOverride(templateKey);
    const fresh = loadTemplates();
    setTemplates(fresh);
    const tmpl = fresh.find((t) => t.key === templateKey);
    if (tmpl) {
      setSubject(tmpl.subject);
      setBody(tmpl.body);
    }
  };

  const previewEmail = () => {
    if (selectedLeads.length === 0) return { subject: "", body: "" };
    const lead = selectedLeads[0];
    // {name} greeting uses the contact's first name when known, else "there";
    // {business} carries the company name.
    const vars = { name: firstName(lead.contact_name), business: lead.name, city: lead.city, fromName };
    return { subject: personalize(subject, vars), body: personalize(body, vars) };
  };

  const handleSend = async () => {
    if (atCap) return;
    setSending(true);
    setSendError("");
    try {
      const leadsPayload = selectedLeads.map((l) => ({
        id: l.id,
        name: l.name,
        contactName: l.contact_name,
        email: l.email,
        city: l.city,
        emailStatus: l.email_status,
      }));
      // Opt-in: only append a booking CTA when the rep has set a personal link,
      // so templates that already mention scheduling don't get a duplicate.
      const finalBody = calendlyLink ? `${body}\n\nBook a free 15-minute call: ${resolveBookingUrl(calendlyLink)}` : body;
      const res = await fetch("/api/crm/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: leadsPayload, subject, body: finalBody, fromName }),
      });
      const d = await res.json();
      if (!res.ok) {
        setSendError(d.error ?? "Failed to send");
        setSending(false);
        return;
      }
      setResult(d);
      setStep("result");
      fetchCapacity(); // reflect the just-consumed daily budget
    } catch {
      setSendError("Network error — please try again");
    } finally {
      setSending(false);
    }
  };

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 0;
  const preview = previewEmail();

  // Warm-up cap guards: block at zero, warn when the batch exceeds what's left today.
  const atCap = !!capacity && capacity.remaining < 1;
  const overCap = !!capacity && !atCap && selected.size > capacity.remaining;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--crm-surface-2)]" style={H}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--crm-border)] shrink-0">
        <div>
          <h2 className="text-base font-bold text-[var(--crm-text)]">✉️ Bulk Email Outreach</h2>
          {step === "select" && (
            <p className="text-xs text-[var(--crm-text-3)] mt-0.5">
              {selected.size > 0 ? `${selected.size} leads selected` : "Select leads with emails to contact"}
            </p>
          )}
          {step === "compose" && <p className="text-xs text-[var(--crm-text-3)] mt-0.5">Write your message</p>}
          {step === "preview" && <p className="text-xs text-[var(--crm-text-3)] mt-0.5">Review before sending</p>}
        </div>
        <button onClick={onClose} className="p-2 rounded-lg text-[var(--crm-text-3)] hover:text-[var(--crm-text)] hover:bg-[var(--crm-surface-3)] transition-colors">
          <X size={18} />
        </button>
      </div>
      {/* Booking-link banner — optional personal scheduling link appended to emails */}
      <div className="px-5 py-3 border-b border-[var(--crm-border)] bg-violet-500/5 shrink-0">
        {!showCalendlyInput ? (
          <button onClick={() => { setCalendlyDraft(calendlyLink); setShowCalendlyInput(true); }}
            className="flex items-center gap-2 text-xs text-violet-300 hover:text-violet-200 transition-colors" style={H}>
            <Calendar size={12} />
            {calendlyLink
              ? <><span className="text-[var(--crm-text-3)]">Booking link:</span><span className="truncate max-w-[220px] ml-1">{calendlyLink}</span></>
              : <span className="text-violet-400">+ Add a personal booking link to include in emails</span>}
          </button>
        ) : (
          <div className="flex gap-2 items-center">
            <Link size={12} className="text-violet-400 shrink-0" />
            <input value={calendlyDraft} onChange={(e) => setCalendlyDraft(e.target.value)}
              placeholder="https://calendly.com/your-name/15min"
              className="flex-1 bg-transparent border-b border-violet-400/40 text-xs text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none pb-0.5"
              style={H} autoFocus
              onKeyDown={(e) => { if (e.key === "Enter") saveCalendlyLink(); if (e.key === "Escape") setShowCalendlyInput(false); }} />
            <button onClick={saveCalendlyLink} className="text-xs text-violet-300 font-semibold px-2 py-1 rounded-lg bg-violet-500/20 hover:bg-violet-500/30" style={H}>Save</button>
            <button onClick={() => setShowCalendlyInput(false)} className="text-xs text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] px-1" style={H}>✕</button>
          </div>
        )}
      </div>

      {/* Daily sending capacity — warm-up ramp */}
      {capacity && (
        <div className="px-5 py-3 border-b border-[var(--crm-border)] shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-[var(--crm-text-2)] flex items-center gap-1.5" style={H}>
              <Send size={11} className="text-[var(--crm-accent)]" />
              {capacity.sentToday} / {capacity.dailyCap} sent today
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              capacity.live
                ? "text-green-500 bg-green-500/10 border-green-500/20"
                : "text-amber-500 bg-amber-500/10 border-amber-500/20"
            }`} style={H}>
              {capacity.live ? "Live" : "Practice"}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--crm-surface-3)] overflow-hidden">
            <div className="h-full rounded-full bg-[var(--crm-accent)] transition-all"
              style={{ width: `${Math.min(100, capacity.dailyCap ? (capacity.sentToday / capacity.dailyCap) * 100 : 0)}%` }} />
          </div>
          <p className="text-[11px] text-[var(--crm-text-3)] mt-1.5" style={H}>
            {capacity.remaining > 0
              ? `${capacity.remaining} left in today's warm-up cap${capacity.live ? "" : " — sends are tracked only until the domain is verified"}`
              : "Daily cap reached — more sends unlock tomorrow"}
          </p>
        </div>
      )}

      {/* Step indicator */}
      {step !== "result" && (
        <div className="flex px-5 py-2.5 gap-2 border-b border-[var(--crm-border)] shrink-0">
          {(["select", "compose", "preview"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <div className="w-4 h-px bg-[var(--crm-border-strong)]" />}
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${step === s ? "text-[var(--crm-accent-text)]" : "text-[var(--crm-text-3)]"}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === s ? "bg-[var(--crm-accent)] text-white" : "bg-[var(--crm-surface-3)] text-[var(--crm-text-3)]"}`}>
                  {i + 1}
                </div>
                <span className="hidden sm:inline capitalize">{s}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: Select leads */}
      {step === "select" && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pt-4 space-y-3">
            {/* Search & filters */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--crm-text-3)]" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search name, city, niche…"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)]"
                  style={H}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={county} onChange={setCounty} icon={MapPin}>
                <option value="">All Counties</option>
                {data?.counties.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
              <Select value={niche} onChange={setNiche} icon={Tag}>
                <option value="">All Niches</option>
                {data?.niches.map((n) => <option key={n} value={n}>{n.replace(/_/g, " ")}</option>)}
              </Select>
              <Select value={tier} onChange={setTier}>
                <option value="">All Tiers</option>
                <option value="A">🔥 No Website</option>
                <option value="B">⚡ DIY Site</option>
                <option value="C">Has Site</option>
              </Select>
              <Select value={emailStatus} onChange={setEmailStatus} icon={Mail}>
                <option value="deliverable">Deliverable</option>
                <option value="valid">Verified only</option>
                <option value="">Any email</option>
              </Select>
              <Select value={sortBy} onChange={setSortBy} icon={ArrowUpDown}>
                <option value="outreach_score">Best score</option>
                <option value="name">Name A–Z</option>
                <option value="city">City A–Z</option>
              </Select>
            </div>

            {data && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-[var(--crm-text-3)]">
                  <span className="text-[var(--crm-text)] font-semibold">{data.total.toLocaleString()}</span> leads with email
                </p>
                {data.leads.length > 0 && (
                  <button onClick={toggleAll} className="text-xs text-[var(--crm-accent-text)] hover:opacity-80" style={H}>
                    {data.leads.every((l) => selected.has(l.id)) ? "Deselect page" : "Select page"}
                  </button>
                )}
              </div>
            )}

            {/* Lead list */}
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-6 h-6 border-2 border-[var(--crm-accent)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-1.5 pb-4">
                {data?.leads.map((lead) => {
                  const isSelected = selected.has(lead.id);
                  return (
                    <div
                      key={lead.id}
                      onClick={() => toggleLead(lead)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer border transition-all active:scale-[0.99] ${
                        isSelected
                          ? "bg-[var(--crm-accent-weak)] border-[var(--crm-accent-border)]"
                          : "bg-[var(--crm-surface)] border-[var(--crm-border)] hover:border-[var(--crm-accent-border)]"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "bg-[var(--crm-accent)] border-[var(--crm-accent)]" : "border-[var(--crm-border-strong)]"
                      }`}>
                        {isSelected && <Check size={11} className="text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-[var(--crm-text)] truncate" style={H}>{lead.name}</p>
                          {lead.tier === "A" && <Flame size={10} className="text-orange-400 shrink-0" />}
                          {lead.tier === "B" && <Zap size={10} className="text-yellow-400 shrink-0" />}
                        </div>
                        <p className="text-xs text-[var(--crm-text-3)] mt-0.5 truncate" style={H}>
                          {lead.city} · {lead.category.replace(/_/g, " ")}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-xs text-[var(--crm-text-3)] flex items-center gap-1.5" style={H}>
                          {lead.email_status && <span className={`w-1.5 h-1.5 rounded-full ${deliverabilityDot(lead.email_status)}`} title={`Email: ${lead.email_status}`} />}
                          <Mail size={9} />{lead.email.length > 20 ? lead.email.slice(0, 18) + "…" : lead.email}
                        </span>
                        {lead.grade && <span className="block text-[10px] text-[var(--crm-text-3)] mt-0.5" style={H}>Grade {lead.grade}</span>}
                      </div>
                    </div>
                  );
                })}
                {data?.leads.length === 0 && (
                  <p className="text-center py-12 text-sm text-[var(--crm-text-3)]">No leads with emails match your filters.</p>
                )}
              </div>
            )}

            {/* Pagination */}
            {data && totalPages > 1 && (
              <div className="flex items-center justify-between py-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="text-sm text-[var(--crm-text-2)] hover:text-[var(--crm-text)] disabled:opacity-20 px-3 py-1.5 rounded-lg border border-[var(--crm-border)]"
                  style={H}
                >← Prev</button>
                <span className="text-xs text-[var(--crm-text-3)]">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="text-sm text-[var(--crm-text-2)] hover:text-[var(--crm-text)] disabled:opacity-20 px-3 py-1.5 rounded-lg border border-[var(--crm-border)]"
                  style={H}
                >Next →</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: Compose */}
      {step === "compose" && (
        <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-4 pb-4">
          {/* Template picker */}
          <div>
            <p className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-2">Choose a Template</p>
            <div className="flex flex-col gap-2">
              {templates.map((t) => (
                <button
                  key={t.key}
                  onClick={() => applyTemplate(t.key)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                    templateKey === t.key
                      ? "bg-[var(--crm-accent-weak)] border-[var(--crm-accent-border)] text-[var(--crm-accent-text)]"
                      : "bg-[var(--crm-surface)] border-[var(--crm-border)] text-[var(--crm-text-2)] hover:border-[var(--crm-border-strong)]"
                  }`}
                  style={H}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    templateKey === t.key ? "border-[var(--crm-accent)] bg-[var(--crm-accent)]" : "border-[var(--crm-border-strong)]"
                  }`}>
                    {templateKey === t.key && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className="text-sm font-semibold">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* From name */}
          <div>
            <label className="block text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-2">Your Name</label>
            <input
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] focus:outline-none focus:border-[var(--crm-accent-border)]"
              style={H}
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-2">Subject Line</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject — use {name}, {business}, {city}"
              className="w-full px-4 py-3 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)]"
              style={H}
            />
          </div>

          {/* Body */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider">Message Body</label>
              {templateKey !== "custom" && (
                <div className="flex items-center gap-3">
                  <button onClick={saveEdits} className="text-xs font-semibold text-[var(--crm-text-2)] hover:text-[var(--crm-accent-text)] flex items-center gap-1 transition-colors">
                    {savedFlash ? <><Check size={11} className="text-green-500" />Saved</> : <><Save size={11} />Save edits</>}
                  </button>
                  {hasOverride(templateKey) && (
                    <button onClick={resetEdits} className="text-xs font-semibold text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] flex items-center gap-1 transition-colors">
                      <RotateCcw size={11} />Reset
                    </button>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-[var(--crm-text-3)] mb-2">Variables: {"{name}"}, {"{business}"}, {"{city}"}, {"{fromName}"}</p>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] resize-none focus:outline-none focus:border-[var(--crm-accent-border)]"
              style={H}
            />
          </div>
        </div>
      )}

      {/* STEP 3: Preview */}
      {step === "preview" && (
        <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-4 pb-4">
          <div className="bg-[var(--crm-surface)] rounded-xl border border-[var(--crm-border)] p-4 space-y-3">
            <div>
              <p className="text-xs text-[var(--crm-text-3)] font-semibold uppercase tracking-wider mb-1">Preview — first email</p>
              <p className="text-xs text-[var(--crm-text-3)]">{selectedLeads[0]?.name} · {selectedLeads[0]?.email}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--crm-text-2)] font-semibold mb-1">Subject</p>
              <p className="text-sm text-[var(--crm-text)] font-semibold">{preview.subject}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--crm-text-2)] font-semibold mb-1">Body</p>
              <pre className="text-sm text-[var(--crm-text-2)] whitespace-pre-wrap leading-relaxed font-sans">{preview.body}</pre>
            </div>
          </div>

          <div className="bg-[var(--crm-surface)] rounded-xl border border-[var(--crm-border)] p-4 space-y-2">
            <p className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider">Send Summary</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--crm-text-2)]">Total selected</span>
              <span className="text-sm font-bold text-[var(--crm-text)]">{selected.size} leads</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--crm-text-2)]">All have email</span>
              <span className="text-sm font-bold text-green-500">✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--crm-text-2)]">From</span>
              <span className="text-sm text-[var(--crm-text-2)]">{fromName} via Copper Bay Tech</span>
            </div>
          </div>

          {sendError && (
            <p className="text-sm text-red-500 px-1">{sendError}</p>
          )}
        </div>
      )}

      {/* STEP 4: Result */}
      {step === "result" && result && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
          {(() => {
            // When delivery isn't live yet, everything tracked was logged, not sent.
            const loggedOnly = result.delivered !== undefined && result.delivered < result.sent;
            return (
              <>
                <div className="text-5xl">{loggedOnly ? "📝" : "✉️"}</div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--crm-text)] mb-2" style={H}>{loggedOnly ? "Emails logged!" : "Emails sent!"}</h3>
                  <p className="text-sm text-[var(--crm-text-2)]">
                    {loggedOnly
                      ? "Delivery isn't live yet — these were tracked on lead timelines but not actually sent."
                      : "Here's how it went:"}
                  </p>
                </div>
                <div className="w-full max-w-xs space-y-3">
                  <div className="flex items-center justify-between px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <span className="text-sm font-semibold text-green-500">{loggedOnly ? "Logged" : "Sent"}</span>
                    <span className="text-xl font-bold text-green-500">{result.sent}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <span className="text-sm font-semibold text-red-500">Failed</span>
                    <span className="text-xl font-bold text-red-500">{result.failed}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 bg-[var(--crm-surface-3)] border border-[var(--crm-border)] rounded-xl">
                    <span className="text-sm font-semibold text-[var(--crm-text-2)]">No email</span>
                    <span className="text-xl font-bold text-[var(--crm-text-2)]">{result.skipped}</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl text-sm font-bold text-white"
                  style={{ backgroundColor: "var(--crm-accent)", ...H }}
                >
                  Done
                </button>
              </>
            );
          })()}
        </div>
      )}

      {/* Cap guard notice (preview step) */}
      {step === "preview" && (atCap || overCap) && (
        <div className="shrink-0 px-4 pt-3">
          <p className="text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2" style={H}>
            {atCap
              ? "Daily sending cap reached — sends resume tomorrow as the warm-up ramps."
              : `Only ${capacity?.remaining} of your ${selected.size} selected will send today (daily cap). The rest will be skipped — send them tomorrow.`}
          </p>
        </div>
      )}

      {/* Bottom action bar */}
      {step !== "result" && (
        <div className="shrink-0 border-t border-[var(--crm-border)] px-4 py-4 flex items-center gap-3">
          {step !== "select" && (
            <button
              onClick={() => setStep(step === "compose" ? "select" : "compose")}
              className="px-4 py-3 rounded-xl text-sm font-semibold text-[var(--crm-text-2)] bg-[var(--crm-surface-3)] border border-[var(--crm-border)] hover:bg-[var(--crm-surface-3)] hover:border-[var(--crm-border-strong)] transition-colors"
              style={H}
            >
              ← Back
            </button>
          )}

          {step === "select" && (
            <button
              onClick={() => setStep("compose")}
              disabled={selected.size === 0}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-30 transition-opacity"
              style={{ backgroundColor: "var(--crm-accent)", ...H }}
            >
              Compose Message ({selected.size} leads) →
            </button>
          )}

          {step === "compose" && (
            <button
              onClick={() => setStep("preview")}
              disabled={!subject.trim() || !body.trim() || !fromName.trim()}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-30 transition-opacity"
              style={{ backgroundColor: "var(--crm-accent)", ...H }}
            >
              Preview →
            </button>
          )}

          {step === "preview" && (
            <button
              onClick={handleSend}
              disabled={sending || atCap}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
              style={{ backgroundColor: "var(--crm-accent)", ...H }}
            >
              <Send size={14} />
              {sending ? "Sending…" : atCap ? "Daily cap reached" : `Send to ${selected.size} leads`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
