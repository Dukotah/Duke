import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// First route-handler tests: drive the exported GET/POST with real NextRequest
// objects and assert the auth (401) + validation (400) + success (201) contract,
// plus per-user isolation. Runs against an isolated LocalRedis store.
setupIsolatedRedis("custom-leads-route");

function makeReq(method: string, opts: { userId?: string; body?: unknown } = {}): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.userId) headers["x-user-id"] = opts.userId;
  const body =
    opts.body === undefined ? undefined : typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
  return new NextRequest("http://localhost/api/crm/custom-leads", { method, headers, body });
}

describe("/api/crm/custom-leads route", () => {
  it("GET returns 401 without an authenticated user", async () => {
    expect((await GET(makeReq("GET"))).status).toBe(401);
  });

  it("POST returns 401 without an authenticated user", async () => {
    expect((await POST(makeReq("POST", { body: { name: "Acme" } }))).status).toBe(401);
  });

  it("POST returns 400 on a malformed JSON body", async () => {
    const res = await POST(makeReq("POST", { userId: "u1", body: "{not valid json" }));
    expect(res.status).toBe(400);
  });

  it("POST returns 400 when the business name is blank", async () => {
    const res = await POST(makeReq("POST", { userId: "u1", body: { name: "   " } }));
    expect(res.status).toBe(400);
  });

  it("POST creates a lead (201); GET lists it for that user only", async () => {
    const create = await POST(makeReq("POST", { userId: "u1", body: { name: "Acme Co", city: "Sonoma" } }));
    expect(create.status).toBe(201);
    const created = await create.json();
    expect(created.name).toBe("Acme Co");

    const list = await GET(makeReq("GET", { userId: "u1" }));
    expect(list.status).toBe(200);
    const leads = (await list.json()) as { id: string }[];
    expect(leads.some((l) => l.id === created.id)).toBe(true);

    // Isolation: a different user does not see u1's lead.
    const other = await GET(makeReq("GET", { userId: "u2" }));
    expect(await other.json()).toEqual([]);
  });
});
