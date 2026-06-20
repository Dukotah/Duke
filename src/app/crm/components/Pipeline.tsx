"use client";

import { useMemo, useState } from "react";
import {
  Flame, Zap, Phone, Mail, Search, X, ArrowUpDown, User,
  Filter, Kanban,
} from "lucide-react";

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
  // dropping a card on a stage column reports the new live `stage` for the lead.
  // The board moves the card optimistically; the parent persists the change.
  onStageChange?: (leadId: string, stage: string) => void;
}

const STAGES = [
  {
    key: "to_call",
    label: "To Call",
    color: "text-blue-500",
    border: "border-[var(--crm-border)]",
    bg: "bg-[var(--crm-surface-2)]",
    dot: "bg-blue-500",
    emptyHint: "High-score & active leads land here.",
  },
  {
    key: "called",
    label: "Called",
    color: "text-[var(--crm-text-2)]",
    border: "border-[var(--crm-border)]",
    bg: "bg-[var(--crm-surface-2)]",
    dot: "bg-[var(--crm-text-3)]",
    emptyHint: "Log a \"no answer\" call to move leads here.",
  },
  {
    key: "voicemail",
    label: "Voicemail",
    color: "text-purple-500",
    border: "border-[var(--crm-border)]",
    bg: "bg-[var(--crm-surface-2)]",
    dot: "bg-purple-500",
    emptyHint: "Logged voicemails appear here.",
  },
  {
    key: "interested",
    label: "Interested",
    color: "text-[var(--crm-accent-text)]",
    border: "border-[var(--crm-accent-border)]",
    bg: "bg-[var(--crm-accent-weak)]",
    dot: "bg-[var(--crm-accent)]",
    emptyHint: "Mark a call \"interested\" to track hot leads.",
  },
  {
    key: "submitted",
    label: "Submitted",
    color: "text-amber-500",
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    dot: "bg-amber-500",
    emptyHint: "Submit a proposal to track it here.",
  },
  {
    key: "won",
    label: "Won",
    color: "text-emerald-500",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    dot: "bg-emerald-500",
    emptyHint: "Accepted submissions appear here.",
  },
] as const;

type SortKey = "score" | "name" | "recent";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "score", label: "Best score" },
  { key: "name", label: "Name A–Z" },
  { key: "recent", label: "Recently contacted" },
];

const H = { fontFamily: "var(--font-heading)" };

// Mirror the select styling used in the Leads view for consistency.
function PipelineSelect<T extends string>({
  value, onChange, children, icon: Icon, label,
}: {
  value: T;
  onChange: (v: T) => void;
  children: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  label?: string;
}) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={12}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--crm-text-3)] pointer-events-none"
          aria-hidden="true"
        />
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        aria-label={label}
        className={[
          Icon ? "pl-8" : "pl-3",
          "pr-6 py-2 min-h-[40px] rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)]",
          "text-sm text-[var(--crm-text)] focus:outline-none focus:border-[var(--crm-accent-border)]",
          "focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)] focus-visible:ring-offset-1",
          "transition-colors appearance-none",
        ].join(" ")}
        style={H}
      >
        {children}
      </select>
    </div>
  );
}

// ── Skeleton card shown while data loads ─────────────────────────────────────
function SkeletonMiniCard() {
  return (
    <div className="bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-xl p-3 animate-pulse">
      <div className="h-3 w-3/4 rounded bg-[var(--crm-surface-3)] mb-2" />
      <div className="h-2.5 w-1/2 rounded bg-[var(--crm-surface-3)] mb-2" />
      <div className="h-2 w-1/4 rounded bg-[var(--crm-surface-3)]" />
    </div>
  );
}

function MiniCard({
  lead, state, sub, onClick, draggable,
}: {
  lead: Lead; state: LeadState; sub?: Submission; onClick: () => void; draggable?: boolean;
}) {
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
      aria-label={`${lead.name}, ${lead.city}${sub?.commissionAmount ? `, $${sub.commissionAmount}` : ""}`}
      className={[
        "bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-xl p-3",
        "hover:border-[var(--crm-accent-border)] hover:shadow-[0_2px_8px_-2px_var(--crm-bg-glow)]",
        "transition-all duration-150 group active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)] focus-visible:ring-offset-1",
        draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-1">
        <p className="text-xs font-bold text-[var(--crm-text)] leading-tight line-clamp-2 flex-1" style={H}>
          {lead.name}
        </p>
        {lead.tier === "A" && (
          <Flame size={10} className="text-[var(--crm-accent)] shrink-0 mt-0.5" aria-label="Tier A" />
        )}
        {lead.tier === "B" && (
          <Zap size={10} className="text-amber-500 shrink-0 mt-0.5" aria-label="Tier B" />
        )}
      </div>
      <p className="text-[10px] text-[var(--crm-text-3)] mt-1 truncate" style={H}>
        {lead.city} · {lead.category.replace(/_/g, " ")}
      </p>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {lead.phone && <Phone size={9} className="text-[var(--crm-text-3)]" aria-label="Has phone" />}
        {lead.email && <Mail size={9} className="text-[var(--crm-text-3)]" aria-label="Has email" />}
        {!!state.callCount && (
          <span className="text-[10px] text-[var(--crm-text-3)]" style={H}>{state.callCount}x</span>
        )}
        {lead.claimedBy && (
          <span className="text-[10px] text-[var(--crm-text-3)] truncate flex items-center gap-0.5" style={H}>
            <User size={8} className="shrink-0" aria-hidden="true" />
            {lead.claimedBy.repName}
          </span>
        )}
        {sub?.status === "accepted" && sub.commissionAmount && (
          <span className="text-[10px] text-emerald-500 font-bold ml-auto" style={H}>
            ${sub.commissionAmount.toFixed(0)}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Pipeline({ leads, states, submissions, onSelectLead, onStageChange }: Props) {
  const [q, setQ] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("");
  const [owner, setOwner] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortKey>("score");
  const dndEnabled = !!onStageChange;
  // Optimistic stage overrides applied on drop, keyed by leadId. An override
  // wins over the real state until the parent's `states` catches up.
  const [moved, setMoved] = useState<Record<string, string>>({});
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  // Show skeletons until first real data arrives.
  const isLoading = leads.length === 0 && Object.keys(states).length === 0;

  function handleDrop(stageKey: string, leadId: string) {
    setDragOverStage(null);
    if (!onStageChange || !leadId) return;
    const current = moved[leadId] ?? states[leadId]?.stage ?? "to_call";
    if (current === stageKey) return;
    setMoved((m) => ({ ...m, [leadId]: stageKey })); // optimistic local move
    onStageChange(leadId, stageKey);
  }

  // Owners present in the current lead set (for the owner filter dropdown).
  const owners = useMemo(() => {
    const set = new Set<string>();
    for (const lead of leads) if (lead.claimedBy?.repName) set.add(lead.claimedBy.repName);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [leads]);

  // Apply the search + owner filters once, before bucketing into stages.
  const visibleLeads = useMemo(() => {
    const query = q.trim().toLowerCase();
    return leads.filter((lead) => {
      if (owner === "__unclaimed__") {
        if (lead.claimedBy) return false;
      } else if (owner && lead.claimedBy?.repName !== owner) {
        return false;
      }
      if (query) {
        const hay = `${lead.name} ${lead.city} ${lead.category}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [leads, q, owner]);

  // Bucket leads into stages
  const byStage = useMemo(() => {
    const buckets: Record<string, Lead[]> = Object.fromEntries(
      STAGES.map((s) => [s.key, []] as [string, Lead[]])
    );
    buckets["lost"] = [];

    for (const lead of visibleLeads) {
      const state = states[lead.id];
      const override = moved[lead.id];
      const realStage = state?.stage || "to_call";
      const stage = override && override !== realStage ? override : realStage;
      if (!stage || stage === "to_call") {
        // Only show in To Call if they have some activity, high score, or were
        // just dragged here.
        if (override || state?.lastContacted || lead.outreach_score >= 80) {
          buckets["to_call"].push(lead);
        }
      } else if (buckets[stage]) {
        buckets[stage].push(lead);
      }
    }

    // Sort each column by the selected key.
    const cmp = (a: Lead, b: Lead) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "recent") {
        const ta = states[a.id]?.lastContacted ?? "";
        const tb = states[b.id]?.lastContacted ?? "";
        return tb.localeCompare(ta); // most recent first; empty sorts last
      }
      return b.outreach_score - a.outreach_score; // default: score
    };
    for (const key of Object.keys(buckets)) buckets[key].sort(cmp);
    return buckets;
  }, [visibleLeads, states, sortBy, moved]);

  const totalDeals = useMemo(
    () => (STAGES as readonly { key: string }[]).reduce((n, s) => n + (byStage[s.key]?.length ?? 0), 0),
    [byStage]
  );
  const totalClosed = byStage["won"].length + byStage["submitted"].length;
  const interested = byStage["interested"].length;
  const shownStages = (STAGES as readonly typeof STAGES[number][])
    .filter((s) => !stageFilter || s.key === stageFilter);
  const filtersActive = q.trim().length > 0 || !!stageFilter || !!owner;

  if (isLoading) {
    return (
      <div className="space-y-4" style={H}>
        <div className="h-8 w-40 rounded bg-[var(--crm-surface-3)] animate-pulse" />
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {STAGES.slice(0, 6).map((s) => (
            <div key={s.key} className="shrink-0 w-52 sm:w-auto flex flex-col rounded-2xl border border-[var(--crm-border)] bg-[var(--crm-surface-2)] p-3 min-h-[200px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--crm-surface-3)] animate-pulse" />
                <div className="h-2.5 w-16 rounded bg-[var(--crm-surface-3)] animate-pulse" />
              </div>
              <div className="space-y-2">
                {[1, 2].map((i) => <SkeletonMiniCard key={i} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" style={H}>
      {/* Header summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--crm-text-2)]" style={H}>
          {interested > 0 && (
            <span className="text-[var(--crm-accent-text)] font-semibold mr-2">
              {interested} interested
            </span>
          )}
          {totalClosed > 0 && (
            <span className="text-emerald-500 font-semibold">{totalClosed} closed</span>
          )}
          {interested === 0 && totalClosed === 0 && totalDeals > 0 && (
            <span>{totalDeals} lead{totalDeals === 1 ? "" : "s"} in pipeline</span>
          )}
        </p>
      </div>

      {/* Filter + sort controls */}
      <div className="space-y-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--crm-text-3)]" aria-hidden="true" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, city, niche…"
            aria-label="Search leads"
            className={[
              "w-full pl-9 pr-8 py-2.5 min-h-[40px] rounded-xl",
              "bg-[var(--crm-surface)] border border-[var(--crm-border)]",
              "text-sm text-[var(--crm-text)] placeholder:text-[var(--crm-text-3)]",
              "focus:outline-none focus:border-[var(--crm-accent-border)]",
              "focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)] focus-visible:ring-offset-1",
              "transition-colors",
            ].join(" ")}
            style={H}
          />
          {q && (
            <button
              onClick={() => setQ("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)] rounded"
            >
              <X size={13} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <PipelineSelect value={stageFilter} onChange={setStageFilter} icon={Filter} label="Filter by stage">
            <option value="">All Stages</option>
            {(STAGES as readonly typeof STAGES[number][])
              .map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
          </PipelineSelect>

          {owners.length > 0 && (
            <PipelineSelect value={owner} onChange={setOwner} icon={User} label="Filter by owner">
              <option value="">All Owners</option>
              <option value="__unclaimed__">Unclaimed</option>
              {owners.map((o) => <option key={o} value={o}>{o}</option>)}
            </PipelineSelect>
          )}

          <PipelineSelect value={sortBy} onChange={setSortBy} icon={ArrowUpDown} label="Sort by">
            {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </PipelineSelect>

          {filtersActive && (
            <button
              onClick={() => { setQ(""); setStageFilter(""); setOwner(""); }}
              aria-label="Clear all filters"
              className={[
                "inline-flex items-center gap-1 text-xs text-[var(--crm-text-3)]",
                "hover:text-[var(--crm-text-2)] px-2 min-h-[40px] rounded-xl",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)]",
                "transition-colors",
              ].join(" ")}
              style={H}
            >
              <X size={11} aria-hidden="true" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Empty state when filters return nothing */}
      {filtersActive && totalDeals === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--crm-border)] bg-[var(--crm-surface-2)] py-14 text-center">
          <Search size={28} className="text-[var(--crm-text-3)]" aria-hidden="true" />
          <p className="text-sm font-semibold text-[var(--crm-text-2)]">No matches</p>
          <p className="text-xs text-[var(--crm-text-3)]">Try a different search or clear the filters.</p>
          <button
            onClick={() => { setQ(""); setStageFilter(""); setOwner(""); }}
            className="mt-1 text-xs text-[var(--crm-accent-text)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)] rounded"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Empty state when there are no leads at all */}
      {!filtersActive && totalDeals === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--crm-border)] bg-[var(--crm-surface-2)] py-16 px-6 text-center">
          <Kanban size={32} className="text-[var(--crm-text-3)]" aria-hidden="true" />
          <p className="text-sm font-semibold text-[var(--crm-text-2)]">Pipeline is empty</p>
          <p className="text-xs text-[var(--crm-text-3)] max-w-xs">
            Import leads or add one manually — they&apos;ll appear here as you work them through stages.
          </p>
        </div>
      )}

      {/* Kanban — horizontal scroll on mobile */}
      {totalDeals > 0 && (
        <div
          role="list"
          aria-label="Pipeline stage columns"
          className={[
            "flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid snap-x",
            stageFilter
              ? "lg:grid-cols-1 sm:grid-cols-1"
              : "sm:grid-cols-3 lg:grid-cols-6",
          ].join(" ")}
        >
          {shownStages.map((stage) => {
            const stageLeads = byStage[stage.key] ?? [];
            const isDropTarget = dragOverStage === stage.key;
            return (
              <div
                key={stage.key}
                role="listitem"
                onDragOver={dndEnabled ? (e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragOverStage !== stage.key) setDragOverStage(stage.key);
                } : undefined}
                onDragLeave={dndEnabled ? (e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragOverStage((s) => (s === stage.key ? null : s));
                  }
                } : undefined}
                onDrop={dndEnabled ? (e) => {
                  e.preventDefault();
                  handleDrop(stage.key, e.dataTransfer.getData("text/plain"));
                } : undefined}
                aria-label={`${stage.label} stage, ${stageLeads.length} lead${stageLeads.length === 1 ? "" : "s"}`}
                className={[
                  "shrink-0 w-52 sm:w-auto snap-start flex flex-col rounded-2xl border p-3 min-h-[200px]",
                  "transition-colors duration-150",
                  isDropTarget
                    ? "border-[var(--crm-accent)] bg-[var(--crm-accent-weak)] shadow-[0_0_0_1px_var(--crm-accent-border)]"
                    : `${stage.bg} ${stage.border}`,
                ].join(" ")}
              >
                {/* Column header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${stage.dot}`} aria-hidden="true" />
                    <p
                      className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap truncate ${stage.color}`}
                      style={H}
                    >
                      {stage.label}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold shrink-0 pl-1 ${stage.color} opacity-70`}
                    style={H}
                    aria-label={`${stageLeads.length} leads`}
                  >
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 space-y-2">
                  {stageLeads.slice(0, 8).map((lead) => (
                    <MiniCard
                      key={lead.id}
                      lead={lead}
                      state={states[lead.id] ?? { status: "new", stage: "to_call", notes: "" }}
                      sub={submissions.find((s) => s.leadId === lead.id)}
                      onClick={() => onSelectLead(lead)}
                      draggable={dndEnabled}
                    />
                  ))}
                  {stageLeads.length > 8 && (
                    <p className="text-[10px] text-[var(--crm-text-3)] text-center py-2" style={H}>
                      +{stageLeads.length - 8} more
                    </p>
                  )}
                  {stageLeads.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-1.5 py-8 px-2 text-center">
                      <p className="text-[10px] text-[var(--crm-text-3)]" style={H}>
                        {isDropTarget ? "Drop here" : filtersActive ? "No matches" : "Empty"}
                      </p>
                      {!isDropTarget && !filtersActive && (
                        <p className="text-[10px] text-[var(--crm-text-3)] leading-relaxed" style={H}>
                          {stage.emptyHint}
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

      <p className="text-xs text-[var(--crm-text-3)] text-center" style={H}>
        Tap a card to update status{dndEnabled ? " · Drag cards between columns to advance stages" : " · Stages update when you log call outcomes"}
      </p>
    </div>
  );
}
