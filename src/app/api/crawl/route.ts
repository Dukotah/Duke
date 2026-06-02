import { NextRequest, NextResponse } from "next/server";

interface CrawlCheck {
  label: string;
  severity: "pass" | "warning" | "error";
  detail: string;
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
    let parsed: URL;
    try {
      parsed = new URL(normalizedUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const base = `${parsed.protocol}//${parsed.host}`;
    const checks: CrawlCheck[] = [];
    const found: { robots?: string; sitemap?: string } = {};

    // Fetch main page HTML for meta robots
    let html = "";
    try {
      const res = await fetch(normalizedUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; CrawlChecker/1.0)" },
        signal: AbortSignal.timeout(8000),
      });
      html = await res.text();
    } catch {
      // continue without HTML checks
    }

    // Meta robots tag
    const metaRobots = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i)?.[1]
      ?? html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']robots["']/i)?.[1]
      ?? "";
    if (metaRobots) {
      const lower = metaRobots.toLowerCase();
      if (lower.includes("noindex")) {
        checks.push({ label: "Meta robots", severity: "error", detail: `"${metaRobots}" — page is blocked from Google index` });
      } else if (lower.includes("nofollow")) {
        checks.push({ label: "Meta robots", severity: "warning", detail: `"${metaRobots}" — links won't be followed by crawlers` });
      } else {
        checks.push({ label: "Meta robots", severity: "pass", detail: `"${metaRobots}"` });
      }
    } else {
      checks.push({ label: "Meta robots", severity: "pass", detail: "Not set — defaults to index, follow" });
    }

    // X-Robots-Tag header
    let xRobots = "";
    try {
      const headRes = await fetch(normalizedUrl, {
        method: "HEAD",
        headers: { "User-Agent": "Googlebot/2.1" },
        signal: AbortSignal.timeout(5000),
      });
      xRobots = headRes.headers.get("x-robots-tag") ?? "";
    } catch { /* ignore */ }

    if (xRobots) {
      const lower = xRobots.toLowerCase();
      if (lower.includes("noindex") || lower.includes("none")) {
        checks.push({ label: "X-Robots-Tag header", severity: "error", detail: `"${xRobots}" — page blocked via HTTP header` });
      } else {
        checks.push({ label: "X-Robots-Tag header", severity: "pass", detail: `"${xRobots}"` });
      }
    } else {
      checks.push({ label: "X-Robots-Tag header", severity: "pass", detail: "Not set — no header-level crawl restriction" });
    }

    // robots.txt
    try {
      const robotsUrl = `${base}/robots.txt`;
      const res = await fetch(robotsUrl, {
        signal: AbortSignal.timeout(5000),
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      if (res.ok) {
        const text = await res.text();
        found.robots = text;
        const hasDisallowAll = /Disallow:\s*\/\s*$/m.test(text);
        const sitemapInRobots = text.match(/Sitemap:\s*(https?:\/\/[^\s]+)/i)?.[1] ?? "";
        if (hasDisallowAll) {
          checks.push({ label: "robots.txt", severity: "error", detail: "Disallow: / found — entire site blocked from crawlers" });
        } else {
          checks.push({
            label: "robots.txt",
            severity: "pass",
            detail: sitemapInRobots
              ? `Found — references sitemap at ${sitemapInRobots.length > 50 ? sitemapInRobots.slice(0, 50) + "…" : sitemapInRobots}`
              : "Found — no sitemap reference",
          });
        }
        if (sitemapInRobots && !found.sitemap) {
          // try to use the sitemap URL from robots
          try {
            const smRes = await fetch(sitemapInRobots, { signal: AbortSignal.timeout(5000) });
            if (smRes.ok) found.sitemap = sitemapInRobots;
          } catch { /* ignore */ }
        }
      } else {
        checks.push({ label: "robots.txt", severity: "warning", detail: `Returns ${res.status} — search engines will crawl all pages without guidance` });
      }
    } catch {
      checks.push({ label: "robots.txt", severity: "warning", detail: "Could not fetch — may be unreachable" });
    }

    // sitemap.xml
    const sitemapUrls = [
      `${base}/sitemap.xml`,
      `${base}/sitemap_index.xml`,
      `${base}/sitemap/sitemap.xml`,
    ];
    let sitemapFound = !!found.sitemap;
    let sitemapUrl = found.sitemap ?? "";
    if (!sitemapFound) {
      for (const smUrl of sitemapUrls) {
        try {
          const res = await fetch(smUrl, { signal: AbortSignal.timeout(5000) });
          if (res.ok) {
            const text = await res.text();
            if (text.trim().startsWith("<?xml") || text.includes("<urlset") || text.includes("<sitemapindex")) {
              sitemapFound = true;
              sitemapUrl = smUrl;
              found.sitemap = text;
              break;
            }
          }
        } catch { /* try next */ }
      }
    }

    if (sitemapFound) {
      const urlCount = (typeof found.sitemap === "string" ? found.sitemap : "").split("<url>").length - 1;
      checks.push({
        label: "Sitemap",
        severity: "pass",
        detail: urlCount > 0
          ? `Found at ${sitemapUrl.replace(base, "")} — ${urlCount} URL${urlCount !== 1 ? "s" : ""}`
          : `Found at ${sitemapUrl.replace(base, "")}`,
      });
    } else {
      checks.push({ label: "Sitemap", severity: "warning", detail: "No sitemap.xml found — crawlers must discover pages by following links" });
    }

    // Favicon
    const hasFavicon =
      /<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href/i.test(html) ||
      /<link[^>]+href[^>]+rel=["'][^"']*icon[^"']*["']/i.test(html);
    let faviconViaDefault = false;
    if (!hasFavicon) {
      try {
        const fRes = await fetch(`${base}/favicon.ico`, { method: "HEAD", signal: AbortSignal.timeout(4000) });
        faviconViaDefault = fRes.ok;
      } catch { /* ignore */ }
    }
    if (hasFavicon || faviconViaDefault) {
      checks.push({ label: "Favicon", severity: "pass", detail: hasFavicon ? "Declared in HTML" : "Default /favicon.ico present" });
    } else {
      checks.push({ label: "Favicon", severity: "warning", detail: "No favicon — affects brand recognition in tabs and bookmarks" });
    }

    // Structured data (JSON-LD)
    const hasJsonLd = /<script[^>]+type=["']application\/ld\+json["']/i.test(html);
    if (hasJsonLd) {
      const types: string[] = [];
      const re = /"@type"\s*:\s*"([^"]+)"/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(html)) !== null) types.push(m[1]);
      checks.push({ label: "Structured data", severity: "pass", detail: types.length ? `JSON-LD found: ${[...new Set(types)].join(", ")}` : "JSON-LD script tag present" });
    } else {
      checks.push({ label: "Structured data", severity: "warning", detail: "No JSON-LD — structured data helps Google understand your content" });
    }

    const passed = checks.filter(c => c.severity === "pass").length;
    const score = Math.round((passed / checks.length) * 100);

    return NextResponse.json({ url: normalizedUrl, score, checks });
  } catch {
    return NextResponse.json({ error: "Failed to check crawlability" }, { status: 500 });
  }
}
