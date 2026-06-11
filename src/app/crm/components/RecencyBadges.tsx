"use client";

// Shared, self-contained module for the durable cross-rep action badges/filters.
// It deliberately does NOT import from @/lib/db (server-only Redis) — it carries a
// structural LeadAction type that matches the JSON the leads API attaches as
// `lead.actions`, plus the per-user LeadState as a fallback when no global stamp
// exists yet. Pure & client-safe so it can be used in any list view.

import {
  Mail, Phone, Voicemail, Star, CalendarClock, XCircle, Trophy,
  Globe, PhoneOff, CircleDashed, MailOpen, MousePointerClick,
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
  | "no_answer";

export const TAG_DEFS: { key: TagKey; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: "not_contacted", label: "Not contacted", icon: CircleDashed },
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

  if (a.emailedAt || a.openedAt || a.clickedAt) tags.add("emailed");
  else if (emailed) tags.add("emailed");
  if (a.openedAt) tags.add("opened");
  if (a.clickedAt) tags.add("clicked");
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
