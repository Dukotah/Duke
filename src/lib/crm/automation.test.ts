import { describe, expect, it } from "vitest";
import { validateRules } from "./automation";

// validateRules is the trust boundary for admin-supplied automation rules: it
// runs on every POST /api/crm/automation and decides what gets persisted and
// later executed by runStageAutomations in the state-PATCH hot path. Junk that
// slips through could crash that path, so the dropping behaviour is pinned here.
// Pure (no Redis/network) — importing the module is side-effect-free.
describe("validateRules", () => {
  it("returns [] for non-array input", () => {
    expect(validateRules(null)).toEqual([]);
    expect(validateRules(undefined)).toEqual([]);
    expect(validateRules("nope")).toEqual([]);
    expect(validateRules({ toStage: "won" })).toEqual([]);
  });

  it("keeps a well-formed rule and preserves a provided id", () => {
    const out = validateRules([
      { id: "r1", toStage: "won", actions: [{ kind: "setFollowUp", inDays: 3 }] },
    ]);
    expect(out).toEqual([
      { id: "r1", fromStage: undefined, toStage: "won", actions: [{ kind: "setFollowUp", inDays: 3 }] },
    ]);
  });

  it("generates a non-empty id when none is provided", () => {
    const out = validateRules([
      { toStage: "demo", actions: [{ kind: "createTask", title: "Prep deck" }] },
    ]);
    expect(out).toHaveLength(1);
    expect(typeof out[0].id).toBe("string");
    expect(out[0].id.length).toBeGreaterThan(0);
  });

  it("drops a rule with a missing or blank toStage", () => {
    expect(validateRules([{ actions: [{ kind: "setFollowUp", inDays: 1 }] }])).toEqual([]);
    expect(validateRules([{ toStage: "   ", actions: [{ kind: "setFollowUp", inDays: 1 }] }])).toEqual([]);
  });

  it("drops a rule that has zero valid actions", () => {
    expect(validateRules([{ toStage: "won", actions: [] }])).toEqual([]);
    expect(validateRules([{ toStage: "won", actions: [{ kind: "bogus" }] }])).toEqual([]);
    // sendTemplate without a templateId is invalid → no actions left → rule dropped
    expect(validateRules([{ toStage: "won", actions: [{ kind: "sendTemplate" }] }])).toEqual([]);
  });

  it("normalises a createTask action and coerces a non-numeric inDays to undefined", () => {
    const out = validateRules([
      { toStage: "demo", actions: [{ kind: "createTask", title: "  Call back  ", inDays: "soon" }] },
    ]);
    expect(out[0].actions[0]).toEqual({ kind: "createTask", title: "Call back", inDays: undefined });
  });

  it("requires a numeric inDays for setFollowUp", () => {
    expect(validateRules([{ toStage: "won", actions: [{ kind: "setFollowUp" }] }])).toEqual([]);
    expect(validateRules([{ toStage: "won", actions: [{ kind: "setFollowUp", inDays: "5" }] }])).toEqual([]);
  });

  it("trims toStage and normalises a blank fromStage to undefined", () => {
    const out = validateRules([
      { fromStage: "  ", toStage: "  won  ", actions: [{ kind: "setFollowUp", inDays: 2 }] },
    ]);
    expect(out[0].toStage).toBe("won");
    expect(out[0].fromStage).toBeUndefined();
  });

  it("keeps a valid fromStage (trimmed) and filters mixed valid/invalid actions", () => {
    const out = validateRules([
      {
        id: "r2",
        fromStage: " contacted ",
        toStage: "interested",
        actions: [
          { kind: "sendTemplate", templateId: " t1 " },
          { kind: "garbage" },
          { kind: "setFollowUp", inDays: 7 },
        ],
      },
    ]);
    expect(out[0].fromStage).toBe("contacted");
    expect(out[0].actions).toEqual([
      { kind: "sendTemplate", templateId: "t1" },
      { kind: "setFollowUp", inDays: 7 },
    ]);
  });
});
