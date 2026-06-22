import { NextRequest, NextResponse } from "next/server";
import {
  getCommissionTiers,
  setCommissionTiers,
  DEFAULT_COMMISSION_TIERS,
  type CommissionTier,
} from "@/lib/db";
import { parseJsonBody, handleApiError } from "@/lib/api";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-user-role") === "admin";
}

// GET — return the configured commission tiers (or null) plus the built-in
// default, so the admin UI / ResolveModal can preview the tiered commission and
// know whether an override is active.
export async function GET(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const commissionTiers = await getCommissionTiers();
    return NextResponse.json({
      commissionTiers,
      defaultCommissionTiers: DEFAULT_COMMISSION_TIERS,
    });
  } catch (err) {
    return handleApiError("crm/admin/settings GET", err);
  }
}

// PATCH — set or clear the commission-tier override. Body:
//   { commissionTiers: CommissionTier[] }  → set (invalid/empty clears it)
//   { commissionTiers: null }              → clear (flat per-rep rate applies)
export async function PATCH(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const parsed = await parseJsonBody<{ commissionTiers?: CommissionTier[] | null }>(req);
    if (!parsed.ok) return parsed.response;
    const saved = await setCommissionTiers(parsed.data.commissionTiers ?? null);
    return NextResponse.json({ commissionTiers: saved });
  } catch (err) {
    return handleApiError("crm/admin/settings PATCH", err);
  }
}
