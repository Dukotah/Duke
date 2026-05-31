import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

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

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    // Personalize body — replace {name}, {business}, {city}
    const personalizedBody = emailBody
      .replace(/\{name\}/gi, lead.name)
      .replace(/\{business\}/gi, lead.name)
      .replace(/\{city\}/gi, lead.city);

    const personalizedSubject = subject
      .replace(/\{name\}/gi, lead.name)
      .replace(/\{business\}/gi, lead.name)
      .replace(/\{city\}/gi, lead.city);

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
          from: `${fromName} via Copper Bay Tech <noreply@copperbaytech.com>`,
          to: [lead.email],
          subject: personalizedSubject,
          text: personalizedBody,
        }),
      });

      if (res.ok) {
        sent++;
        // Log to Redis (capped list)
        const logEntry = JSON.stringify({
          leadId: lead.id,
          leadName: lead.name,
          email: lead.email,
          subject: personalizedSubject,
          sentAt: new Date().toISOString(),
        });
        await redis.lpush(`outreach_log:${userId}`, logEntry);
        await redis.ltrim(`outreach_log:${userId}`, 0, 199);
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
