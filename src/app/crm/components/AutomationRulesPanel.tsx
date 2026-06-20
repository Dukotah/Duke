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
  "px-2.5 py-1.5 rounded-lg bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] focus:outline-none focus:border-[var(--crm-accent-border)] appearance-none";
const inputCls =
  "px-2.5 py-1.5 rounded-lg bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)]";

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
    // Validate the draft before committing.
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
          <div className="w-9 h-9 rounded-xl bg-[var(--crm-accent-weak)] border border-[var(--crm-accent-border)] flex items-center justify-center">
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
          <button onClick={addRule}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--crm-border)] bg-[var(--crm-surface)] text-sm font-semibold text-[var(--crm-text)] hover:border-[var(--crm-accent-border)] transition-colors">
            <Plus size={14} />New rule
          </button>
          <button onClick={() => void save()} disabled={saving || !dirty}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--crm-accent)] text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-500">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[var(--crm-text-3)] py-8 justify-center">
          <Loader2 size={15} className="animate-spin" />Loading rules…
        </div>
      ) : rules.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--crm-border)] bg-[var(--crm-surface-2)] px-4 py-10 text-center">
          <Zap size={22} className="mx-auto text-[var(--crm-text-3)] mb-2" />
          <p className="text-sm font-semibold text-[var(--crm-text-2)]">No automation rules yet</p>
          <p className="text-xs text-[var(--crm-text-3)] mt-1">Add a rule to fire actions when a deal reaches a stage.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => {
            const d = draftFor(rule.id);
            return (
              <div key={rule.id} className="rounded-2xl border border-[var(--crm-border)] bg-[var(--crm-surface)] p-4 space-y-3">
                {/* Trigger row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--crm-text-3)]">When stage</span>
                  <select value={rule.fromStage ?? ""} onChange={(e) => patchRule(rule.id, { fromStage: e.target.value || undefined })}
                    className={selectCls} style={H} aria-label="From stage">
                    <option value="">Any</option>
                    {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                  <ArrowRight size={14} className="text-[var(--crm-text-3)]" />
                  <select value={rule.toStage} onChange={(e) => patchRule(rule.id, { toStage: e.target.value })}
                    className={selectCls} style={H} aria-label="To stage">
                    {STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                  <button onClick={() => deleteRule(rule.id)} aria-label="Delete rule"
                    className="ml-auto inline-flex items-center gap-1 text-xs text-[var(--crm-text-3)] hover:text-red-500 transition-colors px-2 py-1">
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Existing actions */}
                {rule.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {rule.actions.map((a, i) => (
                      <span key={i}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--crm-accent-border)] bg-[var(--crm-accent-weak)] px-2.5 py-1 text-xs text-[var(--crm-accent-text)]">
                        {actionSummary(a)}
                        <button onClick={() => removeAction(rule.id, i)} aria-label="Remove action"
                          className="hover:text-red-500 transition-colors"><Trash2 size={11} /></button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add-action row */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[var(--crm-border)]">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--crm-text-3)]">Then</span>
                  <select value={d.kind}
                    onChange={(e) => {
                      const kind = e.target.value as AutomationAction["kind"];
                      if (kind === "sendTemplate") setDraftFor(rule.id, { kind, templateId: TEMPLATE_OPTIONS[0].id });
                      else if (kind === "setFollowUp") setDraftFor(rule.id, { kind, inDays: 3 });
                      else setDraftFor(rule.id, { kind: "createTask", title: "", inDays: undefined });
                    }}
                    className={selectCls} style={H} aria-label="Action type">
                    <option value="createTask">Create task</option>
                    <option value="sendTemplate">Send template</option>
                    <option value="setFollowUp">Set follow-up</option>
                  </select>

                  {d.kind === "sendTemplate" && (
                    <select value={d.templateId} onChange={(e) => setDraftFor(rule.id, { kind: "sendTemplate", templateId: e.target.value })}
                      className={selectCls} style={H} aria-label="Template">
                      {TEMPLATE_OPTIONS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>
                  )}

                  {d.kind === "createTask" && (
                    <>
                      <input value={d.title} onChange={(e) => setDraftFor(rule.id, { ...d, title: e.target.value })}
                        placeholder="Task title (e.g. Call to confirm)" className={`${inputCls} flex-1 min-w-[160px]`} style={H} />
                      <label className="text-xs text-[var(--crm-text-3)]">in</label>
                      <input type="number" min={0} value={d.inDays ?? ""} placeholder="0"
                        onChange={(e) => setDraftFor(rule.id, { ...d, inDays: e.target.value === "" ? undefined : Math.max(0, parseInt(e.target.value, 10) || 0) })}
                        className={`${inputCls} w-16`} style={H} aria-label="Due in days" />
                      <span className="text-xs text-[var(--crm-text-3)]">days</span>
                    </>
                  )}

                  {d.kind === "setFollowUp" && (
                    <>
                      <label className="text-xs text-[var(--crm-text-3)]">in</label>
                      <input type="number" min={0} value={d.inDays}
                        onChange={(e) => setDraftFor(rule.id, { kind: "setFollowUp", inDays: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                        className={`${inputCls} w-16`} style={H} aria-label="Follow-up in days" />
                      <span className="text-xs text-[var(--crm-text-3)]">days</span>
                    </>
                  )}

                  <button onClick={() => addAction(rule.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--crm-border)] bg-[var(--crm-surface-2)] text-xs font-semibold text-[var(--crm-text)] hover:border-[var(--crm-accent-border)] transition-colors">
                    <Plus size={12} />Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-[var(--crm-text-3)]">
        Template sends queue a same-day email task for the rep (sending stays behind the outreach domain gate). Tasks and follow-ups are applied to the moved lead immediately.
      </p>
    </div>
  );
}
