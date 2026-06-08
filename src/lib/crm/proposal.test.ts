import { describe, it, expect } from "vitest";
import { buildProposal, suggestServices } from "./proposal";
import { PRICING } from "@/config/pricing";
import { EMAIL } from "@/config/site";

describe("suggestServices", () => {
  it("leads with web + cyber for no-site / DIY tiers", () => {
    expect(suggestServices("A")).toEqual(["web", "cybersecurity"]);
    expect(suggestServices("b")).toEqual(["web", "cybersecurity"]);
  });
  it("defaults to web for everyone else", () => {
    expect(suggestServices("C")).toEqual(["web"]);
    expect(suggestServices(undefined)).toEqual(["web"]);
  });
});

describe("buildProposal", () => {
  it("includes the business name, selected services, and canonical pricing", () => {
    const p = buildProposal({ businessName: "Acme Co", services: ["web"], repName: "Duke" });
    expect(p.subject).toContain("Acme Co");
    expect(p.body).toContain("Website design & build");
    expect(p.body).toContain(PRICING.web.range);
  });

  it("sums only one-time services into the estimate (not monthly fees)", () => {
    const p = buildProposal({ businessName: "Acme", services: ["web", "it"] });
    // web is one-time; it is /mo and must not be added to the one-time estimate
    expect(p.estimateLow).toBe(PRICING.web.low);
    expect(p.estimateHigh).toBe(PRICING.web.high);
  });

  it("greets the contact by first name when known", () => {
    const p = buildProposal({ businessName: "Acme", contactName: "Jane Doe", services: ["web"] });
    expect(p.body.startsWith("Hi Jane,")).toBe(true);
  });

  it("uses the configured contact email and no stale calendly link", () => {
    const p = buildProposal({ businessName: "Acme", services: ["web"] });
    expect(p.body).toContain(EMAIL);
    expect(p.body).not.toContain("calendly.com/copperbaytech");
  });

  it("falls back to a web proposal when no services are selected", () => {
    const p = buildProposal({ businessName: "Acme", services: [] });
    expect(p.lineItems).toHaveLength(1);
    expect(p.lineItems[0].service).toBe("web");
  });
});
