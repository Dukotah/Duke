import { NextRequest, NextResponse } from "next/server";
import { listSubmissions } from "@/lib/db";
import { handleApiError } from "@/lib/api";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-user-role") === "admin";
}

const TIER_A_VALUE = 2500;
const TIER_B_VALUE = 1800;

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let allSubs;
  try {
    allSubs = await listSubmissions();
  } catch (err) {
    return handleApiError("crm/admin/revenue GET", err);
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const thisMonthSubs = allSubs.filter((s) => {
    const d = new Date(s.submittedAt);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const accepted = allSubs.filter((s) => s.status === "accepted");
  const acceptedThisMonth = thisMonthSubs.filter((s) => s.status === "accepted");

  const thisMonthRevenue = acceptedThisMonth.reduce((sum, s) => sum + (s.dealValue ?? 0), 0);
  const thisMonthCommissions = acceptedThisMonth.reduce((sum, s) => sum + (s.commissionAmount ?? 0), 0);
  const allTimeRevenue = accepted.reduce((sum, s) => sum + (s.dealValue ?? 0), 0);
  const allTimeCommissions = accepted.reduce((sum, s) => sum + (s.commissionAmount ?? 0), 0);

  // Pipeline counts
  const pendingSubs = allSubs.filter((s) => s.status === "pending");
  const projectedValue = pendingSubs.reduce((sum, s) => {
    const val = s.leadTier === "A" ? TIER_A_VALUE : s.leadTier === "B" ? TIER_B_VALUE : 1500;
    return sum + val;
  }, 0);

  // Monthly trend — last 6 months
  const monthlyTrend = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(year, month - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth();
    const monthSubs = allSubs.filter((s) => {
      const sd = new Date(s.submittedAt);
      return sd.getFullYear() === y && sd.getMonth() === m && s.status === "accepted";
    });
    const revenue = monthSubs.reduce((sum, s) => sum + (s.dealValue ?? 0), 0);
    monthlyTrend.push({
      month: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      revenue,
      deals: monthSubs.length,
    });
  }

  return NextResponse.json({
    thisMonth: {
      deals: acceptedThisMonth.length,
      revenue: thisMonthRevenue,
      commissions: thisMonthCommissions,
    },
    allTime: {
      deals: accepted.length,
      revenue: allTimeRevenue,
      commissions: allTimeCommissions,
    },
    pipeline: {
      interested: 0, // would need lead state aggregation; placeholder
      submitted: pendingSubs.length,
      projectedValue,
    },
    monthlyTrend,
    dealsThisMonth: acceptedThisMonth,
  });
}
