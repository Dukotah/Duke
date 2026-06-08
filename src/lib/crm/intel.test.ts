import { describe, it, expect } from "vitest";
import {
  engagementSignalsFromActivities,
  engagementBoost,
  scoreWithEngagement,
} from "./intel";

describe("engagementSignalsFromActivities", () => {
  it("returns an all-zero/false signal for no activity", () => {
    expect(engagementSignalsFromActivities([])).toEqual({
      opens: 0,
      clicks: 0,
      calls: 0,
      replied: false,
      interested: false,
      notInterested: false,
    });
  });

  it("counts email opens and clicks", () => {
    const s = engagementSignalsFromActivities([
      { type: "email", outcome: "opened" },
      { type: "email", outcome: "opened" },
      { type: "email", outcome: "clicked" },
    ]);
    expect(s.opens).toBe(2);
    expect(s.clicks).toBe(1);
  });

  it("flags a reply", () => {
    const s = engagementSignalsFromActivities([{ type: "email", outcome: "replied" }]);
    expect(s.replied).toBe(true);
  });

  it("derives interested / not_interested from calls and status changes", () => {
    expect(engagementSignalsFromActivities([{ type: "call", outcome: "interested" }]).interested).toBe(true);
    expect(engagementSignalsFromActivities([{ type: "call", outcome: "not_interested" }]).notInterested).toBe(true);
    expect(engagementSignalsFromActivities([{ type: "status_change", outcome: "interested" }]).interested).toBe(true);
  });

  it("counts calls regardless of outcome", () => {
    const s = engagementSignalsFromActivities([
      { type: "call", outcome: "no_answer" },
      { type: "call", outcome: "voicemail" },
    ]);
    expect(s.calls).toBe(2);
  });
});

describe("engagementBoost", () => {
  const zero = {
    opens: 0, clicks: 0, calls: 0, replied: false, interested: false, notInterested: false,
  };

  it("is 0 with no signals", () => {
    expect(engagementBoost(zero)).toBe(0);
  });

  it("rewards replies and interested most", () => {
    expect(engagementBoost({ ...zero, replied: true })).toBe(30);
    expect(engagementBoost({ ...zero, interested: true })).toBe(25);
  });

  it("caps opens and clicks so one inbox can't dominate", () => {
    expect(engagementBoost({ ...zero, opens: 99 })).toBe(9); // capped at 3 * 3
    expect(engagementBoost({ ...zero, clicks: 99 })).toBe(18); // capped at 3 * 6
  });

  it("sinks a not-interested lead below everything in play", () => {
    expect(engagementBoost({ ...zero, replied: true, notInterested: true })).toBe(-100);
  });
});

describe("scoreWithEngagement", () => {
  it("clamps the base score to 0-100", () => {
    expect(scoreWithEngagement(150, { ...{ opens: 0, clicks: 0, calls: 0, replied: false, interested: false, notInterested: false } }).base).toBe(100);
    expect(scoreWithEngagement(-5, { opens: 0, clicks: 0, calls: 0, replied: false, interested: false, notInterested: false }).base).toBe(0);
  });

  it("adds the boost and clamps the result to 100", () => {
    const r = scoreWithEngagement(90, { opens: 0, clicks: 0, calls: 0, replied: true, interested: false, notInterested: false });
    expect(r.boost).toBe(30);
    expect(r.score).toBe(100); // 90 + 30 clamped
  });

  it("a hot, engaged lead outranks a higher static score that's gone cold", () => {
    const engaged = scoreWithEngagement(60, engagementSignalsFromActivities([
      { type: "email", outcome: "clicked" },
      { type: "call", outcome: "interested" },
    ]));
    const stale = scoreWithEngagement(75, engagementSignalsFromActivities([]));
    expect(engaged.score).toBeGreaterThan(stale.score);
  });

  it("a not-interested lead drops to 0 regardless of base", () => {
    const r = scoreWithEngagement(95, { opens: 0, clicks: 0, calls: 1, replied: false, interested: false, notInterested: true });
    expect(r.score).toBe(0);
  });
});
