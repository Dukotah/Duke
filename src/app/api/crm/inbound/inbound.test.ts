import { describe, expect, it } from "vitest";
import { extractSender, extractMessage } from "./parse";

// The inbound webhook accepts several payload shapes. These pure parsers are
// the load-bearing part of matching a reply to a lead, so they're unit-tested
// here without needing Redis (the route's POST handler does the I/O).

describe("inbound payload parsing — extractSender", () => {
  it("parses Resend Inbound nested {email,name}", () => {
    const r = extractSender({ from: { email: "Owner@Shop.com", name: "Jane Owner" } });
    expect(r.email).toBe("owner@shop.com");
    expect(r.name).toBe("Jane Owner");
  });

  it("parses a bare string address", () => {
    expect(extractSender({ from: "Bob@Cafe.io" }).email).toBe("bob@cafe.io");
  });

  it("parses a 'Name <email>' string and splits the display name", () => {
    const r = extractSender({ from: '"Bob Smith" <bob@cafe.io>' });
    expect(r.email).toBe("bob@cafe.io");
    expect(r.name).toBe("Bob Smith");
  });

  it("looks through a `data` wrapper (Resend webhook envelope)", () => {
    const r = extractSender({ data: { from: { email: "x@y.com" } } });
    expect(r.email).toBe("x@y.com");
  });

  it("accepts generic fallbacks (from_email / sender)", () => {
    expect(extractSender({ from_email: "a@b.com" }).email).toBe("a@b.com");
    expect(extractSender({ sender: "c@d.com" }).email).toBe("c@d.com");
  });

  it("returns empty email when there is no resolvable sender", () => {
    expect(extractSender({}).email).toBe("");
  });
});

describe("inbound payload parsing — extractMessage", () => {
  it("pulls subject/text/html from the top level", () => {
    const m = extractMessage({ subject: "Re: your offer", text: "Sounds good", html: "<p>Sounds good</p>" });
    expect(m).toEqual({ subject: "Re: your offer", text: "Sounds good", html: "<p>Sounds good</p>" });
  });

  it("pulls the message from a `data` wrapper", () => {
    const m = extractMessage({ data: { subject: "Hi", text: "Hello" } });
    expect(m.subject).toBe("Hi");
    expect(m.text).toBe("Hello");
    expect(m.html).toBeUndefined();
  });

  it("ignores non-string fields", () => {
    // @ts-expect-error — deliberately wrong type to prove it's filtered
    const m = extractMessage({ subject: 42, text: null });
    expect(m.subject).toBeUndefined();
    expect(m.text).toBeUndefined();
  });
});
