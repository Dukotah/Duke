import { describe, it, expect } from "vitest";
import { subjectVariantId, toVariants, chooseVariant, variantRates } from "./abtest";

describe("subjectVariantId", () => {
  it("is stable for the same subject", () => {
    expect(subjectVariantId("Hello there")).toBe(subjectVariantId("Hello there"));
  });
  it("ignores surrounding whitespace and case", () => {
    expect(subjectVariantId("  Hello THERE ")).toBe(subjectVariantId("hello there"));
  });
  it("differs for different subjects", () => {
    expect(subjectVariantId("A")).not.toBe(subjectVariantId("B"));
  });
});

describe("toVariants", () => {
  it("drops blanks and dedups by id", () => {
    const v = toVariants(["Subject A", "  ", "Subject A", "Subject B"]);
    expect(v.map((x) => x.subject)).toEqual(["Subject A", "Subject B"]);
  });
});

describe("chooseVariant", () => {
  const variants = toVariants(["A", "B"]);

  it("returns null for an empty set", () => {
    expect(chooseVariant([], "x@y.com")).toBeNull();
  });
  it("returns the only variant when there's one", () => {
    expect(chooseVariant(toVariants(["only"]), "x@y.com")?.subject).toBe("only");
  });
  it("is deterministic for the same key", () => {
    expect(chooseVariant(variants, "jane@acme.com")?.id).toBe(chooseVariant(variants, "jane@acme.com")?.id);
  });
  it("splits a population across both variants", () => {
    const counts: Record<string, number> = {};
    for (let i = 0; i < 200; i++) {
      const v = chooseVariant(variants, `user${i}@test.com`)!;
      counts[v.subject] = (counts[v.subject] ?? 0) + 1;
    }
    expect(counts["A"]).toBeGreaterThan(0);
    expect(counts["B"]).toBeGreaterThan(0);
  });
});

describe("variantRates", () => {
  it("returns zeros when nothing sent", () => {
    expect(variantRates({ sent: 0, opened: 0, clicked: 0, replied: 0 })).toEqual({ openRate: 0, clickRate: 0, replyRate: 0 });
  });
  it("computes fractions of sent", () => {
    const r = variantRates({ sent: 10, opened: 5, clicked: 2, replied: 1 });
    expect(r.openRate).toBe(0.5);
    expect(r.clickRate).toBe(0.2);
    expect(r.replyRate).toBe(0.1);
  });
});
