import { NextRequest, NextResponse } from "next/server";
import { captureContactLead } from "@/lib/crm/intake";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { formatAttribution } from "@/lib/attribution";

export async function POST(req: NextRequest) {
  try {
    const rl = await rateLimit(`contact:${clientIp(req)}`, { limit: 5, windowSec: 600 });
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many submissions — please wait a few minutes and try again." }, { status: 429 });
    }
    const body = await req.json();
    const { name, business, email, phone, service, message, company_website, elapsedMs, attribution } = body;
    const source = formatAttribution(attribution);

    // Spam gate: a filled honeypot (humans never see the field) or a near-instant
    // submit (< 2s) is almost certainly a bot. Return ok so the bot doesn't retry,
    // but drop it — no email, no CRM lead.
    if (company_website || (typeof elapsedMs === "number" && elapsedMs < 2000)) {
      console.warn("Contact form: dropped likely-bot submission", {
        honeypot: !!company_website,
        elapsedMs,
      });
      return NextResponse.json({ ok: true });
    }

    if (!name || !business || !email || !service) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Bridge into the CRM: every contact-form submission becomes a tier-A lead
    // in the /crm queue (deduped by email). Isolated + non-fatal so a CRM/Redis
    // hiccup never breaks the visitor's submission or the email notifications.
    try {
      await captureContactLead({ name, business, email, phone, service, message, attribution: source });
    } catch (e) {
      console.error("Contact→CRM bridge failed (non-fatal):", e);
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      // In development, log and succeed so the form is testable without Resend.
      // In production, FAIL LOUDLY — returning ok here would silently swallow a
      // real lead (the client shows "success" and the message goes nowhere).
      if (process.env.NODE_ENV === "production") {
        console.error("Contact form: RESEND_API_KEY is not set — cannot deliver lead.", {
          name, business, email, service,
        });
        return NextResponse.json({ error: "Email delivery is not configured" }, { status: 500 });
      }
      console.log("Contact form submission (dev, no RESEND_API_KEY set):", {
        name, business, email, phone, service, message,
      });
      return NextResponse.json({ ok: true });
    }

    const [notifyRes] = await Promise.all([
      // Notify Duke
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Copper Bay Tech <contact@copperbaytech.com>",
          to: ["contact@copperbaytech.com"],
          reply_to: email,
          subject: `New inquiry from ${name} — ${business}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Business:</strong> ${business}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
            <p><strong>Service:</strong> ${service}</p>
            ${message ? `<p><strong>Message:</strong><br>${message.replace(/\n/g, "<br>")}</p>` : ""}
            ${source ? `<p><strong>Source:</strong> ${source}</p>` : ""}
          `,
        }),
      }),
      // Auto-reply to submitter
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Duke @ Copper Bay Tech <contact@copperbaytech.com>",
          to: [email],
          subject: "Got your message — Copper Bay Tech",
          html: `
            <p>Hi ${name},</p>
            <p>Thanks for reaching out — I got your message and will be back to you within one business day.</p>
            <p>If anything's urgent, feel free to call or text me directly at <strong>(707) 239-6725</strong>.</p>
            <p>Talk soon,<br>Duke<br>Copper Bay Tech · Sonoma County, CA</p>
            <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
            <p style="font-size:12px;color:#999;">Copper Bay Tech · Sonoma County IT & Web · copperbaytech.com</p>
          `,
        }),
      }),
    ]);

    if (!notifyRes.ok) {
      const errorBody = await notifyRes.text();
      console.error("Resend error:", notifyRes.status, errorBody);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
