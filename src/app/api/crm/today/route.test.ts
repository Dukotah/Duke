import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { setLeadState } from "@/lib/db";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// Handler tests for the unified "Today" action queue: auth, empty state, and an
// overdue follow-up surfacing as the top-priority item.
setupIsolatedRedis("today-route");

function req(userId?: string): NextRequest {
  const headers: Record<string, string> = {};
  if (userId) headers["x-user-id"] = userId;
  return new NextRequest("http://localhost/api/crm/today", { method: "GET", headers });
}

describe("/api/crm/today route", () => {
  it("is 401 without an authenticated user", async () => {
    expect((await GET(req())).status).toBe(401);
  });

  it("returns an empty queue with zeroed counts when there's nothing to do", async () => {
    const res = await GET(req("u1"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.items).toEqual([]);
    expect(data.counts).toEqual({ overdueFollowups: 0, followupsToday: 0, replies: 0, emailOpens: 0 });
  });

  it("surfaces an overdue follow-up as the top-priority item", async () => {
    // A long-past follow-up date is always overdue regardless of the run date.
    await setLeadState("u1", "L1", { status: "contacted", stage: "contacted", followUpDate: "2020-01-01" });

    const data = await (await GET(req("u1"))).json();
    expect(data.items.length).toBeGreaterThanOrEqual(1);
    expect(data.items[0]).toMatchObject({ leadId: "L1", reason: "overdue-followup", priority: 0 });
    expect(data.counts.overdueFollowups).toBe(1);

    // Per-user: another rep's queue is empty.
    expect((await (await GET(req("u2"))).json()).items).toEqual([]);
  });
});
