import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/db";
import { handleApiError, requireAdmin } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const denied = requireAdmin(req);
    if (denied) return denied;
    const leaderboard = await getLeaderboard();
    return NextResponse.json({ leaderboard });
  } catch (err) {
    return handleApiError("crm/admin/leaderboard GET", err);
  }
}
