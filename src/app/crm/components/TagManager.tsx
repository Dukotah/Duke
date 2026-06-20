"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Tag, Loader2, AlertTriangle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TagDef {
  id: string;
  userId: string;
  label: string;
  color: string;
  createdAt: string;
}

// ─── Palette ──────────────────────────────────────────────────────────────────
// Token-friendly solid mid-tones that work on both light and dark surfaces.
const PALETTE: { name: string; bg: string; text: string; border: string }[] = [
  { name: "sky",     bg: "bg-sky-500/15",     text: "text-sky-500",     border: "border-sky-500/30"     },
  { name: "violet",  bg: "bg-violet-500/15",  text: "text-violet-500",  border: "border-violet-500/30"  },
  { name: "rose",    bg: "bg-rose-500/15",    text: "text-rose-500",    border: "border-rose-500/30"    },
  { name: "amber",   bg: "bg-amber-500/15",   text: "text-amber-500",   border: "border-amber-500/30"   },
  { name: "emerald", bg: "bg-emerald-500/15", text: "text-emerald-500", border: "border-emerald-500/30" },
  { name: "fuchsia", bg: "bg-fuchsia-500/15", text: "text-fuchsia-500", border: "border-fuchsia-500/30" },
  { name: "orange",  bg: "bg-orange-500/15",  text: "text-orange-500",  border: "border-orange-500/30"  },
  { name: "teal",    bg: "bg-teal-500/15",    text: "text-teal-500",    border: "border-teal-500/30"    },
];

export function colorMeta(colorName: string) {
  return (
    PALETTE.find((p) => p.name === colorName) ?? PALETTE[0]
  );
}

const H = { fontFamily: "var(--font-heading)" };

// ─── TagChip ──────────────────────────────────────────────────────────────────
// Exported so TagPicker and lead cards can reuse it.
export function TagChip({
  tag,
  onRemove,
  small,
}: {
  tag: { label: string; color: string };
  onRemove?: () => void;
  small?: boolean;
}) {
  const meta = colorMeta(tag.color);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold leading-none
        ${small ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"}
        ${meta.bg} ${meta.text} ${meta.border}`}
      style={H}
    >
      {tag.label}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className={`ml-0.5 opacity-60 hover:opacity-100 transition-opacity rounded-full ${meta.text}`}
          aria-label={`Remove tag ${tag.label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}

// ─── TagManager ───────────────────────────────────────────────────────────────

interface TagManagerProps {
  /** Called when the tag list changes so callers can re-fetch if needed. */
  onTagsChanged?: () => void;
}

export default function TagManager({ onTagsChanged }: TagManagerProps) {
  const [tags, setTags] = useState<TagDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create-form state
  const [label, setLabel] = useState("");
  const [color, setColor] = useState(PALETTE[0].name);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Per-tag delete pending
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/crm/tags");
      if (!res.ok) throw new Error(`${res.status}`);
      const data = (await res.json()) as { tags: TagDef[] };
      setTags(data.tags ?? []);
    } catch {
      setError("Failed to load tags");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { load(); }, [load]);

  async function handleCreate() {
    if (!label.trim()) return;
    setCreating(true);
    setCreateError("");
    try {
      const res = await fetch("/api/crm/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: label.trim(), color }),
      });
      const data = (await res.json()) as TagDef & { error?: string };
      if (!res.ok) {
        setCreateError(data.error ?? "Failed to create tag");
        return;
      }
      setLabel("");
      setColor(PALETTE[0].name);
      setTags((prev) => [...prev, data]);
      onTagsChanged?.();
    } catch {
      setCreateError("Network error");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch(`/api/crm/tags?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) return;
      setTags((prev) => prev.filter((t) => t.id !== id));
      onTagsChanged?.();
    } catch {
      // silent — the tag stays visible so the user can retry
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div
      className="bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-2xl p-5 space-y-5"
      style={H}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Tag size={16} className="text-[var(--crm-accent)]" />
        <h2 className="text-sm font-bold text-[var(--crm-text)]">Tag Manager</h2>
      </div>

      {/* Create form */}
      <div className="space-y-3">
        <p className="text-xs text-[var(--crm-text-3)] font-medium">Create a new tag</p>

        <div className="flex gap-2">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
            placeholder="Tag name…"
            maxLength={32}
            className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-[var(--crm-surface-2)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)]"
            style={H}
          />
          <button
            onClick={handleCreate}
            disabled={creating || !label.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[var(--crm-accent)] text-white hover:opacity-90 transition-opacity disabled:opacity-40"
            style={H}
          >
            {creating ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
            Add
          </button>
        </div>

        {/* Color palette */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {PALETTE.map((p) => (
            <button
              key={p.name}
              onClick={() => setColor(p.name)}
              title={p.name}
              className={`w-6 h-6 rounded-full border-2 transition-all ${p.text.replace("text-", "bg-").replace("/500", "-500")}
                ${color === p.name ? "border-[var(--crm-text)] scale-110" : "border-transparent opacity-70 hover:opacity-100"}`}
              aria-pressed={color === p.name}
            />
          ))}
          {/* Preview chip */}
          {label.trim() && (
            <span className="ml-2">
              <TagChip tag={{ label: label.trim(), color }} />
            </span>
          )}
        </div>

        {createError && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertTriangle size={11} /> {createError}
          </p>
        )}
      </div>

      {/* Existing tags */}
      <div className="space-y-2">
        <p className="text-xs text-[var(--crm-text-3)] font-medium">
          {tags.length === 0 ? "No tags yet" : `${tags.length} tag${tags.length !== 1 ? "s" : ""}`}
        </p>

        {loading && (
          <div className="flex items-center gap-2 py-2">
            <Loader2 size={14} className="animate-spin text-[var(--crm-text-3)]" />
            <span className="text-xs text-[var(--crm-text-3)]">Loading…</span>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertTriangle size={11} /> {error}
          </p>
        )}

        {!loading && tags.length > 0 && (
          <ul className="space-y-1.5">
            {tags.map((tag) => (
              <li
                key={tag.id}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--crm-surface-2)] border border-[var(--crm-border)]"
              >
                <TagChip tag={tag} />
                <span className="flex-1 min-w-0 text-xs text-[var(--crm-text-3)] truncate">
                  #{tag.id.slice(0, 8)}
                </span>
                <button
                  onClick={() => handleDelete(tag.id)}
                  disabled={deleting === tag.id}
                  title="Delete tag"
                  className="p-1.5 rounded-lg text-[var(--crm-text-3)] hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                >
                  {deleting === tag.id
                    ? <Loader2 size={12} className="animate-spin" />
                    : <Trash2 size={12} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
