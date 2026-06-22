import { NextRequest, NextResponse } from "next/server";
import { assignLeads, getAllAssignments, getUserById } from "@/lib/db";
import { getLeads } from "@/app/api/crm/leads/route";
import { parseJsonBody, handleApiError } from "@/lib/api";

function requireAdmin(req: NextRequest) {
  const role = req.headers.get("x-user-role");
  if (role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });
  return null;
}

// POST → fetch the first N UNASSIGNED leads matching the county/niche filter and
// hand them to one rep (direct) or spread them across several (round_robin).
//   {
//     strategy: "direct" | "round_robin",
//     userId?:  string,    // required for direct
//     userIds?: string[],  // required for round_robin
//     county?:  string,    // optional filter (case-insensitive)
//     niche?:   string,    // optional filter (matches lead.category)
//     count:    number,    // how many unassigned leads to pull (1–500)
//   }
// This is the bulk counterpart to /api/crm/admin/assign: the admin doesn't have to
// hand-pick lead ids — it pulls the matching unassigned pool itself. Admin-only.
export async function POST(req: NextRequest) {
  try {
    const denied = requireAdmin(req);
    if (denied) return denied;
    const adminId = req.headers.get("x-user-id") ?? "admin";

    const parsed = await parseJsonBody<{
      strategy?: "direct" | "round_robin";
      userId?: string;
      userIds?: string[];
      county?: string;
      niche?: string;
      count?: number;
    }>(req);
    if (!parsed.ok) return parsed.response;
    const { strategy = "direct", userId, userIds, county = "", niche = "", count } = parsed.data;

    const n = Math.min(500, Math.max(1, Math.floor(Number(count) || 0)));
    if (!n) return NextResponse.json({ error: "count (1–500) required" }, { status: 400 });

    // Resolve + validate the target reps for the chosen strategy.
    let reps: { id: string; name: string }[] = [];
    if (strategy === "round_robin") {
      const ids = (userIds ?? []).filter(Boolean);
      if (ids.length === 0) {
        return NextResponse.json({ error: "userIds (non-empty array) required for round_robin" }, { status: 400 });
      }
      const resolved = await Promise.all(ids.map((id) => getUserById(id)));
      reps = resolved.filter((r): r is NonNullable<typeof r> => !!r && r.active).map((r) => ({ id: r.id, name: r.name }));
      if (reps.length === 0) return NextResponse.json({ error: "No active reps found" }, { status: 404 });
    } else {
      if (!userId) return NextResponse.json({ error: "userId required for direct" }, { status: 400 });
      const rep = await getUserById(userId);
      if (!rep || !rep.active) return NextResponse.json({ error: "Rep not found or inactive" }, { status: 404 });
      reps = [{ id: rep.id, name: rep.name }];
    }

    // Pull the matching UNASSIGNED pool. Reuse the same lead source + assignment
    // map the leads API uses, so the filter semantics line up exactly.
    const all = await getLeads();
    const assignments = await getAllAssignments();
    const countyL = county.toLowerCase();
    const nicheL = niche.toLowerCase();
    const matching = all.filter((l) => {
      if (assignments[l.id]) return false; // already owned
      if (countyL && l.county.toLowerCase() !== countyL) return false;
      if (nicheL && l.category.toLowerCase() !== nicheL) return false;
      return true;
    });
    const available = matching.length;
    const picked = matching.slice(0, n).map((l) => l.id);

    if (picked.length === 0) {
      return NextResponse.json({ ok: true, count: 0, available: 0, perRep: [] });
    }

    // Round-robin the picked ids across the reps (extras land on the first reps).
    const buckets: string[][] = reps.map(() => []);
    picked.forEach((id, i) => buckets[i % reps.length].push(id));

    let assigned = 0;
    const perRep: { userId: string; repName: string; count: number }[] = [];
    for (let i = 0; i < reps.length; i++) {
      const c = await assignLeads(buckets[i], reps[i].id, reps[i].name, adminId);
      assigned += c;
      if (c > 0) perRep.push({ userId: reps[i].id, repName: reps[i].name, count: c });
    }

    return NextResponse.json({ ok: true, count: assigned, available, perRep });
  } catch (err) {
    return handleApiError("crm/admin/bulk-assign POST", err);
  }
}
