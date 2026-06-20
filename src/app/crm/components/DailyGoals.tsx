"use client";

import { useState, useEffect } from "react";

const DAILY_GOAL = 15;

interface DailyStats {
      date: string;
      callsLogged: number;
      leadsWorked: number;
      submissionsToday: number;
}

interface RepStreak {
      currentStreak: number;
      longestStreak: number;
      lastActiveDate: string;
      totalCallsAllTime: number;
}

interface WeekDay {
      date: string;
      calls: number;
}

interface GoalsData {
      dailyStats: DailyStats;
      streak: RepStreak;
      weekHistory: WeekDay[];
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DailyGoals() {
      const [data, setData] = useState<GoalsData | null>(null);
      const H = { fontFamily: "var(--font-heading)" };

  useEffect(() => {
          fetch("/api/crm/goals")
            .then((r) => r.json())
            .then((d) => {
                        if (d && d.dailyStats && typeof d.dailyStats.callsLogged === "number") {
                                      setData(d as GoalsData);
                        }
            })
            .catch(() => {});
  }, []);

  if (!data || !data.dailyStats) return null;

  const { dailyStats, streak, weekHistory } = data;
      const calls = dailyStats.callsLogged ?? 0;
      const pct = Math.min(100, Math.round((calls / DAILY_GOAL) * 100));
      const goalHit = calls >= DAILY_GOAL;
      const maxCalls = Math.max(...weekHistory.map((d) => d.calls), 1);

  return (
          <div
                    className="bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-2xl px-5 py-4 mb-5"
                    style={H}
                  >
                <div className="flex items-start gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                      {streak.currentStreak > 0 ? (
                                    <span className="text-sm font-bold text-[var(--crm-text)]">
                                        {streak.currentStreak} day streak
                                    </span>
                                  ) : (
                                    <span className="text-sm font-bold text-[var(--crm-text-2)]">
                                                    Start your streak today!
                                    </span>
                                              )}
                                      {streak.longestStreak > 0 && (
                                    <span className="text-xs text-[var(--crm-text-3)]">
                                                    Best: {streak.longestStreak} days
                                    </span>
                                              )}
                                  </div>
                                  <div className="flex items-center justify-between mb-1.5">
                                              <span className="text-xs text-[var(--crm-text-2)]">
                                                  {"Today: "}
                                                            <span className={goalHit ? "text-emerald-500 font-bold" : "text-[var(--crm-text)] font-semibold"}>
                                                                {calls}/{DAILY_GOAL} calls
                                                            </span>
                                              </span>
                                      {goalHit && (
                                    <span className="text-xs font-bold text-emerald-500">Goal hit!</span>
                                              )}
                                  </div>
                                  <div className="h-2.5 bg-[var(--crm-surface-3)] rounded-full overflow-hidden">
                                              <div
                                                                className="h-full rounded-full transition-all duration-500"
                                                                style={{
                                                                                    width: `${pct}%`,
                                                                                    backgroundColor: goalHit ? "var(--color-emerald-500)" : "var(--crm-accent)",
                                                                }}
                                                              />
                                  </div>
                        </div>
                        <div className="flex items-end gap-1 shrink-0" style={{ height: 40 }}>
                            {weekHistory.map((day) => {
                                  const dayLabel = DAY_LABELS[new Date(day.date + "T12:00:00").getDay()];
                                  const barH = maxCalls > 0 ? Math.max(4, Math.round((day.calls / maxCalls) * 28)) : 4;
                                  const isToday = day.date === dailyStats.date;
                                  return (
                                                    <div key={day.date} className="flex flex-col items-center gap-0.5">
                                                                    <div
                                                                                          className="w-5 rounded-sm"
                                                                                          style={{
                                                                                                                  height: barH,
                                                                                                                  backgroundColor: isToday
                                                                                                                                            ? goalHit
                                                                                                                                              ? "var(--color-emerald-500)"
                                                                                                                                              : "var(--crm-accent)"
                                                                                                                                            : day.calls > 0
                                                                                                                                            ? "var(--crm-accent-border)"
                                                                                                                                            : "var(--crm-border)",
                                                                                              }}
                                                                                        />
                                                                    <span
                                                                                          className="text-[9px] font-semibold"
                                                                                          style={{
                                                                                                                  color: isToday ? "var(--crm-text-2)" : "var(--crm-text-3)",
                                                                                              }}
                                                                                        >
                                                                        {dayLabel}
                                                                    </span>
                                                    </div>
                                                  );
                  })}
                        </div>
                </div>
          </div>
        );
}
