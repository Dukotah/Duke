import { Phone, PhoneCall, CalendarCheck, DollarSign, Flame } from "lucide-react";
import type { CrmStats } from "@/lib/crm/types";
import { fmtCurrency, fmtPct } from "../_lib";

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`grid h-9 w-9 place-items-center rounded-lg ${accent ? "bg-orange-500/15 text-orange-400" : "bg-zinc-800 text-zinc-400"}`}>
        {icon}
      </div>
      <div className="leading-tight">
        <div className="text-base font-bold text-white tabular-nums">{value}</div>
        <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      </div>
    </div>
  );
}

export default function LiveBar({ stats, dialedStreak }: { stats: CrmStats | null; dialedStreak: number }) {
  if (!stats) {
    return <div className="h-[52px] animate-pulse rounded-xl bg-zinc-900/60" />;
  }
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-2.5">
      <Stat icon={<Phone size={16} />} label="Calls Today" value={String(stats.callsToday)} />
      <Stat icon={<PhoneCall size={16} />} label="Connect Rate" value={fmtPct(stats.connectRate)} />
      <Stat icon={<CalendarCheck size={16} />} label="Booked Today" value={String(stats.bookedToday)} accent={stats.bookedToday > 0} />
      <Stat icon={<DollarSign size={16} />} label="Pipeline" value={fmtCurrency(stats.pipelineValue)} />
      <Stat icon={<Flame size={16} />} label="Dial Streak" value={String(dialedStreak)} accent={dialedStreak >= 3} />
    </div>
  );
}
