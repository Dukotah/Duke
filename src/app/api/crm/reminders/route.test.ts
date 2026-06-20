import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";
import { setLeadState, createCustomLead } from "@/lib/db";

// Route-handler tests for GET /api/crm/reminders.
// Covers: 401 when x-user-id is absent, 200 with empty dueToday when no state is
// seeded, leads with followUpDate <= today are returned, leads in terminal stages
// (lost/won/submitted) are excluded, future followUpDates are excluded, per-user
// isolation (u2 cannot see u1's reminders), and custom lead fields are resolved.
// NOTE: getCustomLeads / getAllLeadStates are pure Redis calls — no network fetch —
// so all paths are exercised here without any hermetic stub needed.
setupIsolatedRedis("reminders-route");

const TODAY = new Date().toISOString().slice(0, 10);
const YESTERDAY = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
const TOMORROW = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);

function makeReq(opts: { userId?: string } = {}): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.userId) headers["x-user-id"] = opts.userId;
  return new NextRequest("http://localhost/api/crm/reminders", { method: "GET", headers });
}

describe("/api/crm/reminders route", () => {
  it("GET returns 401 without an authenticated user", async () => {
    const res = await GET(makeReq());
    expect(res.status).toBe(401);
  });

  it("GET returns 200 with an empty dueToday array when no state exists", async () => {
    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("dueToday");
    expect(body.dueToday).toEqual([]);
  });

  it("GET includes a lead whose followUpDate is today", async () => {
    await setLeadState("u1", "lead-today", {
      status: "follow_up",
      stage: "contacted",
      notes: "",
      followUpDate: TODAY,
    });

    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    const { dueToday } = await res.json();
    expect(dueToday.some((r: { leadId: string }) => r.leadId === "lead-today")).toBe(true);
  });

  it("GET includes a lead whose followUpDate is in the past", async () => {
    await setLeadState("u1", "lead-past", {
      status: "follow_up",
      stage: "contacted",
      notes: "",
      followUpDate: YESTERDAY,
    });

    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    const { dueToday } = await res.json();
    expect(dueToday.some((r: { leadId: string }) => r.leadId === "lead-past")).toBe(true);
  });

  it("GET excludes a lead whose followUpDate is in the future", async () => {
    await setLeadState("u1", "lead-future", {
      status: "follow_up",
      stage: "contacted",
      notes: "",
      followUpDate: TOMORROW,
    });

    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    const { dueToday } = await res.json();
    expect(dueToday.some((r: { leadId: string }) => r.leadId === "lead-future")).toBe(false);
  });

  it("GET excludes leads without a followUpDate", async () => {
    await setLeadState("u1", "lead-no-date", {
      status: "new",
      stage: "new",
      notes: "",
    });

    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    const { dueToday } = await res.json();
    expect(dueToday.some((r: { leadId: string }) => r.leadId === "lead-no-date")).toBe(false);
  });

  it.each(["lost", "won", "submitted"] as const)(
    "GET excludes leads in the '%s' stage even with a past followUpDate",
    async (stage) => {
      const leadId = `lead-${stage}`;
      await setLeadState("u1", leadId, {
        status: "follow_up",
        stage,
        notes: "",
        followUpDate: YESTERDAY,
      });

      const res = await GET(makeReq({ userId: "u1" }));
      expect(res.status).toBe(200);
      const { dueToday } = await res.json();
      expect(dueToday.some((r: { leadId: string }) => r.leadId === leadId)).toBe(false);
    }
  );

  it("GET resolves name/city/phone/email fields for custom leads", async () => {
    const custom = await createCustomLead("u1", {
      name: "Acme Plumbing",
      city: "Sonoma",
      county: "Sonoma County",
      phone: "555-1234",
      email: "acme@example.com",
      website: "",
      niche: "plumbing",
      notes: "",
    });
    const customLeadId = `custom:${custom.id}`;
    await setLeadState("u1", customLeadId, {
      status: "follow_up",
      stage: "contacted",
      notes: "",
      followUpDate: TODAY,
    });

    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    const { dueToday } = await res.json();
    const found = dueToday.find((r: { leadId: string }) => r.leadId === customLeadId);
    expect(found).toBeDefined();
    expect(found).toMatchObject({
      name: "Acme Plumbing",
      city: "Sonoma",
      phone: "555-1234",
      email: "acme@example.com",
      category: "plumbing",
    });
  });

  it("GET per-user isolation: u2 does not see u1's reminders", async () => {
    await setLeadState("u1", "lead-isolated", {
      status: "follow_up",
      stage: "contacted",
      notes: "",
      followUpDate: TODAY,
    });

    const res = await GET(makeReq({ userId: "u2" }));
    expect(res.status).toBe(200);
    const { dueToday } = await res.json();
    expect(dueToday.some((r: { leadId: string }) => r.leadId === "lead-isolated")).toBe(false);
  });
});
