// Local, file-backed stand-in for Upstash Redis — used ONLY for local development
// when UPSTASH_REDIS_REST_URL/TOKEN are not set (see redis.ts). It implements the
// subset of Redis commands this app actually uses, backed by a JSON file on disk
// so data survives dev-server restarts. It is NEVER used in production: when the
// Upstash env vars are present, redis.ts returns the real client instead.
//
// Design note — type fidelity: @upstash/redis serializes/deserializes values, and
// this app relies on that contract two ways at once (it pre-JSON.stringifies some
// hash fields and expects the *string* back, while expecting numbers/booleans for
// others). We therefore store native JS values verbatim and return them verbatim.
// That makes both styles round-trip correctly, because wherever the app wants a
// string back it already passed a string in, and wherever it wants a number/boolean
// it passed one in.
//
// Persistence is synchronous and best-effort; the data volume in local dev is tiny.
import fs from "node:fs";
import path from "node:path";

type Entry =
  | { t: "kv"; v: string | number }
  | { t: "h"; v: Record<string, unknown> }
  | { t: "s"; v: unknown[] }
  | { t: "l"; v: unknown[] }
  | { t: "z"; v: { score: number; member: string }[] };

interface Persisted {
  data: Record<string, Entry>;
  expires: Record<string, number>; // key -> epoch ms
}

// Redis-style range slice supporting negative indices (-1 = last element).
function sliceRange<T>(arr: T[], start: number, stop: number): T[] {
  const len = arr.length;
  let s = start < 0 ? Math.max(len + start, 0) : start;
  let e = stop < 0 ? len + stop : stop;
  if (e >= len) e = len - 1;
  if (s < 0) s = 0;
  if (s > e || len === 0) return [];
  return arr.slice(s, e + 1);
}

// Glob (only `*` is used by this app) -> RegExp.
function globToRegExp(pattern: string): RegExp {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, (ch) => (ch === "*" ? ".*" : "\\" + ch));
  return new RegExp(`^${escaped}$`);
}

export class LocalRedis {
  private data: Record<string, Entry> = {};
  private expires: Record<string, number> = {};
  private file: string;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(file: string) {
    this.file = file;
    try {
      if (fs.existsSync(file)) {
        const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as Persisted;
        this.data = parsed.data ?? {};
        this.expires = parsed.expires ?? {};
      }
    } catch {
      // Corrupt/unreadable file: start fresh rather than crash the dev server.
      this.data = {};
      this.expires = {};
    }
    // Best-effort flush on shutdown so an in-flight tick isn't lost.
    const flush = () => this.flush();
    process.once("beforeExit", flush);
    process.once("SIGINT", flush);
    process.once("SIGTERM", flush);
  }

  // ── persistence ─────────────────────────────────────────────────────────────
  private flush(): void {
    try {
      fs.writeFileSync(this.file, JSON.stringify({ data: this.data, expires: this.expires }));
    } catch {
      /* best-effort; ignore disk errors in dev */
    }
  }
  private save(): void {
    // Coalesce bursts of writes within a tick into a single disk write.
    if (this.saveTimer) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      this.flush();
    }, 25);
  }

  // ── expiry ────────────────────────────────────────────────────────────────────
  private alive(key: string): Entry | undefined {
    const exp = this.expires[key];
    if (exp !== undefined && exp <= Date.now()) {
      delete this.data[key];
      delete this.expires[key];
      return undefined;
    }
    return this.data[key];
  }

  // ── strings / numbers ──────────────────────────────────────────────────────────
  async get(key: string): Promise<string | number | null> {
    const e = this.alive(key);
    return e && e.t === "kv" ? e.v : null;
  }

  async set(key: string, value: string | number, opts?: { ex?: number; px?: number }): Promise<"OK"> {
    this.data[key] = { t: "kv", v: value };
    if (opts?.ex !== undefined) this.expires[key] = Date.now() + opts.ex * 1000;
    else if (opts?.px !== undefined) this.expires[key] = Date.now() + opts.px;
    else delete this.expires[key];
    this.save();
    return "OK";
  }

  async incr(key: string): Promise<number> {
    const e = this.alive(key);
    const n = (e && e.t === "kv" ? Number(e.v) : 0) + 1;
    this.data[key] = { t: "kv", v: n };
    this.save();
    return n;
  }

  // ── hashes ──────────────────────────────────────────────────────────────────────
  async hset(key: string, obj: Record<string, unknown>): Promise<number> {
    const e = this.alive(key);
    const h = e && e.t === "h" ? e.v : {};
    Object.assign(h, obj);
    this.data[key] = { t: "h", v: h };
    this.save();
    return Object.keys(obj).length;
  }

  async hgetall(key: string): Promise<Record<string, unknown> | null> {
    const e = this.alive(key);
    if (!e || e.t !== "h") return null;
    return Object.keys(e.v).length ? { ...e.v } : null;
  }

  async hincrby(key: string, field: string, by: number): Promise<number> {
    const e = this.alive(key);
    const h = e && e.t === "h" ? e.v : {};
    const next = Number(h[field] ?? 0) + by;
    h[field] = next;
    this.data[key] = { t: "h", v: h };
    this.save();
    return next;
  }

  async hget(key: string, field: string): Promise<unknown> {
    const e = this.alive(key);
    if (!e || e.t !== "h") return null;
    return e.v[field] ?? null;
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    const e = this.alive(key);
    if (!e || e.t !== "h") return 0;
    let removed = 0;
    for (const f of fields) {
      if (f in e.v) {
        delete e.v[f];
        removed++;
      }
    }
    this.data[key] = { t: "h", v: e.v };
    this.save();
    return removed;
  }

  // ── sets ────────────────────────────────────────────────────────────────────────
  async sadd(key: string, ...members: unknown[]): Promise<number> {
    const e = this.alive(key);
    const s = e && e.t === "s" ? e.v : [];
    let added = 0;
    for (const m of members) {
      if (!s.some((x) => x === m)) {
        s.push(m);
        added++;
      }
    }
    this.data[key] = { t: "s", v: s };
    this.save();
    return added;
  }

  async smembers(key: string): Promise<unknown[]> {
    const e = this.alive(key);
    return e && e.t === "s" ? [...e.v] : [];
  }

  async srem(key: string, ...members: unknown[]): Promise<number> {
    const e = this.alive(key);
    if (!e || e.t !== "s") return 0;
    const before = e.v.length;
    e.v = e.v.filter((x) => !members.includes(x));
    this.data[key] = { t: "s", v: e.v };
    this.save();
    return before - e.v.length;
  }

  async scard(key: string): Promise<number> {
    const e = this.alive(key);
    return e && e.t === "s" ? e.v.length : 0;
  }

  // ── lists ────────────────────────────────────────────────────────────────────────
  async lpush(key: string, ...values: unknown[]): Promise<number> {
    const e = this.alive(key);
    const l = e && e.t === "l" ? e.v : [];
    for (const v of values) l.unshift(v); // each new value goes to the head, Redis-style
    this.data[key] = { t: "l", v: l };
    this.save();
    return l.length;
  }

  async rpush(key: string, ...values: unknown[]): Promise<number> {
    const e = this.alive(key);
    const l = e && e.t === "l" ? e.v : [];
    for (const v of values) l.push(v); // appended to the tail, Redis-style
    this.data[key] = { t: "l", v: l };
    this.save();
    return l.length;
  }

  async lrange(key: string, start: number, stop: number): Promise<unknown[]> {
    const e = this.alive(key);
    if (!e || e.t !== "l") return [];
    return sliceRange(e.v, start, stop);
  }

  async ltrim(key: string, start: number, stop: number): Promise<"OK"> {
    const e = this.alive(key);
    if (e && e.t === "l") {
      e.v = sliceRange(e.v, start, stop);
      this.data[key] = { t: "l", v: e.v };
      this.save();
    }
    return "OK";
  }

  // ── sorted sets ──────────────────────────────────────────────────────────────────
  async zadd(key: string, ...entries: { score: number; member: string }[]): Promise<number> {
    const e = this.alive(key);
    const z = e && e.t === "z" ? e.v : [];
    let added = 0;
    for (const { score, member } of entries) {
      const idx = z.findIndex((m) => m.member === member);
      if (idx >= 0) z[idx].score = score;
      else {
        z.push({ score, member });
        added++;
      }
    }
    this.data[key] = { t: "z", v: z };
    this.save();
    return added;
  }

  async zrem(key: string, ...members: string[]): Promise<number> {
    const e = this.alive(key);
    if (!e || e.t !== "z") return 0;
    const before = e.v.length;
    e.v = e.v.filter((m) => !members.includes(m.member));
    this.data[key] = { t: "z", v: e.v };
    this.save();
    return before - e.v.length;
  }

  async zrange(
    key: string,
    start: number,
    stop: number,
    opts?: { rev?: boolean }
  ): Promise<string[]> {
    const e = this.alive(key);
    if (!e || e.t !== "z") return [];
    const sorted = [...e.v].sort((a, b) => a.score - b.score || (a.member < b.member ? -1 : 1));
    if (opts?.rev) sorted.reverse();
    return sliceRange(sorted, start, stop).map((m) => m.member);
  }

  // ── keyspace ────────────────────────────────────────────────────────────────────
  async del(...keys: string[]): Promise<number> {
    let count = 0;
    for (const key of keys) {
      if (this.data[key] !== undefined) {
        delete this.data[key];
        delete this.expires[key];
        count++;
      }
    }
    this.save();
    return count;
  }

  async keys(pattern: string): Promise<string[]> {
    const re = globToRegExp(pattern);
    return Object.keys(this.data).filter((k) => this.alive(k) !== undefined && re.test(k));
  }

  async exists(...keys: string[]): Promise<number> {
    let count = 0;
    for (const key of keys) if (this.alive(key) !== undefined) count++;
    return count;
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (this.alive(key) === undefined) return 0;
    this.expires[key] = Date.now() + seconds * 1000;
    this.save();
    return 1;
  }

  async ping(): Promise<string> {
    return "PONG";
  }
}

let _local: LocalRedis | null = null;

export function getLocalRedis(): LocalRedis {
  if (_local) return _local;
  const file = process.env.LOCAL_DB_FILE?.trim() || path.join(process.cwd(), ".local-db.json");
  _local = new LocalRedis(file);
  return _local;
}

/**
 * Test-only: drop the cached singleton so the next `getLocalRedis()` re-reads
 * `LOCAL_DB_FILE`. Lets vitest point the store at an isolated temp file per
 * suite instead of polluting the dev `.local-db.json`. Not used at runtime.
 */
export function __resetLocalRedis(): void {
  _local = null;
}
