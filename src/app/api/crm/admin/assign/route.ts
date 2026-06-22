import { NextRequest, NextResponse } from "next/server";
import {
  assignLeads, unassignLeads, getAllAssignments, getUserById,
} from "@/lib/db";
import { parseJsonBody, handleApiError } from "@/lib/api";

function requireAdmin(req: NextRequest) {
  const role = req.headers.get("x-user-role");
  if (role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });
  return null;
}

// GET → the full leadId → { userId, repName } assignment map (admin view).
export async function GET(req: NextRequest) {
  try {
    const denied = requireAdmin(req);
    if (denied) return denied;
    const assignments = await getAllAssignments();
    return NextResponse.json({ assignments });
  } catch (err) {
    return handleApiError("crm/admin/assign GET", err);
  }
}

// POST → assign or unassign a batch of leads.
//   { action: "assign", strategy: "direct",      userId,  leadIds: [...] } → give all to one rep
//   { action: "assign", strategy: "round_robin", userIds, leadIds: [...] } → distribute evenly across reps
//   { action: "unassign", leadIds: [...] }                                 → return them to the pool
// `strategy` defaults to "direct" (back-compat with the single-userId callers).
// Assignment is EXCLUSIVE: assigning a lead already owned by someone else moves it.
export async function POST(req: NextRequest) {
  try {
    const denied = requireAdmin(req);
    if (denied) return denied;
    const adminId = req.headers.get("x-user-id") ?? "admin";

    const parsed = await parseJsonBody<{
      action?: "assign" | "unassign";
      strategy?: "direct" | "round_robin";
      userId?: string;
      userIds?: string[];
      leadIds?: string[];
    }>(req);
    if (!parsed.ok) return parsed.response;
    const { action, strategy = "direct", userId, userIds, leadIds } = parsed.data;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ error: "leadIds (non-empty array) required" }, { status: 400 });
    }

    if (action === "unassign") {
      const count = await unassignLeads(leadIds);
      return NextResponse.json({ ok: true, count });
    }

    if (action === "assign") {
      // Round-robin: distribute the leadIds as evenly as possible across the reps.
      if (strategy === "round_robin") {
        const ids = (userIds ?? []).filter(Boolean);
        if (ids.length === 0) {
          return NextResponse.json({ error: "userIds (non-empty array) required for round_robin" }, { status: 400 });
        }
        // Validate every rep up front; only active reps may receive leads.
        const reps = await Promise.all(ids.map((id) => getUserById(id)));
        const valid = reps.filter((r): r is NonNullable<typeof r> => !!r && r.active);
        if (valid.length === 0) {
          return NextResponse.json({ error: "No active reps found" }, { status: 404 });
        }
        // Slice the leadIds into one bucket per rep (extra leads land on the first reps).
        const buckets: string[][] = valid.map(() => []);
        leadIds.forEach((id, i) => { if (id) buckets[i % valid.length].push(id); });
        let count = 0;
        const perRep: { userId: string; repName: string; count: number }[] = [];
        for (let i = 0; i < valid.length; i++) {
          const rep = valid[i];
          const n = await assignLeads(buckets[i], rep.id, rep.name, adminId);
          count += n;
          perRep.push({ userId: rep.id, repName: rep.name, count: n });
        }
        return NextResponse.json({ ok: true, count, strategy: "round_robin", perRep });
      }

      // Direct: all leads to one rep.
      if (!userId) return NextResponse.json({ error: "userId required to assign" }, { status: 400 });
      const rep = await getUserById(userId);
      if (!rep || !rep.active) return NextResponse.json({ error: "Rep not found or inactive" }, { status: 404 });
      const count = await assignLeads(leadIds, userId, rep.name, adminId);
      return NextResponse.json({ ok: true, count, repName: rep.name });
    }

    return NextResponse.json({ error: "action must be 'assign' or 'unassign'" }, { status: 400 });
  } catch (err) {
    return handleApiError("crm/admin/assign POST", err);
  }
}
