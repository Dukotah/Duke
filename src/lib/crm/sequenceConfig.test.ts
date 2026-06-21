import { describe, expect, it } from "vitest";
import { getRedis } from "@/lib/redis";
import { getSequenceConfig, saveSequenceConfig } from "./sequenceConfig";
import { SEQUENCE } from "@/lib/crm/sequences";
import { setupIsolatedRedis } from "./testRedis";

// Integration tests for the persisted cadence override against an isolated store.
setupIsolatedRedis("sequenceconfig");

describe("sequence config", () => {
  it("returns the default SEQUENCE when nothing is saved", async () => {
    expect(await getSequenceConfig()).toEqual(SEQUENCE);
  });

  it("returns the persisted override after save", async () => {
    const custom = [...SEQUENCE, ...SEQUENCE]; // valid SequenceStep[], distinct length
    await saveSequenceConfig(custom);
    const got = await getSequenceConfig();
    expect(got).toHaveLength(SEQUENCE.length * 2);
    expect(got).toEqual(custom);
  });

  it("falls back to the default for an empty saved array", async () => {
    await saveSequenceConfig([]);
    expect(await getSequenceConfig()).toEqual(SEQUENCE);
  });

  it("falls back to the default when the stored value is corrupt", async () => {
    await getRedis().set("sequence:config", "not-json{");
    expect(await getSequenceConfig()).toEqual(SEQUENCE);
  });

  it("returns a pre-parsed array (Upstash auto-deserialization) instead of discarding it", async () => {
    // Upstash's REST client auto-deserializes JSON, so redis.get() can hand back
    // an already-parsed array. JSON.parse on that throws and used to silently drop
    // the admin's saved override. Simulate by storing the array shape directly.
    const custom = [...SEQUENCE, ...SEQUENCE];
    await getRedis().set("sequence:config", custom as unknown as string);
    const got = await getSequenceConfig();
    expect(got).toHaveLength(SEQUENCE.length * 2);
    expect(got).toEqual(custom);
  });
});
