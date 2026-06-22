import { NextRequest, NextResponse } from "next/server";
import {
  assignLead, getLeadAssignment, getUserById, addActivity,
} from "@/lib/db";
import { parseJsonBody, handleApiError } from "@/lib/api";

// POST → rep-to-rep lead handoff. { leadId, toUserId, note? }
//
// Unlike /api/crm/admin/assign (admin-only, can move any lead), this lets a REP
// hand off a lead they CURRENTLY OWN to another active rep. The server verifies
// ownership from the durable assignment record (never the body) before moving it
// with assignLead (which is exclusive and removes it from the old owner's set).
// Admins may hand off any lead. A short note is dropped on the lead timeline so
// the receiving rep sees the context.
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const role = req.headers.get("x-user-role");
    const repName = req.headers.get("x-user-name") ?? "A rep";
    const isAdmin = role === "admin";

    const parsed = await parseJsonBody<{ leadId?: string; toUserId?: string; note?: string }>(req);
    if (!parsed.ok) return parsed.response;
    const { leadId, toUserId, note } = parsed.data;
    if (!leadId || !toUserId) {
      return NextResponse.json({ error: "leadId and toUserId required" }, { status: 400 });
    }
    if (toUserId === userId) {
      return NextResponse.json({ error: "Cannot hand a lead off to yourself" }, { status: 400 });
    }

    // Ownership gate: a non-admin may only hand off a lead they currently own.
    const current = await getLeadAssignment(leadId);
    if (!isAdmin && (!current || current.userId !== userId)) {
      return NextResponse.json({ error: "You don't own this lead" }, { status: 403 });
    }

    // The receiving rep must exist and be active.
    const toRep = await getUserById(toUserId);
    if (!toRep || !toRep.active || toRep.role !== "rep") {
      return NextResponse.json({ error: "Recipient rep not found or inactive" }, { status: 404 });
    }

    // Move ownership (exclusive — strips it from the prior owner's set).
    const assignment = await assignLead(leadId, toUserId, toRep.name, userId);

    // Timeline note so the receiving rep has context. Additive — never block the
    // handoff if the timeline write fails.
    try {
      const trimmed = (note ?? "").trim();
      await addActivity(leadId, userId, repName, {
        type: "note",
        note: `Lead handed off to ${toRep.name}${trimmed ? ` — ${trimmed}` : ""}`,
      });
    } catch (noteErr) {
      console.error("crm/handoff: failed to record handoff note", noteErr);
    }

    return NextResponse.json({ ok: true, assignment });
  } catch (err) {
    return handleApiError("crm/handoff POST", err);
  }
}
