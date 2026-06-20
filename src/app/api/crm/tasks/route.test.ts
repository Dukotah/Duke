import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST, PATCH, DELETE } from "./route";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// Handler tests for the tasks CRUD route: auth on every method, required-field
// validation, and the create → list → complete (excluded unless all=1) → delete loop.
setupIsolatedRedis("tasks-route");

function req(method: string, opts: { userId?: string; body?: unknown; query?: string } = {}): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.userId) headers["x-user-id"] = opts.userId;
  const url = "http://localhost/api/crm/tasks" + (opts.query ?? "");
  const body =
    opts.body === undefined ? undefined : typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
  return new NextRequest(url, { method, headers, body });
}

interface TaskRow { id: string; title: string; done: boolean }

describe("/api/crm/tasks route", () => {
  it("every method is 401 without an authenticated user", async () => {
    expect((await GET(req("GET"))).status).toBe(401);
    expect((await POST(req("POST", { body: { title: "x" } }))).status).toBe(401);
    expect((await PATCH(req("PATCH", { body: { id: "1", done: true } }))).status).toBe(401);
    expect((await DELETE(req("DELETE", { query: "?id=1" }))).status).toBe(401);
  });

  it("POST is 400 without a title; PATCH/DELETE are 400 without an id", async () => {
    expect((await POST(req("POST", { userId: "u1", body: { title: "  " } }))).status).toBe(400);
    expect((await PATCH(req("PATCH", { userId: "u1", body: { done: true } }))).status).toBe(400);
    expect((await DELETE(req("DELETE", { userId: "u1" }))).status).toBe(400);
  });

  it("create → list → complete (excluded unless all=1) → delete", async () => {
    const create = await POST(req("POST", { userId: "u1", body: { title: "Call Acme", type: "call" } }));
    expect(create.status).toBe(201);
    const task = (await create.json()) as TaskRow;
    expect(task.title).toBe("Call Acme");

    let list = (await (await GET(req("GET", { userId: "u1" }))).json()) as TaskRow[];
    expect(list.map((t) => t.id)).toEqual([task.id]);

    expect((await PATCH(req("PATCH", { userId: "u1", body: { id: task.id, done: true } }))).status).toBe(200);
    list = (await (await GET(req("GET", { userId: "u1" }))).json()) as TaskRow[];
    expect(list).toEqual([]); // done tasks excluded by default
    const all = (await (await GET(req("GET", { userId: "u1", query: "?all=1" }))).json()) as TaskRow[];
    expect(all.map((t) => t.id)).toEqual([task.id]); // included with ?all=1

    expect((await DELETE(req("DELETE", { userId: "u1", query: `?id=${task.id}` }))).status).toBe(200);
    expect(await (await GET(req("GET", { userId: "u1", query: "?all=1" }))).json()).toEqual([]);
  });
});
