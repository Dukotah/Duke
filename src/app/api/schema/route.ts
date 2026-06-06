import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

interface SchemaCheck {
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

function extractSchemas(html: string): object[] {
  const schemas: object[] = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1].trim());
      if (Array.isArray(parsed)) schemas.push(...parsed);
      else schemas.push(parsed);
    } catch (_) {}
  }
  return schemas;
}

function getType(schema: object): string {
  return (schema as Record<string, unknown>)["@type"] as string || "Unknown";
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
    try { new URL(normalizedUrl); } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    let html: string;
    try {
      const res = await fetch(normalizedUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SchemaChecker/1.0)" },
        signal: AbortSignal.timeout(10000),
      });
      html = await res.text();
    } catch {
      return NextResponse.json({ error: "Failed to fetch URL" }, { status: 502 });
    }

    const schemas = extractSchemas(html);
    const types = schemas.map(getType);
    const checks: SchemaCheck[] = [];

    // JSON-LD schema present at all
    if (schemas.length === 0) {
      checks.push({ label: "Structured data (JSON-LD)", status: "fail", detail: "No JSON-LD schema found — Google can't understand your business from this page" });
    } else {
      checks.push({ label: "Structured data (JSON-LD)", status: "pass", detail: `${schemas.length} schema block${schemas.length > 1 ? "s" : ""} found: ${types.join(", ")}` });
    }

    // LocalBusiness schema
    const localBizTypes = ["LocalBusiness","ProfessionalService","ITService","ComputerStore","HomeAndConstructionBusiness","Organization"];
    const hasLocalBiz = types.some(t => localBizTypes.includes(t) || t.includes("Business") || t.includes("Service") || t.includes("Organization"));
    if (hasLocalBiz) {
      const matchedSchema = schemas.find(s => {
        const t = getType(s);
        return localBizTypes.includes(t) || t.includes("Business") || t.includes("Service") || t.includes("Organization");
      }) as Record<string, unknown> | undefined;
      const hasAddress = matchedSchema?.["address"];
      const hasPhone = matchedSchema?.["telephone"];
      const hasArea = matchedSchema?.["areaServed"];
      checks.push({
        label: "LocalBusiness schema",
        status: hasAddress && hasPhone ? "pass" : "warn",
        detail: hasAddress && hasPhone
          ? `Present with address and phone — good local SEO signal${hasArea ? ` (areaServed: ${JSON.stringify(matchedSchema?.["areaServed"]).slice(0, 60)})` : ""}`
          : `Present but missing ${!hasAddress ? "address " : ""}${!hasPhone ? "telephone" : ""}— fill in for better local rankings`,
      });
    } else {
      checks.push({ label: "LocalBusiness schema", status: "fail", detail: "No LocalBusiness or Organization schema — Google won't associate your site with a physical location" });
    }

    // Review / AggregateRating
    const hasReviews = types.some(t => t === "AggregateRating" || t === "Review");
    const hasEmbeddedRating = schemas.some(s => !!(s as Record<string, unknown>)["aggregateRating"]);
    if (hasReviews || hasEmbeddedRating) {
      checks.push({ label: "Review / Rating schema", status: "pass", detail: "AggregateRating or Review markup found — may display star ratings in search results" });
    } else {
      checks.push({ label: "Review / Rating schema", status: "warn", detail: "No review markup — adding AggregateRating schema can show star ratings in Google results" });
    }

    // FAQPage
    const hasFAQ = types.includes("FAQPage");
    checks.push({
      label: "FAQ schema",
      status: hasFAQ ? "pass" : "warn",
      detail: hasFAQ ? "FAQPage schema found — FAQ answers may appear directly in search results" : "No FAQ schema — adding FAQPage markup can win expanded search result space",
    });

    // BreadcrumbList
    const hasBreadcrumb = types.includes("BreadcrumbList");
    checks.push({
      label: "Breadcrumb schema",
      status: hasBreadcrumb ? "pass" : "warn",
      detail: hasBreadcrumb ? "BreadcrumbList found — helps Google understand site structure" : "No breadcrumb schema — optional but helps site structure clarity in results",
    });

    // WebSite with SearchAction (sitelinks search box)
    const hasWebSite = types.includes("WebSite");
    checks.push({
      label: "WebSite schema",
      status: hasWebSite ? "pass" : "warn",
      detail: hasWebSite ? "WebSite schema present" : "No WebSite schema — can improve how your site appears in branded searches",
    });

    const passed = checks.filter(c => c.status === "pass").length;
    const score = Math.round((passed / checks.length) * 100);

    return NextResponse.json({
      score,
      passed,
      total: checks.length,
      checks,
      schemaTypes: types,
      schemaCount: schemas.length,
      url: normalizedUrl,
    });
  } catch (err) {
    console.error("Schema check error:", err);
    return NextResponse.json({ error: "Failed to analyze schema" }, { status: 500 });
  }
}
