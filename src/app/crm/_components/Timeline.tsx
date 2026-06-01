import type { Activity, Rep } from "@/lib/crm/types";
import { DISPOSITION_LABELS } from "@/lib/crm/types";
import { timeAgo, fmtDuration } from "../_lib";

export default function Timeline({ activities, reps }: { activities: Activity[]; reps: Rep[] }) {
  const repName = (id?: string) => reps.find((r) => r.id === id)?.name ?? "—";
  const sorted = [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  if (sorted.length === 0) {
    return <p className="py-4 text-center text-sm text-zinc-500">No activity yet — this is a fresh lead.</p>;
  }

  return (
    <ol className="space-y-3">
      {sorted.map((a) => (
        <li key={a.id} className="relative pl-5">
          <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-orange-500" />
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-medium text-zinc-200">
              {a.type === "call"
                ? a.disposition
                  ? DISPOSITION_LABELS[a.disposition]
                  : "Call"
                : a.type === "note"
                  ? "Note"
                  : a.type}
              {a.durationSec ? <span className="ml-1 text-zinc-500">· {fmtDuration(a.durationSec)}</span> : null}
            </span>
            <span className="shrink-0 text-xs text-zinc-500">{timeAgo(a.createdAt)}</span>
          </div>
          {a.body && <p className="mt-0.5 text-sm text-zinc-400">{a.body}</p>}
          <p className="mt-0.5 text-xs text-zinc-600">{repName(a.repId)}</p>
        </li>
      ))}
    </ol>
  );
}
