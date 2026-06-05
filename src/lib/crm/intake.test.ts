import { describe, expect, it } from "vitest";
import { hostLabel, sameHost, buildAuditNote, toolLabel, buildToolNote } from "./intake";

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

describe("intake — toolLabel", () => {
  it("takes the tool name before the em dash", () => {
    expect(toolLabel("Website Audit Tool — https://acme.com (SEO 42/100)")).toBe("Website Audit Tool");
    expect(toolLabel("Missed-Call Calculator — ~$48k/yr at risk")).toBe("Missed-Call Calculator");
    expect(toolLabel("IT Risk Quiz — At Risk (score: 7)")).toBe("IT Risk Quiz");
  });
  it("keeps a hyphenated tool name intact (splits on em dash, not hyphen)", () => {
    expect(toolLabel("Missed-Call Calculator — x")).toContain("Missed-Call");
  });
  it("falls back to a generic label for empty/odd context", () => {
    expect(toolLabel("")).toBe("Free tool");
    expect(toolLabel("No separator here")).toBe("No separator here");
  });
});

describe("intake — buildToolNote", () => {
  it("flags a warm inbound and embeds the tool's own summary", () => {
    const note = buildToolNote("Website Cost Estimator — $4.5k–$7.5k (10 pages)");
    expect(note.toLowerCase()).toContain("warm");
    expect(note).toContain("$4.5k–$7.5k");
    expect(note.toLowerCase()).toContain("free tool");
  });
  it("reads cleanly when context is empty", () => {
    expect(buildToolNote("")).not.toContain("..");
    expect(buildToolNote("").toLowerCase()).toContain("warm");
  });
});
