import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./db";

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
