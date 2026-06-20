import { describe, expect, it } from "vitest";
import { getRedis } from "@/lib/redis";
import { createCustomLead, getCustomLeads } from "@/lib/db";
import {
  normEmail, normPhone, normNameCity,
  findDuplicates, mergeLeads,
} from "./merge";
import { setupIsolatedRedis } from "./testRedis";

// merge.ts is the riskiest module: it re-points lead data across many Redis
// namespaces and deletes the loser. These tests cover the pure normalizers, every
// guard branch, an end-to-end merge (re-point + delete), and duplicate grouping —
// all against an isolated LocalRedis store.
setupIsolatedRedis("merge");

const U = "user-1";

describe("merge normalizers", () => {
  it("normEmail trims + lowercases, empty → ''", () => {
    expect(normEmail("  Foo@Bar.COM ")).toBe("foo@bar.com");
    expect(normEmail(undefined)).toBe("");
  });

  it("normPhone keeps digits, drops US country code, ignores short numbers", () => {
    expect(normPhone("(707) 555-1234")).toBe("7075551234");
    expect(normPhone("+1 707 555 1234")).toBe("7075551234");
    expect(normPhone("707.555.1234")).toBe("7075551234");
    expect(normPhone("123")).toBe(""); // too short
    expect(normPhone(undefined)).toBe("");
  });

  it("normNameCity strips suffixes/punctuation and requires both name + city", () => {
    expect(normNameCity("Acme, LLC", "Santa Rosa")).toBe("acme|santarosa");
    expect(normNameCity("Acme Inc.", "santa rosa")).toBe("acme|santarosa"); // same key
    expect(normNameCity("Acme", "")).toBe("");   // city missing
    expect(normNameCity("", "Sonoma")).toBe(""); // name missing
  });
});

describe("mergeLeads guards", () => {
  it("rejects missing ids", async () => {
    expect((await mergeLeads("", "custom:x")).ok).toBe(false);
    expect((await mergeLeads("surv", "")).ok).toBe(false);
  });

  it("is a no-op when survivor === loser", async () => {
    const r = await mergeLeads("custom:same", "custom:same");
    expect(r.ok).toBe(true);
    expect(r.merged).toBe(false);
  });

  it("refuses a non-custom (CSV) loser", async () => {
    const r = await mergeLeads("custom:keep", "csv-row-9");
    expect(r.ok).toBe(false);
    expect(r.merged).toBe(false);
    expect(r.message).toMatch(/custom lead can be the loser/i);
  });

  it("reports when the loser custom lead does not exist", async () => {
    const r = await mergeLeads("csv-survivor", "custom:does-not-exist");
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/not found/i);
  });
});

describe("mergeLeads end-to-end", () => {
  it("re-points the loser's lead_actions onto the survivor and deletes the loser", async () => {
    // Loser is a real custom lead; survivor is a CSV feed id.
    const loser = await createCustomLead(U, {
      name: "Dup Co", email: "dup@x.com", phone: "7075550000",
      contactName: "", website: "", city: "Sonoma", county: "Sonoma", niche: "x", notes: "",
    });
    const loserFeedId = `custom:${loser.id}`;
    const survivorId = "csv-survivor-1";

    // Seed a global cross-rep action record on the loser only.
    const redis = getRedis();
    await redis.hset("lead_actions", { [loserFeedId]: JSON.stringify({ emailCount: 3, callCount: 1 }) });

    const res = await mergeLeads(survivorId, loserFeedId);
    expect(res.ok).toBe(true);
    expect(res.merged).toBe(true);
    expect(res.touched.some((t) => t.includes("lead_actions"))).toBe(true);

    // Survivor inherited the counters; loser action record removed.
    const survRaw = await redis.hget("lead_actions", survivorId);
    expect(JSON.parse(survRaw as string)).toMatchObject({ emailCount: 3, callCount: 1 });
    expect(await redis.hget("lead_actions", loserFeedId)).toBeNull();

    // Loser custom lead is gone from storage AND its owner's index.
    expect(await redis.hgetall(`custom_lead:${loser.id}`)).toBeNull();
    expect((await getCustomLeads(U)).some((l) => l.id === loser.id)).toBe(false);
  });
});

describe("findDuplicates", () => {
  it("groups two custom leads that share an email", async () => {
    await createCustomLead(U, {
      name: "A", email: "same@x.com", phone: "", contactName: "",
      website: "", city: "", county: "", niche: "", notes: "",
    });
    await createCustomLead(U, {
      name: "B", email: "SAME@x.com", phone: "", contactName: "",
      website: "", city: "", county: "", niche: "", notes: "",
    });

    const groups = await findDuplicates();
    const emailGroup = groups.find((g) => g.reason === "email" && g.key === "same@x.com");
    expect(emailGroup).toBeTruthy();
    expect(emailGroup!.leads).toHaveLength(2);
  });
});
