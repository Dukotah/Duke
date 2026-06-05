import { describe, expect, it } from "vitest";
import { bestTimeToCall, buildCadence, buildCallScript, buildObjections, OBJECTIONS, openerTemplateKey, suggestCadence, topProblem, type PlaybookLead } from "./playbook";

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

describe("playbook — follow-up cadence", () => {
  it("uses the no-site opener for tier A and the upgrade opener otherwise", () => {
    expect(openerTemplateKey(noSite)).toBe("no_website");
    expect(openerTemplateKey(diy)).toBe("diy_upgrade");
    expect(openerTemplateKey(hasSite)).toBe("diy_upgrade");
  });

  it("builds the 4-touch day-0/3/7/14 sequence", () => {
    const c = buildCadence(noSite);
    expect(c.map((t) => t.day)).toEqual([0, 3, 7, 14]);
    expect(c.map((t) => t.step)).toEqual([1, 2, 3, 4]);
    expect(c.map((t) => t.templateKey)).toEqual(["no_website", "follow_up", "follow_up_angle", "follow_up_breakup"]);
  });

  it("recommends the opener, due now, when nothing has been sent", () => {
    const s = suggestCadence(noSite, 0, null);
    expect(s.next?.label).toBe("Opener");
    expect(s.due).toBe(true);
    expect(s.daysUntilDue).toBe(0);
  });

  it("holds the next touch until the gap to the prior one elapses", () => {
    // opener sent yesterday: bump is at day 3, so wait 2 more days
    const soon = suggestCadence(noSite, 1, 1);
    expect(soon.next?.label).toBe("Bump");
    expect(soon.due).toBe(false);
    expect(soon.daysUntilDue).toBe(2);

    // opener sent 3 days ago: bump is due now
    const ready = suggestCadence(noSite, 1, 3);
    expect(ready.due).toBe(true);
    expect(ready.daysUntilDue).toBe(0);
  });

  it("returns no next touch once the sequence is exhausted", () => {
    const s = suggestCadence(noSite, 4, 20);
    expect(s.next).toBeNull();
    expect(s.due).toBe(false);
  });
});

describe("playbook — best time to call", () => {
  it("returns an industry-specific window for known categories", () => {
    expect(bestTimeToCall("Plumbers")).toMatch(/job sites/i);
    expect(bestTimeToCall("Restaurants")).toMatch(/lunch and dinner/i);
    expect(bestTimeToCall("Hair Salon")).toMatch(/appointments/i);
  });

  it("falls back to a sensible default for unknown or empty categories", () => {
    const fallback = bestTimeToCall();
    expect(fallback).toMatch(/mid-morning/i);
    expect(bestTimeToCall("Underwater Basket Weaving")).toBe(fallback);
    expect(bestTimeToCall("")).toBe(fallback);
  });
});
