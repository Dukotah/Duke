import { NextRequest, NextResponse } from "next/server";
import { createUser, listUsers, updateUser, deleteUser, hashPassword, getUserById } from "@/lib/db";
import { parseJsonBody, handleApiError } from "@/lib/api";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-user-role") === "admin";
}

export async function GET(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const users = await listUsers();
    return NextResponse.json(users);
  } catch (err) {
    return handleApiError("crm/admin/users GET", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const parsed = await parseJsonBody<{ name?: string; email?: string; password?: string; commissionRate?: string | number; emailMode?: "full" | "restricted" | "off" }>(req);
    if (!parsed.ok) return parsed.response;
    const { name, email, password, commissionRate, emailMode } = parsed.data;
    if (!name || !email || !password) return NextResponse.json({ error: "name, email, password required" }, { status: 400 });

    const user = await createUser({
      name, email, passwordHash: await hashPassword(password),
      role: "rep", commissionRate: parseFloat(String(commissionRate)) || 0.1,
      active: true,
      emailMode: emailMode === "full" || emailMode === "off" ? emailMode : "restricted",
    });
    const { passwordHash: _, ...pub } = user;
    void _;
    return NextResponse.json(pub);
  } catch (err) {
    return handleApiError("crm/admin/users POST", err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const parsed = await parseJsonBody<{ id?: string; password?: string } & Record<string, unknown>>(req);
    if (!parsed.ok) return parsed.response;
    const { id, password, ...patch } = parsed.data;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const user = await getUserById(id);
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Allowlist patchable fields (no blind mass-assignment of raw user fields like
    // passwordHash/role/id) and validate enums.
    const ALLOWED = new Set(["name", "email", "commissionRate", "active", "emailMode"]);
    const update: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(patch)) {
      if (!ALLOWED.has(k)) continue;
      if (k === "emailMode" && !["full", "restricted", "off"].includes(String(v))) continue;
      update[k] = v;
    }
    if (password) update.passwordHash = await hashPassword(password);
    await updateUser(id, update);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError("crm/admin/users PATCH", err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const parsed = await parseJsonBody<{ id?: string }>(req);
    if (!parsed.ok) return parsed.response;
    const { id } = parsed.data;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await deleteUser(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError("crm/admin/users DELETE", err);
  }
}
