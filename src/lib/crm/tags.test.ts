import { describe, expect, it } from "vitest";
import {
  createTag, getTags, deleteTag,
  addLeadTag, removeLeadTag, getLeadTags, getAllLeadTagMap,
} from "./tags";
import { setupIsolatedRedis } from "./testRedis";

// Integration tests for the user-tag store against an isolated LocalRedis.
// Exercises hget/hdel/hset/hgetall and the deleteTag cascade that scrubs a
// deleted tag from every lead's tag list.
setupIsolatedRedis("tags");

const U = "user-1";
const LEAD = "lead-A";

describe("tags store", () => {
  it("creates a tag (trimmed) and lists it back", async () => {
    const t = await createTag(U, { label: "  Hot  ", color: "#f00" });
    expect(t.label).toBe("Hot");
    const list = await getTags(U);
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(t.id);
    expect(list[0].color).toBe("#f00");
  });

  it("isolates tags per user", async () => {
    await createTag(U, { label: "mine", color: "#111" });
    expect(await getTags("user-2")).toEqual([]);
  });

  it("assigns a tag to a lead and resolves it via getLeadTags + getAllLeadTagMap", async () => {
    const t = await createTag(U, { label: "VIP", color: "#0f0" });
    await addLeadTag(U, LEAD, t.id);

    const onLead = await getLeadTags(U, LEAD);
    expect(onLead.map((x) => x.id)).toEqual([t.id]);
    expect(await getAllLeadTagMap(U)).toEqual({ [LEAD]: [t.id] });
  });

  it("addLeadTag is idempotent (no duplicate)", async () => {
    const t = await createTag(U, { label: "dup", color: "#00f" });
    await addLeadTag(U, LEAD, t.id);
    await addLeadTag(U, LEAD, t.id);
    expect((await getAllLeadTagMap(U))[LEAD]).toEqual([t.id]);
  });

  it("removeLeadTag drops the lead entry once its last tag is gone", async () => {
    const t = await createTag(U, { label: "solo", color: "#abc" });
    await addLeadTag(U, LEAD, t.id);
    await removeLeadTag(U, LEAD, t.id);
    expect(await getAllLeadTagMap(U)).toEqual({});
    expect(await getLeadTags(U, LEAD)).toEqual([]);
  });

  it("deleteTag removes the definition AND scrubs it from every lead", async () => {
    const keep = await createTag(U, { label: "keep", color: "#111" });
    const gone = await createTag(U, { label: "gone", color: "#222" });
    await addLeadTag(U, "lead-1", keep.id);
    await addLeadTag(U, "lead-1", gone.id);
    await addLeadTag(U, "lead-2", gone.id); // lead-2 only has the doomed tag

    await deleteTag(U, gone.id);

    // definition removed
    expect((await getTags(U)).map((t) => t.id)).toEqual([keep.id]);
    // lead-1 keeps the surviving tag; lead-2 (only the deleted tag) is dropped entirely
    expect(await getAllLeadTagMap(U)).toEqual({ "lead-1": [keep.id] });
  });
});
