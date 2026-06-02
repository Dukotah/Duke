import { afterEach, describe, expect, it, vi } from "vitest";
import { signToken, verifyToken } from "./session";

const SECRET = "session-secret";

afterEach(() => {
  vi.useRealTimers();
});

describe("session tokens", () => {
  it("round-trips a payload back out of a valid token", async () => {
    const token = await signToken({ userId: "u1", role: "rep", name: "Duke" }, SECRET);
    const payload = await verifyToken(token, SECRET);
    expect(payload).toMatchObject({ userId: "u1", role: "rep", name: "Duke" });
    expect(typeof payload?.exp).toBe("number");
  });

  it("rejects a token verified with the wrong secret", async () => {
    const token = await signToken({ userId: "u1", role: "admin", name: "Duke" }, SECRET);
    expect(await verifyToken(token, "wrong-secret")).toBeNull();
  });

  it("rejects a tampered payload", async () => {
    const token = await signToken({ userId: "u1", role: "rep", name: "Duke" }, SECRET);
    const [, sig] = token.split(".");
    const forged = btoa(JSON.stringify({ userId: "u1", role: "admin", name: "Duke", exp: Date.now() + 1000 }));
    expect(await verifyToken(`${forged}.${sig}`, SECRET)).toBeNull();
  });

  it("rejects malformed tokens", async () => {
    expect(await verifyToken("", SECRET)).toBeNull();
    expect(await verifyToken("no-dot", SECRET)).toBeNull();
  });

  it("rejects an expired token", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const token = await signToken({ userId: "u1", role: "rep", name: "Duke" }, SECRET);
    // Tokens live 30 days — jump 31 days forward.
    vi.setSystemTime(new Date("2026-02-01T00:00:00Z"));
    expect(await verifyToken(token, SECRET)).toBeNull();
  });
});
