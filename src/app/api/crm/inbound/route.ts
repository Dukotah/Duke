import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/crm/store";
import { verifyResendSignature } from "@/lib/crm/webhook";

export const runtime = "nodejs";

// Extracts a bare email address from the many shapes a "from" field can take:
// "Jane <jane@x.com>", { email: "jane@x.com" }, or "jane@x.com".
function extractEmail(from: unknown): string | undefined {
  if (!from) return undefined;
  if (typeof from === "object") {
    const f = from as { email?: string; address?: string };
    return (f.email || f.address)?.toLowerCase();
  }
  const str = String(from);
  const match = str.match(/<([^>]+)>/) ?? str.match(/[^\s<>@]+@[^\s<>]+/);
  return (match?.[1] ?? match?.[0])?.toLowerCase();
}

// POST /api/crm/inbound — a reply arrived. Matches the sender to a contact and
// advances them to "replied" (the hottest signal we track).
//
// Wire this to a Resend Inbound route, or to any inbound-email provider whose
// payload includes the sender address.
export async function POST(req: NextRequest) {
  const raw = await req.text();

  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (secret) {
    const ok = verifyResendSignature(
      raw,
      {
        id: req.headers.get("svix-id"),
        timestamp: req.headers.get("svix-timestamp"),
        signature: req.headers.get("svix-signature"),
      },
      secret,
    );
    if (!ok) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let event: { data?: Record<string, unknown>; from?: unknown; subject?: string };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = event.data ?? event;
  const sender = extractEmail(
    (data as Record<string, unknown>).from ?? event.from,
  );
  if (!sender) return NextResponse.json({ ok: true });

  const store = getStore();
  const contact = await store.getContactByEmail(sender);
  if (!contact) return NextResponse.json({ ok: true, matched: false });

  await store.addActivity(contact.id, {
    type: "email_replied",
    detail: (data as Record<string, unknown>).subject as string | undefined,
  });
  await store.advanceStatus(contact.id, "replied");

  return NextResponse.json({ ok: true, matched: true });
}
