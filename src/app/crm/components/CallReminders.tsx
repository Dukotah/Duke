"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Phone, Mail, ChevronRight, RefreshCw, CalendarCheck, Check,
  PhoneMissed, PhoneOff, CalendarClock, ThumbsDown, ThumbsUp,
  AlertTriangle, Clock,
} from "lucide-react";

interface Lead {
  id: string; name: string; category: string; phone: string; email: string;
  website: string; city: string; county: string; tier: string;
  industry_fit: string; outreach_score: number; pitch: string; best_contact: string;
}

interface LeadState {
  status: "new" | "contacted" | "follow_up" | "not_interested" | "won";
  stage: string; notes: string; lastContacted?: string;
  callCount?: number; lastOutcome?: string; submittedAt?: string;
  followUpDate?: string;
}

interface DueItem {
  leadId: string;
  followUpDate: string;
  stage: string;
  lastContacted?: string;
}

interface Props {
  states: Record<string, LeadState>;
  allLeads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onUpdateState: (leadId: string, patch: Partial<LeadState>) => void;
}

// Quick-log dispositions — mirrors the OUTCOMES set used in LeadPanel so the
// queue stays consistent with the full lead drawer.
const DISPOSITIONS = [
  { key: "no_answer", label: "No Answer", icon: PhoneMissed, color: "text-zinc-400", bg: "bg-zinc-400/10", border: "border-zinc-400/20", stage: "called", status: "contacted" },
  { key: "voicemail", label: "Voicemail", icon: PhoneOff, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", stage: "voicemail", status: "contacted" },
  { key: "call_back", label: "Call Back", icon: CalendarClock, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", stage: "called", status: "follow_up" },
  { key: "not_interested", label: "Not Interested", icon: ThumbsDown, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", stage: "lost", status: "not_interested" },
  { key: "interested", label: "Interested!", icon: ThumbsUp, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", stage: "interested", status: "follow_up" },
] as const;

const H = { fontFamily: "var(--font-heading)" };

function dayDelta(dateStr: string, today: string): number {
  // Both YYYY-MM-DD — compare by UTC day to avoid timezone drift.
  const a = Date.parse(`${dateStr}T00:00:00Z`);
  const b = Date.parse(`${today}T00:00:00Z`);
  if (isNaN(a) || isNaN(b)) return 0;
  return Math.round((b - a) / 86_400_000);
}

function dueLabel(delta: number): { text: string; tone: string } {
  if (delta > 1) return { text: `${delta} days overdue`, tone: "text-red-400 bg-red-400/10 border-red-400/20" };
  if (delta === 1) return { text: "1 day overdue", tone: "text-red-400 bg-red-400/10 border-red-400/20" };
  return { text: "Due today", tone: "text-amber-400 bg-amber-400/10 border-amber-400/20" };
}

export default function CallReminders({ states, allLeads, onSelectLead, onUpdateState }: Props) {
  const [due, setDue] = useState<DueItem[] | null>(null);
  const [leadMap, setLeadMap] = useState<Record<string, Lead>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Due reminders come straight from the reminders endpoint.
      const res = await fetch("/api/crm/reminders");
      if (!res.ok) throw new Error();
      const data = await res.json();
      const items: DueItem[] = Array.isArray(data.dueToday) ? data.dueToday : [];
      setDue(items);

      // Resolve lead details for the due reminders. Start from the leads the
      // parent already loaded (allLeads) — this covers most due ids without a
      // network round-trip and isn't capped by the leads endpoint's limit.
      if (items.length) {
        const map: Record<string, Lead> = {};
        for (const l of allLeads) map[l.id] = l;

        // Fall back to the scored leads feed only for ids we couldn't resolve
        // locally (e.g. leads outside the parent's current set).
        const missing = items.some((it) => !map[it.leadId]);
        if (missing) {
          const lr = await fetch("/api/crm/leads?limit=100&sortBy=outreach_score&allTerritories=1");
          const ld = await lr.json();
          for (const l of (ld.leads ?? []) as Lead[]) {
            if (!map[l.id]) map[l.id] = l;
          }
        }
        setLeadMap(map);
      } else {
        setLeadMap({});
      }
    } catch {
      setError("Could not load your reminders.");
    } finally {
      setLoading(false);
    }
  }, [allLeads]);

  useEffect(() => { load(); }, [load]);

  // Clearing a reminder = wiping the followUpDate on the lead state.
  const markDone = useCallback((leadId: string) => {
    setDone((prev) => new Set(prev).add(leadId));
    onUpdateState(leadId, { followUpDate: "" });
  }, [onUpdateState]);

  // Quick-log a disposition: log the activity + advance lead state, then clear
  // the reminder so it drops off the queue.
  const logDisposition = useCallback(async (leadId: string, d: typeof DISPOSITIONS[number]) => {
    setBusy(leadId);
    const now = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const newCount = (states[leadId]?.callCount ?? 0) + 1;
    // Most dispositions clear the reminder. But "call_back" and "interested"
    // both want to stay in the queue — reschedule a near follow-up instead of
    // wiping it (mirrors LeadPanel.logOutcome opening a follow-up picker).
    let followUpDate = "";
    if (d.key === "call_back" || d.key === "interested") {
      const fu = new Date();
      fu.setDate(fu.getDate() + (d.key === "call_back" ? 2 : 3));
      followUpDate = fu.toISOString().slice(0, 10);
    }
    onUpdateState(leadId, {
      status: d.status,
      stage: d.stage,
      lastContacted: now,
      lastOutcome: d.key,
      callCount: newCount,
      followUpDate,
    });
    try {
      await fetch("/api/crm/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, type: "call", outcome: d.key }),
      });
    } catch { /* state already updated optimistically */ }
    setDone((prev) => new Set(prev).add(leadId));
    setBusy(null);
  }, [states, onUpdateState]);

  // Visible = due reminders not yet cleared this session, sorted most overdue first.
  const visible = useMemo(() => {
    if (!due) return [];
    return due
      .filter((d) => !done.has(d.leadId))
      .map((d) => ({ ...d, delta: dayDelta(d.followUpDate, today) }))
      .sort((a, b) => b.delta - a.delta);
  }, [due, done, today]);

  const overdueCount = visible.filter((v) => v.delta > 0).length;
  const clearedCount = done.size;

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-20">
        <div className="w-7 h-7 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-white/30" style={H}>Loading your reminders…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <AlertTriangle size={26} className="text-red-400/70" />
        <p className="text-sm text-white/50" style={H}>{error}</p>
        <button onClick={load} className="inline-flex items-center gap-1.5 text-xs text-[#F97316] hover:opacity-80" style={H}>
          <RefreshCw size={11} />Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Hero stat */}
      <div className="bg-gradient-to-br from-amber-500/15 to-amber-500/5 border border-amber-500/20 rounded-2xl px-5 py-5 flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-white" style={H}>{visible.length}</p>
          <p className="text-sm text-white/50 mt-0.5" style={H}>follow-up{visible.length !== 1 ? "s" : ""} to work</p>
          {overdueCount > 0 && (
            <p className="text-xs text-red-400 mt-1 font-semibold" style={H}>⚠ {overdueCount} overdue</p>
          )}
        </div>
        <div className="text-right space-y-1.5">
          {clearedCount > 0 && (
            <p className="text-xs text-green-400 font-semibold" style={H}>✓ {clearedCount} cleared</p>
          )}
          <button onClick={load}
            className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
            style={H}><RefreshCw size={11} />Refresh</button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-16">
          <CalendarCheck size={32} className="text-green-400/40 mx-auto mb-3" />
          <p className="text-white/60 font-semibold" style={H}>
            {clearedCount > 0 ? "All caught up — nice work!" : "No follow-ups due"}
          </p>
          <p className="text-sm text-white/25 mt-1" style={H}>
            Reminders show up here when a follow-up date arrives. Head to the Queue to make more calls.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((item) => {
            const lead = leadMap[item.leadId];
            const state = states[item.leadId];
            const { text, tone } = dueLabel(item.delta);
            const isBusy = busy === item.leadId;

            return (
              <div key={item.leadId}
                className="rounded-2xl border border-white/[0.06] bg-[#1C1C1F] overflow-hidden">

                {/* Top row — lead summary, click to open full panel */}
                <button
                  onClick={() => lead && onSelectLead(lead)}
                  disabled={!lead}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#F97316]/5 disabled:cursor-default disabled:hover:bg-transparent group">
                  <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold ${
                    lead && lead.outreach_score >= 80 ? "bg-[#F97316]/15 text-[#F97316]" :
                    lead && lead.outreach_score >= 60 ? "bg-yellow-400/15 text-yellow-400" :
                    "bg-white/5 text-white/40"
                  }`} style={H}>
                    {lead ? lead.outreach_score : "—"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm leading-tight truncate" style={H}>
                      {lead ? lead.name : item.leadId}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5 truncate" style={H}>
                      {lead ? `${lead.city} · ${lead.category.replace(/_/g, " ")}` : "Lead details unavailable"}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${tone}`} style={H}>
                        {text}
                      </span>
                      {state?.lastContacted && (
                        <span className="text-xs text-white/30 flex items-center gap-1" style={H}>
                          <Clock size={9} />last {state.lastContacted}
                        </span>
                      )}
                      {lead?.phone && (
                        <span className="text-xs text-white/35 flex items-center gap-1" style={H}>
                          <Phone size={9} />{lead.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  {lead && <ChevronRight size={16} className="text-white/20 group-hover:text-[#F97316]/60 transition-colors shrink-0" />}
                </button>

                {/* Action bar — call, quick-log, mark done */}
                <div className="px-4 pb-3.5 pt-1 border-t border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-2.5 pt-2.5">
                    {lead?.phone && (
                      <a href={`tel:${lead.phone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
                        style={{ backgroundColor: "#F97316", ...H }}>
                        <Phone size={12} />Call
                      </a>
                    )}
                    {lead?.email && (
                      <a href={`mailto:${lead.email}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#F97316]/30 bg-[#F97316]/10 text-[#F97316] hover:bg-[#F97316]/20 transition-all"
                        style={H}>
                        <Mail size={12} />Email
                      </a>
                    )}
                    <button onClick={() => markDone(item.leadId)}
                      className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/20 hover:bg-green-400/20 transition-all active:scale-95"
                      style={H}>
                      <Check size={12} />Done
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {DISPOSITIONS.map((d) => (
                      <button key={d.key} onClick={() => logDisposition(item.leadId, d)} disabled={isBusy}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 disabled:opacity-40 ${d.color} ${d.bg} ${d.border} hover:opacity-80`}
                        style={H}>
                        <d.icon size={11} className="shrink-0" />{d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
