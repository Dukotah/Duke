import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { LocalRedis } from "./localRedis";

// Parity guard: the file-backed LocalRedis must implement every Redis command the
// app actually calls, otherwise that code path works against Upstash (prod) but
// silently throws in local dev. Epoch 5 found 5 such gaps (hget/hdel/rpush/zrem/
// exists); this test prevents the class of bug from regressing as new code lands.
//
// It scans src/** for `redis.<method>(` and `getRedis().<method>(` call sites
// (the patterns used throughout the app) and asserts each method exists on
// LocalRedis. Aliased clients (e.g. `const r = getRedis()`) aren't detected — a
// known, accepted limitation.
function collectCalledMethods(root: string): Set<string> {
  const used = new Set<string>();
  const re = /(?:\bredis|getRedis\(\))\.(\w+)\s*\(/g;
  const entries = fs.readdirSync(root, { recursive: true }) as string[];
  for (const rel of entries) {
    const file = path.join(root, rel.toString());
    if (!/\.(ts|tsx)$/.test(file)) continue;
    if (/localRedis\.(ts|test\.ts)$/.test(file)) continue; // skip the impl + this test
    let src: string;
    try {
      src = fs.readFileSync(file, "utf8");
    } catch {
      continue; // directory entry or unreadable
    }
    let m: RegExpExecArray | null;
    while ((m = re.exec(src)) !== null) used.add(m[1]);
  }
  return used;
}

describe("LocalRedis parity with app usage", () => {
  it("implements every redis command called across src/**", () => {
    const used = collectCalledMethods(path.join(process.cwd(), "src"));
    // Sanity: the scan should find a healthy set of calls, not zero.
    expect(used.size).toBeGreaterThan(5);

    const proto = LocalRedis.prototype as unknown as Record<string, unknown>;
    const missing = [...used].filter((method) => typeof proto[method] !== "function");
    expect(missing).toEqual([]);
  });
});
