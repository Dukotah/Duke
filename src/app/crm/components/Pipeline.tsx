"use client";

import { useMemo, useState } from "react";
import { Flame, Zap, Phone, Mail, Search, X, ArrowUpDown, User, Filter } from "lucide-react";

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
  { key: "to_call", label: "To Call", color: "text-blue-400", border: "border-blue-400/30", bg: "bg-blue-400/5", dot: "bg-blue-400" },
  { key: "called", label: "Called", color: "text-zinc-400", border: "border-zinc-400/20", bg: "bg-zinc-400/5", dot: "bg-zinc-400" },
  { key: "voicemail", label: "Voicemail", color: "text-purple-400", border: "border-purple-400/30", bg: "bg-purple-400/5", dot: "bg-purple-400" },
  { key: "interested", label: "Interested", color: "text-[var(--crm-accent-text)]", border: "border-[var(--crm-accent-border)]", bg: "bg-[var(--crm-accent-weak)]", dot: "bg-[var(--crm-accent)]" },
  { key: "submitted", label: "Submitted", color: "text-yellow-400", border: "border-yellow-400/30", bg: "bg-yellow-400/5", dot: "bg-yellow-400" },
  { key: "won", label: "Won 🏆", color: "text-green-400", border: "border-green-400/30", bg: "bg-green-400/5", dot: "bg-green-400" },
];

type SortKey = "score" | "name" | "recent";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "score", label: "Best score" },
  { key: "name", label: "Name A–Z" },
  { key: "recent", label: "Recently contacted" },
];

const H = { fontFamily: "var(--font-heading)" };

// Mirror the select styling used in the Leads view for consistency.
function PipelineSelect<T extends string>({ value, onChange, children, icon: Icon }: {
  value: T; onChange: (v: T) => void; children: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="relative">
      {Icon && <Icon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--crm-text-3)] pointer-events-none" />}
      <select value={value} onChange={(e) => onChange(e.target.value as T)}
        className={`${Icon ? "pl-8" : "pl-3"} pr-6 py-2 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors appearance-none`}
        style={H}>
        {children}
      </select>
    </div>
  );
}

function MiniCard({ lead, state, sub, onClick, draggable }: {
  lead: Lead; state: LeadState; sub?: Submission; onClick: () => void; draggable?: boolean;
}) {
  return (
    <div onClick={onClick}
      draggable={draggable}
      onDragStart={draggable ? (e) => { e.dataTransfer.setData("text/plain", lead.id); e.dataTransfer.effectAllowed = "move"; } : undefined}
      className={`bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-xl p-3 cursor-pointer hover:border-[var(--crm-accent-border)] transition-all group active:scale-[0.98] ${draggable ? "cursor-grab active:cursor-grabbing" : ""}`}>
      <div className="flex items-start justify-between gap-1">
        <p className="text-xs font-bold text-[var(--crm-text)] leading-tight line-clamp-2 flex-1" style={H}>{lead.name}</p>
        {lead.tier === "A" && <Flame size={10} className="text-orange-400 shrink-0 mt-0.5" />}
        {lead.tier === "B" && <Zap size={10} className="text-yellow-400 shrink-0 mt-0.5" />}
      </div>
      <p className="text-[10px] text-[var(--crm-text-3)] mt-1 truncate" style={H}>{lead.city} · {lead.category.replace(/_/g, " ")}</p>
      <div className="flex items-center gap-2 mt-2">
        {lead.phone && <Phone size={9} className="text-[var(--crm-text-3)]" />}
        {lead.email && <Mail size={9} className="text-[var(--crm-text-3)]" />}
        {state.callCount && <span className="text-[10px] text-[var(--crm-text-3)]" style={H}>{state.callCount}x</span>}
        {lead.claimedBy && (
          <span className="text-[10px] text-[var(--crm-text-3)] truncate flex items-center gap-0.5" style={H}>
            <User size={8} className="shrink-0" />{lead.claimedBy.repName}
          </span>
        )}
        {sub?.status === "accepted" && sub.commissionAmount && (
          <span className="text-[10px] text-green-400 font-bold ml-auto" style={H}>${sub.commissionAmount.toFixed(0)}</span>
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
    const buckets: Record<string, Lead[]> = Object.fromEntries(STAGES.map((s) => [s.key, []]));
    buckets["lost"] = [];

    for (const lead of visibleLeads) {
      const state = states[lead.id];
      const override = moved[lead.id];
      const realStage = state?.stage || "to_call";
      const stage = override && override !== realStage ? override : realStage;
      if (!stage || stage === "to_call") {
        // Only show in To Call if they have some activity, high score, or were
        // just dragged here.
        if (override || state?.lastContacted || lead.outreach_score >= 80) buckets["to_call"].push(lead);
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

  const totalDeals = byStage["won"].length + byStage["submitted"].length;
  const interested = byStage["interested"].length;
  const shownStages = STAGES.filter((s) => s.key !== "lost" && (!stageFilter || s.key === stageFilter));
  const filtersActive = q.trim().length > 0 || !!stageFilter || !!owner;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--crm-text-2)]" style={H}>
            {interested > 0 && <span className="text-[var(--crm-accent-text)] font-semibold mr-2">🔥 {interested} interested</span>}
            {totalDeals > 0 && <span className="text-green-400 font-semibold">{totalDeals} closed</span>}
          </p>
        </div>
      </div>

      {/* Filter + sort controls */}
      <div className="space-y-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--crm-text-3)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, city, niche…"
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors"
            style={H} />
          {q && <button onClick={() => setQ("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)]"><X size={13} /></button>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PipelineSelect value={stageFilter} onChange={setStageFilter} icon={Filter}>
            <option value="">All Stages</option>
            {STAGES.filter((s) => s.key !== "lost").map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </PipelineSelect>
          {owners.length > 0 && (
            <PipelineSelect value={owner} onChange={setOwner} icon={User}>
              <option value="">All Owners</option>
              <option value="__unclaimed__">Unclaimed</option>
              {owners.map((o) => <option key={o} value={o}>{o}</option>)}
            </PipelineSelect>
          )}
          <PipelineSelect value={sortBy} onChange={setSortBy} icon={ArrowUpDown}>
            {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </PipelineSelect>
          {filtersActive && (
            <button onClick={() => { setQ(""); setStageFilter(""); setOwner(""); }}
              className="inline-flex items-center gap-1 text-xs text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] px-2" style={H}>
              <X size={11} />Clear
            </button>
          )}
        </div>
      </div>

      {/* Kanban — horizontal scroll on mobile */}
      <div className={`flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 snap-x ${stageFilter ? "lg:grid-cols-3" : "lg:grid-cols-6"}`}>
        {shownStages.map((stage) => {
          const stageLeads = byStage[stage.key] ?? [];
          const isDropTarget = dragOverStage === stage.key;
          return (
            <div key={stage.key}
              onDragOver={dndEnabled ? (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (dragOverStage !== stage.key) setDragOverStage(stage.key); } : undefined}
              onDragLeave={dndEnabled ? (e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverStage((s) => (s === stage.key ? null : s)); } : undefined}
              onDrop={dndEnabled ? (e) => { e.preventDefault(); handleDrop(stage.key, e.dataTransfer.getData("text/plain")); } : undefined}
              className={`shrink-0 w-52 sm:w-auto snap-start flex flex-col rounded-2xl border p-3 min-h-[200px] transition-colors ${isDropTarget ? "border-[var(--crm-accent)] bg-[var(--crm-accent-weak)]" : `${stage.bg} ${stage.border}`}`}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${stage.dot}`} />
                  <p className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap truncate ${stage.color}`} style={H}>{stage.label}</p>
                </div>
                <span className={`text-xs font-bold shrink-0 pl-1 ${stage.color} opacity-60`} style={H}>{stageLeads.length}</span>
              </div>
              <div className="flex-1 space-y-2">
                {stageLeads.slice(0, 8).map((lead) => (
                  <MiniCard key={lead.id} lead={lead} state={states[lead.id] ?? { status: "new", stage: "to_call", notes: "" }}
                    sub={submissions.find((s) => s.leadId === lead.id)} onClick={() => onSelectLead(lead)}
                    draggable={dndEnabled} />
                ))}
                {stageLeads.length > 8 && (
                  <p className="text-[10px] text-[var(--crm-text-3)] text-center py-2" style={H}>+{stageLeads.length - 8} more</p>
                )}
                {stageLeads.length === 0 && (
                  <p className="text-[10px] text-[var(--crm-text-3)] text-center py-4" style={H}>{filtersActive ? "No matches" : "None yet"}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[var(--crm-text-3)] text-center" style={H}>
        Tap a card to update status · Stages update when you log call outcomes
      </p>
    </div>
  );
}
