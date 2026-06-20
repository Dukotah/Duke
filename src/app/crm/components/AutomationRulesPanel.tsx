"use client";

// Admin UI for per-stage pipeline automation rules. Self-contained: fetches and
// saves the full rules array via /api/crm/automation (GET/POST). Mounts as an
// Admin tab. Themed against the --crm-* tokens so it works in light + dark.
import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Zap, Save, Loader2, ArrowRight, AlertCircle } from "lucide-react";

const H = { fontFamily: "var(--font-heading)" };

// Pipeline stages, mirroring Pipeline.tsx's live stage keys.
const STAGES: { key: string; label: string }[] = [
  { key: "to_call", label: "To Call" },
  { key: "called", label: "Called" },
  { key: "voicemail", label: "Voicemail" },
  { key: "contacted", label: "Contacted" },
  { key: "interested", label: "Interested" },
  { key: "submitted", label: "Submitted" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
];

// Built-in email template keys (mirrors DEFAULT_TEMPLATES in
// components/emailTemplates.ts). Listed here so the admin can pick one without
// importing the localStorage-backed loader into this server-rendered surface.
const TEMPLATE_OPTIONS: { id: string; label: string }[] = [
  { id: "no_website", label: "No Website" },
  { id: "student_demo", label: "Student demo" },
  { id: "student_no_website", label: "Local student" },
  { id: "student_building", label: "Student (building skills)" },
  { id: "diy_upgrade", label: "Site Upgrade" },
  { id: "winery_demo", label: "Winery demo" },
  { id: "demo_intro", label: "Demo intro" },
  { id: "follow_up", label: "Follow Up 1 (bump)" },
  { id: "follow_up_angle", label: "Follow Up 2 (angle)" },
  { id: "follow_up_breakup", label: "Follow Up 3 (breakup)" },
];

type AutomationAction =
  | { kind: "sendTemplate"; templateId: string }
  | { kind: "createTask"; title: string; inDays?: number }
  | { kind: "setFollowUp"; inDays: number };

interface AutomationRule {
  id: string;
  fromStage?: string;
  toStage: string;
  actions: AutomationAction[];
}

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

function actionSummary(a: AutomationAction): string {
  if (a.kind === "sendTemplate") {
    const t = TEMPLATE_OPTIONS.find((o) => o.id === a.templateId);
    return `Send template: ${t?.label ?? a.templateId}`;
  }
  if (a.kind === "createTask") return `Create task: "${a.title}"${a.inDays ? ` (due +${a.inDays}d)` : ""}`;
  return `Set follow-up: +${a.inDays} day${a.inDays === 1 ? "" : "s"}`;
}

const selectCls =
  "min-h-[40px] px-2.5 py-1.5 rounded-lg bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] focus:outline-none focus:border-[var(--crm-accent-border)] focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)] appearance-none transition-colors";
const inputCls =
  "min-h-[40px] px-2.5 py-1.5 rounded-lg bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)] focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)] transition-colors";

// ─── Loading skeleton ──────────────────────────────────────────────────────────

function RuleSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--crm-border)] bg-[var(--crm-surface)] p-4 space-y-3 animate-pulse" aria-hidden="true">
      <div className="flex items-center gap-2">
        <div className="h-3 w-14 bg-[var(--crm-surface-3)] rounded" />
        <div className="h-8 w-28 bg-[var(--crm-surface-3)] rounded-lg" />
        <div className="h-4 w-4 bg-[var(--crm-surface-3)] rounded" />
        <div className="h-8 w-28 bg-[var(--crm-surface-3)] rounded-lg" />
        <div className="ml-auto h-8 w-8 bg-[var(--crm-surface-3)] rounded-lg" />
      </div>
      <div className="flex gap-2 pt-2 border-t border-[var(--crm-border)]">
        <div className="h-6 w-24 bg-[var(--crm-surface-3)] rounded-full" />
        <div className="h-6 w-32 bg-[var(--crm-surface-3)] rounded-full" />
      </div>
    </div>
  );
}

export default function AutomationRulesPanel() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  // New-action draft, per rule id.
  const [draft, setDraft] = useState<Record<string, AutomationAction>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crm/automation");
      if (res.status === 403) {
        setError("Admin access required to manage automation rules.");
        setRules([]);
        return;
      }
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const data = (await res.json()) as AutomationRule[];
      setRules(Array.isArray(data) ? data : []);
      setDirty(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load rules");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { void load(); }, [load]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/crm/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules }),
      });
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      const saved = (await res.json()) as AutomationRule[];
      setRules(Array.isArray(saved) ? saved : []);
      setDirty(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save rules");
    } finally {
      setSaving(false);
    }
  }, [rules]);

  function addRule() {
    setRules((r) => [...r, { id: uid(), fromStage: undefined, toStage: "interested", actions: [] }]);
    setDirty(true);
  }

  function deleteRule(id: string) {
    setRules((r) => r.filter((rule) => rule.id !== id));
    setDirty(true);
  }

  function patchRule(id: string, patch: Partial<AutomationRule>) {
    setRules((r) => r.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)));
    setDirty(true);
  }

  function removeAction(ruleId: string, index: number) {
    setRules((r) =>
      r.map((rule) =>
        rule.id === ruleId ? { ...rule, actions: rule.actions.filter((_, i) => i !== index) } : rule
      )
    );
    setDirty(true);
  }

  function draftFor(ruleId: string): AutomationAction {
    return draft[ruleId] ?? { kind: "createTask", title: "", inDays: undefined };
  }

  function setDraftFor(ruleId: string, action: AutomationAction) {
    setDraft((d) => ({ ...d, [ruleId]: action }));
  }

  function addAction(ruleId: string) {
    const a = draftFor(ruleId);
    if (a.kind === "sendTemplate" && !a.templateId) return;
    if (a.kind === "createTask" && !a.title.trim()) return;
    const normalized: AutomationAction =
      a.kind === "createTask" ? { ...a, title: a.title.trim() } : a;
    setRules((r) =>
      r.map((rule) => (rule.id === ruleId ? { ...rule, actions: [...rule.actions, normalized] } : rule))
    );
    setDraft((d) => ({ ...d, [ruleId]: { kind: "createTask", title: "", inDays: undefined } }));
    setDirty(true);
  }

  const ruleCount = rules.length;
  const actionCount = useMemo(() => rules.reduce((s, r) => s + r.actions.length, 0), [rules]);

  return (
    <div className="space-y-4" style={H}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl bg-[var(--crm-accent-weak)] border border-[var(--crm-accent-border)] flex items-center justify-center"
            aria-hidden="true"
          >
            <Zap size={16} className="text-[var(--crm-accent)]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--crm-text)]">Stage Automations</h3>
            <p className="text-xs text-[var(--crm-text-3)]">
              {ruleCount} rule{ruleCount === 1 ? "" : "s"} · {actionCount} action{actionCount === 1 ? "" : "s"} · runs when a deal changes stage
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addRule}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 rounded-xl border border-[var(--crm-border)] bg-[var(--crm-surface)] text-sm font-semibold text-[var(--crm-text)] hover:border-[var(--crm-accent-border)] hover:bg-[var(--crm-surface-3)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)]"
          >
            <Plus size={14} aria-hidden="true" />New rule
          </button>
          <button
            onClick={() => void save()}
            disabled={saving || !dirty}
            aria-label={dirty ? "Save changes" : "No unsaved changes"}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 rounded-xl bg-[var(--crm-accent)] text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)] focus-visible:ring-offset-2"
          >
            {saving ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Save size={14} aria-hidden="true" />}
            {dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-500"
        >
          <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div aria-busy="true" aria-label="Loading automation rules" className="space-y-3">
          <RuleSkeleton />
          <RuleSkeleton />
        </div>
      ) : rules.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--crm-border)] bg-[var(--crm-surface-2)] px-6 py-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--crm-surface)] border border-[var(--crm-border)] flex items-center justify-center mx-auto mb-3">
            <Zap size={20} className="text-[var(--crm-text-3)]" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-[var(--crm-text-2)]">No automation rules yet</p>
          <p className="text-xs text-[var(--crm-text-3)] mt-1 mb-4">
            Fire emails, tasks, or follow-ups automatically when a deal reaches a stage.
          </p>
          <button
            onClick={addRule}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl border border-[var(--crm-border)] bg-[var(--crm-surface)] text-sm font-semibold text-[var(--crm-text)] hover:border-[var(--crm-accent-border)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)]"
          >
            <Plus size={14} aria-hidden="true" />Add first rule
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => {
            const d = draftFor(rule.id);
            return (
              <div
                key={rule.id}
                className="rounded-2xl border border-[var(--crm-border)] bg-[var(--crm-surface)] p-4 space-y-3 hover:border-[var(--crm-accent-border)] transition-colors duration-150"
              >
                {/* Trigger row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--crm-text-3)]">When stage</span>
                  <select
                    value={rule.fromStage ?? ""}
                    onChange={(e) => patchRule(rule.id, { fromStage: e.target.value || undefined })}
                    className={selectCls}
                    style={H}
                    aria-label="From stage"
                  >
                    <option value="">Any</option>
                    {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                  <ArrowRight size={14} className="text-[var(--crm-text-3)]" aria-hidden="true" />
                  <select
                    value={rule.toStage}
                    onChange={(e) => patchRule(rule.id, { toStage: e.target.value })}
                    className={selectCls}
                    style={H}
                    aria-label="To stage"
                  >
                    {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    aria-label="Delete rule"
                    className="ml-auto min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-[var(--crm-text-3)] hover:text-red-500 hover:bg-red-500/10 transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </div>

                {/* Existing actions */}
                {rule.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {rule.actions.map((a, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--crm-accent-border)] bg-[var(--crm-accent-weak)] px-2.5 py-1 text-xs text-[var(--crm-accent-text)]"
                      >
                        {actionSummary(a)}
                        <button
                          onClick={() => removeAction(rule.id, i)}
                          aria-label={`Remove action: ${actionSummary(a)}`}
                          className="hover:text-red-500 transition-colors rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
                        >
                          <Trash2 size={11} aria-hidden="true" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add-action row */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--crm-border)]">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--crm-text-3)]">Then</span>
                  <select
                    value={d.kind}
                    onChange={(e) => {
                      const kind = e.target.value as AutomationAction["kind"];
                      if (kind === "sendTemplate") setDraftFor(rule.id, { kind, templateId: TEMPLATE_OPTIONS[0].id });
                      else if (kind === "setFollowUp") setDraftFor(rule.id, { kind, inDays: 3 });
                      else setDraftFor(rule.id, { kind: "createTask", title: "", inDays: undefined });
                    }}
                    className={selectCls}
                    style={H}
                    aria-label="Action type"
                  >
                    <option value="createTask">Create task</option>
                    <option value="sendTemplate">Send template</option>
                    <option value="setFollowUp">Set follow-up</option>
                  </select>

                  {d.kind === "sendTemplate" && (
                    <select
                      value={d.templateId}
                      onChange={(e) => setDraftFor(rule.id, { kind: "sendTemplate", templateId: e.target.value })}
                      className={selectCls}
                      style={H}
                      aria-label="Template"
                    >
                      {TEMPLATE_OPTIONS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                  )}

                  {d.kind === "createTask" && (
                    <>
                      <input
                        value={d.title}
                        onChange={(e) => setDraftFor(rule.id, { ...d, title: e.target.value })}
                        placeholder="Task title (e.g. Call to confirm)"
                        className={`${inputCls} flex-1 min-w-[160px]`}
                        style={H}
                        aria-label="Task title"
                      />
                      <label className="text-xs text-[var(--crm-text-3)]" htmlFor={`days-${rule.id}`}>in</label>
                      <input
                        id={`days-${rule.id}`}
                        type="number"
                        min={0}
                        value={d.inDays ?? ""}
                        placeholder="0"
                        onChange={(e) =>
                          setDraftFor(rule.id, {
                            ...d,
                            inDays: e.target.value === "" ? undefined : Math.max(0, parseInt(e.target.value, 10) || 0),
                          })
                        }
                        className={`${inputCls} w-16`}
                        style={H}
                        aria-label="Due in days"
                      />
                      <span className="text-xs text-[var(--crm-text-3)]">days</span>
                    </>
                  )}

                  {d.kind === "setFollowUp" && (
                    <>
                      <label className="text-xs text-[var(--crm-text-3)]" htmlFor={`followup-${rule.id}`}>in</label>
                      <input
                        id={`followup-${rule.id}`}
                        type="number"
                        min={0}
                        value={d.inDays}
                        onChange={(e) =>
                          setDraftFor(rule.id, { kind: "setFollowUp", inDays: Math.max(0, parseInt(e.target.value, 10) || 0) })
                        }
                        className={`${inputCls} w-16`}
                        style={H}
                        aria-label="Follow-up in days"
                      />
                      <span className="text-xs text-[var(--crm-text-3)]">days</span>
                    </>
                  )}

                  <button
                    onClick={() => addAction(rule.id)}
                    className="inline-flex items-center gap-1 min-h-[40px] px-3 py-1.5 rounded-lg border border-[var(--crm-border)] bg-[var(--crm-surface-2)] text-xs font-semibold text-[var(--crm-text)] hover:border-[var(--crm-accent-border)] hover:bg-[var(--crm-surface-3)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)]"
                  >
                    <Plus size={12} aria-hidden="true" />Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-[var(--crm-text-3)] leading-relaxed" style={H}>
        Template sends queue a same-day email task for the rep (sending stays behind the outreach domain gate). Tasks and follow-ups are applied to the moved lead immediately.
      </p>
    </div>
  );
}
