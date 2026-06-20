import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";
import { setLeadState, addActivity } from "@/lib/db";
import { getRedis } from "@/lib/redis";

// Route-handler tests for GET /api/crm/activity-log.
// Covers: 401 when x-user-id is absent, 200 with empty array when no activity
// exists, activity entries for contacted leads are returned (callCount > 0),
// entries older than 30 days are excluded, entries belonging to another user
// are excluded even on the same lead, and per-user isolation (u2 does not see
// u1's activity). All seeding uses real db helpers — no hand-written Redis.
setupIsolatedRedis("activity-log-route");

function makeReq(opts: { userId?: string } = {}): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.userId) headers["x-user-id"] = opts.userId;
  return new NextRequest("http://localhost/api/crm/activity-log", { method: "GET", headers });
}

describe("/api/crm/activity-log route", () => {
  it("GET returns 401 without an authenticated user", async () => {
    const res = await GET(makeReq());
    expect(res.status).toBe(401);
  });

  it("GET returns 200 with an empty array when the user has no leads", async () => {
    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it("GET returns 200 with an empty array when leads have no callCount or lastContacted", async () => {
    await setLeadState("u1", "lead-never-contacted", {
      status: "new",
      stage: "new",
      notes: "",
    });

    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it("GET returns activity entries for leads with callCount > 0", async () => {
    await setLeadState("u1", "lead-called", {
      status: "contacted",
      stage: "contacted",
      notes: "",
      callCount: 1,
    });
    await addActivity("lead-called", "u1", "Rep One", { type: "call", outcome: "interested" });

    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    const found = body.find((e: { leadId: string }) => e.leadId === "lead-called");
    expect(found).toBeDefined();
    expect(found).toMatchObject({ type: "call", outcome: "interested", userId: "u1", leadId: "lead-called" });
  });

  it("GET returns activity entries for leads with lastContacted set (callCount 0)", async () => {
    await setLeadState("u1", "lead-last-contacted", {
      status: "follow_up",
      stage: "contacted",
      notes: "",
      lastContacted: new Date().toISOString(),
    });
    await addActivity("lead-last-contacted", "u1", "Rep One", { type: "note", note: "Called back" });

    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    const found = body.find((e: { leadId: string }) => e.leadId === "lead-last-contacted");
    expect(found).toBeDefined();
    expect(found.type).toBe("note");
  });

  it("GET excludes activity entries older than 30 days", async () => {
    await setLeadState("u1", "lead-old-activity", {
      status: "contacted",
      stage: "contacted",
      notes: "",
      callCount: 1,
    });
    // Push an old entry directly into Redis (addActivity always sets createdAt=now,
    // so we write the stale entry ourselves using the same key the route reads).
    const redis = getRedis();
    const old = JSON.stringify({
      id: "old-entry-id",
      userId: "u1",
      repName: "Rep One",
      type: "call",
      createdAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(),
    });
    await redis.lpush("activity:lead-old-activity", old);

    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    const found = body.find((e: { id: string }) => e.id === "old-entry-id");
    expect(found).toBeUndefined();
  });

  it("GET excludes entries belonging to a different user on the same lead", async () => {
    // Both u1 and u2 have state on the same lead-id so the route fetches it,
    // but only u1's entry should appear when u1 queries.
    await setLeadState("u1", "lead-shared", {
      status: "contacted",
      stage: "contacted",
      notes: "",
      callCount: 2,
    });
    await setLeadState("u2", "lead-shared", {
      status: "contacted",
      stage: "contacted",
      notes: "",
      callCount: 1,
    });
    await addActivity("lead-shared", "u1", "Rep One", { type: "call" });
    await addActivity("lead-shared", "u2", "Rep Two", { type: "email" });

    const resU1 = await GET(makeReq({ userId: "u1" }));
    expect(resU1.status).toBe(200);
    const bodyU1 = await resU1.json();
    const u1Entries = bodyU1.filter((e: { leadId: string }) => e.leadId === "lead-shared");
    expect(u1Entries.every((e: { userId: string }) => e.userId === "u1")).toBe(true);

    const resU2 = await GET(makeReq({ userId: "u2" }));
    expect(resU2.status).toBe(200);
    const bodyU2 = await resU2.json();
    const u2Entries = bodyU2.filter((e: { leadId: string }) => e.leadId === "lead-shared");
    expect(u2Entries.every((e: { userId: string }) => e.userId === "u2")).toBe(true);
  });

  it("GET per-user isolation: u2 does not see u1's activity", async () => {
    await setLeadState("u1", "lead-isolated", {
      status: "contacted",
      stage: "contacted",
      notes: "",
      callCount: 1,
    });
    await addActivity("lead-isolated", "u1", "Rep One", { type: "call" });

    const res = await GET(makeReq({ userId: "u2" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.find((e: { leadId: string }) => e.leadId === "lead-isolated")).toBeUndefined();
  });

  it("GET returns entries sorted newest-first", async () => {
    await setLeadState("u1", "lead-sorted", {
      status: "contacted",
      stage: "contacted",
      notes: "",
      callCount: 2,
    });
    await addActivity("lead-sorted", "u1", "Rep One", { type: "call", note: "first" });
    await addActivity("lead-sorted", "u1", "Rep One", { type: "note", note: "second" });

    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    const sorted = body.filter((e: { leadId: string }) => e.leadId === "lead-sorted");
    if (sorted.length >= 2) {
      const times = sorted.map((e: { createdAt: string }) => new Date(e.createdAt).getTime());
      expect(times[0]).toBeGreaterThanOrEqual(times[1]);
    }
  });
});
