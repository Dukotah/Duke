import { randomUUID } from "crypto";
import { Contact, TrackedEmail } from "./types";
import { getStore } from "./store";

const FROM = process.env.RESEND_FROM || "Copper Bay Tech <noreply@copperbaytech.com>";
// Physical address is required for CAN-SPAM compliance on outreach email.
const BIZ_ADDRESS =
  process.env.CRM_BUSINESS_ADDRESS || "Copper Bay Tech, Sonoma County, CA";

export function appUrl(): string {
  return (
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://copperbaytech.com"
  ).replace(/\/$/, "");
}

export interface OutreachTemplate {
  subject: string;
  /** Plain-text body. `{{name}}`, `{{business}}`, `{{first}}` are substituted. */
  body: string;
}

function substitute(text: string, contact: Contact): string {
  const first = contact.name?.trim().split(/\s+/)[0] || "there";
  return text
    .replace(/\{\{\s*name\s*\}\}/g, contact.name || "there")
    .replace(/\{\{\s*first\s*\}\}/g, first)
    .replace(/\{\{\s*business\s*\}\}/g, contact.business || "your business");
}

export function buildHtml(
  contact: Contact,
  template: OutreachTemplate,
  emailId: string,
): { subject: string; html: string; text: string } {
  const subject = substitute(template.subject, contact);
  const bodyText = substitute(template.body, contact);
  const base = appUrl();
  const unsubscribeUrl = `${base}/api/crm/unsubscribe?c=${contact.id}`;
  const pixelUrl = `${base}/api/crm/track/${emailId}.gif`;

  const paragraphs = bodyText
    .split(/\n{2,}/)
    .map(
      (p) =>
        `<p style="margin:0 0 16px;line-height:1.6;color:#3F3F46">${p.replace(
          /\n/g,
          "<br>",
        )}</p>`,
    )
    .join("");

  const html = `<!DOCTYPE html><html><body style="margin:0;background:#FAFAF9;padding:24px;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #18181B14;border-radius:8px;padding:28px">
    ${paragraphs}
    <hr style="border:none;border-top:1px solid #18181B14;margin:24px 0">
    <p style="margin:0;font-size:12px;color:#3F3F46AA;line-height:1.5">
      ${BIZ_ADDRESS}<br>
      You received this because you may be a fit for our services.
      <a href="${unsubscribeUrl}" style="color:#3F3F46AA">Unsubscribe</a>.
    </p>
  </div>
  <img src="${pixelUrl}" width="1" height="1" alt="" style="display:none">
</body></html>`;

  const text = `${bodyText}\n\n—\n${BIZ_ADDRESS}\nUnsubscribe: ${unsubscribeUrl}`;
  return { subject, html, text };
}

export interface SendResult {
  contactId: string;
  email: string;
  status: "sent" | "skipped" | "error";
  reason?: string;
  emailId?: string;
  providerId?: string;
}

/**
 * Send one outreach email to a contact and record it on the CRM.
 * Respects unsubscribe/suppression. In `dryRun` mode it records nothing and
 * sends nothing — it just reports what *would* happen.
 */
export async function sendOutreach(
  contact: Contact,
  template: OutreachTemplate,
  opts: { campaign?: string; dryRun: boolean },
): Promise<SendResult> {
  const base = { contactId: contact.id, email: contact.email };

  if (contact.unsubscribed || contact.status === "unsubscribed") {
    return { ...base, status: "skipped", reason: "unsubscribed" };
  }
  if (contact.status === "bounced" || contact.status === "complained") {
    return { ...base, status: "skipped", reason: contact.status };
  }

  const emailId = randomUUID();
  const { subject, html, text } = buildHtml(contact, template, emailId);

  if (opts.dryRun) {
    return { ...base, status: "skipped", reason: "dry_run", emailId };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ...base, status: "error", reason: "missing RESEND_API_KEY" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [contact.email],
        subject,
        html,
        text,
        // Tags travel back to us on every Resend webhook event, giving a
        // reliable correlation key in addition to the provider email id.
        tags: [
          { name: "crm_contact", value: contact.id },
          { name: "crm_email", value: emailId },
          ...(opts.campaign ? [{ name: "campaign", value: opts.campaign }] : []),
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { ...base, status: "error", reason: `resend ${res.status}: ${body}` };
    }

    const data = (await res.json()) as { id?: string };
    const providerId = data.id;

    const tracked: TrackedEmail = {
      id: emailId,
      providerId,
      campaign: opts.campaign,
      subject,
      sentAt: new Date().toISOString(),
      status: "sent",
      opens: 0,
      clicks: 0,
    };

    const store = getStore();
    await store.recordEmail(contact.id, tracked);
    await store.addActivity(contact.id, {
      type: "email_sent",
      detail: subject,
      meta: { emailId, providerId, campaign: opts.campaign },
    });
    await store.advanceStatus(contact.id, "contacted");

    return { ...base, status: "sent", emailId, providerId };
  } catch (err) {
    return { ...base, status: "error", reason: (err as Error).message };
  }
}
