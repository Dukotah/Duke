"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Command as CommandIcon, Plus, Sun,
  CalendarClock, Sparkles, MessageSquareReply, Users, LayoutGrid,
  MapPin, Mail, Phone, CornerDownLeft,
} from "lucide-react";

// View keys must match CRMDashboard's `View` union so onGoTo wires straight to
// setView. Kept as a string literal union here to stay self-contained.
export type PaletteView = "due" | "new" | "responded" | "all" | "pipeline";

export interface SearchResult {
  id: string;
  name: string;
  city: string;
  category: string;
  email: string;
  phone: string;
}

interface QuickAction {
  id: string;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  run: () => void;
}

interface Props {
  open: boolean;
  onClose: () => void;
  /** Switch the center view (Follow-ups / Demos / Replies / People / Pipeline). */
  onGoTo: (view: PaletteView) => void;
  /** Open the Add Lead modal. */
  onAddLead: () => void;
  /** Flip light/dark theme. */
  onToggleTheme: () => void;
  /** Open a lead's detail panel. Receives the search result chosen. */
  onSelectLead: (result: SearchResult) => void;
}

const H = { fontFamily: "var(--font-heading)" };

export default function CommandPalette({
  open, onClose, onGoTo, onAddLead, onToggleTheme, onSelectLead,
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Quick actions are static (always shown when the query is empty, and also
  // filtered into the list by label so typing "theme" surfaces the toggle).
  const quickActions: QuickAction[] = [
    { id: "goto-due", label: "Go to Follow-ups", hint: "View", icon: CalendarClock, run: () => { onGoTo("due"); onClose(); } },
    { id: "goto-new", label: "Go to Demos", hint: "View", icon: Sparkles, run: () => { onGoTo("new"); onClose(); } },
    { id: "goto-responded", label: "Go to Replies", hint: "View", icon: MessageSquareReply, run: () => { onGoTo("responded"); onClose(); } },
    { id: "goto-all", label: "Go to People", hint: "View", icon: Users, run: () => { onGoTo("all"); onClose(); } },
    { id: "goto-pipeline", label: "Go to Pipeline", hint: "View", icon: LayoutGrid, run: () => { onGoTo("pipeline"); onClose(); } },
    { id: "add-lead", label: "Add a lead", hint: "Action", icon: Plus, run: () => { onAddLead(); onClose(); } },
    { id: "toggle-theme", label: "Toggle theme", hint: "Action", icon: Sun, run: () => { onToggleTheme(); onClose(); } },
  ];

  const q = query.trim().toLowerCase();
  const filteredActions = q
    ? quickActions.filter((a) => a.label.toLowerCase().includes(q))
    : quickActions;

  // Combined, ordered list the arrow keys navigate. Actions first, then lead
  // results — index space is shared so `active` maps onto the flat array.
  const flatCount = filteredActions.length + results.length;

  // Reset selection + focus the input whenever the palette opens.
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset selection when the palette opens
      setActive(0);
      // Focus after paint so the input exists in the DOM.
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
    // Clear transient state on close so reopening is clean.
    setQuery("");
    setResults([]);
    setLoading(false);
    return undefined;
  }, [open]);

  // Debounced search to /api/crm/search. Empty query → no fetch, no results.
  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clear/loading state synced to the query input
    if (!q) { setResults([]); setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(`/api/crm/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) { if (!cancelled) { setResults([]); setLoading(false); } return; }
        const data = await res.json();
        if (!cancelled) {
          setResults(Array.isArray(data.results) ? data.results : []);
          setLoading(false);
        }
      } catch {
        if (!cancelled) { setResults([]); setLoading(false); }
      }
    }, 180);
    return () => { cancelled = true; clearTimeout(handle); };
  }, [q, open]);

  // Keep `active` in bounds when the list shrinks/grows.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clamp selection when the result list size changes
    setActive((a) => (flatCount === 0 ? 0 : Math.min(a, flatCount - 1)));
  }, [flatCount]);

  const runIndex = useCallback((idx: number) => {
    if (idx < filteredActions.length) {
      filteredActions[idx]?.run();
      return;
    }
    const result = results[idx - filteredActions.length];
    if (result) { onSelectLead(result); onClose(); }
  }, [filteredActions, results, onSelectLead, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (flatCount === 0 ? 0 : (a + 1) % flatCount));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (flatCount === 0 ? 0 : (a - 1 + flatCount) % flatCount));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flatCount > 0) runIndex(active);
    }
  };

  // Scroll the active row into view as the user arrows through.
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  if (!open) return null;

  const rowBase =
    "w-full flex items-center gap-3 px-4 py-2.5 text-left rounded-xl transition-colors cursor-pointer";

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center p-4 pt-[12vh] sm:pt-[16vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="crm-panel relative w-full sm:max-w-xl rounded-2xl border border-[var(--crm-border-strong)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--crm-border)]">
          <Search size={18} className="text-[var(--crm-text-3)] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads or jump to…"
            className="flex-1 bg-transparent text-sm text-[var(--crm-text)] placeholder:text-[var(--crm-text-3)] focus:outline-none"
            style={H}
            aria-label="Search"
          />
          <span className="hidden sm:flex items-center gap-1 text-[10px] font-semibold text-[var(--crm-text-3)] px-2 py-1 rounded-md bg-[var(--crm-surface-3)]" style={H}>
            <CommandIcon size={11} />K
          </span>
        </div>

        {/* Results + actions */}
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {/* Quick actions */}
          {filteredActions.length > 0 && (
            <div className="mb-1">
              <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--crm-text-3)]" style={H}>Actions</p>
              {filteredActions.map((a, i) => {
                const Icon = a.icon;
                const isActive = active === i;
                return (
                  <div
                    key={a.id}
                    data-idx={i}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => runIndex(i)}
                    className={`${rowBase} ${isActive ? "bg-[var(--crm-accent-weak)]" : "hover:bg-[var(--crm-surface-3)]"}`}
                  >
                    <Icon size={16} className={isActive ? "text-[var(--crm-accent-text)]" : "text-[var(--crm-text-3)]"} />
                    <span className="flex-1 text-sm text-[var(--crm-text)]" style={H}>{a.label}</span>
                    {a.hint && <span className="text-[10px] font-medium text-[var(--crm-text-3)]" style={H}>{a.hint}</span>}
                    {isActive && <CornerDownLeft size={13} className="text-[var(--crm-accent-text)]" />}
                  </div>
                );
              })}
            </div>
          )}

          {/* Lead results */}
          {q && (
            <div>
              <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--crm-text-3)]" style={H}>
                Leads {loading ? "· searching…" : results.length ? `· ${results.length}` : ""}
              </p>
              {results.map((r, i) => {
                const idx = filteredActions.length + i;
                const isActive = active === idx;
                const secondary = [r.category, r.city].filter(Boolean).join(" · ");
                return (
                  <div
                    key={r.id}
                    data-idx={idx}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => runIndex(idx)}
                    className={`${rowBase} ${isActive ? "bg-[var(--crm-accent-weak)]" : "hover:bg-[var(--crm-surface-3)]"}`}
                  >
                    <div className="shrink-0 h-8 w-8 rounded-lg bg-[var(--crm-surface-3)] flex items-center justify-center">
                      <MapPin size={14} className="text-[var(--crm-text-3)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--crm-text)] truncate" style={H}>{r.name}</p>
                      <p className="text-xs text-[var(--crm-text-3)] truncate flex items-center gap-2" style={H}>
                        {secondary && <span>{secondary}</span>}
                        {r.email && <span className="flex items-center gap-1"><Mail size={10} />{r.email}</span>}
                        {!r.email && r.phone && <span className="flex items-center gap-1"><Phone size={10} />{r.phone}</span>}
                      </p>
                    </div>
                    {isActive && <CornerDownLeft size={13} className="text-[var(--crm-accent-text)] shrink-0" />}
                  </div>
                );
              })}
              {!loading && results.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-[var(--crm-text-3)]" style={H}>
                  No leads match &ldquo;{query.trim()}&rdquo;
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[var(--crm-border)] text-[10px] text-[var(--crm-text-3)]" style={H}>
          <span className="flex items-center gap-1"><CornerDownLeft size={11} /> select</span>
          <span>↑↓ navigate</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
