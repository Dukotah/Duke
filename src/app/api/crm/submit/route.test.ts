import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// Route-handler tests for POST/GET /api/crm/submit.
// Covers: 401 when x-user-id or x-user-name is missing, 400 on missing required
// fields (leadId / leadName), 409 on duplicate non-rejected submission, 200 success
// path with correct shape, GET per-user isolation (u2 cannot see u1's submissions).
setupIsolatedRedis("submit-route");

function makeReq(
  method: string,
  opts: { userId?: string; repName?: string; body?: unknown } = {}
): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.userId) headers["x-user-id"] = opts.userId;
  if (opts.repName) headers["x-user-name"] = opts.repName;
  const body =
    opts.body === undefined
      ? undefined
      : typeof opts.body === "string"
      ? opts.body
      : JSON.stringify(opts.body);
  return new NextRequest("http://localhost/api/crm/submit", { method, headers, body });
}

describe("/api/crm/submit route", () => {
  // ── POST auth ─────────────────────────────────────────────────────────────
  it("POST returns 401 when both x-user-id and x-user-name are absent", async () => {
    const res = await POST(makeReq("POST", { body: { leadId: "l1", leadName: "Acme" } }));
    expect(res.status).toBe(401);
  });

  it("POST returns 401 when x-user-name is absent", async () => {
    const res = await POST(
      makeReq("POST", { userId: "u1", body: { leadId: "l1", leadName: "Acme" } })
    );
    expect(res.status).toBe(401);
  });

  it("POST returns 401 when x-user-id is absent", async () => {
    const res = await POST(
      makeReq("POST", { repName: "Alice", body: { leadId: "l1", leadName: "Acme" } })
    );
    expect(res.status).toBe(401);
  });

  // ── GET auth ──────────────────────────────────────────────────────────────
  it("GET returns 401 without x-user-id", async () => {
    const res = await GET(makeReq("GET"));
    expect(res.status).toBe(401);
  });

  // ── POST validation ───────────────────────────────────────────────────────
  it("POST returns 400 when leadId is missing", async () => {
    const res = await POST(
      makeReq("POST", { userId: "u1", repName: "Alice", body: { leadName: "Acme" } })
    );
    expect(res.status).toBe(400);
  });

  it("POST returns 400 when leadName is missing", async () => {
    const res = await POST(
      makeReq("POST", { userId: "u1", repName: "Alice", body: { leadId: "l-no-name" } })
    );
    expect(res.status).toBe(400);
  });

  it("POST returns 400 on malformed JSON body", async () => {
    const res = await POST(
      makeReq("POST", { userId: "u1", repName: "Alice", body: "{not valid json" })
    );
    expect(res.status).toBe(400);
  });

  // ── POST success ──────────────────────────────────────────────────────────
  it("POST creates a submission with status 'pending' and returns it", async () => {
    const res = await POST(
      makeReq("POST", {
        userId: "u1",
        repName: "Alice",
        body: {
          leadId: "lead-success",
          leadName: "Acme Plumbing",
          leadCity: "Sonoma",
          leadPhone: "555-0100",
          leadEmail: "acme@example.com",
          leadWebsite: "https://acme.com",
          leadTier: "gold",
          pitch: "Great fit",
          repNotes: "Called twice",
          estimatedBudget: "5000",
        },
      })
    );
    expect(res.status).toBe(200);
    const sub = await res.json();
    expect(sub).toMatchObject({
      userId: "u1",
      repName: "Alice",
      leadId: "lead-success",
      leadName: "Acme Plumbing",
      status: "pending",
    });
    expect(typeof sub.id).toBe("string");
    expect(typeof sub.submittedAt).toBe("string");
  });

  // ── POST duplicate detection ───────────────────────────────────────────────
  it("POST returns 409 on a duplicate submission for the same leadId", async () => {
    // First submission succeeds
    const first = await POST(
      makeReq("POST", {
        userId: "u1",
        repName: "Alice",
        body: { leadId: "lead-dupe", leadName: "Dupe Corp" },
      })
    );
    expect(first.status).toBe(200);

    // Second submission for the same lead is a duplicate
    const second = await POST(
      makeReq("POST", {
        userId: "u1",
        repName: "Alice",
        body: { leadId: "lead-dupe", leadName: "Dupe Corp" },
      })
    );
    expect(second.status).toBe(409);
  });

  // ── GET success + per-user isolation ─────────────────────────────────────
  it("GET returns the authenticated user's submissions; u2 cannot see u1's", async () => {
    // Create a submission for u1
    const create = await POST(
      makeReq("POST", {
        userId: "u1",
        repName: "Alice",
        body: { leadId: "lead-isolated", leadName: "Isolated Co" },
      })
    );
    expect(create.status).toBe(200);
    const created = await create.json();

    // u1 can see it
    const u1Res = await GET(makeReq("GET", { userId: "u1" }));
    expect(u1Res.status).toBe(200);
    const u1Subs = (await u1Res.json()) as { id: string }[];
    expect(u1Subs.some((s) => s.id === created.id)).toBe(true);

    // u2 sees an empty list (isolation)
    const u2Res = await GET(makeReq("GET", { userId: "u2" }));
    expect(u2Res.status).toBe(200);
    expect(await u2Res.json()).toEqual([]);
  });

  it("GET returns an empty array when the user has no submissions", async () => {
    const res = await GET(makeReq("GET", { userId: "u-empty" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });
});
