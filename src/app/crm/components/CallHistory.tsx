"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";

interface ActivityLogEntry {
  id: string;
  leadId: string;
  userId: string;
  repName: string;
  type: "call" | "note" | "email" | "submitted" | "status_change";
  outcome?: string;
  note?: string;
  createdAt: string;
}

const OUTCOME_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  interested: { label: "Interested", bg: "bg-green-400/10", text: "text-green-400" },
  callback: { label: "Callback", bg: "bg-blue-400/10", text: "text-blue-400" },
  not_interested: { label: "Not Interested", bg: "bg-zinc-500/10", text: "text-zinc-400" },
  voicemail: { label: "Voicemail", bg: "bg-yellow-400/10", text: "text-yellow-400" },
  no_answer: { label: "No Answer", bg: "bg-white/[0.06]", text: "text-white/40" },
  submitted: { label: "Submitted", bg: "bg-purple-400/10", text: "text-purple-400" },
  wrong_number: { label: "Wrong #", bg: "bg-red-400/10", text: "text-red-400" },
};

function getDayLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const d = date.toDateString();
  if (d === today.toDateString()) return "Today";
  if (d === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function groupByDay(entries: ActivityLogEntry[]): { label: string; entries: ActivityLogEntry[] }[] {
  const groups: Map<string, ActivityLogEntry[]> = new Map();
  for (const entry of entries) {
    const key = new Date(entry.createdAt).toDateString();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }
  return Array.from(groups.entries()).map(([, dayEntries]) => ({
    label: getDayLabel(dayEntries[0].createdAt),
    entries: dayEntries,
  }));
}

export default function CallHistory() {
  const [entries, setEntries] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const H = { fontFamily: "var(--font-heading)" };

  useEffect(() => {
    fetch("/api/crm/activity-log")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const callEntries = entries.filter((e) => e.type === "call");
  const groups = groupByDay(callEntries);

  return (
    <div>
      <h2 className="text-sm font-bold text-white mb-3" style={H}>
        Call History — Last 30 Days
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-5 h-5 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : callEntries.length === 0 ? (
        <div className="bg-[#1C1C1F] border border-white/[0.06] rounded-2xl p-8 text-center">
          <Phone size={28} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/40 text-sm" style={H}>No calls yet — start dialing!</p>
        </div>
      ) : (
        <div className="bg-[#1C1C1F] border border-white/[0.06] rounded-2xl overflow-hidden max-h-[420px] overflow-y-auto">
          {groups.map((group) => (
            <div key={group.label}>
              <div className="px-4 py-2 bg-white/[0.03] border-b border-white/[0.06] sticky top-0">
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider" style={H}>
                  {group.label}
                </p>
              </div>
              {group.entries.map((entry, idx) => {
                const outcomeKey = entry.outcome ?? "";
                const badge = OUTCOME_STYLES[outcomeKey] ?? {
                  label: entry.outcome ?? "Called",
                  bg: "bg-white/[0.06]",
                  text: "text-white/50",
                };
                const time = new Date(entry.createdAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                });
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-3 px-4 py-3 ${
                      idx < group.entries.length - 1 ? "border-b border-white/[0.04]" : ""
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#F97316]/10 flex items-center justify-center shrink-0">
                      <Phone size={12} className="text-[#F97316]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate" style={H}>
                        {entry.note ? entry.note : `Lead ${entry.leadId.slice(-6)}`}
                      </p>
                      <p className="text-xs text-white/30 mt-0.5" style={H}>{time}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border border-transparent ${badge.bg} ${badge.text} shrink-0`}
                      style={H}
                    >
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
