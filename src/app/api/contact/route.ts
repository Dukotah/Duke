import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { escapeHtml } from "@/lib/html";
import { rateLimit } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  business: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(50).optional(),
  service: z.string().trim().min(1).max(200),
  message: z.string().trim().max(5000).optional(),
});

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: rl.message }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } });
  }

  try {
    const body = await req.json();

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
    }
    const { name, business, email, phone, service, message } = parsed.data;

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log("Contact form submission (no RESEND_API_KEY set):", {
        name, business, email, phone, service, message,
      });
      return NextResponse.json({ ok: true });
    }

    const safeName = escapeHtml(name);
    const safeBusiness = escapeHtml(business);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeService = escapeHtml(service);
    // Escape first, THEN convert newlines so injected markup is neutralized
    // while our own <br> formatting survives.
    const safeMessage = message ? escapeHtml(message).replace(/\n/g, "<br>") : "";

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
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Business:</strong> ${safeBusiness}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            ${phone ? `<p><strong>Phone:</strong> ${safePhone}</p>` : ""}
            <p><strong>Service:</strong> ${safeService}</p>
            ${message ? `<p><strong>Message:</strong><br>${safeMessage}</p>` : ""}
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
            <p>Hi ${safeName},</p>
            <p>Thanks for reaching out — I got your message and will be back to you within one business day.</p>
            <p>If anything's urgent, feel free to call or text me directly at <strong>(707) 239-6725</strong>.</p>
            <p>Talk soon,<br>Duke<br>Copper Bay Tech · Santa Rosa, CA</p>
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
