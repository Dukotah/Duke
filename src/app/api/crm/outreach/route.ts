import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { addActivity, getLeadState, setLeadState } from "@/lib/db";

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
const MAX_PER_DAY = 200;
const FOLLOW_UP_DAYS = 3;
const SENDER = "contact@copperbaytech.com";

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  const leadsWithEmail = leads.filter((l) => l.email && l.email.trim());
  const skipped = leads.length - leadsWithEmail.length;

  const canSend = Math.min(leadsWithEmail.length, MAX_PER_DAY - sentToday);
  if (canSend <= 0) {
    return NextResponse.json({
      error: `Daily outreach limit of ${MAX_PER_DAY} reached`,
      sent: 0,
      failed: 0,
      skipped,
    }, { status: 429 });
  }

  const toSend = leadsWithEmail.slice(0, canSend);
  const apiKey = process.env.RESEND_API_KEY;

  let sent = 0;
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

    if (!apiKey) {
      console.log(`[Outreach] No RESEND_API_KEY — would send to ${lead.email}: ${personalizedSubject}`);
      sent++;
      continue;
    }

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
          text: personalizedBody,
        }),
      });

      if (res.ok) {
        sent++;
        const sentAt = new Date().toISOString();
        // Log to Redis (capped list)
        const logEntry = JSON.stringify({
          leadId: lead.id,
          leadName: lead.name,
          email: lead.email,
          subject: personalizedSubject,
          sentAt,
        });
        await redis.lpush(`outreach_log:${userId}`, logEntry);
        await redis.ltrim(`outreach_log:${userId}`, 0, 199);

        // Close the loop: record on the lead's timeline and schedule a follow-up.
        // Failures here must not flip a successful send into a "failed".
        try {
          await addActivity(lead.id, userId, repName, {
            type: "email",
            note: personalizedSubject,
          });
          // Don't disturb leads that are already won or written off.
          const existing = await getLeadState(userId, lead.id);
          const terminal =
            existing?.status === "won" ||
            existing?.status === "not_interested" ||
            ["won", "lost", "submitted"].includes(existing?.stage ?? "");
          if (!terminal) {
            await setLeadState(userId, lead.id, {
              status: "contacted",
              stage: "contacted",
              lastContacted: sentAt,
              followUpDate: addDays(FOLLOW_UP_DAYS),
            });
          }
        } catch (logErr) {
          console.error(`[Outreach] Sent to ${lead.email} but failed to log activity/follow-up:`, logErr);
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

  // Update daily counter with TTL of 25 hours
  const newTotal = sentToday + sent;
  await redis.set(dailyKey, String(newTotal), { ex: 90000 });

  return NextResponse.json({ sent, failed, skipped });
}
