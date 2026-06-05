import { describe, expect, it } from "vitest";
import { buildCallScript, buildObjections, OBJECTIONS, topProblem, type PlaybookLead } from "./playbook";

const noSite: PlaybookLead = { name: "Acme Plumbing", city: "Petaluma", category: "Plumbers", tier: "A", website: "" };
const diy: PlaybookLead = { name: "Bay Cafe", city: "Sonoma", category: "Cafes", tier: "B", website: "baycafe.com", builder: "Wix" };
const hasSite: PlaybookLead = { name: "Law Group", city: "Santa Rosa", category: "Law Firms", tier: "C", website: "lawgroup.com" };

describe("playbook — call script", () => {
  it("returns the full 5-block structure", () => {
    const blocks = buildCallScript(noSite, "Duke");
    expect(blocks.map((b) => b.heading)).toEqual([
      "Opener",
      "The hook (their problem)",
      "Value bridge",
      "The ask (book the call)",
      "If they hesitate",
    ]);
    expect(blocks.every((b) => b.lines.length > 0)).toBe(true);
  });

  it("opens differently for no-site vs DIY vs has-site", () => {
    expect(buildCallScript(noSite)[0].lines.join(" ")).toContain("couldn't find a website");
    expect(buildCallScript(diy)[0].lines.join(" ")).toContain("Wix");
    expect(buildCallScript(hasSite)[0].lines.join(" ")).toContain("had a couple of ideas");
  });

  it("personalizes with business, city, and rep name", () => {
    const blocks = buildCallScript(noSite, "Duke");
    const all = blocks.flatMap((b) => b.lines).join(" ");
    expect(all).toContain("Acme Plumbing");
    expect(all).toContain("Petaluma");
    expect(all).toContain("Duke");
  });

  it("falls back to a neutral greeting and 'me' when unknown", () => {
    const all = buildCallScript({ name: "X" }).flatMap((b) => b.lines).join(" ");
    expect(all).toContain("Hi there");
    expect(all).toContain("with Copper Bay Tech");
  });

  it("treats a missing website as no-site regardless of tier", () => {
    expect(buildCallScript({ name: "Y", website: "" })[0].lines.join(" ")).toContain("couldn't find a website");
  });
});

describe("playbook — objections", () => {
  it("covers the common cold-call objections", () => {
    expect(OBJECTIONS.length).toBeGreaterThanOrEqual(6);
    for (const o of OBJECTIONS) {
      expect(o.trigger.length).toBeGreaterThan(0);
      expect(o.response.length).toBeGreaterThan(0);
    }
    expect(OBJECTIONS.some((o) => /cost|how much/i.test(o.trigger))).toBe(true);
  });

  it("fills the [their top problem] placeholder with a lead-specific problem", () => {
    // The static bank still carries the bracketed cue...
    expect(OBJECTIONS.some((o) => o.response.includes("[their top problem]"))).toBe(true);

    // ...but buildObjections resolves it per lead, leaving no brackets behind.
    for (const lead of [noSite, diy, hasSite]) {
      const built = buildObjections(lead);
      expect(built.some((o) => o.response.includes("[their top problem]"))).toBe(false);
      const problem = topProblem(lead);
      expect(built.some((o) => o.response.includes(problem))).toBe(true);
    }
  });

  it("picks a distinct top problem per tier", () => {
    expect(topProblem(noSite)).toMatch(/competitors/i);
    expect(topProblem(diy)).toMatch(/slowly|visitors/i);
    expect(topProblem(hasSite)).toMatch(/slow load|next step/i);
  });
});
