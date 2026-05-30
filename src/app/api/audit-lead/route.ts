import { NextRequest, NextResponse } from "next/server";

function scoreColor(score: number) {
  if (score >= 90) return "#22c55e";
  if (score >= 50) return "#f97316";
  return "#ef4444";
}

function scoreLabel(score: number) {
  if (score >= 90) return "Good";
  if (score >= 50) return "Needs Work";
  return "Poor";
}

function metricRow(label: string, value: string, score: number | null) {
  const color = score === null ? "#888" : score >= 0.9 ? "#22c55e" : score >= 0.5 ? "#f97316" : "#ef4444";
  return `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;color:#444;font-size:14px;">${label}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-weight:600;font-size:14px;color:${color};">${value}</td>
    </tr>`;
}

export async function POST(req: NextRequest) {
  try {
    const { email, url, auditData } = await req.json();
    if (!email) return NextResponse.json({ ok: true });

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.log("Audit lead (no RESEND_API_KEY):", { email, url });
      return NextResponse.json({ ok: true });
    }

    const score: number = auditData?.score ?? 0;
    const metrics = auditData?.metrics ?? {};
    const opportunities: { title?: string; displayValue?: string }[] = auditData?.opportunities ?? [];

    const opportunityRows = opportunities
      .filter((o) => o.title)
      .map((o) => `<li style="margin-bottom:8px;color:#444;font-size:14px;">
        <strong>${o.title}</strong>${o.displayValue ? ` — ${o.displayValue}` : ""}
      </li>`)
      .join("");

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9f9f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:#18181B;padding:32px;text-align:center;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#f97316;">Copper Bay Tech</p>
      <h1 style="margin:0;font-size:26px;font-weight:800;color:#fff;">Your Website Speed Report</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.5);font-size:14px;">${url}</p>
    </div>

    <!-- Score -->
    <div style="padding:32px;text-align:center;border-bottom:1px solid #f0f0f0;">
      <div style="display:inline-block;width:100px;height:100px;border-radius:50%;background:${scoreColor(score)}18;border:4px solid ${scoreColor(score)};line-height:92px;">
        <span style="font-size:32px;font-weight:800;color:${scoreColor(score)};">${score}</span>
      </div>
      <p style="margin:12px 0 4px;font-size:18px;font-weight:700;color:#18181B;">Performance Score: <span style="color:${scoreColor(score)};">${scoreLabel(score)}</span></p>
      <p style="margin:0;font-size:14px;color:#888;">Google uses this score as a ranking signal</p>
    </div>

    <!-- Metrics -->
    <div style="padding:24px 32px;">
      <h2 style="margin:0 0 16px;font-size:16px;font-weight:700;color:#18181B;">Core Web Vitals</h2>
      <table style="width:100%;border-collapse:collapse;background:#fafaf9;border-radius:8px;overflow:hidden;">
        ${metricRow("First Contentful Paint", metrics.fcp?.value ?? "N/A", metrics.fcp?.score ?? null)}
        ${metricRow("Largest Contentful Paint", metrics.lcp?.value ?? "N/A", metrics.lcp?.score ?? null)}
        ${metricRow("Total Blocking Time", metrics.tbt?.value ?? "N/A", metrics.tbt?.score ?? null)}
        ${metricRow("Cumulative Layout Shift", metrics.cls?.value ?? "N/A", metrics.cls?.score ?? null)}
        ${metricRow("Speed Index", metrics.si?.value ?? "N/A", metrics.si?.score ?? null)}
      </table>
    </div>

    <!-- Opportunities -->
    ${opportunityRows ? `
    <div style="padding:0 32px 24px;">
      <h2 style="margin:0 0 12px;font-size:16px;font-weight:700;color:#18181B;">Top Issues to Fix</h2>
      <ul style="margin:0;padding:0 0 0 20px;">${opportunityRows}</ul>
    </div>` : ""}

    <!-- CTA -->
    <div style="background:#f9f9f7;padding:28px 32px;text-align:center;border-top:1px solid #f0f0f0;">
      <p style="margin:0 0 8px;font-size:15px;font-weight:600;color:#18181B;">Want these issues fixed?</p>
      <p style="margin:0 0 20px;font-size:14px;color:#888;">I'm Duke, a local web developer in Petaluma. I fix exactly these kinds of issues for Sonoma County businesses — faster sites, better rankings, more customers.</p>
      <a href="https://copperbaytech.com/#contact" style="display:inline-block;background:#f97316;color:#fff;font-weight:700;font-size:14px;text-decoration:none;padding:12px 28px;border-radius:8px;">Book a free 15-min call</a>
      <p style="margin:16px 0 0;font-size:12px;color:#bbb;">Or call/text (707) 239-6725 · copperbaytech.com</p>
    </div>

  </div>
</body>
</html>`;

    // Send report to the visitor
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Duke at Copper Bay Tech <contact@copperbaytech.com>",
        to: [email],
        subject: `Your website scored ${score}/100 — here's what to fix`,
        html,
      }),
    });

    // Also notify yourself
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Copper Bay Tech <noreply@copperbaytech.com>",
        to: ["contact@copperbaytech.com"],
        subject: `Audit lead: ${email} — score ${score} for ${url}`,
        html: `<p><strong>Email:</strong> ${email}</p><p><strong>URL:</strong> ${url}</p><p><strong>Score:</strong> ${score}/100</p>`,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Audit lead route error:", err);
    return NextResponse.json({ ok: true });
  }
}
