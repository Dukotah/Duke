"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Phone, Globe, MapPin, ChevronLeft, ChevronRight, X,
  LogOut, ExternalLink, Tag, StickyNote, CheckCircle2, Clock,
  XCircle, Trophy, Inbox, RefreshCw, ChevronDown, Mail, Copy,
  Check, Download, Flame, Star, Zap, TrendingUp, Filter,
  ArrowUpDown, Link, Send, DollarSign, AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Lead {
  id: string; name: string; category: string; alt_categories: string;
  phone: string; email: string; email_owned: string; website: string;
  socials: string; social_platforms: string; best_contact: string;
  address: string; city: string; state: string; zip: string; county: string;
  tier: string; tier_reason: string; builder: string; industry_fit: string;
  outreach_score: number; pitch: string;
}

type Status = "new" | "contacted" | "follow_up" | "not_interested" | "won";

interface LeadState {
  status: Status; notes: string; lastContacted?: string; submittedAt?: string;
}

interface Submission {
  id: string; leadId: string; leadName: string; status: "pending" | "accepted" | "rejected";
  dealValue?: number; commissionAmount?: number; commissionPaid?: boolean;
  submittedAt: string; estimatedBudget: string; repNotes: string;
}

interface LeadsResponse {
  leads: Lead[]; total: number; page: number; limit: number;
  counties: string[]; niches: string[];
  tierCounts: { A: number; B: number; C: number };
}

interface FiltersState {
  q: string; county: string; niche: string; tier: string;
  industryFit: string; bestContact: string; hasEmail: string;
  hotLeads: boolean; sortBy: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES: { value: Status; label: string; color: string; bg: string; border: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { value: "new", label: "New", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", Icon: Inbox },
  { value: "contacted", label: "Contacted", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", Icon: Clock },
  { value: "follow_up", label: "Follow Up", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", Icon: RefreshCw },
  { value: "won", label: "Won", color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", Icon: Trophy },
  { value: "not_interested", label: "Pass", color: "text-zinc-500", bg: "bg-zinc-500/10", border: "border-zinc-500/20", Icon: XCircle },
];
const STATUS_MAP = Object.fromEntries(STATUSES.map((s) => [s.value, s]));

const TIER_CONFIG = {
  A: { label: "No Website", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", Icon: Flame },
  B: { label: "DIY Builder", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", Icon: Zap },
  C: { label: "Has Site", color: "text-zinc-500", bg: "bg-zinc-500/10", border: "border-zinc-500/20", Icon: Globe },
};

const FIT_CONFIG = {
  high: { color: "text-green-400", dot: "bg-green-400" },
  medium: { color: "text-yellow-400", dot: "bg-yellow-400" },
  low: { color: "text-zinc-500", dot: "bg-zinc-500" },
};

const DEFAULT_FILTERS: FiltersState = {
  q: "", county: "", niche: "", tier: "", industryFit: "",
  bestContact: "", hasEmail: "", hotLeads: false, sortBy: "outreach_score",
};

const LIMIT = 50;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-white/50 border border-white/10 hover:text-white hover:bg-white/10 transition-colors"
      style={{ fontFamily: "var(--font-heading)" }}>
      {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
      {copied ? "Copied!" : label}
    </button>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "#F97316" : score >= 50 ? "#FBBF24" : "#6B7280";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color, fontFamily: "var(--font-heading)" }}>{score}</span>
    </div>
  );
}

function StatusPicker({ current, onChange }: { current: Status; onChange: (s: Status) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const s = STATUS_MAP[current];
  return (
    <div className="relative" ref={ref}>
      <button onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border hover:opacity-80 transition-opacity ${s.color} ${s.bg} ${s.border}`}
        style={{ fontFamily: "var(--font-heading)" }}>
        <s.Icon size={10} />{s.label}<ChevronDown size={9} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 bg-[#1C1C1F] border border-white/10 rounded-xl shadow-2xl z-30 overflow-hidden py-1">
          {STATUSES.map((opt) => (
            <button key={opt.value} onClick={(e) => { e.stopPropagation(); onChange(opt.value); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-white/5 transition-colors ${opt.color} ${current === opt.value ? "bg-white/5" : ""}`}
              style={{ fontFamily: "var(--font-heading)" }}>
              <opt.Icon size={12} />{opt.label}
              {current === opt.value && <CheckCircle2 size={10} className="ml-auto" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Select({ value, onChange, children, icon: Icon }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="relative">
      {Icon && <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />}
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className={`${Icon ? "pl-8" : "pl-3"} pr-7 py-2 rounded-lg bg-[#111113] border border-white/10 text-sm text-white focus:outline-none focus:border-[#F97316]/50 transition-colors appearance-none`}
        style={{ fontFamily: "var(--font-heading)" }}>
        {children}
      </select>
    </div>
  );
}

// ─── Submit modal ─────────────────────────────────────────────────────────────

function SubmitModal({ lead, onClose, onSubmitted }: { lead: Lead; onClose: () => void; onSubmitted: () => void }) {
  const [repNotes, setRepNotes] = useState("");
  const [estimatedBudget, setEstimatedBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/crm/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: lead.id, leadName: lead.name, leadCity: lead.city,
        leadPhone: lead.phone, leadEmail: lead.email, leadWebsite: lead.website,
        leadTier: lead.tier, pitch: lead.pitch, repNotes, estimatedBudget,
      }),
    });
    if (res.ok) { onSubmitted(); onClose(); }
    else { const d = await res.json(); setError(d.error ?? "Failed to submit"); setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-[#1C1C1F] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>Push to Builder</h2>
            <p className="text-sm text-white/40 mt-0.5" style={{ fontFamily: "var(--font-heading)" }}>{lead.name} · {lead.city}</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors"><X size={18} /></button>
        </div>

        {/* Lead summary */}
        <div className="bg-[#111113] rounded-xl border border-white/[0.06] p-4 mb-5 space-y-1.5">
          {lead.phone && <p className="text-xs text-white/60 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}><Phone size={11} className="text-[#F97316]/60" />{lead.phone}</p>}
          {lead.email && <p className="text-xs text-white/60 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}><Mail size={11} className="text-[#F97316]/60" />{lead.email}</p>}
          {lead.pitch && <p className="text-xs text-white/40 italic mt-2" style={{ fontFamily: "var(--font-heading)" }}>"{lead.pitch.slice(0, 120)}…"</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              Estimated Budget (optional)
            </label>
            <input value={estimatedBudget} onChange={(e) => setEstimatedBudget(e.target.value)}
              placeholder="e.g. $1,500 – $3,000"
              className="w-full px-4 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 transition-colors"
              style={{ fontFamily: "var(--font-heading)" }} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2" style={{ fontFamily: "var(--font-heading)" }}>
              Your Notes for Duke <span className="text-[#F97316]">*</span>
            </label>
            <textarea value={repNotes} onChange={(e) => setRepNotes(e.target.value)} required rows={4}
              placeholder="What did they say? What do they need? Why is this a good fit?"
              className="w-full px-4 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-sm text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#F97316]/50 transition-colors"
              style={{ fontFamily: "var(--font-heading)" }} />
          </div>
          {error && <p className="text-sm text-red-400" style={{ fontFamily: "var(--font-heading)" }}>{error}</p>}
          <button type="submit" disabled={loading || !repNotes}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
            style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}>
            <Send size={14} />{loading ? "Submitting…" : "Submit to Duke"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Lead row ─────────────────────────────────────────────────────────────────

function LeadRow({ lead, state, onUpdate, onSubmit, submission, index }: {
  lead: Lead; state: LeadState; onUpdate: (p: Partial<LeadState>) => void;
  onSubmit: () => void; submission?: Submission; index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(state.notes ?? "");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setNotes(state.notes ?? ""); }, [state.notes]);

  const handleNotes = (v: string) => {
    setNotes(v);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => onUpdate({ notes: v }), 500);
  };

  const markContacted = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ status: "contacted", lastContacted: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) });
  };

  const tier = TIER_CONFIG[lead.tier as keyof typeof TIER_CONFIG];
  const fit = FIT_CONFIG[lead.industry_fit as keyof typeof FIT_CONFIG];
  const websiteHost = lead.website ? lead.website.replace(/^https?:\/\//, "").replace(/\/$/, "").split("/")[0] : null;
  const isSubmitted = !!state.submittedAt || !!submission;
  const subStatus = submission?.status;

  return (
    <>
      <tr className={`border-b border-white/[0.04] cursor-pointer transition-colors group ${expanded ? "bg-[#1C1C1F]" : index % 2 === 0 ? "hover:bg-white/[0.02]" : "bg-white/[0.01] hover:bg-white/[0.03]"}`}
        onClick={() => setExpanded((v) => !v)}>

        <td className="px-4 py-3">
          <div className="font-semibold text-white text-sm leading-tight truncate max-w-[180px]" style={{ fontFamily: "var(--font-heading)" }}>{lead.name}</div>
          <div className="text-xs text-white/35 mt-0.5 flex items-center gap-1" style={{ fontFamily: "var(--font-heading)" }}>
            <MapPin size={9} />{lead.city || "—"}{lead.county ? ` · ${lead.county}` : ""}
          </div>
        </td>

        <td className="px-3 py-3 hidden sm:table-cell">
          {tier && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${tier.color} ${tier.bg} ${tier.border}`} style={{ fontFamily: "var(--font-heading)" }}>
              <tier.Icon size={9} />{lead.tier}
            </span>
          )}
        </td>

        <td className="px-3 py-3 hidden md:table-cell"><ScoreBar score={lead.outreach_score} /></td>

        <td className="px-3 py-3 hidden lg:table-cell">
          <span className="text-xs text-white/45 truncate max-w-[120px] block" style={{ fontFamily: "var(--font-heading)" }}>
            {lead.category.replace(/_/g, " ") || "—"}
          </span>
        </td>

        <td className="px-3 py-3 hidden lg:table-cell">
          <div className="flex items-center gap-2">
            {lead.email && <span className="text-white/30" title={lead.email}><Mail size={12} /></span>}
            {lead.phone && <span className="text-white/30" title={lead.phone}><Phone size={12} /></span>}
            {fit && <div className={`w-1.5 h-1.5 rounded-full ${fit.dot}`} title={lead.industry_fit} />}
          </div>
        </td>

        <td className="px-3 py-3">
          <div className="flex items-center gap-2">
            <StatusPicker current={state.status} onChange={(s) => onUpdate({ status: s })} />
            {isSubmitted && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                subStatus === "accepted" ? "text-green-400 bg-green-400/10 border-green-400/20" :
                subStatus === "rejected" ? "text-red-400 bg-red-400/10 border-red-400/20" :
                "text-[#F97316] bg-[#F97316]/10 border-[#F97316]/20"
              }`} style={{ fontFamily: "var(--font-heading)" }}>
                {subStatus === "accepted" ? "✓ Accepted" : subStatus === "rejected" ? "✕ Rejected" : "⏳ Sent"}
              </span>
            )}
          </div>
        </td>
      </tr>

      {expanded && (
        <tr className="border-b border-white/[0.04]">
          <td colSpan={6} className="bg-[#161618] px-4 py-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

              {/* Pitch */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>Cold Open Pitch</p>
                  <div className="flex items-center gap-2">
                    {tier && <span className={`text-xs font-medium ${tier.color}`} style={{ fontFamily: "var(--font-heading)" }}>Tier {lead.tier} — {tier.label}</span>}
                    <CopyButton text={lead.pitch} label="Copy pitch" />
                  </div>
                </div>
                {lead.pitch && (
                  <p className="text-sm text-white/80 leading-relaxed bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 italic" style={{ fontFamily: "var(--font-heading)" }}>
                    "{lead.pitch}"
                  </p>
                )}
                {lead.tier_reason && <p className="text-xs text-white/25 mt-2 pl-1" style={{ fontFamily: "var(--font-heading)" }}>{lead.tier_reason}</p>}
              </div>

              {/* Contact */}
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-heading)" }}>Contact</p>
                <div className="flex flex-col gap-2.5">
                  {lead.phone && (
                    <div className="flex items-center gap-2">
                      <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 text-sm text-white/75 hover:text-[#F97316] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                        <Phone size={13} className="text-[#F97316]/60 shrink-0" />{lead.phone}
                      </a>
                      <CopyButton text={lead.phone} label="Copy" />
                    </div>
                  )}
                  {lead.email && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 text-sm text-white/75 hover:text-[#F97316] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                        <Mail size={13} className="text-[#F97316]/60 shrink-0" />{lead.email}
                      </a>
                      {lead.email_owned === "1" && (
                        <span className="text-xs text-green-400/70 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full" style={{ fontFamily: "var(--font-heading)" }}>Business email</span>
                      )}
                      <CopyButton text={lead.email} label="Copy" />
                    </div>
                  )}
                  {lead.website && (
                    <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                      target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 text-sm text-white/75 hover:text-[#F97316] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                      <ExternalLink size={13} className="text-[#F97316]/60 shrink-0" />{websiteHost}
                      {lead.builder && <span className="text-xs text-yellow-400/70 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-full">{lead.builder}</span>}
                    </a>
                  )}
                  {lead.address && (
                    <span className="inline-flex items-start gap-2 text-xs text-white/40" style={{ fontFamily: "var(--font-heading)" }}>
                      <MapPin size={12} className="mt-0.5 shrink-0" />{lead.address}{lead.city ? `, ${lead.city}` : ""}{lead.zip ? ` ${lead.zip}` : ""}
                    </span>
                  )}
                  {lead.socials && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {lead.socials.split("|").filter(Boolean).map((url, i) => {
                        const label = url.includes("facebook") ? "FB" : url.includes("instagram") ? "IG" :
                          url.includes("twitter") || url.includes("x.com") ? "X" : url.includes("linkedin") ? "LI" : null;
                        return (
                          <a key={i} href={url.startsWith("http") ? url : `https://${url}`}
                            target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 text-white/50 border border-white/10 hover:text-white hover:bg-white/10 transition-colors text-xs"
                            style={{ fontFamily: "var(--font-heading)" }}>
                            {label ? <span className="text-[10px] font-bold w-4 text-center">{label}</span> : <Link size={11} />}
                            {url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
                          </a>
                        );
                      })}
                    </div>
                  )}
                  {lead.best_contact && (
                    <span className="text-xs text-[#F97316]/70 flex items-center gap-1.5 mt-1" style={{ fontFamily: "var(--font-heading)" }}>
                      <Star size={10} />Best contact: <strong>{lead.best_contact}</strong>
                    </span>
                  )}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <button onClick={markContacted}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 hover:bg-[#F97316]/20 transition-colors"
                      style={{ fontFamily: "var(--font-heading)" }}>
                      <CheckCircle2 size={12} />Mark Contacted
                    </button>
                    {state.lastContacted && <span className="text-xs text-white/25" style={{ fontFamily: "var(--font-heading)" }}>Last: {state.lastContacted}</span>}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-heading)" }}>Lead Details</p>
                <div className="flex flex-col gap-2">
                  {[["Niche", lead.category.replace(/_/g, " ")], ["County", lead.county], ["Industry Fit", lead.industry_fit], ["Score", `${lead.outreach_score}/100`]].map(
                    ([label, val]) => val && (
                      <div key={label} className="flex items-center justify-between text-xs" style={{ fontFamily: "var(--font-heading)" }}>
                        <span className="text-white/35">{label}</span>
                        <span className="text-white/70 font-medium capitalize">{val}</span>
                      </div>
                    )
                  )}
                </div>

                {/* Push to builder */}
                <div className="mt-5 border-t border-white/[0.06] pt-4">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                    Ready to Close?
                  </p>
                  {isSubmitted ? (
                    <div className={`rounded-xl border px-4 py-3 ${
                      subStatus === "accepted" ? "bg-green-400/5 border-green-400/20" :
                      subStatus === "rejected" ? "bg-red-400/5 border-red-400/20" :
                      "bg-[#F97316]/5 border-[#F97316]/20"
                    }`}>
                      {subStatus === "accepted" && submission?.commissionAmount && (
                        <p className="text-sm font-bold text-green-400 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                          <DollarSign size={14} />Commission: ${submission.commissionAmount.toFixed(2)}
                          {submission.commissionPaid && <span className="text-xs text-green-400/60">(paid)</span>}
                        </p>
                      )}
                      {subStatus === "rejected" && (
                        <p className="text-sm text-red-400/80" style={{ fontFamily: "var(--font-heading)" }}>Submission was passed on — try a different angle.</p>
                      )}
                      {!subStatus && (
                        <p className="text-sm text-[#F97316]/80" style={{ fontFamily: "var(--font-heading)" }}>Submitted — waiting on Duke.</p>
                      )}
                    </div>
                  ) : (
                    <button onClick={(e) => { e.stopPropagation(); onSubmit(); }}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                      style={{ backgroundColor: "#F97316", fontFamily: "var(--font-heading)" }}>
                      <Send size={13} />Push to Builder
                    </button>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div onClick={(e) => e.stopPropagation()}>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ fontFamily: "var(--font-heading)" }}>
                  <StickyNote size={11} />Notes
                </p>
                <textarea value={notes} onChange={(e) => handleNotes(e.target.value)} rows={6}
                  placeholder="Call outcomes, follow-up notes, what they said…"
                  className="w-full bg-[#18181B] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/80 placeholder-white/20 resize-none focus:outline-none focus:border-[#F97316]/40 transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }} />
                <p className="text-xs text-white/20 mt-1" style={{ fontFamily: "var(--font-heading)" }}>Auto-saved</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Earnings bar ─────────────────────────────────────────────────────────────

function EarningsBar({ userId }: { userId: string }) {
  const [subs, setSubs] = useState<Submission[]>([]);

  useEffect(() => {
    fetch("/api/crm/submit").then((r) => r.json()).then(setSubs).catch(() => {});
  }, [userId]);

  const accepted = subs.filter((s) => s.status === "accepted");
  const pending = accepted.filter((s) => !s.commissionPaid).reduce((sum, s) => sum + (s.commissionAmount ?? 0), 0);
  const paid = accepted.filter((s) => s.commissionPaid).reduce((sum, s) => sum + (s.commissionAmount ?? 0), 0);
  const total = subs.length;

  if (total === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {[
        { label: "Submissions", val: String(total), color: "text-white" },
        { label: "Accepted", val: String(accepted.length), color: "text-green-400" },
        { label: "Pending Payout", val: `$${pending.toFixed(2)}`, color: "text-[#F97316]" },
        { label: "Total Earned", val: `$${(pending + paid).toFixed(2)}`, color: "text-green-400" },
      ].map(({ label, val, color }) => (
        <div key={label} className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] px-4 py-3">
          <p className="text-xs text-white/35 uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>{label}</p>
          <p className={`text-xl font-bold mt-1 tabular-nums ${color}`} style={{ fontFamily: "var(--font-heading)" }}>{val}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

function exportCSV(leads: Lead[], states: Record<string, LeadState>) {
  const cols = ["name", "phone", "email", "website", "city", "county", "tier", "outreach_score", "category", "pitch", "status", "notes", "last_contacted", "submitted"];
  const rows = leads.map((l) => {
    const s = states[l.id];
    return [l.name, l.phone, l.email, l.website, l.city, l.county, l.tier, l.outreach_score, l.category, l.pitch,
      s?.status ?? "", s?.notes ?? "", s?.lastContacted ?? "", s?.submittedAt ? "yes" : "no",
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",");
  });
  const blob = new Blob([[cols.join(","), ...rows].join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function CRMDashboard({ userId, userName }: { userId: string; userName: string }) {
  const router = useRouter();

  // Lead data
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State (from server)
  const [states, setStates] = useState<Record<string, LeadState>>({});
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submitLead, setSubmitLead] = useState<Lead | null>(null);

  // Filters
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const setFilter = <K extends keyof FiltersState>(key: K, val: FiltersState[K]) => {
    setFilters((f) => ({ ...f, [key]: val }));
    setPage(1);
  };

  // Load state + submissions once
  useEffect(() => {
    fetch("/api/crm/state").then((r) => r.json()).then(setStates).catch(() => {});
    fetch("/api/crm/submit").then((r) => r.json()).then(setSubs).catch(() => {});
    function setSubs(data: unknown) { if (Array.isArray(data)) setSubmissions(data); }
  }, []);

  // Fetch leads
  const fetchLeads = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const p = new URLSearchParams({
        page: String(page), limit: String(LIMIT), sortBy: filters.sortBy,
        ...(filters.q && { q: filters.q }), ...(filters.county && { county: filters.county }),
        ...(filters.niche && { niche: filters.niche }), ...(filters.tier && { tier: filters.tier }),
        ...(filters.industryFit && { industryFit: filters.industryFit }),
        ...(filters.bestContact && { bestContact: filters.bestContact }),
        ...(filters.hasEmail && { hasEmail: filters.hasEmail }),
        ...(filters.hotLeads && { hotLeads: "1" }),
      });
      const res = await fetch(`/api/crm/leads?${p}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch { setError("Could not load leads."); }
    finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateState = useCallback(async (leadId: string, patch: Partial<LeadState>) => {
    setStates((prev) => ({ ...prev, [leadId]: { ...( prev[leadId] ?? { status: "new", notes: "" }), ...patch } }));
    await fetch("/api/crm/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, ...patch }),
    });
  }, []);

  const getState = (id: string): LeadState => states[id] ?? { status: "new", notes: "" };

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 0;
  const activeFilterCount = Object.entries(filters).filter(([k, v]) => k !== "sortBy" && (typeof v === "boolean" ? v : v !== "")).length;
  const statusCounts = Object.fromEntries(STATUSES.map((s) => [s.value, Object.values(states).filter((e) => e.status === s.value).length])) as Record<Status, number>;

  async function handleLogout() {
    await fetch("/api/crm/logout", { method: "POST" });
    router.push("/crm/login");
  }

  const H = { fontFamily: "var(--font-heading)" };

  return (
    <>
      {submitLead && (
        <SubmitModal lead={submitLead} onClose={() => setSubmitLead(null)}
          onSubmitted={() => { fetch("/api/crm/submit").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setSubmissions(d); }).catch(() => {}); }} />
      )}

      <div className="min-h-screen bg-[#111113]" style={H}>
        {/* Header */}
        <header className="border-b border-white/[0.06] bg-[#111113]/95 backdrop-blur sticky top-0 z-40">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold tracking-tight text-white">Copper Bay<span style={{ color: "#F97316" }}>Tech</span></span>
              <span className="text-xs text-white/20 hidden sm:inline">/ Sales CRM</span>
              <span className="text-xs text-white/40 hidden sm:inline">— {userName}</span>
            </div>
            <div className="flex items-center gap-3">
              {data && (
                <button onClick={() => exportCSV(data.leads, states)}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20">
                  <Download size={12} />Export page
                </button>
              )}
              <button onClick={handleLogout} className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors">
                <LogOut size={13} />Sign out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-4">

          {/* My earnings */}
          <EarningsBar userId={userId} />

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <div className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] px-4 py-3 col-span-2 sm:col-span-1">
              <p className="text-xs text-white/35 uppercase tracking-wider">Total Leads</p>
              <p className="text-3xl font-bold text-white mt-1 tabular-nums">{data ? data.total.toLocaleString() : "—"}</p>
              {data && <p className="text-xs text-orange-400/70 mt-1">🔥 {data.tierCounts.A.toLocaleString()} no-site</p>}
            </div>
            {STATUSES.map((s) => (
              <div key={s.value} className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] px-3 py-3">
                <p className={`text-xs uppercase tracking-wider ${s.color}/70`}>{s.label}</p>
                <p className={`text-xl font-bold mt-1 tabular-nums ${s.color}`}>{statusCounts[s.value] || 0}</p>
              </div>
            ))}
          </div>

          {/* Quick filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: "🔥 Hot Leads", active: filters.hotLeads, action: () => { setFilter("hotLeads", !filters.hotLeads); setFilter("tier", ""); } },
              { label: "📧 Has Email", active: filters.hasEmail === "yes", action: () => setFilter("hasEmail", filters.hasEmail === "yes" ? "" : "yes") },
              { label: "No Website", active: filters.tier === "A", action: () => { setFilter("tier", filters.tier === "A" ? "" : "A"); setFilter("hotLeads", false); } },
              { label: "Call-first", active: filters.bestContact === "phone", action: () => setFilter("bestContact", filters.bestContact === "phone" ? "" : "phone") },
            ].map(({ label, active, action }) => (
              <button key={label} onClick={action}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  active ? "bg-[#F97316]/15 text-[#F97316] border-[#F97316]/30" : "bg-white/[0.04] text-white/50 border-white/10 hover:border-white/20"
                }`}>
                {label}
              </button>
            ))}
            {activeFilterCount > 0 && (
              <button onClick={() => { setFilters(DEFAULT_FILTERS); setPage(1); }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-white/30 hover:text-white/60 border border-white/10 hover:border-white/20 transition-all">
                <X size={10} />Clear {activeFilterCount}
              </button>
            )}
          </div>

          {/* Search + filters */}
          <div className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] px-4 py-3 space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input value={filters.q} onChange={(e) => setFilter("q", e.target.value)}
                  placeholder="Search name, city, niche, email…"
                  className="w-full pl-9 pr-9 py-2.5 rounded-lg bg-[#111113] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 transition-colors" />
                {filters.q && <button onClick={() => setFilter("q", "")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"><X size={13} /></button>}
              </div>
              <button onClick={() => setShowFilters((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm border transition-all ${showFilters || activeFilterCount > 0 ? "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/30" : "bg-[#111113] text-white/50 border-white/10 hover:border-white/20"}`}>
                <Filter size={13} />Filters
                {activeFilterCount > 0 && <span className="bg-[#F97316] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{activeFilterCount}</span>}
              </button>
              <Select value={filters.sortBy} onChange={(v) => setFilter("sortBy", v)} icon={ArrowUpDown}>
                <option value="outreach_score">Best score first</option>
                <option value="score">Raw score</option>
                <option value="name">Name A–Z</option>
                <option value="city">City A–Z</option>
              </Select>
            </div>
            {showFilters && (
              <div className="flex flex-wrap gap-2 pt-1 border-t border-white/[0.06]">
                <Select value={filters.county} onChange={(v) => setFilter("county", v)} icon={MapPin}>
                  <option value="">All Counties</option>
                  {data?.counties.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
                <Select value={filters.niche} onChange={(v) => setFilter("niche", v)} icon={Tag}>
                  <option value="">All Niches</option>
                  {data?.niches.map((n) => <option key={n} value={n}>{n.replace(/_/g, " ")}</option>)}
                </Select>
                <Select value={filters.tier} onChange={(v) => { setFilter("tier", v); setFilter("hotLeads", false); }}>
                  <option value="">All Tiers</option>
                  <option value="A">Tier A — No Website</option>
                  <option value="B">Tier B — DIY Builder</option>
                  <option value="C">Tier C — Has Site</option>
                </Select>
                <Select value={filters.industryFit} onChange={(v) => setFilter("industryFit", v)}>
                  <option value="">Any Fit</option>
                  <option value="high">High fit</option>
                  <option value="medium">Medium fit</option>
                  <option value="low">Low fit</option>
                </Select>
                <Select value={filters.bestContact} onChange={(v) => setFilter("bestContact", v)}>
                  <option value="">Any Contact Method</option>
                  <option value="phone">Phone first</option>
                  <option value="email">Email first</option>
                  <option value="social">Social first</option>
                </Select>
                <Select value={filters.hasEmail} onChange={(v) => setFilter("hasEmail", v)} icon={Mail}>
                  <option value="">Any Email Status</option>
                  <option value="yes">Has email</option>
                  <option value="no">No email</option>
                </Select>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-white/[0.04] flex items-center justify-between">
              <p className="text-xs text-white/35">
                {loading ? "Loading…" : data ? <><span className="text-white font-semibold">{data.total.toLocaleString()}</span> leads · page {page} of {totalPages}</> : null}
              </p>
            </div>

            {error ? (
              <div className="flex items-center justify-center gap-2 py-20 text-red-400/80 text-sm">
                <AlertCircle size={16} />{error}
              </div>
            ) : loading ? (
              <div className="flex flex-col items-center gap-3 py-20">
                <div className="w-6 h-6 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-white/25">Fetching leads…</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      {[["Business", ""], ["Tier", "hidden sm:table-cell"], ["Score", "hidden md:table-cell"], ["Niche", "hidden lg:table-cell"], ["Contact", "hidden lg:table-cell"], ["Status", ""]].map(([label, cls]) => (
                        <th key={label} className={`px-3 py-2.5 text-left text-xs font-semibold text-white/25 uppercase tracking-wider ${cls}`}>{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data?.leads.map((lead, i) => (
                      <LeadRow key={lead.id} lead={lead} state={getState(lead.id)}
                        onUpdate={(patch) => updateState(lead.id, patch)}
                        onSubmit={() => setSubmitLead(lead)}
                        submission={submissions.find((s) => s.leadId === lead.id)}
                        index={i} />
                    ))}
                    {data?.leads.length === 0 && (
                      <tr><td colSpan={6} className="text-center py-20 text-sm text-white/25">No leads match your filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {data && totalPages > 1 && (
              <div className="border-t border-white/[0.04] px-4 py-3 flex items-center justify-between">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                  className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft size={15} />Prev
                </button>
                <div className="flex items-center gap-1">
                  {(() => {
                    const pages: number[] = [];
                    if (totalPages <= 9) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
                    else {
                      const around = new Set([1, 2, page - 1, page, page + 1, totalPages - 1, totalPages].filter((p) => p >= 1 && p <= totalPages));
                      let prev = 0;
                      [...around].sort((a, b) => a - b).forEach((p) => { if (prev && p - prev > 1) pages.push(-prev); pages.push(p); prev = p; });
                    }
                    return pages.map((p, i) =>
                      p < 0 ? <span key={`e${i}`} className="text-white/20 px-1 text-sm">…</span> : (
                        <button key={p} onClick={() => setPage(p)}
                          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${p === page ? "bg-[#F97316] text-white" : "text-white/35 hover:text-white hover:bg-white/5"}`}>
                          {p}
                        </button>
                      )
                    );
                  })()}
                </div>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                  className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors">
                  Next<ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>

          <p className="text-xs text-white/15 text-center pb-4">
            Overture Maps CC-BY 4.0 · {data?.total.toLocaleString()} leads across 6 counties
          </p>
        </main>
      </div>
    </>
  );
}
