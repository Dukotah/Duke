import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import { getUserById, hashPassword, updateUser } from "@/lib/db";

const MIN_PASSWORD_LENGTH = 8;

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }
    if (!password || typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` }, { status: 400 });
    }

    const redis = getRedis();
    const userId = await redis.get(`reset:${token}`) as string | null;
    if (!userId) {
      return NextResponse.json({ error: "This link has expired or is invalid. Request a new one." }, { status: 400 });
    }

    const user = await getUserById(userId);
    if (!user || !user.active) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const passwordHash = await hashPassword(password);
    await updateUser(userId, { passwordHash });
    await redis.del(`reset:${token}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Reset confirm]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
