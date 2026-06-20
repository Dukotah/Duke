"use client";

import { useState, useEffect, useCallback } from "react";
import {
  GripVertical,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Mail,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SequenceStep {
  step: number;
  delayDays: number;
  subject: string;
  body: string;
}

// ─── Default blank step factory ───────────────────────────────────────────────

function blankStep(stepNumber: number): SequenceStep {
  return {
    step: stepNumber,
    delayDays: 7,
    subject: "",
    body: "",
  };
}

// ─── Step Card ────────────────────────────────────────────────────────────────

interface StepCardProps {
  step: SequenceStep;
  index: number;
  total: number;
  onChange: (index: number, patch: Partial<SequenceStep>) => void;
  onDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  dirty: boolean;
}

function StepCard({ step, index, total, onChange, onDelete, onMoveUp, onMoveDown, dirty }: StepCardProps) {
  const [expanded, setExpanded] = useState(true);
  const H = { fontFamily: "var(--font-heading)" };

  const previewBody = step.body.trim().split("\n").slice(0, 2).join(" ").slice(0, 120);

  return (
    <div
      className={`bg-[var(--crm-surface)] border rounded-2xl transition-all ${
        dirty ? "border-[var(--crm-accent-border)]" : "border-[var(--crm-border)]"
      }`}
    >
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Drag handle (visual only — keyboard reorder via buttons) */}
        <span className="text-[var(--crm-text-3)] cursor-grab active:cursor-grabbing shrink-0">
          <GripVertical size={16} />
        </span>

        {/* Step badge */}
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: "var(--crm-accent)" }}
        >
          {index + 1}
        </span>

        {/* Subject / preview */}
        <div className="flex-1 min-w-0">
          {expanded ? (
            <p className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider" style={H}>
              Step {index + 1}
            </p>
          ) : (
            <>
              <p className="text-sm font-semibold text-[var(--crm-text)] truncate" style={H}>
                {step.subject || <span className="italic text-[var(--crm-text-3)]">No subject</span>}
              </p>
              {previewBody && (
                <p className="text-xs text-[var(--crm-text-3)] truncate mt-0.5" style={H}>
                  {previewBody}
                </p>
              )}
            </>
          )}
        </div>

        {/* Day offset pill */}
        <span
          className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-[var(--crm-text-3)] bg-[var(--crm-surface-2)] border border-[var(--crm-border)] rounded-full px-2.5 py-1"
          style={H}
        >
          <Clock size={10} />
          Day {step.delayDays}
        </span>

        {/* Reorder + collapse buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            aria-label="Move step up"
            className="p-1 rounded-lg text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] disabled:opacity-25 transition-colors"
          >
            <ChevronUp size={15} />
          </button>
          <button
            onClick={() => onMoveDown(index)}
            disabled={index === total - 1}
            aria-label="Move step down"
            className="p-1 rounded-lg text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] disabled:opacity-25 transition-colors"
          >
            <ChevronDown size={15} />
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Collapse step" : "Expand step"}
            className="p-1 rounded-lg text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] transition-colors"
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          <button
            onClick={() => onDelete(index)}
            aria-label="Delete step"
            className="p-1 rounded-lg text-[var(--crm-text-3)] hover:text-red-500 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-[var(--crm-border)] px-4 py-4 space-y-4">
          {/* Delay days */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider whitespace-nowrap" style={H}>
                Send after
              </label>
              <input
                type="number"
                min={1}
                max={90}
                value={step.delayDays}
                onChange={(e) => onChange(index, { delayDays: Math.max(1, parseInt(e.target.value) || 1) })}
                className="w-16 px-3 py-1.5 rounded-xl bg-[var(--crm-surface-2)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] text-center focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors tabular-nums"
                style={H}
              />
              <span className="text-xs text-[var(--crm-text-3)]" style={H}>days from previous touch</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[var(--crm-text-3)]" style={H}>
              <Mail size={11} className="text-[var(--crm-accent)]" />
              Email
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-1.5" style={H}>
              Subject line
            </label>
            <input
              type="text"
              value={step.subject}
              onChange={(e) => onChange(index, { subject: e.target.value })}
              placeholder="e.g. Re: quick question about {business}"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--crm-surface-2)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors"
              style={H}
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-1.5" style={H}>
              Email body
            </label>
            <textarea
              value={step.body}
              onChange={(e) => onChange(index, { body: e.target.value })}
              rows={8}
              placeholder={"Hi {name},\n\nYour message here…"}
              className="w-full px-4 py-3 rounded-xl bg-[var(--crm-surface-2)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors resize-y font-mono leading-relaxed"
            />
          </div>

          {/* Token hint */}
          <p className="text-xs text-[var(--crm-text-3)] leading-relaxed" style={H}>
            Available tokens:{" "}
            {["{name}", "{business}"].map((t) => (
              <code
                key={t}
                className="mx-0.5 px-1.5 py-0.5 rounded bg-[var(--crm-accent-weak)] text-[var(--crm-accent-text)] border border-[var(--crm-accent-border)] text-[11px]"
              >
                {t}
              </code>
            ))}
            {" "}— filled automatically from the lead record before sending.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SequenceBuilder() {
  const H = { fontFamily: "var(--font-heading)" };

  const [steps, setSteps] = useState<SequenceStep[]>([]);
  const [savedSteps, setSavedSteps] = useState<SequenceStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/sequences");
      if (res.ok) {
        const d = await res.json();
        const loaded: SequenceStep[] = d.steps ?? [];
        setSteps(JSON.parse(JSON.stringify(loaded)));
        setSavedSteps(JSON.parse(JSON.stringify(loaded)));
      }
    } catch {
      // leave empty — will show empty state
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { load(); }, [load]);

  // Whether local edits differ from last-saved state
  const isDirty = JSON.stringify(steps) !== JSON.stringify(savedSteps);

  function handleChange(index: number, patch: Partial<SequenceStep>) {
    setSteps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
    setStatus("idle");
  }

  function handleDelete(index: number) {
    setSteps((prev) => {
      const next = prev.filter((_, i) => i !== index);
      // Re-number step fields
      return next.map((s, i) => ({ ...s, step: i + 1 }));
    });
    setStatus("idle");
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    setSteps((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next.map((s, i) => ({ ...s, step: i + 1 }));
    });
    setStatus("idle");
  }

  function handleMoveDown(index: number) {
    setSteps((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next.map((s, i) => ({ ...s, step: i + 1 }));
    });
    setStatus("idle");
  }

  function handleAddStep() {
    setSteps((prev) => [...prev, blankStep(prev.length + 1)]);
    setStatus("idle");
  }

  function handleReset() {
    setSteps(JSON.parse(JSON.stringify(savedSteps)));
    setStatus("idle");
  }

  async function handleSave() {
    setSaving(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/crm/sequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steps }),
      });
      if (res.ok) {
        const d = await res.json();
        const saved: SequenceStep[] = d.steps ?? steps;
        setSavedSteps(JSON.parse(JSON.stringify(saved)));
        setSteps(JSON.parse(JSON.stringify(saved)));
        setStatus("saved");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[var(--crm-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5" style={H}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-base font-bold text-[var(--crm-text)]" style={H}>Outreach Cadence</h2>
          <p className="text-xs text-[var(--crm-text-3)] mt-1 leading-relaxed" style={H}>
            {steps.length} follow-up {steps.length === 1 ? "touch" : "touches"} after the initial outreach.
            Changes here affect all future automated sequences — existing in-flight cadences are not altered retroactively.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isDirty && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-[var(--crm-text-3)] bg-[var(--crm-surface-3)] border border-[var(--crm-border)] hover:border-[var(--crm-border-strong)] transition-colors"
              style={H}
            >
              <RotateCcw size={13} />Discard
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--crm-accent)", ...H }}
          >
            <Save size={13} />
            {saving ? "Saving…" : "Save Cadence"}
          </button>
        </div>
      </div>

      {/* Status banner */}
      {status === "saved" && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3">
          <CheckCircle2 size={15} className="text-green-500 shrink-0" />
          <p className="text-sm text-green-500 font-medium" style={H}>Cadence saved — new sequences will use these steps.</p>
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <AlertTriangle size={15} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-400 font-medium" style={H}>Save failed. Only admins can edit the cadence.</p>
        </div>
      )}

      {/* Step cards */}
      <div className="space-y-3">
        {steps.length === 0 ? (
          <div className="text-center py-14 text-[var(--crm-text-3)] text-sm bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-2xl" style={H}>
            No steps configured. Add a touch below to build your cadence.
          </div>
        ) : (
          steps.map((s, i) => (
            <StepCard
              key={`step-${i}`}
              step={s}
              index={i}
              total={steps.length}
              onChange={handleChange}
              onDelete={handleDelete}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              dirty={JSON.stringify(s) !== JSON.stringify(savedSteps[i])}
            />
          ))
        )}
      </div>

      {/* Add step */}
      <button
        onClick={handleAddStep}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-[var(--crm-border)] text-sm font-semibold text-[var(--crm-text-3)] hover:border-[var(--crm-accent-border)] hover:text-[var(--crm-accent-text)] transition-colors"
        style={H}
      >
        <Plus size={15} />Add Touch
      </button>

      {/* Timeline summary */}
      {steps.length > 0 && (
        <div className="bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-2xl p-4">
          <p className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-3" style={H}>Timeline preview</p>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-px bg-[var(--crm-border)]" />
            <div className="space-y-3">
              {/* Day 0 — initial outreach (not editable here) */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--crm-surface-2)] border border-[var(--crm-border)] flex items-center justify-center shrink-0 z-10">
                  <Mail size={11} className="text-[var(--crm-text-3)]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--crm-text-2)]" style={H}>Day 0 — Initial outreach</p>
                  <p className="text-[11px] text-[var(--crm-text-3)]" style={H}>Sent manually by rep (not part of this cadence)</p>
                </div>
              </div>

              {/* Sequence steps */}
              {steps.reduce<{ els: React.ReactNode[]; cumulative: number }>(
                ({ els, cumulative }, s, i) => {
                  const day = cumulative + s.delayDays;
                  return {
                    cumulative: day,
                    els: [
                      ...els,
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-white text-[10px] font-bold"
                          style={{ backgroundColor: "var(--crm-accent)" }}
                        >
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[var(--crm-text)]" style={H}>
                            Day {day}
                            <span className="ml-1 text-[var(--crm-text-3)] font-normal">(+{s.delayDays}d)</span>
                          </p>
                          <p className="text-[11px] text-[var(--crm-text-3)] truncate" style={H}>
                            {s.subject || <span className="italic">No subject set</span>}
                          </p>
                        </div>
                      </div>,
                    ],
                  };
                },
                { els: [], cumulative: 0 }
              ).els}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
