"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, Send, ThumbsUp, TrendingUp } from "lucide-react";

// ─── Types (mirror /api/crm/activity-log shape) ───────────────────────────────

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

const H = { fontFamily: "var(--font-heading)" };

export default function MetricsCards() {
  const [log, setLog] = useState<ActivityLogEntry[] | null>(null);

  useEffect(() => {
    fetch("/api/crm/activity-log")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setLog(d as ActivityLogEntry[]);
      })
      .catch(() => {});
  }, []);

  if (!log) return null;

  // ─── Activity aggregation (most-recent entries from activity-log) ────────────
  const entries = log;
  const calls = entries.filter((e) => e.type === "call");
  const emails = entries.filter((e) => e.type === "email");
  const submitted = entries.filter((e) => e.type === "submitted");
  const interested = calls.filter((e) => e.outcome === "interested");

  // Conversion: of calls that connected to an outcome, how many landed "interested".
  const connectedCalls = calls.filter(
    (e) => e.outcome !== "no_answer" && e.outcome !== "voicemail",
  );
  const conversionRate =
    connectedCalls.length > 0
      ? Math.round((interested.length / connectedCalls.length) * 100)
      : 0;

  const cards: {
    label: string;
    value: string | number;
    sub?: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      label: "Calls (recent)",
      value: calls.length,
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
      label: "Emails (recent)",
      value: emails.length,
      icon: <Mail size={15} className="text-blue-400" />,
      color: "text-white",
    },
    {
      label: "Submitted (recent)",
      value: submitted.length,
      icon: <Send size={15} className="text-purple-400" />,
      color: "text-white",
    },
  ];

  return (
    <div className="mb-5 space-y-3" style={H}>
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
