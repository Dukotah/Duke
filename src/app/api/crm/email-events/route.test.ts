import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

// The email-events webhook is exempt from session auth in middleware, so its
// Svix signature is the only protection. It must FAIL CLOSED when no secret is
// configured rather than process unauthenticated POSTs.

function makeReq(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/crm/email-events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("/api/crm/email-events fail-closed auth", () => {
  const prev = process.env.RESEND_WEBHOOK_SECRET;
  beforeEach(() => { delete process.env.RESEND_WEBHOOK_SECRET; });
  afterEach(() => {
    if (prev === undefined) delete process.env.RESEND_WEBHOOK_SECRET;
    else process.env.RESEND_WEBHOOK_SECRET = prev;
  });

  it("returns 500 (not processed) when RESEND_WEBHOOK_SECRET is unset", async () => {
    const res = await POST(makeReq({ type: "email.bounced", data: { to: ["victim@example.com"] } }));
    expect(res.status).toBe(500);
    expect(await res.json()).toMatchObject({ error: expect.stringMatching(/secret/i) });
  });

  it("rejects an unsigned request with 401 when a secret IS configured", async () => {
    process.env.RESEND_WEBHOOK_SECRET = "whsec_dGVzdHNlY3JldA==";
    const res = await POST(makeReq({ type: "email.opened", data: { to: ["x@y.com"] } }));
    expect(res.status).toBe(401); // no svix headers → invalid signature
  });
});
