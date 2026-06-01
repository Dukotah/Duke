"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

interface DueItem {
  leadId: string;
  followUpDate: string;
  stage: string;
  lastContacted?: string;
}

interface Props {
  onSelectLeadId?: (leadId: string) => void;
}

export default function FollowUpBanner({ onSelectLeadId }: Props) {
  const [dueToday, setDueToday] = useState<DueItem[]>([]);
  const H = { fontFamily: "var(--font-heading)" };

  useEffect(() => {
    fetch("/api/crm/reminders")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d.dueToday)) setDueToday(d.dueToday); })
      .catch(() => {});
  }, []);

  if (!dueToday.length) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl px-4 py-4" style={H}>
      <div className="flex items-center gap-2 mb-2">
        <Calendar size={14} className="text-amber-400 shrink-0" />
        <p className="text-sm font-bold text-amber-300">
          📅 {dueToday.length} follow-up{dueToday.length !== 1 ? "s" : ""} due today
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {dueToday.map((item) => (
          <button
            key={item.leadId}
            onClick={() => onSelectLeadId?.(item.leadId)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-200 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
          >
            {item.leadId}
            {item.followUpDate && (
              <span className="text-amber-400/60 text-[10px]">{item.followUpDate}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
