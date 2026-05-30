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

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Copper Bay Tech <noreply@copperbaytech.com>",
        to: ["duke@copperbaytech.com"],
        reply_to: safeEmail,
        subject: `New inquiry from ${safeName} — ${safeBusiness}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Business:</strong> ${safeBusiness}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          ${safePhone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ""}
          <p><strong>Service:</strong> ${safeService}</p>
          ${safeMessage ? `<p><strong>Message:</strong><br>${safeMessage}</p>` : ""}
        `,
      }),
    });

    if (!res.ok) {
      console.error("Resend error:", res.status);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
