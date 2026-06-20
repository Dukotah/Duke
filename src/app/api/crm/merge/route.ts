import { NextRequest, NextResponse } from "next/server";
import { parseJsonBody, handleApiError, requireAdmin } from "@/lib/api";
import { mergeLeads } from "@/lib/crm/merge";

// POST /api/crm/merge — { survivorId, loserId }. Re-points the loser custom
// lead's state/activity/actions/claims/submissions onto the survivor, then
// removes the loser. Admin-gated (destructive / data-integrity sensitive).
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const denied = requireAdmin(req);
    if (denied) return denied;

    const parsed = await parseJsonBody<{ survivorId?: string; loserId?: string }>(req);
    if (!parsed.ok) return parsed.response;
    const { survivorId, loserId } = parsed.data;
    if (!survivorId || !loserId) {
      return NextResponse.json({ error: "survivorId and loserId are required" }, { status: 400 });
    }

    const result = await mergeLeads(survivorId, loserId);
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (err) {
    return handleApiError("crm/merge POST", err);
  }
}
