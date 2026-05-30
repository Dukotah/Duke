import { NextRequest, NextResponse } from "next/server";
import { validateAuditUrl } from "@/lib/validate-url";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rl = rateLimit(req, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: rl.message }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } });
  }

  try {
    const { url } = await req.json();

    const validated = validateAuditUrl(url);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.reason }, { status: 400 });
    }
    const normalizedUrl = validated.url;

    const apiKey = process.env.PAGESPEED_API_KEY;
    const apiBase = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
    const params = new URLSearchParams({
      url: normalizedUrl,
      strategy: "mobile",
      category: "performance",
      ...(apiKey ? { key: apiKey } : {}),
    });

    // Retry once on transient Lighthouse errors (NO_FCP, etc.)
    let data: Record<string, unknown> | null = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await fetch(`${apiBase}?${params}`, { next: { revalidate: 0 } });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const rawMessage: string = err?.error?.message || "";
        const isQuota = rawMessage.toLowerCase().includes("quota") || response.status === 429;
        const message = isQuota
          ? "Daily audit limit reached — please try again tomorrow, or contact us directly and we'll run the audit for you."
          : rawMessage || "PageSpeed API error";
        return NextResponse.json({ error: message }, { status: isQuota ? 429 : 502 });
      }

      const json = await response.json();
      const runtimeError: string = json.lighthouseResult?.runtimeError?.code ?? "";

      // NO_FCP and similar transient errors — retry once after a short delay
      if (runtimeError && attempt === 0) {
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }

      // Permanent runtime error on second attempt
      if (runtimeError) {
        return NextResponse.json(
          { error: "Lighthouse couldn't load this page — it may block automated testing, require a login, or be temporarily unavailable." },
          { status: 502 }
        );
      }

      data = json;
      break;
    }

    const cats = (data as Record<string, unknown> & { lighthouseResult?: { categories?: unknown; audits?: unknown } })?.lighthouseResult?.categories as Record<string, { score?: number }> | undefined;
    const audits = (data as Record<string, unknown> & { lighthouseResult?: { audits?: unknown } })?.lighthouseResult?.audits as Record<string, { displayValue?: string; score?: number | null; title?: string; description?: string; details?: { type?: string } }> | undefined;

    if (!cats || !audits) {
      return NextResponse.json({ error: "No data returned for this URL" }, { status: 502 });
    }

    const score = Math.round(((cats as Record<string, { score?: number }>).performance?.score ?? 0) * 100);

    const metric = (key: string) => {
      const a = (audits as Record<string, { displayValue?: string; score?: number | null; title?: string }>)[key];
      return {
        value: a?.displayValue ?? "N/A",
        score: a?.score ?? null,
        title: a?.title ?? key,
      };
    };

    const opportunities = Object.values(audits as unknown as Record<string, {
      details?: { type?: string };
      score?: number | null;
      title?: string;
      description?: string;
      displayValue?: string;
    }>)
      .filter(
        (a) =>
          a.details?.type === "opportunity" &&
          a.score !== null &&
          a.score !== undefined &&
          a.score < 0.9
      )
      .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
      .slice(0, 4)
      .map((a) => ({
        title: a.title,
        description: a.description,
        displayValue: a.displayValue,
        score: a.score,
      }));

    return NextResponse.json({
      url: normalizedUrl,
      score,
      metrics: {
        fcp: metric("first-contentful-paint"),
        lcp: metric("largest-contentful-paint"),
        tbt: metric("total-blocking-time"),
        cls: metric("cumulative-layout-shift"),
        si: metric("speed-index"),
        tti: metric("interactive"),
      },
      opportunities,
      fetchTime: (data as Record<string, unknown> & { lighthouseResult?: { fetchTime?: string } })?.lighthouseResult?.fetchTime,
    });
  } catch (err) {
    console.error("Audit error:", err);
    return NextResponse.json({ error: "Failed to run audit" }, { status: 500 });
  }
}
