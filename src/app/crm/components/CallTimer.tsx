"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { PhoneOff } from "lucide-react";

interface CallTimerLead {
  id: string;
  name: string;
  phone: string;
}

interface Props {
  lead: CallTimerLead;
  onOutcome: (outcome: string) => void;
  onDismiss: () => void;
}

const OUTCOMES: { key: string; label: string; color: string; activeColor: string }[] = [
  { key: "no_answer",    label: "No Answer", color: "bg-zinc-700 text-zinc-300 border-zinc-600",    activeColor: "bg-zinc-500" },
  { key: "voicemail",    label: "Voicemail",  color: "bg-blue-900/60 text-blue-300 border-blue-700", activeColor: "bg-blue-600" },
  { key: "call_back",    label: "Call Back",  color: "bg-purple-900/60 text-purple-300 border-purple-700", activeColor: "bg-purple-600" },
  { key: "interested",   label: "Interested", color: "bg-green-900/60 text-green-300 border-green-700",   activeColor: "bg-green-600" },
];

const H = { fontFamily: "var(--font-heading)" };

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CallTimer({ lead, onOutcome, onDismiss }: Props) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset timer when a new call starts
    setSeconds(0);
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [lead.id]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${pad(minutes)}:${pad(secs)}`;

  const content = (
    <div
      className="fixed left-0 right-0 z-50 px-3 py-3"
      style={{ bottom: "calc(56px + env(safe-area-inset-bottom, 0px))", ...H }}
    >
      <div className="max-w-3xl mx-auto bg-[#1a1a1d] border border-[#F97316]/40 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header row */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-sm font-bold text-white truncate" style={H}>{lead.name}</p>
            {lead.phone && <p className="text-xs text-white/40 hidden sm:block">{lead.phone}</p>}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold tabular-nums text-[#F97316]">{display}</span>
            <button
              onClick={onDismiss}
              className="flex items-center gap-1.5 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-xl transition-colors"
            >
              <PhoneOff size={13} />
              End Call
            </button>
          </div>
        </div>

        {/* Outcome buttons */}
        <div className="flex gap-2 px-4 py-3 flex-wrap">
          {OUTCOMES.map((o) => (
            <button
              key={o.key}
              onClick={() => onOutcome(o.key)}
              className={`flex-1 min-w-[5rem] text-xs font-semibold px-3 py-2 rounded-xl border transition-all active:scale-95 hover:brightness-125 ${o.color}`}
              style={H}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}
