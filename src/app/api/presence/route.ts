import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { validateAuditUrl } from "@/lib/validate-url";

// Detects online-presence signals from a business homepage in a single fetch:
// social profiles, branding assets, and Google/local-business signals.
// All checks are heuristic (HTML-only) — they surface candidates for the
// instant report; Duke verifies the deeper picture in the human follow-up.

interface SocialLink {
  platform: string;
  url: string;
}

interface Signal {
  label: string;
  severity: "pass" | "warning" | "error";
  detail: string;
}

const SOCIAL_PATTERNS: Array<{ platform: string; re: RegExp }> = [
  { platform: "Facebook", re: /https?:\/\/(?:www\.)?facebook\.com\/[A-Za-z0-9.\-/_]+/i },
  { platform: "Instagram", re: /https?:\/\/(?:www\.)?instagram\.com\/[A-Za-z0-9.\-/_]+/i },
  { platform: "LinkedIn", re: /https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in)\/[A-Za-z0-9.\-/_]+/i },
  { platform: "X / Twitter", re: /https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[A-Za-z0-9_]+/i },
  { platform: "YouTube", re: /https?:\/\/(?:www\.)?youtube\.com\/(?:@|c\/|channel\/|user\/)[A-Za-z0-9.\-/_]+/i },
  { platform: "TikTok", re: /https?:\/\/(?:www\.)?tiktok\.com\/@[A-Za-z0-9.\-_]+/i },
  { platform: "Yelp", re: /https?:\/\/(?:www\.)?yelp\.com\/biz\/[A-Za-z0-9.\-/_]+/i },
];

function findFirst(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? m[0].replace(/["'<>].*$/, "") : null;
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

function pct(passed: number, total: number): number {
  return total === 0 ? 0 : Math.round((passed / total) * 100);
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
    const parsed = new URL(validated.url);
    const normalizedUrl = parsed.toString();

    let html = "";
    let reachable = false;
    try {
      const res = await fetch(normalizedUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; PresenceChecker/1.0; +https://copperbaytech.com)" },
        signal: AbortSignal.timeout(10000),
      });
      reachable = res.ok;
      html = await res.text();
    } catch {
      return NextResponse.json({
        verified: false,
        reachable: false,
        social: [],
        socialScore: 0,
        socialSignals: [{ label: "Website reachable", severity: "error", detail: "Couldn't load the site to inspect social links" }],
        branding: { brandingScore: 0, signals: [] },
        local: { localScore: 0, signals: [] },
      });
    }

    const lowerHtml = html.toLowerCase();

    // ── Social profiles ────────────────────────────────────────────────────────
    const social: SocialLink[] = [];
    for (const { platform, re } of SOCIAL_PATTERNS) {
      const hit = findFirst(html, re);
      if (hit && !social.some((s) => s.platform === platform)) {
        social.push({ platform, url: hit });
      }
    }
    const socialSignals: Signal[] = SOCIAL_PATTERNS.map(({ platform }) => {
      const found = social.find((s) => s.platform === platform);
      return found
        ? { label: platform, severity: "pass" as const, detail: "Profile linked from site" }
        : { label: platform, severity: "warning" as const, detail: "No profile linked" };
    });
    // Score: reward the platforms that matter most for a local business; cap at 4.
    const socialScore = Math.min(100, social.length * 25);

    // ── Branding ────────────────────────────────────────────────────────────────
    const hasFavicon = /<link[^>]+rel=["'][^"']*icon[^"']*["']/i.test(html);
    const hasAppleIcon = /<link[^>]+rel=["']apple-touch-icon["']/i.test(html);
    const ogImage = extractOG(html, "image");
    const themeColor = extractMeta(html, "theme-color");
    const hasLogoSchema = /"logo"\s*:/i.test(html);
    const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim();
    const ogTitle = extractOG(html, "title");

    const brandingChecks: Signal[] = [
      hasFavicon
        ? { label: "Favicon", severity: "pass", detail: "Site icon present in browser tabs" }
        : { label: "Favicon", severity: "error", detail: "No favicon — looks unfinished in browser tabs" },
      hasAppleIcon
        ? { label: "Mobile app icon", severity: "pass", detail: "Apple touch icon set for home-screen saves" }
        : { label: "Mobile app icon", severity: "warning", detail: "No apple-touch-icon for phone home screens" },
      ogImage
        ? { label: "Social share image", severity: "pass", detail: "Branded preview shows when links are shared" }
        : { label: "Social share image", severity: "error", detail: "No og:image — links share with no branding" },
      hasLogoSchema
        ? { label: "Logo / brand markup", severity: "pass", detail: "Logo declared in structured data" }
        : { label: "Logo / brand markup", severity: "warning", detail: "No logo in structured data for Google" },
      title && title.length >= 10
        ? { label: "Brand title", severity: "pass", detail: `"${title.slice(0, 60)}"` }
        : { label: "Brand title", severity: "error", detail: title ? "Title too short / generic" : "No page title set" },
      themeColor
        ? { label: "Brand color", severity: "pass", detail: `Theme color ${themeColor} set` }
        : { label: "Brand color", severity: "warning", detail: "No theme-color — browser UI is unbranded" },
    ];
    const brandingScore = pct(
      brandingChecks.filter((c) => c.severity === "pass").length,
      brandingChecks.length,
    );

    // ── Google / local presence (GBP proxy) ─────────────────────────────────────
    const hasLocalSchema =
      /"@type"\s*:\s*["'](?:LocalBusiness|Organization|[A-Za-z]*Store|Restaurant|ProfessionalService|HomeAndConstructionBusiness)["']/i.test(html);
    const hasPostalAddress = /"@type"\s*:\s*["']PostalAddress["']/i.test(html) || /"streetAddress"\s*:/i.test(html);
    const hasPhone = /href=["']tel:/i.test(html);
    const hasMapEmbed = /(?:google\.com\/maps|maps\.google\.|\/maps\/embed)/i.test(lowerHtml);
    const hasReviewSignal = social.some((s) => s.platform === "Yelp") || /"aggregateRating"|"review"\s*:/i.test(html);
    const hasOgTitle = !!ogTitle;

    const localChecks: Signal[] = [
      hasLocalSchema
        ? { label: "Local business markup", severity: "pass", detail: "Google can read your business type" }
        : { label: "Local business markup", severity: "error", detail: "No LocalBusiness schema — Google can't classify you" },
      hasPostalAddress
        ? { label: "Address (NAP)", severity: "pass", detail: "Structured address found for local search" }
        : { label: "Address (NAP)", severity: "warning", detail: "No structured address — hurts map rankings" },
      hasPhone
        ? { label: "Click-to-call phone", severity: "pass", detail: "Tappable phone number present" }
        : { label: "Click-to-call phone", severity: "warning", detail: "No tel: link — mobile callers can't tap" },
      hasMapEmbed
        ? { label: "Map / directions", severity: "pass", detail: "Google Maps location embedded" }
        : { label: "Map / directions", severity: "warning", detail: "No embedded map — add directions" },
      hasReviewSignal
        ? { label: "Reviews / ratings", severity: "pass", detail: "Review signals detected" }
        : { label: "Reviews / ratings", severity: "warning", detail: "No review signals — reviews drive local trust" },
      hasOgTitle
        ? { label: "Shareable identity", severity: "pass", detail: "Business name set for shares & profiles" }
        : { label: "Shareable identity", severity: "warning", detail: "No og:title — weak shared identity" },
    ];
    const localScore = pct(
      localChecks.filter((c) => c.severity === "pass").length,
      localChecks.length,
    );

    return NextResponse.json({
      verified: reachable,
      reachable,
      hostname: parsed.hostname,
      social,
      socialScore,
      socialSignals,
      branding: { brandingScore, signals: brandingChecks },
      local: { localScore, signals: localChecks },
    });
  } catch {
    return NextResponse.json({ error: "Failed to analyze presence" }, { status: 500 });
  }
}
