import { NextRequest, NextResponse } from "next/server";

interface HeaderCheck {
  header: string;
  present: boolean;
  value: string;
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
    try { new URL(normalizedUrl); } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    let headers: Headers;
    let finalUrl = normalizedUrl;
    try {
      const res = await fetch(normalizedUrl, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(10000),
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SecurityChecker/1.0)" },
      });
      headers = res.headers;
      finalUrl = res.url || normalizedUrl;
    } catch {
      return NextResponse.json({ error: "Failed to reach URL" }, { status: 502 });
    }

    const get = (name: string) => headers.get(name) ?? "";

    const checks: HeaderCheck[] = [];

    // HSTS
    const hsts = get("strict-transport-security");
    if (!hsts) {
      checks.push({ header: "Strict-Transport-Security", present: false, value: "", severity: "error", detail: "Missing — browsers can still connect over HTTP" });
    } else if (!hsts.includes("max-age=") || parseInt(hsts.match(/max-age=(\d+)/)?.[1] ?? "0") < 2592000) {
      checks.push({ header: "Strict-Transport-Security", present: true, value: hsts, severity: "warning", detail: "max-age should be ≥30 days (2592000s)" });
    } else {
      checks.push({ header: "Strict-Transport-Security", present: true, value: hsts, severity: "pass", detail: "HTTPS enforced" });
    }

    // X-Frame-Options
    const xfo = get("x-frame-options");
    if (!xfo) {
      const csp = get("content-security-policy");
      const hasFrameAncestors = csp.toLowerCase().includes("frame-ancestors");
      if (hasFrameAncestors) {
        checks.push({ header: "X-Frame-Options", present: false, value: "", severity: "pass", detail: "Covered by CSP frame-ancestors" });
      } else {
        checks.push({ header: "X-Frame-Options", present: false, value: "", severity: "error", detail: "Missing — site may be vulnerable to clickjacking" });
      }
    } else {
      checks.push({ header: "X-Frame-Options", present: true, value: xfo, severity: "pass", detail: "Clickjacking protection enabled" });
    }

    // X-Content-Type-Options
    const xcto = get("x-content-type-options");
    if (!xcto) {
      checks.push({ header: "X-Content-Type-Options", present: false, value: "", severity: "error", detail: "Missing — browsers may MIME-sniff responses" });
    } else {
      checks.push({ header: "X-Content-Type-Options", present: true, value: xcto, severity: "pass", detail: "MIME sniffing disabled" });
    }

    // Referrer-Policy
    const rp = get("referrer-policy");
    const strictReferrers = ["no-referrer", "strict-origin", "strict-origin-when-cross-origin", "no-referrer-when-downgrade"];
    if (!rp) {
      checks.push({ header: "Referrer-Policy", present: false, value: "", severity: "warning", detail: "Missing — defaults to browser behaviour (may leak URLs)" });
    } else if (strictReferrers.some(v => rp.toLowerCase().includes(v))) {
      checks.push({ header: "Referrer-Policy", present: true, value: rp, severity: "pass", detail: "Referrer leakage controlled" });
    } else {
      checks.push({ header: "Referrer-Policy", present: true, value: rp, severity: "warning", detail: `"${rp}" may leak full URLs` });
    }

    // Content-Security-Policy
    const csp = get("content-security-policy");
    if (!csp) {
      checks.push({ header: "Content-Security-Policy", present: false, value: "", severity: "warning", detail: "Missing — no XSS/injection policy defined" });
    } else if (csp.includes("unsafe-inline") || csp.includes("unsafe-eval")) {
      checks.push({ header: "Content-Security-Policy", present: true, value: csp.slice(0, 80) + (csp.length > 80 ? "…" : ""), severity: "warning", detail: "Policy uses unsafe-inline or unsafe-eval" });
    } else {
      checks.push({ header: "Content-Security-Policy", present: true, value: csp.slice(0, 80) + (csp.length > 80 ? "…" : ""), severity: "pass", detail: "XSS policy in place" });
    }

    // Permissions-Policy
    const pp = get("permissions-policy");
    if (!pp) {
      checks.push({ header: "Permissions-Policy", present: false, value: "", severity: "warning", detail: "Missing — camera/mic/location access not restricted" });
    } else {
      checks.push({ header: "Permissions-Policy", present: true, value: pp.slice(0, 80) + (pp.length > 80 ? "…" : ""), severity: "pass", detail: "Browser feature access restricted" });
    }

    // Server header (info leak)
    const server = get("server");
    if (server && /\d/.test(server)) {
      checks.push({ header: "Server", present: true, value: server, severity: "warning", detail: "Exposes server software version — consider hiding" });
    } else if (server) {
      checks.push({ header: "Server", present: true, value: server, severity: "pass", detail: "Version info not exposed" });
    } else {
      checks.push({ header: "Server", present: false, value: "", severity: "pass", detail: "Server identity hidden" });
    }

    // HTTPS redirect
    const isHttps = finalUrl.startsWith("https://");
    checks.push({
      header: "HTTPS",
      present: isHttps,
      value: isHttps ? "Active" : "Not active",
      severity: isHttps ? "pass" : "error",
      detail: isHttps ? "Connection is encrypted" : "Site served over plain HTTP",
    });

    const passed = checks.filter(c => c.severity === "pass").length;
    const score = Math.round((passed / checks.length) * 100);

    return NextResponse.json({ score, checks, url: finalUrl });
  } catch {
    return NextResponse.json({ error: "Failed to check security headers" }, { status: 500 });
  }
}
