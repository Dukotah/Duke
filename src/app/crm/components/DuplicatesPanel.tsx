"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Copy,
  Mail,
  Phone,
  MapPin,
  Globe,
  GitMerge,
  Crown,
  AlertTriangle,
  RefreshCw,
  Check,
  Sparkles,
} from "lucide-react";

// ─── Duplicate detection + guided merge (Admin) ───────────────────────────────
// Lists groups of leads that share a normalized email / phone / (name+city),
// shows each group's members side-by-side, and lets the admin pick a SURVIVOR
// and merge a custom-lead duplicate into it. Backed by:
//   GET  /api/crm/duplicates  → { groups: DuplicateGroup[] }
//   POST /api/crm/merge       → { survivorId, loserId }
// Only a custom lead can be the LOSER (a CSV lead has no deletable record), so
// the merge button is disabled when the chosen loser is a CSV lead.

const H = { fontFamily: "var(--font-heading)" };

interface DuplicateLead {
  id: string;
  rawId: string;
  isCustom: boolean;
  ownerId?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  county: string;
  website: string;
  niche: string;
  createdAt?: string;
}

interface DuplicateGroup {
  reason: "email" | "phone" | "name+city";
  key: string;
  leads: DuplicateLead[];
}

const REASON_LABEL: Record<DuplicateGroup["reason"], string> = {
  email: "Same email",
  phone: "Same phone",
  "name+city": "Similar name + city",
};

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function GroupSkeleton() {
  return (
    <div className="bg-[var(--crm-surface)] rounded-2xl border border-[var(--crm-border)] overflow-hidden animate-pulse" aria-hidden="true">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--crm-border)] bg-[var(--crm-surface-2)]">
        <div className="h-3 w-20 bg-[var(--crm-surface-3)] rounded" />
        <div className="h-3 w-32 bg-[var(--crm-surface-3)] rounded ml-1" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-[var(--crm-border)] p-4 space-y-3">
            <div className="h-4 w-3/4 bg-[var(--crm-surface-3)] rounded" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-[var(--crm-surface-3)] rounded" />
              <div className="h-3 w-2/3 bg-[var(--crm-surface-3)] rounded" />
            </div>
            <div className="h-8 w-32 bg-[var(--crm-surface-3)] rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DuplicatesPanel() {
  const [groups, setGroups] = useState<DuplicateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  // survivor selection per group key (defaults to the first member)
  const [survivors, setSurvivors] = useState<Record<string, string>>({});
  const [merging, setMerging] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [merged, setMerged] = useState<string[]>([]); // feed-ids removed this session

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/crm/duplicates");
      if (res.ok) {
        const d = await res.json();
        const gs: DuplicateGroup[] = d.groups ?? [];
        setGroups(gs);
        // default survivor = first member of each group
        const defaults: Record<string, string> = {};
        gs.forEach((g) => {
          const k = `${g.reason}:${g.key}`;
          defaults[k] = g.leads[0]?.id ?? "";
        });
        setSurvivors(defaults);
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Could not load duplicates.");
      }
    } catch {
      setError("Could not load duplicates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]); // eslint-disable-line react-hooks/set-state-in-effect

  async function merge(group: DuplicateGroup, loser: DuplicateLead) {
    const gk = `${group.reason}:${group.key}`;
    const survivorId = survivors[gk];
    if (!survivorId || survivorId === loser.id) return;
    setMerging(loser.id);
    setError("");
    try {
      const res = await fetch("/api/crm/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ survivorId, loserId: loser.id }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok) {
        setMerged((prev) => [...prev, loser.id]);
        // remove the loser from the group locally; if <2 remain, the group drops
        setGroups((prev) =>
          prev
            .map((g) =>
              `${g.reason}:${g.key}` === gk
                ? { ...g, leads: g.leads.filter((l) => l.id !== loser.id) }
                : g
            )
            .filter((g) => g.leads.length >= 2)
        );
      } else {
        setError(d.error ?? "Merge failed.");
      }
    } catch {
      setError("Merge failed.");
    } finally {
      setMerging(null);
    }
  }

  const totalDupes = groups.reduce((n, g) => n + g.leads.length, 0);

  return (
    <div className="space-y-5">
      {/* Summary + refresh */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="bg-[var(--crm-surface)] rounded-xl border border-[var(--crm-border)] px-5 py-4 flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2 text-xs text-[var(--crm-text-3)] shrink-0" style={H}>
            <Copy size={14} className="text-[var(--crm-accent)]" aria-hidden="true" />
            Duplicate groups
          </div>
          <p className="text-2xl font-bold text-[var(--crm-text)] tabular-nums" style={H}>
            {loading ? <span className="inline-block h-7 w-8 bg-[var(--crm-surface-3)] rounded animate-pulse" aria-hidden="true" /> : groups.length}
          </p>
          {!loading && totalDupes > 0 && (
            <span className="text-xs text-[var(--crm-text-3)]" style={H}>
              across {totalDupes} leads
            </span>
          )}
        </div>
        <button
          onClick={() => void load()}
          disabled={loading}
          aria-label="Rescan for duplicates"
          className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-xl text-sm font-semibold text-[var(--crm-text-2)] bg-[var(--crm-surface)] border border-[var(--crm-border)] hover:border-[var(--crm-accent-border)] hover:bg-[var(--crm-surface-3)] disabled:opacity-40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)]"
          style={H}
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} aria-hidden="true" />
          Rescan
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
          style={H}
        >
          <AlertTriangle size={15} className="shrink-0 mt-0.5" aria-hidden="true" />
          {error}
        </div>
      )}

      {loading ? (
        <div aria-busy="true" aria-label="Scanning for duplicates" className="space-y-4">
          <GroupSkeleton />
          <GroupSkeleton />
        </div>
      ) : groups.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 py-16 text-center bg-[var(--crm-surface)] rounded-2xl border border-[var(--crm-border)]"
          style={H}
        >
          <div className="w-12 h-12 rounded-2xl bg-[var(--crm-surface-2)] border border-[var(--crm-border)] flex items-center justify-center">
            {merged.length > 0 ? (
              <Sparkles size={20} className="text-emerald-500" aria-hidden="true" />
            ) : (
              <Check size={20} className="text-emerald-500" aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--crm-text-2)]">
              {merged.length > 0 ? "All clear — no remaining duplicates" : "No duplicate leads detected"}
            </p>
            <p className="text-xs text-[var(--crm-text-3)] mt-1">
              {merged.length > 0
                ? `You merged ${merged.length} lead${merged.length !== 1 ? "s" : ""} this session.`
                : "Your lead database looks clean. Rescan after importing new leads."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => {
            const gk = `${group.reason}:${group.key}`;
            const survivorId = survivors[gk];
            return (
              <div key={gk} className="bg-[var(--crm-surface)] rounded-2xl border border-[var(--crm-border)] overflow-hidden">
                {/* Group header */}
                <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--crm-border)] bg-[var(--crm-surface-2)]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--crm-accent-text)]" style={H}>
                    {REASON_LABEL[group.reason]}
                  </span>
                  <span className="text-xs text-[var(--crm-text-3)] truncate min-w-0" style={H}>
                    · {group.key}
                  </span>
                  <span className="ml-auto shrink-0 text-xs text-[var(--crm-text-3)]" style={H}>
                    {group.leads.length} leads
                  </span>
                </div>

                {/* Members side-by-side */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 p-4">
                  {group.leads.map((lead) => {
                    const isSurvivor = lead.id === survivorId;
                    const canBeLoser = lead.isCustom; // only custom leads are deletable
                    return (
                      <div
                        key={lead.id}
                        className={`rounded-xl border p-4 space-y-3 transition-all duration-150 ${
                          isSurvivor
                            ? "border-[var(--crm-accent-border)] bg-[var(--crm-accent-weak)] shadow-sm"
                            : "border-[var(--crm-border)] bg-[var(--crm-surface-2)] hover:border-[var(--crm-accent-border)]/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-bold text-[var(--crm-text)] truncate flex items-center gap-1.5" style={H}>
                              {isSurvivor && (
                                <Crown size={13} className="text-[var(--crm-accent)] shrink-0" aria-hidden="true" />
                              )}
                              {lead.name || "(no name)"}
                            </p>
                            <p className="text-[11px] text-[var(--crm-text-3)] mt-0.5 flex items-center gap-1.5 flex-wrap" style={H}>
                              <span
                                className={`px-1.5 py-0.5 rounded-full border text-[10px] font-semibold ${
                                  lead.isCustom
                                    ? "text-blue-500 bg-blue-500/10 border-blue-500/20"
                                    : "text-[var(--crm-text-3)] bg-[var(--crm-surface-3)] border-[var(--crm-border)]"
                                }`}
                              >
                                {lead.isCustom ? "Custom" : "CSV"}
                              </span>
                              {lead.niche && <span className="truncate">{lead.niche}</span>}
                            </p>
                          </div>
                          {isSurvivor && (
                            <span
                              className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-[var(--crm-accent-text)]"
                              style={H}
                            >
                              Survivor
                            </span>
                          )}
                        </div>

                        {/* Fields */}
                        <div className="space-y-1.5">
                          {lead.email && (
                            <p className="text-xs text-[var(--crm-text-2)] flex items-center gap-2 truncate" style={H}>
                              <Mail size={11} className="text-[var(--crm-accent)] shrink-0" aria-hidden="true" />
                              {lead.email}
                            </p>
                          )}
                          {lead.phone && (
                            <p className="text-xs text-[var(--crm-text-2)] flex items-center gap-2 truncate" style={H}>
                              <Phone size={11} className="text-[var(--crm-accent)] shrink-0" aria-hidden="true" />
                              {lead.phone}
                            </p>
                          )}
                          {(lead.city || lead.county) && (
                            <p className="text-xs text-[var(--crm-text-2)] flex items-center gap-2 truncate" style={H}>
                              <MapPin size={11} className="text-[var(--crm-accent)] shrink-0" aria-hidden="true" />
                              {[lead.city, lead.county].filter(Boolean).join(", ")}
                            </p>
                          )}
                          {lead.website && (
                            <p className="text-xs text-[var(--crm-text-2)] flex items-center gap-2 truncate" style={H}>
                              <Globe size={11} className="text-[var(--crm-accent)] shrink-0" aria-hidden="true" />
                              {lead.website}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                          {isSurvivor ? (
                            <span className="text-[11px] text-[var(--crm-text-3)] flex items-center gap-1" style={H}>
                              <Check size={11} className="text-[var(--crm-accent)]" aria-hidden="true" />
                              Kept as survivor
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => setSurvivors((p) => ({ ...p, [gk]: lead.id }))}
                                className="text-[11px] min-h-[32px] font-semibold text-[var(--crm-text-3)] hover:text-[var(--crm-accent-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)] rounded px-1"
                                style={H}
                              >
                                Make survivor
                              </button>
                              <button
                                onClick={() => void merge(group, lead)}
                                disabled={!canBeLoser || merging === lead.id || !survivorId}
                                title={
                                  canBeLoser
                                    ? "Merge this lead into the survivor"
                                    : "A CSV lead can't be merged away — make it the survivor instead"
                                }
                                aria-label={`Merge ${lead.name || "lead"} into survivor`}
                                className="ml-auto inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)] focus-visible:ring-offset-1"
                                style={{ backgroundColor: "var(--crm-accent)", ...H }}
                              >
                                <GitMerge size={11} aria-hidden="true" />
                                {merging === lead.id ? "Merging…" : "Merge in"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-[var(--crm-text-3)] px-1 flex items-start gap-1.5" style={H}>
        <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
        Merging is permanent. The loser&apos;s activity, claims, submissions and notes are re-pointed
        onto the survivor, then the loser is removed. Only custom leads can be merged away — pick a
        CSV lead as the survivor when one is present.
      </p>
    </div>
  );
}
