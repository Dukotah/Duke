import { NextRequest, NextResponse } from "next/server";
import { getAllLeadStates, setLeadState, incrementDailyCalls, LeadState } from "@/lib/db";
import { parseJsonBody, handleApiError } from "@/lib/api";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// GET /api/crm/state — return all lead states for the current user
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const states = await getAllLeadStates(userId);
    return NextResponse.json(states);
  } catch (err) {
    return handleApiError("crm/state GET", err);
  }
}

// POST /api/crm/state — update a single lead's state
export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await parseJsonBody<{ leadId?: string } & Partial<LeadState>>(req);
    if (!parsed.ok) return parsed.response;
    const { leadId, ...patch } = parsed.data;
    if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 });

    await setLeadState(userId, leadId, patch);

    // If callCount is being incremented, track it for daily goals
    if (patch.callCount !== undefined) {
      await incrementDailyCalls(userId);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError("crm/state POST", err);
  }
}
