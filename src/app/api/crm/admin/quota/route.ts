import { NextRequest, NextResponse } from "next/server";
import { getAllQuotas, setQuota, deleteQuota } from "@/lib/db";
import { parseJsonBody, handleApiError } from "@/lib/api";

function requireAdmin(req: NextRequest) {
  const role = req.headers.get("x-user-role");
  if (role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });
  return null;
}

// GET → the full userId → Quota map (admin view).
export async function GET(req: NextRequest) {
  try {
    const denied = requireAdmin(req);
    if (denied) return denied;
    const quotas = await getAllQuotas();
    return NextResponse.json({ quotas });
  } catch (err) {
    return handleApiError("crm/admin/quota GET", err);
  }
}

// POST → set a rep's quota. { userId, callsPerWeek, dealsPerMonth }
export async function POST(req: NextRequest) {
  try {
    const denied = requireAdmin(req);
    if (denied) return denied;
    const parsed = await parseJsonBody<{ userId?: string; callsPerWeek?: number; dealsPerMonth?: number }>(req);
    if (!parsed.ok) return parsed.response;
    const { userId, callsPerWeek, dealsPerMonth } = parsed.data;
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    const quota = await setQuota(userId, {
      callsPerWeek: Number(callsPerWeek ?? 0),
      dealsPerMonth: Number(dealsPerMonth ?? 0),
    });
    return NextResponse.json({ quota });
  } catch (err) {
    return handleApiError("crm/admin/quota POST", err);
  }
}

// DELETE → clear a rep's quota. { userId }
export async function DELETE(req: NextRequest) {
  try {
    const denied = requireAdmin(req);
    if (denied) return denied;
    const parsed = await parseJsonBody<{ userId?: string }>(req);
    if (!parsed.ok) return parsed.response;
    const { userId } = parsed.data;
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    await deleteQuota(userId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError("crm/admin/quota DELETE", err);
  }
}
