import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/db";
import { handleApiError } from "@/lib/api";

// The signed-in rep's own public profile — lets the client tailor the UI (e.g.
// hide the bulk composer / lock email editing for a restricted contractor).
// Never returns the password hash.
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const u = await getUserById(userId);
    if (!u) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { passwordHash: _omit, ...pub } = u;
    void _omit;
    return NextResponse.json({ ...pub, emailMode: u.emailMode ?? "full" });
  } catch (err) {
    return handleApiError("crm/me GET", err);
  }
}
