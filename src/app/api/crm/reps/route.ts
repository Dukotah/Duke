import { NextRequest, NextResponse } from "next/server";
import { listUsers } from "@/lib/db";
import { handleApiError } from "@/lib/api";

// GET → active reps as { id, name } for any signed-in user. Used by the rep
// lead-handoff control to pick a teammate. Deliberately exposes ONLY id + name
// (no email/role/commission) so it is safe for non-admins, unlike
// /api/crm/admin/users which is admin-gated and returns the full user record.
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const users = await listUsers();
    const reps = users
      .filter((u) => u.role === "rep" && u.active)
      .map((u) => ({ id: u.id, name: u.name }));
    return NextResponse.json({ reps });
  } catch (err) {
    return handleApiError("crm/reps GET", err);
  }
}
