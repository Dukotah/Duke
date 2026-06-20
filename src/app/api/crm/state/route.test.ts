import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { getLeadState } from "@/lib/db";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// Handler tests for per-user lead state: auth, leadId validation, patch
// persistence, and the stage-change path firing automations without throwing
// when no rules are configured.
setupIsolatedRedis("state-route");

function postReq(opts: { userId?: string; repName?: string; body?: unknown } = {}): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.userId) headers["x-user-id"] = opts.userId;
  if (opts.repName) headers["x-user-name"] = opts.repName;
  const body =
    opts.body === undefined ? undefined : typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
  return new NextRequest("http://localhost/api/crm/state", { method: "POST", headers, body });
}

function getReq(userId?: string): NextRequest {
  const headers: Record<string, string> = {};
  if (userId) headers["x-user-id"] = userId;
  return new NextRequest("http://localhost/api/crm/state", { method: "GET", headers });
}

describe("/api/crm/state route", () => {
  it("GET and POST are 401 without an authenticated user", async () => {
    expect((await GET(getReq())).status).toBe(401);
    expect((await POST(postReq({ body: { leadId: "L1", notes: "x" } }))).status).toBe(401);
  });

  it("POST is 400 without a leadId", async () => {
    expect((await POST(postReq({ userId: "u1", body: { notes: "no id" } }))).status).toBe(400);
  });

  it("persists a patch and reflects it via GET, per-user", async () => {
    // A stored state needs a `status` (getLeadState treats a status-less hash as "no state").
    const res = await POST(postReq({ userId: "u1", body: { leadId: "L1", status: "contacted", notes: "called back" } }));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);

    expect((await getLeadState("u1", "L1"))?.notes).toBe("called back");

    const list = await GET(getReq("u1"));
    expect(await list.json()).toHaveProperty("L1");
    // isolation: another user sees nothing
    expect(await (await GET(getReq("u2"))).json()).toEqual({});
  });

  it("runs the stage-change path safely with no automation rules configured", async () => {
    const res = await POST(postReq({
      userId: "u1", repName: "Duke",
      body: { leadId: "L2", leadName: "Acme", stage: "interested", status: "contacted" },
    }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.automation).toEqual({ rulesFired: 0, actionsRun: 0 }); // fired, matched nothing, didn't throw

    expect((await getLeadState("u1", "L2"))?.stage).toBe("interested");
  });
});
