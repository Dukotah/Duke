import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST, PATCH, DELETE } from "./route";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// Handler tests for the tags route: auth on every method, validation, and the
// create → assign (PATCH add) → list → delete contract.
setupIsolatedRedis("tags-route");

function req(method: string, opts: { userId?: string; body?: unknown; query?: string } = {}): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.userId) headers["x-user-id"] = opts.userId;
  const url = "http://localhost/api/crm/tags" + (opts.query ?? "");
  const body =
    opts.body === undefined ? undefined : typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
  return new NextRequest(url, { method, headers, body });
}

interface TagRow { id: string; label: string; color: string }

describe("/api/crm/tags route", () => {
  it("every method is 401 without an authenticated user", async () => {
    expect((await GET(req("GET"))).status).toBe(401);
    expect((await POST(req("POST", { body: { label: "Hot", color: "#f00" } }))).status).toBe(401);
    expect((await PATCH(req("PATCH", { body: { leadId: "L1", tagId: "t1", op: "add" } }))).status).toBe(401);
    expect((await DELETE(req("DELETE", { query: "?id=t1" }))).status).toBe(401);
  });

  it("POST requires label and color; DELETE requires id; PATCH requires a valid op", async () => {
    expect((await POST(req("POST", { userId: "u1", body: { color: "#f00" } }))).status).toBe(400);
    expect((await POST(req("POST", { userId: "u1", body: { label: "Hot" } }))).status).toBe(400);
    expect((await DELETE(req("DELETE", { userId: "u1" }))).status).toBe(400);
    expect((await PATCH(req("PATCH", { userId: "u1", body: { leadId: "L1", tagId: "t1", op: "nope" } }))).status).toBe(400);
  });

  it("create → assign → list → delete", async () => {
    const create = await POST(req("POST", { userId: "u1", body: { label: "VIP", color: "#0f0" } }));
    expect(create.status).toBe(201);
    const tag = (await create.json()) as TagRow;

    expect((await PATCH(req("PATCH", { userId: "u1", body: { leadId: "L1", tagId: tag.id, op: "add" } }))).status).toBe(200);

    const listed = await (await GET(req("GET", { userId: "u1" }))).json();
    expect((listed.tags as TagRow[]).map((t) => t.id)).toEqual([tag.id]);
    expect(listed.leadTagMap).toEqual({ L1: [tag.id] });

    expect((await DELETE(req("DELETE", { userId: "u1", query: `?id=${tag.id}` }))).status).toBe(200);
    const after = await (await GET(req("GET", { userId: "u1" }))).json();
    expect(after.tags).toEqual([]);
    expect(after.leadTagMap).toEqual({}); // deleteTag scrubs the now-empty lead entry
  });
});
