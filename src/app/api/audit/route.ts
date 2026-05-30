import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const apiKey = process.env.PAGESPEED_API_KEY;
    const apiBase = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
    const params = new URLSearchParams({
      url: normalizedUrl,
      strategy: "mobile",
      category: "performance",
      ...(apiKey ? { key: apiKey } : {}),
    });

    const response = await fetch(`${apiBase}?${params}`, {
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const rawMessage: string = err?.error?.message || "";
      const isQuota = rawMessage.toLowerCase().includes("quota") || response.status === 429;
      const message = isQuota
        ? "Daily audit limit reached — please try again tomorrow, or contact us directly and we'll run the audit for you."
        : rawMessage || "PageSpeed API error";
      return NextResponse.json({ error: message }, { status: isQuota ? 429 : 502 });
    }

    const data = await response.json();
    const cats = data.lighthouseResult?.categories;
    const audits = data.lighthouseResult?.audits;

    if (!cats || !audits) {
      return NextResponse.json({ error: "No data returned for this URL" }, { status: 502 });
    }

    const score = Math.round((cats.performance?.score ?? 0) * 100);

    const metric = (key: string) => {
      const a = audits[key];
      return {
        value: a?.displayValue ?? "N/A",
        score: a?.score ?? null,
        title: a?.title ?? key,
      };
    };

    const opportunities = Object.values(audits as Record<string, {
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
      fetchTime: data.lighthouseResult?.fetchTime,
    });
  } catch (err) {
    console.error("Audit error:", err);
    return NextResponse.json({ error: "Failed to run audit" }, { status: 500 });
  }
}
