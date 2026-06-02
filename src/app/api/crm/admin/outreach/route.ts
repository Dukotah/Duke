import { NextRequest, NextResponse } from "next/server";
import { getAllOutreachLog, getSuppressedEmails, unsuppressEmail, listUsers } from "@/lib/db";
import { parseJsonBody, handleApiError } from "@/lib/api";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-user-role") === "admin";
}

// GET /api/crm/admin/outreach — recent email sends + the unsubscribe list
export async function GET(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [log, suppressed, users] = await Promise.all([
      getAllOutreachLog(250),
      getSuppressedEmails(),
      listUsers(),
    ]);

    // Map sender userId → display name (real users + the quick-access accounts).
    const nameMap: Record<string, string> = {
      "admin-dev": "Duke (admin)",
      "rep-dev": "Rep (quick access)",
    };
    for (const u of users) nameMap[u.id] = u.name;

    const entries = log.map((e) => ({ ...e, repName: nameMap[e.userId] ?? e.userId }));

    return NextResponse.json({
      entries,
      suppressed,
      totalSent: entries.length,
      suppressedCount: suppressed.length,
    });
  } catch (err) {
    return handleApiError("crm/admin/outreach GET", err);
  }
}

// DELETE /api/crm/admin/outreach — re-allow an unsubscribed address
export async function DELETE(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const parsed = await parseJsonBody<{ email?: string }>(req);
    if (!parsed.ok) return parsed.response;
    const { email } = parsed.data;
    if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
    await unsuppressEmail(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError("crm/admin/outreach DELETE", err);
  }
}
