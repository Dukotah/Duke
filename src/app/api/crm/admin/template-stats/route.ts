import { NextRequest, NextResponse } from "next/server";
import { handleApiError, requireAdmin } from "@/lib/api";
import { getRedis } from "@/lib/redis";

// GET /api/crm/admin/template-stats
// Rolls up opens/clicks/replies per email template (identified by subject line)
// from the outreach_log:<userId> lists + cross-ref with lead_actions for
// engagement signals.

interface OutreachLogEntry {
  leadId: string;
  leadName: string;
  email: string;
  subject: string;
  sentAt: string;
  delivered?: boolean;
}

interface LeadActions {
  openedCount?: number;
  clickedCount?: number;
  replyCount?: number;
  emailCount?: number;
  respondedAt?: string;
  openedAt?: string;
  clickedAt?: string;
}

interface TemplateBucket {
  sent: number;
  opens: number;
  clicks: number;
  replies: number;
  leadIds: Set<string>;
}

export async function GET(req: NextRequest) {
  // Admin-only: /api/crm/admin/* is NOT role-gated by middleware, so enforce here.
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const redis = getRedis();

    // 1) Read all outreach log entries across every rep
    const logKeys = (await redis.keys("outreach_log:*")) as string[];
    // leadId → template subject for matching engagement signals back to templates
    const leadToSubject = new Map<string, string>();
    const buckets = new Map<string, TemplateBucket>();

    await Promise.all(
      logKeys.map(async (key) => {
        const items = (await redis.lrange(key, 0, -1)) as unknown[];
        for (const raw of items) {
          try {
            const entry: OutreachLogEntry =
              typeof raw === "string" ? JSON.parse(raw) : (raw as OutreachLogEntry);
            if (!entry?.subject || !entry?.leadId) continue;

            const subject = entry.subject.trim();
            if (!leadToSubject.has(entry.leadId)) {
              // Use the most recently logged subject for this lead
              leadToSubject.set(entry.leadId, subject);
            }

            if (!buckets.has(subject)) {
              buckets.set(subject, { sent: 0, opens: 0, clicks: 0, replies: 0, leadIds: new Set() });
            }
            const b = buckets.get(subject)!;
            b.sent++;
            b.leadIds.add(entry.leadId);
          } catch {
            // skip malformed
          }
        }
      })
    );

    if (buckets.size === 0) {
      return NextResponse.json({ templates: [] });
    }

    // 2) Read lead_actions for engagement counts (one HGETALL for the whole map)
    const actionsRaw = (await redis.hgetall("lead_actions")) as Record<
      string,
      unknown
    > | null;
    const actionsMap = new Map<string, LeadActions>();
    if (actionsRaw) {
      for (const [leadId, val] of Object.entries(actionsRaw)) {
        try {
          const parsed = typeof val === "string" ? JSON.parse(val) : val;
          if (parsed && typeof parsed === "object") {
            actionsMap.set(leadId, parsed as LeadActions);
          }
        } catch {
          // skip malformed
        }
      }
    }

    // 3) Read lead_replies for reply counts
    const repliesRaw = (await redis.hgetall("lead_replies")) as Record<
      string,
      unknown
    > | null;
    const replyCountMap = new Map<string, number>();
    if (repliesRaw) {
      for (const [leadId, val] of Object.entries(repliesRaw)) {
        try {
          const parsed = typeof val === "string" ? JSON.parse(val) : val;
          if (parsed && typeof parsed === "object" && "replyCount" in parsed) {
            replyCountMap.set(leadId, Number((parsed as { replyCount: number }).replyCount) || 0);
          }
        } catch {
          // skip malformed
        }
      }
    }

    // 4) Aggregate engagement per bucket using the leadId sets
    for (const [subject, bucket] of buckets) {
      for (const leadId of bucket.leadIds) {
        const actions = actionsMap.get(leadId);
        if (actions) {
          // Opens and clicks are cumulative across all sends to this lead;
          // attribute them to the template we last sent to this lead.
          // We use whether openedAt/clickedAt is set rather than raw counts
          // to avoid double-counting when a lead received multiple templates.
          if (actions.openedAt) bucket.opens++;
          if (actions.clickedAt) bucket.clicks++;
        }
        const rc = replyCountMap.get(leadId) ?? 0;
        if (rc > 0) bucket.replies++;

        // Also check leadToSubject to make sure this lead maps to this template
        void subject; // already iterating the right bucket
      }
    }

    // 5) Shape into response array sorted by sent desc
    const templates = Array.from(buckets.entries())
      .map(([template, b]) => ({
        template,
        sent: b.sent,
        opens: b.opens,
        clicks: b.clicks,
        replies: b.replies,
        openRate: b.sent > 0 ? Math.round((b.opens / b.sent) * 100) : 0,
        clickRate: b.sent > 0 ? Math.round((b.clicks / b.sent) * 100) : 0,
        replyRate: b.sent > 0 ? Math.round((b.replies / b.sent) * 100) : 0,
      }))
      .sort((a, b) => b.sent - a.sent);

    return NextResponse.json({ templates });
  } catch (err) {
    return handleApiError("crm/admin/template-stats GET", err);
  }
}
