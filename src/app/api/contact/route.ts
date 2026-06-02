import { NextRequest, NextResponse } from "next/server";
import { escapeHtml, truncate } from "@/lib/escape-html";
import { rateLimit } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_MESSAGE_LEN = 10_000;
// Reject bodies larger than 64 KB before parsing JSON
const MAX_BODY_BYTES = 64 * 1024;

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { limit: 20, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: rl.message },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  // Body size guard — check Content-Length before parsing
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body too large" }, { status: 413 });
  }

  try {
    // Read as raw bytes first to enforce hard cap regardless of Content-Length
    const raw = await req.arrayBuffer();
    if (raw.byteLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request body too large" }, { status: 413 });
    }

    let body: unknown;
    try {
      body = JSON.parse(new TextDecoder().decode(raw));
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { name, business, email, phone, service, message } =
      body as Record<string, unknown>;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!business || typeof business !== "string" || !business.trim()) {
      return NextResponse.json({ error: "Business name is required" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!service || typeof service !== "string" || !service.trim()) {
      return NextResponse.json({ error: "Service selection is required" }, { status: 400 });
    }
    if (message && typeof message === "string" && message.length > MAX_MESSAGE_LEN) {
      return NextResponse.json({ error: "Message is too long" }, { status: 400 });
    }

    const safeName     = escapeHtml(truncate(String(name).trim(), 200));
    const safeBusiness = escapeHtml(truncate(String(business).trim(), 200));
    const safeEmail    = escapeHtml(String(email).trim());
    const safePhone    = phone ? escapeHtml(truncate(String(phone).trim(), 30)) : null;
    const safeService  = escapeHtml(String(service).trim());
    const safeMessage  = message
      ? escapeHtml(truncate(String(message).trim(), MAX_MESSAGE_LEN)).replace(/\n/g, "<br>")
      : null;

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log("Contact form submission (no RESEND_API_KEY set):", {
        name: safeName, business: safeBusiness, email: safeEmail, service: safeService,
      });
      return NextResponse.json({ ok: true });
    }

    const [notifyRes] = await Promise.all([
      // Notify Duke
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Copper Bay Tech <noreply@copperbaytech.com>",
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
            <p>Talk soon,<br>Duke<br>Copper Bay Tech · Petaluma, CA</p>
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
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
