"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, Send, ThumbsUp, Target, TrendingUp, Activity, Flame } from "lucide-react";

// ─── Types (mirror /api/crm/goals + /api/crm/activity-log shapes) ──────────────

interface GoalsData {
  dailyStats: { date: string; callsLogged: number };
  streak: { currentStreak: number; longestStreak: number; totalCallsAllTime: number };
  weekHistory: { date: string; calls: number }[];
}

interface ActivityLogEntry {
  id: string;
  userId: string;
  repName: string;
  type: "call" | "note" | "email" | "submitted" | "status_change";
  outcome?: string;
  note?: string;
  createdAt: string;
  leadId: string;
}

const DAILY_GOAL = 15;
const H = { fontFamily: "var(--font-heading)" };

export default function MetricsCards() {
  const [goals, setGoals] = useState<GoalsData | null>(null);
  const [log, setLog] = useState<ActivityLogEntry[] | null>(null);

  useEffect(() => {
    fetch("/api/crm/goals")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.dailyStats && typeof d.dailyStats.callsLogged === "number") {
          setGoals(d as GoalsData);
        }
      })
      .catch(() => {});
    fetch("/api/crm/activity-log")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setLog(d as ActivityLogEntry[]);
      })
      .catch(() => {});
  }, []);

  if (!goals && !log) return null;

  // ─── Activity aggregation (last 30 days, server already trims to 30d) ────────
  const entries = log ?? [];
  const calls = entries.filter((e) => e.type === "call");
  const emails = entries.filter((e) => e.type === "email");
  const submitted = entries.filter((e) => e.type === "submitted");
  const interested = calls.filter((e) => e.outcome === "interested");

  // Conversion: of calls that connected to an outcome, how many landed "interested".
  const conversionRate = calls.length > 0 ? Math.round((interested.length / calls.length) * 100) : 0;

  // Goal progress (today vs daily call goal)
  const callsToday = goals?.dailyStats.callsLogged ?? 0;
  const goalPct = Math.min(100, Math.round((callsToday / DAILY_GOAL) * 100));
  const goalHit = callsToday >= DAILY_GOAL;
  const weekTotal = goals?.weekHistory.reduce((s, d) => s + d.calls, 0) ?? 0;

  const cards: {
    label: string;
    value: string | number;
    sub?: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      label: "Calls (30d)",
      value: calls.length,
      sub: weekTotal > 0 ? `${weekTotal} this week` : undefined,
      icon: <Phone size={15} className="text-[#F97316]" />,
      color: "text-white",
    },
    {
      label: "Interested",
      value: interested.length,
      sub: `${conversionRate}% conversion`,
      icon: <ThumbsUp size={15} className="text-green-400" />,
      color: "text-green-400",
    },
    {
      label: "Emails (30d)",
      value: emails.length,
      icon: <Mail size={15} className="text-blue-400" />,
      color: "text-white",
    },
    {
      label: "Submitted (30d)",
      value: submitted.length,
      icon: <Send size={15} className="text-purple-400" />,
      color: "text-white",
    },
  ];

  return (
    <div className="mb-5 space-y-3" style={H}>
      {/* Goal progress strip */}
      <div className="bg-[#1C1C1F] border border-white/[0.07] rounded-2xl px-5 py-4">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Target size={15} className={goalHit ? "text-green-400" : "text-[#F97316]"} />
            <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Daily Goal</span>
          </div>
          <span className="text-xs text-white/50">
            <span className={goalHit ? "text-green-400 font-bold" : "text-white font-semibold"}>
              {callsToday}/{DAILY_GOAL} calls
            </span>
            {goalHit && <span className="ml-2 text-green-400 font-bold">Goal hit!</span>}
          </span>
        </div>
        <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${goalPct}%`, backgroundColor: goalHit ? "#4ade80" : "#F97316" }}
          />
        </div>
        {goals && (goals.streak.currentStreak > 0 || goals.streak.totalCallsAllTime > 0) && (
          <div className="flex items-center gap-3 mt-2.5 text-xs text-white/40">
            {goals.streak.currentStreak > 0 && (
              <span className="flex items-center gap-1">
                <Flame size={11} className="text-[#F97316]" />
                <span className="text-white/70 font-semibold">{goals.streak.currentStreak}</span> day streak
              </span>
            )}
            {goals.streak.totalCallsAllTime > 0 && (
              <span className="flex items-center gap-1">
                <Activity size={11} className="text-white/40" />
                <span className="text-white/70 font-semibold">{goals.streak.totalCallsAllTime}</span> all-time calls
              </span>
            )}
          </div>
        )}
      </div>

      {/* Metric cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-[#1C1C1F] border border-white/[0.06] rounded-2xl px-4 py-3.5">
            <div className="flex items-center gap-1.5 text-[11px] text-white/40 mb-1.5">
              {c.icon}
              <span className="truncate">{c.label}</span>
            </div>
            <p className={`text-2xl font-bold tabular-nums ${c.color}`}>{c.value}</p>
            {c.sub && (
              <p className="text-[10px] text-white/30 mt-0.5 flex items-center gap-1">
                <TrendingUp size={9} className="text-[#F97316]/60" />
                {c.sub}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
