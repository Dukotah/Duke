import { getRedis } from "./redis";
import { withTimeout } from "./withTimeout";

/**
 * Fixed-window rate limiter backed by Upstash Redis.
 *
 * Fails OPEN — if Redis is unreachable, unconfigured, OR HANGS, the request is
 * allowed. This is abuse/spam mitigation on public endpoints, NOT authentication,
 * so we never block (or stall) a real visitor because of an infra hiccup. The
 * hard timeout is critical: a misconfigured Upstash URL hangs incr() with no
 * error, which would otherwise hang the whole API request forever.
 */
export async function rateLimit(
  key: string,
  opts: { limit: number; windowSec: number },
): Promise<{ ok: boolean; remaining: number }> {
  try {
    const redis = getRedis();
    const bucket = `ratelimit:${key}`;
    const count = await withTimeout(redis.incr(bucket), 2000, "rateLimit.incr");
    // Set the window on first hit so the bucket auto-expires.
    if (count === 1) await withTimeout(redis.expire(bucket, opts.windowSec), 2000, "rateLimit.expire");
    return { ok: count <= opts.limit, remaining: Math.max(0, opts.limit - count) };
  } catch {
    return { ok: true, remaining: opts.limit };
  }
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
