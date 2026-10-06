import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getUserByEmail, listUsers, findCustomLeadId } from "@/lib/db";

// TEMPORARY diagnostic — measures each step of the inbound-capture path and
// returns the timings in the response body (console.logs inside the raced
// capture promise get frozen after the response returns, so they never flush).
// Gated by ?k=cbt-diag so it isn't casually hit. DELETE after diagnosis.
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("k") !== "cbt-diag") {
    return NextResponse.json({ error: "nope" }, { status: 404 });
  }
  const t: Record<string, number> = {};
  const redis = getRedis();

  let m = Date.now();
  const rawPing = await redis.get("a-key-that-does-not-exist-diag");
  t.singleGetMs = Date.now() - m;

  m = Date.now();
  const userIds = (await redis.smembers("users:index")) as string[];
  t.smembersUsersMs = Date.now() - m;

  m = Date.now();
  const adminEmail = process.env.ADMIN_EMAIL ?? null;
  const byEmail = adminEmail ? await getUserByEmail(adminEmail) : null;
  t.getUserByEmailMs = Date.now() - m;

  m = Date.now();
  const users = await listUsers();
  t.listUsersMs = Date.now() - m;

  m = Date.now();
  const found = await findCustomLeadId(users[0]?.id ?? "none", {
    email: "diag-nobody@example.com",
    website: "https://diag-nobody.example.com",
  });
  t.findCustomLeadIdMs = Date.now() - m;

  return NextResponse.json({
    timings: t,
    userCount: userIds.length,
    adminEmailSet: Boolean(adminEmail),
    adminEmailMatched: Boolean(byEmail),
    adminUserResolved: Boolean(users.find((u) => u.role === "admin") ?? users[0]),
    rawPingWasNull: rawPing === null,
    findReturnedSomething: Boolean(found),
  });
}
