"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Tag, Plus, Check, Loader2, X } from "lucide-react";
import { TagChip, colorMeta } from "./TagManager";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TagDef {
  id: string;
  label: string;
  color: string;
}

interface TagPickerProps {
  leadId: string;
  /** Called whenever the tag assignment changes. */
  onChange?: (tags: TagDef[]) => void;
}

const H = { fontFamily: "var(--font-heading)" };

// ─── TagPicker ────────────────────────────────────────────────────────────────

export default function TagPicker({ leadId, onChange }: TagPickerProps) {
  const [allTags, setAllTags] = useState<TagDef[]>([]);
  const [leadTagIds, setLeadTagIds] = useState<Set<string>>(new Set());
  const [loadingAll, setLoadingAll] = useState(true);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // ── Load all tag defs + this lead's current tags ──────────────────────────
  const load = useCallback(async () => {
    setLoadingAll(true);
    try {
      const res = await fetch("/api/crm/tags");
      if (!res.ok) return;
      const data = (await res.json()) as {
        tags: TagDef[];
        leadTagMap: Record<string, string[]>;
      };
      setAllTags(data.tags ?? []);
      const ids = data.leadTagMap?.[leadId] ?? [];
      setLeadTagIds(new Set(ids));
    } catch {
      // silently ignore — picker degrades gracefully
    } finally {
      setLoadingAll(false);
    }
  }, [leadId]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { load(); }, [load]);

  // ── Close popover on outside click ───────────────────────────────────────
  useEffect(() => {
    if (!popoverOpen) return;
    function onDown(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setPopoverOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [popoverOpen]);

  // ── Toggle a tag on/off ───────────────────────────────────────────────────
  async function toggle(tagId: string) {
    const op = leadTagIds.has(tagId) ? "remove" : "add";
    setToggling(tagId);
    // Optimistic update
    setLeadTagIds((prev) => {
      const next = new Set(prev);
      if (op === "add") { next.add(tagId); } else { next.delete(tagId); }
      return next;
    });
    try {
      const res = await fetch("/api/crm/tags", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, tagId, op }),
      });
      if (!res.ok) {
        // Revert on failure
        setLeadTagIds((prev) => {
          const next = new Set(prev);
          if (op === "add") { next.delete(tagId); } else { next.add(tagId); }
          return next;
        });
      } else {
        // Notify parent
        const next = new Set(leadTagIds);
        if (op === "add") { next.add(tagId); } else { next.delete(tagId); }
        const activeTags = allTags.filter((t) => next.has(t.id));
        onChange?.(activeTags);
      }
    } catch {
      // Revert
      setLeadTagIds((prev) => {
        const next = new Set(prev);
        if (op === "add") { next.delete(tagId); } else { next.add(tagId); }
        return next;
      });
    } finally {
      setToggling(null);
    }
  }

  // ── Derived data ──────────────────────────────────────────────────────────
  const activeTags = allTags.filter((t) => leadTagIds.has(t.id));
  const filtered = allTags.filter((t) =>
    t.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative inline-flex items-center flex-wrap gap-1.5" style={H}>
      {/* Active tag chips */}
      {activeTags.map((tag) => (
        <TagChip
          key={tag.id}
          tag={tag}
          onRemove={() => toggle(tag.id)}
        />
      ))}

      {/* Add-tag button */}
      <button
        ref={btnRef}
        onClick={() => { setPopoverOpen((o) => !o); setSearch(""); }}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold
          border-[var(--crm-border)] text-[var(--crm-text-3)] bg-[var(--crm-surface-2)]
          hover:text-[var(--crm-accent-text)] hover:border-[var(--crm-accent-border)] hover:bg-[var(--crm-accent-weak)]
          transition-colors"
        aria-label="Manage tags"
        aria-expanded={popoverOpen}
      >
        {loadingAll
          ? <Loader2 size={9} className="animate-spin" />
          : <Tag size={9} />}
        {activeTags.length === 0 ? "Add tag" : "Edit"}
      </button>

      {/* Popover */}
      {popoverOpen && (
        <div
          ref={popoverRef}
          className="absolute left-0 top-full mt-1.5 z-50 w-56 bg-[var(--crm-surface-2)] border border-[var(--crm-border)] rounded-2xl shadow-2xl overflow-hidden"
          style={H}
        >
          {/* Search */}
          <div className="px-3 pt-3 pb-2 border-b border-[var(--crm-border)]">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tags…"
              className="w-full px-2.5 py-1.5 rounded-xl text-xs bg-[var(--crm-surface)] border border-[var(--crm-border)] text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)]"
              style={H}
            />
          </div>

          {/* Tag list */}
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-3 text-xs text-[var(--crm-text-3)] text-center">
                {allTags.length === 0 ? "No tags — create one in Tag Manager" : "No match"}
              </li>
            )}
            {filtered.map((tag) => {
              const active = leadTagIds.has(tag.id);
              const pending = toggling === tag.id;
              const meta = colorMeta(tag.color);
              return (
                <li key={tag.id}>
                  <button
                    onClick={() => toggle(tag.id)}
                    disabled={pending}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left hover:bg-[var(--crm-surface-3)] transition-colors disabled:opacity-50"
                  >
                    {/* Color dot */}
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${meta.text.replace("text-", "bg-").replace("/500", "-500")}`}
                    />
                    <span className={`flex-1 text-xs font-medium ${active ? "text-[var(--crm-text)]" : "text-[var(--crm-text-2)]"}`}>
                      {tag.label}
                    </span>
                    {pending
                      ? <Loader2 size={11} className="animate-spin text-[var(--crm-text-3)] shrink-0" />
                      : active
                        ? <Check size={11} className="text-emerald-500 shrink-0" />
                        : <Plus size={11} className="text-[var(--crm-text-3)] shrink-0 opacity-0 group-hover:opacity-100" />}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Footer dismiss */}
          <div className="px-3 py-2 border-t border-[var(--crm-border)] flex justify-end">
            <button
              onClick={() => { setPopoverOpen(false); setSearch(""); }}
              className="inline-flex items-center gap-1 text-[10px] text-[var(--crm-text-3)] hover:text-[var(--crm-text)] transition-colors"
              style={H}
            >
              <X size={9} />
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
