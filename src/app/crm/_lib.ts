// Client-side helpers shared across the caller workspace.

import type { Disposition } from "@/lib/crm/types";

export function fmtCurrency(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function fmtPct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

export function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export const HEAT_STYLES: Record<"hot" | "warm" | "cool", { chip: string; dot: string; label: string }> = {
  hot: { chip: "bg-red-500/15 text-red-400 border-red-500/25", dot: "bg-red-500", label: "HOT" },
  warm: { chip: "bg-amber-500/15 text-amber-400 border-amber-500/25", dot: "bg-amber-400", label: "WARM" },
  cool: { chip: "bg-zinc-500/15 text-zinc-400 border-zinc-600/30", dot: "bg-zinc-500", label: "COOL" },
};

// How each disposition button looks + whether it opens the callback scheduler.
export const DISPOSITIONS: {
  key: Disposition;
  label: string;
  tone: "good" | "neutral" | "bad";
  needsCallback?: boolean;
}[] = [
  { key: "booked", label: "Demo Booked 🎉", tone: "good" },
  { key: "connected", label: "Connected", tone: "good" },
  { key: "callback", label: "Callback", tone: "neutral", needsCallback: true },
  { key: "voicemail", label: "Voicemail", tone: "neutral" },
  { key: "no_answer", label: "No Answer", tone: "neutral" },
  { key: "not_interested", label: "Not Interested", tone: "bad" },
  { key: "wrong_number", label: "Wrong #", tone: "bad" },
  { key: "do_not_call", label: "Do Not Call", tone: "bad" },
];

export const TONE_STYLES: Record<"good" | "neutral" | "bad", string> = {
  good: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20",
  neutral: "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700",
  bad: "bg-red-500/10 text-red-300 border-red-500/25 hover:bg-red-500/20",
};
