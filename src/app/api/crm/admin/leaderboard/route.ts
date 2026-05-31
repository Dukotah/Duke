import { NextRequest, NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/db";

function isAuthenticated(req: NextRequest) {
  return !!req.headers.get("x-user-id");
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const leaderboard = await getLeaderboard();
  return NextResponse.json({ leaderboard });
}
