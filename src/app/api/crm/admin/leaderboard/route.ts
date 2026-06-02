import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/db";
import { handleApiError } from "@/lib/api";

function isAuthenticated(req: NextRequest) {
  return !!req.headers.get("x-user-id");
}

export async function GET(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const leaderboard = await getLeaderboard();
    return NextResponse.json({ leaderboard });
  } catch (err) {
    return handleApiError("crm/admin/leaderboard GET", err);
  }
}
