import { NextRequest, NextResponse } from "next/server";

interface HeaderCheck {
  name: string;
  present: boolean;
  value: string;
  recommendation: string;
  severity: "critical" | "warning" | "info";
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

    let headers: Record<string, string> = {};
    let finalUrl = normalizedUrl;
    let httpsRedirect = false;

    // Check HTTP → HTTPS redirect
    if (normalizedUrl.startsWith("https://")) {
      const httpUrl = normalizedUrl.replace("https://", "http://");
      try {
        const httpRes = await fetch(httpUrl, {
          method: "HEAD",
          redirect: "manual",
          signal: AbortSignal.timeout(6000),
        });
        httpsRedirect = httpRes.status === 301 || httpRes.status === 302;
      } catch (_) {}
    }

    try {
      const res = await fetch(normalizedUrl, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(8000),
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SecurityChecker/1.0)" },
      });
      finalUrl = res.url || normalizedUrl;
      res.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });
    } catch {
      return NextResponse.json({ error: "Failed to reach URL" }, { status: 502 });
    }

    const h = headers;

    const checks: HeaderCheck[] = [
      {
        name: "HTTPS / SSL",
        present: finalUrl.startsWith("https://"),
        value: finalUrl.startsWith("https://") ? "Enabled" : "Not enabled",
        recommendation: "All traffic should be served over HTTPS. HTTP connections can be intercepted.",
        severity: "critical",
      },
      {
        name: "HTTP → HTTPS redirect",
        present: httpsRedirect || finalUrl.startsWith("https://"),
        value: httpsRedirect ? "Redirects correctly" : (finalUrl.startsWith("https://") ? "HTTPS-only" : "Missing"),
        recommendation: "HTTP requests should automatically redirect to HTTPS.",
        severity: "critical",
      },
      {
        name: "Strict-Transport-Security (HSTS)",
        present: !!h["strict-transport-security"],
        value: h["strict-transport-security"] || "Not set",
        recommendation: "HSTS forces browsers to always use HTTPS. Recommended: max-age=31536000; includeSubDomains",
        severity: "warning",
      },
      {
        name: "X-Content-Type-Options",
        present: h["x-content-type-options"] === "nosniff",
        value: h["x-content-type-options"] || "Not set",
        recommendation: "Set to 'nosniff' to prevent MIME-type sniffing attacks.",
        severity: "warning",
      },
      {
        name: "X-Frame-Options",
        present: !!h["x-frame-options"],
        value: h["x-frame-options"] || "Not set",
        recommendation: "Prevents your site from being embedded in iframes (clickjacking). Set to DENY or SAMEORIGIN.",
        severity: "warning",
      },
      {
        name: "Content-Security-Policy",
        present: !!h["content-security-policy"],
        value: h["content-security-policy"] ? h["content-security-policy"].slice(0, 60) + (h["content-security-policy"].length > 60 ? "…" : "") : "Not set",
        recommendation: "CSP controls which resources can be loaded and from where. Reduces XSS risk significantly.",
        severity: "info",
      },
      {
        name: "Referrer-Policy",
        present: !!h["referrer-policy"],
        value: h["referrer-policy"] || "Not set",
        recommendation: "Controls how much referrer info is sent with requests. Recommended: strict-origin-when-cross-origin",
        severity: "info",
      },
      {
        name: "Permissions-Policy",
        present: !!h["permissions-policy"],
        value: h["permissions-policy"] ? h["permissions-policy"].slice(0, 60) + "…" : "Not set",
        recommendation: "Limits access to browser features like camera, mic, and geolocation.",
        severity: "info",
      },
    ];

    const passed = checks.filter(c => c.present).length;
    const critical = checks.filter(c => !c.present && c.severity === "critical").length;
    const score = Math.round((passed / checks.length) * 100);

    return NextResponse.json({ score, passed, total: checks.length, critical, checks, url: normalizedUrl });
  } catch (err) {
    console.error("Headers check error:", err);
    return NextResponse.json({ error: "Failed to check security headers" }, { status: 500 });
  }
}
