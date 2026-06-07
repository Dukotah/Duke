// Shared "biggest opportunity" rule engine + server-side report-HTML generator
// for the free Business Analysis tool.
//
// The /business-analysis page (client) computes the four sub-scores and renders
// the results. The /api/business-analysis/submit route (server) emails the
// promised full report. Both must agree on which fix is the "biggest
// opportunity" and on the recommended service — so that logic lives here, in one
// place, and is imported by both. (The page imports `biggestImprovement` /
// `Improvement`; the route imports `buildReportHtml`.)
//
// All user-supplied values (business name, website) are escaped via
// `@/lib/html` escapeHtml before they touch the HTML email body.

import { escapeHtml } from "@/lib/html";

// ── Biggest-improvement rule engine ──────────────────────────────────────────

export interface Improvement {
  title: string;
  why: string;
  action: string;
  service: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface BiggestImprovementArgs {
  reachable: boolean;
  perf: number | null;
  sslOk: boolean;
  seo: number | null;
  local: number;
  social: number;
  branding: number;
}

const AI_RECEPTIONIST_FALLBACK: Improvement = {
  title: "Capture leads 24/7 with an AI assistant",
  why: "Your fundamentals are solid — the biggest gain now is converting more of the traffic you already get. Most missed leads happen after hours.",
  action:
    "Add an AI receptionist that answers calls and website chat, books appointments, and never misses a lead.",
  service: "AI Integration",
  ctaLabel: "See AI Integration",
  ctaHref: "/ai-integration-small-business",
};

// Each rule is a guard (does this opportunity actually apply?) paired with the
// improvement copy. Evaluated top-to-bottom; the first applicable rule wins.
// Crucially, a rule only fires when the underlying category is genuinely weak —
// so a category that scored as *passing* can never surface as the "biggest
// opportunity". If none apply, we fall through to the AI-receptionist fallback.
const RULES: { applies: (a: BiggestImprovementArgs) => boolean; improvement: Improvement }[] = [
  {
    applies: (a) => !a.reachable,
    improvement: {
      title: "Get a website that actually loads",
      why: "We couldn't reach your site. Every day it's down or missing, customers searching for you find a competitor instead.",
      action:
        "Stand up a fast, professional, mobile-first website that turns searches into calls.",
      service: "Web Design",
      ctaLabel: "Fix my website",
      ctaHref: "/web-design-sonoma-county",
    },
  },
  {
    applies: (a) => !a.sslOk,
    improvement: {
      title: "Secure your site with HTTPS",
      why: "Your site isn't showing a valid security certificate. Browsers flag it as “Not secure,” which scares away visitors and tanks Google rankings.",
      action: "Install and auto-renew SSL so every visitor sees the trusted padlock.",
      service: "Web Design",
      ctaLabel: "Secure my site",
      ctaHref: "/#contact",
    },
  },
  {
    applies: (a) => a.local < 50,
    improvement: {
      title: "Claim & optimize your Google Business Profile",
      why: "Your local-search signals are weak. For a local business this is the single highest-ROI fix — the map pack is where ready-to-buy customers look first.",
      action:
        "Optimize your Google Business Profile and add local schema, address, and reviews so you show up in the map pack.",
      service: "Web Design + Local SEO",
      ctaLabel: "Boost my local presence",
      ctaHref: "/web-design-sonoma-county",
    },
  },
  {
    applies: (a) => a.perf !== null && a.perf < 50,
    improvement: {
      title: "Speed up your website",
      why: "Your site is slow. Over half of mobile visitors leave a page that takes more than 3 seconds — that's leads walking out the door.",
      action:
        "Rebuild on a fast, modern stack and optimize images so pages load in under 2 seconds.",
      service: "Web Design",
      ctaLabel: "Make my site fast",
      ctaHref: "/web-design-sonoma-county",
    },
  },
  {
    applies: (a) => a.seo !== null && a.seo < 50,
    improvement: {
      title: "Fix your SEO foundation",
      why: "Core SEO basics are missing, so Google can't understand or rank your pages. You're invisible for the searches that matter.",
      action:
        "Set proper titles, descriptions, headings, and schema so you rank for what customers actually search.",
      service: "Web Design",
      ctaLabel: "Improve my SEO",
      ctaHref: "/web-design-sonoma-county",
    },
  },
  {
    applies: (a) => a.social < 50,
    improvement: {
      title: "Build an active social presence",
      why: "We found little to no social presence linked from your site. Customers check social to confirm you're real and active before they buy.",
      action:
        "Connect and showcase the right 2–3 platforms, and keep them active so you stay top-of-mind.",
      service: "Web Design + Marketing",
      ctaLabel: "Grow my reach",
      ctaHref: "/#contact",
    },
  },
  {
    applies: (a) => a.branding < 60,
    improvement: {
      title: "Tighten your branding",
      why: "Inconsistent branding (icons, share images, identity) makes a real business look unfinished and forgettable.",
      action:
        "Polish your favicon, social share images, and brand identity so you look as professional as you are.",
      service: "Web Design",
      ctaLabel: "Polish my brand",
      ctaHref: "/web-design-sonoma-county",
    },
  },
];

/**
 * Choose the single biggest improvement for a business from its scan results.
 *
 * Rules are evaluated in priority order; each only fires when its category is
 * genuinely weak (e.g. `local < 50`), so a passing category can never be
 * surfaced. When nothing applies, we recommend the AI receptionist.
 */
export function biggestImprovement(args: BiggestImprovementArgs): Improvement {
  for (const rule of RULES) {
    if (rule.applies(args)) return rule.improvement;
  }
  return AI_RECEPTIONIST_FALLBACK;
}

// ── Server-side report HTML ──────────────────────────────────────────────────

export interface ReportScores {
  overall: number;
  website: number;
  local: number;
  social: number;
  branding: number;
}

export interface BuildReportArgs {
  businessName?: string;
  website?: string;
  scores: ReportScores;
  grade: string;
  signals?: BiggestImprovementArgs; // raw inputs, so the email re-derives the same opportunity
  recommendedService: string;
}

function scoreColor(s: number): string {
  if (s >= 80) return "#22C55E";
  if (s >= 50) return "#F97316";
  return "#EF4444";
}

function scoreRow(label: string, score: number): string {
  const color = scoreColor(score);
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;color:#333;">${escapeHtml(label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;font-weight:700;color:${color};text-align:right;">${score}/100</td>
    </tr>`;
}

/**
 * Build the full HTML body for the report email we promise the visitor.
 *
 * The "biggest opportunity" block is re-derived from `signals` (the same raw
 * inputs the page used) when present, so the email always agrees with the
 * on-screen result. When `signals` aren't supplied we fall back to the
 * `recommendedService` the client computed.
 */
export function buildReportHtml(args: BuildReportArgs): string {
  const { businessName, website, scores, grade, signals, recommendedService } = args;

  const safeName = escapeHtml(businessName?.trim() || "your business");
  const safeWebsite = escapeHtml(website?.trim() || "");
  const overallColor = scoreColor(scores.overall);

  const improvement = signals ? biggestImprovement(signals) : null;
  const oppTitle = escapeHtml(improvement?.title ?? "Your next move");
  const oppWhy = escapeHtml(improvement?.why ?? "");
  const oppAction = escapeHtml(improvement?.action ?? "");
  const service = escapeHtml(improvement?.service ?? recommendedService);

  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;color:#18181B;">
    <h1 style="font-size:22px;margin:0 0 6px;">Your Business Analysis report</h1>
    <p style="font-size:14px;color:#555;margin:0 0 20px;">
      Here's the full breakdown for <strong>${safeName}</strong>${safeWebsite ? ` (${safeWebsite})` : ""}.
    </p>

    <div style="background:#18181B;border-radius:14px;padding:24px;text-align:center;margin-bottom:24px;">
      <p style="color:#a1a1aa;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Overall grade</p>
      <p style="color:${overallColor};font-size:48px;font-weight:800;line-height:1;margin:0;">${escapeHtml(grade)}</p>
      <p style="color:#a1a1aa;font-size:13px;margin:8px 0 0;">Presence score ${scores.overall}/100</p>
    </div>

    <h2 style="font-size:16px;margin:0 0 8px;">Score breakdown</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      ${scoreRow("Website", scores.website)}
      ${scoreRow("Google / Local", scores.local)}
      ${scoreRow("Social media", scores.social)}
      ${scoreRow("Branding", scores.branding)}
    </table>

    <div style="border:1px solid #F97316;border-radius:14px;padding:22px;background:#1C1917;margin-bottom:24px;">
      <p style="color:#F97316;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">⭐ Your biggest opportunity</p>
      <h3 style="color:#fff;font-size:18px;margin:0 0 8px;">${oppTitle}</h3>
      ${oppWhy ? `<p style="color:#d4d4d8;font-size:14px;line-height:1.5;margin:0 0 12px;">${oppWhy}</p>` : ""}
      ${oppAction ? `<div style="background:rgba(0,0,0,0.3);border-radius:10px;padding:14px;"><p style="color:#a1a1aa;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">What to do</p><p style="color:#fff;font-size:14px;margin:0;">${oppAction}</p></div>` : ""}
      <p style="color:#a1a1aa;font-size:13px;margin:14px 0 0;">Recommended service: <strong style="color:#fff;">${service}</strong></p>
    </div>

    <p style="font-size:14px;line-height:1.6;color:#333;">
      Want me to walk you through this and build a prioritized action plan? Reply to this email,
      or call/text me at (707) 239-6725. Free, no obligation.
    </p>
    <p style="font-size:14px;color:#333;margin:16px 0 0;">— Duke<br>Copper Bay Tech<br>Petaluma, CA</p>
    <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
    <p style="font-size:12px;color:#999;">Copper Bay Tech · Serving Sonoma County · copperbaytech.com</p>
  </div>`;
}
