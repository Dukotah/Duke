import { useMemo, useState } from "react";
import { Shield, Search } from "lucide-react";
import { OBJECTIONS } from "@/lib/crm/scoring";

export default function ObjectionPanel() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(0);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return OBJECTIONS.map((o, i) => ({ o, i }));
    return OBJECTIONS.map((o, i) => ({ o, i })).filter(
      ({ o }) => o.trigger.toLowerCase().includes(t) || o.response.toLowerCase().includes(t),
    );
  }, [q]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center gap-2">
        <Shield size={15} className="text-orange-400" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Objection Handling</h2>
      </div>

      <div className="relative mb-3">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder='e.g. "too expensive"'
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pl-8 pr-3 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
        />
      </div>

      <div className="-mr-1 flex-1 space-y-2 overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-zinc-500">No match — wing it 😬</p>
        )}
        {filtered.map(({ o, i }) => {
          const isOpen = open === i;
          return (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left"
              >
                <span className="text-sm font-medium text-zinc-200">“{o.trigger}”</span>
                <span className="text-zinc-500">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <p className="border-t border-zinc-800 px-3.5 py-2.5 text-sm leading-relaxed text-emerald-200/90">
                  {o.response}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
