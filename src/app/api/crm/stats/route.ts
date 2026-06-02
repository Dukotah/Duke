import { NextResponse } from "next/server";
import { getStats, getRepStats } from "@/lib/crm/store";

// GET /api/crm/stats — aggregate metrics + per-rep leaderboard for the live
// performance bar and the admin dashboard.
export async function GET() {
  return NextResponse.json({ stats: getStats(), reps: getRepStats() });
}
