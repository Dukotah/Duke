import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, PATCH } from "./route";
import { addNotification } from "@/lib/crm/notifications";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// Handler tests for the notification center: auth, validation, list (newest-first),
// and mark-one / mark-all read.
setupIsolatedRedis("notifications-route");

function req(method: string, opts: { userId?: string; body?: unknown } = {}): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.userId) headers["x-user-id"] = opts.userId;
  const body =
    opts.body === undefined ? undefined : typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
  return new NextRequest("http://localhost/api/crm/notifications", { method, headers, body });
}

interface Notif { id: string; title: string; read: boolean }

describe("/api/crm/notifications route", () => {
  it("GET and PATCH are 401 without an authenticated user", async () => {
    expect((await GET(req("GET"))).status).toBe(401);
    expect((await PATCH(req("PATCH", { body: { id: "x" } }))).status).toBe(401);
  });

  it("PATCH is 400 without an id", async () => {
    expect((await PATCH(req("PATCH", { userId: "u1", body: {} }))).status).toBe(400);
  });

  it("lists newest-first, then marks one read, then marks all read", async () => {
    const a = await addNotification("u1", { type: "reply", title: "A" });
    await addNotification("u1", { type: "open", title: "B" });

    let list = (await (await GET(req("GET", { userId: "u1" }))).json()) as Notif[];
    expect(list.map((n) => n.title)).toEqual(["B", "A"]); // newest at head
    expect(list.every((n) => !n.read)).toBe(true);

    expect((await PATCH(req("PATCH", { userId: "u1", body: { id: a.id } }))).status).toBe(200);
    list = (await (await GET(req("GET", { userId: "u1" }))).json()) as Notif[];
    expect(list.find((n) => n.id === a.id)!.read).toBe(true);
    expect(list.find((n) => n.title === "B")!.read).toBe(false);

    await PATCH(req("PATCH", { userId: "u1", body: { id: "__all__" } }));
    list = (await (await GET(req("GET", { userId: "u1" }))).json()) as Notif[];
    expect(list.every((n) => n.read)).toBe(true);
  });
});
