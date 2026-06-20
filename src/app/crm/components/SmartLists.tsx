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
          <div className="flex justify-center py-3">
            <Loader2 size={13} className="animate-spin text-[var(--crm-text-3)]" />
          </div>
        ) : lists.length === 0 ? (
          <p className="text-[10px] text-[var(--crm-text-3)] px-2 text-center" style={H}>No saved lists</p>
        ) : (
          <div className="space-y-0.5 px-1">
            {lists.slice(0, 8).map((list) => (
              <button
                key={list.id}
                onClick={() => onApply(list.filters as SmartListFilters)}
                title={list.name}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-left text-[10px] font-semibold text-[var(--crm-text-3)] hover:text-[var(--crm-text)] hover:bg-[var(--crm-surface-3)] transition-colors truncate"
                style={H}
              >
                {list.scope === "team" ? (
                  <Users size={9} className="shrink-0 text-[var(--crm-accent-text)]" />
                ) : (
                  <Lock size={9} className="shrink-0 text-[var(--crm-text-3)]" />
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
    <div className="crm-surface rounded-2xl border border-[var(--crm-border)] overflow-hidden" style={H}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--crm-border)] bg-[var(--crm-surface-2)]">
        <Bookmark size={14} className="text-[var(--crm-accent-text)] shrink-0" />
        <h3 className="text-sm font-bold text-[var(--crm-text)] flex-1 tracking-tight">Saved Lists</h3>
        {filtersActive && !showSaveForm && (
          <button
            onClick={() => setShowSaveForm(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--crm-accent-text)] bg-[var(--crm-accent-weak)] border border-[var(--crm-accent-border)] px-2.5 py-1 rounded-full hover:brightness-105 transition-all"
            style={H}
          >
            <Plus size={11} />Save current filters
          </button>
        )}
        {!filtersActive && !showSaveForm && (
          <span className="text-xs text-[var(--crm-text-3)]">Apply filters to save</span>
        )}
      </div>

      {/* Save form */}
      {showSaveForm && (
        <div className="px-4 py-3 border-b border-[var(--crm-border)] bg-[var(--crm-surface-2)] space-y-2">
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") void handleSave(); if (e.key === "Escape") setShowSaveForm(false); }}
              placeholder="List name…"
              maxLength={64}
              className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors"
              style={H}
            />
            <button onClick={() => setShowSaveForm(false)} className="text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] transition-colors">
              <X size={14} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaveScope("private")}
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${saveScope === "private" ? "bg-[var(--crm-accent-weak)] text-[var(--crm-accent-text)] border-[var(--crm-accent-border)]" : "bg-[var(--crm-surface-3)] text-[var(--crm-text-3)] border-[var(--crm-border)] hover:text-[var(--crm-text-2)]"}`}
              style={H}
            >
              <Lock size={10} />Private
            </button>
            <button
              onClick={() => setSaveScope("team")}
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${saveScope === "team" ? "bg-[var(--crm-accent-weak)] text-[var(--crm-accent-text)] border-[var(--crm-accent-border)]" : "bg-[var(--crm-surface-3)] text-[var(--crm-text-3)] border-[var(--crm-border)] hover:text-[var(--crm-text-2)]"}`}
              style={H}
            >
              <Users size={10} />Team
            </button>
            <button
              onClick={() => void handleSave()}
              disabled={saving || !saveName.trim()}
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[var(--crm-accent)] px-3 py-1.5 rounded-full hover:brightness-110 disabled:opacity-40 transition-all"
              style={H}
            >
              {saving ? <Loader2 size={11} className="animate-spin" /> : <BookmarkCheck size={11} />}
              Save
            </button>
          </div>
          {error && <p className="text-xs text-red-400" style={H}>{error}</p>}
        </div>
      )}

      {/* List */}
      <div className="divide-y divide-[var(--crm-border)]">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 size={16} className="animate-spin text-[var(--crm-text-3)]" />
          </div>
        ) : lists.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center px-4">
            <Bookmark size={20} className="text-[var(--crm-text-3)] opacity-40" />
            <p className="text-sm font-semibold text-[var(--crm-text-2)]">No saved lists yet</p>
            <p className="text-xs text-[var(--crm-text-3)] max-w-[18rem] leading-relaxed">
              Apply filters in the leads view and click &ldquo;Save current filters&rdquo; to create a reusable view.
            </p>
          </div>
        ) : (
          lists.map((list) => {
            const fCount = Object.values(list.filters).filter((v) => v && v !== "outreach_score").length;
            return (
              <div
                key={list.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--crm-surface-3)] transition-colors group"
              >
                <button
                  onClick={() => onApply(list.filters as SmartListFilters)}
                  className="flex-1 flex items-start gap-2.5 text-left min-w-0"
                  style={H}
                >
                  <span className="mt-0.5 shrink-0">
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
                        <span className="ml-1.5 text-[var(--crm-text-3)]">by {list.ownerName}</span>
                      )}
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => void handleDelete(list.id)}
                  disabled={deleting === list.id}
                  title="Delete list"
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--crm-text-3)] hover:text-red-400 disabled:opacity-30"
                >
                  {deleting === list.id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
