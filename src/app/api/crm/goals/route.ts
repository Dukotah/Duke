import { NextRequest, NextResponse } from "next/server";
import { getDailyStats, getStreak, getWeeklyCallHistory, incrementDailyCalls } from "@/lib/db";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// GET /api/crm/goals — returns dailyStats, streak, weekHistory
export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [dailyStats, streak, weekHistory] = await Promise.all([
    getDailyStats(userId),
    getStreak(userId),
    getWeeklyCallHistory(userId),
  ]);

  return NextResponse.json({ dailyStats, streak, weekHistory });
}

// POST /api/crm/goals — { action: "log_call" }
export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (body.action !== "log_call") {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  await incrementDailyCalls(userId);

  const [dailyStats, streak, weekHistory] = await Promise.all([
    getDailyStats(userId),
    getStreak(userId),
    getWeeklyCallHistory(userId),
  ]);

  return NextResponse.json({ dailyStats, streak, weekHistory });
}
