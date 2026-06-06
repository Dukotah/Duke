import { NextRequest, NextResponse } from "next/server";
import { captureToolLead, toolLabel } from "@/lib/crm/intake";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const rl = await rateLimit(`capture:${clientIp(req)}`, { limit: 10, windowSec: 600 });
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests — please try again shortly." }, { status: 429 });
    }
    const body = await req.json();
    const { email, name, context, website } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Land every free-tool hand-raiser in the /crm queue as a warm tier-A lead,
    // carrying the tool's own result summary as the note. Non-fatal and
    // independent of email sending, so a Redis/CRM hiccup never breaks the
    // visitor-facing capture (and leads still land even without RESEND configured).
    try {
      await captureToolLead({ email, name, website, context: context ?? "Free tool" });
    } catch (err) {
      console.error("Capture → CRM lead failed (non-fatal):", err);
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log("Lead capture (no RESEND_API_KEY):", { email, name, context });
      return NextResponse.json({ ok: true });
    }

    const displayName = name?.trim() || "there";
    // Full context (with URL + findings) for Duke's own notification; a clean tool
    // name for the customer-facing auto-reply so it doesn't echo a raw URL back.
    const displayContext = context || "website tool";
    const customerTool = context ? toolLabel(context) : "website tool";

    await Promise.all([
      // Notify Duke
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Copper Bay Tech <contact@copperbaytech.com>",
          to: ["contact@copperbaytech.com"],
          reply_to: email,
          subject: `New lead capture — ${displayContext}`,
          html: `
            <h2>New Lead Captured</h2>
            <p><strong>Email:</strong> ${email}</p>
            ${name ? `<p><strong>Name:</strong> ${name}</p>` : ""}
            <p><strong>Source:</strong> ${displayContext}</p>
          `,
        }),
      }),
      // Auto-reply to the lead
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Duke @ Copper Bay Tech <contact@copperbaytech.com>",
          to: [email],
          subject: "Your results from Copper Bay Tech",
          html: `
            <p>Hi ${displayName},</p>
            <p>Thanks for using the ${customerTool} — I'll follow up personally if there's anything I can help with.</p>
            <p>In the meantime, if you have questions or want to talk through what you found, feel free to reply to this email or call/text me at (707) 239-6725.</p>
            <p>— Duke<br>Copper Bay Tech<br>Petaluma, CA</p>
            <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
            <p style="font-size:12px;color:#999;">Copper Bay Tech · Serving Sonoma County · copperbaytech.com</p>
          `,
        }),
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Capture route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
