// Admin: A/B subject-line test results — per-variant send/open/click/reply
// tallies, so we can see which cold-email subject actually performs.

import { NextRequest, NextResponse } from "next/server";
import { getAbStats } from "@/lib/db";
import { handleApiError } from "@/lib/api";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-user-role") === "admin";
}

export async function GET(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const variants = await getAbStats();
    return NextResponse.json({ variants });
  } catch (err) {
    return handleApiError("crm/admin/ab-test GET", err);
  }
}
