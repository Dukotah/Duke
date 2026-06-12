import { NextRequest, NextResponse } from "next/server";
import { getAllLeadStates, getCustomLeads } from "@/lib/db";
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
    const [states, customs] = await Promise.all([
      getAllLeadStates(userId),
      getCustomLeads(userId),
    ]);
    // Custom (manually-added/inbound) leads aren't in the scored CSV feed, so the
    // client can't always resolve their names. Resolve them HERE so a due card
    // never shows a raw "custom:<uuid>" id again.
    const customById = new Map(customs.map((c) => [`custom:${c.id}`, c]));

    const dueToday = Object.entries(states)
      .filter(([, state]) => {
        if (!state.followUpDate) return false;
        if (state.stage === "lost" || state.stage === "won" || state.stage === "submitted") return false;
        return state.followUpDate <= today;
      })
      .map(([leadId, state]) => {
        const c = customById.get(leadId);
        return {
          leadId,
          followUpDate: state.followUpDate!,
          stage: state.stage,
          lastContacted: state.lastContacted,
          ...(c
            ? { name: c.name, city: c.city, phone: c.phone, email: c.email, category: c.niche || "custom" }
            : {}),
        };
      });

    return NextResponse.json({ dueToday });
  } catch (err) {
    return handleApiError("crm/reminders GET", err);
  }
}
