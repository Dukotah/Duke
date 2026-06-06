import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export interface ComplianceIssue {
  id: string;
  category: "ADA" | "HIPAA";
  label: string;
  severity: "pass" | "warning" | "error";
  detail: string;
}

export interface ComplianceData {
  url: string;
  adaScore: number;
  hipaaScore: number;
  issues: ComplianceIssue[];
}

function countImagesWithoutAlt(html: string): { total: number; missing: number } {
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  let missing = 0;
  for (const img of imgs) {
    const hasAlt = /\balt\s*=\s*["'][^"']*["']/i.test(img);
    if (!hasAlt) missing++;
  }
  return { total: imgs.length, missing };
}

function countInputsWithoutLabels(html: string): { total: number; missing: number } {
  const inputs = html.match(/<input\b[^>]*>/gi) || [];
  const labelledByIds = new Set<string>();

  const labelMatches = html.matchAll(/<label\b[^>]*for=["']([^"']*)["'][^>]*>/gi);
  for (const m of labelMatches) labelledByIds.add(m[1]);

  let missing = 0;
  let total = 0;
  for (const inp of inputs) {
    const typeMatch = inp.match(/\btype\s*=\s*["']([^"']*)["']/i);
    const type = typeMatch ? typeMatch[1].toLowerCase() : "text";
    if (["hidden", "submit", "button", "reset", "image"].includes(type)) continue;
    total++;
    const idMatch = inp.match(/\bid\s*=\s*["']([^"']*)["']/i);
    const ariaLabel = /\baria-label\s*=/i.test(inp);
    const ariaLabelledBy = /\baria-labelledby\s*=/i.test(inp);
    if (ariaLabel || ariaLabelledBy) continue;
    if (idMatch && labelledByIds.has(idMatch[1])) continue;
    missing++;
  }
  return { total, missing };
}

function hasLangAttr(html: string): boolean {
  return /<html\b[^>]+lang\s*=/i.test(html);
}

function hasSkipNav(html: string): boolean {
  return /skip\s*(to\s*)?(main|content|navigation)/i.test(html);
}

function hasAriaLandmarks(html: string): boolean {
  return (
    /\brole\s*=\s*["']main["']/i.test(html) ||
    /<main\b/i.test(html)
  );
}

function getHeadingStructure(html: string): { h1Count: number; hasMultipleLevels: boolean } {
  const h1 = (html.match(/<h1\b/gi) || []).length;
  const h2 = (html.match(/<h2\b/gi) || []).length;
  return { h1Count: h1, hasMultipleLevels: h2 > 0 };
}

function hasVagueLinks(html: string): boolean {
  const links = html.match(/<a\b[^>]*>([\s\S]*?)<\/a>/gi) || [];
  const vague = /^(click here|here|read more|more|learn more|this|link)$/i;
  for (const link of links) {
    const text = link.replace(/<[^>]+>/g, "").trim();
    if (vague.test(text)) return true;
  }
  return false;
}

function hasTablesWithHeaders(html: string): boolean | null {
  const tables = html.match(/<table\b[\s\S]*?<\/table>/gi) || [];
  if (tables.length === 0) return null;
  return tables.every(t => /<th\b/i.test(t) || /<caption\b/i.test(t));
}

function hasPrivacyPolicy(html: string): boolean {
  return /privacy\s*policy/i.test(html);
}

function hasTermsOfService(html: string): boolean {
  return /terms\s*(of\s*)?(service|use)|terms\s*&amp;\s*conditions/i.test(html);
}

function hasCookieConsent(html: string): boolean {
  return /cookie\s*consent|cookie\s*notice|we\s*use\s*cookies|gdpr/i.test(html);
}

function hasContactInfo(html: string): boolean {
  const phone = /\b\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b/.test(html);
  const email = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(html);
  return phone || email;
}

function hasForms(html: string): boolean {
  return /<form\b/i.test(html);
}

function scoreFromIssues(issues: ComplianceIssue[], category: "ADA" | "HIPAA"): number {
  const relevant = issues.filter(i => i.category === category);
  if (relevant.length === 0) return 100;
  const errors = relevant.filter(i => i.severity === "error").length;
  const warnings = relevant.filter(i => i.severity === "warning").length;
  const passes = relevant.filter(i => i.severity === "pass").length;
  const total = errors + warnings + passes;
  const penalty = errors * 20 + warnings * 8;
  return Math.max(0, Math.round(((total * 10 - penalty) / (total * 10)) * 100));
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

    const res = await fetch(normalizedUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; CopperBayBot/1.0)" },
      signal: AbortSignal.timeout(15000),
    });
    const html = await res.text();
    const isHttps = normalizedUrl.startsWith("https://");

    const issues: ComplianceIssue[] = [];

    // ── ADA / WCAG checks ────────────────────────────────────────────────────

    const lang = hasLangAttr(html);
    issues.push({
      id: "lang",
      category: "ADA",
      label: "Language attribute",
      severity: lang ? "pass" : "error",
      detail: lang
        ? "The <html> element declares a language, helping screen readers."
        : "Missing lang attribute on <html>. Screen readers need this to use the correct voice.",
    });

    const { total: imgTotal, missing: imgMissing } = countImagesWithoutAlt(html);
    if (imgTotal === 0) {
      issues.push({ id: "alt", category: "ADA", label: "Image alt text", severity: "pass", detail: "No images found on this page." });
    } else if (imgMissing === 0) {
      issues.push({ id: "alt", category: "ADA", label: "Image alt text", severity: "pass", detail: `All ${imgTotal} image(s) have alt attributes.` });
    } else {
      issues.push({
        id: "alt",
        category: "ADA",
        label: "Image alt text",
        severity: "error",
        detail: `${imgMissing} of ${imgTotal} image(s) are missing alt text. Screen readers cannot describe these images.`,
      });
    }

    const { total: inputTotal, missing: inputMissing } = countInputsWithoutLabels(html);
    if (inputTotal === 0) {
      issues.push({ id: "labels", category: "ADA", label: "Form field labels", severity: "pass", detail: "No interactive form fields found." });
    } else if (inputMissing === 0) {
      issues.push({ id: "labels", category: "ADA", label: "Form field labels", severity: "pass", detail: `All ${inputTotal} form field(s) have labels or ARIA labels.` });
    } else {
      issues.push({
        id: "labels",
        category: "ADA",
        label: "Form field labels",
        severity: "error",
        detail: `${inputMissing} of ${inputTotal} input(s) lack labels. Users with assistive technology won't know what to enter.`,
      });
    }

    const skipNav = hasSkipNav(html);
    issues.push({
      id: "skip-nav",
      category: "ADA",
      label: "Skip navigation link",
      severity: skipNav ? "pass" : "warning",
      detail: skipNav
        ? "A skip navigation link is present, allowing keyboard users to bypass repeated content."
        : "No skip navigation link detected. Keyboard-only users must tab through every nav item on each page load.",
    });

    const landmarks = hasAriaLandmarks(html);
    issues.push({
      id: "landmarks",
      category: "ADA",
      label: "ARIA landmarks / <main>",
      severity: landmarks ? "pass" : "warning",
      detail: landmarks
        ? "A <main> landmark is present, helping screen reader users navigate directly to content."
        : "No <main> element or role='main' found. Add landmark regions so screen reader users can jump to content.",
    });

    const { h1Count, hasMultipleLevels } = getHeadingStructure(html);
    if (h1Count === 0) {
      issues.push({ id: "headings", category: "ADA", label: "Heading structure", severity: "error", detail: "No <h1> found. Pages need a clear heading hierarchy for screen readers." });
    } else if (h1Count > 1) {
      issues.push({ id: "headings", category: "ADA", label: "Heading structure", severity: "warning", detail: `${h1Count} <h1> elements found. Best practice is exactly one <h1> per page.` });
    } else if (!hasMultipleLevels) {
      issues.push({ id: "headings", category: "ADA", label: "Heading structure", severity: "warning", detail: "Only <h1> found — no <h2>s. A multi-level heading hierarchy improves navigation." });
    } else {
      issues.push({ id: "headings", category: "ADA", label: "Heading structure", severity: "pass", detail: "Page has a single <h1> and multiple heading levels." });
    }

    const vagueLinks = hasVagueLinks(html);
    issues.push({
      id: "link-text",
      category: "ADA",
      label: "Descriptive link text",
      severity: vagueLinks ? "warning" : "pass",
      detail: vagueLinks
        ? "Generic link text like 'click here' or 'read more' found. These are meaningless out of context for screen reader users."
        : "No obviously vague link text detected.",
    });

    const tableResult = hasTablesWithHeaders(html);
    if (tableResult !== null) {
      issues.push({
        id: "tables",
        category: "ADA",
        label: "Table headers",
        severity: tableResult ? "pass" : "warning",
        detail: tableResult
          ? "All tables have header cells (<th>) or captions."
          : "One or more tables lack <th> headers or <caption>. Screen readers need these to describe table structure.",
      });
    }

    // ── HIPAA checks ─────────────────────────────────────────────────────────

    issues.push({
      id: "https",
      category: "HIPAA",
      label: "HTTPS / Encrypted connection",
      severity: isHttps ? "pass" : "error",
      detail: isHttps
        ? "Site is served over HTTPS, encrypting data in transit — required for any PHI transmission."
        : "Site is not using HTTPS. Any form data including health information is transmitted unencrypted.",
    });

    const privacy = hasPrivacyPolicy(html);
    issues.push({
      id: "privacy",
      category: "HIPAA",
      label: "Privacy policy",
      severity: privacy ? "pass" : "error",
      detail: privacy
        ? "A privacy policy link was found. HIPAA requires a Notice of Privacy Practices for covered entities."
        : "No privacy policy link detected. HIPAA-covered sites must publish a Notice of Privacy Practices.",
    });

    const terms = hasTermsOfService(html);
    issues.push({
      id: "terms",
      category: "HIPAA",
      label: "Terms of service",
      severity: terms ? "pass" : "warning",
      detail: terms
        ? "Terms of service or terms of use link found."
        : "No terms of service detected. Recommended for sites handling user data.",
    });

    const cookies = hasCookieConsent(html);
    issues.push({
      id: "cookies",
      category: "HIPAA",
      label: "Cookie / tracking disclosure",
      severity: cookies ? "pass" : "warning",
      detail: cookies
        ? "Cookie consent or notice language detected."
        : "No cookie consent banner detected. Sites collecting health-related data should disclose tracking practices.",
    });

    const contact = hasContactInfo(html);
    issues.push({
      id: "contact",
      category: "HIPAA",
      label: "Contact information",
      severity: contact ? "pass" : "warning",
      detail: contact
        ? "Contact information (phone or email) found on the page."
        : "No visible contact info found. HIPAA-covered entities must provide a way for patients to reach them.",
    });

    const forms = hasForms(html);
    issues.push({
      id: "forms",
      category: "HIPAA",
      label: "Form security notice",
      severity: forms && !isHttps ? "error" : forms ? "warning" : "pass",
      detail: !forms
        ? "No HTML forms detected on this page."
        : isHttps
        ? "Forms present and served over HTTPS. Ensure your backend and storage also comply with HIPAA if PHI is collected."
        : "Forms found on an HTTP page. Any submission containing health data is transmitted without encryption.",
    });

    const adaScore = scoreFromIssues(issues, "ADA");
    const hipaaScore = scoreFromIssues(issues, "HIPAA");

    return NextResponse.json({ url: normalizedUrl, adaScore, hipaaScore, issues } satisfies ComplianceData);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
