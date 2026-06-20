"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Home,
  AlertCircle,
  RefreshCw,
  CalendarClock,
  MessageSquareReply,
  Mail,
  Inbox,
  ChevronRight,
  Clock,
  Flame,
} from "lucide-react";

const H = { fontFamily: "var(--font-heading)" };

export type TodayItemReason = "overdue-followup" | "followup-today" | "reply" | "email-open";

export interface TodayItem {
  leadId: string;
  leadName: string;
  reason: TodayItemReason;
  priority: number;
  when: string;
  daysOverdue?: number;
  replySnippet?: string;
  replySubject?: string;
}

interface TodayCounts {
  overdueFollowups: number;
  followupsToday: number;
  replies: number;
  emailOpens: number;
}

interface TodayResponse {
  items: TodayItem[];
  counts: TodayCounts;
}

interface Props {
  onSelectLead: (leadId: string, leadName: string) => void;
}

// ── Reason chip config ─────────────────────────────────────────────────────────

const REASON_CONFIG: Record<
  TodayItemReason,
  { label: string; tone: string; icon: React.ReactNode }
> = {
  "overdue-followup": {
    label: "Overdue",
    tone: "text-red-500 bg-red-500/10 border-red-500/20",
    icon: <AlertCircle size={10} aria-hidden="true" />,
  },
  "followup-today": {
    label: "Due today",
    tone: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    icon: <CalendarClock size={10} aria-hidden="true" />,
  },
  reply: {
    label: "Replied",
    tone: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    icon: <MessageSquareReply size={10} aria-hidden="true" />,
  },
  "email-open": {
    label: "Opened email",
    tone: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    icon: <Mail size={10} aria-hidden="true" />,
  },
};

function relTime(iso: string): string {
  const diff = Date.now() - Date.parse(iso);
  if (isNaN(diff)) return "";
  const mins = Math.floor(diff / 60_000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ── KPI strip ─────────────────────────────────────────────────────────────────

function KpiStrip({ counts }: { counts: TodayCounts }) {
  const total = counts.overdueFollowups + counts.followupsToday + counts.replies + counts.emailOpens;
  const kpis = [
    {
      label: "Overdue",
      value: counts.overdueFollowups,
      tone: counts.overdueFollowups > 0 ? "text-red-500" : "text-[var(--crm-text-3)]",
      bg: counts.overdueFollowups > 0 ? "bg-red-500/8 border-red-500/15" : "bg-[var(--crm-surface-2)] border-[var(--crm-border)]",
    },
    {
      label: "Due today",
      value: counts.followupsToday,
      tone: counts.followupsToday > 0 ? "text-amber-500" : "text-[var(--crm-text-3)]",
      bg: "bg-[var(--crm-surface-2)] border-[var(--crm-border)]",
    },
    {
      label: "Replies",
      value: counts.replies,
      tone: counts.replies > 0 ? "text-blue-500" : "text-[var(--crm-text-3)]",
      bg: "bg-[var(--crm-surface-2)] border-[var(--crm-border)]",
    },
    {
      label: "Opened",
      value: counts.emailOpens,
      tone: counts.emailOpens > 0 ? "text-emerald-500" : "text-[var(--crm-text-3)]",
      bg: "bg-[var(--crm-surface-2)] border-[var(--crm-border)]",
    },
  ];

  return (
    <div className="space-y-3" aria-label={`${total} action${total !== 1 ? "s" : ""} to take today`}>
      {/* Hero line */}
      <div className="flex items-end gap-3 px-1">
        <p className="text-4xl font-bold text-[var(--crm-text)] leading-none tabular-nums" style={H} aria-hidden="true">
          {total}
        </p>
        <div className="pb-1">
          <p className="text-sm font-semibold text-[var(--crm-text-2)] leading-tight" style={H}>
            action{total !== 1 ? "s" : ""} to take
          </p>
          {counts.overdueFollowups > 0 && (
            <p className="text-xs text-red-500 font-semibold mt-0.5" style={H}>
              {counts.overdueFollowups} overdue
            </p>
          )}
        </div>
      </div>
      {/* KPI tiles — 2-col on xs, 4-col at sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={`rounded-xl border px-3 py-2.5 text-center ${k.bg}`}
          >
            <p className={`text-xl font-bold tabular-nums leading-none ${k.tone}`} style={H}>
              {k.value}
            </p>
            <p className="text-[10px] font-semibold text-[var(--crm-text-3)] mt-1 leading-none" style={H}>
              {k.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Loading skeleton ───────────────────────────────────────────────────────────

function TodaySkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {/* Hero + KPI strip skeleton */}
      <div className="flex items-end gap-3 px-1">
        <div className="w-16 h-10 rounded-lg bg-[var(--crm-surface-2)] animate-pulse" />
        <div className="pb-1 space-y-1.5">
          <div className="w-28 h-3.5 rounded bg-[var(--crm-surface-2)] animate-pulse" />
          <div className="w-16 h-2.5 rounded bg-[var(--crm-surface-2)] animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl h-14 bg-[var(--crm-surface-2)] animate-pulse" />
        ))}
      </div>
      {/* Action card skeletons */}
      <div className="space-y-2.5 pt-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="crm-surface rounded-2xl overflow-hidden animate-pulse">
            {/* reason bar */}
            <div className="h-8 bg-[var(--crm-surface-3)]" />
            {/* body */}
            <div className="flex items-center gap-3 px-3.5 py-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--crm-surface-3)]" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 rounded bg-[var(--crm-surface-3)]" style={{ width: `${55 + i * 10}%` }} />
                <div className="h-2.5 w-1/3 rounded bg-[var(--crm-surface-3)]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Action card ───────────────────────────────────────────────────────────────

function ActionCard({
  item,
  onSelect,
}: {
  item: TodayItem;
  onSelect: () => void;
}) {
  const cfg = REASON_CONFIG[item.reason];
  const isOverdue = item.reason === "overdue-followup";

  const reasonBarClass = isOverdue
    ? "bg-red-500/8 border-red-500/15"
    : item.reason === "reply"
    ? "bg-blue-500/8 border-blue-500/15"
    : item.reason === "email-open"
    ? "bg-emerald-500/8 border-emerald-500/15"
    : "bg-amber-500/8 border-amber-500/15";

  const avatarClass = isOverdue
    ? "bg-red-500/10 text-red-500"
    : item.reason === "reply"
    ? "bg-blue-500/10 text-blue-500"
    : "bg-[var(--crm-accent-weak)] text-[var(--crm-accent-text)]";

  return (
    <button
      onClick={onSelect}
      aria-label={`${cfg.label}: ${item.leadName}${isOverdue && item.daysOverdue ? `, ${item.daysOverdue} day${item.daysOverdue !== 1 ? "s" : ""} overdue` : ""}`}
      className={[
        "w-full text-left crm-surface crm-surface-hover rounded-2xl overflow-hidden group",
        "transition-all active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent-border)]",
        isOverdue ? "ring-1 ring-red-500/20" : "",
      ].join(" ")}
    >
      {/* Reason bar */}
      <div className={`flex items-center gap-2 px-3.5 py-2 border-b ${reasonBarClass}`}>
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold ${cfg.tone.split(" ")[0]}`}
          style={H}
        >
          {cfg.icon}
          {cfg.label}
          {isOverdue && item.daysOverdue && item.daysOverdue > 0
            ? ` · ${item.daysOverdue}d`
            : null}
        </span>
        <span className="ml-auto text-[11px] text-[var(--crm-text-3)] flex items-center gap-1" style={H}>
          <Clock size={9} aria-hidden="true" />
          {relTime(item.when)}
        </span>
      </div>

      {/* Card body */}
      <div className="flex items-center gap-3 px-3.5 py-3">
        {/* Avatar initial */}
        <div
          className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${avatarClass}`}
          style={H}
          aria-hidden="true"
        >
          {item.leadName.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-bold text-[var(--crm-text)] truncate group-hover:text-[var(--crm-accent-text)] transition-colors"
            style={H}
          >
            {item.leadName}
          </p>

          {/* Context line */}
          {item.reason === "reply" && (item.replySubject || item.replySnippet) && (
            <p className="text-xs text-[var(--crm-text-3)] truncate mt-0.5" style={H}>
              {item.replySubject
                ? `Re: ${item.replySubject}`
                : item.replySnippet}
            </p>
          )}
          {(item.reason === "overdue-followup" || item.reason === "followup-today") && (
            <p className="text-xs text-[var(--crm-text-3)] mt-0.5" style={H}>
              Follow-up{item.daysOverdue && item.daysOverdue > 0
                ? ` — ${item.daysOverdue} day${item.daysOverdue !== 1 ? "s" : ""} overdue`
                : " due today"}
            </p>
          )}
          {item.reason === "email-open" && (
            <p className="text-xs text-[var(--crm-text-3)] mt-0.5" style={H}>
              Opened your outreach email
            </p>
          )}
        </div>

        <ChevronRight
          size={15}
          aria-hidden="true"
          className="shrink-0 text-[var(--crm-text-3)] group-hover:text-[var(--crm-accent-text)] group-hover:translate-x-0.5 transition-all"
        />
      </div>

      {/* Reply snippet preview (beneath body for replies) */}
      {item.reason === "reply" && item.replySnippet && item.replySubject && (
        <div className="px-3.5 pb-3 -mt-1">
          <p className="text-xs text-[var(--crm-text-3)] line-clamp-2 leading-relaxed bg-[var(--crm-bg)] border border-[var(--crm-border)] rounded-lg px-2.5 py-2">
            {item.replySnippet}
          </p>
        </div>
      )}
    </button>
  );
}

// ── Group labels ───────────────────────────────────────────────────────────────

const GROUP_ORDER: TodayItemReason[] = ["overdue-followup", "followup-today", "reply", "email-open"];
const GROUP_LABELS: Record<TodayItemReason, string> = {
  "overdue-followup": "Overdue follow-ups",
  "followup-today": "Due today",
  reply: "Replied to your outreach",
  "email-open": "Opened your email recently",
};

// ── Main export ───────────────────────────────────────────────────────────────

export default function TodayQueue({ onSelectLead }: Props) {
  const [data, setData] = useState<TodayResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/crm/today");
      if (!res.ok) throw new Error(`${res.status}`);
      const json: TodayResponse = await res.json();
      setData(json);
    } catch {
      setError("Could not load today's queue.");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { load(); }, [load]);

  const isEmpty = data && data.items.length === 0;
  const total = data ? data.items.length : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Home size={16} className="text-[var(--crm-accent)]" aria-hidden="true" />
          <h2 className="text-sm font-bold text-[var(--crm-text)]" style={H}>
            Today
          </h2>
          {!loading && total > 0 && (
            <span className="text-xs text-[var(--crm-text-3)]" style={H}>
              {total} item{total !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <button
          onClick={load}
          aria-label="Refresh today's queue"
          className="inline-flex items-center gap-1.5 min-h-[36px] px-2 text-xs text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] transition-colors rounded-lg hover:bg-[var(--crm-surface-3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent-border)]"
          style={H}
        >
          <RefreshCw size={12} aria-hidden="true" />Refresh
        </button>
      </div>

      {/* Loading skeleton */}
      {loading && <TodaySkeleton />}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 crm-surface rounded-2xl text-center px-6">
          <AlertCircle size={22} className="text-red-400/80" aria-hidden="true" />
          <p className="text-sm text-[var(--crm-text-2)]" style={H}>{error}</p>
          <button
            onClick={load}
            className="text-xs font-semibold text-[var(--crm-accent-text)] hover:opacity-80 min-h-[36px] px-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent-border)]"
            style={H}
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && isEmpty && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 crm-surface rounded-2xl text-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-[var(--crm-accent-weak)] flex items-center justify-center mb-1">
            <Flame size={28} className="text-[var(--crm-accent)]" aria-hidden="true" />
          </div>
          <p className="text-base font-bold text-[var(--crm-text)]" style={H}>
            All clear — nice work!
          </p>
          <p className="text-sm text-[var(--crm-text-3)] max-w-xs leading-relaxed" style={H}>
            No overdue follow-ups, no replies waiting. Head to Follow-ups or Demos to keep the pipeline moving.
          </p>
        </div>
      )}

      {/* KPI strip + action list */}
      {!loading && !error && data && data.items.length > 0 && (
        <>
          <KpiStrip counts={data.counts} />

          <div className="space-y-2.5">
            {GROUP_ORDER.map((reason) => {
              const groupItems = data.items.filter((i) => i.reason === reason);
              if (groupItems.length === 0) return null;
              return (
                <div key={reason} className="space-y-2">
                  <p
                    className="text-[11px] font-semibold text-[var(--crm-text-3)] uppercase tracking-wide px-0.5 pt-1"
                    style={H}
                  >
                    {GROUP_LABELS[reason]}
                    <span className="ml-1.5 font-bold text-[var(--crm-text-2)]">
                      {groupItems.length}
                    </span>
                  </p>
                  {groupItems.map((item) => (
                    <ActionCard
                      key={item.leadId}
                      item={item}
                      onSelect={() => onSelectLead(item.leadId, item.leadName)}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="flex items-center justify-center gap-2 pt-2 pb-4">
            <Inbox size={12} className="text-[var(--crm-text-3)]" aria-hidden="true" />
            <p className="text-xs text-[var(--crm-text-3)]" style={H}>
              Click any card to open the full lead workspace
            </p>
          </div>
        </>
      )}
    </div>
  );
}
