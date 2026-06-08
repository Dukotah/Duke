// Inbound-reply webhook. When a prospect replies to an outreach/drip email, the
// email provider (or a forwarding rule) POSTs here. We match the sender to a
// lead, log the reply on the timeline, flip the lead to "follow_up" so a human
// takes over, and — critically — the logged "replied" activity makes the drip
// cron pause automatically (it skips any lead showing engagement).
//
// Register the URL with your inbound-email provider and set INBOUND_WEBHOOK_SECRET
// to a shared secret (sent as ?secret= or the x-webhook-secret header).

import { NextRequest, NextResponse } from "next/server";
import { addActivity, setLeadState, getLeadState, recordAbEvent } from "@/lib/db";
import { findLeadByEmail } from "@/lib/crm/leadLookup";
import { reportError } from "@/lib/log";

// Pull a bare email out of "Name <email@host>" or a plain address.
function extractEmail(v: unknown): string {
  if (typeof v !== "string") return "";
  const m = v.match(/<([^>]+)>/);
  const raw = (m ? m[1] : v).trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw) ? raw : "";
}

// Sender email across the shapes common providers use.
function senderEmail(body: Record<string, unknown>): string {
  const data = (body.data as Record<string, unknown>) ?? {};
  const envelope = (body.envelope as Record<string, unknown>) ?? {};
  const from = body.from ?? data.from ?? body.sender ?? data.sender ?? envelope.from;
  if (from && typeof from === "object" && "email" in (from as Record<string, unknown>)) {
    return extractEmail((from as Record<string, unknown>).email);
  }
  return extractEmail(from);
}

function authorized(req: NextRequest): boolean {
  const secret = process.env.INBOUND_WEBHOOK_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production"; // dev convenience only
  const provided = req.headers.get("x-webhook-secret") ?? req.nextUrl.searchParams.get("secret");
  return provided === secret;
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

    const email = senderEmail(body);
    if (!email) {
      return NextResponse.json({ ok: true, skipped: "no sender email" });
    }

    const match = await findLeadByEmail(email);
    if (!match) {
      return NextResponse.json({ ok: true, skipped: "lead not found", email });
    }

    const subject = typeof body.subject === "string" ? body.subject : "";
    await addActivity(match.leadId, match.userId, "system", {
      type: "email",
      outcome: "replied",
      note: subject ? `Replied: ${subject}` : "Replied to outreach",
    });

    // Hand off to a human and stop the automation — but never downgrade a richer
    // status the rep has already set (won / not_interested).
    const existing = await getLeadState(match.userId, match.leadId);
    const terminal = existing?.status === "won" || existing?.status === "not_interested";
    if (!terminal) {
      await setLeadState(match.userId, match.leadId, { status: "follow_up", stage: "engaged" });
    }

    if (match.variantId) await recordAbEvent(match.variantId, "replied");

    return NextResponse.json({ ok: true, leadId: match.leadId, action: "reply_logged" });
  } catch (err) {
    reportError("crm/inbound", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
