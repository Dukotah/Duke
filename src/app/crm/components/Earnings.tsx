"use client";

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Check, Clock, Send, Trophy, Flame, Star, BarChart2 } from "lucide-react";
import CallHistory from "./CallHistory";

interface WeekDay { date: string; calls: number; }
interface GoalsData {
  dailyStats: { callsLogged: number };
  streak: { currentStreak: number; longestStreak: number };
  weekHistory: WeekDay[];
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Submission {
  id: string; leadName: string; leadCity: string; status: "pending" | "accepted" | "rejected";
  dealValue?: number; commissionAmount?: number; commissionPaid?: boolean;
  submittedAt: string; resolvedAt?: string; estimatedBudget: string; repNotes: string;
}

interface LeadState {
  status: string; stage: string; callCount?: number; lastContacted?: string;
  submittedAt?: string;
}

interface Props {
  states: Record<string, LeadState>;
  repName: string;
}

function getBestDay(weekHistory: WeekDay[]): string {
  if (!weekHistory.length) return "—";
  const best = weekHistory.reduce((a, b) => (b.calls > a.calls ? b : a));
  if (best.calls === 0) return "—";
  const dow = new Date(best.date + "T12:00:00").getDay();
  return DAY_LABELS[dow];
}

function getAvgCallsPerDay(weekHistory: WeekDay[]): string {
  const activeDays = weekHistory.filter((d) => d.calls > 0);
  if (!activeDays.length) return "0";
  const total = weekHistory.reduce((s, d) => s + d.calls, 0);
  return (total / activeDays.length).toFixed(1);
}

export default function Earnings({ states, repName }: Props) {
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<GoalsData | null>(null);
  const H = { fontFamily: "var(--font-heading)" };

  useEffect(() => {
    fetch("/api/crm/submit").then((r) => r.json()).then((d) => {
      if (Array.isArray(d)) setSubs(d);
      setLoading(false);
    }).catch(() => setLoading(false));
    fetch("/api/crm/goals").then((r) => r.json()).then((d) => setGoals(d)).catch(() => {});
  }, []);

  const leadsWorked = Object.values(states).filter((s) => s.lastContacted || s.callCount).length;
  const totalCalls = Object.values(states).reduce((sum, s) => sum + (s.callCount ?? 0), 0);
  const interested = Object.values(states).filter((s) => s.stage === "interested").length;
  const submitted = Object.values(states).filter((s) => !!s.submittedAt).length;

  const accepted = subs.filter((s) => s.status === "accepted");
  const pending = accepted.filter((s) => !s.commissionPaid);
  const paid = accepted.filter((s) => s.commissionPaid);

  const pendingTotal = pending.reduce((sum, s) => sum + (s.commissionAmount ?? 0), 0);
  const paidTotal = paid.reduce((sum, s) => sum + (s.commissionAmount ?? 0), 0);
  const totalEarned = accepted.reduce((sum, s) => sum + (s.commissionAmount ?? 0), 0);

  const conversionRate = subs.length > 0 ? Math.round((accepted.length / subs.length) * 100) : 0;
  const winRate = subs.length > 0 ? Math.round((accepted.length / subs.length) * 100) : 0;

  const bestDay = goals ? getBestDay(goals.weekHistory) : "—";
  const avgCallsPerDay = goals ? getAvgCallsPerDay(goals.weekHistory) : "0";

  // Funnel data
  const funnelSteps = [
    { label: "Leads Worked", count: leadsWorked, color: "#F97316" },
    { label: "Interested", count: interested, color: "#FB923C" },
    { label: "Submitted to Duke", count: subs.length, color: "#C2410C" },
    { label: "Accepted", count: accepted.length, color: "#7C3AED" },
  ];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-[var(--crm-accent)] border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 pb-8">

      {/* Hero */}
      <div className="bg-gradient-to-br from-[var(--crm-accent-weak)] via-[var(--crm-accent-weak)] to-transparent border border-[var(--crm-accent-border)] rounded-2xl p-6">
        <p className="text-xs font-semibold text-[var(--crm-accent-text)] uppercase tracking-wider mb-1" style={H}>{repName}&apos;s Earnings</p>
        <div className="flex items-end gap-3 flex-wrap">
          <p className="text-5xl font-bold text-[var(--crm-text)] tabular-nums" style={H}>${totalEarned.toFixed(2)}</p>
          <div className="mb-1">
            <p className="text-sm text-[var(--crm-text-2)]" style={H}>total earned</p>
            {pendingTotal > 0 && <p className="text-sm text-[var(--crm-accent-text)] font-semibold" style={H}>${pendingTotal.toFixed(2)} pending payout</p>}
          </div>
        </div>
      </div>

      {/* This Week */}
      {goals && (
        <div className="bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-2xl px-5 py-4">
          <p className="text-xs font-bold text-[var(--crm-text-3)] uppercase tracking-wider mb-3" style={H}>This Week</p>
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-[var(--crm-text-2)]" style={H}>
                  Calls: <span className="text-[var(--crm-text)] font-bold">{goals.weekHistory.reduce((s, d) => s + d.calls, 0)}</span>
                </span>
                {goals.streak.currentStreak > 0 ? (
                  <span className="text-sm text-[var(--crm-text-2)]" style={H}>
                    🔥 <span className="text-[var(--crm-text)] font-bold">{goals.streak.currentStreak}</span> day streak
                  </span>
                ) : (
                  <span className="text-sm text-[var(--crm-text-3)]" style={H}>No streak yet</span>
                )}
                {goals.streak.longestStreak > 0 && (
                  <span className="text-xs text-[var(--crm-text-3)]" style={H}>Best: {goals.streak.longestStreak} days</span>
                )}
              </div>
            </div>
            {/* Mini bar chart */}
            <div className="flex items-end gap-1 shrink-0" style={{ height: 36 }}>
              {(() => {
                const maxC = Math.max(...goals.weekHistory.map((d) => d.calls), 1);
                const todayStr = new Date().toISOString().slice(0, 10);
                return goals.weekHistory.map((day) => {
                  const label = DAY_LABELS[new Date(day.date + "T12:00:00").getDay()];
                  const bh = maxC > 0 ? Math.max(4, Math.round((day.calls / maxC) * 24)) : 4;
                  const isToday = day.date === todayStr;
                  return (
                    <div key={day.date} className="flex flex-col items-center gap-0.5">
                      <div className="w-5 rounded-sm" style={{
                        height: bh,
                        backgroundColor: isToday ? "var(--crm-accent)" : day.calls > 0 ? "var(--crm-accent-border)" : "var(--crm-border)",
                      }} />
                      <span className="text-[9px] font-semibold" style={{ color: isToday ? "var(--crm-text-2)" : "var(--crm-text-3)" }}>{label}</span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Stats grid (with Best Day, Avg Calls/Day, Win Rate) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Calls Made", val: totalCalls, icon: <Flame size={16} className="text-[var(--crm-accent)]" />, color: "text-[var(--crm-text)]" },
          { label: "Leads Worked", val: leadsWorked, icon: <TrendingUp size={16} className="text-blue-400" />, color: "text-[var(--crm-text)]" },
          { label: "Interested", val: interested, icon: <Trophy size={16} className="text-yellow-500" />, color: "text-yellow-500" },
          { label: "Submitted to Duke", val: subs.length, icon: <Send size={16} className="text-purple-400" />, color: "text-[var(--crm-text)]" },
          { label: "Accepted", val: accepted.length, icon: <Check size={16} className="text-emerald-500" />, color: "text-emerald-500" },
          { label: "Conversion Rate", val: `${conversionRate}%`, icon: <TrendingUp size={16} className="text-[var(--crm-accent)]" />, color: "text-[var(--crm-accent-text)]" },
          { label: "Best Day", val: bestDay, icon: <Star size={16} className="text-yellow-500" />, color: "text-yellow-500" },
          { label: "Avg Calls / Day", val: avgCallsPerDay, icon: <BarChart2 size={16} className="text-blue-400" />, color: "text-[var(--crm-text)]" },
          { label: "Win Rate", val: `${winRate}%`, icon: <Check size={16} className="text-emerald-500" />, color: "text-emerald-500" },
        ].map(({ label, val, icon, color }) => (
          <div key={label} className="bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-2xl px-4 py-4">
            <div className="flex items-center gap-2 text-xs text-[var(--crm-text-3)] mb-2" style={H}>{icon}{label}</div>
            <p className={`text-2xl font-bold tabular-nums ${color}`} style={H}>{val}</p>
          </div>
        ))}
      </div>

      {/* Payout status */}
      {(pendingTotal > 0 || paidTotal > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {pendingTotal > 0 && (
            <div className="bg-[var(--crm-accent-weak)] border border-[var(--crm-accent-border)] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-[var(--crm-accent)]" />
                <p className="text-xs font-semibold text-[var(--crm-accent-text)]" style={H}>Awaiting Payment</p>
              </div>
              <p className="text-2xl font-bold text-[var(--crm-accent-text)]" style={H}>${pendingTotal.toFixed(2)}</p>
              <p className="text-xs text-[var(--crm-text-3)] mt-1" style={H}>from {pending.length} accepted deal{pending.length !== 1 ? "s" : ""}</p>
            </div>
          )}
          {paidTotal > 0 && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign size={14} className="text-emerald-500" />
                <p className="text-xs font-semibold text-emerald-500" style={H}>Paid Out</p>
              </div>
              <p className="text-2xl font-bold text-emerald-500" style={H}>${paidTotal.toFixed(2)}</p>
              <p className="text-xs text-[var(--crm-text-3)] mt-1" style={H}>from {paid.length} deal{paid.length !== 1 ? "s" : ""}</p>
            </div>
          )}
        </div>
      )}

      {/* Submissions history */}
      <div>
        <h2 className="text-sm font-bold text-[var(--crm-text)] mb-3" style={H}>Your Submissions</h2>
        {subs.length === 0 ? (
          <div className="bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-2xl p-8 text-center">
            <Send size={28} className="text-[var(--crm-text-3)] mx-auto mb-3" />
            <p className="text-[var(--crm-text-3)] text-sm" style={H}>No submissions yet</p>
            <p className="text-[var(--crm-text-3)] text-xs mt-1" style={H}>When you find a hot lead and push it to Duke, it shows up here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...subs].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).map((sub) => (
              <div key={sub.id} className="bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--crm-text)]" style={H}>{sub.leadName}</p>
                    <p className="text-xs text-[var(--crm-text-3)] mt-0.5" style={H}>
                      {sub.leadCity} · {new Date(sub.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                    {sub.estimatedBudget && <p className="text-xs text-[var(--crm-text-3)] mt-1" style={H}>Est. budget: {sub.estimatedBudget}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {sub.status === "pending" && (
                      <span className="text-xs font-semibold text-[var(--crm-accent-text)] bg-[var(--crm-accent-weak)] border border-[var(--crm-accent-border)] px-2.5 py-1 rounded-full" style={H}>⏳ Pending</span>
                    )}
                    {sub.status === "accepted" && (
                      <div className="text-right">
                        <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full" style={H}>✓ Accepted</span>
                        {sub.commissionAmount && (
                          <p className="text-sm font-bold text-emerald-500 mt-1" style={H}>
                            ${sub.commissionAmount.toFixed(2)} {sub.commissionPaid ? <span className="text-xs font-normal text-emerald-500/70">(paid)</span> : <span className="text-xs font-normal text-[var(--crm-accent-text)]">(pending)</span>}
                          </p>
                        )}
                      </div>
                    )}
                    {sub.status === "rejected" && (
                      <span className="text-xs font-semibold text-zinc-500 bg-zinc-500/10 border border-zinc-500/20 px-2.5 py-1 rounded-full" style={H}>✕ Passed</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conversion Funnel */}
      <div className="bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-2xl p-5">
        <h2 className="text-sm font-bold text-[var(--crm-text)] mb-4" style={H}>Conversion Funnel</h2>
        <div className="space-y-3">
          {funnelSteps.map((step, i) => {
            const prevCount = i === 0 ? step.count : funnelSteps[i - 1].count;
            const pct = prevCount > 0 ? Math.round((step.count / prevCount) * 100) : 0;
            const widthPct = funnelSteps[0].count > 0
              ? Math.max(8, Math.round((step.count / funnelSteps[0].count) * 100))
              : 8;
            return (
              <div key={step.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[var(--crm-text-2)]" style={H}>{step.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--crm-text)] tabular-nums" style={H}>{step.count}</span>
                    {i > 0 && (
                      <span className="text-xs text-[var(--crm-text-3)]" style={H}>({pct}% of prev)</span>
                    )}
                  </div>
                </div>
                <div className="h-5 rounded-md overflow-hidden bg-[var(--crm-surface-3)]">
                  <div
                    className="h-full rounded-md transition-all"
                    style={{
                      width: `${widthPct}%`,
                      background: `linear-gradient(to right, ${step.color}, ${step.color}88)`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {submitted > 0 && (
          <p className="text-xs text-[var(--crm-text-3)] mt-3" style={H}>
            {submitted} lead{submitted !== 1 ? "s" : ""} marked submitted from pipeline view
          </p>
        )}
      </div>

      {/* Motivation */}
      <div className="bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-2xl p-5">
        <h2 className="text-sm font-bold text-[var(--crm-text)] mb-3" style={H}>💰 Commission Works Like This</h2>
        <div className="space-y-2">
          {[
            "You find a business that needs a website",
            "You call them, build rapport, tell them about us",
            "They're interested — you push them to Duke",
            "Duke closes the deal and builds the site",
            "You get your % of whatever the deal is worth",
            "No cap. Work as much or as little as you want.",
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--crm-accent-weak)] border border-[var(--crm-accent-border)] text-xs font-bold text-[var(--crm-accent-text)] flex items-center justify-center shrink-0" style={H}>
                {i + 1}
              </div>
              <p className="text-sm text-[var(--crm-text-2)]" style={H}>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call History */}
      <CallHistory />

    </div>
  );
}
