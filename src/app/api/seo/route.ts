import { NextRequest, NextResponse } from "next/server";
import { validateAuditUrl } from "@/lib/validate-url";
import { rateLimit } from "@/lib/rate-limit";

interface SEOIssue {
  label: string;
  severity: "pass" | "warning" | "error";
  detail: string;
}

function extractMeta(html: string, name: string): string {
  const m =
    html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["']`, "i")) ||
    html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${name}["']`, "i"));
  return m ? m[1] : "";
}

function extractOG(html: string, prop: string): string {
  const m =
    html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']*)["']`, "i")) ||
    html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:${prop}["']`, "i"));
  return m ? m[1] : "";
}

function extractH1s(html: string): string[] {
  const results: string[] = [];
  const re = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const text = m[1].replace(/<[^>]+>/g, "").trim();
    if (text) results.push(text);
  }
  return results;
}

function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? m[1].trim() : "";
}

function extractCanonical(html: string): string {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i) ||
    html.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  return m ? m[1] : "";
}

function extractRobots(html: string): string {
  return extractMeta(html, "robots");
}

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

    const issues: SEOIssue[] = [];

    // Title
    const title = extractTitle(html);
    if (!title) {
      issues.push({ label: "Title tag", severity: "error", detail: "Missing — required for SEO" });
    } else if (title.length < 10) {
      issues.push({ label: "Title tag", severity: "warning", detail: `"${title}" — ${title.length} chars, too short (aim 30–60)` });
    } else if (title.length > 60) {
      issues.push({ label: "Title tag", severity: "warning", detail: `"${title.slice(0, 50)}…" — ${title.length} chars, too long (aim ≤60)` });
    } else {
      issues.push({ label: "Title tag", severity: "pass", detail: `"${title}" — ${title.length} chars` });
    }

    // Meta description
    const desc = extractMeta(html, "description");
    if (!desc) {
      issues.push({ label: "Meta description", severity: "error", detail: "Missing — helps click-through rates" });
    } else if (desc.length < 50) {
      issues.push({ label: "Meta description", severity: "warning", detail: `"${desc}" — ${desc.length} chars, too short (aim 120–158)` });
    } else if (desc.length > 158) {
      issues.push({ label: "Meta description", severity: "warning", detail: `${desc.length} chars, too long (aim ≤158)` });
    } else {
      issues.push({ label: "Meta description", severity: "pass", detail: `${desc.length} chars` });
    }

    // H1 tags
    const h1s = extractH1s(html);
    if (h1s.length === 0) {
      issues.push({ label: "H1 heading", severity: "error", detail: "No H1 found — every page needs one" });
    } else if (h1s.length > 1) {
      issues.push({ label: "H1 heading", severity: "warning", detail: `${h1s.length} H1s found — use only one per page` });
    } else {
      issues.push({ label: "H1 heading", severity: "pass", detail: `"${h1s[0].slice(0, 60)}"` });
    }

    // OG Title
    const ogTitle = extractOG(html, "title");
    if (!ogTitle) {
      issues.push({ label: "OG title", severity: "warning", detail: "Missing og:title — affects social sharing" });
    } else {
      issues.push({ label: "OG title", severity: "pass", detail: `"${ogTitle.slice(0, 50)}"` });
    }

    // OG Description
    const ogDesc = extractOG(html, "description");
    if (!ogDesc) {
      issues.push({ label: "OG description", severity: "warning", detail: "Missing og:description" });
    } else {
      issues.push({ label: "OG description", severity: "pass", detail: `${ogDesc.length} chars` });
    }

    // OG Image
    const ogImage = extractOG(html, "image");
    if (!ogImage) {
      issues.push({ label: "OG image", severity: "warning", detail: "Missing og:image — no preview on social" });
    } else {
      issues.push({ label: "OG image", severity: "pass", detail: ogImage.length > 60 ? ogImage.slice(0, 60) + "…" : ogImage });
    }

    // Canonical
    const canonical = extractCanonical(html);
    if (!canonical) {
      issues.push({ label: "Canonical URL", severity: "warning", detail: "Missing — can cause duplicate content issues" });
    } else {
      issues.push({ label: "Canonical URL", severity: "pass", detail: canonical.length > 60 ? canonical.slice(0, 60) + "…" : canonical });
    }

    // Robots
    const robots = extractRobots(html);
    if (robots && (robots.toLowerCase().includes("noindex") || robots.toLowerCase().includes("nofollow"))) {
      issues.push({ label: "Robots meta", severity: "error", detail: `"${robots}" — page is blocked from indexing` });
    } else if (robots) {
      issues.push({ label: "Robots meta", severity: "pass", detail: `"${robots}"` });
    } else {
      issues.push({ label: "Robots meta", severity: "pass", detail: "Not set (defaults to index, follow)" });
    }

    const passed = issues.filter((i) => i.severity === "pass").length;
    const score = Math.round((passed / issues.length) * 100);

    return NextResponse.json({
      url: normalizedUrl,
      score,
      issues,
      title,
      description: desc,
    });
  } catch {
    return NextResponse.json({ error: "Failed to analyze SEO" }, { status: 500 });
  }
}
