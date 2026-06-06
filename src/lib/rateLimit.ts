import { getRedis } from "./redis";

/**
 * Fixed-window rate limiter backed by Upstash Redis.
 *
 * Fails OPEN — if Redis is unreachable or unconfigured, the request is allowed.
 * This is abuse/spam mitigation on public endpoints, NOT authentication, so we
 * never block a real visitor because of an infra hiccup.
 */
export async function rateLimit(
  key: string,
  opts: { limit: number; windowSec: number },
): Promise<{ ok: boolean; remaining: number }> {
  try {
    const redis = getRedis();
    const bucket = `ratelimit:${key}`;
    const count = await redis.incr(bucket);
    // Set the window on first hit so the bucket auto-expires.
    if (count === 1) await redis.expire(bucket, opts.windowSec);
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
