import { NextRequest, NextResponse } from "next/server";

interface LinkResult {
  url: string;
  status: number;
  text: string;
  location?: string;
}

const REDIRECT_CODES = new Set([301, 302, 303, 307, 308]);

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
  const headers = { "User-Agent": "Mozilla/5.0 (compatible; LinkChecker/1.0)" };
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(5000),
      headers,
    });

    // Some servers reject HEAD (405/501) — fall back to a lightweight GET so
    // we don't report a working link as broken.
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(5000),
        headers,
      });
    }

    const location = REDIRECT_CODES.has(res.status)
      ? res.headers.get("location") ?? undefined
      : undefined;
    return { url, status: res.status, text, location };
  } catch {
    return { url, status: 0, text };
  }
}

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
      .filter((r) => REDIRECT_CODES.has(r.status))
      .map((r) => {
        // Resolve relative Location headers against the link's own URL.
        let to = r.location ?? "";
        if (to) {
          try {
            to = new URL(to, r.url).href;
          } catch {
            /* leave as-is if it won't parse */
          }
        }
        return { ...r, to };
      });
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
