import { NextRequest, NextResponse } from "next/server";

/**
 * Collector for Content-Security-Policy violation reports (see the
 * Content-Security-Policy-Report-Only header in next.config.ts, roadmap #91).
 *
 * Browsers POST a JSON body here when a directive WOULD have been violated. We
 * log a compact line to the Vercel function logs so we can review what a strict
 * (enforcing) CSP would break before flipping the header to enforce mode.
 * Always returns 204 — a report endpoint must never error the page.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    // Both the legacy `report-uri` shape ({ "csp-report": {...} }) and the
    // newer Reporting API array shape land here; normalize lightly for logging.
    const report =
      body?.["csp-report"] ??
      (Array.isArray(body) ? body[0]?.body : body) ??
      body;
    if (report) {
      console.warn("[CSP]", JSON.stringify({
        documentURI: report["document-uri"] ?? report.documentURL,
        violatedDirective: report["violated-directive"] ?? report.effectiveDirective,
        blockedURI: report["blocked-uri"] ?? report.blockedURL,
      }));
    }
  } catch {
    /* never throw from a report sink */
  }
  return new NextResponse(null, { status: 204 });
}
