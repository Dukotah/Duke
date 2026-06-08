// Calendar-booking webhook. When a prospect books a call via Cal.com or
// Calendly, the provider POSTs here. We match the invitee to a lead, log
// "Meeting booked" on the timeline, and mark the lead interested — which both
// boosts its score and pauses the drip cron (engaged leads are skipped).
//
// Cal.com:   Settings → Webhooks → point at this URL, BOOKING_CREATED.
// Calendly:  Webhook subscription for invitee.created.
// Set CALENDAR_WEBHOOK_SECRET to a shared secret (?secret= or x-webhook-secret).

import { NextRequest, NextResponse } from "next/server";
import { addActivity, setLeadState, getLeadState } from "@/lib/db";
import { findLeadByEmail } from "@/lib/crm/leadLookup";
import { reportError } from "@/lib/log";

function extractEmail(v: unknown): string {
  if (typeof v !== "string") return "";
  const m = v.match(/<([^>]+)>/);
  const raw = (m ? m[1] : v).trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw) ? raw : "";
}

// Invitee email + start time across Cal.com and Calendly payload shapes.
function parseBooking(body: Record<string, unknown>): { email: string; startTime: string } {
  const payload = (body.payload as Record<string, unknown>) ?? body;

  // Cal.com: payload.attendees[0].email, payload.startTime
  const attendees = payload.attendees as Array<Record<string, unknown>> | undefined;
  let email = attendees?.[0]?.email ? extractEmail(attendees[0].email) : "";
  let startTime = typeof payload.startTime === "string" ? payload.startTime : "";

  // Calendly: payload.email, payload.scheduled_event.start_time
  if (!email && typeof payload.email === "string") email = extractEmail(payload.email);
  if (!startTime) {
    const sched = payload.scheduled_event as Record<string, unknown> | undefined;
    if (sched && typeof sched.start_time === "string") startTime = sched.start_time;
  }

  // Last-ditch fallbacks.
  if (!email) email = extractEmail(body.email) || extractEmail(payload.invitee_email);
  return { email, startTime };
}

function authorized(req: NextRequest): boolean {
  const secret = process.env.CALENDAR_WEBHOOK_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  const provided = req.headers.get("x-webhook-secret") ?? req.nextUrl.searchParams.get("secret");
  return provided === secret;
}

function fmtWhen(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export async function POST(req: NextRequest) {
  try {
    if (!authorized(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { email, startTime } = parseBooking(body);
    if (!email) {
      return NextResponse.json({ ok: true, skipped: "no invitee email" });
    }

    const match = await findLeadByEmail(email);
    if (!match) {
      return NextResponse.json({ ok: true, skipped: "lead not found", email });
    }

    const when = fmtWhen(startTime);
    await addActivity(match.leadId, match.userId, "system", {
      type: "note",
      outcome: "meeting_booked",
      note: when ? `Meeting booked for ${when}` : "Meeting booked",
    });
    // A booked meeting is a strong intent signal — log it as "interested" so the
    // engagement-aware score floats the lead and the drip cron pauses it.
    await addActivity(match.leadId, match.userId, "system", {
      type: "status_change",
      outcome: "interested",
      note: "Booked a call",
    });

    const existing = await getLeadState(match.userId, match.leadId);
    if (existing?.status !== "won") {
      await setLeadState(match.userId, match.leadId, { status: "follow_up", stage: "meeting" });
    }

    return NextResponse.json({ ok: true, leadId: match.leadId, action: "meeting_logged" });
  } catch (err) {
    reportError("crm/calendar", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
