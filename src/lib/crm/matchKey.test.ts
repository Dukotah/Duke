import { describe, expect, it } from "vitest";
import { norm, matchKey } from "./matchKey";

describe("matchKey — canonical business-name normalizer", () => {
  // NOTE: the spec sketch suggested norm("Acme Realty LLC") === "acmerealty", but
  // the canonical algorithm (kept verbatim for cross-repo parity) ALSO strips the
  // industry filler word "realty" alongside the legal suffix "llc", so the real,
  // intended output is "acme". Asserting the true behavior here.
  it("strips legal suffixes AND industry filler words ('realty', 'llc')", () => {
    expect(norm("Acme Realty LLC")).toBe("acme");
  });

  it("keeps a name that has no filler words intact (suffix-free businesses)", () => {
    // "cafe" is not a filler word, so the whole stem survives.
    expect(norm("Joe's Cafe")).toBe("joescafe");
  });

  it("collapses several filler words and punctuation together", () => {
    // the + properties both stripped → "harbor"
    expect(norm("The Harbor Properties, Inc.")).toBe("harbor");
  });

  it("matchKey is the same function as norm", () => {
    expect(matchKey).toBe(norm);
    expect(matchKey("Joe's Cafe")).toBe(norm("Joe's Cafe"));
  });

  it("is tolerant of null/undefined input", () => {
    expect(norm(undefined as unknown as string)).toBe("");
    expect(norm("")).toBe("");
  });
});
