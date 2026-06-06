// Resend webhook endpoint — receives email delivery events (opened, clicked,
// bounced, complained, unsubscribed) and updates the corresponding CRM lead.
//
// Register this URL in the Resend dashboard:
//   https://resend.com/webhooks → https://yourdomain.com/api/crm/email-events
//
// Set RESEND_WEBHOOK_SECRET to the signing secret Resend shows you.

import { NextRequest, NextResponse } from "next/server";
import { verifyResendSignature } from "@/lib/crm/webhook";
import { getRedis } from "@/lib/redis";
import { setLeadState, addActivity, suppressEmail } from "@/lib/db";

type ResendEvent = {
  type: string;
  data: {
    email_id?: string;
    to?: string[];
    tags?: Record<string, string>;
  };
};

// Status advancement table — never downgrade.
const STATUS_ORDER = ["new", "contacted", "opened", "clicked", "replied"];
function advanceStatus(current: string | undefined, next: string): string {
  const ci = STATUS_ORDER.indexOf(current ?? "new");
  const ni = STATUS_ORDER.indexOf(next);
  return ni > ci ? next : (current ?? "new");
}

// Resolve (userId, leadId) from the outreach log by matching the recipient email.
// The outreach log key is `outreach_log:<userId>` and entries are JSON strings.
async function findLeadByEmail(email: string): Promise<{ userId: string; leadId: string; leadName: string } | null> {
  const redis = getRedis();
  const keys = await redis.keys("outreach_log:*");
  const norm = email.toLowerCase().trim();
  for (const key of keys as string[]) {
    const userId = (key as string).replace("outreach_log:", "");
    const items = await redis.lrange(key as string, 0, -1) as unknown[];
    for (const raw of items) {
      try {
        const entry = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (typeof entry.email === "string" && entry.email.toLowerCase().trim() === norm) {
          return { userId, leadId: entry.leadId, leadName: entry.leadName ?? "" };
        }
      } catch {}
    }
  }
  return null;
}

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

  const nextStatus = statusMap[type];
  if (nextStatus) {
    const existing = await import("@/lib/db").then((m) => m.getLeadState(match.userId, match.leadId));
    const advanced = advanceStatus(existing?.status, nextStatus);
    if (advanced !== existing?.status) {
      await setLeadState(match.userId, match.leadId, { status: advanced as Parameters<typeof setLeadState>[2]["status"] });
      await addActivity(match.leadId, match.userId, "system", {
        type: "email",
        outcome: nextStatus,
        note: `Email ${nextStatus}`,
      });
    }
  }

  return NextResponse.json({ ok: true, type, leadId: match.leadId });
}
