import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, verifyPassword, ensureAdminExists } from "@/lib/db";
import { signToken, getSessionSecret } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const secret = getSessionSecret();

    // ── Quick-access mode (no password) — DEVELOPMENT ONLY ───────────────────
    // This mints an admin/rep session without credentials. It's a local dev
    // convenience and MUST never be reachable in production (it would be a full
    // auth bypass for the CRM).
    if (body.role && !body.email) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Not available" }, { status: 403 });
      }
      const role = body.role as "admin" | "rep";
      const token = await signToken(
        { userId: role === "admin" ? "admin-dev" : "rep-dev", role, name: role === "admin" ? "Duke" : "Rep" },
        secret
      );
      const res = NextResponse.json({ ok: true, role });
      // This branch only runs outside production (guarded above), so the cookie
      // is never sent over plain HTTP in prod anyway — secure:false is fine for
      // local dev over http://localhost.
      res.cookies.set("crm_session", token, {
        httpOnly: true, sameSite: "lax",
        secure: false,
        maxAge: 60 * 60 * 24 * 30, path: "/",
      });
      return res;
    }

    // ── Full login (email + password) ────────────────────────────────────────
    const { email, password } = body;
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    if (!process.env.SESSION_SECRET) return NextResponse.json({ error: "SESSION_SECRET not configured" }, { status: 500 });

    await ensureAdminExists();

    const user = await getUserByEmail(email);
    if (!user || !user.active) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = await signToken({ userId: user.id, role: user.role, name: user.name }, secret);
    const res = NextResponse.json({ ok: true, role: user.role, name: user.name });
    res.cookies.set("crm_session", token, {
      httpOnly: true, sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, path: "/",
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
