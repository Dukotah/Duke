import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { SEQUENCE } from "@/lib/crm/sequences";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// Handler tests for the cadence config: GET is readable by any authed user
// (returns the default SEQUENCE when unset); POST is admin-only with shape validation.
setupIsolatedRedis("sequences-route");

function req(method: string, opts: { userId?: string; role?: string; body?: unknown } = {}): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.userId) headers["x-user-id"] = opts.userId;
  if (opts.role) headers["x-user-role"] = opts.role;
  const body =
    opts.body === undefined ? undefined : typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
  return new NextRequest("http://localhost/api/crm/sequences", { method, headers, body });
}

describe("/api/crm/sequences route", () => {
  it("GET is 401 without a user, and returns the default steps for any authed user", async () => {
    expect((await GET(req("GET"))).status).toBe(401);
    const ok = await GET(req("GET", { userId: "u1" }));
    expect(ok.status).toBe(200);
    expect((await ok.json()).steps).toEqual(SEQUENCE);
  });

  it("POST is 401/403 for non-admins, 400 on empty steps, 200 for an admin override", async () => {
    expect((await POST(req("POST", { body: { steps: SEQUENCE } }))).status).toBe(401);
    expect((await POST(req("POST", { userId: "u1", role: "rep", body: { steps: SEQUENCE } }))).status).toBe(403);
    expect((await POST(req("POST", { userId: "a", role: "admin", body: { steps: [] } }))).status).toBe(400);
    expect((await POST(req("POST", { userId: "a", role: "admin", body: { steps: SEQUENCE } }))).status).toBe(200);
  });
});
