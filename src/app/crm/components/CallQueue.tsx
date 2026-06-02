"use client";

import { useState, useEffect, useCallback } from "react";
import { Phone, Mail, Flame, Zap, ChevronRight, RefreshCw, Star, PhoneCall } from "lucide-react";
import DailyGoals from "./DailyGoals";
import MetricsCards from "./MetricsCards";
import FollowUpBanner from "./FollowUpBanner";

interface Lead {
  id: string; name: string; category: string; phone: string; email: string;
  website: string; city: string; county: string; tier: string;
  industry_fit: string; outreach_score: number; pitch: string; best_contact: string;
}

interface LeadState {
  status: string; stage: string; notes: string; lastContacted?: string;
  callCount?: number; lastOutcome?: string; submittedAt?: string;
  followUpDate?: string;
}

interface Props {
  states: Record<string, LeadState>;
  onSelectLead: (lead: Lead) => void;
  onRefresh: () => void;
  onDialerStart?: (lead: Lead) => void;
}

const OUTCOME_LABEL: Record<string, { label: string; color: string }> = {
  no_answer: { label: "No Answer", color: "text-zinc-400" },
  voicemail: { label: "Voicemail Left", color: "text-blue-400" },
  call_back: { label: "Call Back", color: "text-purple-400" },
  not_interested: { label: "Not Interested", color: "text-red-400" },
  interested: { label: "Interested!", color: "text-green-400" },
};

export default function CallQueue({ states, onSelectLead, onRefresh, onDialerStart }: Props) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [powerDialer, setPowerDialer] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/leads?hotLeads=1&limit=100&sortBy=outreach_score");
      const data = await res.json();
      // Merge in more leads if hot queue is small
      if (data.leads.length < 20) {
        const res2 = await fetch("/api/crm/leads?tier=A&limit=100&sortBy=outreach_score");
        const data2 = await res2.json();
        const ids = new Set(data.leads.map((l: Lead) => l.id));
        const extra = data2.leads.filter((l: Lead) => !ids.has(l.id));
        setLeads([...data.leads, ...extra]);
      } else {
        setLeads(data.leads);
      }
    } catch {}
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { load(); }, [load]);

  // Capture "now" once per mount so the render path stays pure (no Date.now() during render).
  const [now] = useState(() => Date.now());

  // Sort priority:
  // 0: never called (fresh)
  // 1: follow-up (call_back / voicemail) with followUpDate <= today
  // 2: stale (called > 7 days ago, not closed)
  // 3: recently called
  // 4: everything else

  function isStale(state: LeadState | undefined): boolean {
    if (!state?.lastContacted) return false;
    const closed = ["lost", "won", "submitted"];
    if (closed.includes(state.stage)) return false;
    // lastContacted is stored as locale string (e.g. "Jun 1, 2025"), try to parse it
    const lastDate = new Date(state.lastContacted);
    if (isNaN(lastDate.getTime())) return false;
    const diffMs = now - lastDate.getTime();
    return diffMs > 7 * 24 * 60 * 60 * 1000;
  }

  function getStaleDays(state: LeadState | undefined): number {
    if (!state?.lastContacted) return 0;
    const lastDate = new Date(state.lastContacted);
    if (isNaN(lastDate.getTime())) return 0;
    return Math.floor((now - lastDate.getTime()) / (24 * 60 * 60 * 1000));
  }

  function getPriority(lead: Lead): number {
    const s = states[lead.id];
    if (!s || s.stage === "to_call" || !s.lastContacted) return 0;
    if (s.stage === "call_back" || s.stage === "voicemail") return 1;
    if (isStale(s)) return 2;
    if (s.lastContacted) return 3;
    return 4;
  }

  const sorted = [...leads].sort((a, b) => {
    const pA = getPriority(a);
    const pB = getPriority(b);
    if (pA !== pB) return pA - pB;
    return b.outreach_score - a.outreach_score;
  }).filter((l) => {
    const s = states[l.id];
    return !s || (s.stage !== "lost" && s.stage !== "won" && s.stage !== "submitted" && s.status !== "not_interested");
  });

  const fresh = sorted.filter((l) => getPriority(l) === 0);
  const followUp = sorted.filter((l) => getPriority(l) === 1);
  const stale = sorted.filter((l) => getPriority(l) === 2);
  const called = sorted.filter((l) => getPriority(l) === 3);

  const H = { fontFamily: "var(--font-heading)" };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-20">
        <div className="w-7 h-7 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-white/30" style={H}>Loading your queue…</p>
      </div>
    );
  }

  function LeadCard({ lead, priority }: { lead: Lead; priority?: boolean }) {
    const state = states[lead.id];
    const lastOutcome = state?.lastOutcome ? OUTCOME_LABEL[state.lastOutcome] : null;
    const callCount = state?.callCount ?? 0;

    function handleCardClick() {
      if (powerDialer && onDialerStart) {
        onDialerStart(lead);
      } else {
        onSelectLead(lead);
      }
    }

    return (
      <div onClick={handleCardClick}
        className={`group flex items-center gap-4 px-4 py-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.99] hover:border-[#F97316]/30 hover:bg-[#F97316]/5 ${
          priority ? "bg-[#F97316]/5 border-[#F97316]/20" : "bg-[#1C1C1F] border-white/[0.06]"
        }`}>

        {/* Score circle */}
        <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold ${
          lead.outreach_score >= 80 ? "bg-[#F97316]/15 text-[#F97316]" :
          lead.outreach_score >= 60 ? "bg-yellow-400/15 text-yellow-400" :
          "bg-white/5 text-white/40"
        }`} style={H}>
          {lead.outreach_score}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-white text-sm leading-tight truncate" style={H}>{lead.name}</p>
            {lead.tier === "A" && <Flame size={12} className="text-orange-400 shrink-0" />}
            {lead.tier === "B" && <Zap size={12} className="text-yellow-400 shrink-0" />}
          </div>
          <p className="text-xs text-white/40 mt-0.5 truncate" style={H}>
            {lead.city} · {lead.category.replace(/_/g, " ")}
          </p>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {lead.phone && <span className="text-xs text-white/35 flex items-center gap-1" style={H}><Phone size={9} />{lead.phone}</span>}
            {lead.email && <span className="text-xs text-white/35 flex items-center gap-1" style={H}><Mail size={9} />{lead.email.split("@")[0]}@…</span>}
            {callCount > 0 && <span className="text-xs text-white/25 flex items-center gap-1" style={H}><PhoneCall size={9} />{callCount}x</span>}
            {lastOutcome && <span className={`text-xs ${lastOutcome.color}`} style={H}>{lastOutcome.label}</span>}
            {isStale(state) && <span className="text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-full" style={H}>{getStaleDays(state)}d ago</span>}
          </div>
        </div>

        <ChevronRight size={16} className="text-white/20 group-hover:text-[#F97316]/60 transition-colors shrink-0" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Power Dialer toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => setPowerDialer((v) => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
            powerDialer
              ? "bg-[#F97316] text-white border-[#F97316] shadow-lg shadow-[#F97316]/30"
              : "bg-[#1C1C1F] text-white/50 border-white/10 hover:border-[#F97316]/40 hover:text-[#F97316]"
          }`}
          style={H}
        >
          <Zap size={13} />
          ⚡ Power Dialer
          {powerDialer && <span className="text-xs font-semibold bg-white/20 px-1.5 py-0.5 rounded-full">ON</span>}
        </button>
      </div>

      <DailyGoals />

      <MetricsCards />

      <FollowUpBanner />

      {/* Hero stat */}
      <div className="bg-gradient-to-br from-[#F97316]/15 to-[#F97316]/5 border border-[#F97316]/20 rounded-2xl px-5 py-5 flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-white" style={H}>{sorted.length}</p>
          <p className="text-sm text-white/50 mt-0.5" style={H}>leads ready to contact</p>
          {fresh.length > 0 && <p className="text-xs text-[#F97316] mt-1 font-semibold" style={H}>🔥 {fresh.length} never called</p>}
        </div>
        <div className="text-right space-y-1.5">
          {followUp.length > 0 && <p className="text-xs text-purple-400 font-semibold" style={H}>↩ {followUp.length} to follow up</p>}
          <button onClick={() => { onRefresh(); load(); }}
            className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
            style={H}><RefreshCw size={11} />Refresh</button>
        </div>
      </div>

      {/* Follow-ups first */}
      {followUp.length > 0 && (
        <div>
          <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3" style={H}>↩ Follow Up ({followUp.length})</p>
          <div className="space-y-2">
            {followUp.map((l) => <LeadCard key={l.id} lead={l} priority />)}
          </div>
        </div>
      )}

      {/* Stale leads */}
      {stale.length > 0 && (
        <div>
          <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3" style={H}>⏰ Stale — Not Called in 7+ Days ({stale.length})</p>
          <div className="space-y-2">
            {stale.slice(0, 10).map((l) => <LeadCard key={l.id} lead={l} />)}
          </div>
        </div>
      )}

      {/* Fresh leads */}
      {fresh.length > 0 && (
        <div>
          <p className="text-xs font-bold text-[#F97316] uppercase tracking-wider mb-3" style={H}>🔥 Fresh Leads — Never Called ({fresh.length})</p>
          <div className="space-y-2">
            {fresh.slice(0, 30).map((l) => <LeadCard key={l.id} lead={l} />)}
            {fresh.length > 30 && (
              <p className="text-center text-xs text-white/25 pt-2" style={H}>+ {fresh.length - 30} more — use filters in All Leads to find them</p>
            )}
          </div>
        </div>
      )}

      {/* Previously called */}
      {called.length > 0 && (
        <div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3" style={H}>Previously Called ({called.length})</p>
          <div className="space-y-2">
            {called.slice(0, 10).map((l) => <LeadCard key={l.id} lead={l} />)}
          </div>
        </div>
      )}

      {sorted.length === 0 && (
        <div className="text-center py-16">
          <Star size={32} className="text-[#F97316]/30 mx-auto mb-3" />
          <p className="text-white/50 font-semibold" style={H}>Queue is clear!</p>
          <p className="text-sm text-white/25 mt-1" style={H}>Check the All Leads tab to find more prospects.</p>
        </div>
      )}
    </div>
  );
}
