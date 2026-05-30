import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, url } = await req.json();
    if (!email) return NextResponse.json({ ok: true });

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log("Audit lead (no RESEND_API_KEY):", { email, url });
      return NextResponse.json({ ok: true });
    }

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Copper Bay Tech <noreply@copperbaytech.com>",
        to: ["contact@copperbaytech.com"],
        subject: `Audit lead: ${email} checked ${url}`,
        html: `
          <h2>New Audit Lead</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>URL audited:</strong> ${url}</p>
        `,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Audit lead route error:", err);
    return NextResponse.json({ ok: true });
  }
}
