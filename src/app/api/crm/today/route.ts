import { NextRequest, NextResponse } from "next/server";
import {
  getAllLeadStates,
  getCustomLeads,
  getLeadActions,
  getLeadReplies,
  getAllOutreachLog,
} from "@/lib/db";
import { handleApiError } from "@/lib/api";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

export type TodayItemReason = "overdue-followup" | "followup-today" | "reply" | "email-open";

export interface TodayItem {
  leadId: string;
  leadName: string;
  reason: TodayItemReason;
  priority: number; // lower = higher priority; 0=overdue-followup, 1=followup-today, 2=reply, 3=email-open
  when: string; // ISO for sorting within same priority
  // extra context
  daysOverdue?: number;    // >0 for overdue
  replySnippet?: string;   // for reply items
  replySubject?: string;
}

// GET /api/crm/today — unified prioritized action queue for the current user.
// Items ranked: overdue follow-up > follow-up today > fresh reply > email open.
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const today = new Date().toISOString().slice(0, 10);

    const [states, customs, actionsMap, repliesMap, log] = await Promise.all([
      getAllLeadStates(userId),
      getCustomLeads(userId),
      getLeadActions(),
      getLeadReplies(),
      getAllOutreachLog(500),
    ]);

    // Build a name lookup: leadId → display name
    const nameById = new Map<string, string>();
    for (const c of customs) {
      nameById.set(`custom:${c.id}`, c.name);
      nameById.set(c.id, c.name);
    }
    for (const e of log) {
      if (e.leadId && e.leadName && !nameById.has(e.leadId)) {
        nameById.set(e.leadId, e.leadName);
      }
    }
    // Also pull names from replies
    for (const [leadId, reply] of Object.entries(repliesMap)) {
      if (!nameById.has(leadId) && (reply.fromName || reply.fromEmail)) {
        nameById.set(leadId, reply.fromName || reply.fromEmail || "Unknown lead");
      }
    }

    const items: TodayItem[] = [];
    const seen = new Set<string>(); // dedup: a leadId can only appear once (highest priority wins)

    // ── 1. Follow-up due (overdue > today) ────────────────────────────────────
    const dueDays = (dateStr: string): number => {
      const a = Date.parse(`${dateStr}T00:00:00Z`);
      const b = Date.parse(`${today}T00:00:00Z`);
      if (isNaN(a) || isNaN(b)) return 0;
      return Math.round((b - a) / 86_400_000);
    };

    const followUpItems: Array<{ leadId: string; delta: number; when: string }> = [];
    for (const [leadId, state] of Object.entries(states)) {
      if (!state.followUpDate) continue;
      if (["lost", "won", "submitted"].includes(state.stage)) continue;
      if (state.followUpDate > today) continue; // not yet due
      followUpItems.push({
        leadId,
        delta: dueDays(state.followUpDate),
        when: `${state.followUpDate}T00:00:00.000Z`,
      });
    }
    // Sort most overdue first
    followUpItems.sort((a, b) => b.delta - a.delta);
    for (const { leadId, delta, when } of followUpItems) {
      seen.add(leadId);
      items.push({
        leadId,
        leadName: nameById.get(leadId) || "Lead",
        reason: delta > 0 ? "overdue-followup" : "followup-today",
        priority: delta > 0 ? 0 : 1,
        when,
        daysOverdue: delta > 0 ? delta : undefined,
      });
    }

    // ── 2. Fresh replies (respondedAt set) ────────────────────────────────────
    const replyItems: Array<{ leadId: string; respondedAt: string; reply: typeof repliesMap[string] }> = [];
    for (const [leadId, action] of Object.entries(actionsMap)) {
      if (!action.respondedAt) continue;
      if (seen.has(leadId)) continue; // already in higher-priority bucket
      replyItems.push({ leadId, respondedAt: action.respondedAt, reply: repliesMap[leadId] });
    }
    replyItems.sort((a, b) => b.respondedAt.localeCompare(a.respondedAt));
    for (const { leadId, respondedAt, reply } of replyItems) {
      seen.add(leadId);
      const rawBody = ((reply?.text || reply?.html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
      const snippet = rawBody.length > 120 ? rawBody.slice(0, 120) + "…" : rawBody;
      items.push({
        leadId,
        leadName: nameById.get(leadId) || reply?.fromName || reply?.fromEmail || "Lead",
        reason: "reply",
        priority: 2,
        when: respondedAt,
        replySnippet: snippet || undefined,
        replySubject: reply?.subject || undefined,
      });
    }

    // ── 3. Recent email opens (openedAt in last 3 days) ───────────────────────
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const cutoff = threeDaysAgo.toISOString();

    const openItems: Array<{ leadId: string; openedAt: string }> = [];
    for (const [leadId, action] of Object.entries(actionsMap)) {
      if (!action.openedAt && !action.clickedAt) continue;
      if (seen.has(leadId)) continue;
      // Prefer clickedAt (hotter signal) over openedAt
      const when = action.clickedAt || action.openedAt!;
      if (when < cutoff) continue;
      openItems.push({ leadId, openedAt: when });
    }
    openItems.sort((a, b) => b.openedAt.localeCompare(a.openedAt));
    for (const { leadId, openedAt } of openItems) {
      seen.add(leadId);
      items.push({
        leadId,
        leadName: nameById.get(leadId) || "Lead",
        reason: "email-open",
        priority: 3,
        when: openedAt,
      });
    }

    // Final sort: priority ASC, then when DESC within same priority
    items.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return b.when.localeCompare(a.when);
    });

    // KPI counts
    const counts = {
      overdueFollowups: items.filter((i) => i.reason === "overdue-followup").length,
      followupsToday: items.filter((i) => i.reason === "followup-today").length,
      replies: items.filter((i) => i.reason === "reply").length,
      emailOpens: items.filter((i) => i.reason === "email-open").length,
    };

    return NextResponse.json({ items, counts });
  } catch (err) {
    return handleApiError("crm/today GET", err);
  }
}
