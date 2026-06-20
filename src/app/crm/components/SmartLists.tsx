"use client";

import { useState, useEffect, useCallback } from "react";
import { Bookmark, BookmarkCheck, Trash2, Users, Lock, Plus, Loader2, X } from "lucide-react";

const H = { fontFamily: "var(--font-heading)" };

export interface SmartListFilters {
  q?: string;
  county?: string;
  niche?: string;
  tier?: string;
  hasEmail?: string;
  grade?: string;
  emailStatus?: string;
  sortBy?: string;
}

interface SmartList {
  id: string;
  userId: string;
  ownerName?: string;
  name: string;
  scope: "private" | "team";
  filters: Record<string, string>;
  createdAt: string;
}

interface SmartListsProps {
  currentFilters: SmartListFilters;
  onApply: (filters: SmartListFilters) => void;
  userName: string;
  /** Compact rail mode — renders a shorter list without the save form */
  railMode?: boolean;
}

function activeFilterCount(f: SmartListFilters): number {
  return Object.values(f).filter((v) => v && v !== "outreach_score").length;
}

/** Skeleton row used while loading */
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
      <div className="w-3.5 h-3.5 rounded bg-[var(--crm-surface-3)] shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 rounded bg-[var(--crm-surface-3)] w-2/3" />
        <div className="h-2.5 rounded bg-[var(--crm-surface-3)] w-1/3" />
      </div>
    </div>
  );
}

export default function SmartLists({ currentFilters, onApply, userName, railMode = false }: SmartListsProps) {
  const [lists, setLists] = useState<SmartList[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saveScope, setSaveScope] = useState<"private" | "team">("private");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/smart-lists");
      if (!res.ok) throw new Error();
      setLists(await res.json());
    } catch {
      /* silent — not critical */
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { void load(); }, [load]);

  async function handleSave() {
    if (!saveName.trim()) { setError("Name is required"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/crm/smart-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: saveName.trim(),
          scope: saveScope,
          filters: currentFilters as Record<string, string>,
          ownerName: userName,
        }),
      });
      if (!res.ok) { setError("Could not save"); return; }
      const list: SmartList = await res.json();
      setLists((prev) => [list, ...prev]);
      setSaveName(""); setShowSaveForm(false);
    } catch {
      setError("Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await fetch("/api/crm/smart-lists", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setLists((prev) => prev.filter((l) => l.id !== id));
    } catch {
      /* silent */
    } finally {
      setDeleting(null);
    }
  }

  const filtersActive = activeFilterCount(currentFilters) > 0;

  if (railMode) {
    // Compact version for the nav rail sidebar
    return (
      <div className="w-full">
        {loading ? (
          <div className="space-y-0.5 px-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-1.5 px-2 py-1.5 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-[var(--crm-surface-3)] shrink-0" />
                <div className="h-2.5 rounded bg-[var(--crm-surface-3)] flex-1" />
              </div>
            ))}
          </div>
        ) : lists.length === 0 ? (
          <div className="flex flex-col items-center gap-1.5 py-3 px-2">
            <Bookmark size={14} className="text-[var(--crm-text-3)]" />
            <p className="text-[10px] text-[var(--crm-text-3)] text-center leading-tight" style={H}>
              No saved lists.{" "}
              <span className="text-[var(--crm-accent-text)]">Apply filters to save one.</span>
            </p>
          </div>
        ) : (
          <div className="space-y-0.5 px-1">
            {lists.slice(0, 8).map((list) => (
              <button
                key={list.id}
                onClick={() => onApply(list.filters as SmartListFilters)}
                title={list.name}
                aria-label={`Apply list: ${list.name}`}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-left text-[10px] font-semibold text-[var(--crm-text-3)] hover:text-[var(--crm-text)] hover:bg-[var(--crm-surface-3)] transition-colors truncate focus-visible:outline-2 focus-visible:outline-[var(--crm-accent)] focus-visible:outline-offset-1"
                style={H}
              >
                {list.scope === "team" ? (
                  <Users size={9} className="shrink-0 text-[var(--crm-accent-text)]" aria-hidden="true" />
                ) : (
                  <Lock size={9} className="shrink-0 text-[var(--crm-text-3)]" aria-hidden="true" />
                )}
                <span className="truncate">{list.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Full panel version — rendered inside the All-leads view
  return (
    <div className="crm-surface rounded-2xl overflow-hidden" style={H}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--crm-border)] bg-[var(--crm-surface-2)]">
        <Bookmark size={14} className="text-[var(--crm-accent-text)] shrink-0" aria-hidden="true" />
        <h3 className="text-sm font-bold text-[var(--crm-text)] flex-1 tracking-tight">Saved Lists</h3>
        {filtersActive && !showSaveForm && (
          <button
            onClick={() => setShowSaveForm(true)}
            aria-label="Save current filters as a list"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--crm-accent-text)] bg-[var(--crm-accent-weak)] border border-[var(--crm-accent-border)] px-2.5 py-1 rounded-full hover:brightness-105 transition-all focus-visible:outline-2 focus-visible:outline-[var(--crm-accent)] focus-visible:outline-offset-1 min-h-[32px]"
            style={H}
          >
            <Plus size={11} aria-hidden="true" />Save current filters
          </button>
        )}
        {!filtersActive && !showSaveForm && (
          <span className="text-xs text-[var(--crm-text-3)]" aria-live="polite">Apply filters to save</span>
        )}
      </div>

      {/* Save form */}
      {showSaveForm && (
        <div className="px-4 py-3 border-b border-[var(--crm-border)] bg-[var(--crm-surface-2)] space-y-2 crm-rise">
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") void handleSave(); if (e.key === "Escape") setShowSaveForm(false); }}
              placeholder="List name…"
              maxLength={64}
              aria-label="List name"
              className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder:text-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors"
              style={H}
            />
            <button
              onClick={() => setShowSaveForm(false)}
              aria-label="Cancel"
              className="p-1.5 rounded-lg text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] hover:bg-[var(--crm-surface-3)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--crm-accent)] min-h-[32px] min-w-[32px] flex items-center justify-center"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSaveScope("private")}
              aria-pressed={saveScope === "private"}
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all min-h-[32px] focus-visible:outline-2 focus-visible:outline-[var(--crm-accent)] focus-visible:outline-offset-1 ${saveScope === "private" ? "bg-[var(--crm-accent-weak)] text-[var(--crm-accent-text)] border-[var(--crm-accent-border)]" : "bg-[var(--crm-surface-3)] text-[var(--crm-text-3)] border-[var(--crm-border)] hover:text-[var(--crm-text-2)]"}`}
              style={H}
            >
              <Lock size={10} aria-hidden="true" />Private
            </button>
            <button
              onClick={() => setSaveScope("team")}
              aria-pressed={saveScope === "team"}
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all min-h-[32px] focus-visible:outline-2 focus-visible:outline-[var(--crm-accent)] focus-visible:outline-offset-1 ${saveScope === "team" ? "bg-[var(--crm-accent-weak)] text-[var(--crm-accent-text)] border-[var(--crm-accent-border)]" : "bg-[var(--crm-surface-3)] text-[var(--crm-text-3)] border-[var(--crm-border)] hover:text-[var(--crm-text-2)]"}`}
              style={H}
            >
              <Users size={10} aria-hidden="true" />Team
            </button>
            <button
              onClick={() => void handleSave()}
              disabled={saving || !saveName.trim()}
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[var(--crm-accent)] px-3 py-1.5 rounded-full hover:brightness-110 disabled:opacity-40 transition-all min-h-[32px] focus-visible:outline-2 focus-visible:outline-[var(--crm-accent)] focus-visible:outline-offset-2"
              style={H}
            >
              {saving ? <Loader2 size={11} className="animate-spin" aria-hidden="true" /> : <BookmarkCheck size={11} aria-hidden="true" />}
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
          {error && (
            <p className="text-xs text-red-500 font-medium" role="alert" style={H}>{error}</p>
          )}
        </div>
      )}

      {/* List */}
      <div className="divide-y divide-[var(--crm-border)]">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : lists.length === 0 ? (
          <div className="flex flex-col items-center gap-2.5 py-10 text-center px-6">
            <div className="w-10 h-10 rounded-full bg-[var(--crm-surface-3)] flex items-center justify-center">
              <Bookmark size={18} className="text-[var(--crm-text-3)]" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[var(--crm-text-2)]" style={H}>No saved lists yet</p>
              <p className="text-xs text-[var(--crm-text-3)] max-w-[18rem] leading-relaxed" style={H}>
                Filter leads by county, niche, tier, or grade — then click{" "}
                <span className="text-[var(--crm-accent-text)] font-medium">Save current filters</span>{" "}
                to create a reusable view.
              </p>
            </div>
          </div>
        ) : (
          <ul role="list">
            {lists.map((list) => {
              const fCount = Object.values(list.filters).filter((v) => v && v !== "outreach_score").length;
              return (
                <li key={list.id}>
                  <div
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--crm-surface-3)] transition-colors group"
                  >
                    <button
                      onClick={() => onApply(list.filters as SmartListFilters)}
                      aria-label={`Apply list: ${list.name} (${fCount} filter${fCount !== 1 ? "s" : ""})`}
                      className="flex-1 flex items-start gap-2.5 text-left min-w-0 focus-visible:outline-2 focus-visible:outline-[var(--crm-accent)] focus-visible:outline-offset-1 rounded"
                      style={H}
                    >
                      <span className="mt-0.5 shrink-0" aria-hidden="true">
                        {list.scope === "team" ? (
                          <Users size={13} className="text-[var(--crm-accent-text)]" />
                        ) : (
                          <Lock size={13} className="text-[var(--crm-text-3)]" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--crm-text)] truncate group-hover:text-[var(--crm-accent-text)] transition-colors">
                          {list.name}
                        </p>
                        <p className="text-xs text-[var(--crm-text-3)] mt-0.5">
                          {fCount} filter{fCount !== 1 ? "s" : ""}
                          {list.scope === "team" && list.ownerName && (
                            <span className="ml-1.5">· {list.ownerName}</span>
                          )}
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => void handleDelete(list.id)}
                      disabled={deleting === list.id}
                      aria-label={`Delete list: ${list.name}`}
                      className="shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity text-[var(--crm-text-3)] hover:text-red-500 disabled:opacity-30 p-1 rounded focus-visible:outline-2 focus-visible:outline-red-500 min-h-[32px] min-w-[32px] flex items-center justify-center"
                    >
                      {deleting === list.id ? (
                        <Loader2 size={13} className="animate-spin" aria-hidden="true" />
                      ) : (
                        <Trash2 size={13} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
