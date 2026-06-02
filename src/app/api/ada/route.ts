import { NextRequest, NextResponse } from "next/server";
import { validateAuditUrl } from "@/lib/validate-url";
import { rateLimit } from "@/lib/rate-limit";
import { fetchHtml } from "@/lib/fetch-html";

export interface ADAIssue {
  label: string;
  severity: "pass" | "warning" | "error";
  detail: string;
}

export interface ADAData {
  score: number;
  issues: ADAIssue[];
}

function countMatches(html: string, re: RegExp): number {
  return (html.match(re) || []).length;
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
      html = await fetchHtml(normalizedUrl);
    } catch {
      return NextResponse.json({ error: "Failed to fetch URL" }, { status: 502 });
    }

    const issues: ADAIssue[] = [];

    // 1. Images missing alt text
    const totalImgs = countMatches(html, /<img\b/gi);
    const imgsWithAlt = countMatches(html, /<img\b[^>]*\balt=["'][^"']*["'][^>]*>/gi);
    const imgsWithEmptyAlt = countMatches(html, /<img\b[^>]*\balt=["']\s*["'][^>]*>/gi);
    const imgsWithoutAlt = totalImgs - imgsWithAlt;
    if (totalImgs === 0) {
      issues.push({ label: "Image alt text", severity: "pass", detail: "No images found" });
    } else if (imgsWithoutAlt > 0) {
      issues.push({ label: "Image alt text", severity: "error", detail: `${imgsWithoutAlt} of ${totalImgs} image${totalImgs > 1 ? "s" : ""} missing alt attribute` });
    } else if (imgsWithEmptyAlt > 0) {
      issues.push({ label: "Image alt text", severity: "pass", detail: `${imgsWithEmptyAlt} decorative image${imgsWithEmptyAlt > 1 ? "s" : ""} correctly marked with empty alt` });
    } else {
      issues.push({ label: "Image alt text", severity: "pass", detail: `All ${totalImgs} image${totalImgs > 1 ? "s" : ""} have alt text` });
    }

    // 2. Form inputs missing labels
    const totalInputs = countMatches(html, /<input\b(?![^>]*type=["'](?:hidden|submit|button|image|reset)["'])[^>]*>/gi);
    const labeledByFor = countMatches(html, /<label\b[^>]*\bfor=["'][^"']+["']/gi);
    const ariaLabeled = countMatches(html, /<input\b[^>]*aria-label(?:ledby)?=["'][^"']+["']/gi);
    const labeledInputs = labeledByFor + ariaLabeled;
    if (totalInputs === 0) {
      issues.push({ label: "Form input labels", severity: "pass", detail: "No form inputs found" });
    } else if (labeledInputs < totalInputs) {
      issues.push({ label: "Form input labels", severity: "error", detail: `${totalInputs - labeledInputs} input${totalInputs - labeledInputs > 1 ? "s" : ""} may be missing associated labels` });
    } else {
      issues.push({ label: "Form input labels", severity: "pass", detail: `Inputs appear to have labels or aria-label attributes` });
    }

    // 3. Language attribute on <html>
    const hasLang = /<html\b[^>]*\blang=["'][a-zA-Z-]+["']/i.test(html);
    issues.push({
      label: "Page language",
      severity: hasLang ? "pass" : "error",
      detail: hasLang ? "lang attribute set on <html>" : 'Missing lang attribute on <html> — required for screen readers',
    });

    // 4. Skip navigation link
    const hasSkipNav = /skip[\s-]?(to[\s-])?(?:main|content|nav)/i.test(html);
    issues.push({
      label: "Skip navigation link",
      severity: hasSkipNav ? "pass" : "warning",
      detail: hasSkipNav ? "Skip navigation link detected" : 'No skip link found — keyboard users cannot bypass repeated nav',
    });

    // 5. Buttons without accessible text
    const totalButtons = countMatches(html, /<button\b/gi);
    const emptyButtons = countMatches(html, /<button\b[^>]*>\s*<\/button>/gi);
    const iconOnlyButtons = countMatches(html, /<button\b(?![^>]*aria-label)[^>]*>\s*(?:<svg|<img)[^>]*>\s*<\/button>/gi);
    if (totalButtons === 0) {
      issues.push({ label: "Button labels", severity: "pass", detail: "No buttons found" });
    } else if (emptyButtons > 0 || iconOnlyButtons > 0) {
      const badCount = emptyButtons + iconOnlyButtons;
      issues.push({ label: "Button labels", severity: "error", detail: `${badCount} button${badCount > 1 ? "s" : ""} appear to lack visible or aria text` });
    } else {
      issues.push({ label: "Button labels", severity: "pass", detail: `All ${totalButtons} button${totalButtons > 1 ? "s" : ""} appear labeled` });
    }

    // 6. Links with generic text
    const genericLinks = countMatches(html, /<a\b[^>]*>\s*(?:click here|read more|learn more|here|more)\s*<\/a>/gi);
    if (genericLinks > 0) {
      issues.push({ label: "Descriptive link text", severity: "warning", detail: `${genericLinks} link${genericLinks > 1 ? "s" : ""} use generic text like "click here" or "read more"` });
    } else {
      issues.push({ label: "Descriptive link text", severity: "pass", detail: "No obvious generic link text found" });
    }

    // 7. ARIA landmark roles
    const hasMain = /<main\b/i.test(html) || /role=["']main["']/i.test(html);
    const hasNav = /<nav\b/i.test(html) || /role=["']navigation["']/i.test(html);
    if (!hasMain && !hasNav) {
      issues.push({ label: "ARIA landmarks", severity: "warning", detail: "No <main> or <nav> landmarks detected — screen readers rely on these" });
    } else if (!hasMain) {
      issues.push({ label: "ARIA landmarks", severity: "warning", detail: "<nav> found but no <main> landmark" });
    } else {
      issues.push({ label: "ARIA landmarks", severity: "pass", detail: `<main> and <nav> landmarks present` });
    }

    // 8. Viewport zoom disabled
    const metaViewport = html.match(/<meta\b[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["']/i)?.[1] ?? "";
    const zoomDisabled = /user-scalable\s*=\s*no/i.test(metaViewport) || /maximum-scale\s*=\s*1(?:\.0+)?(?!\d)/i.test(metaViewport);
    issues.push({
      label: "Viewport zoom",
      severity: zoomDisabled ? "error" : "pass",
      detail: zoomDisabled
        ? "Viewport prevents user zoom — violates WCAG 1.4.4 (Resize Text)"
        : "Viewport allows user scaling",
    });

    // 9. Heading hierarchy
    const headingOrder = [...html.matchAll(/<h([1-6])\b/gi)].map(m => parseInt(m[1]));
    let headingSkip = false;
    for (let i = 1; i < headingOrder.length; i++) {
      if (headingOrder[i] - headingOrder[i - 1] > 1) { headingSkip = true; break; }
    }
    if (headingOrder.length === 0) {
      issues.push({ label: "Heading structure", severity: "warning", detail: "No headings found" });
    } else if (headingSkip) {
      issues.push({ label: "Heading structure", severity: "warning", detail: "Heading levels skip (e.g. H1 → H3) — may confuse screen readers" });
    } else {
      issues.push({ label: "Heading structure", severity: "pass", detail: `${headingOrder.length} headings in sequential order` });
    }

    const passed = issues.filter(i => i.severity === "pass").length;
    const score = Math.round((passed / issues.length) * 100);

    return NextResponse.json({ score, issues } satisfies ADAData);
  } catch {
    return NextResponse.json({ error: "Failed to analyze ADA compliance" }, { status: 500 });
  }
}
