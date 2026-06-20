import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { getCustomLeads } from "@/lib/db";
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

// Handler tests for CSV lead import: auth, body validation, and parse + dedup.
setupIsolatedRedis("import-leads-route");

function req(opts: { userId?: string; body?: unknown } = {}): NextRequest {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.userId) headers["x-user-id"] = opts.userId;
  const body =
    opts.body === undefined ? undefined : typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
  return new NextRequest("http://localhost/api/crm/import-leads", { method: "POST", headers, body });
}

describe("/api/crm/import-leads route", () => {
  it("is 401 without a user", async () => {
    expect((await POST(req({ body: { csv: "name\nAcme" } }))).status).toBe(401);
  });

  it("is 400 on a malformed body and on a missing csv field", async () => {
    expect((await POST(req({ userId: "u1", body: "{bad json" }))).status).toBe(400);
    expect((await POST(req({ userId: "u1", body: {} }))).status).toBe(400);
  });

  it("imports rows and dedups by email (within the same import)", async () => {
    const csv = [
      "name,email,city",
      "Acme Co,a@x.com,Sonoma",
      "Beta Inc,b@x.com,Napa",
      "Acme Dup,A@x.com,Sonoma", // duplicate email (case-insensitive) → skipped
    ].join("\n");

    const res = await POST(req({ userId: "u1", body: { csv } }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.imported).toBe(2);
    expect(data.skipped).toBe(1);

    const leads = await getCustomLeads("u1");
    expect(leads.length).toBe(2);
    expect(leads.map((l) => l.name).sort()).toEqual(["Acme Co", "Beta Inc"]);
  });

  it("skips a row with no business name and reports it", async () => {
    const csv = "name,email\n,nobody@x.com\nReal Co,real@x.com";
    const data = await (await POST(req({ userId: "u2", body: { csv } }))).json();
    expect(data.imported).toBe(1);
    expect(data.skipped).toBe(1);
    expect(data.errors.length).toBeGreaterThanOrEqual(1);
  });
});
