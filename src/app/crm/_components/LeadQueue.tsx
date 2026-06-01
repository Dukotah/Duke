import { useMemo, useState } from "react";
import { Search, Clock } from "lucide-react";
import type { Lead } from "@/lib/crm/types";
import { problemList } from "@/lib/crm/scoring";
import HeatBadge from "./HeatBadge";

export default function LeadQueue({
  leads,
  activeId,
  onSelect,
}: {
  leads: Lead[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  // Captured once at mount — used only to flag overdue callbacks in the list.
  const [now] = useState(() => Date.now());

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return leads;
    return leads.filter(
      (l) =>
        l.business.toLowerCase().includes(t) ||
        l.city.toLowerCase().includes(t) ||
        l.industry.toLowerCase().includes(t),
    );
  }, [leads, q]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Call Queue <span className="text-zinc-600">· {leads.length}</span>
        </h2>
      </div>

      <div className="relative mb-3">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search leads…"
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-8 pr-3 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
        />
      </div>

      <div className="-mr-1 flex-1 space-y-2 overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-zinc-500">No leads match.</p>
        )}
        {filtered.map((l) => {
          const due = l.callbackAt && new Date(l.callbackAt).getTime() <= now;
          const top = problemList(l.signals)[0];
          const active = l.id === activeId;
          return (
            <button
              key={l.id}
              onClick={() => onSelect(l.id)}
              className={`w-full rounded-xl border p-3 text-left transition-colors ${
                active
                  ? "border-orange-500/60 bg-orange-500/10"
                  : "border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="truncate text-sm font-semibold text-white">{l.business}</span>
                <HeatBadge score={l.heatScore} showScore={false} />
              </div>
              <div className="mt-0.5 truncate text-xs text-zinc-500">
                {l.industry} · {l.city}
              </div>
              {top && (
                <div className="mt-1.5 truncate text-xs text-zinc-400">⚠ {top.label}</div>
              )}
              {due && (
                <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-semibold text-orange-400">
                  <Clock size={10} /> Callback due
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
