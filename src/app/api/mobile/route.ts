import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

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

    const categories = ["accessibility", "seo", "best-practices"];
    const params = new URLSearchParams({
      url: normalizedUrl,
      strategy: "mobile",
      ...(apiKey ? { key: apiKey } : {}),
    });
    categories.forEach((c) => params.append("category", c));

    // Retry once on transient Lighthouse errors (NO_FCP, etc.)
    let cats: Record<string, { score?: number }> | null = null;
    let audits: Record<string, { score?: number }> | null = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await fetch(`${apiBase}?${params}`, { next: { revalidate: 0 } });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const rawMessage: string = err?.error?.message || "";
        const isQuota = rawMessage.toLowerCase().includes("quota") || response.status === 429;
        const message = isQuota
          ? "Daily audit limit reached — please try again tomorrow."
          : rawMessage || "PageSpeed API error";
        return NextResponse.json({ error: message }, { status: isQuota ? 429 : 502 });
      }

      const json = await response.json();
      const runtimeError: string = json.lighthouseResult?.runtimeError?.code ?? "";

      if (runtimeError && attempt === 0) {
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }

      if (runtimeError) {
        return NextResponse.json(
          { error: "Lighthouse couldn't load this page — it may block automated testing, require a login, or be temporarily unavailable." },
          { status: 502 }
        );
      }

      cats = json.lighthouseResult?.categories ?? null;
      audits = json.lighthouseResult?.audits ?? null;
      break;
    }

    if (!cats || !audits) {
      return NextResponse.json({ error: "No data returned for this URL" }, { status: 502 });
    }

    // PageSpeed mobile score (performance) - try fetching performance category too
    // We only requested accessibility, seo, best-practices so no performance score
    const accessibilityScore = Math.round((cats.accessibility?.score ?? 0) * 100);
    const seoScore = Math.round((cats.seo?.score ?? 0) * 100);
    const bestPracticesScore = Math.round((cats["best-practices"]?.score ?? 0) * 100);

    // For mobile score we use the average of the three or a composite
    const mobileScore = Math.round((accessibilityScore + seoScore + bestPracticesScore) / 3);

    // Extract specific audits
    const viewport = audits["viewport"]?.score === 1;
    const textSizeOk = audits["font-size"]?.score === 1;
    const tapTargetsOk = audits["tap-targets"]?.score === 1;

    return NextResponse.json({
      mobileScore,
      accessibilityScore,
      seoScore,
      bestPracticesScore,
      viewport,
      textSizeOk,
      tapTargetsOk,
      url: normalizedUrl,
    });
  } catch (err) {
    console.error("Mobile audit error:", err);
    return NextResponse.json({ error: "Failed to run mobile check" }, { status: 500 });
  }
}
