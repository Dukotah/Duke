import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, business, email, phone, service, message } = body;

    if (!name || !business || !email || !service) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log("Contact form submission (no RESEND_API_KEY set):", {
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
          from: "Copper Bay Tech <noreply@copperbaytech.com>",
          to: ["duke@copperbaytech.com"],
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
          from: "Duke @ Copper Bay Tech <duke@copperbaytech.com>",
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
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
