import { NextRequest, NextResponse } from "next/server";
import { getLeadAudit } from "@/lib/db";
import { handleApiError } from "@/lib/api";

function requireAdmin(req: NextRequest) {
  const role = req.headers.get("x-user-role");
  if (role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });
  return null;
}

// GET → recent lead-fetch audit entries (anti-exfiltration trail).
//   ?userId=<id>  → just that rep's fetches
//   (omitted)     → newest entries merged across every rep
//   ?limit=<n>    → cap rows (default 200, max 500)
export async function GET(req: NextRequest) {
  try {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const sp = req.nextUrl.searchParams;
    const userId = sp.get("userId")?.trim() || undefined;
    const limit = Math.min(500, Math.max(1, parseInt(sp.get("limit") ?? "200", 10) || 200));

    const entries = await getLeadAudit(userId, limit);
    return NextResponse.json({ entries });
  } catch (err) {
    return handleApiError("crm/admin/audit GET", err);
  }
}
