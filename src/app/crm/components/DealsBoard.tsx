"use client";

import { useMemo, useState } from "react";
import {
  Flame, Zap, Phone, Mail, User, TrendingUp, Trophy, Target,
  Kanban, ChevronRight,
} from "lucide-react";

/* These mirror the live data shapes Pipeline.tsx receives. DealsBoard is a drop-in
 * replacement for Pipeline, so it declares the SAME props signature and the same
 * inline Lead / LeadState / Submission shapes (Pipeline does not export them). */
interface Lead {
  id: string; name: string; category: string; phone: string; email: string;
  website: string; city: string; tier: string; outreach_score: number;
  claimedBy?: { userId: string; repName: string } | null;
}

interface LeadState {
  status: string; stage: string; notes: string;
  lastContacted?: string; callCount?: number; submittedAt?: string;
}

interface Submission { leadId: string; status: string; commissionAmount?: number; }

interface Props {
  leads: Lead[];
  states: Record<string, LeadState>;
  submissions: Submission[];
  onSelectLead: (lead: Lead) => void;
  // Optional drag-and-drop handler. When provided, cards become draggable and
  // dropping a card on another column reports the new live `stage` for the lead.
  // The board moves the card optimistically; the parent persists the change.
  onStageChange?: (leadId: string, stage: string) => void;
}

const H = { fontFamily: "var(--font-heading)" };
const money = (n: number) => "$" + Math.round(n).toLocaleString();

/* HubSpot-style deal stages derived from the live lead `state.stage`. Each column
 * carries a default win probability so the board can show a weighted forecast.
 * `stages` lists every live stage key that funnels into the column. */
interface StageCol {
  key: string;
  label: string;
  stages: string[];
  probability: number; // weighted-forecast weight (%)
  accent: string;      // text token / utility for the column title + count
  dot: string;         // status dot
  emptyHint: string;   // helpful empty-state message
  closed?: "won" | "lost";
}

const COLUMNS: StageCol[] = [
  {
    key: "new",
    label: "New",
    stages: ["to_call"],
    probability: 10,
    accent: "text-blue-500",
    dot: "bg-blue-500",
    emptyHint: "High-score leads appear here once you start working them.",
  },
  {
    key: "contacted",
    label: "Contacted",
    stages: ["called", "voicemail"],
    probability: 25,
    accent: "text-[var(--crm-text-2)]",
    dot: "bg-[var(--crm-text-3)]",
    emptyHint: "Log a call outcome to move leads into this column.",
  },
  {
    key: "interested",
    label: "Interested",
    stages: ["interested"],
    probability: 60,
    accent: "text-[var(--crm-accent-text)]",
    dot: "bg-[var(--crm-accent)]",
    emptyHint: "Mark a call \"interested\" to land deals here.",
  },
  {
    key: "submitted",
    label: "Submitted",
    stages: ["submitted"],
    probability: 80,
    accent: "text-amber-500",
    dot: "bg-amber-500",
    emptyHint: "Submit a proposal to track it here.",
  },
  {
    key: "won",
    label: "Won",
    stages: ["won"],
    probability: 100,
    accent: "text-emerald-500",
    dot: "bg-emerald-500",
    emptyHint: "Accepted submissions show up here.",
    closed: "won",
  },
];

/* Default deal value when there is no accepted submission to read a real commission
 * from. Higher-tier / higher-score leads are worth more in the pipeline forecast. */
function estimateValue(lead: Lead): number {
  const base = lead.tier === "A" ? 1200 : lead.tier === "B" ? 750 : 400;
  const scoreBoost = Math.round((lead.outreach_score || 0) * 4);
  return base + scoreBoost;
}

/* Each lead's deal value: prefer a real commission off its submission, else estimate. */
function dealValue(lead: Lead, subByLead: Map<string, Submission>): number {
  const sub = subByLead.get(lead.id);
  if (sub?.commissionAmount && sub.commissionAmount > 0) return sub.commissionAmount;
  return estimateValue(lead);
}

// Live `stage` value to persist when a card is dropped on a column — the first
// stage that funnels into that column (e.g. "Contacted" → "called").
const colDropStage = (col: StageCol): string => col.stages[0] ?? col.key;

// ── Skeleton card shown while data loads ─────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[var(--crm-border)] bg-[var(--crm-surface)] p-3 animate-pulse">
      <div className="h-3.5 w-3/4 rounded bg-[var(--crm-surface-3)] mb-2" />
      <div className="h-2.5 w-1/2 rounded bg-[var(--crm-surface-3)] mb-3" />
      <div className="h-4 w-1/3 rounded bg-[var(--crm-surface-3)]" />
    </div>
  );
}

// ── Skeleton column shown when the board is hydrating ────────────────────────
function SkeletonCol() {
  return (
    <div className="shrink-0 w-64 sm:flex-1 sm:min-w-[200px] flex flex-col rounded-2xl border border-[var(--crm-border)] bg-[var(--crm-surface-2)]">
      <div className="flex items-center gap-2 px-3.5 py-3 border-b border-[var(--crm-border)]">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--crm-surface-3)] animate-pulse" />
        <div className="h-2.5 w-20 rounded bg-[var(--crm-surface-3)] animate-pulse" />
      </div>
      <div className="p-2 space-y-2">
        {[1, 2].map((i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}

export default function DealsBoard({ leads, states, submissions, onSelectLead, onStageChange }: Props) {
  const dndEnabled = !!onStageChange;
  // Optimistic stage overrides applied on drop, keyed by leadId. Cleared per
  // lead once the parent's `states` catches up to the dropped value.
  const [moved, setMoved] = useState<Record<string, string>>({});
  // Column currently being hovered during a drag, for a drop-target highlight.
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  // Show skeletons until first real data arrives.
  const isLoading = leads.length === 0 && Object.keys(states).length === 0;

  const subByLead = useMemo(() => {
    const m = new Map<string, Submission>();
    for (const s of submissions) m.set(s.leadId, s);
    return m;
  }, [submissions]);

  function handleDrop(col: StageCol, leadId: string) {
    setDragOverCol(null);
    if (!onStageChange || !leadId) return;
    const target = colDropStage(col);
    const current = moved[leadId] ?? states[leadId]?.stage ?? "to_call";
    if (current === target) return;
    setMoved((m) => ({ ...m, [leadId]: target })); // optimistic local move
    onStageChange(leadId, target);
  }

  // Bucket leads into HubSpot-style columns from their (possibly overridden) stage.
  const board = useMemo(() => {
    const stageToCol = new Map<string, StageCol>();
    for (const col of COLUMNS) for (const s of col.stages) stageToCol.set(s, col);

    const buckets: Record<string, Lead[]> = Object.fromEntries(COLUMNS.map((c) => [c.key, []]));
    for (const lead of leads) {
      const state = states[lead.id];
      const override = moved[lead.id];
      const realStage = state?.stage || "to_call";
      const stage = override && override !== realStage ? override : realStage;
      // Surface untouched leads in "New" only if they have activity or a strong
      // score — unless the rep just dragged one here, which always shows it.
      if (stage === "to_call" && !override && !state?.lastContacted && (lead.outreach_score ?? 0) < 80) continue;
      const col = stageToCol.get(stage);
      if (col) buckets[col.key].push(lead);
    }

    // Sort each column by deal value, biggest first.
    for (const key of Object.keys(buckets)) {
      buckets[key].sort((a, b) => dealValue(b, subByLead) - dealValue(a, subByLead));
    }
    return buckets;
  }, [leads, states, subByLead, moved]);

  // Per-column $ totals + a weighted pipeline forecast across open columns.
  const { colTotals, openValue, weighted, wonValue, openCount } = useMemo(() => {
    const colTotals: Record<string, number> = {};
    let openValue = 0, weighted = 0, wonValue = 0, openCount = 0;
    for (const col of COLUMNS) {
      const total = board[col.key].reduce((s, l) => s + dealValue(l, subByLead), 0);
      colTotals[col.key] = total;
      if (col.closed === "won") {
        wonValue += total;
      } else {
        openValue += total;
        openCount += board[col.key].length;
        weighted += total * (col.probability / 100);
      }
    }
    return { colTotals, openValue, weighted, wonValue, openCount };
  }, [board, subByLead]);

  const stats = [
    { label: "Open pipeline", value: money(openValue), sub: `${openCount} deal${openCount === 1 ? "" : "s"}`, icon: TrendingUp, accent: false },
    { label: "Weighted forecast", value: money(weighted), sub: "value × probability", icon: Target, accent: true },
    { label: "Won", value: money(wonValue), sub: `${board["won"].length} deal${board["won"].length === 1 ? "" : "s"}`, icon: Trophy, accent: false },
  ];

  if (isLoading) {
    return (
      <div className="space-y-5" style={H}>
        {/* Skeleton stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-[var(--crm-border)] bg-[var(--crm-surface)] p-4 animate-pulse">
              <div className="h-2.5 w-24 rounded bg-[var(--crm-surface-3)] mb-3" />
              <div className="h-7 w-20 rounded bg-[var(--crm-surface-3)] mb-2" />
              <div className="h-2 w-16 rounded bg-[var(--crm-surface-3)]" />
            </div>
          ))}
        </div>
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {COLUMNS.map((col) => <SkeletonCol key={col.key} />)}
        </div>
      </div>
    );
  }

  const totalDeals = openCount + board["won"].length;

  return (
    <div className="space-y-5" style={H}>
      {/* Forecast header — HubSpot-style summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label}
              className="rounded-2xl border border-[var(--crm-border)] bg-[var(--crm-surface)] p-4">
              <div className="flex items-center gap-1.5">
                <Icon
                  size={12}
                  className={s.accent ? "text-[var(--crm-accent)]" : "text-[var(--crm-text-3)]"}
                  aria-hidden="true"
                />
                <p className="text-[11px] uppercase tracking-wide text-[var(--crm-text-3)] font-semibold">
                  {s.label}
                </p>
              </div>
              <p className={`text-2xl font-bold tabular-nums mt-1 ${s.accent ? "text-[var(--crm-accent-text)]" : "text-[var(--crm-text)]"}`}>
                {s.value}
              </p>
              <p className="text-[11px] text-[var(--crm-text-3)] mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Empty board state — no qualifying leads yet */}
      {totalDeals === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--crm-border)] bg-[var(--crm-surface-2)] py-16 px-6 text-center">
          <Kanban size={32} className="text-[var(--crm-text-3)]" aria-hidden="true" />
          <p className="text-sm font-semibold text-[var(--crm-text-2)]">Your pipeline is empty</p>
          <p className="text-xs text-[var(--crm-text-3)] max-w-xs">
            Start making calls and logging outcomes — leads will appear here as they
            progress through your funnel.
          </p>
        </div>
      )}

      {/* Kanban — horizontal scroll on mobile, flexible columns on desktop */}
      {totalDeals > 0 && (
        <div
          className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x"
          role="list"
          aria-label="Deals board columns"
        >
          {COLUMNS.map((col) => {
            const items = board[col.key] ?? [];
            const total = colTotals[col.key] ?? 0;
            const isDropTarget = dragOverCol === col.key;
            return (
              <div
                key={col.key}
                role="listitem"
                onDragOver={dndEnabled ? (e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragOverCol !== col.key) setDragOverCol(col.key);
                } : undefined}
                onDragLeave={dndEnabled ? (e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragOverCol((c) => (c === col.key ? null : c));
                  }
                } : undefined}
                onDrop={dndEnabled ? (e) => {
                  e.preventDefault();
                  handleDrop(col, e.dataTransfer.getData("text/plain"));
                } : undefined}
                aria-label={`${col.label} column, ${items.length} deal${items.length === 1 ? "" : "s"}`}
                className={[
                  "shrink-0 w-64 sm:flex-1 sm:min-w-[200px] snap-start flex flex-col rounded-2xl border",
                  "bg-[var(--crm-surface-2)] transition-colors duration-150",
                  isDropTarget
                    ? "border-[var(--crm-accent)] bg-[var(--crm-accent-weak)] shadow-[0_0_0_1px_var(--crm-accent-border)]"
                    : "border-[var(--crm-border)]",
                ].join(" ")}
              >
                {/* Column header */}
                <div className="flex items-center justify-between gap-2 px-3.5 py-3 border-b border-[var(--crm-border)]">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${col.dot}`} aria-hidden="true" />
                    <span className={`text-xs font-bold uppercase tracking-wide truncate ${col.accent}`}>
                      {col.label}
                    </span>
                    <span className="text-[11px] text-[var(--crm-text-3)] tabular-nums shrink-0">
                      {items.length}
                    </span>
                  </div>
                  {total > 0 && (
                    <span className="text-[11px] font-semibold text-[var(--crm-text-2)] tabular-nums shrink-0">
                      {money(total)}
                    </span>
                  )}
                </div>

                {/* Cards */}
                <div className="p-2 space-y-2 min-h-[120px] flex-1">
                  {items.slice(0, 12).map((lead) => (
                    <DealCard
                      key={lead.id}
                      lead={lead}
                      value={dealValue(lead, subByLead)}
                      sub={subByLead.get(lead.id)}
                      onClick={() => onSelectLead(lead)}
                      draggable={dndEnabled}
                    />
                  ))}
                  {items.length > 12 && (
                    <button
                      className="w-full text-center text-[11px] text-[var(--crm-text-3)] py-2 hover:text-[var(--crm-text-2)] transition-colors flex items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)] rounded"
                      onClick={() => onSelectLead(items[12])}
                      aria-label={`Show ${items.length - 12} more deals in ${col.label}`}
                    >
                      <ChevronRight size={10} aria-hidden="true" />
                      {items.length - 12} more
                    </button>
                  )}
                  {items.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-1.5 py-8 px-2 text-center">
                      <p className="text-[11px] text-[var(--crm-text-3)]">
                        {isDropTarget ? "Drop here" : "Empty"}
                      </p>
                      {!isDropTarget && (
                        <p className="text-[10px] text-[var(--crm-text-3)] leading-relaxed">
                          {col.emptyHint}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-[var(--crm-text-3)] text-center">
        Click a deal to open it{dndEnabled ? " · Drag cards between columns to move stages" : " · Stages advance as you log call outcomes"}
      </p>
    </div>
  );
}

function DealCard({ lead, value, sub, onClick, draggable }: {
  lead: Lead; value: number; sub?: Submission; onClick: () => void; draggable?: boolean;
}) {
  const won = sub?.status === "accepted";
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      draggable={draggable}
      onDragStart={draggable ? (e) => {
        e.dataTransfer.setData("text/plain", lead.id);
        e.dataTransfer.effectAllowed = "move";
      } : undefined}
      aria-label={`${lead.name}, ${lead.city}, ${money(value)}${won ? ", won" : ""}`}
      className={[
        "group rounded-xl border border-[var(--crm-border)] bg-[var(--crm-surface)] p-3",
        "hover:border-[var(--crm-accent-border)] hover:shadow-[0_2px_8px_-2px_var(--crm-bg-glow)]",
        "transition-all duration-150 active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)] focus-visible:ring-offset-1",
        draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-1.5">
        <p className="text-sm font-semibold text-[var(--crm-text)] leading-tight line-clamp-2 flex-1">
          {lead.name}
        </p>
        {lead.tier === "A" && (
          <Flame size={12} className="text-[var(--crm-accent)] shrink-0 mt-0.5" aria-label="Tier A" />
        )}
        {lead.tier === "B" && (
          <Zap size={12} className="text-amber-500 shrink-0 mt-0.5" aria-label="Tier B" />
        )}
      </div>
      <p className="text-[10px] text-[var(--crm-text-3)] mt-1 truncate">
        {lead.city} · {lead.category.replace(/_/g, " ")}
      </p>
      <p className={`text-sm font-bold tabular-nums mt-1.5 ${won ? "text-emerald-500" : "text-[var(--crm-accent-text)]"}`}>
        {money(value)}
      </p>
      <div className="flex items-center gap-2 mt-1.5 text-[var(--crm-text-3)]">
        {lead.phone && <Phone size={10} aria-label="Has phone" />}
        {lead.email && <Mail size={10} aria-label="Has email" />}
        {lead.claimedBy?.repName && (
          <span className="text-[10px] truncate flex items-center gap-0.5">
            <User size={9} className="shrink-0" aria-hidden="true" />
            {lead.claimedBy.repName}
          </span>
        )}
      </div>
    </div>
  );
}
