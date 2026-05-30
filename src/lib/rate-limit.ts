/**
 * In-memory sliding-window rate limiter for Next.js API routes.
 *
 * Usage:
 *   const result = rateLimit(req, { limit: 5, windowMs: 60_000 });
 *   if (!result.ok) return NextResponse.json({ error: result.message }, { status: 429 });
 */

interface Window {
  count: number;
  resetAt: number;
}

// Module-level store — persists across requests within the same Node.js process.
// On Vercel each serverless function instance has its own store, which is fine
// for this use case (protecting against accidental hammering, not distributed abuse).
const store = new Map<string, Window>();

// Prune stale entries every 5 minutes so memory doesn't grow unboundedly.
const PRUNE_INTERVAL = 5 * 60 * 1000;
let lastPrune = Date.now();

function pruneStale() {
  const now = Date.now();
  if (now - lastPrune < PRUNE_INTERVAL) return;
  lastPrune = now;
  for (const [key, win] of store) {
    if (win.resetAt <= now) store.delete(key);
  }
}

interface RateLimitOptions {
  /** Max requests allowed per window per key */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

interface RateLimitOk    { ok: true;  remaining: number }
interface RateLimitDenied { ok: false; message: string; retryAfterSec: number }

export type RateLimitResult = RateLimitOk | RateLimitDenied;

export function rateLimit(
  req: { headers: { get(name: string): string | null } },
  options: RateLimitOptions
): RateLimitResult {
  pruneStale();

  // Derive a key from IP address. In production behind a reverse proxy,
  // x-forwarded-for is set by the load balancer. Fall back to a single bucket
  // if neither header is present (e.g., local dev).
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  const key = ip;

  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    // Start a fresh window
    store.set(key, { count: 1, resetAt: now + options.windowMs });
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
