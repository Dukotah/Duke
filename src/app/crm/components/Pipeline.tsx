"use client";

import { Flame, Zap, Globe, Phone, Mail, ChevronRight, Send } from "lucide-react";

interface Lead {
  id: string; name: string; category: string; phone: string; email: string;
  website: string; city: string; tier: string; outreach_score: number;
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

const STAGES = [
  { key: "to_call", label: "To Call", color: "text-blue-400", border: "border-blue-400/30", bg: "bg-blue-400/5", dot: "bg-blue-400" },
  { key: "called", label: "Called", color: "text-zinc-400", border: "border-zinc-400/20", bg: "bg-zinc-400/5", dot: "bg-zinc-400" },
  { key: "voicemail", label: "Voicemail", color: "text-purple-400", border: "border-purple-400/30", bg: "bg-purple-400/5", dot: "bg-purple-400" },
  { key: "interested", label: "Interested", color: "text-[#F97316]", border: "border-[#F97316]/30", bg: "bg-[#F97316]/5", dot: "bg-[#F97316]" },
  { key: "submitted", label: "Submitted", color: "text-yellow-400", border: "border-yellow-400/30", bg: "bg-yellow-400/5", dot: "bg-yellow-400" },
  { key: "won", label: "Won 🏆", color: "text-green-400", border: "border-green-400/30", bg: "bg-green-400/5", dot: "bg-green-400" },
];

const H = { fontFamily: "var(--font-heading)" };

function MiniCard({ lead, state, sub, onClick }: {
  lead: Lead; state: LeadState; sub?: Submission; onClick: () => void;
}) {
  return (
    <div onClick={onClick}
      className="bg-[#1C1C1F] border border-white/[0.06] rounded-xl p-3 cursor-pointer hover:border-[#F97316]/30 transition-all group active:scale-[0.98]">
      <div className="flex items-start justify-between gap-1">
        <p className="text-xs font-bold text-white leading-tight line-clamp-2 flex-1" style={H}>{lead.name}</p>
        {lead.tier === "A" && <Flame size={10} className="text-orange-400 shrink-0 mt-0.5" />}
        {lead.tier === "B" && <Zap size={10} className="text-yellow-400 shrink-0 mt-0.5" />}
      </div>
      <p className="text-[10px] text-white/35 mt-1 truncate" style={H}>{lead.city} · {lead.category.replace(/_/g, " ")}</p>
      <div className="flex items-center gap-2 mt-2">
        {lead.phone && <Phone size={9} className="text-white/25" />}
        {lead.email && <Mail size={9} className="text-white/25" />}
        {state.callCount && <span className="text-[10px] text-white/25" style={H}>{state.callCount}x</span>}
        {sub?.status === "accepted" && sub.commissionAmount && (
          <span className="text-[10px] text-green-400 font-bold ml-auto" style={H}>${sub.commissionAmount.toFixed(0)}</span>
        )}
      </div>
    </div>
  );
}

export default function Pipeline({ leads, states, submissions, onSelectLead }: Props) {
  // Bucket leads into stages
  const byStage: Record<string, Lead[]> = Object.fromEntries(STAGES.map((s) => [s.key, []]));
  byStage["lost"] = [];

  for (const lead of leads) {
    const state = states[lead.id];
    if (!state || !state.stage || state.stage === "to_call") {
      // Only show in To Call if they have some activity or high score
      if (state?.lastContacted || lead.outreach_score >= 80) byStage["to_call"].push(lead);
    } else if (byStage[state.stage]) {
      byStage[state.stage].push(lead);
    }
  }

  const totalDeals = byStage["won"].length + byStage["submitted"].length;
  const interested = byStage["interested"].length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50" style={H}>
            {interested > 0 && <span className="text-[#F97316] font-semibold mr-2">🔥 {interested} interested</span>}
            {totalDeals > 0 && <span className="text-green-400 font-semibold">{totalDeals} closed</span>}
          </p>
        </div>
      </div>

      {/* Kanban — horizontal scroll on mobile */}
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-6 snap-x">
        {STAGES.filter((s) => s.key !== "lost").map((stage) => {
          const stageLeads = byStage[stage.key] ?? [];
          return (
            <div key={stage.key} className={`shrink-0 w-52 sm:w-auto snap-start flex flex-col rounded-2xl border p-3 min-h-[200px] ${stage.bg} ${stage.border}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${stage.dot}`} />
                  <p className={`text-xs font-bold uppercase tracking-wider ${stage.color}`} style={H}>{stage.label}</p>
                </div>
                <span className={`text-xs font-bold ${stage.color} opacity-60`} style={H}>{stageLeads.length}</span>
              </div>
              <div className="flex-1 space-y-2">
                {stageLeads.slice(0, 8).map((lead) => (
                  <MiniCard key={lead.id} lead={lead} state={states[lead.id] ?? { status: "new", stage: "to_call", notes: "" }}
                    sub={submissions.find((s) => s.leadId === lead.id)} onClick={() => onSelectLead(lead)} />
                ))}
                {stageLeads.length > 8 && (
                  <p className="text-[10px] text-white/25 text-center py-2" style={H}>+{stageLeads.length - 8} more</p>
                )}
                {stageLeads.length === 0 && (
                  <p className="text-[10px] text-white/20 text-center py-4" style={H}>None yet</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-white/20 text-center" style={H}>
        Tap a card to update status · Stages update when you log call outcomes
      </p>
    </div>
  );
}
