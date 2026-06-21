import { NextRequest, NextResponse } from "next/server";
import { setLeadState, stampLeadAction, claimLead } from "@/lib/db";
import { getRedis } from "@/lib/redis";
import { parseJsonBody, handleApiError, requireAdmin } from "@/lib/api";
import { SEQUENCE, personalizeSequence } from "@/lib/crm/sequences";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// Cadence enqueue: write the next sequence step into Redis so the cron job can
// deliver it on schedule. Mirrors the pattern used by the outreach cron.
async function enqueueCadence(
  leadId: string,
  leadName: string,
  leadEmail: string,
  userId: string,
  repName: string
): Promise<void> {
  const redis = getRedis();
  const step = SEQUENCE[0]; // always start from step 1
  const sendAt = new Date();
  sendAt.setDate(sendAt.getDate() + step.delayDays);

  const entry = JSON.stringify({
    leadId,
    leadName,
    leadEmail,
    userId,
    repName,
    step: step.step,
    subject: personalizeSequence(step.subject, { name: leadName, email: leadEmail }),
    body: personalizeSequence(step.body, { name: leadName, email: leadEmail }),
    sendAt: sendAt.toISOString(),
    scheduledAt: new Date().toISOString(),
  });

  // keyed per-user so each rep's queue stays isolated
  await redis.lpush(`cadence_queue:${userId}`, entry);
  await redis.ltrim(`cadence_queue:${userId}`, 0, 499);
}

interface BulkBody {
  leadIds: string[];
  action: "setStage" | "setFollowUp" | "tag" | "reassign" | "enrollCadence";
  payload: Record<string, unknown>;
}

// POST /api/crm/bulk
export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const repName = req.headers.get("x-user-name") ?? "Unknown";

    const parsed = await parseJsonBody<BulkBody>(req);
    if (!parsed.ok) return parsed.response;

    const { leadIds, action, payload } = parsed.data;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ error: "leadIds must be a non-empty array" }, { status: 400 });
    }
    if (leadIds.length > 200) {
      return NextResponse.json({ error: "Max 200 leads per bulk action" }, { status: 400 });
    }
    if (!action) {
      return NextResponse.json({ error: "action is required" }, { status: 400 });
    }

    let updated = 0;

    if (action === "setStage") {
      // payload: { stage: string, status?: string }
      const stage = (payload.stage as string | undefined)?.trim();
      if (!stage) return NextResponse.json({ error: "payload.stage is required" }, { status: 400 });
      const status = (payload.status as string | undefined) ?? stage;

      await Promise.all(
        leadIds.map(async (leadId) => {
          await setLeadState(userId, leadId, { stage, status: status as "new" | "contacted" | "follow_up" | "not_interested" | "won" });
          await stampLeadAction(leadId, { status }, { userId, repName });
          updated++;
        })
      );
    } else if (action === "setFollowUp") {
      // payload: { followUpDate: string } — YYYY-MM-DD
      const followUpDate = (payload.followUpDate as string | undefined)?.trim();
      if (!followUpDate) return NextResponse.json({ error: "payload.followUpDate is required" }, { status: 400 });

      await Promise.all(
        leadIds.map(async (leadId) => {
          await setLeadState(userId, leadId, { followUpDate });
          await stampLeadAction(leadId, { followUpDate }, { userId, repName });
          updated++;
        })
      );
    } else if (action === "tag") {
      // payload: { tag: string } — arbitrary label stamped on the durable lead_actions hash
      const tag = (payload.tag as string | undefined)?.trim();
      if (!tag) return NextResponse.json({ error: "payload.tag is required" }, { status: 400 });

      const nowISO = new Date().toISOString();
      await Promise.all(
        leadIds.map(async (leadId) => {
          // Stamp into the cross-rep actions hash under a "tags" array
          const redis = getRedis();
          const raw = await redis.hget("lead_actions", leadId);
          let current: Record<string, unknown> = {};
          try {
            current = (typeof raw === "string" ? JSON.parse(raw) : raw) ?? {};
          } catch { /* start fresh */ }

          const tags: string[] = Array.isArray(current.tags) ? (current.tags as string[]) : [];
          if (!tags.includes(tag)) tags.push(tag);

          await redis.hset("lead_actions", {
            [leadId]: JSON.stringify({
              ...current,
              tags,
              lastTouchedAt: nowISO,
              lastTouchedBy: userId,
              lastTouchedName: repName,
            }),
          });
          updated++;
        })
      );
    } else if (action === "reassign") {
      // Reassigning leads to an arbitrary user is an admin-only operation — a rep
      // must not be able to claim/steal leads for themselves or others via bulk,
      // bypassing the ownership/admin checks in the single-lead /api/crm/claim route.
      const denied = requireAdmin(req);
      if (denied) return denied;
      // payload: { toUserId: string, toRepName: string }
      const toUserId = (payload.toUserId as string | undefined)?.trim();
      const toRepName = (payload.toRepName as string | undefined)?.trim() ?? "Unknown";
      if (!toUserId) return NextResponse.json({ error: "payload.toUserId is required" }, { status: 400 });

      await Promise.all(
        leadIds.map(async (leadId) => {
          await claimLead(leadId, toUserId, toRepName);
          updated++;
        })
      );
    } else if (action === "enrollCadence") {
      // payload: { leads: Array<{ id, name, email }> }
      // The client must pass name+email because the bulk route doesn't fetch lead details.
      const leads = payload.leads as Array<{ id: string; name: string; email: string }> | undefined;
      if (!Array.isArray(leads) || leads.length === 0) {
        return NextResponse.json({ error: "payload.leads (array of {id,name,email}) is required" }, { status: 400 });
      }

      await Promise.all(
        leads.map(async (lead) => {
          if (!lead.id || !lead.email) return; // skip leads without email
          await enqueueCadence(lead.id, lead.name ?? "", lead.email, userId, repName);
          await stampLeadAction(lead.id, { lastOutcome: "cadence_enrolled" }, { userId, repName });
          updated++;
        })
      );
    } else {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    return NextResponse.json({ updated });
  } catch (err) {
    return handleApiError("crm/bulk POST", err);
  }
}
