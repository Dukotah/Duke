import { NextRequest, NextResponse } from "next/server";
import { getLead, getReps, logEmail } from "@/lib/crm/store";
import { buildEmailDraft } from "@/lib/crm/scoring";

// GET /api/crm/leads/:id/email — a ready-to-send draft tailored to the
// prospect's website problems. Handy for review before sending (and for an
// assisting agent to fetch a strong starting point).
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = getLead(id);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  const repName = getReps()[0]?.name ?? "Me";
  const draft = buildEmailDraft(lead, repName);
  return NextResponse.json({ draft, to: lead.email ?? null });
}

function toHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.6;color:#27272a">${escaped.replace(/\n/g, "<br>")}</div>`;
}

// POST /api/crm/leads/:id/email — send a tailored email and log it to the
// lead's timeline. If `subject`/`body` are omitted, a draft is generated from
// the prospect's problems (so an agent can POST `{}` to send a tailored note).
//
//   send: true  (default) → deliver via Resend (requires RESEND_API_KEY)
//   send: false           → record only (you're sending via your own mail app)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = getLead(id);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    /* allow empty body → fully generated draft */
  }

  const reps = getReps();
  const rep = typeof body.repId === "string" ? reps.find((r) => r.id === body.repId) : reps[0];
  const draft = buildEmailDraft(lead, rep?.name ?? "Me");

  const subject = (typeof body.subject === "string" && body.subject.trim()) || draft.subject;
  const text = (typeof body.body === "string" && body.body.trim()) || draft.body;
  const to = ((typeof body.to === "string" ? body.to : lead.email) ?? "").trim();

  if (!to) {
    return NextResponse.json(
      { error: "No recipient — add an email address for this lead first." },
      { status: 400 },
    );
  }

  const wantSend = body.send !== false;
  const apiKey = process.env.RESEND_API_KEY;
  let sent = false;
  let reason: string | undefined;

  if (wantSend && apiKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Copper Bay Tech <noreply@copperbaytech.com>",
        to: [to],
        reply_to: process.env.CRM_REPLY_TO || "duke@copperbaytech.com",
        subject,
        html: toHtml(text),
        text,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("CRM email send failed:", res.status, detail);
      return NextResponse.json({ error: "Email provider rejected the send." }, { status: 502 });
    }
    sent = true;
  } else {
    reason = apiKey ? "logged_only" : "no_api_key";
  }

  const updated = logEmail(id, { subject, body: text, repId: rep?.id });
  return NextResponse.json({ lead: updated, sent, reason });
}
