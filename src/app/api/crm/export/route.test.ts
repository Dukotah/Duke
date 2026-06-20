import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";
import { createCustomLead, setTerritory } from "@/lib/db";

// Route-handler tests for GET /api/crm/export.
//
// NOTE: getLeads() fetches a remote CSV (CSV_URL). We stub global fetch to
// reject so getLeads() takes its "CSV source unreachable → serve empty" path
// immediately (a real network attempt to the private GitHub repo would hang
// past the test timeout). This is the SAME real-world behavior the route is
// designed for, so the CSV-row paths are intentionally not exercised; tests
// cover the auth gate (401), the CSV content-type / header contract, and the
// custom-leads inclusion path (Redis-backed, hermetic). Per-user isolation of
// custom rows is also covered via two different user ids.

const originalFetch = globalThis.fetch;
beforeAll(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.reject(new Error("network disabled in test"))),
  );
});
afterAll(() => {
  globalThis.fetch = originalFetch;
  vi.unstubAllGlobals();
});

setupIsolatedRedis("export-route");

function makeReq(opts: { userId?: string; params?: Record<string, string> } = {}): NextRequest {
  const url = new URL("http://localhost/api/crm/export");
  for (const [k, v] of Object.entries(opts.params ?? {})) {
    url.searchParams.set(k, v);
  }
  const headers: Record<string, string> = {};
  if (opts.userId) headers["x-user-id"] = opts.userId;
  return new NextRequest(url.toString(), { method: "GET", headers });
}

describe("/api/crm/export route", () => {
  it("returns 401 when x-user-id header is absent", async () => {
    const res = await GET(makeReq());
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body).toMatchObject({ error: "Unauthorized" });
  });

  it("returns 200 with text/csv content-type and attachment disposition for an authenticated user", async () => {
    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toMatch(/text\/csv/);
    const disposition = res.headers.get("Content-Disposition") ?? "";
    expect(disposition).toMatch(/attachment/);
    expect(disposition).toMatch(/crm-leads-.*\.csv/);
  });

  it("response body begins with the expected CSV header row", async () => {
    const res = await GET(makeReq({ userId: "u1" }));
    const text = await res.text();
    const firstLine = text.split("\r\n")[0];
    // id must be first; source must be last (per COLUMNS definition in route.ts)
    expect(firstLine).toMatch(/^id,/);
    expect(firstLine).toMatch(/,source$/);
    // Spot-check a few other required columns
    expect(firstLine).toContain("name");
    expect(firstLine).toContain("email");
    expect(firstLine).toContain("tier");
    expect(firstLine).toContain("outreach_score");
  });

  it("includes custom leads seeded in Redis for the authenticated user", async () => {
    await createCustomLead("u2", {
      name: "Coastal Roofing",
      phone: "7075551234",
      email: "contact@coastal.com",
      website: "https://coastal.com",
      city: "Petaluma",
      county: "Sonoma",
      niche: "roofing",
      notes: "Manual add",
    });

    const res = await GET(makeReq({ userId: "u2" }));
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("Coastal Roofing");
    expect(text).toContain("contact@coastal.com");
    // Custom leads always carry source = "custom" (not "csv")
    expect(text).toContain("custom");
  });

  it("marks inbound custom leads with source = inbound", async () => {
    await createCustomLead("u3", {
      name: "Inbound Bakery",
      phone: "",
      email: "hello@bakery.com",
      website: "",
      city: "Santa Rosa",
      county: "Sonoma",
      niche: "bakery",
      notes: "Inbound — filled out contact form",
    });

    const res = await GET(makeReq({ userId: "u3" }));
    const text = await res.text();
    expect(text).toContain("Inbound Bakery");
    expect(text).toContain("inbound");
  });

  it("per-user isolation: user A does not see user B's custom leads", async () => {
    await createCustomLead("userA", {
      name: "Alpha Electric",
      phone: "",
      email: "alpha@electric.com",
      website: "",
      city: "Rohnert Park",
      county: "Sonoma",
      niche: "electrical",
      notes: "",
    });

    // userB has no custom leads in this test
    const resB = await GET(makeReq({ userId: "userB" }));
    const text = await resB.text();
    expect(text).not.toContain("Alpha Electric");
    expect(text).not.toContain("alpha@electric.com");
  });

  it("CSV is cache-control: no-store", async () => {
    const res = await GET(makeReq({ userId: "u1" }));
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });

  it("respects allTerritories=1 (territory filter skipped) without error", async () => {
    // Set a territory for u4 that would normally restrict results, then verify
    // allTerritories=1 bypasses it without throwing.
    await setTerritory("u4", { counties: ["Marin"], niches: ["plumbing"] });
    const res = await GET(makeReq({ userId: "u4", params: { allTerritories: "1" } }));
    expect(res.status).toBe(200);
    const ct = res.headers.get("Content-Type") ?? "";
    expect(ct).toMatch(/text\/csv/);
  });
});
