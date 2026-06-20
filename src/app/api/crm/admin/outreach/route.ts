import { NextRequest, NextResponse } from "next/server";
import { getAllOutreachLog, getSuppressedEmails, suppressEmail, unsuppressEmail, listUsers } from "@/lib/db";
import { parseJsonBody, handleApiError, requireAdmin } from "@/lib/api";

// Basic email shape check so we don't pollute the suppression set with junk.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET /api/crm/admin/outreach — recent email sends + the unsubscribe list
export async function GET(req: NextRequest) {
  try {
    const denied = requireAdmin(req);
    if (denied) return denied;

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

// POST /api/crm/admin/outreach — manually suppress an address (admin opt-out
// on someone's behalf, e.g. they replied "unsubscribe" or asked by phone).
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
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
  try {
    const denied = requireAdmin(req);
    if (denied) return denied;
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
