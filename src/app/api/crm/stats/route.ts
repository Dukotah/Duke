import { NextResponse } from "next/server";
import { getStats, getRepStats } from "@/lib/crm/store";

// GET /api/crm/stats — aggregate metrics + per-rep leaderboard for the live
// performance bar and the admin dashboard.
export async function GET() {
  const [stats, reps] = await Promise.all([getStats(), getRepStats()]);
  return NextResponse.json({ stats, reps });
}
