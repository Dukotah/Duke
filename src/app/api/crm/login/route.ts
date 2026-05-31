import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, verifyPassword, ensureAdminExists } from "@/lib/db";
import { signToken } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const secret = process.env.SESSION_SECRET;
    if (!secret) return NextResponse.json({ error: "SESSION_SECRET not configured" }, { status: 500 });

    // Seed admin on first login attempt
    await ensureAdminExists();

    const user = await getUserByEmail(email);
    if (!user || !user.active) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = await signToken({ userId: user.id, role: user.role, name: user.name }, secret);

    const res = NextResponse.json({ ok: true, role: user.role, name: user.name });
    res.cookies.set("crm_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
