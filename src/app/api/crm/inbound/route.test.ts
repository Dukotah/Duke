import { afterEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// The inbound reply webhook bypasses session middleware (the provider posts
// server-to-server), so CRM_INBOUND_SECRET is its only gate. It must FAIL CLOSED
// when the secret is unset and reject a wrong secret — never warn-and-proceed.
setupIsolatedRedis("inbound-route");

function makeReq(opts: { secret?: string; body?: unknown } = {}): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.secret) headers["x-inbound-secret"] = opts.secret;
  const body = opts.body === undefined ? "{}" : JSON.stringify(opts.body);
  return new NextRequest("http://localhost/api/crm/inbound", { method: "POST", headers, body });
}

describe("/api/crm/inbound fail-closed auth", () => {
  const prev = process.env.CRM_INBOUND_SECRET;
  afterEach(() => {
    if (prev === undefined) delete process.env.CRM_INBOUND_SECRET;
    else process.env.CRM_INBOUND_SECRET = prev;
  });

  it("returns 500 (not processed) when CRM_INBOUND_SECRET is unset", async () => {
    delete process.env.CRM_INBOUND_SECRET;
    const res = await POST(makeReq({ body: { from: "lead@example.com", text: "hi" } }));
    expect(res.status).toBe(500);
    expect(await res.json()).toMatchObject({ error: expect.stringMatching(/not configured/i) });
  });

  it("returns 401 on a wrong secret", async () => {
    process.env.CRM_INBOUND_SECRET = "right";
    const res = await POST(makeReq({ secret: "wrong", body: { from: "lead@example.com" } }));
    expect(res.status).toBe(401);
  });

  it("accepts a correct secret and acknowledges (unmatched sender → matched:false)", async () => {
    process.env.CRM_INBOUND_SECRET = "right";
    const res = await POST(makeReq({ secret: "right", body: { from: "nobody@example.com", text: "hi" } }));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, matched: false });
  });
});
