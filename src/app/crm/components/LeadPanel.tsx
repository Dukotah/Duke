"use client";

import { useState, useRef, useEffect } from "react";
import {
  X, Phone, Mail, Globe, MapPin, ExternalLink, Copy, Check,
  StickyNote, Send, Star, Link, Flame, Zap,
  PhoneCall, PhoneMissed, PhoneOff, ThumbsUp, ThumbsDown,
  CalendarClock, Activity, Lock, UserCheck, Info,
  ChevronDown, ChevronRight, MessageSquare, Repeat,
  MailOpen, MousePointerClick, AlertTriangle,
} from "lucide-react";
import ActivityTimeline from "./ActivityTimeline";
import EmailComposer from "./EmailComposer";
import { relTime, type LeadAction } from "./RecencyBadges";
import { buildCallScript, buildObjections, callTimingFor, suggestCadence } from "@/lib/crm/playbook";
import { readBookingOverride, resolveBookingUrl } from "@/lib/booking";

interface Lead {
  id: string; name: string; contact_name: string; category: string; phone: string; email: string;
  email_owned: string; website: string; socials: string; best_contact: string;
  address: string; city: string; county: string; tier: string;
  tier_reason: string; builder: string; industry_fit: string;
  outreach_score: number; pitch: string;
  // Deep-enrichment fields (optional — empty on legacy leads).
  email_status?: string; email_role?: string; email_free?: string; all_emails?: string;
  phone_e164?: string; phone_valid?: string; phone_type?: string;
  owner_name?: string; owner_title?: string; owner_email?: string; owner_phone?: string;
  site_quality?: string; digital_presence?: string; site_load_ms?: string;
  lead_score?: number; grade?: string; category_value?: string;
  need_signal?: string; reach_channel?: string; recommended_action?: string; score_why?: string;
  actions?: LeadAction | null;
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
  { key: "voicemail", label: "Left Voicemail", icon: PhoneOff, color: "text-blue-500", bg: "bg-blue-400/10", border: "border-blue-400/20", stage: "voicemail" },
  { key: "call_back", label: "Call Back Later", icon: CalendarClock, color: "text-purple-500", bg: "bg-purple-400/10", border: "border-purple-400/20", stage: "called" },
  { key: "not_interested", label: "Not Interested", icon: ThumbsDown, color: "text-red-500", bg: "bg-red-400/10", border: "border-red-400/20", stage: "lost" },
  { key: "interested", label: "Interested!", icon: ThumbsUp, color: "text-emerald-500", bg: "bg-green-400/10", border: "border-green-400/20", stage: "interested" },
];

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }}
      className="p-1.5 rounded-md text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] hover:bg-[var(--crm-surface-3)] transition-colors">
      {ok ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
    </button>
  );
}

// Email deliverability badge styling, keyed off the enriched MX-verified status.
// Returns null when no status is known (legacy leads) so nothing renders.
function emailStatusBadge(status?: string): { label: string; cls: string } | null {
  switch ((status ?? "").toLowerCase()) {
    case "valid": return { label: "Deliverable", cls: "text-emerald-500 bg-green-400/10 border-green-400/20" };
    case "risky": return { label: "Risky", cls: "text-amber-500 bg-amber-400/10 border-amber-400/20" };
    case "unknown": return { label: "Unverified", cls: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20" };
    case "invalid": return { label: "Invalid", cls: "text-red-500 bg-red-400/10 border-red-400/20" };
    default: return null;
  }
}

// Grade pill colour (lead_grade A–D), the enriched score bucket.
function gradeCls(grade?: string): string {
  switch ((grade ?? "").toUpperCase()) {
    case "A": return "text-[var(--crm-accent-text)] bg-[var(--crm-accent-weak)] border-[var(--crm-accent-border)]";
    case "B": return "text-amber-500 bg-yellow-400/10 border-yellow-400/20";
    case "C": return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
    default: return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
  }
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
      <div className="relative bg-[var(--crm-surface-2)] border border-[var(--crm-border)] rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--crm-text)]" style={H}>🔥 Push to Duke</h2>
            <p className="text-sm text-[var(--crm-text-3)] mt-0.5" style={H}>{lead.name} — {lead.city}</p>
          </div>
          <button onClick={onClose} className="text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)]"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="bg-[var(--crm-surface)] rounded-xl p-4 space-y-2">
            {lead.phone && <p className="text-xs text-[var(--crm-text-2)] flex items-center gap-2" style={H}><Phone size={11} className="text-[var(--crm-accent)]" />{lead.phone}</p>}
            {lead.email && <p className="text-xs text-[var(--crm-text-2)] flex items-center gap-2" style={H}><Mail size={11} className="text-[var(--crm-accent)]" />{lead.email}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-2" style={H}>What do they need? <span className="text-[var(--crm-accent-text)]">*</span></label>
            <textarea value={repNotes} onChange={(e) => setRepNotes(e.target.value)} required rows={4}
              placeholder="Tell Duke exactly what happened and what this business needs. Budget, timeline, what they said — everything."
              className="w-full px-4 py-3 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] resize-none focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors"
              style={H} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-2" style={H}>Estimated Budget</label>
            <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. $2,000 — $4,000"
              className="w-full px-4 py-3 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors"
              style={H} />
          </div>
          {error && <p className="text-sm text-red-500" style={H}>{error}</p>}
          <button type="submit" disabled={loading || !repNotes}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ backgroundColor: "var(--crm-accent)", ...H }}>
            <Send size={14} />{loading ? "Sending…" : "Send to Duke"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LeadPanel({ lead, state, submission, repName, onClose, onUpdate, onSubmitted, inline = false }: {
  lead: Lead; state: LeadState; submission?: Submission; repName: string;
  onClose: () => void; onUpdate: (patch: Partial<LeadState>) => void; onSubmitted: () => void;
  // inline = docked beside the list (desktop cockpit). Default = right slide-over overlay.
  inline?: boolean;
}) {
  type TabKey = "activity" | "email" | "call" | "notes" | "details";
  const [tab, setTab] = useState<TabKey>("activity");
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
  const [calOverride, setCalOverride] = useState("");
  // "+ Task / Snooze" — quick task creation from the lead drawer.
  const [taskState, setTaskState] = useState<"idle" | "saving" | "done">("idle");
  // Local-only demo-site generation (see /api/crm/leads/generate-site).
  const [genState, setGenState] = useState<"idle" | "loading" | "error">("idle");
  const [genError, setGenError] = useState("");
  const [genResult, setGenResult] = useState<{ previewUrl: string; status?: string; flags?: string[] } | null>(null);
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

  // Create a task for this lead. `inDays` sets the due date (default tomorrow);
  // `type` is call/email/todo. Posts to /api/crm/tasks (the Tasks view reads it).
  const createTask = async (type: "call" | "email" | "todo", inDays: number, title?: string) => {
    setTaskState("saving");
    const due = new Date(); due.setDate(due.getDate() + inDays);
    try {
      await fetch("/api/crm/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          leadName: lead.name,
          title: title ?? `Follow up with ${lead.name}`,
          type,
          dueAt: due.toISOString(),
        }),
      });
      setTaskState("done");
      setTimeout(() => setTaskState("idle"), 1800);
    } catch {
      setTaskState("idle");
    }
  };

  const taskBlock = (
    <div className="rounded-2xl border border-[var(--crm-border)] bg-[var(--crm-surface)] px-4 py-3">
      <p className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-3 flex items-center gap-1.5" style={H}>
        <CalendarClock size={11} />Task &amp; Snooze
      </p>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => createTask("call", 1)} disabled={taskState === "saving"}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--crm-accent-weak)] text-[var(--crm-accent-text)] border border-[var(--crm-accent-border)] hover:opacity-80 transition-all disabled:opacity-50"
          style={H}>
          <PhoneCall size={11} />Call tomorrow
        </button>
        <button onClick={() => createTask("call", 3)} disabled={taskState === "saving"}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--crm-surface-3)] text-[var(--crm-text-2)] border border-[var(--crm-border)] hover:text-[var(--crm-text)] transition-all disabled:opacity-50"
          style={H}>
          <CalendarClock size={11} />Snooze 3 days
        </button>
        <button onClick={() => createTask("email", 7, `Email ${lead.name}`)} disabled={taskState === "saving"}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--crm-surface-3)] text-[var(--crm-text-2)] border border-[var(--crm-border)] hover:text-[var(--crm-text)] transition-all disabled:opacity-50"
          style={H}>
          <Mail size={11} />Email in a week
        </button>
        <button onClick={() => createTask("todo", 0)} disabled={taskState === "saving"}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--crm-surface-3)] text-[var(--crm-text-2)] border border-[var(--crm-border)] hover:text-[var(--crm-text)] transition-all disabled:opacity-50"
          style={H}>
          <StickyNote size={11} />Today
        </button>
      </div>
      {taskState === "done" && (
        <p className="text-[11px] text-emerald-500 mt-2 flex items-center gap-1.5" style={H}><Check size={11} />Task added — see the Tasks view.</p>
      )}
      {taskState === "saving" && (
        <p className="text-[11px] text-[var(--crm-text-3)] mt-2" style={H}>Saving…</p>
      )}
    </div>
  );

  const handleSubmitted = () => {
    postActivity({ type: "submitted" });
    onSubmitted();
  };

  // The outreach API already logs the email and schedules a follow-up server
  // side; mirror that in local state so the panel updates without a refetch.
  // Next-day follow-up (matches FOLLOW_UP_DAYS=1) so it lands in "Due today"
  // tomorrow. If the lead has a built demo, the sent email is the demo template,
  // so record a "demo_emailed" outcome.
  const handleEmailSent = () => {
    const nowDisplay = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const fu = new Date(); fu.setDate(fu.getDate() + 1);
    const fuISO = fu.toISOString().slice(0, 10);
    const terminal = state.status === "won" || state.status === "not_interested";
    const hasDemo = !!(genResult?.previewUrl ?? lead.previewUrl);
    onUpdate(terminal
      ? { lastContacted: nowDisplay, ...(hasDemo ? { lastOutcome: "demo_emailed" } : {}) }
      : { status: "contacted", lastContacted: nowDisplay, followUpDate: fuISO, ...(hasDemo ? { lastOutcome: "demo_emailed" } : {}) });
    setActivityKey((k) => k + 1);
  };

  // Manual "demo email sent" log — for when the rep sends the demo template from
  // outside the composer. Records it on the timeline (stamps emailedAt globally)
  // and sets the next-day follow-up so it surfaces in Due today.
  const logDemoEmailed = () => {
    const nowDisplay = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const fu = new Date(); fu.setDate(fu.getDate() + 1);
    const fuISO = fu.toISOString().slice(0, 10);
    const terminal = state.status === "won" || state.status === "not_interested";
    onUpdate(terminal
      ? { lastContacted: nowDisplay, lastOutcome: "demo_emailed" }
      : { status: "contacted", stage: "contacted", lastContacted: nowDisplay, followUpDate: fuISO, lastOutcome: "demo_emailed" });
    postActivity({ type: "email", outcome: "demo_emailed", note: "Sent demo email with their site link" });
  };

  const needsReview = lead.demoStatus === "needs_review";
  // A demo URL either already attached to the lead, or just generated locally.
  const effPreviewUrl = genResult?.previewUrl ?? lead.previewUrl;
  const effNeedsReview = genResult ? genResult.status === "needs-review" : needsReview;
  // Generate a demo site for this one lead via the local /websites factory.
  // Dev-only on both sides; the API route hard-blocks production.
  async function generateSite() {
    setGenState("loading");
    setGenError("");
    try {
      const res = await fetch("/api/crm/leads/generate-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: lead.name,
          website: lead.website,
          category: lead.category,
          city: lead.city,
          phone: lead.phone,
          email: lead.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGenState("error");
        setGenError(data.error || "Generation failed.");
        return;
      }
      setGenResult({ previewUrl: data.previewUrl, status: data.status, flags: data.flags });
      setGenState("idle");
    } catch {
      setGenState("error");
      setGenError("Couldn't reach the generator.");
    }
  }
  const tier = lead.tier;
  const todayISO = new Date().toISOString().slice(0, 10);
  const tomorrowISO = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); })();
  const in3DaysISO = (() => { const d = new Date(); d.setDate(d.getDate() + 3); return d.toISOString().slice(0, 10); })();
  const websiteHost = lead.website ? lead.website.replace(/^https?:\/\//, "").split("/")[0] : null;
  const isSubmitted = !!state.submittedAt || !!submission;

  // Build the full pitch to display
  const fullPitch = lead.pitch || `Hi, I'm reaching out to ${lead.name} in ${lead.city} — do you have 2 minutes to talk about your online presence?`;

  // Full multi-block call script + objection bank, tailored to this lead.
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

  const act = lead.actions ?? null;
  const wasEmailed = !!act?.emailedAt || (!!state.lastContacted && (state.status === "contacted" || state.stage === "contacted"));

  // ── Reusable blocks ──────────────────────────────────────────────────────
  // Each block is a self-contained section; the tabs below compose them.

  const recommendedBlock = lead.recommended_action ? (
    <div className="rounded-2xl border border-[var(--crm-accent-border)] bg-[var(--crm-accent-weak)] px-4 py-3">
      <div className="flex items-start gap-2.5">
        <Zap size={14} className="text-[var(--crm-accent)] shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--crm-text)] leading-snug" style={H}>{lead.recommended_action}</p>
          <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
            {lead.category_value && (
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[var(--crm-surface-3)] text-[var(--crm-text-3)] border border-[var(--crm-border)]" style={H}>{lead.category_value} value</span>
            )}
            {lead.reach_channel && (
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[var(--crm-surface-3)] text-[var(--crm-text-3)] border border-[var(--crm-border)]" style={H}>{lead.reach_channel}</span>
            )}
            {lead.need_signal && (
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-[var(--crm-surface-3)] text-[var(--crm-text-3)] border border-[var(--crm-border)]" style={H}>{lead.need_signal}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  const emailBlock = lead.email ? (
    <div>
      {needsReview ? (
        <div className="flex items-start gap-3 w-full py-3.5 px-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 text-amber-500"
          style={H}>
          <span className="text-lg leading-none shrink-0">⚠️</span>
          <p className="text-sm font-semibold leading-snug">Demo needs review before sending — verify the preview first</p>
        </div>
      ) : (
        <button onClick={() => setShowEmail(true)}
          className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-base font-bold text-white transition-all active:scale-95"
          style={{ backgroundColor: "var(--crm-accent)", ...H }}>
          <Mail size={18} />Send Email
        </button>
      )}

      {/* Follow-up cadence: recommended next touch + the full plan */}
      {cadence.next ? (
        <>
          <button onClick={() => setShowCadence((v) => !v)} className="w-full flex items-center justify-between group mt-3">
            <span className="text-xs text-[var(--crm-text-3)] flex items-center gap-1.5 group-hover:text-[var(--crm-text-2)] transition-colors" style={H}>
              <Repeat size={11} className="text-[var(--crm-accent)] shrink-0" />
              Next: <span className="text-[var(--crm-text-2)] font-semibold">{cadence.next.label}</span>
              <span className="text-[var(--crm-text-3)]">· {cadenceDueText}</span>
            </span>
            {showCadence ? <ChevronDown size={13} className="text-[var(--crm-text-3)]" /> : <ChevronRight size={13} className="text-[var(--crm-text-3)]" />}
          </button>
          {showCadence && (
            <div className="mt-2.5 space-y-1.5">
              {cadence.cadence.map((t) => {
                const isNext = cadence.next?.step === t.step;
                return (
                  <div key={t.step} className={`rounded-xl border px-3 py-2 ${isNext ? "border-[var(--crm-accent-border)] bg-[var(--crm-accent-weak)]" : "border-[var(--crm-border)] bg-[var(--crm-surface)]"}`}>
                    <p className="text-xs font-semibold text-[var(--crm-text-2)] flex items-center gap-2" style={H}>
                      <span className="text-[var(--crm-text-3)]">Day {t.day}</span>{t.label}
                      {isNext && <span className="text-[10px] text-[var(--crm-accent-text)] uppercase tracking-wider">recommended</span>}
                    </p>
                    <p className="text-xs text-[var(--crm-text-3)] mt-0.5" style={H}>{t.purpose}</p>
                  </div>
                );
              })}
              <p className="text-[11px] text-[var(--crm-text-3)] leading-relaxed pt-0.5" style={H}>Timing is a guide — open Send Email and pick the matching template.</p>
            </div>
          )}
        </>
      ) : (
        <p className="text-xs text-[var(--crm-text-3)] mt-3 flex items-center gap-1.5" style={H}>
          <Repeat size={11} className="shrink-0" />Full 4-touch cadence sent — time to move on or call.
        </p>
      )}
    </div>
  ) : null;

  // Email progress funnel (Sent -> Opened -> Clicked) from the durable global
  // lead_actions stamp. Shows once the lead has been emailed.
  const engagementBlock = wasEmailed ? (
    <div className="rounded-2xl border border-[var(--crm-border)] bg-[var(--crm-surface)] px-4 py-3">
      <p className="text-[11px] uppercase tracking-wider text-[var(--crm-text-3)] font-semibold mb-2" style={H}>Email progress</p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold border text-blue-500 bg-blue-400/10 border-blue-400/20" style={H}>
          <Mail size={12} />Sent{act?.emailedAt ? ` · ${relTime(act.emailedAt)}` : ""}
        </span>
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold border ${act?.openedAt ? "text-sky-500 bg-sky-400/10 border-sky-400/20" : "text-[var(--crm-text-3)] bg-[var(--crm-surface-3)] border-[var(--crm-border)]"}`} style={H}>
          <MailOpen size={12} />{act?.openedAt ? `Opened${act.openedCount && act.openedCount > 1 ? ` ${act.openedCount}×` : ""} · ${relTime(act.openedAt)}` : "Not opened yet"}
        </span>
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold border ${act?.clickedAt ? "text-emerald-500 bg-emerald-400/10 border-emerald-400/30" : "text-[var(--crm-text-3)] bg-[var(--crm-surface-3)] border-[var(--crm-border)]"}`} style={H}>
          <MousePointerClick size={12} />{act?.clickedAt ? `Clicked · ${relTime(act.clickedAt)}` : "No clicks yet"}
        </span>
        {act?.bouncedAt && (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold border text-red-500 bg-red-400/10 border-red-400/30" style={H}>
            <AlertTriangle size={12} />Bounced
          </span>
        )}
      </div>
      {!act?.openedAt && !act?.clickedAt && (
        <p className="text-[10px] text-[var(--crm-text-3)] mt-1.5" style={H}>Open &amp; click tracking populates once the Resend email webhook is live.</p>
      )}
    </div>
  ) : null;

  const demoBlock = effPreviewUrl ? (
    <div className="rounded-2xl border border-[var(--crm-border)] bg-[var(--crm-surface)] px-4 py-3">
      <div className="flex items-center gap-2">
        <a href={effPreviewUrl} target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-[var(--crm-accent-border)] bg-[var(--crm-accent-weak)] text-[var(--crm-accent-text)] hover:opacity-80 transition-all active:scale-95"
          style={H}>
          <Globe size={15} />View demo site<ExternalLink size={12} className="opacity-60" />
        </a>
        <CopyBtn text={effPreviewUrl} />
      </div>
      {lead.thumbnailUrl && (
        <a href={effPreviewUrl} target="_blank" rel="noopener noreferrer" className="block mt-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lead.thumbnailUrl} alt="Demo preview" loading="lazy"
            className="w-full rounded-xl border border-[var(--crm-border)] hover:border-[var(--crm-accent-border)] transition-colors" />
        </a>
      )}
      <button onClick={logDemoEmailed}
        className={`mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
          state.lastOutcome === "demo_emailed"
            ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-500"
            : "border-[var(--crm-border)] bg-[var(--crm-surface-3)] text-[var(--crm-text-2)] hover:opacity-80"
        }`}
        style={H}>
        {state.lastOutcome === "demo_emailed"
          ? <><Check size={13} />Demo email sent</>
          : <><Mail size={13} />Mark demo email sent</>}
      </button>
      {effNeedsReview && (
        <p className="mt-1.5 text-[11px] text-amber-500 flex items-center gap-1.5" style={H}>
          <span>⚠️</span>Demo flagged needs-review — verify before sending.
        </p>
      )}
      {lead.claimByDate && (
        <p className="mt-1 text-[11px] text-[var(--crm-text-3)]" style={H}>Offer expires {lead.claimByDate}</p>
      )}
    </div>
  ) : null;

  const callBlock = lead.phone ? (
    <div>
      <a href={`tel:${lead.phone}`}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold border border-[var(--crm-border)] bg-[var(--crm-surface-3)] text-[var(--crm-text)] hover:opacity-80 transition-all active:scale-95"
        style={H}>
        <Phone size={15} className="text-[var(--crm-accent)]" />Call {lead.phone}
      </a>
      <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
          callTiming.status === "good" ? "text-emerald-500 bg-green-400/10 border-green-400/20" :
          callTiming.status === "ok" ? "text-amber-500 bg-yellow-400/10 border-yellow-400/20" :
          "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"
        }`} style={H}>
          {callTiming.status === "good" ? "🟢" : callTiming.status === "ok" ? "🟡" : "🔴"} {callTiming.label}
        </span>
        {state.lastContacted && (
          <span className="text-xs text-[var(--crm-text-3)]" style={H}>Last: {state.lastContacted}</span>
        )}
      </div>
    </div>
  ) : null;

  const outcomeBlock = (
    <div>
      <p className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-3" style={H}>Log Outcome</p>
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
            className="col-span-2 sm:col-span-3 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-bold text-[var(--crm-accent-text)] border border-[var(--crm-accent-border)] bg-[var(--crm-accent-weak)] hover:opacity-80 transition-all"
            style={H}>
            <Send size={13} />They&apos;re In — Push to Duke
          </button>
        )}
        {isSubmitted && (
          <div className={`col-span-2 sm:col-span-3 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold border ${
            submission?.status === "accepted" ? "text-emerald-500 bg-green-400/10 border-green-400/20" :
            submission?.status === "rejected" ? "text-red-500 bg-red-400/10 border-red-400/20" :
            "text-[var(--crm-accent-text)] bg-[var(--crm-accent-weak)] border-[var(--crm-accent-border)]"
          }`} style={H}>
            {submission?.status === "accepted" ? `✓ Accepted${submission?.commissionAmount ? ` — $${submission.commissionAmount.toFixed(2)} commission` : ""}` :
             submission?.status === "rejected" ? "✕ Passed — try a different angle" :
             "⏳ Submitted — waiting on Duke"}
          </div>
        )}
      </div>
    </div>
  );

  const notesBlock = (
    <div>
      <p className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-3 flex items-center gap-1.5" style={H}>
        <StickyNote size={11} />Your Notes
      </p>
      <textarea value={notes} onChange={(e) => handleNotes(e.target.value)} onBlur={handleNotesBlur} rows={inline ? 6 : 8}
        placeholder="What did they say? Are they coming back? What's their situation?"
        className="w-full bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-xl px-4 py-3 text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] resize-none focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors"
        style={H} />
      <p className="text-xs text-[var(--crm-text-3)] mt-1.5" style={H}>Auto-saved as you type</p>
    </div>
  );

  const claimBlock = (
    <div>
      {claim === undefined ? (
        <div className="h-8 bg-[var(--crm-surface-3)] animate-pulse rounded-xl" />
      ) : claim === null ? (
        <button onClick={handleClaim} disabled={claimLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20 hover:bg-blue-500/20 transition-all disabled:opacity-50"
          style={H}>
          <UserCheck size={14} />{claimLoading ? "Claiming…" : "Claim This Lead"}
        </button>
      ) : claim.userId === currentUserId || (!currentUserId) ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold bg-green-500/10 text-emerald-500 border border-green-500/20" style={H}>
            <Check size={14} />My Lead
          </div>
          <button onClick={handleUnclaim} disabled={claimLoading}
            className="px-3 py-2.5 rounded-xl text-xs font-semibold text-[var(--crm-text-3)] bg-[var(--crm-surface-3)] border border-[var(--crm-border)] hover:text-[var(--crm-text-2)] transition-all disabled:opacity-50"
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
  );

  const followUpBlock = showFollowUp ? (
    <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 px-4 py-4">
      <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider mb-3" style={H}>📅 Follow up on:</p>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFollowUpDate(todayISO)}
          className="px-3 py-2 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-500 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
          style={H}>Today</button>
        <button onClick={() => setFollowUpDate(tomorrowISO)}
          className="px-3 py-2 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-500 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
          style={H}>Tomorrow</button>
        <button onClick={() => setFollowUpDate(in3DaysISO)}
          className="px-3 py-2 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-500 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
          style={H}>In 3 days</button>
        <input type="date" defaultValue={todayISO}
          onChange={(e) => { if (e.target.value) setFollowUpDate(e.target.value); }}
          className="px-3 py-2 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-500 border border-purple-500/20 focus:outline-none focus:border-purple-400/50 transition-all"
          style={H} />
        <button onClick={() => setShowFollowUp(false)}
          className="px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--crm-surface-3)] text-[var(--crm-text-3)] border border-[var(--crm-border)] hover:text-[var(--crm-text-2)] transition-all"
          style={H}>Skip</button>
      </div>
      {state.followUpDate && (
        <p className="text-xs text-purple-500/70 mt-2" style={H}>Currently set: {state.followUpDate}</p>
      )}
    </div>
  ) : null;

  const scriptBlock = (
    <div>
      <p className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-3" style={H}>Your Opening Line</p>
      <div className="bg-[var(--crm-surface)] rounded-xl border border-[var(--crm-border)] p-4 relative">
        <p className="text-sm text-[var(--crm-text)] leading-relaxed italic" style={H}>&ldquo;{fullPitch}&rdquo;</p>
        <button onClick={() => navigator.clipboard.writeText(fullPitch)}
          className="absolute top-3 right-3 p-1.5 rounded-md text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] hover:bg-[var(--crm-surface-3)] transition-colors">
          <Copy size={12} />
        </button>
      </div>
      {lead.tier_reason && (
        <p className="text-xs text-[var(--crm-text-3)] mt-2 px-1 leading-relaxed" style={H}>{lead.tier_reason}</p>
      )}
    </div>
  );

  const fullScriptBlock = (
    <div>
      <button onClick={() => setShowScript((v) => !v)} className="w-full flex items-center justify-between group">
        <span className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider flex items-center gap-1.5 group-hover:text-[var(--crm-text-2)] transition-colors" style={H}>
          <Phone size={11} />Full Call Script
        </span>
        {showScript ? <ChevronDown size={14} className="text-[var(--crm-text-3)]" /> : <ChevronRight size={14} className="text-[var(--crm-text-3)]" />}
      </button>
      {showScript && (
        <div className="mt-3 space-y-3">
          {callScript.map((block) => (
            <div key={block.heading}>
              <p className="text-[11px] font-semibold text-[var(--crm-accent-text)] uppercase tracking-wider mb-1.5" style={H}>{block.heading}</p>
              <div className="bg-[var(--crm-surface)] rounded-xl border border-[var(--crm-border)] p-3 relative">
                <div className="space-y-1.5 pr-7">
                  {block.lines.map((line, i) => (
                    <p key={i} className="text-sm text-[var(--crm-text-2)] leading-relaxed" style={H}>{line}</p>
                  ))}
                </div>
                <button onClick={() => navigator.clipboard.writeText(block.lines.join("\n"))}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-md text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] hover:bg-[var(--crm-surface-3)] transition-colors">
                  <Copy size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const objectionsBlock = (
    <div>
      <button onClick={() => setShowObjections((v) => !v)} className="w-full flex items-center justify-between group">
        <span className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider flex items-center gap-1.5 group-hover:text-[var(--crm-text-2)] transition-colors" style={H}>
          <MessageSquare size={11} />Objection Handling
        </span>
        {showObjections ? <ChevronDown size={14} className="text-[var(--crm-text-3)]" /> : <ChevronRight size={14} className="text-[var(--crm-text-3)]" />}
      </button>
      {showObjections && (
        <div className="mt-3 space-y-2">
          {objections.map((o) => (
            <div key={o.trigger} className="bg-[var(--crm-surface)] rounded-xl border border-[var(--crm-border)] p-3">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-xs font-semibold text-[var(--crm-text)] flex-1" style={H}>&ldquo;{o.trigger}&rdquo;</p>
                <CopyBtn text={o.response} />
              </div>
              <p className="text-sm text-[var(--crm-text-2)] leading-relaxed pr-1" style={H}>{o.response}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const websiteBlock = (lead.website || lead.site_quality || lead.digital_presence) ? (
    <div>
      <p className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-3" style={H}>Their Website</p>
      {lead.website ? (
        <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-bold border border-[var(--crm-border)] bg-[var(--crm-surface-3)] text-[var(--crm-text)] hover:border-[var(--crm-border-strong)] transition-all active:scale-95"
          style={H}>
          <Globe size={15} className="text-[var(--crm-accent)]" />Open their site<ExternalLink size={13} className="text-[var(--crm-text-3)]" />
        </a>
      ) : (
        <div className="flex items-center gap-2 w-full py-3 px-4 rounded-2xl border border-orange-400/25 bg-orange-400/[0.07] text-orange-500" style={H}>
          <Flame size={14} className="shrink-0" /><span className="text-sm font-semibold">No website found — that&apos;s the pitch</span>
        </div>
      )}
      {lead.website && websiteHost && (
        <p className="text-[11px] text-[var(--crm-text-3)] text-center mt-1.5 truncate" style={H}>{websiteHost}</p>
      )}
      {/* Audit signal chips — the redesign-opportunity tells */}
      {(lead.site_quality || lead.digital_presence || lead.builder || lead.site_load_ms) && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {lead.site_quality && (() => {
            const q = lead.site_quality.toLowerCase();
            const cls = q === "dead" ? "text-red-500 bg-red-400/10 border-red-400/20"
              : q === "thin" ? "text-amber-500 bg-amber-400/10 border-amber-400/20"
              : q === "good" ? "text-emerald-500 bg-green-400/10 border-green-400/20"
              : "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
            const label = q === "dead" ? "Site dead" : q === "thin" ? "Thin / placeholder" : q === "good" ? "Real site" : lead.site_quality;
            return <span className={`text-[11px] px-2 py-0.5 rounded-full border ${cls}`} style={H}>{label}</span>;
          })()}
          {lead.digital_presence && (
            <span className="text-[11px] px-2 py-0.5 rounded-full border border-[var(--crm-border)] bg-[var(--crm-surface-3)] text-[var(--crm-text-3)]" style={H}>
              {lead.digital_presence === "none" ? "No online presence" : lead.digital_presence === "weak" ? "Weak presence" : "OK presence"}
            </span>
          )}
          {lead.builder && (
            <span className="text-[11px] px-2 py-0.5 rounded-full border border-yellow-400/20 bg-yellow-400/10 text-amber-500" style={H}>{lead.builder}</span>
          )}
          {(() => {
            const ms = parseInt(lead.site_load_ms ?? "", 10);
            if (!Number.isFinite(ms) || ms <= 0) return null;
            const slow = ms > 3000;
            return <span className={`text-[11px] px-2 py-0.5 rounded-full border ${slow ? "text-red-500 bg-red-400/10 border-red-400/20" : "text-[var(--crm-text-3)] bg-[var(--crm-surface-3)] border-[var(--crm-border)]"}`} style={H}>Loads in {(ms / 1000).toFixed(1)}s{slow ? " · slow" : ""}</span>;
          })()}
        </div>
      )}
    </div>
  ) : null;

  const contactBlock = (
    <div>
      <p className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-3" style={H}>Contact Info</p>
      <div className="space-y-2.5">
        {/* Decision-maker (enriched, sparse) — who to ask for by name */}
        {(lead.owner_name || lead.owner_email || lead.owner_phone) && (
          <div className="rounded-xl border border-[var(--crm-accent-border)] bg-[var(--crm-accent-weak)] p-3 space-y-1.5">
            <p className="text-[11px] font-semibold text-[var(--crm-accent-text)] uppercase tracking-wider flex items-center gap-1.5" style={H}>
              <UserCheck size={11} />Decision-maker
            </p>
            {lead.owner_name && (
              <p className="text-sm text-[var(--crm-text)] font-semibold" style={H}>
                {lead.owner_name}{lead.owner_title ? <span className="text-[var(--crm-text-3)] font-normal"> · {lead.owner_title}</span> : null}
              </p>
            )}
            {lead.owner_email && (
              <div className="flex items-center gap-2">
                <Mail size={12} className="text-[var(--crm-accent)] shrink-0" />
                <a href={`mailto:${lead.owner_email}`} className="text-xs text-[var(--crm-text-2)] hover:text-[var(--crm-accent-text)] transition-colors flex-1 min-w-0 truncate" style={H}>{lead.owner_email}</a>
                <CopyBtn text={lead.owner_email} />
              </div>
            )}
            {lead.owner_phone && (
              <div className="flex items-center gap-2">
                <Phone size={12} className="text-[var(--crm-accent)] shrink-0" />
                <a href={`tel:${lead.owner_phone}`} className="text-xs text-[var(--crm-text-2)] hover:text-[var(--crm-accent-text)] transition-colors flex-1" style={H}>{lead.owner_phone}</a>
                <CopyBtn text={lead.owner_phone} />
              </div>
            )}
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-2 flex-wrap">
            <Phone size={13} className="text-[var(--crm-accent)] shrink-0" />
            <a href={`tel:${lead.phone}`} className="text-sm text-[var(--crm-text-2)] hover:text-[var(--crm-accent-text)] transition-colors flex-1" style={H}>{lead.phone}</a>
            {lead.phone_type && lead.phone_type !== "fixed-line-or-mobile" && (
              <span className="text-[10px] uppercase tracking-wider text-[var(--crm-text-3)] bg-[var(--crm-surface-3)] border border-[var(--crm-border)] px-1.5 py-0.5 rounded-md shrink-0" style={H}>{lead.phone_type.replace(/-/g, " ")}</span>
            )}
            {lead.phone_valid === "False" && (
              <span className="text-[10px] text-red-500 bg-red-400/10 border border-red-400/20 px-1.5 py-0.5 rounded-md shrink-0" style={H}>unverified #</span>
            )}
            <CopyBtn text={lead.phone} />
          </div>
        )}
        {lead.email && (
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Mail size={13} className="text-[var(--crm-accent)] shrink-0" />
              <a href={`mailto:${lead.email}`} className="text-sm text-[var(--crm-text-2)] hover:text-[var(--crm-accent-text)] transition-colors flex-1 min-w-0 truncate" style={H}>{lead.email}</a>
              {(() => {
                const b = emailStatusBadge(lead.email_status);
                return b
                  ? <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${b.cls}`} style={H}>{b.label}</span>
                  : lead.email_owned === "1" ? <span className="text-xs text-emerald-500 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full shrink-0" style={H}>Business</span> : null;
              })()}
              <CopyBtn text={lead.email} />
            </div>
            {/* Free/role are NOT disqualifiers for a web-design pitch — show as
                context, not warnings; plus any additional emails found. */}
            {(lead.email_role === "True" || lead.email_free === "True" || lead.all_emails) && (
              <p className="text-[11px] text-[var(--crm-text-3)] mt-1 ml-[21px]" style={H}>
                {lead.email_role === "True" && <span>Role inbox</span>}
                {lead.email_role === "True" && lead.email_free === "True" && <span> · </span>}
                {lead.email_free === "True" && <span>Personal (free) provider</span>}
                {lead.all_emails && <span>{(lead.email_role === "True" || lead.email_free === "True") ? " · " : ""}Also: {lead.all_emails.split("|").filter(Boolean).slice(0, 2).join(", ")}</span>}
              </p>
            )}
          </div>
        )}
        {lead.website && (
          <div className="flex items-center gap-2">
            <ExternalLink size={13} className="text-[var(--crm-accent)] shrink-0" />
            <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
              target="_blank" rel="noopener noreferrer"
              className="text-sm text-[var(--crm-text-2)] hover:text-[var(--crm-accent-text)] transition-colors flex-1 truncate" style={H}>
              {websiteHost}
              {lead.builder && <span className="ml-2 text-xs text-amber-500">({lead.builder})</span>}
            </a>
          </div>
        )}
        {/* The attached link is the public gallery URL; the demo only
            resolves there once the Websites repo is pushed/deployed. */}
        {genResult && (
          <p className="text-[11px] text-amber-500" style={H}>
            Built ✓ — push the Websites repo to deploy this demo, then the link goes live (~1 min).
          </p>
        )}
        {/* Local-only: build a demo site for this lead with the /websites factory.
            Hidden in production builds; the API route also hard-blocks prod. */}
        {!effPreviewUrl && process.env.NODE_ENV === "development" && (
          <div className="space-y-1.5">
            <button
              onClick={generateSite}
              disabled={genState === "loading"}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/15 text-violet-500 border border-violet-400/25 hover:bg-violet-500/25 disabled:opacity-60 text-xs transition-colors"
              style={H}
            >
              <Globe size={13} />
              {genState === "loading" ? "Generating demo… (1–3 min)" : "Generate demo site"}
            </button>
            {genState === "loading" && (
              <p className="text-[11px] text-[var(--crm-text-3)]" style={H}>Scraping the business + building the site locally…</p>
            )}
            {genState === "error" && (
              <p className="text-[11px] text-red-500" style={H}>{genError}</p>
            )}
          </div>
        )}
        {lead.address && (
          <div className="flex items-start gap-2">
            <MapPin size={13} className="text-[var(--crm-text-3)] shrink-0 mt-0.5" />
            <span className="text-xs text-[var(--crm-text-3)] flex-1" style={H}>{lead.address}, {lead.city} {lead.county}</span>
          </div>
        )}
        {lead.socials && (
          <div className="flex flex-wrap gap-2 pt-1">
            {lead.socials.split("|").filter(Boolean).map((url, i) => {
              const label = url.includes("facebook") ? "Facebook" : url.includes("instagram") ? "Instagram" :
                url.includes("twitter") || url.includes("x.com") ? "X / Twitter" : url.includes("linkedin") ? "LinkedIn" : "Social";
              return (
                <a key={i} href={url.startsWith("http") ? url : `https://${url}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--crm-surface-3)] text-[var(--crm-text-2)] border border-[var(--crm-border)] hover:text-[var(--crm-text)] text-xs transition-colors"
                  style={H}><Link size={10} />{label}</a>
              );
            })}
          </div>
        )}
        {lead.best_contact && (
          <p className="text-xs text-[var(--crm-accent-text)] flex items-center gap-1.5 pt-1" style={H}>
            <Star size={10} />Best way to reach them: <strong>{lead.best_contact}</strong>
          </p>
        )}
      </div>
    </div>
  );

  const scheduleBlock = (
    <div>
      <p className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-3 flex items-center gap-1.5" style={H}>
        <CalendarClock size={11} />Schedule a Call
      </p>
      <div className="flex gap-2 flex-wrap">
        {lead.email && (
          <a href={`mailto:${lead.email}?subject=${encodeURIComponent(`Schedule a quick call — ${lead.name}`)}&body=${encodeURIComponent(`Hi, I'd love to find a time to connect! You can book a free 15-minute call here: ${bookingUrl}`)}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-violet-500/10 text-violet-500 border border-violet-500/20 hover:bg-violet-500/20 transition-all" style={H}>
            <Mail size={11} />Send via Email
          </a>
        )}
        {lead.phone && (
          <a href={`sms:${lead.phone}?&body=${encodeURIComponent(`Hi! Book a free 15-minute call: ${bookingUrl}`)}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-violet-500/10 text-violet-500 border border-violet-500/20 hover:bg-violet-500/20 transition-all" style={H}>
            <Phone size={11} />Send via Text
          </a>
        )}
        <button onClick={() => navigator.clipboard.writeText(bookingUrl)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--crm-surface-3)] text-[var(--crm-text-2)] border border-[var(--crm-border)] hover:text-[var(--crm-text)] transition-all" style={H}>
          <Copy size={11} />Copy Link
        </button>
      </div>
    </div>
  );

  // ── Tabs ──────────────────────────────────────────────────────────────────
  const TABS: { key: TabKey; label: string; icon: typeof Activity }[] = [
    { key: "activity", label: "Activity", icon: Activity },
    { key: "email", label: "Email", icon: Mail },
    { key: "call", label: "Call", icon: PhoneCall },
    { key: "notes", label: "Notes", icon: StickyNote },
    { key: "details", label: "Details", icon: Info },
  ];

  return (
    <>
      {showSubmit && <SubmitModal lead={lead} state={state} onClose={() => setShowSubmit(false)} onSubmitted={handleSubmitted} />}
      {showEmail && (
        <EmailComposer
          lead={{ id: lead.id, name: lead.name, contactName: lead.contact_name, email: lead.email, city: lead.city, previewUrl: lead.previewUrl ?? undefined, claimByDate: lead.claimByDate ?? undefined, demoCategory: lead.demoCategory ?? undefined, website: lead.website, siteQuality: lead.site_quality, emailStatus: lead.email_status }}
          repName={repName}
          onClose={() => setShowEmail(false)}
          onSent={handleEmailSent}
        />
      )}

      <div className={inline ? "h-full w-full flex" : "fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end"} onClick={inline ? undefined : onClose}>
        {!inline && <div className="absolute inset-0 bg-black/50 sm:bg-black/30 backdrop-blur-sm sm:backdrop-blur-none" />}
        <div className={inline
            ? "relative bg-[var(--crm-surface-2)] w-full h-full flex flex-col overflow-hidden"
            : "relative bg-[var(--crm-surface-2)] border-t sm:border-t-0 sm:border-l border-[var(--crm-border)] w-full sm:w-[560px] lg:w-[680px] h-[92vh] sm:h-full flex flex-col shadow-2xl overflow-hidden rounded-t-2xl sm:rounded-none"}
          onClick={(e) => e.stopPropagation()}>

          {/* Sticky header — identity + status + key actions */}
          <div className="shrink-0 border-b border-[var(--crm-border)] bg-[var(--crm-surface-2)]">
            <div className="flex items-start justify-between px-5 pt-4 pb-3">
              <div className="min-w-0 pr-4">
                <h2 className="text-lg font-bold text-[var(--crm-text)] leading-tight truncate" style={H}>{lead.name}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {lead.contact_name && (
                    <span className="text-xs text-[var(--crm-text-2)] flex items-center gap-1" style={H}><UserCheck size={10} />{lead.contact_name}</span>
                  )}
                  <span className="text-xs text-[var(--crm-text-3)] flex items-center gap-1" style={H}><MapPin size={10} />{lead.city}{lead.county ? `, ${lead.county}` : ""}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    tier === "A" ? "text-[var(--crm-accent-text)] bg-[var(--crm-accent-weak)] border-[var(--crm-accent-border)]" :
                    tier === "B" ? "text-amber-500 bg-yellow-400/10 border-yellow-400/20" :
                    "text-zinc-500 bg-zinc-500/10 border-zinc-500/20"
                  }`} style={H}>
                    {tier === "A" ? <><Flame size={9} className="inline mr-1" />No Website</> :
                     tier === "B" ? <><Zap size={9} className="inline mr-1" />DIY Site</> :
                     <><Globe size={9} className="inline mr-1" />Has Site</>}
                  </span>
                  {lead.grade && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${gradeCls(lead.grade)}`} style={H}>
                      Grade {lead.grade}{lead.lead_score != null ? ` · ${lead.lead_score}` : ""}
                    </span>
                  )}
                  {state.callCount ? (
                    <span className="text-xs text-[var(--crm-text-3)] flex items-center gap-1" style={H}><PhoneCall size={9} />{state.callCount} call{state.callCount !== 1 ? "s" : ""}</span>
                  ) : null}
                  <div className="relative">
                    <button onClick={() => setShowScorePopover((v) => !v)}
                      className="text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] transition-colors flex items-center gap-1"
                      style={H}>
                      <Info size={12} />
                      <span className="text-xs">{lead.outreach_score}</span>
                    </button>
                    {showScorePopover && (
                      <div className="absolute left-0 top-6 z-10 w-64 bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-xl p-3 shadow-xl text-xs text-[var(--crm-text-2)] space-y-1.5" style={H}>
                        <p className="font-bold text-[var(--crm-text)]">Why this score?</p>
                        {lead.grade && <p>Grade <span className="font-semibold text-[var(--crm-text)]">{lead.grade}</span>{lead.lead_score != null ? <> · <span className="text-[var(--crm-accent-text)] font-semibold">{lead.lead_score}/100</span></> : null}</p>}
                        {/* Enriched breakdown — what actually drove the score */}
                        {lead.score_why ? (
                          <ul className="space-y-0.5 pl-0.5">
                            {lead.score_why.split(";").map((part) => part.trim()).filter(Boolean).map((part, i) => (
                              <li key={i} className="flex items-start gap-1.5"><span className="text-[var(--crm-accent-text)] mt-px">•</span><span className="capitalize">{part}</span></li>
                            ))}
                          </ul>
                        ) : (
                          <>
                            {lead.tier_reason && <p>Tier {lead.tier}: {lead.tier_reason}</p>}
                            {lead.industry_fit && <p>Industry fit: <span className="text-emerald-500">{lead.industry_fit}</span></p>}
                            <p>Outreach score: <span className="text-[var(--crm-accent-text)] font-semibold">{lead.outreach_score}/100</span></p>
                          </>
                        )}
                        <button onClick={() => setShowScorePopover(false)} className="text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] pt-1">✕ close</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg text-[var(--crm-text-3)] hover:text-[var(--crm-text)] hover:bg-[var(--crm-surface-3)] transition-colors shrink-0"><X size={18} /></button>
            </div>

            {/* Claim row — ownership is a header-level concern */}
            <div className="px-5 pb-3">{claimBlock}</div>

            {/* Tab bar */}
            <div className="flex items-stretch gap-1 px-3 -mb-px overflow-x-auto">
              {TABS.map((t) => {
                const active = tab === t.key;
                return (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`relative flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                      active ? "text-[var(--crm-accent-text)]" : "text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)]"
                    }`}
                    style={H}>
                    <t.icon size={13} />{t.label}
                    {active && <span className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-[var(--crm-accent)]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content — scrollable */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

            {tab === "activity" && (
              <>
                {recommendedBlock}
                {engagementBlock}
                {outcomeBlock}
                {followUpBlock}
                {taskBlock}
                <div>
                  <p className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-3 flex items-center gap-1.5" style={H}>
                    <Activity size={11} />Timeline
                  </p>
                  <ActivityTimeline key={activityKey} leadId={lead.id} />
                </div>
              </>
            )}

            {tab === "email" && (
              <>
                {recommendedBlock}
                {emailBlock}
                {engagementBlock}
                {demoBlock}
                {scheduleBlock}
              </>
            )}

            {tab === "call" && (
              <>
                {callBlock}
                {outcomeBlock}
                {followUpBlock}
                {taskBlock}
                {scriptBlock}
                {fullScriptBlock}
                {objectionsBlock}
              </>
            )}

            {tab === "notes" && (
              <>
                {notesBlock}
                {scriptBlock}
              </>
            )}

            {tab === "details" && (
              <>
                {contactBlock}
                {websiteBlock}
                {scheduleBlock}
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
