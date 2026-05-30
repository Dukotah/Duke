import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log("Blog subscriber (no RESEND_API_KEY set):", email);
      return NextResponse.json({ ok: true });
    }

    // Notify duke@copperbaytech.com
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Copper Bay Tech <noreply@copperbaytech.com>",
        to: ["duke@copperbaytech.com"],
        subject: `New blog subscriber: ${email}`,
        html: `<p>New subscriber from the blog: <strong>${email}</strong></p>`,
      }),
    });

    // Welcome email to subscriber
    const welcomeRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Copper Bay Tech <noreply@copperbaytech.com>",
        to: [email],
        subject: "You're subscribed to Copper Bay Tech",
        html: `
          <p>Hey — thanks for subscribing.</p>
          <p>We'll send you a note when we publish something practical about IT, web development, or running a small business in Sonoma County. That's it.</p>
          <p>No weekly newsletters, no promotions. Just useful stuff when we write it.</p>
          <p>— Duke<br>Copper Bay Tech<br>(707) 239-6725 | duke@copperbaytech.com</p>
        `,
      }),
    });

    if (!welcomeRes.ok) {
      const errText = await welcomeRes.text();
      console.error("Resend welcome email error:", welcomeRes.status, errText);
      return NextResponse.json({ error: "Failed to send confirmation" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Subscribe route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
