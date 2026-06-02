import { describe, expect, it } from "vitest";
import { makeUnsubToken, unsubscribeUrl, verifyUnsubToken } from "./unsubscribe";
import { SITE_URL } from "@/config/site";

const SECRET = "test-secret";

describe("unsubscribe tokens", () => {
  it("round-trips a valid token back to the email", async () => {
    const token = await makeUnsubToken("Duke@Example.com", SECRET);
    const email = await verifyUnsubToken(token, SECRET);
    // Token signs the normalized (lowercased/trimmed) address.
    expect(email).toBe("duke@example.com");
  });

  it("normalizes case and whitespace before signing", async () => {
    const a = await makeUnsubToken("  Duke@Example.com ", SECRET);
    const b = await makeUnsubToken("duke@example.com", SECRET);
    expect(a).toBe(b);
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await makeUnsubToken("duke@example.com", SECRET);
    expect(await verifyUnsubToken(token, "other-secret")).toBeNull();
  });

  it("rejects a tampered signature", async () => {
    const token = await makeUnsubToken("duke@example.com", SECRET);
    const [payload] = token.split(".");
    const forged = `${payload}.AAAAAAAAAAAAAAAAAAAAAAAAAAAA`;
    expect(await verifyUnsubToken(forged, SECRET)).toBeNull();
  });

  it("rejects a tampered payload (email swapped under the original signature)", async () => {
    const token = await makeUnsubToken("victim@example.com", SECRET);
    const [, sig] = token.split(".");
    const swappedPayload = btoa("attacker@example.com")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    expect(await verifyUnsubToken(`${swappedPayload}.${sig}`, SECRET)).toBeNull();
  });

  it("rejects malformed tokens", async () => {
    expect(await verifyUnsubToken("", SECRET)).toBeNull();
    expect(await verifyUnsubToken("no-dot", SECRET)).toBeNull();
    expect(await verifyUnsubToken(".onlysig", SECRET)).toBeNull();
    expect(await verifyUnsubToken("onlypayload.", SECRET)).toBeNull();
  });
});

describe("unsubscribeUrl", () => {
  it("builds a verifiable one-click URL on the site origin", async () => {
    const url = await unsubscribeUrl("duke@example.com", SECRET);
    expect(url.startsWith(`${SITE_URL}/api/unsubscribe?t=`)).toBe(true);

    const token = decodeURIComponent(new URL(url).searchParams.get("t")!);
    expect(await verifyUnsubToken(token, SECRET)).toBe("duke@example.com");
  });
});
