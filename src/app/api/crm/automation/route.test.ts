import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// Handler tests for the admin-managed automation rules: auth (401), admin gate
// (403), and an admin POST persisting validated rules that GET then returns.
setupIsolatedRedis("automation-route");

function req(method: string, opts: { userId?: string; role?: string; body?: unknown } = {}): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.userId) headers["x-user-id"] = opts.userId;
  if (opts.role) headers["x-user-role"] = opts.role;
  const body =
    opts.body === undefined ? undefined : typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
  return new NextRequest("http://localhost/api/crm/automation", { method, headers, body });
}

interface Rule { toStage: string }

describe("/api/crm/automation route", () => {
  it("GET is 401 (no user), 403 (non-admin), 200 + [] (admin, no rules yet)", async () => {
    expect((await GET(req("GET"))).status).toBe(401);
    expect((await GET(req("GET", { userId: "u1", role: "rep" }))).status).toBe(403);
    const ok = await GET(req("GET", { userId: "a", role: "admin" }));
    expect(ok.status).toBe(200);
    expect(await ok.json()).toEqual([]);
  });

  it("POST is 401/403 for non-admins; an admin persists validated rules", async () => {
    expect((await POST(req("POST", { body: { rules: [] } }))).status).toBe(401);
    expect((await POST(req("POST", { userId: "u1", role: "rep", body: { rules: [] } }))).status).toBe(403);

    const res = await POST(req("POST", {
      userId: "a", role: "admin",
      body: { rules: [{ toStage: "won", actions: [{ kind: "setFollowUp", inDays: 3 }] }] },
    }));
    expect(res.status).toBe(200);
    const saved = (await res.json()) as Rule[];
    expect(saved).toHaveLength(1);
    expect(saved[0].toStage).toBe("won");

    const after = (await (await GET(req("GET", { userId: "a", role: "admin" }))).json()) as Rule[];
    expect(after).toHaveLength(1);
  });
});
