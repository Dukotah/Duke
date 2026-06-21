import { describe, expect, it } from "vitest";
import { createSmartList, getSmartLists, deleteSmartList } from "./smartlists";
import { setupIsolatedRedis } from "./testRedis";

// Integration tests for saved smart lists (private vs team scope) against an
// isolated LocalRedis temp store.
setupIsolatedRedis("smartlists");

const U = "user-1";

describe("smart lists store", () => {
  it("creates a private list (trimmed) visible only to its owner", async () => {
    const l = await createSmartList(U, { name: "  Hot Sonoma  ", scope: "private", filters: { county: "Sonoma" } });
    expect(l.name).toBe("Hot Sonoma");

    const mine = await getSmartLists(U);
    expect(mine.map((x) => x.id)).toEqual([l.id]);
    expect(await getSmartLists("user-2")).toEqual([]); // private to owner
  });

  it("shows team lists to every user", async () => {
    const team = await createSmartList(U, { name: "Team A-leads", scope: "team", filters: { tier: "A" }, ownerName: "Duke" });
    const other = await getSmartLists("user-2");
    expect(other.map((x) => x.id)).toContain(team.id);
  });

  it("returns private lists before shared team lists", async () => {
    const shared = await createSmartList(U, { name: "shared", scope: "team", filters: {} });
    const priv = await createSmartList(U, { name: "private", scope: "private", filters: {} });
    const ids = (await getSmartLists(U)).map((x) => x.id);
    expect(ids.indexOf(priv.id)).toBeLessThan(ids.indexOf(shared.id));
  });

  it("deletes an owned private list and leaves others intact", async () => {
    const a = await createSmartList(U, { name: "a", scope: "private", filters: {} });
    const b = await createSmartList(U, { name: "b", scope: "private", filters: {} });
    await deleteSmartList(U, a.id);
    const ids = (await getSmartLists(U)).map((x) => x.id);
    expect(ids).toEqual([b.id]);
  });

  it("keeps newest-first order after deleting a private list (regression)", async () => {
    // Created oldest→newest, so getSmartLists returns [c, b, a] (newest-first).
    const a = await createSmartList(U, { name: "a", scope: "private", filters: {} });
    const b = await createSmartList(U, { name: "b", scope: "private", filters: {} });
    const c = await createSmartList(U, { name: "c", scope: "private", filters: {} });
    expect((await getSmartLists(U)).map((x) => x.id)).toEqual([c.id, b.id, a.id]);

    // Delete the middle one; the rewrite must preserve newest-first ordering.
    await deleteSmartList(U, b.id);
    expect((await getSmartLists(U)).map((x) => x.id)).toEqual([c.id, a.id]);
  });

  it("keeps newest-first order after deleting a shared team list (regression)", async () => {
    const a = await createSmartList(U, { name: "ta", scope: "team", filters: {} });
    const b = await createSmartList(U, { name: "tb", scope: "team", filters: {} });
    const c = await createSmartList(U, { name: "tc", scope: "team", filters: {} });
    await deleteSmartList(U, b.id);
    const shared = (await getSmartLists("user-2")).map((x) => x.id);
    expect(shared).toEqual([c.id, a.id]);
  });

  it("only the owner can delete a shared team list", async () => {
    const team = await createSmartList(U, { name: "owned", scope: "team", filters: {} });
    await deleteSmartList("user-2", team.id); // non-owner → silent no-op
    expect((await getSmartLists("user-2")).map((x) => x.id)).toContain(team.id);

    await deleteSmartList(U, team.id); // owner → removed
    expect((await getSmartLists("user-2")).map((x) => x.id)).not.toContain(team.id);
  });
});
