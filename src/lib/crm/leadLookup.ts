// Resolve which CRM lead an inbound signal (email reply, calendar booking,
// delivery webhook) belongs to, by recipient/sender email. Used by the webhook
// endpoints that are triggered by third parties and only know an email address.

import { getRedis } from "@/lib/redis";
import { listUsers, getCustomLeads } from "@/lib/db";

export interface LeadMatch {
  userId: string;
  leadId: string;
  leadName: string;
  variantId?: string; // the A/B subject variant this address was emailed under
}

function norm(email: string): string {
  return email.toLowerCase().trim();
}

// First try the outreach log (anyone we've emailed). The log entry carries the
// A/B variant the email was sent under, so opens/clicks can be credited back.
async function fromOutreachLog(email: string): Promise<LeadMatch | null> {
  const redis = getRedis();
  const keys = (await redis.keys("outreach_log:*")) as string[];
  const target = norm(email);
  for (const key of keys) {
    const userId = key.replace("outreach_log:", "");
    const items = (await redis.lrange(key, 0, -1)) as unknown[];
    for (const raw of items) {
      try {
        const entry = typeof raw === "string" ? JSON.parse(raw) : (raw as Record<string, unknown>);
        if (typeof entry.email === "string" && norm(entry.email) === target) {
          return {
            userId,
            leadId: String(entry.leadId ?? ""),
            leadName: String(entry.leadName ?? ""),
            variantId: typeof entry.variant === "string" ? entry.variant : undefined,
          };
        }
      } catch {
        // skip malformed entry
      }
    }
  }
  return null;
}

// Fall back to custom leads (e.g. an inbound audit lead, or someone who booked a
// call without any prior outreach) — these never appear in the outreach log.
async function fromCustomLeads(email: string): Promise<LeadMatch | null> {
  const target = norm(email);
  const users = await listUsers();
  for (const user of users) {
    const leads = await getCustomLeads(user.id);
    for (const lead of leads) {
      if (lead.email && norm(lead.email) === target) {
        return { userId: user.id, leadId: lead.id, leadName: lead.name };
      }
    }
  }
  return null;
}

export async function findLeadByEmail(email: string): Promise<LeadMatch | null> {
  if (!email) return null;
  return (await fromOutreachLog(email)) ?? (await fromCustomLeads(email));
}
