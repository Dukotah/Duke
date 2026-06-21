// Inbound email webhook — receives a lead's REPLY to an outreach email and
// records it on the matching CRM lead (timeline + durable "Responded" stamp).
//
// Point your inbound-email provider at this URL:
//   https://yourdomain.com/api/crm/inbound
//
// Resend Inbound (https://resend.com/docs/dashboard/emails/inbound) forwards the
// parsed message as JSON. Configure an inbound address (e.g. replies@yourdomain)
// and set OUTREACH_REPLY_TO to it so outbound sends route replies here.
//
// Auth: set CRM_INBOUND_SECRET and pass it as the `x-inbound-secret` header (or
// `?secret=` query). We fail closed — a missing secret returns 500 and a
// mismatch returns 401 — so the endpoint can never run unauthenticated.

import { NextRequest, NextResponse } from "next/server";
import { findLeadByEmail, recordInboundReply } from "@/lib/db";
import { extractSender, extractMessage, type InboundPayload } from "./parse";

export async function POST(req: NextRequest) {
  const secret = process.env.CRM_INBOUND_SECRET;
  const provided =
    req.headers.get("x-inbound-secret") ??
    req.nextUrl.searchParams.get("secret") ??
    undefined;

  // Fail closed: middleware bypasses session auth for this webhook (the provider
  // calls it server-to-server with no cookie), so the shared secret is the only
  // gate. Without it, anyone who knows the URL could inject fake replies and
  // respondedAt stamps onto leads — refuse to run until it's configured.
  if (!secret) {
    return NextResponse.json({ error: "CRM_INBOUND_SECRET not configured" }, { status: 500 });
  }
  if (provided !== secret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  let payload: InboundPayload;
  try {
    payload = (await req.json()) as InboundPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sender = extractSender(payload);
  if (!sender.email) {
    // Never error on a malformed/unparseable sender — just acknowledge.
    console.warn("[Inbound] reply with no resolvable sender address — skipped");
    return NextResponse.json({ ok: true, matched: false, skipped: "no sender" });
  }

  const match = await findLeadByEmail(sender.email);
  if (!match) {
    console.log(`[Inbound] unmatched reply from ${sender.email} — no lead in outreach log or custom leads`);
    return NextResponse.json({ ok: true, matched: false });
  }

  const msg = extractMessage(payload);
  try {
    await recordInboundReply(
      match.leadId,
      {
        fromEmail: sender.email,
        fromName: sender.name,
        subject: msg.subject,
        text: msg.text,
        html: msg.html,
        receivedAt: new Date().toISOString(),
      },
      { userId: match.userId, repName: "lead" }
    );
  } catch (err) {
    console.error(`[Inbound] failed to record reply for lead ${match.leadId}:`, err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, matched: true, leadId: match.leadId });
}
