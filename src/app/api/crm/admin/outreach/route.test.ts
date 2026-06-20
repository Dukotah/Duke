import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// Handler-level tests for the admin gate (requireAdmin → 403) and the epoch-11
// body hardening (malformed body → clean 400) on /api/crm/admin/outreach.
setupIsolatedRedis("admin-outreach-route");

function makeReq(method: string, opts: { role?: string; body?: unknown } = {}): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.role) headers["x-user-role"] = opts.role;
  const body =
    opts.body === undefined ? undefined : typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
  return new NextRequest("http://localhost/api/crm/admin/outreach", { method, headers, body });
}

describe("/api/crm/admin/outreach route — admin gate + body handling", () => {
  it("GET is 403 for missing or non-admin role", async () => {
    expect((await GET(makeReq("GET"))).status).toBe(403);
    expect((await GET(makeReq("GET", { role: "rep" }))).status).toBe(403);
  });

  it("GET is 200 for an admin", async () => {
    const res = await GET(makeReq("GET", { role: "admin" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toHaveProperty("suppressed");
  });

  it("POST is 403 without an admin role", async () => {
    expect((await POST(makeReq("POST", { body: { email: "x@y.com" } }))).status).toBe(403);
  });

  it("POST returns 400 on a malformed body (epoch-11 hardening, no 500)", async () => {
    const res = await POST(makeReq("POST", { role: "admin", body: "{bad json" }));
    expect(res.status).toBe(400);
  });

  it("POST returns 400 on an invalid email", async () => {
    const res = await POST(makeReq("POST", { role: "admin", body: { email: "not-an-email" } }));
    expect(res.status).toBe(400);
  });

  it("POST suppresses a valid email (200, normalized) and GET then lists it", async () => {
    const res = await POST(makeReq("POST", { role: "admin", body: { email: "Spammer@X.com" } }));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ ok: true, email: "spammer@x.com" });

    const get = await GET(makeReq("GET", { role: "admin" }));
    const data = (await get.json()) as { suppressed: string[] };
    expect(data.suppressed).toContain("spammer@x.com");
  });
});
