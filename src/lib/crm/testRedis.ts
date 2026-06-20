// Shared vitest helper for integration tests over the file-backed LocalRedis.
// Call `setupIsolatedRedis("<label>")` once at the top of a suite: it points the
// store at an isolated temp file (so the dev .local-db.json is never touched),
// flushes every key before each test, and cleans up afterward. Test-only — only
// imported by *.test.ts files, never by app/runtime code.
import { afterAll, beforeAll, beforeEach } from "vitest";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import { getRedis } from "@/lib/redis";
import { __resetLocalRedis } from "@/lib/localRedis";

export function setupIsolatedRedis(label: string): void {
  const file = path.join(os.tmpdir(), `crm-test-${label}-${process.pid}.json`);

  beforeAll(() => {
    process.env.LOCAL_DB_FILE = file;
    try { fs.rmSync(file, { force: true }); } catch { /* ignore */ }
    __resetLocalRedis(); // next getRedis() builds a LocalRedis on the temp file
  });

  beforeEach(async () => {
    const redis = getRedis();
    const keys = await redis.keys("*");
    if (keys.length) await redis.del(...keys);
  });

  afterAll(() => {
    try { fs.rmSync(file, { force: true }); } catch { /* ignore */ }
    delete process.env.LOCAL_DB_FILE;
    __resetLocalRedis();
  });
}
