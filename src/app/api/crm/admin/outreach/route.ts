import { NextRequest, NextResponse } from "next/server";
import { getAllOutreachLog, getSuppressedEmails, suppressEmail, unsuppressEmail, listUsers } from "@/lib/db";

// Basic email shape check so we don't pollute the suppression set with junk.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

// POST /api/crm/admin/outreach — manually suppress an address (admin opt-out
// on someone's behalf, e.g. they replied "unsubscribe" or asked by phone).
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { email } = await req.json();
  const clean = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!clean || !EMAIL_RE.test(clean)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  await suppressEmail(clean);
  return NextResponse.json({ ok: true, email: clean });
}

// DELETE /api/crm/admin/outreach — re-allow an unsubscribed address
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
  await unsuppressEmail(email);
  return NextResponse.json({ ok: true });
}
