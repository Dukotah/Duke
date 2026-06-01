import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/crm/store";

export const runtime = "nodejs";

// GET /api/crm/unsubscribe?c=<contactId> — one-click opt-out from outreach.
// Returns a small confirmation page. Idempotent.
export async function GET(req: NextRequest) {
  const contactId = req.nextUrl.searchParams.get("c");
  if (contactId) {
    try {
      await getStore().setUnsubscribed(contactId);
    } catch (err) {
      console.error("unsubscribe error:", err);
    }
  }
  return new NextResponse(page(), {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

// POST is also accepted so List-Unsubscribe-Post one-click works.
export async function POST(req: NextRequest) {
  return GET(req);
}

function page(): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Unsubscribed — Copper Bay Tech</title></head>
<body style="margin:0;background:#FAFAF9;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#3F3F46">
<div style="max-width:480px;margin:12vh auto;background:#fff;border:1px solid #18181B14;border-radius:8px;padding:32px;text-align:center">
<h1 style="color:#18181B;font-size:20px;margin:0 0 12px">You're unsubscribed</h1>
<p style="line-height:1.6;margin:0">You won't receive further outreach emails from Copper Bay Tech. If this was a mistake, just reply to any prior email and we'll add you back.</p>
</div></body></html>`;
}
