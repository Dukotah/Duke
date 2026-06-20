import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// Handler tests for lead claiming: auth, the cross-rep claim guard (409), admin
// override, and owner-only unclaim (403).
setupIsolatedRedis("claim-route");

function postReq(opts: { userId?: string; userName?: string; role?: string; body?: unknown } = {}): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.userId) headers["x-user-id"] = opts.userId;
  if (opts.userName) headers["x-user-name"] = opts.userName;
  if (opts.role) headers["x-user-role"] = opts.role;
  const body =
    opts.body === undefined ? undefined : typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
  return new NextRequest("http://localhost/api/crm/claim", { method: "POST", headers, body });
}

function getReq(leadId?: string): NextRequest {
  const url = leadId
    ? `http://localhost/api/crm/claim?leadId=${encodeURIComponent(leadId)}`
    : "http://localhost/api/crm/claim";
  return new NextRequest(url, { method: "GET" });
}

describe("/api/crm/claim route", () => {
  it("POST is 401 without an authenticated user", async () => {
    expect((await POST(postReq({ body: { leadId: "L1", action: "claim" } }))).status).toBe(401);
  });

  it("POST is 400 without leadId/action; GET is 400 without leadId", async () => {
    expect((await POST(postReq({ userId: "a", body: {} }))).status).toBe(400);
    expect((await GET(getReq())).status).toBe(400);
  });

  it("claims a lead and GET reflects the claim", async () => {
    const res = await POST(postReq({ userId: "a", userName: "Alice", body: { leadId: "L1", action: "claim" } }));
    expect(res.status).toBe(200);
    expect((await res.json()).claim.userId).toBe("a");

    const got = await GET(getReq("L1"));
    expect((await got.json()).claim.userId).toBe("a");
  });

  it("blocks a second rep from claiming an active claim (409), but an admin overrides", async () => {
    await POST(postReq({ userId: "a", userName: "Alice", body: { leadId: "L2", action: "claim" } }));
    const repB = await POST(postReq({ userId: "b", userName: "Bob", body: { leadId: "L2", action: "claim" } }));
    expect(repB.status).toBe(409);

    const admin = await POST(postReq({ userId: "adm", userName: "Boss", role: "admin", body: { leadId: "L2", action: "claim" } }));
    expect(admin.status).toBe(200);
  });

  it("only the owner (or admin) can unclaim", async () => {
    await POST(postReq({ userId: "a", userName: "Alice", body: { leadId: "L3", action: "claim" } }));
    const repB = await POST(postReq({ userId: "b", userName: "Bob", body: { leadId: "L3", action: "unclaim" } }));
    expect(repB.status).toBe(403);

    const owner = await POST(postReq({ userId: "a", userName: "Alice", body: { leadId: "L3", action: "unclaim" } }));
    expect(owner.status).toBe(200);
    expect((await (await GET(getReq("L3"))).json()).claim).toBeNull();
  });
});
