import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { captureToolLead } from "@/lib/crm/intake";
import { buildReportHtml, type BiggestImprovementArgs } from "@/lib/businessAnalysis/report";

// Closes the loop on the free Business Analysis tool: persists the scored lead
// into the CRM (best-effort) and emails the promised full report. Mirrors the
// rate-limit + Resend-gating conventions used by /api/capture and /api/ada.

const scoresSchema = z.object({
  overall: z.number(),
  website: z.number(),
  local: z.number(),
  social: z.number(),
  branding: z.number(),
});

const signalsSchema = z.object({
  reachable: z.boolean(),
  perf: z.number().nullable(),
  sslOk: z.boolean(),
  seo: z.number().nullable(),
  local: z.number(),
  social: z.number(),
  branding: z.number(),
});

const submitSchema = z.object({
  email: z.string().trim().email().max(254),
  website: z.string().trim().max(2048),
  businessName: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(40).optional(),
  scores: scoresSchema,
  grade: z.string().trim().max(2),
  recommendedService: z.string().trim().max(120),
  signals: signalsSchema.optional(),
  honeypot: z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: rl.message },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  try {
    const body = await req.json();

    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }
    const {
      email,
      website,
      businessName,
      phone,
      scores,
      grade,
      recommendedService,
      signals,
      honeypot,
    } = parsed.data;

    // Silent bot drop: a filled honeypot means a bot — return ok without
    // creating a lead or sending mail, so the bot can't tell it was caught.
    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    // Land the scored hand-raiser in the /crm queue as a warm tier-A lead via
    // the canonical tool-intake (idempotent per email/host, admin-owned). Grade,
    // recommended service and phone ride along in the note so Duke sees the
    // result at a glance. Non-fatal: a Redis/CRM hiccup must not break the
    // visitor-facing report response.
    const context = `Business Analysis — ${website}${grade ? ` — Grade ${grade}` : ""}${
      recommendedService ? `, recommends ${recommendedService}` : ""
    }${phone ? ` · phone ${phone}` : ""}`;
    try {
      await captureToolLead({ email, name: businessName, website, context });
    } catch (err) {
      console.error("Business Analysis → CRM lead failed (non-fatal):", err);
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log("Business Analysis submit (no RESEND_API_KEY):", {
        email,
        businessName,
        website,
        grade,
        recommendedService,
      });
      return NextResponse.json({ ok: true });
    }

    const html = buildReportHtml({
      businessName,
      website,
      scores,
      grade,
      signals: signals as BiggestImprovementArgs | undefined,
      recommendedService,
    });

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Duke @ Copper Bay Tech <contact@copperbaytech.com>",
        to: [email],
        reply_to: "contact@copperbaytech.com",
        subject: `Your Business Analysis report${grade ? ` — Grade ${grade}` : ""}`,
        html,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Business Analysis submit route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
