import { describe, expect, it } from "vitest";
import { norm, matchKey } from "./matchKey";

describe("matchKey — TIGHT join key (strips only legal-entity forms)", () => {
  it("keeps distinguishing words; strips only the legal suffix", () => {
    expect(matchKey("Acme Realty LLC")).toBe("acmerealty");
    expect(matchKey("Acme Group")).toBe("acmegroup");
    expect(matchKey("Joe's Cafe")).toBe("joescafe");
    expect(matchKey("A & B Co.")).toBe("ab");
  });

  it("does not collide where the loose norm does", () => {
    // norm collapses both to "acme"; matchKey keeps them distinct.
    expect(matchKey("Acme Realty")).not.toBe(matchKey("Acme Group"));
  });

  it("is tolerant of null/undefined/empty input", () => {
    expect(matchKey(undefined as unknown as string)).toBe("");
    expect(matchKey("")).toBe("");
  });
});

describe("norm — LOOSE suppression key (strips distinguishing words)", () => {
  it("strips industry filler words AND legal suffixes ('realty', 'llc')", () => {
    expect(norm("Acme Realty LLC")).toBe("acme");
  });

  it("collapses several filler words and punctuation together", () => {
    // the + properties both stripped -> "harbor"
    expect(norm("The Harbor Properties, Inc.")).toBe("harbor");
  });

  it("is tolerant of null/undefined/empty input", () => {
    expect(norm(undefined as unknown as string)).toBe("");
    expect(norm("")).toBe("");
  });
});
