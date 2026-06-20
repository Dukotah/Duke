import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { getRedis } from "@/lib/redis";
import { __resetLocalRedis } from "@/lib/localRedis";
import { createTask, getTasks, updateTask, deleteTask } from "./tasks";

// Integration tests for the Redis-backed task store, run against the file-backed
// LocalRedis stand-in pointed at an isolated temp file (the dev .local-db.json is
// never touched). updateTask/deleteTask rely on LocalRedis hget/hdel, so this
// also guards that those commands exist + behave (they previously did not).
const TMP = path.join(os.tmpdir(), `crm-tasks-test-${process.pid}.json`);
const U = "user-1";

beforeAll(() => {
  process.env.LOCAL_DB_FILE = TMP;
  try { fs.rmSync(TMP, { force: true }); } catch { /* ignore */ }
  __resetLocalRedis(); // next getRedis() builds a LocalRedis on the temp file
});

beforeEach(async () => {
  // Clear the test users' task hashes so each test starts empty.
  await getRedis().del("tasks:user-1", "tasks:user-2");
});

afterAll(() => {
  try { fs.rmSync(TMP, { force: true }); } catch { /* ignore */ }
  delete process.env.LOCAL_DB_FILE;
  __resetLocalRedis();
});

describe("tasks store", () => {
  it("creates a task with trimmed title + defaults and lists it back", async () => {
    const t = await createTask(U, { title: "  Call Acme  " });
    expect(t.id).toBeTruthy();
    expect(t.title).toBe("Call Acme");
    expect(t.type).toBe("todo");
    expect(t.done).toBe(false);

    const list = await getTasks(U);
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(t.id);
  });

  it("isolates tasks per user", async () => {
    await createTask(U, { title: "mine" });
    expect(await getTasks("user-2")).toEqual([]);
  });

  it("sorts by dueAt ascending, undated tasks last", async () => {
    await createTask(U, { title: "no-date" });
    await createTask(U, { title: "later", dueAt: "2026-07-10" });
    await createTask(U, { title: "sooner", dueAt: "2026-06-25" });
    expect((await getTasks(U)).map((t) => t.title)).toEqual(["sooner", "later", "no-date"]);
  });

  it("updates a task and preserves untouched fields (exercises hget)", async () => {
    const t = await createTask(U, { title: "follow up", type: "call" });
    await updateTask(U, t.id, { done: true, snoozedUntil: "2026-06-30" });

    const [got] = await getTasks(U);
    expect(got.done).toBe(true);
    expect(got.snoozedUntil).toBe("2026-06-30");
    expect(got.title).toBe("follow up");
    expect(got.type).toBe("call");
  });

  it("update is a no-op for an unknown id", async () => {
    await createTask(U, { title: "keep" });
    await updateTask(U, "does-not-exist", { done: true });
    const list = await getTasks(U);
    expect(list).toHaveLength(1);
    expect(list[0].done).toBe(false);
  });

  it("deletes only the targeted task (exercises hdel)", async () => {
    const a = await createTask(U, { title: "a" });
    const b = await createTask(U, { title: "b" });
    await deleteTask(U, a.id);

    const list = await getTasks(U);
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(b.id);
  });
});
