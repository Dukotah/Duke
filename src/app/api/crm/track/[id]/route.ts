import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/crm/store";

export const runtime = "nodejs";

// 1x1 transparent GIF.
const PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64",
);

function pixelResponse() {
  return new NextResponse(new Uint8Array(PIXEL), {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      "Content-Length": String(PIXEL.length),
    },
  });
}

// GET /api/crm/track/:id.gif — open-tracking pixel fallback (covers opens even
// when provider-side open tracking is off). Always returns the pixel; tracking
// failures must never break the image.
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await ctx.params;
    const emailId = id.replace(/\.gif$/i, "");
    const store = getStore();
    const contact = await store.getContactByEmailId(emailId);
    if (contact) {
      const email = contact.emails.find((e) => e.id === emailId);
      if (email) {
        await store.updateEmail(emailId, {
          opens: email.opens + 1,
          lastEventAt: new Date().toISOString(),
          status: email.status === "clicked" ? email.status : "opened",
        });
      }
      await store.addActivity(contact.id, {
        type: "email_opened",
        detail: "tracking pixel",
        meta: { emailId },
      });
      await store.advanceStatus(contact.id, "opened");
    }
  } catch (err) {
    console.error("track pixel error:", err);
  }
  return pixelResponse();
}
