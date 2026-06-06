import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getUserByEmail } from "@/lib/db";
import { OUTREACH_FROM } from "@/config/site";

const TOKEN_TTL = 60 * 60; // 1 hour in seconds

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Always return 200 to avoid email enumeration — don't reveal whether
    // the email exists in our system.
    const user = await getUserByEmail(email.trim().toLowerCase());
    if (!user || !user.active) {
      return NextResponse.json({ ok: true });
    }

    const redis = getRedis();
    const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    await redis.set(`reset:${token}`, user.id, { ex: TOKEN_TTL });

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    const resetLink = `${baseUrl}/crm/reset?token=${token}`;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log(`[Reset] No RESEND_API_KEY — reset link for ${email}: ${resetLink}`);
      return NextResponse.json({ ok: true });
    }

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `Copper Bay Tech <${OUTREACH_FROM}>`,
        to: [email],
        subject: "Reset your Copper Bay CRM password",
        text: `Hi ${user.name},\n\nClick the link below to reset your password. The link expires in 1 hour.\n\n${resetLink}\n\nIf you didn't request this, you can safely ignore this email.\n\n— Copper Bay Tech`,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Reset request]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
