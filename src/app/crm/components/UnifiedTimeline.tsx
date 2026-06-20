"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  PhoneMissed,
  PhoneOff,
  CalendarClock,
  ThumbsUp,
  ThumbsDown,
  Mail,
  MailOpen,
  MousePointerClick,
  AlertTriangle,
  StickyNote,
  Send,
  GitBranch,
  Trophy,
  MessageSquare,
  CheckCircle2,
  CircleDashed,
  Clock,
  type LucideIcon,
} from "lucide-react";

// Mirrors the shape returned by GET /api/crm/timeline.
type TimelineKind = "call" | "email" | "note" | "stage" | "task" | "reply";

interface TimelineEvent {
  id: string;
  ts: string;
  kind: TimelineKind;
  icon: string;
  title: string;
  detail?: string;
  who?: string;
  outcome?: string;
}

// Map the route's semantic icon hint → a concrete lucide icon. Falls back per
// kind, then to a clock, so an unknown hint never renders blank.
const ICONS: Record<string, LucideIcon> = {
  phone: Phone,
  "phone-missed": PhoneMissed,
  "phone-off": PhoneOff,
  "calendar-clock": CalendarClock,
  "thumbs-up": ThumbsUp,
  "thumbs-down": ThumbsDown,
  mail: Mail,
  "mail-open": MailOpen,
  "mouse-pointer-click": MousePointerClick,
  "alert-triangle": AlertTriangle,
  "sticky-note": StickyNote,
  send: Send,
  "git-branch": GitBranch,
  trophy: Trophy,
  "message-square": MessageSquare,
  "check-circle": CheckCircle2,
  "circle-dashed": CircleDashed,
  clock: Clock,
};

const KIND_FALLBACK: Record<TimelineKind, LucideIcon> = {
  call: Phone,
  email: Mail,
  note: StickyNote,
  stage: GitBranch,
  task: CircleDashed,
  reply: MessageSquare,
};

// Per-event accent (icon dot tint). Outcome refines a few high-signal cases so
// "interested"/"won"/replies pop and bounces warn. All mid-tone, AA on light.
function accentClass(ev: TimelineEvent): string {
  if (ev.outcome === "interested" || ev.outcome === "won" || ev.kind === "reply") return "text-emerald-500";
  if (ev.outcome === "not_interested" || ev.outcome === "bounced" || ev.outcome === "complained") return "text-red-500";
  if (ev.outcome === "clicked") return "text-amber-500";
  switch (ev.kind) {
    case "call":
      return "text-amber-500";
    case "email":
      return "text-blue-500";
    case "note":
      return "text-amber-500";
    case "stage":
      return "text-[var(--crm-accent)]";
    case "task":
      return "text-blue-500";
    default:
      return "text-[var(--crm-text-3)]";
  }
}

function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Date.now() - t;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months !== 1 ? "s" : ""} ago`;
}

function iconFor(ev: TimelineEvent): LucideIcon {
  return ICONS[ev.icon] ?? KIND_FALLBACK[ev.kind] ?? Clock;
}

export default function UnifiedTimeline({ leadId }: { leadId: string }) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const H = { fontFamily: "var(--font-heading)" };

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show loading while fetching on leadId change
    setLoading(true);
    fetch(`/api/crm/timeline?leadId=${encodeURIComponent(leadId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && Array.isArray(d)) setEvents(d);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [leadId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="w-4 h-4 border-2 border-[var(--crm-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!events.length) {
    return (
      <p className="text-xs text-[var(--crm-text-3)] text-center py-6" style={H}>
        No activity yet
      </p>
    );
  }

  return (
    <ol className="relative space-y-0">
      {events.map((ev, i) => {
        const Icon = iconFor(ev);
        const isLast = i === events.length - 1;
        return (
          <li key={ev.id} className="relative flex gap-3 pb-3">
            {/* Connector rail (hidden on the last item) */}
            {!isLast && (
              <span
                aria-hidden
                className="absolute left-[13px] top-7 bottom-0 w-px bg-[var(--crm-border)]"
              />
            )}
            {/* Icon dot */}
            <span className="relative z-10 mt-0.5 flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full border border-[var(--crm-border)] bg-[var(--crm-surface-2)]">
              <Icon size={13} className={accentClass(ev)} />
            </span>
            {/* Body */}
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-xs font-semibold text-[var(--crm-text)]" style={H}>
                  {ev.title}
                </span>
                <span className="shrink-0 text-[10px] text-[var(--crm-text-3)]" style={H}>
                  {timeAgo(ev.ts)}
                </span>
              </div>
              {ev.who && (
                <p className="mt-0.5 text-[10px] text-[var(--crm-text-3)]" style={H}>
                  {ev.who}
                </p>
              )}
              {ev.detail && (
                <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-relaxed text-[var(--crm-text-2)]" style={H}>
                  {ev.detail}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
