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
          .then((d: GoalsData) => {
                    // Guard: only set data if the response contains required fields
                        if (d && d.dailyStats && typeof d.dailyStats.callsLogged === "number") {
                                    setData(d);
                        }
          })
          .catch(() => {});
  }, []);

  // Return null until data loads successfully
  if (!data || !data.dailyStats) return null;

  const { dailyStats, streak, weekHistory } = data;
    const calls = dailyStats.callsLogged ?? 0;
    const pct = Math.min(100, Math.round((calls / DAILY_GOAL) * 100));
    const goalHit = calls >= DAILY_GOAL;
    const maxCalls = Math.max(...weekHistory.map((d) => d.calls), 1);

  return (
        <div
                className="bg-[#1C1C1F] border border-white/[0.07] rounded-2xl px-5 py-4 mb-5"
                style={H}
              >
              <div className="flex items-start gap-4 flex-wrap">
                {/* Left: streak + today progress */}
                      <div className="flex-1 min-w-0">
                        {/* Streak */}
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  {streak.currentStreak > 0 ? (
                              <span className="text-sm font-bold text-white">
                                              🔥 {streak.currentStreak} day streak
                              </span>span>
                            ) : (
                              <span className="text-sm font-bold text-white/50">
                                              Start your streak today!
                              </span>span>
                                            )}
                                  {streak.longestStreak > 0 && (
                              <span className="text-xs text-white/30">
                                              Best: {streak.longestStreak} days
                              </span>span>
                                            )}
                                </div>div>
                      
                        {/* Today progress label */}
                                <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs text-white/50">
                                                          Today:{" "}
                                                          <span className={goalHit ? "text-green-400 font-bold" : "text-white font-semibold"}>
                                                            {calls}/{DAILY_GOAL} calls
                                                          </span>span>
                                            </span>span>
                                  {goalHit && (
                              <span className="text-xs font-bold text-green-400">🎉 Goal hit! Keep going!</span>span>
                                            )}
                                </div>div>
                      
                        {/* Progress bar */}
                                <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                                            <div
                                                            className="h-full rounded-full transition-all duration-500"
                                                            style={{
                                                                              width: `${pct}%`,
                                                                              backgroundColor: goalHit ? "#4ade80" : "#F97316",
                                                            }}
                                                          />
                                </div>div>
                      </div>div>
              
                {/* Right: mini 7-day bar chart */}
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
                                                                                                                                ? "#4ade80"
                                                                                                                                : "#F97316"
                                                                                                                              : day.calls > 0
                                                                                                                              ? "rgba(249,115,22,0.4)"
                                                                                                                              : "rgba(255,255,255,0.06)",
                                                                                }}
                                                                              />
                                                            <span
                                                                                className="text-[9px] font-semibold"
                                                                                style={{ color: isToday ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)" }}
                                                                              >
                                                              {dayLabel}
                                                            </span>span>
                                            </div>div>
                                          );
              })}
                      </div>div>
              </div>div>
        </div>div>
      );
}</div>
