import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// The admin leaderboard exposes cross-rep performance data and must be admin-only,
// like every other route under /api/crm/admin. A logged-in rep (no admin role)
// must get 403, not the leaderboard.
setupIsolatedRedis("admin-leaderboard-route");

function makeReq(opts: { userId?: string; role?: string } = {}): NextRequest {
  const headers: Record<string, string> = {};
  if (opts.userId) headers["x-user-id"] = opts.userId;
  if (opts.role) headers["x-user-role"] = opts.role;
  return new NextRequest("http://localhost/api/crm/admin/leaderboard", { method: "GET", headers });
}

describe("/api/crm/admin/leaderboard admin gate", () => {
  it("returns 403 for a non-admin rep (even with a user id)", async () => {
    const res = await GET(makeReq({ userId: "rep-1", role: "rep" }));
    expect(res.status).toBe(403);
  });

  it("returns 403 when no role header is present", async () => {
    const res = await GET(makeReq({ userId: "rep-1" }));
    expect(res.status).toBe(403);
  });

  it("returns 200 with a leaderboard for an admin", async () => {
    const res = await GET(makeReq({ userId: "admin-1", role: "admin" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toHaveProperty("leaderboard");
  });
});
