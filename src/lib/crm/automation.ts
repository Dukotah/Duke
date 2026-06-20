// Per-stage pipeline automation rules.
//
// An admin defines rules that fire when a lead moves between pipeline stages.
// Each rule optionally matches a `fromStage` and always matches a `toStage`;
// when a lead's stage changes (see /api/crm/state), every matching rule runs
// its list of actions. Rules are stored in ONE global Redis key (admin-managed,
// not per-user) so the same automation applies to every rep's pipeline.
//
// Storage mirrors the JSON-string-in-a-key pattern used elsewhere in the CRM:
// a single string value holding the serialised rules array.
import { getRedis } from "@/lib/redis";
import { setLeadState } from "@/lib/db";
import { createTask } from "@/lib/crm/tasks";
import { DEFAULT_TEMPLATES } from "@/app/crm/components/emailTemplates";

const RULES_KEY = "automation:rules";

// ─── Types ──────────────────────────────────────────────────────────────────

export type AutomationAction =
  | { kind: "sendTemplate"; templateId: string }
  | { kind: "createTask"; title: string; inDays?: number }
  | { kind: "setFollowUp"; inDays: number };

export interface AutomationRule {
  id: string;
  fromStage?: string;        // optional — when set, only fires moving FROM this stage
  toStage: string;           // required — fires when a lead lands on this stage
  actions: AutomationAction[];
}

// ─── Validation ────────────────────────────────────────────────────────────────

const ACTION_KINDS = new Set(["sendTemplate", "createTask", "setFollowUp"]);

/**
 * Validate + normalise an untrusted rules payload (e.g. from the admin UI) into
 * well-formed AutomationRule[]. Anything malformed is dropped rather than
 * persisted, so runStageAutomations never chokes on junk later. Pure (no I/O) —
 * the single source of truth for what a valid rule looks like.
 *
 * Drops a rule when: it's not an object, `toStage` is missing/blank, or it has
 * zero valid actions. Drops an action when its `kind` is unknown or its required
 * fields are missing/wrong-typed. Generates an `id` when absent.
 */
export function validateRules(input: unknown): AutomationRule[] {
  if (!Array.isArray(input)) return [];
  const rules: AutomationRule[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const toStage = typeof r.toStage === "string" ? r.toStage.trim() : "";
    if (!toStage) continue;

    const actionsIn = Array.isArray(r.actions) ? r.actions : [];
    const actions: AutomationAction[] = [];
    for (const a of actionsIn) {
      if (!a || typeof a !== "object") continue;
      const obj = a as Record<string, unknown>;
      const kind = obj.kind;
      if (typeof kind !== "string" || !ACTION_KINDS.has(kind)) continue;

      if (kind === "sendTemplate" && typeof obj.templateId === "string" && obj.templateId.trim()) {
        actions.push({ kind: "sendTemplate", templateId: obj.templateId.trim() });
      } else if (kind === "createTask" && typeof obj.title === "string" && obj.title.trim()) {
        actions.push({
          kind: "createTask",
          title: obj.title.trim(),
          inDays: typeof obj.inDays === "number" ? obj.inDays : undefined,
        });
      } else if (kind === "setFollowUp" && typeof obj.inDays === "number") {
        actions.push({ kind: "setFollowUp", inDays: obj.inDays });
      }
    }
    if (actions.length === 0) continue;

    rules.push({
      id: typeof r.id === "string" && r.id ? r.id : crypto.randomUUID(),
      fromStage: typeof r.fromStage === "string" && r.fromStage.trim() ? r.fromStage.trim() : undefined,
      toStage,
      actions,
    });
  }
  return rules;
}

// ─── Persistence ──────────────────────────────────────────────────────────────

export async function getRules(): Promise<AutomationRule[]> {
  const redis = getRedis();
  const raw = await redis.get(RULES_KEY);
  if (!raw) return [];
  // Upstash may already return a parsed object; tolerate both string + object.
  if (typeof raw === "object") return raw as AutomationRule[];
  try {
    return JSON.parse(raw as string) as AutomationRule[];
  } catch {
    return [];
  }
}

export async function saveRules(rules: AutomationRule[]): Promise<void> {
  const redis = getRedis();
  await redis.set(RULES_KEY, JSON.stringify(rules));
}

// ─── Execution ─────────────────────────────────────────────────────────────────

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

/**
 * Run every rule that matches a stage transition for one lead. Safe to call in
 * the hot path of a state PATCH: each action is individually guarded so a single
 * failing action (or template lookup) never aborts the others or the request.
 *
 * Returns a short summary of what ran, useful for logging / the API response.
 */
export async function runStageAutomations(
  userId: string,
  leadId: string,
  leadName: string,
  fromStage: string | undefined,
  toStage: string
): Promise<{ rulesFired: number; actionsRun: number }> {
  if (!toStage) return { rulesFired: 0, actionsRun: 0 };

  const rules = await getRules();
  const matching = rules.filter(
    (r) => r.toStage === toStage && (!r.fromStage || r.fromStage === fromStage)
  );

  let actionsRun = 0;

  for (const rule of matching) {
    for (const action of rule.actions ?? []) {
      try {
        await runAction(userId, leadId, leadName, action);
        actionsRun++;
      } catch (err) {
        console.error(
          `[automation] action ${action.kind} failed for lead ${leadId} (rule ${rule.id}):`,
          err
        );
      }
    }
  }

  return { rulesFired: matching.length, actionsRun };
}

async function runAction(
  userId: string,
  leadId: string,
  leadName: string,
  action: AutomationAction
): Promise<void> {
  switch (action.kind) {
    case "createTask": {
      await createTask(userId, {
        leadId,
        leadName,
        title: action.title,
        type: "todo",
        dueAt: action.inDays != null ? addDays(action.inDays) : undefined,
      });
      return;
    }

    case "setFollowUp": {
      await setLeadState(userId, leadId, { followUpDate: addDays(action.inDays) });
      return;
    }

    case "sendTemplate": {
      // Resolve the template subject (built-in templates are a static export;
      // rep-authored ones live in browser localStorage and aren't readable on
      // the server). Sending an email straight from a stage change is gated by
      // the same domain/warm-up protections as manual outreach via the outreach
      // send path, so rather than risk an unverified blast we queue a same-day
      // "email" task carrying the template so the rep fires it through the
      // gated composer. The Wire phase can later POST /api/crm/outreach directly
      // once domain delivery is confirmed live.
      const template = DEFAULT_TEMPLATES.find((t) => t.key === action.templateId);
      const subject = template?.subject?.trim();
      await createTask(userId, {
        leadId,
        leadName,
        title: subject ? `Send template: ${subject}` : `Send template ${action.templateId}`,
        type: "email",
        dueAt: addDays(0),
      });
      return;
    }
  }
}
