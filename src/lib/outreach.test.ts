import { describe, expect, it } from "vitest";
import {
  canDeliver,
  gateLeads,
  isValidEmail,
  normalizeEmail,
  type OutreachLead,
  personalize,
  rampedDailyCap,
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

describe("rampedDailyCap", () => {
  const HARD = 200;

  it("is OFF (hard cap) when no verified date is configured", () => {
    expect(rampedDailyCap(undefined, "2026-06-05", HARD)).toBe(HARD);
    expect(rampedDailyCap("", "2026-06-05", HARD)).toBe(HARD);
    expect(rampedDailyCap("   ", "2026-06-05", HARD)).toBe(HARD);
  });

  it("falls back to the hard cap on an unparseable date", () => {
    expect(rampedDailyCap("not-a-date", "2026-06-05", HARD)).toBe(HARD);
  });

  it("walks the warm-up rungs by week", () => {
    // verified on 2026-06-01
    expect(rampedDailyCap("2026-06-01", "2026-06-01", HARD)).toBe(20); // day 0
    expect(rampedDailyCap("2026-06-01", "2026-06-07", HARD)).toBe(20); // day 6
    expect(rampedDailyCap("2026-06-01", "2026-06-08", HARD)).toBe(50); // day 7
    expect(rampedDailyCap("2026-06-01", "2026-06-14", HARD)).toBe(50); // day 13
    expect(rampedDailyCap("2026-06-01", "2026-06-15", HARD)).toBe(100); // day 14
    expect(rampedDailyCap("2026-06-01", "2026-06-21", HARD)).toBe(100); // day 20
    expect(rampedDailyCap("2026-06-01", "2026-06-22", HARD)).toBe(HARD); // day 21
    expect(rampedDailyCap("2026-06-01", "2026-08-01", HARD)).toBe(HARD); // well past
  });

  it("treats a future verified date as week 1 (most conservative)", () => {
    expect(rampedDailyCap("2026-07-01", "2026-06-05", HARD)).toBe(20);
  });

  it("never exceeds a hard cap lower than the rung", () => {
    // a deliberately low configured cap wins over the ramp rung
    expect(rampedDailyCap("2026-06-01", "2026-08-01", 30)).toBe(30); // wk4 rung would be 30
    expect(rampedDailyCap("2026-06-01", "2026-06-15", 40)).toBe(40); // wk3 rung 100 clamped to 40
    expect(rampedDailyCap("2026-06-01", "2026-06-01", 10)).toBe(10); // wk1 rung 20 clamped to 10
  });
});

describe("daily capacity composition (mirrors /api/crm/outreach)", () => {
  // The route computes: cap = rampedDailyCap(verifiedDate, today, resolveDailyCap(env));
  //                     remaining = max(0, cap - sentToday).
  it("reflects the current warm-up rung minus what's already gone out today", () => {
    const hardCap = resolveDailyCap(undefined); // 200
    const cap = rampedDailyCap("2026-06-01", "2026-06-05", hardCap); // week 1 → 20
    expect(cap).toBe(20);
    expect(Math.max(0, cap - 8)).toBe(12);
  });

  it("never reports negative remaining once the rung is exhausted", () => {
    const cap = rampedDailyCap("2026-06-01", "2026-06-05", 200); // 20
    expect(Math.max(0, cap - 25)).toBe(0);
  });

  it("uses the full hard cap when the ramp is off (no verified date)", () => {
    const cap = rampedDailyCap(undefined, "2026-06-05", resolveDailyCap("150"));
    expect(cap).toBe(150);
    expect(Math.max(0, cap - 40)).toBe(110);
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
