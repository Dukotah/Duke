import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// Handler tests for the command-palette search. Only the hermetic paths are
// covered (401 + empty-query short-circuit) — a non-empty query calls the network
// getLeads() CSV fetch, which we deliberately don't exercise in a unit test.
setupIsolatedRedis("search-route");

function req(opts: { userId?: string; q?: string } = {}): NextRequest {
  const headers: Record<string, string> = {};
  if (opts.userId) headers["x-user-id"] = opts.userId;
  const url = "http://localhost/api/crm/search" + (opts.q !== undefined ? `?q=${encodeURIComponent(opts.q)}` : "");
  return new NextRequest(url, { method: "GET", headers });
}

describe("/api/crm/search route", () => {
  it("is 401 without an authenticated user", async () => {
    expect((await GET(req({ q: "acme" }))).status).toBe(401);
  });

  it("short-circuits an empty query to [] without hitting the lead source", async () => {
    const res = await GET(req({ userId: "u1", q: "   " }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ results: [] });
  });
});
