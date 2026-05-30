import { NextRequest, NextResponse } from "next/server";
import { validateAuditUrl } from "@/lib/validate-url";

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

async function checkLink(url: string, text: string): Promise<LinkResult & { to: string }> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(5000),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; CopperBayLinkChecker/1.0)",
      },
    });
    // Capture the Location header for redirects so the UI can show where they go
    const to = (res.status === 301 || res.status === 302 || res.status === 307 || res.status === 308)
      ? (res.headers.get("Location") ?? "")
      : "";
    return { url, status: res.status, text, to };
  } catch {
    return { url, status: 0, text, to: "" };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    const validated = validateAuditUrl(url);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.reason }, { status: 400 });
    }
    const normalizedUrl = validated.url;

    let html: string;
    try {
      const res = await fetch(normalizedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
        },
        signal: AbortSignal.timeout(10000),
      });
      html = await res.text();
    } catch {
      return NextResponse.json({ error: "Failed to fetch URL" }, { status: 502 });
    }

    const allLinks = extractLinks(html, normalizedUrl).slice(0, 20);
    const results = await Promise.all(allLinks.map(link => checkLink(link.url, link.text)));

    const broken: LinkResult[] = results.filter(r => r.status >= 400 || r.status === 0);
    const redirects = results.filter(r => r.status === 301 || r.status === 302 || r.status === 307 || r.status === 308);
    const ok = results.filter(r => r.status >= 200 && r.status < 300).length;

    return NextResponse.json({ total: results.length, broken, redirects, ok });
  } catch {
    return NextResponse.json({ error: "Failed to check links" }, { status: 500 });
  }
}
