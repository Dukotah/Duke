import { NextRequest, NextResponse } from "next/server";
import { clearLeadsCache } from "@/app/api/crm/leads/route";

async function verifyGitHubSignature(body: string, signature: string, secret: string): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(body));
  const hex = "sha256=" + Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, "0")).join("");
  // Constant-time compare
  if (hex.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

export async function POST(req: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const signature = req.headers.get("x-hub-signature-256") ?? "";
  const body = await req.text();

  const valid = await verifyGitHubSignature(body, signature, secret);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Only care about push events
  const event = req.headers.get("x-github-event");
  if (event !== "push") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  // Check if the CSV file was actually modified
  let payload: { commits?: { added?: string[]; modified?: string[]; removed?: string[] }[] } = {};
  try { payload = JSON.parse(body); } catch {}

  const csvPath = "lead-tracker/data/export/ALL_COUNTIES_dedup.csv";
  const touched = payload.commits?.some((c) =>
    [...(c.added ?? []), ...(c.modified ?? []), ...(c.removed ?? [])].some((f) => f.includes(csvPath) || f.includes("export/"))
  );

  if (touched === false) {
    // Push didn't touch the CSV — skip cache clear
    return NextResponse.json({ ok: true, skipped: true, reason: "CSV not modified" });
  }

  clearLeadsCache();

  console.log("[webhook] Lead CSV cache cleared — new data incoming");
  return NextResponse.json({ ok: true, cleared: true });
}
