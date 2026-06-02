import { NextRequest, NextResponse } from "next/server";
import { escapeHtml } from "@/lib/html";
import { isValidEmail } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, business, email, phone, service, message } = body;

    if (!name || !business || !email || !service) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!isValidEmail(String(email))) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Escape every user-supplied value before it lands in an HTML email body.
    const safe = {
      name: escapeHtml(name),
      business: escapeHtml(business),
      email: escapeHtml(email),
      phone: escapeHtml(phone),
      service: escapeHtml(service),
      message: escapeHtml(message).replace(/\n/g, "<br>"),
    };

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log("Contact form submission (no RESEND_API_KEY set):", {
        name, business, email, phone, service, message,
      });
      return NextResponse.json({ ok: true });
    }

    const [notifyRes, replyRes] = await Promise.all([
      // Notify Duke
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Copper Bay Tech <noreply@copperbaytech.com>",
          to: ["duke@copperbaytech.com"],
          reply_to: email,
          subject: `New inquiry from ${safe.name} — ${safe.business}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${safe.name}</p>
            <p><strong>Business:</strong> ${safe.business}</p>
            <p><strong>Email:</strong> ${safe.email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${safe.phone}</p>` : ""}
            <p><strong>Service:</strong> ${safe.service}</p>
            ${message ? `<p><strong>Message:</strong><br>${safe.message}</p>` : ""}
          `,
        }),
      }),
      // Auto-reply to submitter
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Duke @ Copper Bay Tech <duke@copperbaytech.com>",
          to: [email],
          subject: "Got your message — Copper Bay Tech",
          html: `
            <p>Hi ${safe.name},</p>
            <p>Thanks for reaching out — I got your message and will be back to you within one business day.</p>
            <p>If anything's urgent, feel free to call or text me directly at <strong>(707) 239-6725</strong>.</p>
            <p>Talk soon,<br>Duke<br>Copper Bay Tech · Petaluma, CA</p>
            <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
            <p style="font-size:12px;color:#999;">Copper Bay Tech · Sonoma County IT & Web · copperbaytech.com</p>
          `,
        }),
      }),
    ]);

    // The internal notification is the critical one — if Duke never hears about
    // the inquiry, surface a failure so the form can show an error.
    if (!notifyRes.ok) {
      const errorBody = await notifyRes.text();
      console.error("Resend error (notify):", notifyRes.status, errorBody);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
    // The auto-reply is a courtesy — log if it fails but don't fail the request,
    // since the inquiry was already received and Duke was notified.
    if (!replyRes.ok) {
      console.error("Resend error (auto-reply):", replyRes.status, await replyRes.text());
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
