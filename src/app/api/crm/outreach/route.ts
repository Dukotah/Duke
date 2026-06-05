import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { addActivity, getLeadState, setLeadState, getSuppressedEmails } from "@/lib/db";
import { unsubscribeUrl } from "@/lib/unsubscribe";
import { getSessionSecret } from "@/lib/session";
import { OUTREACH_FROM, MAILING_ADDRESS } from "@/config/site";
import {
  type OutreachLead,
  canDeliver as canDeliverGate,
  gateLeads,
  personalize,
  remainingDailyCapacity,
  resolveDailyCap,
} from "@/lib/outreach";

interface OutreachBody {
  leads: OutreachLead[];
  subject: string;
  body: string;
  fromName: string;
  // When set, this is a test send: deliver/practice exactly as usual but skip
  // all persistence (tracking, lead state, activity) and don't consume the
  // daily sending budget — so a test never mutates CRM data or warm-up cap.
  test?: boolean;
}

const MAX_PER_REQUEST = 50;
// Conservative daily cap, overridable so a freshly verified domain can be
// warmed up slowly (e.g. start at 25–50/day and ramp up over a couple weeks).
// A cold domain that suddenly blasts hundreds of emails looks like spam.
const MAX_PER_DAY = resolveDailyCap(process.env.OUTREACH_DAILY_CAP);
const FOLLOW_UP_DAYS = 3;
const SENDER = OUTREACH_FROM;

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

// Today's sending status for the signed-in rep, so the UI can show the warm-up
// ramp (how many of the daily cap are left) and whether sends go out live or
// are track-only. Read-only — never mutates the counter.
export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const redis = getRedis();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const sentToday = parseInt((await redis.get(`outreach:${userId}:${today}`) as string | null) ?? "0", 10);
  const dailyCap = MAX_PER_DAY;
  const remaining = Math.max(0, dailyCap - sentToday);
  const live = canDeliverGate(process.env.RESEND_API_KEY, process.env.OUTREACH_DOMAIN_VERIFIED);

  return NextResponse.json({ sentToday, dailyCap, remaining, live });
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
  const isTest = body.test === true;

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

  // Drop malformed addresses (they hard-bounce) and anyone who unsubscribed
  // (never re-mail them) — both count as skipped.
  const { sendable, skipped } = gateLeads(leads, await getSuppressedEmails());

  const canSend = remainingDailyCapacity(sendable.length, sentToday, MAX_PER_DAY);
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
  const secret = getSessionSecret();

  // Real delivery is gated behind explicit domain verification. Sending from a
  // domain whose SPF/DKIM/DMARC records aren't verified in Resend is the fastest
  // way to get flagged as spam and do lasting damage to its reputation — so until
  // someone confirms the domain is verified and sets OUTREACH_DOMAIN_VERIFIED=true,
  // we track every email but never actually send it.
  const domainVerified = (process.env.OUTREACH_DOMAIN_VERIFIED ?? "").trim().toLowerCase() === "true";
  const canDeliver = canDeliverGate(apiKey, process.env.OUTREACH_DOMAIN_VERIFIED);

  // Track an email regardless of whether it was actually delivered. This keeps
  // the outreach log, the lead's timeline, and the follow-up schedule accurate
  // even while the delivery integration (Resend) is still being set up.
  async function track(lead: OutreachLead, personalizedSubject: string, sentAt: string, delivered: boolean) {
    // Test sends never persist: no outreach log, no lead-state mutation, no
    // activity entry. The delivery-vs-practice path still runs as usual.
    if (isTest) return;

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
    // Personalize body & subject — replace {name}, {business}, {city}, {fromName}
    const personalizedBody = personalize(emailBody, lead, fromName);
    const personalizedSubject = personalize(subject, lead, fromName);

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
          reply_to: SENDER,
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
  // send nothing, so they shouldn't consume the daily sending budget. Test
  // sends never consume the budget either, even when delivered live.
  if (!isTest) {
    const newTotal = sentToday + delivered;
    await redis.set(dailyKey, String(newTotal), { ex: 90000 });
  }

  return NextResponse.json({ sent, delivered, failed, skipped, domainVerified });
}
