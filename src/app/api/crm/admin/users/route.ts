import { NextRequest, NextResponse } from "next/server";
import { createUser, listUsers, updateUser, deleteUser, hashPassword, getUserById } from "@/lib/db";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-user-role") === "admin";
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const users = await listUsers();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { name, email, password, commissionRate } = await req.json();
  if (!name || !email || !password) return NextResponse.json({ error: "name, email, password required" }, { status: 400 });

  const user = await createUser({
    name, email, passwordHash: await hashPassword(password),
    role: "rep", commissionRate: parseFloat(commissionRate) || 0.1,
    active: true,
  });
  const { passwordHash: _, ...pub } = user;
  void _;
  return NextResponse.json(pub);
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, password, ...patch } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const user = await getUserById(id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const update: Record<string, unknown> = { ...patch };
  if (password) update.passwordHash = await hashPassword(password);
  await updateUser(id, update);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await deleteUser(id);
  return NextResponse.json({ ok: true });
}
