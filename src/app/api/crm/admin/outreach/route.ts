import { NextRequest, NextResponse } from "next/server";
import { getAllOutreachLog, getSuppressedEmails, unsuppressEmail, listUsers } from "@/lib/db";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-user-role") === "admin";
}

// GET /api/crm/admin/outreach — recent email sends + the unsubscribe list
export async function GET(req: NextRequest) {
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
}

// DELETE /api/crm/admin/outreach — re-allow an unsubscribed address
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
  await unsuppressEmail(email);
  return NextResponse.json({ ok: true });
}
