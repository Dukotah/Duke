import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    const limit = rateLimit(req, { limit: 10, windowMs: 60_000 });
    if (!limit.ok) return NextResponse.json({ error: limit.message }, { status: 429 });
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

      // Try mobile first, then fall back to desktop on NO_FCP
      const strategies = ["mobile", "desktop"];
          let cats: Record<string, { score?: number }> | null = null;
          let audits: Record<string, { score?: number }> | null = null;

      for (const strategy of strategies) {
              const params = new URLSearchParams({
                        url: normalizedUrl,
                        strategy,
                        ...(apiKey ? { key: apiKey } : {}),
              });
              categories.forEach((c) => params.append("category", c));

            // Retry up to 3 times with increasing delays
            const delays = [0, 4000, 8000];
              let gotData = false;

            for (let attempt = 0; attempt < 3; attempt++) {
                      if (delays[attempt] > 0) {
                                  await new Promise(r => setTimeout(r, delays[attempt]));
                      }

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

                if (runtimeError) {
                            continue; // retry
                }

                cats = json.lighthouseResult?.categories ?? null;
                      audits = json.lighthouseResult?.audits ?? null;
                      gotData = true;
                      break;
            }

            if (gotData) break;
      }

      if (!cats || !audits) {
              return NextResponse.json(
                { error: "Mobile check unavailable for this page right now — the site may use JavaScript that requires interaction, or the server may be throttling automated checks. Try again in a few minutes." },
                { status: 502 }
                      );
      }

      const accessibilityScore = Math.round((cats.accessibility?.score ?? 0) * 100);
          const seoScore = Math.round((cats.seo?.score ?? 0) * 100);
          const bestPracticesScore = Math.round((cats["best-practices"]?.score ?? 0) * 100);

      const mobileScore = Math.round((accessibilityScore + seoScore + bestPracticesScore) / 3);

      const viewport = (audits as Record<string, { score?: number }>)["viewport"]?.score === 1;
          const textSizeOk = (audits as Record<string, { score?: number }>)["font-size"]?.score === 1;
          const tapTargetsOk = (audits as Record<string, { score?: number }>)["tap-targets"]?.score === 1;

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
