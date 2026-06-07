import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { escapeHtml } from "@/lib/html";
import { rateLimit } from "@/lib/rate-limit";

const captureSchema = z.object({
  email: z.string().trim().email().max(254),
  name: z.string().trim().max(200).optional(),
  context: z.string().trim().max(200).optional(),
});

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: rl.message }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } });
  }

  try {
    const body = await req.json();

    const parsed = captureSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    const { email, name, context } = parsed.data;

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log("Lead capture (no RESEND_API_KEY):", { email, name, context });
      return NextResponse.json({ ok: true });
    }

    const displayName = name || "there";
    const displayContext = context || "website tool";

    const safeEmail = escapeHtml(email);
    const safeName = escapeHtml(name);
    const safeDisplayName = escapeHtml(displayName);
    const safeContext = escapeHtml(displayContext);

    await Promise.all([
      // Notify Duke
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Copper Bay Tech <noreply@copperbaytech.com>",
          to: ["contact@copperbaytech.com"],
          reply_to: email,
          subject: `New lead capture — ${displayContext}`,
          html: `
            <h2>New Lead Captured</h2>
            <p><strong>Email:</strong> ${safeEmail}</p>
            ${name ? `<p><strong>Name:</strong> ${safeName}</p>` : ""}
            <p><strong>Source:</strong> ${safeContext}</p>
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
            <p>Hi ${safeDisplayName},</p>
            <p>Thanks for using the ${safeContext} — I'll follow up personally if there's anything I can help with.</p>
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
