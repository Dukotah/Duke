"use client";

import { useMemo } from "react";
import { Flame, Zap, Phone, Mail, User, TrendingUp, Trophy, Target } from "lucide-react";

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
  closed?: "won" | "lost";
}

const COLUMNS: StageCol[] = [
  { key: "new", label: "New", stages: ["to_call"], probability: 10, accent: "text-blue-500", dot: "bg-blue-500" },
  { key: "contacted", label: "Contacted", stages: ["called", "voicemail"], probability: 25, accent: "text-[var(--crm-text-2)]", dot: "bg-[var(--crm-text-3)]" },
  { key: "interested", label: "Interested", stages: ["interested"], probability: 60, accent: "text-[var(--crm-accent-text)]", dot: "bg-[var(--crm-accent)]" },
  { key: "submitted", label: "Submitted", stages: ["submitted"], probability: 80, accent: "text-amber-500", dot: "bg-amber-500" },
  { key: "won", label: "Won", stages: ["won"], probability: 100, accent: "text-emerald-500", dot: "bg-emerald-500", closed: "won" },
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

export default function DealsBoard({ leads, states, submissions, onSelectLead }: Props) {
  const subByLead = useMemo(() => {
    const m = new Map<string, Submission>();
    for (const s of submissions) m.set(s.leadId, s);
    return m;
  }, [submissions]);

  // Bucket leads into HubSpot-style columns from their live stage.
  const board = useMemo(() => {
    const stageToCol = new Map<string, StageCol>();
    for (const col of COLUMNS) for (const s of col.stages) stageToCol.set(s, col);

    const buckets: Record<string, Lead[]> = Object.fromEntries(COLUMNS.map((c) => [c.key, []]));
    for (const lead of leads) {
      const state = states[lead.id];
      const stage = state?.stage || "to_call";
      // Surface untouched leads in "New" only if they have activity or a strong score.
      if (stage === "to_call" && !state?.lastContacted && (lead.outreach_score ?? 0) < 80) continue;
      const col = stageToCol.get(stage);
      if (col) buckets[col.key].push(lead);
    }

    // Sort each column by deal value, biggest first.
    for (const key of Object.keys(buckets)) {
      buckets[key].sort((a, b) => dealValue(b, subByLead) - dealValue(a, subByLead));
    }
    return buckets;
  }, [leads, states, subByLead]);

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
    { label: "Open pipeline", value: money(openValue), sub: `${openCount} deals`, icon: TrendingUp },
    { label: "Weighted forecast", value: money(weighted), sub: "value × probability", icon: Target, accent: true },
    { label: "Won", value: money(wonValue), sub: `${board["won"].length} deals`, icon: Trophy },
  ];

  return (
    <div className="space-y-5" style={H}>
      {/* Forecast header — HubSpot-style summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label}
              className="rounded-2xl border border-[var(--crm-border)] bg-[var(--crm-surface)] p-4">
              <div className="flex items-center gap-1.5">
                <Icon size={12} className={s.accent ? "text-[var(--crm-accent)]" : "text-[var(--crm-text-3)]"} />
                <p className="text-[11px] uppercase tracking-wide text-[var(--crm-text-3)] font-semibold">{s.label}</p>
              </div>
              <p className={`text-2xl font-bold tabular-nums mt-1 ${s.accent ? "text-[var(--crm-accent-text)]" : "text-[var(--crm-text)]"}`}>{s.value}</p>
              <p className="text-[11px] text-[var(--crm-text-3)] mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Kanban — horizontal scroll on mobile, fixed columns on desktop */}
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
        {COLUMNS.map((col) => {
          const items = board[col.key] ?? [];
          const total = colTotals[col.key] ?? 0;
          return (
            <div key={col.key}
              className="shrink-0 w-64 sm:flex-1 sm:min-w-[200px] snap-start flex flex-col rounded-2xl border border-[var(--crm-border)] bg-[var(--crm-surface-2)]">
              {/* Column header */}
              <div className="flex items-center justify-between gap-2 px-3.5 py-3 border-b border-[var(--crm-border)]">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${col.dot}`} />
                  <span className={`text-xs font-bold uppercase tracking-wide truncate ${col.accent}`}>{col.label}</span>
                  <span className="text-[11px] text-[var(--crm-text-3)] tabular-nums shrink-0">{items.length}</span>
                </div>
                {total > 0 && <span className="text-[11px] font-semibold text-[var(--crm-text-2)] tabular-nums shrink-0">{money(total)}</span>}
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 min-h-[120px] flex-1">
                {items.slice(0, 12).map((lead) => (
                  <DealCard key={lead.id} lead={lead} value={dealValue(lead, subByLead)}
                    sub={subByLead.get(lead.id)} onClick={() => onSelectLead(lead)} />
                ))}
                {items.length > 12 && (
                  <p className="text-center text-[11px] text-[var(--crm-text-3)] py-2">+{items.length - 12} more</p>
                )}
                {items.length === 0 && (
                  <p className="text-center text-[11px] text-[var(--crm-text-3)] py-6">No deals</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[var(--crm-text-3)] text-center">
        Click a deal to open it · Stages advance as you log call outcomes
      </p>
    </div>
  );
}

function DealCard({ lead, value, sub, onClick }: {
  lead: Lead; value: number; sub?: Submission; onClick: () => void;
}) {
  const won = sub?.status === "accepted";
  return (
    <div onClick={onClick}
      className="group rounded-xl border border-[var(--crm-border)] bg-[var(--crm-surface)] p-3 cursor-pointer hover:border-[var(--crm-accent-border)] transition-colors active:scale-[0.98]">
      <div className="flex items-start justify-between gap-1.5">
        <p className="text-sm font-semibold text-[var(--crm-text)] leading-tight line-clamp-2 flex-1">{lead.name}</p>
        {lead.tier === "A" && <Flame size={11} className="text-[var(--crm-accent)] shrink-0 mt-0.5" />}
        {lead.tier === "B" && <Zap size={11} className="text-amber-500 shrink-0 mt-0.5" />}
      </div>
      <p className="text-[10px] text-[var(--crm-text-3)] mt-1 truncate">{lead.city} · {lead.category.replace(/_/g, " ")}</p>
      <p className={`text-sm font-bold tabular-nums mt-1.5 ${won ? "text-emerald-500" : "text-[var(--crm-accent-text)]"}`}>{money(value)}</p>
      <div className="flex items-center gap-2 mt-1.5 text-[var(--crm-text-3)]">
        {lead.phone && <Phone size={9} />}
        {lead.email && <Mail size={9} />}
        {lead.claimedBy?.repName && (
          <span className="text-[10px] truncate flex items-center gap-0.5">
            <User size={8} className="shrink-0" />{lead.claimedBy.repName}
          </span>
        )}
      </div>
    </div>
  );
}
