import { describe, expect, it } from "vitest";
import {
  applyEmailOverrides,
  findMatches,
  matchLead,
  normalizeBusiness,
  normalizeEmail,
  phoneKey,
  pickPrimary,
  type MatchableLead,
} from "./leadMatch";

const leads: MatchableLead[] = [
  { id: "1", name: "Bear Flag Towing", phone: "(707) 586-0938", email: "bearflagtowing@gmail.com" },
  { id: "2", name: "Joe's Plumbing, LLC", phone: "707-555-1234", email: "" },
  { id: "custom:abc", name: "Pecota Vineyard", phone: "+1 (530) 677-4365", email: "" },
];

describe("normalizers", () => {
  it("normalizeEmail lowercases and trims", () => {
    expect(normalizeEmail("  Foo@Bar.COM ")).toBe("foo@bar.com");
    expect(normalizeEmail(undefined)).toBe("");
  });

  it("phoneKey reduces to the last 10 digits", () => {
    expect(phoneKey("(707) 586-0938")).toBe("7075860938");
    expect(phoneKey("+1 707 586 0938")).toBe("7075860938");
    expect(phoneKey("555-1234")).toBe("5551234"); // under 10, returned as-is
  });

  it("normalizeBusiness strips punctuation and collapses space", () => {
    expect(normalizeBusiness("Joe's Plumbing, LLC")).toBe("joes plumbing llc");
    expect(normalizeBusiness("  Bear   Flag  Towing ")).toBe("bear flag towing");
  });
});

describe("matchLead", () => {
  it("matches by email first", () => {
    const m = matchLead({ business: "Wrong Name", phone: "", email: "BearFlagTowing@gmail.com" }, leads);
    expect(m?.id).toBe("1");
  });

  it("matches by phone when email is absent (ignoring formatting and country code)", () => {
    const m = matchLead({ business: "", phone: "+1 (530) 677-4365", email: "" }, leads);
    expect(m?.id).toBe("custom:abc");
  });

  it("matches by business name as a last resort", () => {
    const m = matchLead({ business: "joes plumbing llc", phone: "", email: "" }, leads);
    expect(m?.id).toBe("2");
  });

  it("returns null when nothing matches", () => {
    const m = matchLead({ business: "Nonexistent Co", phone: "808-000-0000", email: "no@one.com" }, leads);
    expect(m).toBeNull();
  });

  it("does not match on a blank email or partial phone", () => {
    // entry has empty email + a too-short phone; business doesn't match either
    const m = matchLead({ business: "", phone: "555", email: "" }, leads);
    expect(m).toBeNull();
  });
});

describe("findMatches", () => {
  // Two fragmented rows for one business: one emailable, one phone-only — the
  // real-world CSV duplicate case (Bear Flag Towing).
  const dupes: MatchableLead[] = [
    { id: "a", name: "Bear Flag Towing", phone: "(707) 586-0938", email: "info@bearflag.com" },
    { id: "b", name: "GABA CORP Bear Flag Towing", phone: "707-586-0938", email: "" },
    { id: "c", name: "Unrelated Co", phone: "415-000-0000", email: "x@y.com" },
  ];

  it("returns every record sharing the phone, not just the first", () => {
    const ms = findMatches({ business: "Bear Flag Towing", phone: "(707) 586-0938", email: "" }, dupes);
    expect(ms.map((m) => m.id).sort()).toEqual(["a", "b"]);
  });

  it("sorts email-bearing records first", () => {
    const ms = findMatches({ business: "", phone: "7075860938", email: "" }, dupes);
    expect(ms[0].id).toBe("a"); // the one with an email
  });

  it("unions email, phone, and name matches without duplicates", () => {
    const ms = findMatches({ business: "GABA CORP Bear Flag Towing", phone: "7075860938", email: "info@bearflag.com" }, dupes);
    expect(ms.map((m) => m.id).sort()).toEqual(["a", "b"]);
  });

  it("returns [] when nothing matches", () => {
    expect(findMatches({ business: "Nope", phone: "808-111-2222", email: "no@one.com" }, dupes)).toEqual([]);
  });
});

describe("pickPrimary", () => {
  const recs: MatchableLead[] = [
    { id: "x", name: "Owner Name LLC", phone: "1", email: "" },          // stray, phone-matched
    { id: "y", name: "GABA CORP Bear Flag Towing", phone: "1", email: "" }, // recognizable
  ];

  it("prefers the record whose name contains the business name", () => {
    expect(pickPrimary(recs, "Bear Flag Towing")?.id).toBe("y");
  });

  it("prefers an exact normalized-name match over a partial one", () => {
    const withExact = [...recs, { id: "z", name: "Bear Flag Towing", phone: "1", email: "" }];
    expect(pickPrimary(withExact, "Bear Flag Towing")?.id).toBe("z");
  });

  it("falls back to the first record when no name relation exists", () => {
    expect(pickPrimary(recs, "Totally Different")?.id).toBe("x");
  });

  it("returns null for an empty list", () => {
    expect(pickPrimary([], "Anything")).toBeNull();
  });
});

describe("applyEmailOverrides", () => {
  const leads = [
    { id: "a", email: "" },
    { id: "b", email: "has@email.com" },
    { id: "c", email: "   " },
  ];

  it("fills email only where blank", () => {
    const out = applyEmailOverrides(leads, { a: "new@a.com", c: "new@c.com" });
    expect(out.find((l) => l.id === "a")?.email).toBe("new@a.com");
    expect(out.find((l) => l.id === "c")?.email).toBe("new@c.com");
  });

  it("never overwrites an existing email", () => {
    const out = applyEmailOverrides(leads, { b: "should@not.win" });
    expect(out.find((l) => l.id === "b")?.email).toBe("has@email.com");
  });

  it("returns the same array reference when there are no overrides", () => {
    expect(applyEmailOverrides(leads, {})).toBe(leads);
  });

  it("leaves rows without an override untouched", () => {
    const out = applyEmailOverrides(leads, { a: "new@a.com" });
    expect(out.find((l) => l.id === "b")).toEqual({ id: "b", email: "has@email.com" });
  });
});
