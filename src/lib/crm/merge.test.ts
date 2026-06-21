import { describe, expect, it } from "vitest";
import { getRedis } from "@/lib/redis";
import { createCustomLead, getCustomLeads, getActivity } from "@/lib/db";
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

describe("mergeLeads regression — repointActivity trims only once", () => {
  it("keeps the survivor's own timeline when a custom loser has both key variants", async () => {
    const redis = getRedis();
    const loser = await createCustomLead(U, {
      name: "Dup Co", email: "dup@x.com", phone: "7075559999",
      contactName: "", website: "", city: "Sonoma", county: "Sonoma", niche: "x", notes: "",
    });
    const loserFeedId = `custom:${loser.id}`;
    const survivorId = "csv-survivor-act";

    // Survivor's OWN history — 30 entries (well under the 50 cap on its own).
    for (let i = 0; i < 30; i++) {
      await redis.lpush(`activity:${survivorId}`, JSON.stringify({ id: `surv-${i}`, note: `surv ${i}` }));
    }
    // Loser has entries under BOTH `custom:<id>` and `<id>` (12 + 12 = 24).
    for (let i = 0; i < 12; i++) {
      await redis.lpush(`activity:${loserFeedId}`, JSON.stringify({ id: `lc-${i}`, note: `loser custom ${i}` }));
    }
    for (let i = 0; i < 12; i++) {
      await redis.lpush(`activity:${loser.id}`, JSON.stringify({ id: `lb-${i}`, note: `loser bare ${i}` }));
    }

    const res = await mergeLeads(survivorId, loserFeedId);
    expect(res.ok).toBe(true);

    // 30 + 24 = 54 entries, capped at 50 — but the survivor's own entries must
    // survive. Before the fix the second ltrim dropped all 30 survivor entries.
    const merged = await getActivity(survivorId);
    expect(merged.length).toBe(50);
    const ids = merged.map((e) => e.id);
    expect(ids.some((id) => id.startsWith("surv-"))).toBe(true);
  });
});

describe("mergeLeads regression — repointReplies keeps the FIRST loser reply", () => {
  it("does not let a second loser key overwrite the reply just copied", async () => {
    const redis = getRedis();
    const loser = await createCustomLead(U, {
      name: "Reply Co", email: "reply@x.com", phone: "7075558888",
      contactName: "", website: "", city: "Sonoma", county: "Sonoma", niche: "x", notes: "",
    });
    const loserFeedId = `custom:${loser.id}`;
    const survivorId = "csv-survivor-reply";

    // Survivor has NO reply; loser has a reply under BOTH key variants.
    await redis.hset("lead_replies", { [loserFeedId]: JSON.stringify({ leadId: loserFeedId, fromEmail: "reply@x.com", body: "FIRST" }) });
    await redis.hset("lead_replies", { [loser.id]: JSON.stringify({ leadId: loser.id, fromEmail: "reply@x.com", body: "SECOND" }) });

    const res = await mergeLeads(survivorId, loserFeedId);
    expect(res.ok).toBe(true);

    // The survivor inherits the FIRST reply found (custom:<id>), not the SECOND.
    const survRaw = await redis.hget("lead_replies", survivorId);
    const parsed = typeof survRaw === "string" ? JSON.parse(survRaw) : survRaw;
    expect(parsed.body).toBe("FIRST");
    // Both loser entries are cleaned up.
    expect(await redis.hget("lead_replies", loserFeedId)).toBeNull();
    expect(await redis.hget("lead_replies", loser.id)).toBeNull();
  });
});

describe("mergeLeads regression — repointSubmissions preserves the original send-time score", () => {
  it("re-keys the submission with its original zset score, not Date.now()", async () => {
    const redis = getRedis();
    const loser = await createCustomLead(U, {
      name: "Sub Co", email: "sub@x.com", phone: "7075557777",
      contactName: "", website: "", city: "Sonoma", county: "Sonoma", niche: "x", notes: "",
    });
    const loserFeedId = `custom:${loser.id}`;
    const survivorId = "csv-survivor-sub";
    const userId = "rep-9";
    const ORIG_SCORE = 1000; // far from Date.now()

    const subId = `${userId}:${loserFeedId}`;
    await redis.hset(`submission:${subId}`, { id: subId, userId, leadId: loserFeedId, leadName: "Sub Co" });
    await redis.zadd("submissions:index", { score: ORIG_SCORE, member: subId });

    const res = await mergeLeads(survivorId, loserFeedId);
    expect(res.ok).toBe(true);

    const newId = `${userId}:${survivorId}`;
    const score = await redis.zscore("submissions:index", newId);
    expect(Number(score)).toBe(ORIG_SCORE);
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
