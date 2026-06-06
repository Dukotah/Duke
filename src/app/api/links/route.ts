import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

interface LinkResult {
  url: string;
  status: number;
  text: string;
}

function extractLinks(html: string, baseUrl: string): Array<{ url: string; text: string }> {
  const base = new URL(baseUrl);
  const results: Array<{ url: string; text: string }> = [];
  const seen = new Set<string>();
  const re = /<a[^>]+href=["']([^"'#][^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;

  while ((m = re.exec(html)) !== null) {
    const href = m[1].trim();
    const rawText = m[2].replace(/<[^>]+>/g, "").trim().slice(0, 80) || href;

    let resolved: string;
    try {
      if (href.startsWith("http://") || href.startsWith("https://")) {
        resolved = href;
      } else if (href.startsWith("/")) {
        resolved = `${base.protocol}//${base.host}${href}`;
      } else if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
        continue;
      } else {
        resolved = new URL(href, baseUrl).href;
      }
    } catch {
      continue;
    }

    if (!seen.has(resolved)) {
      seen.add(resolved);
      results.push({ url: resolved, text: rawText });
    }
  }

  return results;
}

async function checkLink(url: string, text: string): Promise<LinkResult> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(5000),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkChecker/1.0)",
      },
    });
    return { url, status: res.status, text };
  } catch {
    return { url, status: 0, text };
  }
}

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

    let html: string;
    try {
      const res = await fetch(normalizedUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        signal: AbortSignal.timeout(10000),
      });
      html = await res.text();
    } catch {
      return NextResponse.json({ error: "Failed to fetch URL" }, { status: 502 });
    }

    const allLinks = extractLinks(html, normalizedUrl).slice(0, 20);

    const results = await Promise.all(
      allLinks.map((link) => checkLink(link.url, link.text))
    );

    const broken: LinkResult[] = results.filter((r) => r.status >= 400 || r.status === 0);
    const redirects: Array<LinkResult & { to: string }> = results
      .filter((r) => r.status === 301 || r.status === 302)
      .map((r) => ({ ...r, to: "" }));
    const ok = results.filter(
      (r) => r.status >= 200 && r.status < 300
    ).length;

    return NextResponse.json({
      total: results.length,
      broken,
      redirects,
      ok,
    });
  } catch {
    return NextResponse.json({ error: "Failed to check links" }, { status: 500 });
  }
}
