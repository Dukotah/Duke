import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// Handler tests for the per-lead activity timeline: auth, validation, and
// logging an entry that GET returns.
setupIsolatedRedis("activity-route");

function req(method: string, opts: { userId?: string; repName?: string; body?: unknown; query?: string } = {}): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.userId) headers["x-user-id"] = opts.userId;
  if (opts.repName) headers["x-user-name"] = opts.repName;
  const url = "http://localhost/api/crm/activity" + (opts.query ?? "");
  const body =
    opts.body === undefined ? undefined : typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
  return new NextRequest(url, { method, headers, body });
}

interface Entry { type: string; outcome?: string }

describe("/api/crm/activity route", () => {
  it("enforces auth and required fields", async () => {
    expect((await GET(req("GET", { query: "?leadId=L1" }))).status).toBe(401);
    expect((await GET(req("GET", { userId: "u1" }))).status).toBe(400); // no leadId
    expect((await POST(req("POST", { body: { leadId: "L1", type: "call" } }))).status).toBe(401);
    expect((await POST(req("POST", { userId: "u1", body: { leadId: "L1" } }))).status).toBe(400); // no type
  });

  it("logs an activity entry and GET returns it", async () => {
    const res = await POST(req("POST", { userId: "u1", repName: "Duke", body: { leadId: "L1", type: "call", outcome: "voicemail" } }));
    expect(res.status).toBe(200);

    const list = (await (await GET(req("GET", { userId: "u1", query: "?leadId=L1" }))).json()) as Entry[];
    expect(list.length).toBeGreaterThanOrEqual(1);
    expect(list[0].type).toBe("call");
    expect(list[0].outcome).toBe("voicemail");
  });
});
