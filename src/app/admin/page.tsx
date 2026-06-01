"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Phone,
  PhoneCall,
  CalendarCheck,
  DollarSign,
  Clock,
  Users,
  RefreshCw,
  ArrowUpRight,
  Trophy,
  Flame,
  AlertCircle,
} from "lucide-react";
import type { CrmStats, Lead, Rep } from "@/lib/crm/types";
import type { RepStat } from "@/lib/crm/store";
import { PIPELINE_STAGES, STAGE_LABELS } from "@/lib/crm/types";
import {
  Avatar,
  Card,
  HeatBadge,
  SectionTitle,
  StageBadge,
  fmtCompactCurrency,
  fmtCurrency,
  fmtPct,
} from "./_components/ui";
import { topProblem } from "./_components/signals";

const POLL_MS = 15_000;

interface StatsResponse {
  stats: CrmStats;
  reps: RepStat[];
}
interface LeadsResponse {
  leads: Lead[];
}
interface RepsResponse {
  reps: Rep[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<CrmStats | null>(null);
  const [repStats, setRepStats] = useState<RepStat[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [reps, setReps] = useState<Rep[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async (initial: boolean) => {
    if (initial) setLoading(true);
    else setRefreshing(true);
    try {
      const [statsRes, leadsRes, repsRes] = await Promise.all([
        fetch("/api/crm/stats", { cache: "no-store" }),
        fetch("/api/crm/leads?view=all", { cache: "no-store" }),
        fetch("/api/crm/reps", { cache: "no-store" }),
      ]);
      if (!statsRes.ok || !leadsRes.ok || !repsRes.ok) {
        throw new Error("One or more CRM endpoints returned an error.");
      }
      const statsJson = (await statsRes.json()) as StatsResponse;
      const leadsJson = (await leadsRes.json()) as LeadsResponse;
      const repsJson = (await repsRes.json()) as RepsResponse;

      setStats(statsJson.stats);
      setRepStats(statsJson.reps ?? []);
      setLeads(leadsJson.leads ?? []);
      setReps(repsJson.reps ?? []);
      setError(null);
      setLastUpdated(new Date());
    } catch {
      setError(
        "Couldn't reach the CRM. Make sure the API is running, then refresh.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await load(true);
    })();
    const id = setInterval(() => load(false), POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  const repById = useMemo(() => {
    const m = new Map<string, Rep>();
    for (const r of reps) m.set(r.id, r);
    return m;
  }, [reps]);

  // Leaderboard: booked desc, then connect rate desc.
  const leaderboard = useMemo(
    () =>
      [...repStats].sort(
        (a, b) => b.booked - a.booked || b.connectRate - a.connectRate,
      ),
    [repStats],
  );

  // Lead source breakdown.
  const sources = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of leads) counts.set(l.source, (counts.get(l.source) ?? 0) + 1);
    return [...counts.entries()]
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);
  }, [leads]);

  // Hot leads: hottest first (exclude closed-out lost/won).
  const hotLeads = useMemo(
    () =>
      [...leads]
        .filter((l) => l.stage !== "lost" && l.stage !== "won")
        .sort((a, b) => b.heatScore - a.heatScore)
        .slice(0, 10),
    [leads],
  );

  // Callbacks due (past + upcoming), soonest first.
  const callbacks = useMemo(
    () =>
      [...leads]
        .filter((l) => !!l.callbackAt)
        .sort(
          (a, b) =>
            new Date(a.callbackAt!).getTime() -
            new Date(b.callbackAt!).getTime(),
        )
        .slice(0, 8),
    [leads],
  );

  return (
    <div className="min-h-screen bg-[#18181B] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3 border border-orange-500/20">
              CopperBay CRM
            </span>
            <h1 className="text-3xl sm:text-4xl font-black leading-tight">
              Sales Command Center
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              {lastUpdated
                ? `Live — updated ${lastUpdated.toLocaleTimeString()}`
                : "Loading live performance…"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/crm"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-full px-4 py-2 transition-colors"
            >
              Caller Workspace
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-full px-4 py-2 transition-colors"
            >
              Site
            </Link>
            <button
              onClick={() => load(false)}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-4 py-2 transition-colors"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-8 flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <LoadingState />
        ) : (
          <>
            {/* KPI row */}
            {stats && (
              <section className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-10">
                <Kpi
                  icon={<Phone className="w-5 h-5" />}
                  label="Calls Today"
                  value={String(stats.callsToday)}
                />
                <Kpi
                  icon={<PhoneCall className="w-5 h-5" />}
                  label="Connect Rate"
                  value={fmtPct(stats.connectRate)}
                  sub={`${stats.connectsToday} connects`}
                />
                <Kpi
                  icon={<CalendarCheck className="w-5 h-5" />}
                  label="Demos Booked"
                  value={String(stats.bookedToday)}
                  accent
                />
                <Kpi
                  icon={<DollarSign className="w-5 h-5" />}
                  label="Pipeline Value"
                  value={fmtCompactCurrency(stats.pipelineValue)}
                />
                <Kpi
                  icon={<Clock className="w-5 h-5" />}
                  label="Callbacks Due"
                  value={String(stats.callbacksDue)}
                />
                <Kpi
                  icon={<Users className="w-5 h-5" />}
                  label="Total Leads"
                  value={String(stats.totalLeads)}
                />
              </section>
            )}

            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* Pipeline funnel */}
              {stats && (
                <Card className="p-6 lg:col-span-2">
                  <SectionTitle>Pipeline</SectionTitle>
                  <Funnel stageCounts={stats.stageCounts} />
                </Card>
              )}

              {/* Lead source breakdown */}
              <Card className="p-6">
                <SectionTitle>Lead Sources</SectionTitle>
                <SourceBreakdown sources={sources} total={leads.length} />
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* Rep leaderboard */}
              <Card className="p-6 lg:col-span-2">
                <SectionTitle>Rep Leaderboard</SectionTitle>
                <Leaderboard rows={leaderboard} />
              </Card>

              {/* Callbacks due */}
              <Card className="p-6">
                <SectionTitle>Callbacks</SectionTitle>
                <Callbacks leads={callbacks} repById={repById} />
              </Card>
            </div>

            {/* Hot leads table */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-4 h-4 text-orange-400" />
                <SectionTitle>Hottest Leads</SectionTitle>
              </div>
              <HotLeads leads={hotLeads} repById={repById} />
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

// --- KPI -------------------------------------------------------------------

function Kpi({
  icon,
  label,
  value,
  sub,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <Card className="p-5">
      <div
        className={`inline-flex items-center justify-center w-9 h-9 rounded-full mb-3 ${
          accent
            ? "bg-orange-500/15 text-orange-400"
            : "bg-zinc-800 text-zinc-400"
        }`}
      >
        {icon}
      </div>
      <div className="text-2xl font-black tabular-nums leading-none">
        {value}
      </div>
      <div className="text-zinc-500 text-xs font-medium mt-1.5">{label}</div>
      {sub && <div className="text-zinc-600 text-[11px] mt-0.5">{sub}</div>}
    </Card>
  );
}

// --- Pipeline funnel -------------------------------------------------------

const STAGE_BAR: Record<string, string> = {
  new: "bg-sky-500",
  attempting: "bg-indigo-500",
  contacted: "bg-violet-500",
  callback_scheduled: "bg-amber-500",
  demo_booked: "bg-orange-500",
  won: "bg-emerald-500",
  lost: "bg-zinc-600",
};

function Funnel({
  stageCounts,
}: {
  stageCounts: CrmStats["stageCounts"];
}) {
  const max = Math.max(1, ...PIPELINE_STAGES.map((s) => stageCounts[s]));
  return (
    <div className="space-y-2.5">
      {PIPELINE_STAGES.map((stage) => {
        const count = stageCounts[stage];
        const pct = (count / max) * 100;
        return (
          <div key={stage} className="flex items-center gap-3">
            <div className="w-28 shrink-0 text-xs text-zinc-400 font-medium text-right">
              {STAGE_LABELS[stage]}
            </div>
            <div className="flex-1 h-7 bg-zinc-800/60 rounded-md overflow-hidden">
              <div
                className={`h-full ${STAGE_BAR[stage]} rounded-md flex items-center justify-end px-2 transition-all duration-500`}
                style={{ width: `${Math.max(pct, count > 0 ? 6 : 0)}%` }}
              >
                {count > 0 && pct > 18 && (
                  <span className="text-xs font-bold text-white/90 tabular-nums">
                    {count}
                  </span>
                )}
              </div>
            </div>
            <div className="w-7 shrink-0 text-xs font-bold tabular-nums text-zinc-300 text-right">
              {count}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- Lead source breakdown -------------------------------------------------

const SOURCE_COLORS = [
  "bg-orange-500",
  "bg-sky-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
];

function SourceBreakdown({
  sources,
  total,
}: {
  sources: { source: string; count: number }[];
  total: number;
}) {
  if (sources.length === 0) {
    return <p className="text-zinc-600 text-sm">No leads yet.</p>;
  }
  return (
    <div className="space-y-3">
      {/* Stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden bg-zinc-800">
        {sources.map((s, i) => (
          <div
            key={s.source}
            className={SOURCE_COLORS[i % SOURCE_COLORS.length]}
            style={{ width: `${(s.count / Math.max(1, total)) * 100}%` }}
            title={`${s.source}: ${s.count}`}
          />
        ))}
      </div>
      {/* Legend */}
      <ul className="space-y-2">
        {sources.map((s, i) => (
          <li
            key={s.source}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <span className="flex items-center gap-2 min-w-0">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  SOURCE_COLORS[i % SOURCE_COLORS.length]
                }`}
              />
              <span className="text-zinc-300 truncate">{s.source}</span>
            </span>
            <span className="text-zinc-500 tabular-nums shrink-0">
              {s.count}
              <span className="text-zinc-600">
                {" "}
                ({Math.round((s.count / Math.max(1, total)) * 100)}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- Rep leaderboard -------------------------------------------------------

function Leaderboard({ rows }: { rows: RepStat[] }) {
  if (rows.length === 0) {
    return <p className="text-zinc-600 text-sm">No rep activity yet.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-500 text-xs uppercase tracking-wider text-left">
            <th className="font-medium pb-3 pr-3">Rep</th>
            <th className="font-medium pb-3 px-3 text-right">Calls</th>
            <th className="font-medium pb-3 px-3 text-right">Connects</th>
            <th className="font-medium pb-3 px-3 text-right">Rate</th>
            <th className="font-medium pb-3 pl-3 text-right">Demos</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isTop = i === 0 && (row.booked > 0 || row.calls > 0);
            return (
              <tr
                key={row.rep.id}
                className={`border-t border-zinc-800 ${
                  isTop ? "bg-orange-500/[0.06]" : ""
                }`}
              >
                <td className="py-3 pr-3">
                  <span className="flex items-center gap-2.5">
                    <Avatar
                      name={row.rep.name}
                      color={row.rep.avatarColor}
                    />
                    <span className="font-semibold text-white truncate">
                      {row.rep.name}
                    </span>
                    {isTop && (
                      <Trophy className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    )}
                  </span>
                </td>
                <td className="py-3 px-3 text-right tabular-nums text-zinc-300">
                  {row.calls}
                </td>
                <td className="py-3 px-3 text-right tabular-nums text-zinc-300">
                  {row.connects}
                </td>
                <td className="py-3 px-3 text-right tabular-nums text-zinc-300">
                  {fmtPct(row.connectRate)}
                </td>
                <td className="py-3 pl-3 text-right tabular-nums font-bold text-orange-400">
                  {row.booked}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// --- Callbacks -------------------------------------------------------------

function relativeTime(iso: string): { text: string; overdue: boolean } {
  const target = new Date(iso).getTime();
  const diff = target - Date.now();
  const overdue = diff <= 0;
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60_000);
  const hrs = Math.round(abs / 3_600_000);
  const days = Math.round(abs / 86_400_000);
  let unit: string;
  if (mins < 60) unit = `${mins}m`;
  else if (hrs < 24) unit = `${hrs}h`;
  else unit = `${days}d`;
  return { text: overdue ? `${unit} overdue` : `in ${unit}`, overdue };
}

function Callbacks({
  leads,
  repById,
}: {
  leads: Lead[];
  repById: Map<string, Rep>;
}) {
  if (leads.length === 0) {
    return <p className="text-zinc-600 text-sm">No callbacks scheduled.</p>;
  }
  return (
    <ul className="space-y-2">
      {leads.map((l) => {
        const when = relativeTime(l.callbackAt!);
        const owner = l.ownerRepId ? repById.get(l.ownerRepId) : undefined;
        return (
          <li key={l.id}>
            <Link
              href={`/crm?lead=${l.id}`}
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 bg-zinc-800/40 hover:bg-zinc-800 transition-colors"
            >
              <span className="min-w-0">
                <span className="block font-semibold text-white text-sm truncate">
                  {l.business}
                </span>
                <span className="block text-zinc-500 text-xs truncate">
                  {l.city}, {l.state}
                  {owner ? ` · ${owner.name}` : ""}
                </span>
              </span>
              <span
                className={`shrink-0 text-xs font-semibold tabular-nums px-2 py-1 rounded-full ${
                  when.overdue
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-zinc-700/30 text-zinc-300 border border-zinc-700"
                }`}
              >
                {when.text}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

// --- Hot leads table -------------------------------------------------------

function HotLeads({
  leads,
  repById,
}: {
  leads: Lead[];
  repById: Map<string, Rep>;
}) {
  if (leads.length === 0) {
    return <p className="text-zinc-600 text-sm">No active leads.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-500 text-xs uppercase tracking-wider text-left">
            <th className="font-medium pb-3 pr-3">Business</th>
            <th className="font-medium pb-3 px-3 hidden md:table-cell">
              Location
            </th>
            <th className="font-medium pb-3 px-3 hidden lg:table-cell">
              Industry
            </th>
            <th className="font-medium pb-3 px-3">Heat</th>
            <th className="font-medium pb-3 px-3 hidden md:table-cell">
              Top Problem
            </th>
            <th className="font-medium pb-3 px-3">Stage</th>
            <th className="font-medium pb-3 px-3 text-right">Est. Value</th>
            <th className="font-medium pb-3 pl-3">Owner</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => {
            const owner = l.ownerRepId ? repById.get(l.ownerRepId) : undefined;
            return (
              <tr
                key={l.id}
                className="border-t border-zinc-800 hover:bg-zinc-800/40 transition-colors group"
              >
                <td className="py-3 pr-3">
                  <Link
                    href={`/crm?lead=${l.id}`}
                    className="font-semibold text-white group-hover:text-orange-400 transition-colors inline-flex items-center gap-1"
                  >
                    {l.business}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </td>
                <td className="py-3 px-3 text-zinc-400 hidden md:table-cell whitespace-nowrap">
                  {l.city}, {l.state}
                </td>
                <td className="py-3 px-3 text-zinc-400 hidden lg:table-cell whitespace-nowrap">
                  {l.industry}
                </td>
                <td className="py-3 px-3">
                  <HeatBadge score={l.heatScore} />
                </td>
                <td className="py-3 px-3 text-zinc-400 hidden md:table-cell whitespace-nowrap">
                  {topProblem(l.signals)}
                </td>
                <td className="py-3 px-3">
                  <StageBadge stage={l.stage} />
                </td>
                <td className="py-3 px-3 text-right tabular-nums text-zinc-300 whitespace-nowrap">
                  {fmtCurrency(l.estValue)}
                </td>
                <td className="py-3 pl-3">
                  {owner ? (
                    <span className="flex items-center gap-2">
                      <Avatar
                        name={owner.name}
                        color={owner.avatarColor}
                        size={22}
                      />
                      <span className="text-zinc-400 hidden xl:inline">
                        {owner.name}
                      </span>
                    </span>
                  ) : (
                    <span className="text-zinc-600 text-xs">Unassigned</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// --- Loading state ---------------------------------------------------------

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl h-28 animate-pulse"
          />
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl h-64 lg:col-span-2 animate-pulse" />
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl h-64 animate-pulse" />
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl h-72 animate-pulse" />
    </div>
  );
}
