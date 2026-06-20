import { NextRequest, NextResponse } from "next/server";
import { parseJsonBody, handleApiError, requireAdmin } from "@/lib/api";
import { getRules, saveRules, validateRules } from "@/lib/crm/automation";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// GET /api/crm/automation — list all automation rules (admin only)
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const denied = requireAdmin(req);
    if (denied) return denied;

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
    const denied = requireAdmin(req);
    if (denied) return denied;

    const parsed = await parseJsonBody<{ rules?: unknown }>(req);
    if (!parsed.ok) return parsed.response;

    const rules = validateRules(parsed.data.rules);
    await saveRules(rules);
    return NextResponse.json(rules);
  } catch (err) {
    return handleApiError("crm/automation POST", err);
  }
}
