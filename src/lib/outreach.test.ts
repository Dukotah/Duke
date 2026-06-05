import { describe, expect, it } from "vitest";
import {
  canDeliver,
  gateLeads,
  isValidEmail,
  normalizeEmail,
  type OutreachLead,
  personalize,
  remainingDailyCapacity,
  resolveDailyCap,
} from "./outreach";

function lead(partial: Partial<OutreachLead> & { id: string }): OutreachLead {
  return { name: "Acme", email: "a@acme.com", city: "Petaluma", ...partial };
}

describe("isValidEmail", () => {
  it("accepts well-formed addresses", () => {
    expect(isValidEmail("contact@copperbaytech.com")).toBe(true);
    expect(isValidEmail("a.b+tag@sub.example.co")).toBe(true);
  });

  it("trims surrounding whitespace before checking", () => {
    expect(isValidEmail("  contact@copperbaytech.com  ")).toBe(true);
  });

  it("rejects malformed addresses", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("no-at-sign")).toBe(false);
    expect(isValidEmail("missing@domain")).toBe(false);
    expect(isValidEmail("@nolocal.com")).toBe(false);
    expect(isValidEmail("spaces in@email.com")).toBe(false);
  });
});

describe("normalizeEmail", () => {
  it("lowercases and trims", () => {
    expect(normalizeEmail("  Duke@CopperBay.com ")).toBe("duke@copperbay.com");
  });
});

describe("gateLeads", () => {
  it("keeps well-formed, non-suppressed leads in order", () => {
    const leads = [lead({ id: "1", email: "a@x.com" }), lead({ id: "2", email: "b@x.com" })];
    const result = gateLeads(leads, []);
    expect(result.sendable.map((l) => l.id)).toEqual(["1", "2"]);
    expect(result.skipped).toBe(0);
  });

  it("drops malformed and empty emails as skipped", () => {
    const leads = [
      lead({ id: "1", email: "good@x.com" }),
      lead({ id: "2", email: "bad" }),
      lead({ id: "3", email: "" }),
    ];
    const result = gateLeads(leads, []);
    expect(result.sendable.map((l) => l.id)).toEqual(["1"]);
    expect(result.skipped).toBe(2);
  });

  it("drops suppressed addresses regardless of casing/whitespace", () => {
    const leads = [
      lead({ id: "1", email: "Keep@x.com" }),
      lead({ id: "2", email: "OptOut@x.com" }),
    ];
    const result = gateLeads(leads, ["  optout@x.com "]);
    expect(result.sendable.map((l) => l.id)).toEqual(["1"]);
    expect(result.skipped).toBe(1);
  });

  it("treats a lead that is both malformed and suppressed as a single skip", () => {
    const leads = [lead({ id: "1", email: "bad" })];
    const result = gateLeads(leads, ["bad"]);
    expect(result.sendable).toHaveLength(0);
    expect(result.skipped).toBe(1);
  });

  it("handles an empty batch", () => {
    expect(gateLeads([], [])).toEqual({ sendable: [], skipped: 0 });
  });
});

describe("remainingDailyCapacity", () => {
  it("is bounded by the sendable count when under the cap", () => {
    expect(remainingDailyCapacity(5, 0, 200)).toBe(5);
  });

  it("is bounded by remaining cap when sendable exceeds it", () => {
    expect(remainingDailyCapacity(50, 190, 200)).toBe(10);
  });

  it("never returns a negative number when the cap is already exceeded", () => {
    expect(remainingDailyCapacity(50, 250, 200)).toBe(0);
  });

  it("returns 0 exactly at the cap", () => {
    expect(remainingDailyCapacity(50, 200, 200)).toBe(0);
  });
});

describe("resolveDailyCap", () => {
  it("uses a positive override", () => {
    expect(resolveDailyCap("25")).toBe(25);
  });

  it("falls back on missing/invalid/non-positive values", () => {
    expect(resolveDailyCap(undefined)).toBe(200);
    expect(resolveDailyCap("")).toBe(200);
    expect(resolveDailyCap("abc")).toBe(200);
    expect(resolveDailyCap("0")).toBe(200);
    expect(resolveDailyCap("-5")).toBe(200);
  });

  it("honors a custom fallback", () => {
    expect(resolveDailyCap(undefined, 50)).toBe(50);
  });
});

describe("canDeliver", () => {
  it("only delivers when an API key is present AND the domain is verified", () => {
    expect(canDeliver("re_key", "true")).toBe(true);
  });

  it("track-only when the domain is not verified", () => {
    expect(canDeliver("re_key", undefined)).toBe(false);
    expect(canDeliver("re_key", "false")).toBe(false);
    expect(canDeliver("re_key", "")).toBe(false);
  });

  it("track-only when there is no API key, even if the domain is verified", () => {
    expect(canDeliver(undefined, "true")).toBe(false);
    expect(canDeliver("", "true")).toBe(false);
  });

  it("accepts case-insensitive / padded TRUE", () => {
    expect(canDeliver("re_key", "  TRUE ")).toBe(true);
    expect(canDeliver("re_key", "True")).toBe(true);
  });
});

describe("personalize", () => {
  it("replaces all placeholders case-insensitively", () => {
    const out = personalize(
      "Hi {name} in {City}, from {fromName}. {BUSINESS}!",
      { name: "Joe's Diner", city: "Sonoma" },
      "Duke",
    );
    // {name} is the greeting; with no contact person it falls back to "there".
    // {business} carries the company name.
    expect(out).toBe("Hi there in Sonoma, from Duke. Joe's Diner!");
  });

  it("uses the contact's first name for the {name} greeting when known", () => {
    const out = personalize(
      "Hi {name}, about {business}",
      { name: "Joe's Diner", city: "Sonoma", contactName: "Joseph Romano" },
      "Duke",
    );
    expect(out).toBe("Hi Joseph, about Joe's Diner");
  });

  it("leaves text without placeholders untouched", () => {
    expect(personalize("No tokens here", { name: "X", city: "Y" }, "Z")).toBe("No tokens here");
  });
});
