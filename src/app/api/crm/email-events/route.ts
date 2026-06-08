// Resend webhook endpoint — receives email delivery events (opened, clicked,
// bounced, complained, unsubscribed) and updates the corresponding CRM lead.
//
// Register this URL in the Resend dashboard:
//   https://resend.com/webhooks → https://yourdomain.com/api/crm/email-events
//
// Set RESEND_WEBHOOK_SECRET to the signing secret Resend shows you.

import { NextRequest, NextResponse } from "next/server";
import { verifyResendSignature } from "@/lib/crm/webhook";
import { setLeadState, addActivity, suppressEmail, getLeadState, recordAbEvent } from "@/lib/db";
import { findLeadByEmail } from "@/lib/crm/leadLookup";

type ResendEvent = {
  type: string;
  data: {
    email_id?: string;
    to?: string[];
    tags?: Record<string, string>;
  };
};

export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;

  const rawBody = await req.text();

  // If a secret is configured, enforce signature verification.
  if (secret) {
    const valid = verifyResendSignature(rawBody, {
      id: req.headers.get("svix-id"),
      timestamp: req.headers.get("svix-timestamp"),
      signature: req.headers.get("svix-signature"),
    }, secret);
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let event: ResendEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, data } = event;
  const recipientEmail = data?.to?.[0];

  if (!recipientEmail) {
    return NextResponse.json({ ok: true, skipped: "no recipient" });
  }

  // Find the lead this email belongs to.
  const match = await findLeadByEmail(recipientEmail);

  // Map Resend event types to CRM status.
  const statusMap: Record<string, string> = {
    "email.opened": "opened",
    "email.clicked": "clicked",
  };

  // Terminal suppression events — add to suppression list, no matter what.
  if (type === "email.bounced" || type === "email.complained") {
    await suppressEmail(recipientEmail);
    if (match) {
      await addActivity(match.leadId, match.userId, "system", {
        type: "email",
        outcome: type === "email.bounced" ? "bounced" : "complained",
        note: `Email ${type === "email.bounced" ? "hard bounced" : "marked as spam"} — suppressed`,
      });
    }
    return NextResponse.json({ ok: true, action: "suppressed", email: recipientEmail });
  }

  if (!match) {
    return NextResponse.json({ ok: true, skipped: "lead not found in log" });
  }

  const engagement = statusMap[type]; // "opened" | "clicked" | undefined
  if (engagement) {
    // Credit the A/B subject variant this address was emailed under, if any.
    if (match.variantId && (engagement === "opened" || engagement === "clicked")) {
      await recordAbEvent(match.variantId, engagement);
    }
    // Record the engagement on the lead timeline. main's status enum has no
    // "opened"/"clicked", so we don't overwrite status with those — instead we
    // nudge an untouched ("new") lead forward to "contacted" (the outreach that
    // produced this event implies first contact) and never downgrade a richer
    // status the rep has already set.
    const existing = await getLeadState(match.userId, match.leadId);
    if (!existing || existing.status === "new") {
      await setLeadState(match.userId, match.leadId, { status: "contacted" });
    }
    await addActivity(match.leadId, match.userId, "system", {
      type: "email",
      outcome: engagement,
      note: `Email ${engagement}`,
    });
  }

  return NextResponse.json({ ok: true, type, leadId: match.leadId });
}
