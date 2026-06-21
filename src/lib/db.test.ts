import { describe, expect, it } from "vitest";
import {
  hashPassword,
  verifyPassword,
  getActivity,
  setTerritory,
  getTerritory,
  claimLead,
  getClaimedLeadIds,
} from "./db";
import { getRedis } from "./redis";
import { setupIsolatedRedis } from "./crm/testRedis";

// hashPassword / verifyPassword are pure (PBKDF2 via WebCrypto, no Redis), so
// they're testable without touching the database. getRedis() is lazy, so simply
// importing this module does not require Upstash env vars.

describe("password hashing", () => {
  it("verifies a password against its own hash", async () => {
    const stored = await hashPassword("correct horse battery staple");
    expect(await verifyPassword("correct horse battery staple", stored)).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const stored = await hashPassword("right-password");
    expect(await verifyPassword("wrong-password", stored)).toBe(false);
  });

  it("salts: the same password hashes to different values each time", async () => {
    const a = await hashPassword("same");
    const b = await hashPassword("same");
    expect(a).not.toBe(b);
    // ...but each still verifies against its own salt.
    expect(await verifyPassword("same", a)).toBe(true);
    expect(await verifyPassword("same", b)).toBe(true);
  });

  it("produces a salt:hash shaped value", async () => {
    const stored = await hashPassword("x");
    const [salt, hash] = stored.split(":");
    expect(salt).toMatch(/^[0-9a-f]{32}$/); // 16 bytes
    expect(hash).toMatch(/^[0-9a-f]{64}$/); // 32 bytes
  });

  it("returns false for malformed stored values instead of throwing", async () => {
    expect(await verifyPassword("x", "")).toBe(false);
    expect(await verifyPassword("x", "no-colon")).toBe(false);
  });
});

// These exercise the Upstash auto-deserialization contract: the REST client
// JSON-parses stored values, so list/hash reads can hand back already-parsed
// objects/arrays. Calling JSON.parse on those throws (crash in prod). We simulate
// the pre-parsed shape by writing native values straight into the (LocalRedis)
// store, then assert the readers tolerate it instead of crashing.
describe("Upstash double-deserialization tolerance", () => {
  setupIsolatedRedis("db-deser");

  it("getActivity returns entries when list items are already objects", async () => {
    const redis = getRedis();
    // Pre-parsed shape (what Upstash returns), pushed directly as objects.
    await redis.lpush("activity:lead-A", { id: "a1", type: "call", note: "older" });
    await redis.lpush("activity:lead-A", { id: "a2", type: "note", note: "newer" });

    const entries = await getActivity("lead-A");
    expect(entries.map((e) => e.id)).toEqual(["a2", "a1"]); // newest-first, no throw
  });

  it("getActivity still parses JSON-string items (LocalRedis / dev path)", async () => {
    const redis = getRedis();
    await redis.lpush("activity:lead-B", JSON.stringify({ id: "b1", type: "call" }));
    const entries = await getActivity("lead-B");
    expect(entries[0].id).toBe("b1");
  });

  it("getTerritory tolerates pre-parsed array hash values", async () => {
    const redis = getRedis();
    // Simulate Upstash returning counties/niches as arrays (not JSON strings).
    await redis.hset("territory:rep-1", {
      userId: "rep-1",
      counties: ["Sonoma", "Marin"] as unknown as string,
      niches: ["roofing"] as unknown as string,
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    const t = await getTerritory("rep-1");
    expect(t?.counties).toEqual(["Sonoma", "Marin"]);
    expect(t?.niches).toEqual(["roofing"]);
  });

  it("setTerritory + getTerritory round-trips arrays (LocalRedis path)", async () => {
    await setTerritory("rep-2", { counties: ["Napa"], niches: ["hvac", "plumbing"] });
    const t = await getTerritory("rep-2");
    expect(t?.counties).toEqual(["Napa"]);
    expect(t?.niches).toEqual(["hvac", "plumbing"]);
  });
});

describe("claimLead reverse-index TTL", () => {
  setupIsolatedRedis("db-claim-ttl");

  it("sets a TTL on the claimed_by_user index so it can't outlive the claim hash", async () => {
    const redis = getRedis() as unknown as { pttl?: (k: string) => Promise<number> };
    await claimLead("lead-X", "rep-1", "Rep One");
    expect(await getClaimedLeadIds("rep-1")).toContain("lead-X");

    // The reverse index must carry a TTL (mirrors the claim hash's 30-day expiry).
    // Before the fix it had none and surfaced phantom claims forever after the
    // claim hash expired.
    const ttl = await redis.pttl!("claimed_by_user:rep-1");
    expect(ttl).toBeGreaterThan(0);
    expect(ttl).toBeLessThanOrEqual(30 * 24 * 60 * 60 * 1000);
  });
});
