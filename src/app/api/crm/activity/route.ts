import { NextRequest, NextResponse } from "next/server";
import { addActivity, getActivity, ActivityEntry, stampLeadAction, type LeadActionPatch } from "@/lib/db";
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

    // Mirror the durable, cross-rep action stamp (separate global hash) so every
    // rep sees what was done to this lead. Additive; must never break logging.
    try {
      const nowISO = new Date().toISOString();
      const patch: LeadActionPatch = {};
      if (type === "call") {
        patch.calledAt = nowISO;
        patch._incCall = true;
        if (outcome) { patch.lastOutcome = outcome; patch.lastOutcomeAt = nowISO; }
        // Sticky, set-once signals so cross-rep Interested/Not-interested
        // membership survives a later overwriting outcome (lastOutcome is
        // last-write-wins and unreliable for sticky tags).
        if (outcome === "interested") patch.interestedAt = nowISO;
        else if (outcome === "not_interested") patch.notInterestedAt = nowISO;
      } else if (type === "email") {
        patch.emailedAt = nowISO;
        patch._incEmail = true;
        if (outcome) { patch.lastOutcome = outcome; patch.lastOutcomeAt = nowISO; }
      } else if (type === "submitted") {
        patch.lastOutcome = "submitted";
        patch.lastOutcomeAt = nowISO;
      } else if (type === "status_change") {
        // Durable cross-rep status flip (won / not_interested). Without this,
        // a.status is never set globally and Won is only visible to the rep
        // who marked it. Sticky timestamps back the tag derivation.
        if (outcome === "won") {
          patch.status = "won";
          patch.lastOutcome = "won";
          patch.lastOutcomeAt = nowISO;
        } else if (outcome === "not_interested") {
          patch.status = "not_interested";
          patch.lastOutcome = "not_interested";
          patch.lastOutcomeAt = nowISO;
          patch.notInterestedAt = nowISO;
        }
      }
      if (Object.keys(patch).length > 0) {
        await stampLeadAction(leadId, patch, { userId, repName });
      }
    } catch (stampErr) {
      console.error("crm/activity: failed to stamp lead action", stampErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError("crm/activity POST", err);
  }
}
