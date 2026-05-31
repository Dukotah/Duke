import { NextRequest, NextResponse } from "next/server";
import { createBroadcast, getActiveBroadcasts, deleteBroadcast } from "@/lib/db";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-user-role") === "admin";
}

function isAuthenticated(req: NextRequest) {
  return !!req.headers.get("x-user-id");
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const broadcasts = await getActiveBroadcasts();
  return NextResponse.json({ broadcasts });
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { message, type, expiresInDays } = await req.json();
  if (!message || !type) return NextResponse.json({ error: "message and type required" }, { status: 400 });
  const createdBy = req.headers.get("x-user-name") ?? "Admin";
  const broadcast = await createBroadcast(message, type, expiresInDays ?? 3, createdBy);
  return NextResponse.json(broadcast);
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await deleteBroadcast(id);
  return NextResponse.json({ ok: true });
}
