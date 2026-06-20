import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST, DELETE } from "./route";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// Handler tests for saved smart lists: auth, POST validation (name/scope/filters),
// and the create → list → delete contract.
setupIsolatedRedis("smart-lists-route");

function req(method: string, opts: { userId?: string; body?: unknown } = {}): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.userId) headers["x-user-id"] = opts.userId;
  const body =
    opts.body === undefined ? undefined : typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
  return new NextRequest("http://localhost/api/crm/smart-lists", { method, headers, body });
}

interface ListRow { id: string; name: string }

describe("/api/crm/smart-lists route", () => {
  it("every method is 401 without an authenticated user", async () => {
    expect((await GET(req("GET"))).status).toBe(401);
    expect((await POST(req("POST", { body: { name: "x", scope: "private", filters: {} } }))).status).toBe(401);
    expect((await DELETE(req("DELETE", { body: { id: "1" } }))).status).toBe(401);
  });

  it("POST validates name, scope, and filters", async () => {
    expect((await POST(req("POST", { userId: "u1", body: { scope: "private", filters: {} } }))).status).toBe(400); // no name
    expect((await POST(req("POST", { userId: "u1", body: { name: "x", scope: "bad", filters: {} } }))).status).toBe(400); // bad scope
    expect((await POST(req("POST", { userId: "u1", body: { name: "x", scope: "private" } }))).status).toBe(400); // no filters
  });

  it("create → list → delete", async () => {
    const create = await POST(req("POST", { userId: "u1", body: { name: "Hot Sonoma", scope: "private", filters: { county: "Sonoma" } } }));
    expect(create.status).toBe(201);
    const list = (await create.json()) as ListRow;

    let all = (await (await GET(req("GET", { userId: "u1" }))).json()) as ListRow[];
    expect(all.map((l) => l.id)).toEqual([list.id]);

    expect((await DELETE(req("DELETE", { userId: "u1", body: {} }))).status).toBe(400); // id required
    expect((await DELETE(req("DELETE", { userId: "u1", body: { id: list.id } }))).status).toBe(200);

    all = (await (await GET(req("GET", { userId: "u1" }))).json()) as ListRow[];
    expect(all).toEqual([]);
  });
});
