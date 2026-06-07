import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { assertSafeUrl } from "@/lib/ssrf";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    const rl = rateLimit(req, { limit: 10, windowMs: 60_000 });
    if (!rl.ok) {
      return NextResponse.json({ error: rl.message }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } });
    }

    try {
          const { url } = await req.json();

      if (!url || typeof url !== "string") {
              return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
      }

      // Normalize + SSRF-guard the user-supplied URL before handing it to the PageSpeed API
      let normalizedUrl: string;
      try {
              normalizedUrl = (await assertSafeUrl(url)).toString();
      } catch {
              return NextResponse.json({ error: "Invalid or disallowed URL" }, { status: 400 });
      }

      const apiKey = process.env.PAGESPEED_API_KEY;
          const apiBase = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

      // Try mobile first, then fall back to desktop on NO_FCP
      const strategies = ["mobile", "desktop"];
          let data: Record<string, unknown> | null = null;

      for (const strategy of strategies) {
              const params = new URLSearchParams({
                        url: normalizedUrl,
                        strategy,
                        category: "performance",
                        ...(apiKey ? { key: apiKey } : {}),
              });

            // Retry up to 3 times with increasing delays
            const delays = [0, 4000, 8000];
              let lastRuntimeError = "";

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
                              ? "Daily audit limit reached — please try again tomorrow, or contact us directly and we'll run the audit for you."
                                          : rawMessage || "PageSpeed API error";
                            return NextResponse.json({ error: message }, { status: isQuota ? 429 : 502 });
                }

                const json = await response.json();
                      const runtimeError: string = json.lighthouseResult?.runtimeError?.code ?? "";

                if (runtimeError) {
                            lastRuntimeError = runtimeError;
                            // Continue to next attempt
                        continue;
                }

                data = json;
                      break;
            }

            if (data) break;
              if (lastRuntimeError) continue; // try next strategy
      }

      if (!data) {
              return NextResponse.json(
                { error: "Speed test unavailable for this page right now — it may use JavaScript that requires interaction, or the server may be throttling automated checks. Try again in a few minutes." },
                { status: 502 }
                      );
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
              verified: true,
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
