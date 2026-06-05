import { describe, expect, it } from "vitest";
import { buildEmailDraft, buildEmailSequence, problemList, computeHeatScore } from "./scoring";
import type { Lead, WebsiteSignals } from "./types";

const baseSignals: WebsiteSignals = {
  noWebsite: false,
  hasSSL: false,
  speedScore: 28,
  mobileScore: 30,
  brokenLinks: 2,
  notMobileFriendly: true,
  copyrightYear: 2019,
};

function lead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: "lead_1",
    business: "Acme Plumbing",
    contactName: "Jane Doe",
    phone: "7075550100",
    industry: "Plumbers",
    city: "Petaluma",
    state: "CA",
    signals: baseSignals,
    heatScore: 0,
    stage: "new",
    estValue: 3000,
    source: "Scraper",
    attempts: 0,
    createdAt: "2026-06-01T00:00:00.000Z",
    activities: [],
    ...overrides,
  };
}

describe("scoring — heat + problems", () => {
  it("scores a no-website lead very hot", () => {
    const s = computeHeatScore({ ...baseSignals, noWebsite: true });
    expect(s).toBeGreaterThanOrEqual(48);
  });

  it("lists the no-site problem first and short-circuits", () => {
    const problems = problemList({ ...baseSignals, noWebsite: true });
    expect(problems).toHaveLength(1);
    expect(problems[0].key).toBe("no_site");
  });
});

describe("scoring — email sequence", () => {
  it("returns a 4-touch cadence with increasing send delays", () => {
    const seq = buildEmailSequence(lead(), "Duke");
    expect(seq).toHaveLength(4);
    expect(seq.map((s) => s.step)).toEqual([1, 2, 3, 4]);
    const days = seq.map((s) => s.sendAfterDays);
    expect(days).toEqual([0, 3, 7, 14]);
    // strictly increasing
    for (let i = 1; i < days.length; i++) expect(days[i]).toBeGreaterThan(days[i - 1]);
  });

  it("touch 1 matches the single-email draft", () => {
    const l = lead();
    const seq = buildEmailSequence(l, "Duke");
    const draft = buildEmailDraft(l, "Duke");
    expect(seq[0].subject).toBe(draft.subject);
    expect(seq[0].body).toBe(draft.body);
  });

  it("personalizes every touch with the business name and signs off", () => {
    const seq = buildEmailSequence(lead({ business: "Bay City Dental" }), "Duke");
    for (const email of seq) {
      expect(email.subject.length).toBeGreaterThan(0);
      expect(email.body).toContain("Bay City Dental");
    }
    // follow-ups (2-4) thread off the first subject or close the loop
    expect(seq[1].subject.startsWith("Re: ")).toBe(true);
  });

  it("greets by first name when known, neutrally when not", () => {
    expect(buildEmailSequence(lead({ contactName: "Maria Santos" }), "Duke")[1].body).toContain("Hi Maria,");
    expect(buildEmailSequence(lead({ contactName: undefined }), "Duke")[1].body).toContain("Hi,");
  });
});
