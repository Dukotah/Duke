import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/crm/store";
import { verifyResendSignature } from "@/lib/crm/webhook";
import {
  Contact,
  ContactStatus,
  ActivityType,
  EmailStatus,
  TrackedEmail,
} from "@/lib/crm/types";

export const runtime = "nodejs";

// Maps a Resend event type onto the CRM status it advances a contact to,
// the activity it logs, and the tracked-email status it sets.
const EVENT_MAP: Record<
  string,
  { status?: ContactStatus; activity: ActivityType; emailStatus?: EmailStatus }
> = {
  "email.delivered": { activity: "email_delivered", emailStatus: "delivered" },
  "email.opened": {
    status: "opened",
    activity: "email_opened",
    emailStatus: "opened",
  },
  "email.clicked": {
    status: "clicked",
    activity: "email_clicked",
    emailStatus: "clicked",
  },
  "email.bounced": {
    status: "bounced",
    activity: "email_bounced",
    emailStatus: "bounced",
  },
  "email.complained": {
    status: "complained",
    activity: "email_complained",
    emailStatus: "complained",
  },
};

type TagBag = Record<string, string> | { name: string; value: string }[] | undefined;

function readTag(tags: TagBag, key: string): string | undefined {
  if (!tags) return undefined;
  if (Array.isArray(tags)) return tags.find((t) => t.name === key)?.value;
  return tags[key];
}

// POST /api/crm/webhook — Resend delivery/engagement events.
export async function POST(req: NextRequest) {
  const raw = await req.text();

  // Verify the Svix signature when a secret is configured. If none is set we
  // accept (useful for local testing) but log a warning.
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (secret) {
    const ok = verifyResendSignature(
      raw,
      {
        id: req.headers.get("svix-id"),
        timestamp: req.headers.get("svix-timestamp"),
        signature: req.headers.get("svix-signature"),
      },
      secret,
    );
    if (!ok) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } else {
    console.warn("RESEND_WEBHOOK_SECRET not set — accepting unsigned webhook");
  }

  let event: { type?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const mapping = event.type ? EVENT_MAP[event.type] : undefined;
  // Acknowledge anything we don't act on so Resend doesn't retry.
  if (!mapping || !event.data) return NextResponse.json({ ok: true });

  const data = event.data;
  const providerId = (data.email_id as string) || undefined;
  const tags = data.tags as TagBag;
  const emailId = readTag(tags, "crm_email");
  const contactId = readTag(tags, "crm_contact");

  const store = getStore();

  // Resolve the contact: prefer correlation tags, fall back to provider id,
  // then to the recipient address.
  let contact: Contact | null = null;
  if (contactId) contact = await store.getContact(contactId);
  if (!contact && emailId) contact = await store.getContactByEmailId(emailId);
  if (!contact && providerId)
    contact = await store.getContactByProviderId(providerId);
  if (!contact) {
    const to = Array.isArray(data.to) ? (data.to[0] as string) : (data.to as string);
    if (to) contact = await store.getContactByEmail(to);
  }
  if (!contact) return NextResponse.json({ ok: true });

  // Update the specific tracked email (counts + status).
  const targetEmail =
    contact.emails.find((e) => e.id === emailId) ??
    contact.emails.find((e) => e.providerId === providerId);
  if (targetEmail && mapping.emailStatus) {
    const patch: Partial<TrackedEmail> = { lastEventAt: new Date().toISOString() };
    if (event.type === "email.opened") patch.opens = targetEmail.opens + 1;
    if (event.type === "email.clicked") patch.clicks = targetEmail.clicks + 1;
    // Don't downgrade an already-clicked email back to merely opened/delivered.
    const rank: Record<EmailStatus, number> = {
      sent: 0,
      delivered: 1,
      opened: 2,
      clicked: 3,
      bounced: 4,
      complained: 4,
    };
    if (rank[mapping.emailStatus] >= rank[targetEmail.status]) {
      patch.status = mapping.emailStatus;
    }
    await store.updateEmail(targetEmail.id, patch);
  }

  await store.addActivity(contact.id, {
    type: mapping.activity,
    detail: (data.subject as string) || undefined,
    meta: { providerId, emailId },
  });
  if (mapping.status) await store.advanceStatus(contact.id, mapping.status);

  return NextResponse.json({ ok: true });
}
