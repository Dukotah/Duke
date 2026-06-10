import { Redis } from "@upstash/redis";
import { getLocalRedis } from "./localRedis";

// Lazily created so missing env vars only throw at runtime, not build time
let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    // Local development with no Upstash configured: fall back to a file-backed
    // stand-in (data lives in .local-db.json, survives restarts). Production
    // always has the env vars set, so it never reaches this branch.
    if (process.env.NODE_ENV === "production") {
      throw new Error("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set");
    }
    console.warn(
      "[redis] No Upstash env vars — using local file-backed store (.local-db.json). Dev only."
    );
    _redis = getLocalRedis() as unknown as Redis;
    return _redis;
  }
  _redis = new Redis({ url, token });
  return _redis;
}
