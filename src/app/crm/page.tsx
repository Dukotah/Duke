"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SkipForward, LayoutDashboard, RefreshCw, Activity as ActivityIcon } from "lucide-react";
import type { Lead, Rep, CrmStats, Disposition } from "@/lib/crm/types";
import LiveBar from "./_components/LiveBar";
import LeadQueue from "./_components/LeadQueue";
import ProspectCard from "./_components/ProspectCard";
import ObjectionPanel from "./_components/ObjectionPanel";
import Timeline from "./_components/Timeline";

function Workspace() {
  const searchParams = useSearchParams();

  const [reps, setReps] = useState<Rep[]>([]);
  const [repId, setRepId] = useState<string>("");
  const [queue, setQueue] = useState<Lead[]>([]);
  const [active, setActive] = useState<Lead | null>(null);
  const [stats, setStats] = useState<CrmStats | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const repName = reps.find((r) => r.id === repId)?.name.split(" ")[0] ?? "there";

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/stats");
      const json = await res.json();
      if (res.ok) setStats(json.stats);
    } catch {
      /* non-fatal */
    }
  }, []);

  const loadQueue = useCallback(async (): Promise<Lead[]> => {
    const res = await fetch("/api/crm/leads?view=queue");
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to load queue");
    setQueue(json.leads);
    return json.leads as Lead[];
  }, []);

  const selectLead = useCallback(
    async (id: string, fromQueue?: Lead[]) => {
      const list = fromQueue ?? queue;
      const inQueue = list.find((l) => l.id === id);
      if (inQueue) {
        setActive(inQueue);
        return;
      }
      // Deep-linked lead that isn't in the workable queue (e.g. already booked).
      try {
        const res = await fetch(`/api/crm/leads/${id}`);
        const json = await res.json();
        if (res.ok) setActive(json.lead);
      } catch {
        /* ignore */
      }
    },
    [queue],
  );

  // Initial load.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [repsRes, leads] = await Promise.all([fetch("/api/crm/reps"), loadQueue()]);
        const repsJson = await repsRes.json();
        if (cancelled) return;
        const repList: Rep[] = repsJson.reps ?? [];
        setReps(repList);
        const saved = typeof window !== "undefined" ? localStorage.getItem("crm_rep") : null;
        setRepId(saved && repList.some((r) => r.id === saved) ? saved : repList[0]?.id ?? "");

        const deepLink = searchParams.get("lead");
        await selectLead(deepLink ?? leads[0]?.id ?? "", leads);
        await loadStats();
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function chooseRep(id: string) {
    setRepId(id);
    if (typeof window !== "undefined") localStorage.setItem("crm_rep", id);
  }

  const advance = useCallback(
    (leads: Lead[], currentId?: string) => {
      const next = leads.find((l) => l.id !== currentId) ?? leads[0] ?? null;
      if (next) setActive(next);
      else setActive(null);
    },
    [],
  );

  async function handleDisposition(
    d: Disposition,
    extra: { note?: string; durationSec?: number; callbackAt?: string },
  ) {
    if (!active) return;
    const currentId = active.id;
    try {
      const res = await fetch(`/api/crm/leads/${currentId}/disposition`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disposition: d, repId, ...extra }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "Failed to log call");
        return;
      }
      setStreak((s) => (d === "not_interested" || d === "do_not_call" ? 0 : s + 1));
      const leads = await loadQueue();
      await loadStats();
      advance(leads, currentId);
    } catch {
      setError("Network error logging the call.");
    }
  }

  async function handleSaveNote(note: string) {
    if (!active) return;
    try {
      const res = await fetch(`/api/crm/leads/${active.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note, repId }),
      });
      const json = await res.json();
      if (res.ok) {
        setActive(json.lead);
        setQueue((q) => q.map((l) => (l.id === json.lead.id ? json.lead : l)));
      }
    } catch {
      /* ignore */
    }
  }

  function nextLead() {
    advance(queue, active?.id);
  }

  async function refresh() {
    try {
      const leads = await loadQueue();
      await loadStats();
      if (active) await selectLead(active.id, leads);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex h-screen flex-col bg-[#18181B] text-white">
      {/* Header */}
      <header className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-zinc-800 px-5 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-orange-500 text-sm text-white">C</span>
          <span className="hidden sm:inline">Copper Bay CRM</span>
        </Link>

        <div className="flex items-center gap-2">
          <label htmlFor="rep" className="text-xs uppercase tracking-wider text-zinc-500">
            Rep
          </label>
          <select
            id="rep"
            value={repId}
            onChange={(e) => chooseRep(e.target.value)}
            className="rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-sm text-white focus:border-orange-500 focus:outline-none"
          >
            {reps.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0 flex-1">
          <LiveBar stats={stats} dialedStreak={streak} />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={nextLead}
            className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-400"
          >
            <SkipForward size={15} /> Next Lead
          </button>
          <button
            onClick={refresh}
            title="Refresh"
            className="grid h-9 w-9 place-items-center rounded-full border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <RefreshCw size={15} />
          </button>
          <Link
            href="/admin"
            title="Admin dashboard"
            className="grid h-9 w-9 place-items-center rounded-full border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <LayoutDashboard size={15} />
          </Link>
        </div>
      </header>

      {error && (
        <div className="border-b border-red-500/20 bg-red-500/10 px-5 py-2 text-sm text-red-400">
          {error}{" "}
          <button onClick={() => setError(null)} className="ml-2 underline">
            dismiss
          </button>
        </div>
      )}

      {/* Body */}
      {loading ? (
        <div className="grid flex-1 place-items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
            <p className="text-sm text-zinc-500">Loading your call queue…</p>
          </div>
        </div>
      ) : (
        <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden p-4 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
          {/* Queue */}
          <div className="hidden min-h-0 lg:block">
            <LeadQueue leads={queue} activeId={active?.id ?? null} onSelect={(id) => selectLead(id)} />
          </div>

          {/* Prospect */}
          <div className="min-h-0">
            {active ? (
              <ProspectCard
                key={active.id}
                lead={active}
                repName={repName}
                onDisposition={handleDisposition}
                onSaveNote={handleSaveNote}
              />
            ) : (
              <div className="grid h-full place-items-center rounded-2xl border border-zinc-800 bg-zinc-900">
                <div className="text-center">
                  <p className="text-lg font-semibold text-white">🎉 Queue cleared!</p>
                  <p className="mt-1 text-sm text-zinc-500">Nice work. New leads will appear here as they come in.</p>
                </div>
              </div>
            )}
          </div>

          {/* Objections + activity */}
          <div className="hidden min-h-0 flex-col gap-4 lg:flex">
            <div className="min-h-0 flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
              <ObjectionPanel />
            </div>
            <div className="max-h-72 shrink-0 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
              <div className="mb-3 flex items-center gap-2">
                <ActivityIcon size={15} className="text-orange-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Activity</h2>
              </div>
              {active ? <Timeline activities={active.activities} reps={reps} /> : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CrmPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-[#18181B]" />}>
      <Workspace />
    </Suspense>
  );
}
