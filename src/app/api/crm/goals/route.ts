import { NextRequest, NextResponse } from "next/server";
import { getDailyStats, getStreak, getWeeklyCallHistory, incrementDailyCalls } from "@/lib/db";
import { parseJsonBody, handleApiError } from "@/lib/api";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// GET /api/crm/goals — returns dailyStats, streak, weekHistory
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [dailyStats, streak, weekHistory] = await Promise.all([
      getDailyStats(userId),
      getStreak(userId),
      getWeeklyCallHistory(userId),
    ]);

    return NextResponse.json({ dailyStats, streak, weekHistory });
  } catch (err) {
    return handleApiError("crm/goals GET", err);
  }
}

// POST /api/crm/goals — { action: "log_call" }
export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await parseJsonBody<{ action?: string }>(req);
    if (!parsed.ok) return parsed.response;
    if (parsed.data.action !== "log_call") {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    await incrementDailyCalls(userId);

    const [dailyStats, streak, weekHistory] = await Promise.all([
      getDailyStats(userId),
      getStreak(userId),
      getWeeklyCallHistory(userId),
    ]);

    return NextResponse.json({ dailyStats, streak, weekHistory });
  } catch (err) {
    return handleApiError("crm/goals POST", err);
  }
}
