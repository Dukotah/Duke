"use client";

import { useState, useEffect } from "react";
import { Phone, StickyNote, Send, Mail, PhoneMissed, PhoneOff, CalendarClock, ThumbsDown, ThumbsUp, Clock } from "lucide-react";

interface ActivityEntry {
  id: string;
  userId: string;
  repName: string;
  type: "call" | "note" | "email" | "submitted" | "status_change";
  outcome?: string;
  note?: string;
  createdAt: string;
}

const OUTCOME_LABELS: Record<string, string> = {
  no_answer: "No Answer",
  voicemail: "Left Voicemail",
  call_back: "Call Back Later",
  not_interested: "Not Interested",
  interested: "Interested!",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months !== 1 ? "s" : ""} ago`;
}

function EntryIcon({ type, outcome }: { type: ActivityEntry["type"]; outcome?: string }) {
  if (type === "submitted") return <Send size={13} className="text-[#F97316]" />;
  if (type === "note") return <StickyNote size={13} className="text-yellow-400" />;
  if (type === "email") return <Mail size={13} className={outcome === "logged" ? "text-white/40" : "text-blue-400"} />;
  if (type === "call") {
    if (outcome === "no_answer") return <PhoneMissed size={13} className="text-zinc-400" />;
    if (outcome === "voicemail") return <PhoneOff size={13} className="text-blue-400" />;
    if (outcome === "call_back") return <CalendarClock size={13} className="text-purple-400" />;
    if (outcome === "not_interested") return <ThumbsDown size={13} className="text-red-400" />;
    if (outcome === "interested") return <ThumbsUp size={13} className="text-green-400" />;
    return <Phone size={13} className="text-zinc-400" />;
  }
  return <Clock size={13} className="text-white/30" />;
}

function EntryColor(type: ActivityEntry["type"], outcome?: string): string {
  if (type === "submitted") return "bg-[#F97316]/10 border-[#F97316]/20";
  if (type === "note") return "bg-yellow-400/5 border-yellow-400/15";
  if (outcome === "interested") return "bg-green-400/5 border-green-400/15";
  if (outcome === "not_interested") return "bg-red-400/5 border-red-400/15";
  return "bg-white/[0.03] border-white/[0.06]";
}

export default function ActivityTimeline({ leadId }: { leadId: string }) {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const H = { fontFamily: "var(--font-heading)" };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show loading state while fetching on leadId change
    setLoading(true);
    fetch(`/api/crm/activity?leadId=${encodeURIComponent(leadId)}`)
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setEntries(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [leadId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="w-4 h-4 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!entries.length) {
    return (
      <p className="text-xs text-white/25 text-center py-6" style={H}>No activity yet</p>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div key={entry.id} className={`rounded-xl border px-3 py-2.5 ${EntryColor(entry.type, entry.outcome)}`}>
          <div className="flex items-start gap-2">
            <div className="mt-0.5 shrink-0">
              <EntryIcon type={entry.type} outcome={entry.outcome} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-semibold text-white/70" style={H}>
                    {entry.type === "submitted" ? "Submitted to Duke" :
                     entry.type === "note" ? "Note saved" :
                     entry.type === "email" ? (entry.outcome === "logged" ? "Email logged" : "Email sent") :
                     entry.outcome ? OUTCOME_LABELS[entry.outcome] ?? entry.outcome :
                     entry.type}
                  </span>
                  {entry.type === "email" && entry.outcome === "logged" && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/30 bg-white/10 rounded px-1.5 py-0.5 shrink-0" style={H}>
                      not delivered
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-white/25 shrink-0" style={H}>{timeAgo(entry.createdAt)}</span>
              </div>
              <p className="text-[10px] text-white/35 mt-0.5" style={H}>{entry.repName}</p>
              {entry.note && (
                <p className="text-xs text-white/55 mt-1 leading-relaxed" style={H}>{entry.note}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
