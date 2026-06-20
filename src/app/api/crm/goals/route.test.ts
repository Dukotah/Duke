import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// Route-handler tests for /api/crm/goals.
// Covers: 401 on missing x-user-id (both methods), 400 on unknown POST action,
// GET success shape (dailyStats / streak / weekHistory), POST log_call success
// (increments callsLogged), and per-user isolation (u1 calls don't show for u2).
// All helpers used (getDailyStats, getStreak, getWeeklyCallHistory,
// incrementDailyCalls) operate purely against LocalRedis — no network calls.
setupIsolatedRedis("goals-route");

function makeReq(
  method: string,
  opts: { userId?: string; body?: unknown } = {}
): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.userId) headers["x-user-id"] = opts.userId;
  const body =
    opts.body === undefined
      ? undefined
      : typeof opts.body === "string"
      ? opts.body
      : JSON.stringify(opts.body);
  return new NextRequest("http://localhost/api/crm/goals", { method, headers, body });
}

describe("/api/crm/goals route", () => {
  it("GET returns 401 without x-user-id", async () => {
    expect((await GET(makeReq("GET"))).status).toBe(401);
  });

  it("POST returns 401 without x-user-id", async () => {
    expect((await POST(makeReq("POST", { body: { action: "log_call" } }))).status).toBe(401);
  });

  it("GET returns 200 with dailyStats, streak, weekHistory for an authenticated user", async () => {
    const res = await GET(makeReq("GET", { userId: "u1" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("dailyStats");
    expect(data).toHaveProperty("streak");
    expect(data).toHaveProperty("weekHistory");
    // dailyStats shape
    expect(data.dailyStats).toMatchObject({
      callsLogged: expect.any(Number),
      leadsWorked: expect.any(Number),
      submissionsToday: expect.any(Number),
    });
    // weekHistory is a 7-element array
    expect(Array.isArray(data.weekHistory)).toBe(true);
    expect(data.weekHistory).toHaveLength(7);
    expect(data.weekHistory[0]).toHaveProperty("date");
    expect(data.weekHistory[0]).toHaveProperty("calls");
  });

  it("POST returns 400 for an unknown action", async () => {
    const res = await POST(makeReq("POST", { userId: "u1", body: { action: "bad_action" } }));
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ error: "Unknown action" });
  });

  it("POST returns 400 on a malformed JSON body", async () => {
    const res = await POST(makeReq("POST", { userId: "u1", body: "{not valid json" }));
    expect(res.status).toBe(400);
  });

  it("POST log_call returns 200 with updated dailyStats, streak, weekHistory", async () => {
    const res = await POST(makeReq("POST", { userId: "u2", body: { action: "log_call" } }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("dailyStats");
    expect(data).toHaveProperty("streak");
    expect(data).toHaveProperty("weekHistory");
    // After one log_call, callsLogged must be at least 1
    expect(data.dailyStats.callsLogged).toBeGreaterThanOrEqual(1);
  });

  it("POST log_call increments callsLogged on each call", async () => {
    const res1 = await POST(makeReq("POST", { userId: "u3", body: { action: "log_call" } }));
    const data1 = await res1.json();
    const res2 = await POST(makeReq("POST", { userId: "u3", body: { action: "log_call" } }));
    const data2 = await res2.json();
    expect(data2.dailyStats.callsLogged).toBe(data1.dailyStats.callsLogged + 1);
  });

  it("per-user isolation: u4 calls do not appear in u5's stats", async () => {
    await POST(makeReq("POST", { userId: "u4", body: { action: "log_call" } }));
    const res = await GET(makeReq("GET", { userId: "u5" }));
    const data = await res.json();
    // u5 has no calls logged — fresh user sees 0
    expect(data.dailyStats.callsLogged).toBe(0);
  });
});
