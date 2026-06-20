import { NextRequest, NextResponse } from "next/server";
import { parseJsonBody, handleApiError } from "@/lib/api";
import { getRules, saveRules, type AutomationRule, type AutomationAction } from "@/lib/crm/automation";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// Automation rules are admin-managed. The CRM session role is injected by
// src/middleware.ts as `x-user-role`; require it to be "admin" to read or write.
function isAdmin(req: NextRequest): boolean {
  return req.headers.get("x-user-role") === "admin";
}

const ACTION_KINDS = new Set(["sendTemplate", "createTask", "setFollowUp"]);

// Validate + normalise an untrusted rules payload from the admin UI. Drops
// anything malformed rather than persisting junk that runStageAutomations would
// later choke on.
function sanitizeRules(input: unknown): AutomationRule[] {
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

// GET /api/crm/automation — list all automation rules (admin only)
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const rules = await getRules();
    return NextResponse.json(rules);
  } catch (err) {
    return handleApiError("crm/automation GET", err);
  }
}

// POST /api/crm/automation — replace the full rules array (admin only).
// Body: { rules: AutomationRule[] }
export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const parsed = await parseJsonBody<{ rules?: unknown }>(req);
    if (!parsed.ok) return parsed.response;

    const rules = sanitizeRules(parsed.data.rules);
    await saveRules(rules);
    return NextResponse.json(rules);
  } catch (err) {
    return handleApiError("crm/automation POST", err);
  }
}
