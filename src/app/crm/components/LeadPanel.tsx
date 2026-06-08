"use client";

import { useState, useRef, useEffect } from "react";
import {
  X, Phone, Mail, Globe, MapPin, ExternalLink, Copy, Check,
  StickyNote, Send, Star, Link, Flame, Zap,
  PhoneCall, PhoneMissed, PhoneOff, ThumbsUp, ThumbsDown,
  CalendarClock, Activity, Lock, UserCheck, Info,
  ChevronDown, ChevronRight, MessageSquare, Repeat, FileText,
} from "lucide-react";
import ActivityTimeline from "./ActivityTimeline";
import EmailComposer from "./EmailComposer";
import ProposalSection from "./ProposalSection";
import { buildCallScript, buildObjections, callTimingFor, suggestCadence } from "@/lib/crm/playbook";
import {
  engagementSignalsFromActivities, scoreWithEngagement, type EngagementSignals,
} from "@/lib/crm/intel";
import { readBookingOverride, resolveBookingUrl } from "@/lib/booking";

interface Lead {
  id: string; name: string; contact_name: string; category: string; phone: string; email: string;
  email_owned: string; website: string; socials: string; best_contact: string;
  address: string; city: string; county: string; tier: string;
  tier_reason: string; builder: string; industry_fit: string;
  outreach_score: number; pitch: string;
  previewUrl?: string | null;
  demoStatus?: string | null;
  demoFlags?: string[] | null;
  demoCategory?: string | null;
  claimByDate?: string | null;
  thumbnailUrl?: string | null;
}

interface LeadState {
  status: "new" | "contacted" | "follow_up" | "not_interested" | "won";
  stage: string;
  notes: string;
  lastContacted?: string;
  submittedAt?: string;
  callCount?: number;
  lastOutcome?: string;
  followUpDate?: string;
}

interface Submission {
  id: string; leadId: string; leadName: string; status: string;
  commissionAmount?: number; commissionPaid?: boolean;
}

const OUTCOMES = [
  { key: "no_answer", label: "No Answer", icon: PhoneMissed, color: "text-zinc-400", bg: "bg-zinc-400/10", border: "border-zinc-400/20", stage: "called" },
  { key: "voicemail", label: "Left Voicemail", icon: PhoneOff, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", stage: "voicemail" },
  { key: "call_back", label: "Call Back Later", icon: CalendarClock, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", stage: "called" },
  { key: "not_interested", label: "Not Interested", icon: ThumbsDown, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", stage: "lost" },
  { key: "interested", label: "Interested!", icon: ThumbsUp, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", stage: "interested" },
];

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }}
      className="p-1.5 rounded-md text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors">
      {ok ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
    </button>
  );
}

function SubmitModal({ lead, state, onClose, onSubmitted }: {
  lead: Lead; state: LeadState; onClose: () => void; onSubmitted: () => void;
}) {
  const [repNotes, setRepNotes] = useState(state.notes ?? "");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const H = { fontFamily: "var(--font-heading)" };

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const res = await fetch("/api/crm/submit", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: lead.id, leadName: lead.name, leadCity: lead.city,
        leadPhone: lead.phone, leadEmail: lead.email, leadWebsite: lead.website,
        leadTier: lead.tier, pitch: lead.pitch, repNotes, estimatedBudget: budget }),
    });
    if (res.ok) { onSubmitted(); onClose(); }
    else { const d = await res.json(); setError(d.error ?? "Failed"); setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-[#1C1C1F] border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white" style={H}>🔥 Push to Duke</h2>
            <p className="text-sm text-white/40 mt-0.5" style={H}>{lead.name} — {lead.city}</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="bg-[#111113] rounded-xl p-4 space-y-2">
            {lead.phone && <p className="text-xs text-white/60 flex items-center gap-2" style={H}><Phone size={11} className="text-[#F97316]/60" />{lead.phone}</p>}
            {lead.email && <p className="text-xs text-white/60 flex items-center gap-2" style={H}><Mail size={11} className="text-[#F97316]/60" />{lead.email}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2" style={H}>What do they need? <span className="text-[#F97316]">*</span></label>
            <textarea value={repNotes} onChange={(e) => setRepNotes(e.target.value)} required rows={4}
              placeholder="Tell Duke exactly what happened and what this business needs. Budget, timeline, what they said — everything."
              className="w-full px-4 py-3 rounded-xl bg-[#111113] border border-white/10 text-sm text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#F97316]/50 transition-colors"
              style={H} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2" style={H}>Estimated Budget</label>
            <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. $2,000 — $4,000"
              className="w-full px-4 py-3 rounded-xl bg-[#111113] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 transition-colors"
              style={H} />
          </div>
          {error && <p className="text-sm text-red-400" style={H}>{error}</p>}
          <button type="submit" disabled={loading || !repNotes}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ backgroundColor: "#F97316", ...H }}>
            <Send size={14} />{loading ? "Sending…" : "Send to Duke"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LeadPanel({ lead, state, submission, repName, onClose, onUpdate, onSubmitted }: {
  lead: Lead; state: LeadState; submission?: Submission; repName: string;
  onClose: () => void; onUpdate: (patch: Partial<LeadState>) => void; onSubmitted: () => void;
}) {
  const [notes, setNotes] = useState(state.notes ?? "");
  const [showSubmit, setShowSubmit] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [activityKey, setActivityKey] = useState(0);
  const [claim, setClaim] = useState<{ userId: string; repName: string } | null | undefined>(undefined);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [claimLoading, setClaimLoading] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [showScorePopover, setShowScorePopover] = useState(false);
  const [showScript, setShowScript] = useState(false);
  const [showObjections, setShowObjections] = useState(false);
  const [showCadence, setShowCadence] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const [calOverride, setCalOverride] = useState("");
  const [activities, setActivities] = useState<{ type: string; outcome?: string }[]>([]);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevNotes = useRef(state.notes ?? "");
  const H = { fontFamily: "var(--font-heading)" };

  // eslint-disable-next-line react-hooks/set-state-in-effect -- sync notes field when the selected lead changes
  useEffect(() => { setNotes(state.notes ?? ""); prevNotes.current = state.notes ?? ""; }, [state.notes]);

  // A rep can paste a personal scheduling link (shared per-browser via lib/booking);
  // read it client-side so it overrides the on-site booking page when present.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is client-only; read once on mount
    setCalOverride(readBookingOverride());
  }, []);

  const postActivity = (body: Record<string, unknown>) => {
    fetch("/api/crm/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: lead.id, ...body }),
    }).then(() => setActivityKey((k) => k + 1)).catch(() => {});
  };

  // Fetch claim status on mount
  useEffect(() => {
    fetch(`/api/crm/claim?leadId=${encodeURIComponent(lead.id)}`)
      .then((r) => r.json())
      .then((d) => setClaim(d.claim ?? null))
      .catch(() => setClaim(null));
    // Get current user ID from a whoami-like endpoint via crm/state
    fetch("/api/crm/state")
      .then((r) => {
        const uid = r.headers.get("x-user-id");
        if (uid) setCurrentUserId(uid);
      })
      .catch(() => {});
    // Fallback: read from cookie via document if available
    const match = document.cookie.match(/crm_user_id=([^;]+)/);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fallback read of user id from cookie on mount
    if (match) setCurrentUserId(decodeURIComponent(match[1]));
  }, [lead.id]);

  // Pull this lead's activity so the score can reflect real engagement (opens,
  // clicks, replies, call outcomes), not just the static scraper number.
  // Re-runs when a new activity is logged (activityKey bumps).
  useEffect(() => {
    fetch(`/api/crm/activity?leadId=${encodeURIComponent(lead.id)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((rows) => setActivities(Array.isArray(rows) ? rows : []))
      .catch(() => setActivities([]));
  }, [lead.id, activityKey]);

  async function handleClaim() {
    setClaimLoading(true);
    try {
      const res = await fetch("/api/crm/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id, action: "claim" }),
      });
      const d = await res.json();
      if (res.ok) setClaim(d.claim);
      else alert(d.error ?? "Failed to claim");
    } finally { setClaimLoading(false); }
  }

  async function handleUnclaim() {
    setClaimLoading(true);
    try {
      const res = await fetch("/api/crm/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id, action: "unclaim" }),
      });
      if (res.ok) setClaim(null);
    } finally { setClaimLoading(false); }
  }

  const handleNotes = (v: string) => {
    setNotes(v);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => onUpdate({ notes: v }), 500);
  };

  const handleNotesBlur = () => {
    const trimmed = notes.trim();
    const prev = prevNotes.current.trim();
    // Only log if text changed meaningfully (more than 5 chars different)
    if (trimmed && Math.abs(trimmed.length - prev.length) > 5) {
      prevNotes.current = trimmed;
      postActivity({ type: "note", note: trimmed });
    }
  };

  const logOutcome = (outcome: typeof OUTCOMES[0]) => {
    const now = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const newCount = (state.callCount ?? 0) + 1;
    const newStatus = outcome.key === "not_interested" ? "not_interested" :
      outcome.key === "interested" ? "follow_up" :
      outcome.key === "call_back" ? "follow_up" : "contacted";
    onUpdate({ status: newStatus, stage: outcome.stage, lastContacted: now, callCount: newCount, lastOutcome: outcome.key });
    postActivity({ type: "call", outcome: outcome.key });
    if (outcome.key === "call_back") setShowFollowUp(true);
    // Auto-claim when logging an outcome if not already claimed
    if (!claim) {
      fetch("/api/crm/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: lead.id, action: "claim" }),
      }).then((r) => r.json()).then((d) => { if (d.claim) setClaim(d.claim); }).catch(() => {});
    }
  };

  const setFollowUpDate = (dateStr: string) => {
    onUpdate({ followUpDate: dateStr });
    setShowFollowUp(false);
  };

  const handleSubmitted = () => {
    postActivity({ type: "submitted" });
    onSubmitted();
  };

  // The outreach API already logs the email and schedules a follow-up server
  // side; mirror that in local state so the panel updates without a refetch.
  const handleEmailSent = () => {
    const nowDisplay = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const fu = new Date(); fu.setDate(fu.getDate() + 3);
    const fuISO = fu.toISOString().slice(0, 10);
    const terminal = state.status === "won" || state.status === "not_interested";
    onUpdate(terminal
      ? { lastContacted: nowDisplay }
      : { status: "contacted", lastContacted: nowDisplay, followUpDate: fuISO });
    setActivityKey((k) => k + 1);
  };

  const needsReview = lead.demoStatus === "needs_review";
  const tier = lead.tier;
  const todayISO = new Date().toISOString().slice(0, 10);
  const tomorrowISO = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); })();
  const in3DaysISO = (() => { const d = new Date(); d.setDate(d.getDate() + 3); return d.toISOString().slice(0, 10); })();
  const websiteHost = lead.website ? lead.website.replace(/^https?:\/\//, "").split("/")[0] : null;
  const isSubmitted = !!state.submittedAt || !!submission;

  // Build the full pitch to display
  const fullPitch = lead.pitch || `Hi, I'm reaching out to ${lead.name} in ${lead.city} — do you have 2 minutes to talk about your online presence?`;

  // Full multi-block call script + objection bank, tailored to this lead.
  const engagement: EngagementSignals = engagementSignalsFromActivities(activities);
  const scored = scoreWithEngagement(lead.outreach_score, engagement);

  const playbookLead = { name: lead.name, city: lead.city, category: lead.category, website: lead.website, builder: lead.builder, tier: lead.tier };
  const callScript = buildCallScript(playbookLead, repName);
  const objections = buildObjections(playbookLead);

  // Is right now a good moment to dial? All leads are Sonoma County (Pacific), so
  // judge against the lead's local hour/weekday — works even if the rep's browser
  // is in another timezone.
  const callTiming = (() => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles", hour: "numeric", hour12: false, weekday: "short",
    }).formatToParts(new Date());
    let hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
    if (hour === 24) hour = 0; // some engines emit 24 for midnight with hour12:false
    const wdMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const weekday = wdMap[parts.find((p) => p.type === "weekday")?.value ?? "Mon"] ?? 1;
    return callTimingFor(lead.category, hour, weekday);
  })();

  // Follow-up cadence (day 0/3/7/14). We don't track an exact per-email count, so
  // approximate: nothing sent yet for an untouched lead, otherwise treat the
  // opener as done and recommend the next bump. `daysSinceLast` is parsed from the
  // last-contacted display date; the system-scheduled followUpDate, when present,
  // gives the more accurate "when".
  const daysSinceLast = (() => {
    if (!state.lastContacted) return null;
    const t = Date.parse(state.lastContacted);
    if (!Number.isFinite(t)) return null;
    return Math.max(0, Math.floor((Date.parse(todayISO) - t) / 86_400_000));
  })();
  const touchesSent = state.status === "new" && !state.lastContacted ? 0 : 1;
  const cadence = suggestCadence(playbookLead, touchesSent, daysSinceLast);
  const cadenceDueInDays = (() => {
    if (state.followUpDate) {
      const f = Date.parse(state.followUpDate);
      if (Number.isFinite(f)) return Math.max(0, Math.ceil((f - Date.parse(todayISO)) / 86_400_000));
    }
    return cadence.daysUntilDue;
  })();
  const cadenceDueText = cadenceDueInDays <= 0 ? "due now" : `in ${cadenceDueInDays} day${cadenceDueInDays === 1 ? "" : "s"}`;

  // Canonical booking link: a rep's personal override if set, otherwise the
  // on-site /schedule funnel made absolute so it works in email/SMS.
  const bookingUrl = resolveBookingUrl(calOverride);

  return (
    <>
      {showSubmit && <SubmitModal lead={lead} state={state} onClose={() => setShowSubmit(false)} onSubmitted={handleSubmitted} />}
      {showEmail && (
        <EmailComposer
          lead={{ id: lead.id, name: lead.name, contactName: lead.contact_name, email: lead.email, city: lead.city, previewUrl: lead.previewUrl ?? undefined, claimByDate: lead.claimByDate ?? undefined }}
          repName={repName}
          onClose={() => setShowEmail(false)}
          onSent={handleEmailSent}
        />
      )}

      <div className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end" onClick={onClose}>
        <div className="absolute inset-0 bg-black/50 sm:bg-black/30 backdrop-blur-sm sm:backdrop-blur-none" />
        <div className="relative bg-[#111113] border-t sm:border-t-0 sm:border-l border-white/[0.07] w-full sm:w-[480px] h-[92vh] sm:h-full flex flex-col shadow-2xl overflow-hidden rounded-t-2xl sm:rounded-none"
          onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-start justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
            <div className="min-w-0 pr-4">
              <h2 className="text-base font-bold text-white leading-tight" style={H}>{lead.name}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-white/40 flex items-center gap-1" style={H}><MapPin size={10} />{lead.city}{lead.county ? `, ${lead.county}` : ""}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  tier === "A" ? "text-orange-400 bg-orange-400/10 border-orange-400/20" :
                  tier === "B" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
                  "text-zinc-500 bg-zinc-500/10 border-zinc-500/20"
                }`} style={H}>
                  {tier === "A" ? <><Flame size={9} className="inline mr-1" />No Website</> :
                   tier === "B" ? <><Zap size={9} className="inline mr-1" />DIY Site</> :
                   <><Globe size={9} className="inline mr-1" />Has Site</>}
                </span>
                {state.callCount ? (
                  <span className="text-xs text-white/30 flex items-center gap-1" style={H}><PhoneCall size={9} />{state.callCount} call{state.callCount !== 1 ? "s" : ""}</span>
                ) : null}
                <div className="relative">
                  <button onClick={() => setShowScorePopover((v) => !v)}
                    className="text-white/25 hover:text-white/60 transition-colors flex items-center gap-1"
                    style={H}>
                    <Info size={12} />
                    <span className="text-xs">{scored.score}</span>
                    {scored.boost !== 0 && (
                      <span className={`text-[10px] font-semibold ${scored.boost > 0 ? "text-green-400" : "text-red-400"}`}>
                        {scored.boost > 0 ? `+${scored.boost}` : scored.boost}
                      </span>
                    )}
                  </button>
                  {showScorePopover && (
                    <div className="absolute left-0 top-6 z-10 w-64 bg-[#1C1C1F] border border-white/10 rounded-xl p-3 shadow-xl text-xs text-white/70 space-y-1.5" style={H}>
                      <p className="font-bold text-white/90">Why this score?</p>
                      {lead.tier_reason && <p>Tier {lead.tier}: {lead.tier_reason}</p>}
                      {lead.industry_fit && <p>Industry fit: <span className="text-green-400">{lead.industry_fit}</span></p>}
                      <p>Base outreach score: <span className="text-[#F97316] font-semibold">{scored.base}/100</span></p>
                      {scored.boost !== 0 ? (
                        <>
                          <p>Engagement: <span className={`font-semibold ${scored.boost > 0 ? "text-green-400" : "text-red-400"}`}>{scored.boost > 0 ? `+${scored.boost}` : scored.boost}</span></p>
                          <div className="text-white/45 leading-relaxed">
                            {engagement.replied && <span className="block">• Replied to outreach</span>}
                            {engagement.interested && <span className="block">• Marked interested on a call</span>}
                            {engagement.clicks > 0 && <span className="block">• Clicked {engagement.clicks} email link{engagement.clicks !== 1 ? "s" : ""}</span>}
                            {engagement.opens > 0 && <span className="block">• Opened {engagement.opens} email{engagement.opens !== 1 ? "s" : ""}</span>}
                            {engagement.notInterested && <span className="block">• Marked not interested</span>}
                          </div>
                          <p className="border-t border-white/10 pt-1.5">Adjusted score: <span className="text-[#F97316] font-semibold">{scored.score}/100</span></p>
                        </>
                      ) : (
                        <p className="text-white/45">No engagement logged yet — score is the base.</p>
                      )}
                      <button onClick={() => setShowScorePopover(false)} className="text-white/30 hover:text-white/60 pt-1">✕ close</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors shrink-0"><X size={18} /></button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">

            {/* CALL NOW */}
            {lead.phone && (
              <div className="px-5 py-4 border-b border-white/[0.06] bg-[#F97316]/5">
                <a href={`tel:${lead.phone}`}
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-base font-bold text-white transition-all active:scale-95"
                  style={{ backgroundColor: "#F97316", ...H }}>
                  <Phone size={18} />{lead.phone}
                </a>
                {state.lastContacted && (
                  <p className="text-xs text-white/30 text-center mt-2" style={H}>Last contacted: {state.lastContacted}</p>
                )}
                <div className="mt-2 flex flex-col items-center gap-1">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    callTiming.status === "good" ? "text-green-400 bg-green-400/10 border-green-400/20" :
                    callTiming.status === "ok" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
                    "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"
                  }`} style={H}>
                    {callTiming.status === "good" ? "🟢" : callTiming.status === "ok" ? "🟡" : "🔴"} {callTiming.label}
                  </span>
                  <p className="text-xs text-white/40 text-center flex items-center justify-center gap-1.5" style={H}>
                    <CalendarClock size={11} className="text-[#F97316]/50 shrink-0" />
                    <span>{callTiming.detail}</span>
                  </p>
                </div>
              </div>
            )}

            {/* SEND EMAIL */}
            {lead.email && (
              <div className="px-5 py-4 border-b border-white/[0.06]">
                {needsReview ? (
                  <div className="flex items-start gap-3 w-full py-3.5 px-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-300"
                    style={H}>
                    <span className="text-lg leading-none shrink-0">⚠️</span>
                    <p className="text-sm font-semibold leading-snug">Demo needs review before sending — verify the preview first</p>
                  </div>
                ) : (
                  <button onClick={() => setShowEmail(true)}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-bold border border-[#F97316]/30 bg-[#F97316]/10 text-[#F97316] hover:bg-[#F97316]/20 transition-all active:scale-95"
                    style={H}>
                    <Mail size={16} />Send Email
                  </button>
                )}

                {/* Follow-up cadence: recommended next touch + the full plan */}
                {cadence.next ? (
                  <>
                    <button onClick={() => setShowCadence((v) => !v)} className="w-full flex items-center justify-between group mt-3">
                      <span className="text-xs text-white/40 flex items-center gap-1.5 group-hover:text-white/60 transition-colors" style={H}>
                        <Repeat size={11} className="text-[#F97316]/50 shrink-0" />
                        Next: <span className="text-white/70 font-semibold">{cadence.next.label}</span>
                        <span className="text-white/30">· {cadenceDueText}</span>
                      </span>
                      {showCadence ? <ChevronDown size={13} className="text-white/30" /> : <ChevronRight size={13} className="text-white/30" />}
                    </button>
                    {showCadence && (
                      <div className="mt-2.5 space-y-1.5">
                        {cadence.cadence.map((t) => {
                          const isNext = cadence.next?.step === t.step;
                          return (
                            <div key={t.step} className={`rounded-xl border px-3 py-2 ${isNext ? "border-[#F97316]/40 bg-[#F97316]/[0.07]" : "border-white/[0.06] bg-[#1C1C1F]"}`}>
                              <p className="text-xs font-semibold text-white/80 flex items-center gap-2" style={H}>
                                <span className="text-white/40">Day {t.day}</span>{t.label}
                                {isNext && <span className="text-[10px] text-[#F97316] uppercase tracking-wider">recommended</span>}
                              </p>
                              <p className="text-xs text-white/35 mt-0.5" style={H}>{t.purpose}</p>
                            </div>
                          );
                        })}
                        <p className="text-[11px] text-white/20 leading-relaxed pt-0.5" style={H}>Timing is a guide — open Send Email and pick the matching template.</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-white/30 mt-3 flex items-center gap-1.5" style={H}>
                    <Repeat size={11} className="shrink-0" />Full 4-touch cadence sent — time to move on or call.
                  </p>
                )}
              </div>
            )}

            {/* Claim status */}
            <div className="px-5 py-3 border-b border-white/[0.06]">
              {claim === undefined ? (
                <div className="h-8 bg-white/5 animate-pulse rounded-xl" />
              ) : claim === null ? (
                <button onClick={handleClaim} disabled={claimLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all disabled:opacity-50"
                  style={H}>
                  <UserCheck size={14} />{claimLoading ? "Claiming…" : "Claim This Lead"}
                </button>
              ) : claim.userId === currentUserId || (!currentUserId) ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold bg-green-500/10 text-green-400 border border-green-500/20" style={H}>
                    <Check size={14} />My Lead
                  </div>
                  <button onClick={handleUnclaim} disabled={claimLoading}
                    className="px-3 py-2.5 rounded-xl text-xs font-semibold text-white/40 bg-white/5 border border-white/10 hover:text-white/70 hover:bg-white/10 transition-all disabled:opacity-50"
                    style={H}>
                    {claimLoading ? "…" : "Unclaim"}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold bg-zinc-500/10 text-zinc-500 border border-zinc-500/20" style={H}>
                  <Lock size={13} />Claimed by {claim.repName}
                </div>
              )}
            </div>

            {/* Quick outcome log */}
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-3" style={H}>Log Outcome</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {OUTCOMES.map((o) => (
                  <button key={o.key} onClick={() => logOutcome(o)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${o.color} ${o.bg} ${o.border} hover:opacity-80`}
                    style={H}>
                    <o.icon size={13} className="shrink-0" />{o.label}
                  </button>
                ))}
                {!isSubmitted && (
                  <button onClick={() => setShowSubmit(true)}
                    className="col-span-2 sm:col-span-3 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-bold text-white border border-[#F97316]/30 bg-[#F97316]/10 hover:bg-[#F97316]/20 transition-all"
                    style={H}>
                    <Send size={13} />They&apos;re In — Push to Duke
                  </button>
                )}
                {isSubmitted && (
                  <div className={`col-span-2 sm:col-span-3 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold border ${
                    submission?.status === "accepted" ? "text-green-400 bg-green-400/10 border-green-400/20" :
                    submission?.status === "rejected" ? "text-red-400 bg-red-400/10 border-red-400/20" :
                    "text-[#F97316] bg-[#F97316]/10 border-[#F97316]/20"
                  }`} style={H}>
                    {submission?.status === "accepted" ? `✓ Accepted${submission?.commissionAmount ? ` — $${submission.commissionAmount.toFixed(2)} commission` : ""}` :
                     submission?.status === "rejected" ? "✕ Passed — try a different angle" :
                     "⏳ Submitted — waiting on Duke"}
                  </div>
                )}
              </div>
            </div>

            {/* Follow-up date picker (shown after Call Back) */}
            {showFollowUp && (
              <div className="px-5 py-4 border-b border-white/[0.06] bg-purple-500/5">
                <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3" style={H}>📅 Follow up on:</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setFollowUpDate(todayISO)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
                    style={H}>Today</button>
                  <button onClick={() => setFollowUpDate(tomorrowISO)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
                    style={H}>Tomorrow</button>
                  <button onClick={() => setFollowUpDate(in3DaysISO)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
                    style={H}>In 3 days</button>
                  <input type="date" defaultValue={todayISO}
                    onChange={(e) => { if (e.target.value) setFollowUpDate(e.target.value); }}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 focus:outline-none focus:border-purple-400/50 transition-all"
                    style={H} />
                  <button onClick={() => setShowFollowUp(false)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 text-white/30 border border-white/10 hover:text-white/60 transition-all"
                    style={H}>Skip</button>
                </div>
                {state.followUpDate && (
                  <p className="text-xs text-purple-300/60 mt-2" style={H}>Currently set: {state.followUpDate}</p>
                )}
              </div>
            )}

            {/* Script */}
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-3" style={H}>Your Opening Line</p>
              <div className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] p-4 relative">
                <p className="text-sm text-white/85 leading-relaxed italic" style={H}>&ldquo;{fullPitch}&rdquo;</p>
                <button onClick={() => navigator.clipboard.writeText(fullPitch)}
                  className="absolute top-3 right-3 p-1.5 rounded-md text-white/20 hover:text-white/60 hover:bg-white/5 transition-colors">
                  <Copy size={12} />
                </button>
              </div>
              {lead.tier_reason && (
                <p className="text-xs text-white/25 mt-2 px-1 leading-relaxed" style={H}>{lead.tier_reason}</p>
              )}
            </div>

            {/* Full call script (collapsible) */}
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <button onClick={() => setShowScript((v) => !v)} className="w-full flex items-center justify-between group">
                <span className="text-xs font-semibold text-white/35 uppercase tracking-wider flex items-center gap-1.5 group-hover:text-white/55 transition-colors" style={H}>
                  <Phone size={11} />Full Call Script
                </span>
                {showScript ? <ChevronDown size={14} className="text-white/30" /> : <ChevronRight size={14} className="text-white/30" />}
              </button>
              {showScript && (
                <div className="mt-3 space-y-3">
                  {callScript.map((block) => (
                    <div key={block.heading}>
                      <p className="text-[11px] font-semibold text-[#F97316]/80 uppercase tracking-wider mb-1.5" style={H}>{block.heading}</p>
                      <div className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] p-3 relative">
                        <div className="space-y-1.5 pr-7">
                          {block.lines.map((line, i) => (
                            <p key={i} className="text-sm text-white/80 leading-relaxed" style={H}>{line}</p>
                          ))}
                        </div>
                        <button onClick={() => navigator.clipboard.writeText(block.lines.join("\n"))}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-md text-white/20 hover:text-white/60 hover:bg-white/5 transition-colors">
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Objection handling (collapsible) */}
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <button onClick={() => setShowObjections((v) => !v)} className="w-full flex items-center justify-between group">
                <span className="text-xs font-semibold text-white/35 uppercase tracking-wider flex items-center gap-1.5 group-hover:text-white/55 transition-colors" style={H}>
                  <MessageSquare size={11} />Objection Handling
                </span>
                {showObjections ? <ChevronDown size={14} className="text-white/30" /> : <ChevronRight size={14} className="text-white/30" />}
              </button>
              {showObjections && (
                <div className="mt-3 space-y-2">
                  {objections.map((o) => (
                    <div key={o.trigger} className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] p-3">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-xs font-semibold text-white/80 flex-1" style={H}>&ldquo;{o.trigger}&rdquo;</p>
                        <CopyBtn text={o.response} />
                      </div>
                      <p className="text-sm text-white/55 leading-relaxed pr-1" style={H}>{o.response}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Proposal / quote generator (collapsible) */}
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <button onClick={() => setShowProposal((v) => !v)} className="w-full flex items-center justify-between group">
                <span className="text-xs font-semibold text-white/35 uppercase tracking-wider flex items-center gap-1.5 group-hover:text-white/55 transition-colors" style={H}>
                  <FileText size={11} />Proposal / Quote
                </span>
                {showProposal ? <ChevronDown size={14} className="text-white/30" /> : <ChevronRight size={14} className="text-white/30" />}
              </button>
              {showProposal && (
                <div className="mt-3">
                  <ProposalSection
                    lead={{ name: lead.name, city: lead.city, contact_name: lead.contact_name, email: lead.email, tier: lead.tier }}
                    repName={repName}
                  />
                </div>
              )}
            </div>

            {/* Contact info */}
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-3" style={H}>Contact Info</p>
              <div className="space-y-2.5">
                {lead.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-[#F97316]/60 shrink-0" />
                    <a href={`tel:${lead.phone}`} className="text-sm text-white/75 hover:text-[#F97316] transition-colors flex-1" style={H}>{lead.phone}</a>
                    <CopyBtn text={lead.phone} />
                  </div>
                )}
                {lead.email && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Mail size={13} className="text-[#F97316]/60 shrink-0" />
                    <a href={`mailto:${lead.email}`} className="text-sm text-white/75 hover:text-[#F97316] transition-colors flex-1 min-w-0 truncate" style={H}>{lead.email}</a>
                    {lead.email_owned === "1" && <span className="text-xs text-green-400/70 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full shrink-0" style={H}>Business</span>}
                    <CopyBtn text={lead.email} />
                  </div>
                )}
                {lead.website && (
                  <div className="flex items-center gap-2">
                    <ExternalLink size={13} className="text-[#F97316]/60 shrink-0" />
                    <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-sm text-white/75 hover:text-[#F97316] transition-colors flex-1 truncate" style={H}>
                      {websiteHost}
                      {lead.builder && <span className="ml-2 text-xs text-yellow-400/60">({lead.builder})</span>}
                    </a>
                  </div>
                )}
                {lead.previewUrl && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Globe size={13} className="text-violet-400/70 shrink-0" />
                      <a href={lead.previewUrl} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-violet-300 hover:text-violet-200 transition-colors flex-1 truncate" style={H}>
                        Preview site we built
                      </a>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 border ${
                        needsReview
                          ? "text-amber-300/80 bg-amber-400/10 border-amber-400/20"
                          : "text-violet-300/60 bg-violet-400/10 border-violet-400/20"
                      }`} style={H}>{needsReview ? "Needs Review" : "Demo"}</span>
                      <CopyBtn text={lead.previewUrl} />
                    </div>
                    {lead.thumbnailUrl && (
                      <img src={lead.thumbnailUrl} alt="Demo preview" className="w-full rounded-xl mt-2 border border-violet-400/10" loading="lazy" />
                    )}
                    {lead.claimByDate && (
                      <p className="text-[11px] text-violet-300/60 mt-1" style={H}>Offer expires {lead.claimByDate}</p>
                    )}
                  </div>
                )}
                {lead.address && (
                  <div className="flex items-start gap-2">
                    <MapPin size={13} className="text-white/30 shrink-0 mt-0.5" />
                    <span className="text-xs text-white/40 flex-1" style={H}>{lead.address}, {lead.city} {lead.county}</span>
                  </div>
                )}
                {lead.socials && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {lead.socials.split("|").filter(Boolean).map((url, i) => {
                      const label = url.includes("facebook") ? "Facebook" : url.includes("instagram") ? "Instagram" :
                        url.includes("twitter") || url.includes("x.com") ? "X / Twitter" : url.includes("linkedin") ? "LinkedIn" : "Social";
                      return (
                        <a key={i} href={url.startsWith("http") ? url : `https://${url}`} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 text-white/50 border border-white/10 hover:text-white hover:bg-white/10 text-xs transition-colors"
                          style={H}><Link size={10} />{label}</a>
                      );
                    })}
                  </div>
                )}
                {lead.best_contact && (
                  <p className="text-xs text-[#F97316]/60 flex items-center gap-1.5 pt-1" style={H}>
                    <Star size={10} />Best way to reach them: <strong>{lead.best_contact}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Schedule a call — share the booking link via email/text */}
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-3 flex items-center gap-1.5" style={H}>
                <CalendarClock size={11} />Schedule a Call
              </p>
              <div className="flex gap-2 flex-wrap">
                {lead.email && (
                  <a href={`mailto:${lead.email}?subject=${encodeURIComponent(`Schedule a quick call — ${lead.name}`)}&body=${encodeURIComponent(`Hi, I'd love to find a time to connect! You can book a free 15-minute call here: ${bookingUrl}`)}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20 hover:bg-violet-500/20 transition-all" style={H}>
                    <Mail size={11} />Send via Email
                  </a>
                )}
                {lead.phone && (
                  <a href={`sms:${lead.phone}?&body=${encodeURIComponent(`Hi! Book a free 15-minute call: ${bookingUrl}`)}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20 hover:bg-violet-500/20 transition-all" style={H}>
                    <Phone size={11} />Send via Text
                  </a>
                )}
                <button onClick={() => navigator.clipboard.writeText(bookingUrl)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 text-white/50 border border-white/10 hover:text-white/70 hover:bg-white/10 transition-all" style={H}>
                  <Copy size={11} />Copy Link
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-3 flex items-center gap-1.5" style={H}>
                <StickyNote size={11} />Your Notes
              </p>
              <textarea value={notes} onChange={(e) => handleNotes(e.target.value)} onBlur={handleNotesBlur} rows={5}
                placeholder="What did they say? Are they coming back? What's their situation?"
                className="w-full bg-[#1C1C1F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 placeholder-white/20 resize-none focus:outline-none focus:border-[#F97316]/40 transition-colors"
                style={H} />
              <p className="text-xs text-white/20 mt-1.5" style={H}>Auto-saved as you type</p>
            </div>

            {/* Activity Timeline */}
            <div className="px-5 py-4">
              <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-3 flex items-center gap-1.5" style={H}>
                <Activity size={11} />Activity
              </p>
              <ActivityTimeline key={activityKey} leadId={lead.id} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
