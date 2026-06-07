import { describe, it, expect } from "vitest";
import { getNextStep, personalizeSequence, MAX_SEQUENCE_STEP, SEQUENCE } from "@/lib/crm/sequences";

describe("drip sequences", () => {
  it("returns step 1 when currentStep is 0", () => {
    const next = getNextStep(0);
    expect(next).not.toBeNull();
    expect(next!.step).toBe(1);
  });

  it("returns step 2 when currentStep is 1", () => {
    const next = getNextStep(1);
    expect(next!.step).toBe(2);
  });

  it("returns null when currentStep equals MAX_SEQUENCE_STEP", () => {
    const next = getNextStep(MAX_SEQUENCE_STEP);
    expect(next).toBeNull();
  });

  it("returns null past MAX_SEQUENCE_STEP", () => {
    expect(getNextStep(99)).toBeNull();
  });

  it("each step has a positive delayDays", () => {
    for (const step of SEQUENCE) {
      expect(step.delayDays).toBeGreaterThan(0);
    }
  });

  it("personalizes {name} and {business} placeholders", () => {
    const lead = { name: "Sunrise Bakery", email: "hello@sunrise.com" };
    const result = personalizeSequence("Hi {name}, we'd love to help {business}.", lead);
    expect(result).toBe("Hi Sunrise, we'd love to help Sunrise Bakery.");
  });

  it("falls back to domain when name is empty", () => {
    const lead = { name: "", email: "contact@mybiz.com" };
    const result = personalizeSequence("{business}", lead);
    expect(result).toBe("mybiz.com");
  });

  it("handles leads with single-word names", () => {
    const lead = { name: "Duke", email: "duke@copperbaytech.com" };
    const result = personalizeSequence("Hi {name}!", lead);
    expect(result).toBe("Hi Duke!");
  });

  it("sequence steps are in ascending order", () => {
    for (let i = 1; i < SEQUENCE.length; i++) {
      expect(SEQUENCE[i].step).toBeGreaterThan(SEQUENCE[i - 1].step);
    }
  });

  it("all steps have non-empty subject and body", () => {
    for (const step of SEQUENCE) {
      expect(step.subject.trim().length).toBeGreaterThan(0);
      expect(step.body.trim().length).toBeGreaterThan(0);
    }
  });
});
