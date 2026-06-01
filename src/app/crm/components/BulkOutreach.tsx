"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X, Search, Mail, Filter, Check, Send, ChevronDown, Flame, Zap,
  Tag, MapPin, ArrowUpDown, Calendar, Link,
} from "lucide-react";

const H = { fontFamily: "var(--font-heading)" };
const LIMIT = 50;

interface Lead {
  id: string;
  name: string;
  category: string;
  email: string;
  city: string;
  state: string;
  tier: string;
  outreach_score: number;
}

interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  counties: string[];
  niches: string[];
}

interface Template {
  key: string;
  label: string;
  subject: string;
  body: string;
}

function getCalendlyLink(): string {
    if (typeof window === "undefined") return "";
      return localStorage.getItem("calendly_link") ?? "";
const TEMPLATES: Template[] = [
  {
    key: "no_website",
    label: "🔥 No Website",
    subject: "Quick question about {business}'s online presence",
    body: `Hi {name},

I noticed {business} in {city} doesn't have a website yet, and I think that's actually a big opportunity.

Most customers search online before calling — if you're not there, you're losing leads to competitors every day.

We build clean, fast websites for local businesses starting at $1,500. Would you be open to a quick 10-minute chat?

Best,
{fromName}
Copper Bay Tech`,
  },
  {
    key: "diy_upgrade",
    label: "⚡ DIY Site Upgrade",
    subject: "Noticed something about {business}'s website",
    body: `Hi {name},

I was looking at {business}'s website and thought there are a few things that could really help it convert more visitors into customers.

We specialize in upgrading DIY sites — faster load times, better mobile experience, clearer calls-to-action — and most projects are done in under 2 weeks.

Would love to show you a quick mockup if you're curious. Worth a 10-minute call?

Best,
{fromName}
Copper Bay Tech`,
  },
  {
    key: "custom",
    label: "✏️ Custom",
    subject: "",
    body: "",
  },
];

function Select({ value, onChange, children, icon: Icon }: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="relative">
      {Icon && <Icon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${Icon ? "pl-8" : "pl-3"} pr-6 py-2 rounded-xl bg-[#111113] border border-white/10 text-sm text-white focus:outline-none focus:border-[#F97316]/50 transition-colors appearance-none`}
        style={H}
      >
        {children}
      </select>
      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
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
    // Calendly
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
  const [sortBy, setSortBy] = useState("outreach_score");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);

  // Compose state
  const [templateKey, setTemplateKey] = useState("no_website");
  const [subject, setSubject] = useState(TEMPLATES[0].subject);
  const [body, setBody] = useState(TEMPLATES[0].body);
  const [fromName, setFromName] = useState(repName);

  // Result
  const [result, setResult] = useState<{ sent: number; failed: number; skipped: number } | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

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
      });
      const res = await fetch(`/api/crm/leads?${p}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [q, county, niche, tier, sortBy, page]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);
  useEffect(() => { setPage(1); }, [q, county, niche, tier, sortBy]);
    useEffect(() => { const saved = getCalendlyLink(); setCalendlyLink(saved); setCalendlyDraft(saved); }, []);

      const saveCalendlyLink = () => {
          const trimmed = calendlyDraft.trim();
              setCalendlyLink(trimmed);
                  if (typeof window !== "undefined") localStorage.setItem("calendly_link", trimmed);
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
    const tmpl = TEMPLATES.find((t) => t.key === key);
    if (tmpl && key !== "custom") {
      setSubject(tmpl.subject);
      setBody(tmpl.body);
    }
  };

  const previewEmail = () => {
    if (selectedLeads.length === 0) return { subject: "", body: "" };
    const lead = selectedLeads[0];
    return {
      subject: subject.replace(/\{name\}/gi, lead.name).replace(/\{business\}/gi, lead.name).replace(/\{city\}/gi, lead.city),
      body: body
        .replace(/\{name\}/gi, lead.name)
        .replace(/\{business\}/gi, lead.name)
        .replace(/\{city\}/gi, lead.city)
        .replace(/\{fromName\}/gi, fromName),
    };
  };

  const handleSend = async () => {
    setSending(true);
    setSendError("");
    try {
      const leadsPayload = selectedLeads.map((l) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        city: l.city,
      }));
            const finalBody = calendlyLink ? body + "\n\nBook a free 15-minute call: " + calendlyLink : body;
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
    } catch {
      setSendError("Network error — please try again");
    } finally {
      setSending(false);
    }
  };

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 0;
  const preview = previewEmail();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#111113]" style={H}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] shrink-0">
        <div>
          <h2 className="text-base font-bold text-white">✉️ Bulk Email Outreach</h2>
          {step === "select" && (
            <p className="text-xs text-white/40 mt-0.5">
              {selected.size > 0 ? `${selected.size} leads selected` : "Select leads with emails to contact"}
            </p>
          )}
          {step === "compose" && <p className="text-xs text-white/40 mt-0.5">Write your message</p>}
          {step === "preview" && <p className="text-xs text-white/40 mt-0.5">Review before sending</p>}
        </div>
        <button onClick={onClose} className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors">
          <X size={18} />
        </button>
      </div>
            {/* Calendly link banner */}
                  <div className="px-5 py-3 border-b border-white/[0.06] bg-violet-500/5 shrink-0">
                          {!showCalendlyInput ? (
                                    <button onClick={() => { setCalendlyDraft(calendlyLink); setShowCalendlyInput(true); }}
                                                className="flex items-center gap-2 text-xs text-violet-300 hover:text-violet-200 transition-colors" style={H}>
                                                            <Calendar size={12} />
                                                                        {calendlyLink ? <><span className="text-white/40">Calendly:</span><span className="truncate max-w-[220px] ml-1">{calendlyLink}</span></> : <span className="text-violet-400">+ Add your Calendly link to include in emails</span>}
                                                                                  </button>
                                                                                          ) : (
                                                                                                    <div className="flex gap-2 items-center">
                                                                                                                <Link size={12} className="text-violet-400 shrink-0" />
                                                                                                                            <input value={calendlyDraft} onChange={(e) => setCalendlyDraft(e.target.value)}
                                                                                                                                          placeholder="https://calendly.com/your-name/15min"
                                                                                                                                                        className="flex-1 bg-transparent border-b border-violet-400/40 text-xs text-white placeholder-white/25 focus:outline-none pb-0.5"
                                                                                                                                                                      style={H} autoFocus
                                                                                                                                                                                    onKeyDown={(e) => { if (e.key === "Enter") saveCalendlyLink(); if (e.key === "Escape") setShowCalendlyInput(false); }} />
                                                                                                                                                                                                <button onClick={saveCalendlyLink} className="text-xs text-violet-300 font-semibold px-2 py-1 rounded-lg bg-violet-500/20 hover:bg-violet-500/30" style={H}>Save</button>
                                                                                                                                                                                                            <button onClick={() => setShowCalendlyInput(false)} className="text-xs text-white/30 hover:text-white/60 px-1" style={H}>✕</button>
                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                              )}
                                                                                                                                                                                                                                    </div>

      {/* Step indicator */}
      {step !== "result" && (
        <div className="flex px-5 py-2.5 gap-2 border-b border-white/[0.06] shrink-0">
          {(["select", "compose", "preview"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <div className="w-4 h-px bg-white/10" />}
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${step === s ? "text-[#F97316]" : "text-white/25"}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === s ? "bg-[#F97316] text-white" : "bg-white/10 text-white/30"}`}>
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
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search name, city, niche…"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50"
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
              <Select value={sortBy} onChange={setSortBy} icon={ArrowUpDown}>
                <option value="outreach_score">Best score</option>
                <option value="name">Name A–Z</option>
                <option value="city">City A–Z</option>
              </Select>
            </div>

            {data && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/30">
                  <span className="text-white font-semibold">{data.total.toLocaleString()}</span> leads with email
                </p>
                {data.leads.length > 0 && (
                  <button onClick={toggleAll} className="text-xs text-[#F97316] hover:text-[#F97316]/80" style={H}>
                    {data.leads.every((l) => selected.has(l.id)) ? "Deselect page" : "Select page"}
                  </button>
                )}
              </div>
            )}

            {/* Lead list */}
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-6 h-6 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
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
                          ? "bg-[#F97316]/10 border-[#F97316]/30"
                          : "bg-[#1C1C1F] border-white/[0.06] hover:border-[#F97316]/20"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "bg-[#F97316] border-[#F97316]" : "border-white/20"
                      }`}>
                        {isSelected && <Check size={11} className="text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-white truncate" style={H}>{lead.name}</p>
                          {lead.tier === "A" && <Flame size={10} className="text-orange-400 shrink-0" />}
                          {lead.tier === "B" && <Zap size={10} className="text-yellow-400 shrink-0" />}
                        </div>
                        <p className="text-xs text-white/35 mt-0.5 truncate" style={H}>
                          {lead.city} · {lead.category.replace(/_/g, " ")}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-xs text-white/25 flex items-center gap-1" style={H}>
                          <Mail size={9} />{lead.email.length > 20 ? lead.email.slice(0, 18) + "…" : lead.email}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {data?.leads.length === 0 && (
                  <p className="text-center py-12 text-sm text-white/25">No leads with emails match your filters.</p>
                )}
              </div>
            )}

            {/* Pagination */}
            {data && totalPages > 1 && (
              <div className="flex items-center justify-between py-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="text-sm text-white/40 hover:text-white disabled:opacity-20 px-3 py-1.5 rounded-lg border border-white/10"
                  style={H}
                >← Prev</button>
                <span className="text-xs text-white/30">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="text-sm text-white/40 hover:text-white disabled:opacity-20 px-3 py-1.5 rounded-lg border border-white/10"
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
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Choose a Template</p>
            <div className="flex flex-col gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => applyTemplate(t.key)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                    templateKey === t.key
                      ? "bg-[#F97316]/10 border-[#F97316]/30 text-[#F97316]"
                      : "bg-[#1C1C1F] border-white/[0.06] text-white/60 hover:border-white/20"
                  }`}
                  style={H}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    templateKey === t.key ? "border-[#F97316] bg-[#F97316]" : "border-white/20"
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
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Your Name</label>
            <input
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#F97316]/50"
              style={H}
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Subject Line</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject — use {name}, {business}, {city}"
              className="w-full px-4 py-3 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50"
              style={H}
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Message Body</label>
            <p className="text-xs text-white/25 mb-2">Variables: {"{name}"}, {"{business}"}, {"{city}"}, {"{fromName}"}</p>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#F97316]/50"
              style={H}
            />
          </div>
        </div>
      )}

      {/* STEP 3: Preview */}
      {step === "preview" && (
        <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-4 pb-4">
          <div className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] p-4 space-y-3">
            <div>
              <p className="text-xs text-white/35 font-semibold uppercase tracking-wider mb-1">Preview — first email</p>
              <p className="text-xs text-white/25">{selectedLeads[0]?.name} · {selectedLeads[0]?.email}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 font-semibold mb-1">Subject</p>
              <p className="text-sm text-white font-semibold">{preview.subject}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 font-semibold mb-1">Body</p>
              <pre className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed font-sans">{preview.body}</pre>
            </div>
          </div>

          <div className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] p-4 space-y-2">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Send Summary</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Total selected</span>
              <span className="text-sm font-bold text-white">{selected.size} leads</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">All have email</span>
              <span className="text-sm font-bold text-green-400">✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">From</span>
              <span className="text-sm text-white/80">{fromName} via Copper Bay Tech</span>
            </div>
          </div>

          {sendError && (
            <p className="text-sm text-red-400 px-1">{sendError}</p>
          )}
        </div>
      )}

      {/* STEP 4: Result */}
      {step === "result" && result && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
          <div className="text-5xl">✉️</div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2" style={H}>Emails sent!</h3>
            <p className="text-sm text-white/50">Here&apos;s how it went:</p>
          </div>
          <div className="w-full max-w-xs space-y-3">
            <div className="flex items-center justify-between px-4 py-3 bg-green-400/10 border border-green-400/20 rounded-xl">
              <span className="text-sm font-semibold text-green-400">Sent</span>
              <span className="text-xl font-bold text-green-400">{result.sent}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-red-400/10 border border-red-400/20 rounded-xl">
              <span className="text-sm font-semibold text-red-400">Failed</span>
              <span className="text-xl font-bold text-red-400">{result.failed}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="text-sm font-semibold text-white/40">No email</span>
              <span className="text-xl font-bold text-white/40">{result.skipped}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: "#F97316", ...H }}
          >
            Done
          </button>
        </div>
      )}

      {/* Bottom action bar */}
      {step !== "result" && (
        <div className="shrink-0 border-t border-white/[0.07] px-4 py-4 flex items-center gap-3">
          {step !== "select" && (
            <button
              onClick={() => setStep(step === "compose" ? "select" : "compose")}
              className="px-4 py-3 rounded-xl text-sm font-semibold text-white/60 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
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
              style={{ backgroundColor: "#F97316", ...H }}
            >
              Compose Message ({selected.size} leads) →
            </button>
          )}

          {step === "compose" && (
            <button
              onClick={() => setStep("preview")}
              disabled={!subject.trim() || !body.trim() || !fromName.trim()}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-30 transition-opacity"
              style={{ backgroundColor: "#F97316", ...H }}
            >
              Preview →
            </button>
          )}

          {step === "preview" && (
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
              style={{ backgroundColor: "#F97316", ...H }}
            >
              <Send size={14} />
              {sending ? "Sending…" : `Send to ${selected.size} leads`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
