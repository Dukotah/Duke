import { NextRequest, NextResponse } from "next/server";

type ScoreLine = { label: string; value: string };

function isEmail(v: unknown): v is string {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function scoreRows(scores: ScoreLine[]): string {
  return scores
    .map(
      (s) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#52525b;">${s.label}</td>` +
        `<td style="padding:6px 0;font-weight:600;color:#18181b;">${s.value}</td></tr>`
    )
    .join("");
}

/**
 * Turns an anonymous Website Health Check run into a lead:
 *  - emails the visitor their report (consent-based, they typed their email)
 *  - notifies Duke with the audited URL, scores, and the visitor's email
 * Reuses the same Resend setup as the contact form.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, url, overall } = body;
    const scores: ScoreLine[] = Array.isArray(body.scores) ? body.scores : [];

    if (!isEmail(email)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing audited URL" }, { status: 400 });
    }

    const overallLine =
      typeof overall === "number"
        ? `<p style="font-size:15px;margin:0 0 12px;"><strong>Overall health score:</strong> ${overall}/100</p>`
        : "";
    const table = scores.length
      ? `<table style="border-collapse:collapse;font-size:14px;margin:8px 0 16px;">${scoreRows(scores)}</table>`
      : "";

    const apiKey = process.env.RESEND_API_KEY;

    // No key configured (e.g. local dev) — log the lead and succeed so the UX
    // still works, matching the contact route's behavior.
    if (!apiKey) {
      console.log("Audit report request (no RESEND_API_KEY set):", { email, url, overall, scores });
      return NextResponse.json({ ok: true });
    }

    const send = (payload: Record<string, unknown>) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

    // 1) Lead notification to Duke
    const leadRes = await send({
      from: "Copper Bay Tech <noreply@copperbaytech.com>",
      to: ["duke@copperbaytech.com"],
      reply_to: email,
      subject: `New audit lead — ${url}`,
      html: `
        <h2>Someone ran a Website Health Check</h2>
        <p style="font-size:15px;margin:0 0 4px;"><strong>From:</strong> ${email}</p>
        <p style="font-size:15px;margin:0 0 12px;"><strong>Audited site:</strong> ${url}</p>
        ${overallLine}
        ${table}
        <p style="font-size:13px;color:#71717a;">They asked for their report — a good moment to follow up.</p>
      `,
    });

    if (!leadRes.ok) {
      const errorBody = await leadRes.text();
      console.error("Resend error (lead):", leadRes.status, errorBody);
      return NextResponse.json({ error: "Failed to send report" }, { status: 500 });
    }

    // 2) Copy of the report to the visitor (best-effort — don't fail the
    // request if this one bounces)
    await send({
      from: "Copper Bay Tech <noreply@copperbaytech.com>",
      to: [email],
      reply_to: "duke@copperbaytech.com",
      subject: `Your website health report — ${url}`,
      html: `
        <h2>Your Website Health Check</h2>
        <p style="font-size:15px;margin:0 0 12px;">Here are the results for <strong>${url}</strong>:</p>
        ${overallLine}
        ${table}
        <p style="font-size:14px;margin:16px 0 8px;">Want help fixing any of these? Just reply to this email — Duke reads every one.</p>
        <p style="font-size:13px;color:#71717a;">— Copper Bay Tech · Sonoma County IT &amp; Web</p>
      `,
    }).catch((e) => console.error("Resend error (visitor copy):", e));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Report route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
