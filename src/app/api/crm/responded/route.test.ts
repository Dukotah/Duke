import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";
import { stampLeadAction, recordInboundReply, createCustomLead } from "@/lib/db";

// Route-handler tests for GET /api/crm/responded.
// Covers: 401 when x-user-id is absent, 200 with empty responded array when no
// actions are seeded, leads with respondedAt appear in the feed, leads without
// respondedAt are excluded, reply body fields are surfaced on the card, and
// name/contact fields are resolved from the requesting user's custom leads.
setupIsolatedRedis("responded-route");

function makeReq(opts: { userId?: string } = {}): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.userId) headers["x-user-id"] = opts.userId;
  return new NextRequest("http://localhost/api/crm/responded", { method: "GET", headers });
}

describe("/api/crm/responded route", () => {
  it("GET returns 401 without an authenticated user", async () => {
    const res = await GET(makeReq());
    expect(res.status).toBe(401);
  });

  it("GET returns 200 with an empty responded array when no state is seeded", async () => {
    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("responded");
    expect(body.responded).toEqual([]);
  });

  it("GET excludes a lead that has no respondedAt stamp", async () => {
    await stampLeadAction("lead-no-reply", { emailedAt: new Date().toISOString() });

    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    const { responded } = await res.json();
    expect(responded.some((r: { id: string }) => r.id === "lead-no-reply")).toBe(false);
  });

  it("GET includes a lead that has respondedAt stamped", async () => {
    const respondedAt = new Date().toISOString();
    await stampLeadAction("lead-with-reply", { respondedAt }, { userId: "u1" });

    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    const { responded } = await res.json();
    expect(responded.some((r: { id: string }) => r.id === "lead-with-reply")).toBe(true);
  });

  it("GET surfaces reply body fields when a reply is recorded", async () => {
    await recordInboundReply(
      "lead-rich-reply",
      {
        fromEmail: "prospect@example.com",
        fromName: "Jane Prospect",
        subject: "Re: Your outreach",
        text: "Yes, I am interested!",
        receivedAt: new Date().toISOString(),
      },
      { userId: "u1", repName: "Rep" }
    );

    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    const { responded } = await res.json();
    const card = responded.find((r: { id: string }) => r.id === "lead-rich-reply");
    expect(card).toBeDefined();
    expect(card.reply).toBeDefined();
    expect(card.reply).toMatchObject({
      fromEmail: "prospect@example.com",
      fromName: "Jane Prospect",
      subject: "Re: Your outreach",
    });
    expect(card.reply.snippet).toContain("interested");
  });

  it("GET resolves name and contact fields from the user's custom leads", async () => {
    const custom = await createCustomLead("u1", {
      name: "Copper Bay Roofing",
      city: "Healdsburg",
      county: "Sonoma County",
      phone: "707-555-0100",
      email: "info@copperbayroofing.example",
      website: "",
      niche: "roofing",
      notes: "",
    });
    const leadId = `custom:${custom.id}`;
    await stampLeadAction(leadId, { respondedAt: new Date().toISOString() }, { userId: "u1" });

    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    const { responded } = await res.json();
    const card = responded.find((r: { id: string }) => r.id === leadId);
    expect(card).toBeDefined();
    expect(card).toMatchObject({
      name: "Copper Bay Roofing",
      city: "Healdsburg",
      phone: "707-555-0100",
      email: "info@copperbayroofing.example",
      category: "roofing",
    });
  });

  it("GET returns leads sorted newest respondedAt first", async () => {
    const older = "2025-01-01T10:00:00.000Z";
    const newer = "2025-06-01T10:00:00.000Z";
    await stampLeadAction("lead-older", { respondedAt: older });
    await stampLeadAction("lead-newer", { respondedAt: newer });

    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    const { responded } = await res.json();
    const ids = responded.map((r: { id: string }) => r.id);
    const olderIdx = ids.indexOf("lead-older");
    const newerIdx = ids.indexOf("lead-newer");
    expect(newerIdx).toBeLessThan(olderIdx);
  });

  it("GET exposes the actions object on each card", async () => {
    const respondedAt = new Date().toISOString();
    await stampLeadAction("lead-actions-check", { respondedAt }, { userId: "u1" });

    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    const { responded } = await res.json();
    const card = responded.find((r: { id: string }) => r.id === "lead-actions-check");
    expect(card).toBeDefined();
    expect(card).toHaveProperty("actions");
    expect(card.respondedAt).toBe(respondedAt);
  });
});
