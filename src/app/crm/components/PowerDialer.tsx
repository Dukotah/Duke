"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Phone, PhoneOff, X, SkipForward, ChevronLeft, Pause,
  CheckCircle2, XCircle, Voicemail, PhoneMissed, RotateCcw, Zap,
} from "lucide-react";

// Self-contained shapes (kept loose so any Lead/LeadState the parent holds fits).
interface Lead {
  id: string;
  name: string;
  phone?: string;
  phone_e164?: string;
  outreach_score?: number;
  city?: string;
  category?: string;
  pitch?: string;
  best_contact?: string;
}

interface LeadStateLike {
  status?: string; stage?: string; lastContacted?: string;
  callCount?: number; lastOutcome?: string; followUpDate?: string;
}

interface Props {
  leads: Lead[];
  states: Record<string, LeadStateLike>;
  /** Mirror CRMDashboard.handleCallOutcome — persists state + the durable stamp. */
  onLogOutcome: (leadId: string, outcome: string) => void;
  onClose: () => void;
}

// Outcome keys MIRROR CRMDashboard.handleCallOutcome's outcomeToStage map
// (no_answer / voicemail / call_back / interested) plus not_interested.
// Index 0..4 maps to keyboard keys 1..5.
const OUTCOMES: {
  key: string;
  label: string;
  short: string;
  icon: typeof Phone;
  classes: string;
}[] = [
  { key: "no_answer",      label: "No Answer",      short: "No Answer",   icon: PhoneMissed,  classes: "bg-[var(--crm-surface-3)] text-[var(--crm-text-2)] border-[var(--crm-border-strong)]" },
  { key: "voicemail",      label: "Voicemail",      short: "Voicemail",   icon: Voicemail,    classes: "bg-blue-500/10 text-blue-500 border-blue-500/30" },
  { key: "call_back",      label: "Call Back",      short: "Call Back",   icon: RotateCcw,    classes: "bg-purple-500/10 text-purple-500 border-purple-500/30" },
  { key: "interested",     label: "Interested",     short: "Interested",  icon: CheckCircle2, classes: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" },
  { key: "not_interested", label: "Not Interested", short: "Not Int.",    icon: XCircle,      classes: "bg-red-500/10 text-red-500 border-red-500/30" },
];

const H = { fontFamily: "var(--font-heading)" };

const OUTCOME_LABEL: Record<string, string> = {
  no_answer: "No Answer",
  voicemail: "Voicemail",
  call_back: "Call Back",
  interested: "Interested",
  not_interested: "Not Interested",
  called: "Called",
};

export default function PowerDialer({ leads, states, onLogOutcome, onClose }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Outcomes logged this session (leadId -> outcome) for the progress strip.
  const [logged, setLogged] = useState<Record<string, string>>({});
  const total = leads.length;
  const lead = leads[index];

  const advance = useCallback(() => {
    setIndex((i) => Math.min(i + 1, total)); // total == "done" sentinel
  }, [total]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const logOutcome = useCallback((outcome: string) => {
    if (!lead) return;
    onLogOutcome(lead.id, outcome);
    setLogged((prev) => ({ ...prev, [lead.id]: outcome }));
    advance();
  }, [lead, onLogOutcome, advance]);

  const dialNumber = lead?.phone_e164 || lead?.phone || "";
  const call = useCallback(() => {
    if (!dialNumber) return;
    window.location.href = `tel:${dialNumber}`;
  }, [dialNumber]);

  // Keyboard: 1-5 outcomes, space to call, esc to exit, arrows prev/skip.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (paused || index >= total) return;
      if (e.key >= "1" && e.key <= "5") {
        const o = OUTCOMES[Number(e.key) - 1];
        if (o) { e.preventDefault(); logOutcome(o.key); }
        return;
      }
      if (e.key === " ") { e.preventDefault(); call(); return; }
      if (e.key === "ArrowRight") { e.preventDefault(); advance(); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); return; }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paused, index, total, logOutcome, call, advance, goPrev, onClose]);

  if (typeof document === "undefined") return null;

  const done = total === 0 || index >= total;

  const content = (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-[var(--crm-bg)]"
      style={{ ...H, paddingBottom: "env(safe-area-inset-bottom, 0px)", paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {/* Top chrome: progress + exit */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--crm-border)] crm-chrome">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--crm-accent-text)]" style={H}>
            <Zap size={15} className="text-[var(--crm-accent)]" />
            Power Dialer
          </span>
          {!done && (
            <span className="text-xs font-semibold text-[var(--crm-text-3)] tabular-nums" style={H}>
              {index + 1} / {total}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!done && (
            <button
              onClick={() => setPaused((p) => !p)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-[var(--crm-border)] text-[var(--crm-text-2)] bg-[var(--crm-surface)] hover:bg-[var(--crm-surface-3)] transition-colors"
              style={H}
            >
              <Pause size={12} />
              {paused ? "Resume" : "Pause"}
            </button>
          )}
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-colors"
            style={H}
          >
            <X size={13} />
            Exit
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-[var(--crm-surface-3)]">
        <div
          className="h-full bg-[var(--crm-accent)] transition-all duration-300"
          style={{ width: `${total === 0 ? 100 : Math.min((index / total) * 100, 100)}%` }}
        />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {done ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6 py-16">
            <div className="w-16 h-16 rounded-2xl bg-[var(--crm-accent-weak)] border border-[var(--crm-accent-border)] flex items-center justify-center mb-4">
              <CheckCircle2 size={32} className="text-[var(--crm-accent)]" />
            </div>
            <p className="text-xl font-bold text-[var(--crm-text)]" style={H}>
              {total === 0 ? "No leads in this list" : "Session complete!"}
            </p>
            <p className="text-sm text-[var(--crm-text-2)] mt-1.5" style={H}>
              {total === 0
                ? "Filter some leads in People, then launch the dialer."
                : `You ran through ${total} ${total === 1 ? "lead" : "leads"}. ${Object.keys(logged).length} logged.`}
            </p>
            <button
              onClick={onClose}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[var(--crm-accent)] hover:opacity-90 transition-opacity"
              style={H}
            >
              Done
            </button>
          </div>
        ) : paused ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6 py-16">
            <Pause size={36} className="text-[var(--crm-text-3)] mb-3" />
            <p className="text-lg font-bold text-[var(--crm-text)]" style={H}>Paused</p>
            <p className="text-sm text-[var(--crm-text-2)] mt-1" style={H}>Take a breath. Resume when you&apos;re ready.</p>
            <button
              onClick={() => setPaused(false)}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[var(--crm-accent)] hover:opacity-90 transition-opacity"
              style={H}
            >
              Resume
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-5 py-6 sm:py-10 flex flex-col items-center">
            {/* Score + name */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4 ${
              (lead.outreach_score ?? 0) >= 80 ? "bg-[var(--crm-accent-weak)] text-[var(--crm-accent-text)]" :
              (lead.outreach_score ?? 0) >= 60 ? "bg-yellow-400/15 text-yellow-500" :
              "bg-[var(--crm-surface-3)] text-[var(--crm-text-3)]"
            }`} style={H}>
              {lead.outreach_score ?? "—"}
            </div>
            <h2 className="text-2xl font-bold text-[var(--crm-text)] text-center leading-tight" style={H}>{lead.name}</h2>
            <p className="text-sm text-[var(--crm-text-3)] mt-1 text-center" style={H}>
              {[lead.city, lead.category?.replace(/_/g, " ")].filter(Boolean).join(" · ")}
            </p>
            {(states[lead.id]?.callCount ?? 0) > 0 && (
              <p className="text-xs text-[var(--crm-text-3)] mt-1" style={H}>
                Called {states[lead.id]?.callCount}x
                {states[lead.id]?.lastOutcome && ` · last: ${OUTCOME_LABEL[states[lead.id]!.lastOutcome!] ?? states[lead.id]!.lastOutcome}`}
              </p>
            )}

            {/* Big call button */}
            {dialNumber ? (
              <a
                href={`tel:${dialNumber}`}
                className="mt-6 w-full max-w-xs inline-flex items-center justify-center gap-3 py-5 rounded-2xl text-lg font-bold text-white bg-[var(--crm-accent)] shadow-lg shadow-[var(--crm-accent-border)] hover:opacity-90 active:scale-[0.98] transition-all"
                style={H}
              >
                <Phone size={22} />
                {lead.phone || dialNumber}
              </a>
            ) : (
              <div className="mt-6 w-full max-w-xs inline-flex items-center justify-center gap-2 py-5 rounded-2xl text-sm font-bold text-[var(--crm-text-3)] bg-[var(--crm-surface-3)] border border-[var(--crm-border)]" style={H}>
                <PhoneOff size={18} />
                No phone number
              </div>
            )}
            <p className="text-[11px] text-[var(--crm-text-3)] mt-2" style={H}>Press <kbd className="px-1 rounded bg-[var(--crm-surface-3)] border border-[var(--crm-border)]">space</kbd> to call</p>

            {/* Opening line / script */}
            {lead.pitch && (
              <div className="mt-6 w-full crm-surface border border-[var(--crm-border)] rounded-2xl px-4 py-4">
                <p className="text-[11px] font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-1.5" style={H}>Opening line</p>
                <p className="text-sm text-[var(--crm-text)] leading-relaxed" style={H}>{lead.pitch}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Outcome bar + nav (only while a live lead is shown) */}
      {!done && !paused && (
        <div className="border-t border-[var(--crm-border)] crm-chrome px-3 py-3">
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-5 gap-2">
              {OUTCOMES.map((o, i) => {
                const Icon = o.icon;
                return (
                  <button
                    key={o.key}
                    onClick={() => logOutcome(o.key)}
                    title={`${o.label} (${i + 1})`}
                    className={`flex flex-col items-center justify-center gap-1 px-1 py-2.5 rounded-xl border text-[11px] font-semibold transition-all active:scale-95 hover:brightness-125 ${o.classes}`}
                    style={H}
                  >
                    <Icon size={16} />
                    <span className="leading-tight text-center">{o.short}</span>
                    <span className="opacity-50 text-[9px]">{i + 1}</span>
                  </button>
                );
              })}
            </div>

            {/* Prev / Skip */}
            <div className="flex items-center justify-between mt-2.5">
              <button
                onClick={goPrev}
                disabled={index === 0}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-[var(--crm-border)] text-[var(--crm-text-2)] bg-[var(--crm-surface)] hover:bg-[var(--crm-surface-3)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                style={H}
              >
                <ChevronLeft size={13} />
                Previous
              </button>
              <button
                onClick={advance}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-[var(--crm-border)] text-[var(--crm-text-2)] bg-[var(--crm-surface)] hover:bg-[var(--crm-surface-3)] transition-colors"
                style={H}
              >
                Skip
                <SkipForward size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(content, document.body);
}
