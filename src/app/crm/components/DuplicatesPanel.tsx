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
} from "lucide-react";

// ─── Duplicate detection + guided merge (Admin) ───────────────────────────────
// Lists groups of leads that share a normalized email / phone / (name+city),
// shows each group's members side-by-side, and lets the admin pick a SURVIVOR
// and merge a custom-lead duplicate into it. Backed by:
//   GET  /api/crm/duplicates  → { groups: DuplicateGroup[] }
//   POST /api/crm/merge       → { survivorId, loserId }
// Only a custom lead can be the LOSER (a CSV lead has no deletable record), so
// the merge button is disabled when the chosen loser is a CSV lead.

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

export default function DuplicatesPanel() {
  const H = { fontFamily: "var(--font-heading)" };
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

  useEffect(() => { load(); }, [load]); // eslint-disable-line react-hooks/set-state-in-effect

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
        <div className="bg-[var(--crm-surface)] rounded-xl border border-[var(--crm-border)] px-5 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-[var(--crm-text-3)]" style={H}>
            <Copy size={14} className="text-[var(--crm-accent)]" />Duplicate groups
          </div>
          <p className="text-2xl font-bold text-[var(--crm-text)] tabular-nums" style={H}>{groups.length}</p>
          {totalDupes > 0 && (
            <span className="text-xs text-[var(--crm-text-3)]" style={H}>
              across {totalDupes} leads
            </span>
          )}
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-[var(--crm-text-2)] bg-[var(--crm-surface)] border border-[var(--crm-border)] hover:border-[var(--crm-accent-border)] disabled:opacity-40 transition-colors"
          style={H}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />Rescan
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3" style={H}>
          <AlertTriangle size={15} className="shrink-0 mt-0.5" />{error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-[var(--crm-accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-16 text-[var(--crm-text-3)] text-sm bg-[var(--crm-surface)] rounded-xl border border-[var(--crm-border)]" style={H}>
          {merged.length > 0
            ? "All clear — no remaining duplicates. 🎉"
            : "No duplicate leads detected. 🎉"}
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
                  <span className="text-xs text-[var(--crm-text-3)] truncate" style={H}>· {group.key}</span>
                  <span className="ml-auto text-xs text-[var(--crm-text-3)]" style={H}>{group.leads.length} leads</span>
                </div>

                {/* Members side-by-side */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 p-4">
                  {group.leads.map((lead) => {
                    const isSurvivor = lead.id === survivorId;
                    const canBeLoser = lead.isCustom; // only custom leads are deletable
                    return (
                      <div
                        key={lead.id}
                        className={`rounded-xl border p-4 space-y-3 transition-colors ${
                          isSurvivor
                            ? "border-[var(--crm-accent-border)] bg-[var(--crm-accent-weak)]"
                            : "border-[var(--crm-border)] bg-[var(--crm-surface-2)]"
                        }`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-bold text-[var(--crm-text)] truncate flex items-center gap-1.5" style={H}>
                              {isSurvivor && <Crown size={13} className="text-[var(--crm-accent)] shrink-0" />}
                              {lead.name || "(no name)"}
                            </p>
                            <p className="text-[11px] text-[var(--crm-text-3)] mt-0.5 flex items-center gap-1.5 flex-wrap" style={H}>
                              <span className={`px-1.5 py-0.5 rounded-full border text-[10px] font-semibold ${
                                lead.isCustom
                                  ? "text-blue-500 bg-blue-500/10 border-blue-500/20"
                                  : "text-[var(--crm-text-3)] bg-[var(--crm-surface-3)] border-[var(--crm-border)]"
                              }`}>
                                {lead.isCustom ? "Custom" : "CSV"}
                              </span>
                              {lead.niche && <span className="truncate">{lead.niche}</span>}
                            </p>
                          </div>
                          {isSurvivor && (
                            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-[var(--crm-accent-text)]" style={H}>
                              Survivor
                            </span>
                          )}
                        </div>

                        {/* Fields */}
                        <div className="space-y-1.5">
                          {lead.email && (
                            <p className="text-xs text-[var(--crm-text-2)] flex items-center gap-2 truncate" style={H}>
                              <Mail size={11} className="text-[var(--crm-accent)] shrink-0" />{lead.email}
                            </p>
                          )}
                          {lead.phone && (
                            <p className="text-xs text-[var(--crm-text-2)] flex items-center gap-2 truncate" style={H}>
                              <Phone size={11} className="text-[var(--crm-accent)] shrink-0" />{lead.phone}
                            </p>
                          )}
                          {(lead.city || lead.county) && (
                            <p className="text-xs text-[var(--crm-text-2)] flex items-center gap-2 truncate" style={H}>
                              <MapPin size={11} className="text-[var(--crm-accent)] shrink-0" />
                              {[lead.city, lead.county].filter(Boolean).join(", ")}
                            </p>
                          )}
                          {lead.website && (
                            <p className="text-xs text-[var(--crm-text-2)] flex items-center gap-2 truncate" style={H}>
                              <Globe size={11} className="text-[var(--crm-accent)] shrink-0" />{lead.website}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-1">
                          {isSurvivor ? (
                            <span className="text-[11px] text-[var(--crm-text-3)] flex items-center gap-1" style={H}>
                              <Check size={11} className="text-[var(--crm-accent)]" />Kept as survivor
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  setSurvivors((p) => ({ ...p, [gk]: lead.id }))
                                }
                                className="text-[11px] font-semibold text-[var(--crm-text-3)] hover:text-[var(--crm-accent-text)] transition-colors"
                                style={H}>
                                Make survivor
                              </button>
                              <button
                                onClick={() => merge(group, lead)}
                                disabled={!canBeLoser || merging === lead.id || !survivorId}
                                title={canBeLoser ? "Merge this lead into the survivor" : "A CSV lead can't be merged away — make it the survivor instead"}
                                className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:opacity-90"
                                style={{ backgroundColor: "var(--crm-accent)", ...H }}>
                                <GitMerge size={11} />
                                {merging === lead.id ? "Merging…" : "Merge into survivor"}
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
        <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" />
        Merging is permanent. The loser&apos;s activity, claims, submissions and notes are re-pointed
        onto the survivor, then the loser is removed. Only custom leads can be merged away — pick a
        CSV lead as the survivor when one is present.
      </p>
    </div>
  );
}
