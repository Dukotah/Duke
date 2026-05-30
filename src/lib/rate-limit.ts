interface Window {
  count: number;
  resetAt: number;
}

// Absolute cap on store entries — prevents memory exhaustion under DDoS.
// When full, we evict the oldest (lowest resetAt) entry before inserting.
const MAX_STORE_ENTRIES = 10_000;
const PRUNE_INTERVAL = 5 * 60 * 1000;

const store = new Map<string, Window>();
let lastPrune = Date.now();

function pruneStale() {
  const now = Date.now();
  if (now - lastPrune < PRUNE_INTERVAL) return;
  lastPrune = now;
  for (const [key, win] of store) {
    if (win.resetAt <= now) store.delete(key);
  }
}

function evictOldest() {
  let oldestKey = "";
  let oldestReset = Infinity;
  for (const [key, win] of store) {
    if (win.resetAt < oldestReset) {
      oldestReset = win.resetAt;
      oldestKey = key;
    }
  }
  if (oldestKey) store.delete(oldestKey);
}

// On Vercel, x-forwarded-for is set by the Vercel edge network and contains
// the real client IP as the first element. We take only the LAST value in
// the header to defeat spoofing by clients who pre-set their own XFF header
// before it reaches Vercel's edge (Vercel appends the real IP at the end).
function extractIp(req: { headers: { get(name: string): string | null } }): string {
  const xff = req.headers.get("x-forwarded-for");
  if (!xff) return "unknown";
  // Vercel appends the real client IP as the rightmost entry
  const parts = xff.split(",");
  const ip = parts[parts.length - 1].trim();
  // Basic sanity: only trust IPv4/IPv6 shaped strings
  if (!/^[\d.:a-fA-F[\]]+$/.test(ip)) return "unknown";
  return ip;
}

interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

interface RateLimitOk     { ok: true;  remaining: number }
interface RateLimitDenied { ok: false; message: string; retryAfterSec: number }

export type RateLimitResult = RateLimitOk | RateLimitDenied;

export function rateLimit(
  req: { headers: { get(name: string): string | null } },
  options: RateLimitOptions
): RateLimitResult {
  pruneStale();

  const ip = extractIp(req);
  const now = Date.now();
  const existing = store.get(ip);

  if (!existing || existing.resetAt <= now) {
    if (store.size >= MAX_STORE_ENTRIES) evictOldest();
    store.set(ip, { count: 1, resetAt: now + options.windowMs });
    return { ok: true, remaining: options.limit - 1 };
  }

  if (existing.count >= options.limit) {
    const retryAfterSec = Math.ceil((existing.resetAt - now) / 1000);
    return {
      ok: false,
      message: `Too many requests. Please wait ${retryAfterSec} seconds before trying again.`,
      retryAfterSec,
    };
  }

  existing.count += 1;
  return { ok: true, remaining: options.limit - existing.count };
}
