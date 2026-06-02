import { NextRequest, NextResponse } from "next/server";
import { escapeHtml } from "@/lib/html";
import { isValidEmail } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, context } = body;

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log("Lead capture (no RESEND_API_KEY):", { email, name, context });
      return NextResponse.json({ ok: true });
    }

    const displayName = name?.trim() || "there";
    const displayContext = context || "website tool";
    // Escape everything user-supplied before it goes into an HTML email body.
    const safe = {
      email: escapeHtml(email),
      name: escapeHtml(name),
      displayName: escapeHtml(displayName),
      context: escapeHtml(displayContext),
    };

    const [notifyRes, replyRes] = await Promise.all([
      // Notify Duke
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Copper Bay Tech <noreply@copperbaytech.com>",
          to: ["duke@copperbaytech.com"],
          reply_to: email,
          subject: `New lead capture — ${displayContext}`,
          html: `
            <h2>New Lead Captured</h2>
            <p><strong>Email:</strong> ${safe.email}</p>
            ${name ? `<p><strong>Name:</strong> ${safe.name}</p>` : ""}
            <p><strong>Source:</strong> ${safe.context}</p>
          `,
        }),
      }),
      // Auto-reply to the lead
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Duke @ Copper Bay Tech <duke@copperbaytech.com>",
          to: [email],
          subject: "Your results from Copper Bay Tech",
          html: `
            <p>Hi ${safe.displayName},</p>
            <p>Thanks for using the ${safe.context} — I'll follow up personally if there's anything I can help with.</p>
            <p>In the meantime, if you have questions or want to talk through what you found, feel free to reply to this email or call/text me at (707) 239-6725.</p>
            <p>— Duke<br>Copper Bay Tech<br>Petaluma, CA</p>
            <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
            <p style="font-size:12px;color:#999;">Copper Bay Tech · Serving Sonoma County · copperbaytech.com</p>
          `,
        }),
      }),
    ]);

    // Fetch only rejects on network errors, so check the HTTP status too. A
    // captured lead shouldn't break the visitor's tool experience, so log
    // failures rather than returning an error to them.
    if (!notifyRes.ok) {
      console.error("Resend error (lead notify):", notifyRes.status, await notifyRes.text());
    }
    if (!replyRes.ok) {
      console.error("Resend error (lead auto-reply):", replyRes.status, await replyRes.text());
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Capture route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
