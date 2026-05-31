import { NextRequest, NextResponse } from "next/server";
import { getLeadClaim, claimLead, unclaimLead } from "@/lib/db";

export async function GET(req: NextRequest) {
  const leadId = req.nextUrl.searchParams.get("leadId");
  if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 });
  const claim = await getLeadClaim(leadId);
  return NextResponse.json({ claim });
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  const userName = req.headers.get("x-user-name") ?? "Unknown";
  const userRole = req.headers.get("x-user-role");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { leadId, action } = body as { leadId: string; action: "claim" | "unclaim" };
  if (!leadId || !action) return NextResponse.json({ error: "leadId and action required" }, { status: 400 });

  if (action === "claim") {
    const existing = await getLeadClaim(leadId);
    if (existing && existing.userId !== userId) {
      if (userRole !== "admin") {
        return NextResponse.json({ error: `Already claimed by ${existing.repName}` }, { status: 409 });
      }
    }
    const claim = await claimLead(leadId, userId, userName);
    return NextResponse.json({ claim });
  }

  if (action === "unclaim") {
    const existing = await getLeadClaim(leadId);
    if (existing && existing.userId !== userId && userRole !== "admin") {
      return NextResponse.json({ error: "Can only unclaim your own leads" }, { status: 403 });
    }
    if (existing) {
      await unclaimLead(leadId, existing.userId);
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
