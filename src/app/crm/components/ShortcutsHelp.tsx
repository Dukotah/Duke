"use client";

import { useEffect, useRef } from "react";
import { X, Keyboard } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const H = { fontFamily: "var(--font-heading)" };

// A single keycap badge.
function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-md text-[11px] font-bold bg-[var(--crm-surface-3)] border border-[var(--crm-border)] text-[var(--crm-text-2)] shadow-[0_1px_0_0_var(--crm-border)] leading-none"
      style={H}
    >
      {children}
    </kbd>
  );
}

// A row inside a group: one or more keys + a description.
function Row({ keys, label }: { keys: React.ReactNode[]; label: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-[var(--crm-border)] last:border-0">
      <div className="flex items-center gap-1 shrink-0 min-w-[80px] justify-end">
        {keys.map((k, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-[10px] text-[var(--crm-text-3)]">then</span>}
            {k}
          </span>
        ))}
      </div>
      <span className="text-sm text-[var(--crm-text-2)]" style={H}>{label}</span>
    </div>
  );
}

// A named group of shortcuts.
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <p
        className="text-[10px] font-bold uppercase tracking-wider text-[var(--crm-text-3)] mb-1 px-0"
        style={H}
      >
        {title}
      </p>
      <div className="crm-surface rounded-xl px-3">{children}</div>
    </div>
  );
}

export default function ShortcutsHelp({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus the close button when the overlay opens so keyboard users can
  // immediately Tab through the content or press Esc / Enter to dismiss.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => closeRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  // Close on Escape. Tab focus is trapped inside the dialog.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }

      // Trap Tab inside the dialog so keyboard users cannot reach the page behind.
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled"));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      {/* Panel */}
      <div
        ref={dialogRef}
        className="crm-panel relative w-full max-w-md rounded-2xl border border-[var(--crm-border)] shadow-2xl overflow-hidden flex flex-col max-h-[85dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[var(--crm-border)] shrink-0">
          <Keyboard size={16} className="text-[var(--crm-accent-text)] shrink-0" />
          <h2 className="flex-1 text-[15px] font-bold text-[var(--crm-text)] tracking-tight" style={H}>
            Keyboard Shortcuts
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close shortcuts help"
            className="text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] hover:bg-[var(--crm-surface-3)] transition-colors rounded-lg p-1.5"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">

          <Group title="Global">
            <Row keys={[<Key key="meta">⌘</Key>, <Key key="k">K</Key>]} label="Open command palette" />
            <Row keys={[<Key key="?">?</Key>]} label="Show this shortcuts help" />
          </Group>

          <Group title="Navigation  (g → then letter)">
            <Row keys={[<Key key="g">g</Key>, <Key key="t">t</Key>]} label="Go to Today" />
            <Row keys={[<Key key="g">g</Key>, <Key key="d">d</Key>]} label="Go to Follow-ups (Due)" />
            <Row keys={[<Key key="g">g</Key>, <Key key="n">n</Key>]} label="Go to Demos (New)" />
            <Row keys={[<Key key="g">g</Key>, <Key key="r">r</Key>]} label="Go to Replies (Responded)" />
            <Row keys={[<Key key="g">g</Key>, <Key key="a">a</Key>]} label="Go to People (All leads)" />
            <Row keys={[<Key key="g">g</Key>, <Key key="p">p</Key>]} label="Go to Pipeline" />
            <Row keys={[<Key key="g">g</Key>, <Key key="l">l</Key>]} label="Go to Saved Lists" />
          </Group>

          <Group title="Lead List">
            <Row keys={[<Key key="j">J</Key>]} label="Move focus down one lead" />
            <Row keys={[<Key key="k">K</Key>]} label="Move focus up one lead" />
            <Row keys={[<Key key="enter">↵ Enter</Key>]} label="Open focused lead" />
            <Row keys={[<Key key="x">X</Key>]} label="Toggle select focused lead" />
          </Group>

          <Group title="Dialer  (during an active call)">
            <Row keys={[<Key key="1">1</Key>]} label="Outcome — No answer" />
            <Row keys={[<Key key="2">2</Key>]} label="Outcome — Voicemail" />
            <Row keys={[<Key key="3">3</Key>]} label="Outcome — Call back" />
            <Row keys={[<Key key="4">4</Key>]} label="Outcome — Interested" />
            <Row keys={[<Key key="5">5</Key>]} label="Outcome — Not interested" />
            <Row keys={[<Key key="space">Space</Key>]} label="Start / log call" />
          </Group>

        </div>

        {/* Footer hint */}
        <div
          className="shrink-0 flex items-center justify-between px-5 py-3 border-t border-[var(--crm-border)] text-[11px] text-[var(--crm-text-3)]"
          style={H}
        >
          <span>Shortcuts are disabled while typing in an input</span>
          <span className="flex items-center gap-1">esc close</span>
        </div>
      </div>
    </div>
  );
}
