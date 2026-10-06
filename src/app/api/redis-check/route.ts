import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

// TEMPORARY verification endpoint. Reports which Upstash host prod is actually
// configured with (hostname only — never the token) and whether a live round
// trip works. Gated by ?k=cbt-diag. DELETE after verifying the env repoint.
export const maxDuration = 20;

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("k") !== "cbt-diag") {
    return NextResponse.json({ error: "nope" }, { status: 404 });
  }

  const url = process.env.UPSTASH_REDIS_REST_URL ?? "";
  let host = "(unset)";
  try {
    host = url ? new URL(url).hostname : "(empty)";
  } catch {
    host = "(unparseable)";
  }
  const tokenSet = Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

  let pingOk = false;
  let pingMs = -1;
  let pingErr: string | null = null;
  try {
    const redis = getRedis();
    const m = Date.now();
    await redis.set("__redis_check__", "ok");
    const v = await redis.get("__redis_check__");
    pingMs = Date.now() - m;
    pingOk = v === "ok";
  } catch (e) {
    pingErr = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  return NextResponse.json({ configuredHost: host, tokenSet, pingOk, pingMs, pingErr });
}
