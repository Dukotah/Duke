import { NextRequest, NextResponse } from "next/server";
import { listSubmissions, resolveSubmission, markCommissionPaid, getRepStats, listUsers, getUserLeadCount } from "@/lib/db";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-user-role") === "admin";
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const filter = req.nextUrl.searchParams.get("filter") as "pending" | "accepted" | "rejected" | null;
  const subs = await listSubmissions(filter ?? undefined);

  // Also return per-rep stats for admin overview
  const users = await listUsers();
  const repStats = await Promise.all(
    users.filter((u) => u.role === "rep").map(async (u) => ({
      ...u,
      stats: await getRepStats(u.id),
      leadsWorked: await getUserLeadCount(u.id),
    }))
  );

  return NextResponse.json({ submissions: subs, repStats });
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, action, dealValue } = await req.json();
  if (!id || !action) return NextResponse.json({ error: "id and action required" }, { status: 400 });

  if (action === "accept" || action === "reject") {
    const updated = await resolveSubmission(id, action === "accept" ? "accepted" : "rejected", dealValue);
    return NextResponse.json(updated);
  }
  if (action === "markPaid") {
    await markCommissionPaid(id);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
