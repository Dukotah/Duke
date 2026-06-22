"use client";

// Shared, self-contained module for the durable cross-rep action badges/filters.
// It deliberately does NOT import from @/lib/db (server-only Redis) — it carries a
// structural LeadAction type that matches the JSON the leads API attaches as
// `lead.actions`, plus the per-user LeadState as a fallback when no global stamp
// exists yet. Pure & client-safe so it can be used in any list view.

import {
  Mail, Phone, Voicemail, Star, CalendarClock, XCircle, Trophy,
  Globe, PhoneOff, CircleDashed, MailOpen, MousePointerClick, AlertTriangle,
  MessageSquareReply, ChevronRight,
} from "lucide-react";

const H = { fontFamily: "var(--font-heading)" };

// Structural mirror of LeadActions from @/lib/db (kept in sync intentionally).
export interface LeadAction {
  emailedAt?: string;
  calledAt?: string;
  emailCount?: number;
  callCount?: number;
  lastOutcome?: string;
  lastOutcomeAt?: string;
  interestedAt?: string;
  notInterestedAt?: string;
  lastTouchedBy?: string;
  lastTouchedName?: string;
  lastTouchedAt?: string;
  followUpDate?: string;
  status?: string;
  openedAt?: string;
  openedCount?: number;
  clickedAt?: string;
  clickedCount?: number;
  bouncedAt?: string;
  respondedAt?: string;
  replyCount?: number;
}

// Minimal shape of the per-user LeadState used as a fallback for the current rep.
export interface LeadStateLike {
  status?: string;
  stage?: string;
  lastContacted?: string;
  callCount?: number;
  lastOutcome?: string;
  followUpDate?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Compact "3d ago" / "2h ago" / "just now". Guards NaN dates and clamps future.
export function relTime(iso?: string): string {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "";
  const diffMs = Date.now() - t;
  if (diffMs < 0) return "now";
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

// Rep initials for the "who did it" marker. Tolerates empty/odd names.
export function initials(name?: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Normalize a YYYY-MM-DD-or-ISO follow-up to YYYY-MM-DD for comparison.
function dayOf(s?: string): string {
  if (!s) return "";
  return s.length >= 10 ? s.slice(0, 10) : s;
}

// ─── Tag taxonomy ─────────────────────────────────────────────────────────────

export type TagKey =
  | "not_contacted"
  | "responded"
  | "emailed"
  | "opened"
  | "clicked"
  | "called"
  | "voicemail"
  | "interested"
  | "follow_up_due"
  | "not_interested"
  | "won"
  | "demo_sent"
  | "no_answer"
  | "bounced";

export const TAG_DEFS: { key: TagKey; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: "not_contacted", label: "Not contacted", icon: CircleDashed },
  { key: "responded", label: "Responded", icon: MessageSquareReply },
  { key: "emailed", label: "Emailed", icon: Mail },
  { key: "opened", label: "Opened email", icon: MailOpen },
  { key: "clicked", label: "Clicked demo", icon: MousePointerClick },
  { key: "called", label: "Called", icon: Phone },
  { key: "voicemail", label: "Voicemail", icon: Voicemail },
  { key: "interested", label: "Interested", icon: Star },
  { key: "follow_up_due", label: "Follow-up due", icon: CalendarClock },
  { key: "not_interested", label: "Not interested", icon: XCircle },
  { key: "won", label: "Won", icon: Trophy },
  { key: "demo_sent", label: "Demo sent", icon: Globe },
  { key: "no_answer", label: "No answer", icon: PhoneOff },
  { key: "bounced", label: "Bad email", icon: AlertTriangle },
];

// Derive the set of tags that apply to a lead, merging the GLOBAL cross-rep
// action stamp with the current rep's per-user LeadState (fallback) and the
// presence of a built demo (previewUrl). `today` is YYYY-MM-DD.
export function deriveTags(
  actions: LeadAction | null | undefined,
  state: LeadStateLike | null | undefined,
  today: string,
  extra?: { previewUrl?: string | null }
): Set<TagKey> {
  const tags = new Set<TagKey>();
  const a = actions ?? {};
  const s = state ?? {};

  const emailed = !!a.emailedAt || s.lastContacted != null && (s.status === "contacted" || s.stage === "contacted");
  const called = !!a.calledAt || (a.callCount ?? s.callCount ?? 0) > 0;
  const lastOutcome = (a.lastOutcome ?? s.lastOutcome ?? "").toLowerCase();
  const status = (a.status ?? s.status ?? "").toLowerCase();
  const stage = (s.stage ?? "").toLowerCase();

  if (a.respondedAt) tags.add("responded");
  if (a.emailedAt || a.openedAt || a.clickedAt) tags.add("emailed");
  else if (emailed) tags.add("emailed");
  if (a.openedAt) tags.add("opened");
  if (a.clickedAt) tags.add("clicked");
  if (a.bouncedAt) tags.add("bounced");
  if (called) tags.add("called");

  if (lastOutcome === "voicemail" || stage === "voicemail") tags.add("voicemail");
  if (lastOutcome === "no_answer") tags.add("no_answer");
  // Interested/Not-interested are sticky: prefer the set-once global timestamp
  // (cross-rep, survives a later outcome) over the last-write-wins lastOutcome.
  if (!!a.interestedAt || lastOutcome === "interested" || stage === "interested") tags.add("interested");
  if (!!a.notInterestedAt || status === "not_interested" || lastOutcome === "not_interested") tags.add("not_interested");
  if (status === "won" || stage === "won" || lastOutcome === "won") tags.add("won");

  const fu = dayOf(a.followUpDate ?? s.followUpDate);
  const terminal = status === "won" || status === "not_interested" || ["won", "lost", "submitted"].includes(stage);
  if (fu && !terminal && fu <= today) tags.add("follow_up_due");

  if (extra?.previewUrl) tags.add("demo_sent");

  if (tags.size === 0 && !emailed && !called) tags.add("not_contacted");

  return tags;
}

// ─── Badge pills (row-level) ──────────────────────────────────────────────────

function Pill({ icon: Icon, text, cls, title }: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  text: string; cls: string; title?: string;
}) {
  return (
    <span title={title}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold border leading-none ${cls}`}
      style={H}>
      {Icon && <Icon size={9} className="shrink-0" />}
      {text}
    </span>
  );
}

// Compact, theme-matched, flex-wrap row of "what was done" pills. Renders the
// global cross-rep stamp first (so all reps see team activity at a glance),
// falling back to the per-user state. Shows rep initials when known.
export function RecencyBadges({
  actions, state, today, previewUrl, className = "",
}: {
  actions?: LeadAction | null;
  state?: LeadStateLike | null;
  today: string;
  previewUrl?: string | null;
  className?: string;
}) {
  const a = actions ?? null;
  const s = state ?? null;
  const tags = deriveTags(a, s, today, { previewUrl });
  const who = initials(a?.lastTouchedName);

  const pills: React.ReactNode[] = [];

  // Replied is the single hottest signal — surface it first, even above Won.
  if (tags.has("responded")) {
    const rc = a?.replyCount && a.replyCount > 1 ? ` ${a.replyCount}×` : "";
    pills.push(<Pill key="rep" icon={MessageSquareReply}
      text={a?.respondedAt ? `Replied ${relTime(a.respondedAt)}${rc}` : `Replied${rc}`}
      cls="text-[#F97316] bg-[#F97316]/15 border-[#F97316]/40"
      title="This lead replied to an outreach email — open the card to read it" />);
  }
  if (tags.has("bounced")) {
    pills.push(<Pill key="bnc" icon={AlertTriangle} text="Bad email" cls="text-red-300 bg-red-400/10 border-red-400/30"
      title={a?.bouncedAt ? `Hard bounced / spam-flagged ${relTime(a.bouncedAt)} — do not re-email` : "Bad email — do not re-email"} />);
  }
  if (tags.has("won")) {
    pills.push(<Pill key="won" icon={Trophy} text="Won" cls="text-green-400 bg-green-400/10 border-green-400/20" />);
  }
  if (tags.has("interested")) {
    pills.push(<Pill key="int" icon={Star} text="Interested" cls="text-[#F97316] bg-[#F97316]/10 border-[#F97316]/20" />);
  }
  if (tags.has("follow_up_due")) {
    pills.push(<Pill key="fu" icon={CalendarClock} text="Follow-up due" cls="text-amber-300 bg-amber-400/10 border-amber-400/25" />);
  }

  // Engagement signals — a click on the demo link is the hottest buying signal,
  // so it gets a prominent pill. Opened shows only when there's no click yet.
  if (tags.has("clicked")) {
    pills.push(<Pill key="clk" icon={MousePointerClick}
      text={a?.clickedAt ? `Clicked ${relTime(a.clickedAt)}` : "Clicked"}
      cls="text-emerald-300 bg-emerald-400/10 border-emerald-400/30"
      title="Clicked a link in the email (e.g. the demo)" />);
  } else if (tags.has("opened")) {
    const oc = a?.openedCount && a.openedCount > 1 ? ` ${a.openedCount}×` : "";
    pills.push(<Pill key="opn" icon={MailOpen} text={`Opened${oc}`}
      cls="text-sky-300 bg-sky-400/10 border-sky-400/20"
      title={a?.openedAt ? `Last opened ${relTime(a.openedAt)}` : undefined} />);
  }

  if (a?.emailedAt) {
    pills.push(<Pill key="em" icon={Mail} text={`Emailed ${relTime(a.emailedAt)}`}
      cls="text-blue-300 bg-blue-400/10 border-blue-400/20"
      title={a.lastTouchedName ? `by ${a.lastTouchedName}` : undefined} />);
  } else if (tags.has("emailed")) {
    pills.push(<Pill key="em2" icon={Mail} text="Emailed" cls="text-blue-300 bg-blue-400/10 border-blue-400/20" />);
  }

  if (tags.has("voicemail")) {
    pills.push(<Pill key="vm" icon={Voicemail} text={a?.calledAt ? `VM ${relTime(a.calledAt)}` : "Voicemail"}
      cls="text-purple-300 bg-purple-400/10 border-purple-400/20" />);
  } else if (tags.has("no_answer")) {
    pills.push(<Pill key="na" icon={PhoneOff} text={a?.calledAt ? `No answer ${relTime(a.calledAt)}` : "No answer"}
      cls="text-zinc-400 bg-zinc-400/10 border-zinc-400/20" />);
  } else if (a?.calledAt) {
    pills.push(<Pill key="cl" icon={Phone} text={`Called ${relTime(a.calledAt)}`}
      cls="text-zinc-300 bg-zinc-400/10 border-zinc-400/20"
      title={a.lastTouchedName ? `by ${a.lastTouchedName}` : undefined} />);
  } else if (tags.has("called")) {
    pills.push(<Pill key="cl2" icon={Phone} text="Called" cls="text-zinc-300 bg-zinc-400/10 border-zinc-400/20" />);
  }

  if (tags.has("not_interested")) {
    pills.push(<Pill key="ni" icon={XCircle} text="Pass" cls="text-zinc-500 bg-zinc-500/10 border-zinc-500/20" />);
  }
  if (tags.has("demo_sent") || previewUrl) {
    pills.push(<Pill key="demo" icon={Globe} text="Demo" cls="text-emerald-300 bg-emerald-400/10 border-emerald-400/20" />);
  }

  if (pills.length === 0) return null;

  return (
    <div className={`flex items-center gap-1 flex-wrap ${className}`}>
      {pills}
      {who && (a?.emailedAt || a?.calledAt) && (
        <span title={a?.lastTouchedName ? `Last touched by ${a.lastTouchedName}` : undefined}
          className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md text-[9px] font-bold text-white/70 bg-white/[0.06] border border-white/10 leading-none"
          style={H}>
          {who}
        </span>
      )}
    </div>
  );
}

// ─── Heat: one glanceable temperature ───────────────────────────────────────────
//
// The badge pile above answers "what has happened?" (a history log). A caller
// working a list needs two faster answers: "how hot is this?" and "what's my
// next move?". `deriveHeat` collapses everything into a SINGLE primary status via
// a strict priority cascade (first match wins), and `deriveNextAction` turns that
// into one instruction. The pile/filters (deriveTags) stay intact for the
// admin/detail views — this is an additive presentation layer.

export type HeatLevel = "won" | "hot" | "warm" | "cold" | "new" | "pass";

export interface Heat {
  level: HeatLevel;
  label: string;
  emoji: string;
  cls: string; // pill classes (color = temperature)
}

const HEAT_STYLES: Record<HeatLevel, { label: string; emoji: string; cls: string }> = {
  won:  { label: "WON",  emoji: "✅", cls: "text-green-400 bg-green-400/10 border-green-400/30" },
  hot:  { label: "HOT",  emoji: "🔥", cls: "text-[#F97316] bg-[#F97316]/15 border-[#F97316]/40" },
  warm: { label: "WARM", emoji: "🟡", cls: "text-amber-300 bg-amber-400/10 border-amber-400/25" },
  cold: { label: "COLD", emoji: "🔵", cls: "text-sky-300/80 bg-sky-400/[0.07] border-sky-400/20" },
  new:  { label: "NEW",  emoji: "⚪", cls: "text-zinc-300 bg-white/[0.06] border-white/15" },
  pass: { label: "PASS", emoji: "⚫", cls: "text-zinc-500 bg-zinc-500/10 border-zinc-500/20" },
};

// First match wins. Order encodes "hottest live signal beats older/cooler ones".
export function deriveHeat(
  actions: LeadAction | null | undefined,
  state: LeadStateLike | null | undefined,
  today: string,
  _extra?: { previewUrl?: string | null }
): Heat {
  const a = actions ?? {};
  const s = state ?? {};
  const lastOutcome = (a.lastOutcome ?? s.lastOutcome ?? "").toLowerCase();
  const status = (a.status ?? s.status ?? "").toLowerCase();
  const stage = (s.stage ?? "").toLowerCase();
  const called = !!a.calledAt || (a.callCount ?? s.callCount ?? 0) > 0;
  const emailed = !!a.emailedAt || (s.lastContacted != null && (status === "contacted" || stage === "contacted"));
  const fuDay = dayOf(a.followUpDate ?? s.followUpDate);
  const terminal = status === "won" || status === "not_interested" || ["won", "lost", "submitted"].includes(stage);
  const mk = (level: HeatLevel): Heat => ({ level, ...HEAT_STYLES[level] });

  if (status === "won" || stage === "won" || lastOutcome === "won") return mk("won");
  if (!!a.notInterestedAt || status === "not_interested" || lastOutcome === "not_interested") return mk("pass");
  if (a.respondedAt) return mk("hot");
  if (!!a.interestedAt || lastOutcome === "interested" || stage === "interested") return mk("hot");
  if (a.clickedAt) return mk("hot");
  if (fuDay && !terminal && fuDay <= today) return mk("warm");
  if (a.openedAt) return mk("warm");
  if (emailed || called) return mk("cold");
  return mk("new");
}

// ─── Next action: the one instruction ───────────────────────────────────────────

export interface NextAction { text: string; urgent: boolean }

export function deriveNextAction(
  actions: LeadAction | null | undefined,
  state: LeadStateLike | null | undefined,
  today: string,
  extra?: { previewUrl?: string | null }
): NextAction {
  const a = actions ?? {};
  const s = state ?? {};
  const lastOutcome = (a.lastOutcome ?? s.lastOutcome ?? "").toLowerCase();
  const status = (a.status ?? s.status ?? "").toLowerCase();
  const stage = (s.stage ?? "").toLowerCase();
  const hasDemo = !!extra?.previewUrl;
  const called = !!a.calledAt || (a.callCount ?? s.callCount ?? 0) > 0;
  const fuDay = dayOf(a.followUpDate ?? s.followUpDate);
  const terminal = status === "won" || status === "not_interested" || ["won", "lost", "submitted"].includes(stage);

  if (status === "won" || stage === "won" || lastOutcome === "won")
    return { text: "Closed — won", urgent: false };
  if (!!a.notInterestedAt || status === "not_interested" || lastOutcome === "not_interested")
    return { text: "Passed — no action", urgent: false };
  if (a.respondedAt)
    return { text: `Read & reply${a.respondedAt ? ` — replied ${relTime(a.respondedAt)}` : ""}`, urgent: true };
  if (!!a.interestedAt || lastOutcome === "interested" || stage === "interested")
    return hasDemo
      ? { text: "Send demo & close", urgent: true }
      : { text: "Push to Duke — build demo", urgent: true };
  if (a.clickedAt)
    return { text: `Call back — clicked ${relTime(a.clickedAt)}`, urgent: true };
  if (fuDay && !terminal && fuDay <= today)
    return { text: "Follow up today", urgent: true };
  if (a.openedAt)
    return { text: "Call to follow up — opened", urgent: false };
  if (lastOutcome === "voicemail" || stage === "voicemail")
    return { text: "Try again — left voicemail", urgent: false };
  if (lastOutcome === "no_answer")
    return { text: "Try again — no answer", urgent: false };
  if (called)
    return { text: "Follow up", urgent: false };
  if (a.emailedAt)
    return { text: "Call to follow up — emailed", urgent: false };
  return { text: "Call — never contacted", urgent: false };
}

// Compact, low-emphasis history string parts: demo · emailed 3d · called 1d · ⚠ bad email
export function leadMetaParts(
  actions: LeadAction | null | undefined,
  _state: LeadStateLike | null | undefined,
  extra?: { previewUrl?: string | null }
): string[] {
  const a = actions ?? {};
  const parts: string[] = [];
  if (extra?.previewUrl) parts.push("demo");
  if (a.emailedAt) parts.push(`emailed ${relTime(a.emailedAt)}`);
  if (a.clickedAt) parts.push(`clicked ${relTime(a.clickedAt)}`);
  else if (a.openedAt) parts.push(`opened${a.openedCount && a.openedCount > 1 ? ` ${a.openedCount}×` : ""}`);
  if (a.calledAt) parts.push(`called ${relTime(a.calledAt)}`);
  if (a.bouncedAt) parts.push("⚠ bad email");
  return parts;
}

// ─── Presentation: HeatPill + LeadStatusBlock (the "Heat + Next move" card) ──────

export function HeatPill({ heat, className = "" }: { heat: Heat; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border leading-none tracking-wide shrink-0 ${heat.cls} ${className}`}
      style={H}>
      <span aria-hidden className="text-[9px] leading-none">{heat.emoji}</span>
      {heat.label}
    </span>
  );
}

// The instruction line + a quiet meta line. Pair with <HeatPill> on the name row.
export function LeadStatusBlock({
  actions, state, today, previewUrl, showMeta = true, className = "",
}: {
  actions?: LeadAction | null;
  state?: LeadStateLike | null;
  today: string;
  previewUrl?: string | null;
  showMeta?: boolean;
  className?: string;
}) {
  const next = deriveNextAction(actions, state, today, { previewUrl });
  const meta = showMeta ? leadMetaParts(actions, state, { previewUrl }) : [];
  const who = showMeta ? initials(actions?.lastTouchedName) : "";
  const metaText = [meta.join(" · "), who].filter(Boolean).join(meta.length && who ? " · " : "");

  return (
    <div className={className}>
      <p className={`flex items-center gap-1 text-xs font-semibold ${next.urgent ? "text-[#F97316]" : "text-white/70"}`} style={H}>
        <ChevronRight size={11} className="shrink-0" />
        <span className="truncate">Next: {next.text}</span>
      </p>
      {metaText && (
        <p className="text-[11px] text-white/35 mt-0.5 truncate" style={H} title={metaText}>{metaText}</p>
      )}
    </div>
  );
}
