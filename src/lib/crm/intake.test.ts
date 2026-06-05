import { describe, expect, it } from "vitest";
import { hostLabel, sameHost, buildAuditNote } from "./intake";

describe("intake — hostLabel", () => {
  it("strips scheme and www", () => {
    expect(hostLabel("https://www.joesplumbing.com/contact")).toBe("joesplumbing.com");
    expect(hostLabel("joesplumbing.com")).toBe("joesplumbing.com");
    expect(hostLabel("http://example.org")).toBe("example.org");
  });
});

describe("intake — sameHost (dedup key)", () => {
  it("matches the same site regardless of scheme/www/path", () => {
    expect(sameHost("https://www.acme.com", "http://acme.com/pricing")).toBe(true);
    expect(sameHost("acme.com", "https://acme.com")).toBe(true);
  });
  it("does not match different sites or empty values", () => {
    expect(sameHost("acme.com", "other.com")).toBe(false);
    expect(sameHost(undefined, "acme.com")).toBe(false);
    expect(sameHost("acme.com", null)).toBe(false);
  });
});

describe("intake — buildAuditNote", () => {
  it("bands the score and flags it as a warm inbound lead", () => {
    expect(buildAuditNote(42)).toContain("42/100");
    expect(buildAuditNote(65)).toContain("needs work"); // 50–89
    expect(buildAuditNote(95)).toContain("good"); // 90+
    expect(buildAuditNote(20)).toContain("poor"); // <50
    expect(buildAuditNote(42).toLowerCase()).toContain("warm");
  });
  it("clamps out-of-range scores", () => {
    expect(buildAuditNote(150)).toContain("100/100");
    expect(buildAuditNote(-5)).toContain("0/100");
  });
});
