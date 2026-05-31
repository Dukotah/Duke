import { NextRequest, NextResponse } from "next/server";
import { getAllLeadStates, setLeadState, incrementDailyCalls } from "@/lib/db";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// GET /api/crm/state — return all lead states for the current user
export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const states = await getAllLeadStates(userId);
  return NextResponse.json(states);
}

// POST /api/crm/state — update a single lead's state
export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { leadId, ...patch } = await req.json();
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 });

  await setLeadState(userId, leadId, patch);

  // If callCount is being incremented, track it for daily goals
  if (patch.callCount !== undefined) {
    await incrementDailyCalls(userId);
  }

  return NextResponse.json({ ok: true });
}
