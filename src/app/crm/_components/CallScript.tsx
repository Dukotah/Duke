import type { Lead } from "@/lib/crm/types";
import { buildScript } from "@/lib/crm/scoring";

export default function CallScript({ lead, repName }: { lead: Lead; repName: string }) {
  const blocks = buildScript(lead);
  const fill = (s: string) => s.replace(/\{repName\}/g, repName);

  return (
    <div className="space-y-3">
      {blocks.map((b, i) => (
        <div key={b.heading} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-orange-500/15 text-[11px] font-bold text-orange-400">
              {i + 1}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {b.heading}
            </span>
          </div>
          <div className="space-y-1">
            {b.lines.map((line, j) => (
              <p key={j} className="text-sm leading-relaxed text-zinc-200">
                {fill(line)}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
