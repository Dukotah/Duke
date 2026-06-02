import { NextRequest, NextResponse } from "next/server";
import { addActivity, getActivity, ActivityEntry } from "@/lib/db";
import { parseJsonBody, handleApiError } from "@/lib/api";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

function getUserName(req: NextRequest): string {
  return req.headers.get("x-user-name") ?? "Unknown";
}

// GET /api/crm/activity?leadId=xxx
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const leadId = req.nextUrl.searchParams.get("leadId");
    if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 });

    const activity = await getActivity(leadId);
    return NextResponse.json(activity);
  } catch (err) {
    return handleApiError("crm/activity GET", err);
  }
}

// POST /api/crm/activity — { leadId, type, outcome?, note? }
export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const repName = getUserName(req);

    const parsed = await parseJsonBody<{ leadId?: string; type?: ActivityEntry["type"]; outcome?: string; note?: string }>(req);
    if (!parsed.ok) return parsed.response;
    const { leadId, type, outcome, note } = parsed.data;
    if (!leadId || !type) return NextResponse.json({ error: "leadId and type required" }, { status: 400 });

    await addActivity(leadId, userId, repName, { type, outcome, note });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError("crm/activity POST", err);
  }
}
