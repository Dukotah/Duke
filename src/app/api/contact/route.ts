import { NextRequest, NextResponse } from "next/server";
import { escapeHtml, truncate } from "@/lib/escape-html";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_MESSAGE_LEN = 10_000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, business, email, phone, service, message } = body;

    // Validate required fields
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

    // Escape all user-supplied fields before inserting into HTML
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
      const errorBody = await res.text();
      console.error("Resend error:", res.status, errorBody);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
