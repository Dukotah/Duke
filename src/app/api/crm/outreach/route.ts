import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { addActivity, getLeadState, setLeadState, getSuppressedEmails } from "@/lib/db";
import { unsubscribeUrl } from "@/lib/unsubscribe";
import { OUTREACH_FROM, OUTREACH_REPLY_TO, MAILING_ADDRESS } from "@/config/site";

interface OutreachLead {
  id: string;
  name: string;
  email: string;
  city: string;
}

interface OutreachBody {
  leads: OutreachLead[];
  subject: string;
  body: string;
  fromName: string;
}

const MAX_PER_REQUEST = 50;
// Conservative daily cap, overridable so a freshly verified domain can be
// warmed up slowly (e.g. start at 25–50/day and ramp up over a couple weeks).
// A cold domain that suddenly blasts hundreds of emails looks like spam.
const MAX_PER_DAY = (() => {
  const n = parseInt(process.env.OUTREACH_DAILY_CAP ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : 200;
})();
const FOLLOW_UP_DAYS = 3;
const SENDER = OUTREACH_FROM;       // send-only subdomain address
const REPLY_TO = OUTREACH_REPLY_TO; // real monitored inbox on the main domain

// Basic shape check to avoid sending to obviously malformed addresses.
// Hard bounces are one of the strongest signals that flags a sender as spam.
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

// CAN-SPAM compliant footer + a plain-text opt-out link recipients can click.
function buildFooter(unsubUrl: string): string {
  return `\n\n\nYou're receiving this because we work with local businesses in your area.` +
    `\nNot interested? Unsubscribe here: ${unsubUrl}` +
    `\n${MAILING_ADDRESS}`;
}

export async function POST(req: NextRequest) {
  const userId: string | null = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Narrowed copy so closures below keep the non-null type.
  const senderId: string = userId;
  const repName = req.headers.get("x-user-name") ?? "";

  let body: OutreachBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { leads, subject, body: emailBody, fromName } = body;

  if (!leads || !Array.isArray(leads) || leads.length === 0) {
    return NextResponse.json({ error: "leads array is required" }, { status: 400 });
  }
  if (!subject || !emailBody || !fromName) {
    return NextResponse.json({ error: "subject, body, and fromName are required" }, { status: 400 });
  }
  if (leads.length > MAX_PER_REQUEST) {
    return NextResponse.json({ error: `Max ${MAX_PER_REQUEST} leads per request` }, { status: 400 });
  }

  const redis = getRedis();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const dailyKey = `outreach:${userId}:${today}`;

  // Check daily limit
  const sentToday = parseInt((await redis.get(dailyKey) as string | null) ?? "0", 10);
  // Only well-formed addresses are eligible — malformed ones would hard-bounce.
  const leadsWithEmail = leads.filter((l) => l.email && isValidEmail(l.email));

  // Never email anyone who has unsubscribed — count them as skipped.
  const suppressed = new Set(await getSuppressedEmails());
  const sendable = leadsWithEmail.filter((l) => !suppressed.has(l.email.toLowerCase().trim()));
  const skipped = leads.length - sendable.length;

  const canSend = Math.min(sendable.length, MAX_PER_DAY - sentToday);
  if (canSend <= 0) {
    return NextResponse.json({
      error: `Daily outreach limit of ${MAX_PER_DAY} reached`,
      sent: 0,
      failed: 0,
      skipped,
    }, { status: 429 });
  }

  const toSend = sendable.slice(0, canSend);
  const apiKey = process.env.RESEND_API_KEY;
  const secret = process.env.SESSION_SECRET ?? "dev-secret-change-in-production";

  // Real delivery is gated behind explicit domain verification. Sending from a
  // domain whose SPF/DKIM/DMARC records aren't verified in Resend is the fastest
  // way to get flagged as spam and do lasting damage to its reputation — so until
  // someone confirms the domain is verified and sets OUTREACH_DOMAIN_VERIFIED=true,
  // we track every email but never actually send it.
  const domainVerified = (process.env.OUTREACH_DOMAIN_VERIFIED ?? "").trim().toLowerCase() === "true";
  const canDeliver = Boolean(apiKey) && domainVerified;

  // Track an email regardless of whether it was actually delivered. This keeps
  // the outreach log, the lead's timeline, and the follow-up schedule accurate
  // even while the delivery integration (Resend) is still being set up.
  async function track(lead: OutreachLead, personalizedSubject: string, sentAt: string, delivered: boolean) {
    const logEntry = JSON.stringify({
      leadId: lead.id,
      leadName: lead.name,
      email: lead.email,
      subject: personalizedSubject,
      sentAt,
      delivered,
    });
    await redis.lpush(`outreach_log:${senderId}`, logEntry);
    await redis.ltrim(`outreach_log:${senderId}`, 0, 199);

    await addActivity(lead.id, senderId, repName, {
      type: "email",
      outcome: delivered ? "sent" : "logged",
      note: personalizedSubject,
    });

    // Don't disturb leads that are already won or written off.
    const existing = await getLeadState(senderId, lead.id);
    const terminal =
      existing?.status === "won" ||
      existing?.status === "not_interested" ||
      ["won", "lost", "submitted"].includes(existing?.stage ?? "");
    if (!terminal) {
      await setLeadState(senderId, lead.id, {
        status: "contacted",
        stage: "contacted",
        lastContacted: sentAt,
        followUpDate: addDays(FOLLOW_UP_DAYS),
      });
    }
  }

  let sent = 0;      // emails tracked (logged or delivered)
  let delivered = 0; // subset actually delivered via Resend
  let failed = 0;

  for (const lead of toSend) {
    // Personalize body — replace {name}, {business}, {city}, {fromName}
    const personalizedBody = emailBody
      .replace(/\{name\}/gi, lead.name)
      .replace(/\{business\}/gi, lead.name)
      .replace(/\{city\}/gi, lead.city)
      .replace(/\{fromName\}/gi, fromName);

    const personalizedSubject = subject
      .replace(/\{name\}/gi, lead.name)
      .replace(/\{business\}/gi, lead.name)
      .replace(/\{city\}/gi, lead.city)
      .replace(/\{fromName\}/gi, fromName);

    const sentAt = new Date().toISOString();

    if (!canDeliver) {
      // Track-only mode. Either no Resend key, or the domain isn't verified yet —
      // in both cases we deliberately don't send, to protect domain reputation.
      const reason = !apiKey ? "no RESEND_API_KEY" : "domain not verified (set OUTREACH_DOMAIN_VERIFIED=true once verified)";
      console.log(`[Outreach] Track-only (${reason}) — ${lead.email}: ${personalizedSubject}`);
      try {
        await track(lead, personalizedSubject, sentAt, false);
        sent++;
      } catch (logErr) {
        failed++;
        console.error(`[Outreach] Failed to track email to ${lead.email}:`, logErr);
      }
      continue;
    }

    const unsubUrl = await unsubscribeUrl(lead.email, secret);

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${fromName} via Copper Bay Tech <${SENDER}>`,
          reply_to: REPLY_TO,
          to: [lead.email],
          subject: personalizedSubject,
          text: personalizedBody + buildFooter(unsubUrl),
          // RFC 8058 one-click unsubscribe — required by Gmail/Yahoo bulk
          // sender rules and a major signal against being marked as spam.
          headers: {
            "List-Unsubscribe": `<${unsubUrl}>, <mailto:${SENDER}?subject=unsubscribe>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        }),
      });

      if (res.ok) {
        sent++;
        delivered++;
        // Close the loop: record on the lead's timeline and schedule a follow-up.
        // Failures here must not flip a successful send into a "failed".
        try {
          await track(lead, personalizedSubject, sentAt, true);
        } catch (logErr) {
          console.error(`[Outreach] Delivered to ${lead.email} but failed to log activity/follow-up:`, logErr);
        }
      } else {
        failed++;
        const errText = await res.text();
        console.error(`[Outreach] Failed to send to ${lead.email}:`, res.status, errText);
      }
    } catch (err) {
      failed++;
      console.error(`[Outreach] Exception sending to ${lead.email}:`, err);
    }
  }

  // Only actual deliveries count toward the warm-up cap — track-only emails
  // send nothing, so they shouldn't consume the daily sending budget.
  const newTotal = sentToday + delivered;
  await redis.set(dailyKey, String(newTotal), { ex: 90000 });

  return NextResponse.json({ sent, delivered, failed, skipped, domainVerified });
}
