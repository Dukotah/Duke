import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/api";
import {
  getActivity,
  getLeadAction,
  getLeadReply,
  getLeadState,
  type ActivityEntry,
} from "@/lib/db";
import { getTasks } from "@/lib/crm/tasks";

// A single normalized event in the unified per-lead feed. `kind` drives the
// icon/color in the UI; `ts` is an ISO timestamp used for time-sorting.
export type TimelineKind = "call" | "email" | "note" | "stage" | "task" | "reply";

export interface TimelineEvent {
  id: string;
  ts: string; // ISO
  kind: TimelineKind;
  icon: string; // semantic hint for the client (e.g. "phone", "mail-open")
  title: string;
  detail?: string;
  who?: string; // rep / actor name when known
  outcome?: string; // raw outcome for finer client styling
}

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// Map a raw ActivityEntry into one or more TimelineEvents. The activity log
// already captures calls, manual notes, sent/logged emails, webhook-driven
// email opens/clicks/bounces, and inbound replies — so it is the spine of the
// feed. We only normalize kind + icon + human title here.
function fromActivity(entry: ActivityEntry): TimelineEvent {
  const outcome = entry.outcome;
  let kind: TimelineKind = "note";
  let icon = "clock";
  let title = "Activity";

  if (entry.type === "reply") {
    kind = "reply";
    icon = "message-square";
    title = entry.subject || "Lead replied";
  } else if (entry.type === "note") {
    kind = "note";
    icon = "sticky-note";
    title = "Note added";
  } else if (entry.type === "submitted") {
    kind = "stage";
    icon = "send";
    title = "Submitted to Duke";
  } else if (entry.type === "status_change") {
    kind = "stage";
    icon = "git-branch";
    title =
      outcome === "won"
        ? "Marked Won"
        : outcome === "not_interested"
          ? "Marked Not Interested"
          : "Stage changed";
  } else if (entry.type === "email") {
    kind = "email";
    if (outcome === "opened") {
      icon = "mail-open";
      title = "Email opened";
    } else if (outcome === "clicked") {
      icon = "mouse-pointer-click";
      title = "Link clicked";
    } else if (outcome === "bounced") {
      icon = "alert-triangle";
      title = "Email bounced";
    } else if (outcome === "complained") {
      icon = "alert-triangle";
      title = "Marked as spam";
    } else if (outcome === "logged") {
      icon = "mail";
      title = "Email logged";
    } else {
      icon = "mail";
      title = "Email sent";
    }
  } else if (entry.type === "call") {
    kind = "call";
    if (outcome === "no_answer") {
      icon = "phone-missed";
      title = "Call — No Answer";
    } else if (outcome === "voicemail") {
      icon = "phone-off";
      title = "Call — Left Voicemail";
    } else if (outcome === "call_back") {
      icon = "calendar-clock";
      title = "Call — Call Back Later";
    } else if (outcome === "not_interested") {
      icon = "thumbs-down";
      title = "Call — Not Interested";
    } else if (outcome === "interested") {
      icon = "thumbs-up";
      title = "Call — Interested!";
    } else {
      icon = "phone";
      title = "Call logged";
    }
  }

  return {
    id: entry.id,
    ts: entry.createdAt,
    kind,
    icon,
    title,
    detail: entry.text || entry.note || undefined,
    who: entry.repName,
    outcome,
  };
}

// GET /api/crm/timeline?leadId=xxx — one chronological (newest-first) feed
// merging the lead's activity log, durable cross-rep engagement stamps, the
// latest inbound reply, the per-user lead stage, and any tasks attached to the
// lead. Each source is fetched defensively so a single failure can't blank the
// whole feed.
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const leadId = req.nextUrl.searchParams.get("leadId");
    if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 });

    const [activity, action, reply, state, tasks] = await Promise.all([
      getActivity(leadId).catch(() => [] as ActivityEntry[]),
      getLeadAction(leadId).catch(() => null),
      getLeadReply(leadId).catch(() => null),
      getLeadState(userId, leadId).catch(() => null),
      getTasks(userId).catch(() => []),
    ]);

    const events: TimelineEvent[] = [];
    const seenTs = new Set<string>();

    // 1) Activity log — the spine of the feed (calls, notes, emails, opens,
    //    clicks, bounces, replies, submissions, stage flips).
    for (const entry of activity) {
      const ev = fromActivity(entry);
      events.push(ev);
      seenTs.add(`${ev.kind}:${ev.outcome ?? ""}:${ev.ts}`);
    }

    // 2) Durable cross-rep stamps (lead_actions). These can hold engagement
    //    signals from webhooks that predate the activity log or were stamped
    //    without a matching timeline row. Only add events whose timestamp isn't
    //    already represented by an activity row, to avoid double-rendering.
    if (action) {
      const stamp = (
        ts: string | undefined,
        kind: TimelineKind,
        icon: string,
        title: string,
        outcome?: string,
      ) => {
        if (!ts) return;
        const dedupeKey = `${kind}:${outcome ?? ""}:${ts}`;
        if (seenTs.has(dedupeKey)) return;
        seenTs.add(dedupeKey);
        events.push({
          id: `action:${kind}:${outcome ?? ""}:${ts}`,
          ts,
          kind,
          icon,
          title,
          who: action.lastTouchedName,
          outcome,
        });
      };
      stamp(action.openedAt, "email", "mail-open", "Email opened", "opened");
      stamp(action.clickedAt, "email", "mouse-pointer-click", "Link clicked", "clicked");
      stamp(action.bouncedAt, "email", "alert-triangle", "Email bounced", "bounced");
      stamp(action.interestedAt, "stage", "thumbs-up", "Became Interested", "interested");
      stamp(action.notInterestedAt, "stage", "thumbs-down", "Marked Not Interested", "not_interested");
      if (action.status === "won") {
        stamp(action.lastOutcomeAt, "stage", "trophy", "Marked Won", "won");
      }
    }

    // 3) Latest inbound reply body — only if a reply event isn't already in the
    //    feed at that timestamp (the inbound webhook also writes to activity).
    if (reply) {
      const ts = reply.receivedAt || reply.respondedAt;
      const dedupeKey = `reply::${ts}`;
      if (ts && !seenTs.has(dedupeKey)) {
        // No exact-ts reply row present — surface it from the dedicated store.
        const hasReplyRow = events.some((e) => e.kind === "reply" && e.ts === ts);
        if (!hasReplyRow) {
          events.push({
            id: `reply:${ts}`,
            ts,
            kind: "reply",
            icon: "message-square",
            title: reply.subject || "Lead replied",
            detail: reply.text || undefined,
            who: reply.fromName || reply.fromEmail,
            outcome: "replied",
          });
        }
      }
    }

    // 4) Per-user lead stage — a single "current stage" marker when set. Uses
    //    lastContacted (or submittedAt) as the best-known timestamp.
    if (state && state.stage) {
      const ts = state.lastContacted || state.submittedAt;
      if (ts) {
        events.push({
          id: `stage:${ts}`,
          ts,
          kind: "stage",
          icon: "git-branch",
          title: `Stage: ${state.stage}`,
          detail: state.notes || undefined,
          outcome: state.status,
        });
      }
    }

    // 5) Tasks attached to this lead (created, and completion as a second event).
    for (const task of tasks) {
      if (task.leadId !== leadId) continue;
      events.push({
        id: `task:${task.id}`,
        ts: task.createdAt,
        kind: "task",
        icon: task.done ? "check-circle" : "circle-dashed",
        title: task.done ? `Task done: ${task.title}` : `Task: ${task.title}`,
        detail: task.dueAt ? `Due ${task.dueAt}` : undefined,
        outcome: task.type,
      });
    }

    // Newest first. Stable for equal timestamps.
    events.sort((a, b) => b.ts.localeCompare(a.ts));

    return NextResponse.json(events);
  } catch (err) {
    return handleApiError("crm/timeline GET", err);
  }
}
