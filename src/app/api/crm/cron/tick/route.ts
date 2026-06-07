// Drip-sequence cron job. Intended to run once per day via Vercel Cron.
//
// For each CRM user, finds custom leads whose follow-up date has arrived and
// sends the next sequence email (up to 3 follow-ups after the initial contact).
// Respects the suppression list, daily send cap, and domain-verification gate —
// exactly the same guardrails the manual outreach route uses.

import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { listUsers, getCustomLeads, getAllLeadStates, addActivity, getSuppressedEmails } from "@/lib/db";
import { getNextStep, personalizeSequence, MAX_SEQUENCE_STEP } from "@/lib/crm/sequences";
import { OUTREACH_FROM, MAILING_ADDRESS } from "@/config/site";
import { unsubscribeUrl } from "@/lib/unsubscribe";
import { getSessionSecret } from "@/lib/session";
import { canDeliver, normalizeEmail, resolveDailyCap } from "@/lib/outreach";

export const maxDuration = 60;

const MAX_PER_DAY = resolveDailyCap(process.env.OUTREACH_DAILY_CAP);
const SENDER = OUTREACH_FROM;

function buildFooter(unsubUrl: string): string {
  return `\n\n\nYou're receiving this because you previously connected with Copper Bay Tech.` +
    `\nNot interested? Unsubscribe here: ${unsubUrl}` +
    `\n${MAILING_ADDRESS}`;
}

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

// Auth: Vercel Cron sends a secret header; also allow the stored CRON_SECRET.
function isAuthorized(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const vercelHeader = req.headers.get("authorization");
  if (cronSecret && vercelHeader === `Bearer ${cronSecret}`) return true;
  // Vercel Cron also sets x-vercel-cron: 1 (only from Vercel infra, not spoofable
  // from outside). Accept this in production as a secondary gate.
  if (process.env.VERCEL_ENV === "production" && req.headers.get("x-vercel-cron") === "1") return true;
  return false;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = getRedis();
  const today = todayStr();
  const apiKey = process.env.RESEND_API_KEY;
  const secret = getSessionSecret();
  const live = canDeliver(apiKey, process.env.OUTREACH_DOMAIN_VERIFIED);
  const suppressed = new Set((await getSuppressedEmails()).map(normalizeEmail));

  const users = await listUsers();

  let totalSent = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  const log: string[] = [];

  for (const user of users) {
    const dailyKey = `outreach:${user.id}:${today}`;
    let sentToday = parseInt((await redis.get(dailyKey) as string | null) ?? "0", 10);

    const [customLeads, allStates] = await Promise.all([
      getCustomLeads(user.id),
      getAllLeadStates(user.id),
    ]);

    for (const lead of customLeads) {
      if (!lead.email) { totalSkipped++; continue; }
      const email = normalizeEmail(lead.email);
      if (suppressed.has(email)) { totalSkipped++; continue; }

      const state = allStates[lead.id];
      if (!state) continue;

      // Skip terminal leads.
      const terminal = ["won", "not_interested"].includes(state.status) ||
        ["won", "lost", "submitted", "not_interested"].includes(state.stage);
      if (terminal) continue;

      // Only sequence leads that have been contacted and have a follow-up date due.
      if (!state.followUpDate || state.followUpDate > today) continue;

      // Read sequence step (stored as string in Redis hash).
      const currentStep = parseInt(String((state as unknown as Record<string, unknown>).sequenceStep ?? "0"), 10);
      if (currentStep >= MAX_SEQUENCE_STEP) {
        totalSkipped++;
        continue;
      }

      const nextStep = getNextStep(currentStep);
      if (!nextStep) { totalSkipped++; continue; }

      // Respect daily cap.
      if (sentToday >= MAX_PER_DAY) {
        log.push(`Daily cap reached for user ${user.id} — stopping`);
        break;
      }

      const subject = personalizeSequence(nextStep.subject, lead);
      const body = personalizeSequence(nextStep.body, lead);
      const sentAt = new Date().toISOString();

      if (!live) {
        console.log(`[Cron] Track-only — ${lead.email}: ${subject}`);
        try {
          await persistSend(lead.id, user.id, user.name, subject, sentAt, false,
            nextStep.step, nextStep.delayDays, redis, dailyKey, sentToday, false);
          sentToday++;
          totalSent++;
          log.push(`tracked (dry-run): ${lead.email} step ${nextStep.step}`);
        } catch (err) {
          totalErrors++;
          console.error(`[Cron] Failed to track ${lead.email}:`, err);
        }
        continue;
      }

      const unsubLink = await unsubscribeUrl(lead.email, secret);

      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `Duke at Copper Bay Tech <${SENDER}>`,
            reply_to: SENDER,
            to: [lead.email],
            subject,
            text: body + buildFooter(unsubLink),
            headers: {
              "List-Unsubscribe": `<${unsubLink}>, <mailto:${SENDER}?subject=unsubscribe>`,
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            },
          }),
        });

        if (res.ok) {
          await persistSend(lead.id, user.id, user.name, subject, sentAt, true,
            nextStep.step, nextStep.delayDays, redis, dailyKey, sentToday, true);
          sentToday++;
          totalSent++;
          log.push(`sent: ${lead.email} step ${nextStep.step}`);
        } else {
          totalErrors++;
          log.push(`failed (${res.status}): ${lead.email}`);
        }
      } catch (err) {
        totalErrors++;
        console.error(`[Cron] Exception sending to ${lead.email}:`, err);
        log.push(`error: ${lead.email}`);
      }
    }
  }

  return NextResponse.json({ ok: true, sent: totalSent, skipped: totalSkipped, errors: totalErrors, log, date: today });
}

async function persistSend(
  leadId: string,
  userId: string,
  repName: string,
  subject: string,
  sentAt: string,
  delivered: boolean,
  nextStep: number,
  nextDelayDays: number,
  redis: ReturnType<typeof getRedis>,
  dailyKey: string,
  sentToday: number,
  countAgainstCap: boolean,
) {
  await addActivity(leadId, userId, repName, {
    type: "email",
    outcome: delivered ? "sent" : "logged",
    note: `[Auto] ${subject}`,
  });

  // setLeadState is a thin wrapper around redis.hset — call it directly so we
  // can include the non-typed sequenceStep field in a single round-trip.
  await redis.hset(`lead:${userId}:${leadId}`, {
    status: "contacted",
    stage: "contacted",
    lastContacted: sentAt,
    followUpDate: addDays(nextDelayDays + 7),
    sequenceStep: String(nextStep),
  });

  if (countAgainstCap) {
    await redis.set(dailyKey, String(sentToday + 1), { ex: 90000 });
  }
}
