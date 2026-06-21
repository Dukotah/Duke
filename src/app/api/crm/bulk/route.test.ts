import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { getLeadState, getLeadClaim } from "@/lib/db";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// Handler tests for the bulk-actions route: auth (401), payload validation (400),
// and the setStage path actually mutating per-user lead state.
setupIsolatedRedis("bulk-route");

function makeReq(opts: { userId?: string; repName?: string; role?: string; body?: unknown } = {}): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.userId) headers["x-user-id"] = opts.userId;
  if (opts.repName) headers["x-user-name"] = opts.repName;
  if (opts.role) headers["x-user-role"] = opts.role;
  const body =
    opts.body === undefined ? undefined : typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
  return new NextRequest("http://localhost/api/crm/bulk", { method: "POST", headers, body });
}

describe("/api/crm/bulk route", () => {
  it("returns 401 without an authenticated user", async () => {
    const res = await POST(makeReq({ body: { leadIds: ["l1"], action: "setStage", payload: { stage: "won" } } }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when leadIds is empty or not an array", async () => {
    expect((await POST(makeReq({ userId: "u1", body: { leadIds: [], action: "setStage", payload: { stage: "won" } } }))).status).toBe(400);
    expect((await POST(makeReq({ userId: "u1", body: { leadIds: "nope", action: "setStage", payload: { stage: "won" } } }))).status).toBe(400);
  });

  it("returns 400 on an unknown action", async () => {
    const res = await POST(makeReq({ userId: "u1", body: { leadIds: ["l1"], action: "frobnicate", payload: {} } }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when setStage is missing payload.stage", async () => {
    const res = await POST(makeReq({ userId: "u1", body: { leadIds: ["l1"], action: "setStage", payload: {} } }));
    expect(res.status).toBe(400);
  });

  it("setStage updates each lead's state, reports the count, and stays per-user", async () => {
    const res = await POST(makeReq({
      userId: "u1", repName: "Duke",
      body: { leadIds: ["l1", "l2"], action: "setStage", payload: { stage: "won", status: "won" } },
    }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ updated: 2 });

    expect((await getLeadState("u1", "l1"))?.stage).toBe("won");
    expect((await getLeadState("u1", "l2"))?.stage).toBe("won");
    expect(await getLeadState("u2", "l1")).toBeNull(); // isolation
  });

  it("reassign is admin-only — a non-admin rep gets 403 and no claim is created", async () => {
    const res = await POST(makeReq({
      userId: "rep-1", repName: "Rep One", role: "rep",
      body: { leadIds: ["L-1"], action: "reassign", payload: { toUserId: "rep-1", toRepName: "Rep One" } },
    }));
    expect(res.status).toBe(403);
    expect(await getLeadClaim("L-1")).toBeNull(); // nothing was claimed/stolen
  });

  it("reassign succeeds for an admin and claims the lead for the target user", async () => {
    const res = await POST(makeReq({
      userId: "admin-1", repName: "Admin", role: "admin",
      body: { leadIds: ["L-2"], action: "reassign", payload: { toUserId: "rep-9", toRepName: "Rep Nine" } },
    }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ updated: 1 });
    expect((await getLeadClaim("L-2"))?.userId).toBe("rep-9");
  });
});
