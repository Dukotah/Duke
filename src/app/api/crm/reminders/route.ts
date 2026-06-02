import { NextRequest, NextResponse } from "next/server";
import { getAllLeadStates } from "@/lib/db";
import { handleApiError } from "@/lib/api";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// GET /api/crm/reminders — return leads with followUpDate <= today
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const today = new Date().toISOString().slice(0, 10);
    const states = await getAllLeadStates(userId);

    const dueToday = Object.entries(states)
      .filter(([, state]) => {
        if (!state.followUpDate) return false;
        if (state.stage === "lost" || state.stage === "won" || state.stage === "submitted") return false;
        return state.followUpDate <= today;
      })
      .map(([leadId, state]) => ({
        leadId,
        followUpDate: state.followUpDate!,
        stage: state.stage,
        lastContacted: state.lastContacted,
      }));

    return NextResponse.json({ dueToday });
  } catch (err) {
    return handleApiError("crm/reminders GET", err);
  }
}
