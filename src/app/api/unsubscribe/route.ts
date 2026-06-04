import { NextRequest, NextResponse } from "next/server";
import { verifyUnsubToken } from "@/lib/unsubscribe";
import { suppressEmail } from "@/lib/db";
import { getSessionSecret } from "@/lib/session";

async function processToken(token: string | null): Promise<string | null> {
  if (!token) return null;
  const email = await verifyUnsubToken(token, getSessionSecret());
  if (!email) return null;
  await suppressEmail(email);
  return email;
}

// One-click unsubscribe (RFC 8058). Mail clients POST here automatically when
// the user clicks the native "Unsubscribe" button next to the sender name.
export async function POST(req: NextRequest) {
  const email = await processToken(req.nextUrl.searchParams.get("t"));
  if (!email) return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 });
  return NextResponse.json({ ok: true });
}

// Human click from the link in the email body.
export async function GET(req: NextRequest) {
  const email = await processToken(req.nextUrl.searchParams.get("t"));
  const ok = !!email;
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${ok ? "Unsubscribed" : "Link not valid"} · Copper Bay Tech</title>
<style>
  body { margin:0; background:#111113; color:#fff; font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif; display:flex; min-height:100vh; align-items:center; justify-content:center; padding:24px; }
  .card { max-width:420px; text-align:center; background:#1C1C1F; border:1px solid rgba(255,255,255,.08); border-radius:20px; padding:40px 32px; }
  h1 { font-size:20px; margin:0 0 12px; }
  p { color:rgba(255,255,255,.55); font-size:14px; line-height:1.6; margin:0; }
  .mark { font-size:44px; margin-bottom:8px; }
  .brand { margin-top:24px; font-size:12px; color:rgba(255,255,255,.3); }
  .accent { color:#F97316; }
</style>
</head>
<body>
  <div class="card">
    <div class="mark">${ok ? "✅" : "⚠️"}</div>
    <h1>${ok ? "You're unsubscribed" : "This link isn't valid"}</h1>
    <p>${ok
      ? `<strong>${email}</strong> has been removed from our outreach list. You won't receive any more emails from us.`
      : "We couldn't process this unsubscribe request. The link may be incomplete. Reply to any of our emails with “unsubscribe” and we'll take care of it."}</p>
    <p class="brand">Copper Bay<span class="accent">Tech</span></p>
  </div>
</body>
</html>`;
  return new NextResponse(html, {
    status: ok ? 200 : 400,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
