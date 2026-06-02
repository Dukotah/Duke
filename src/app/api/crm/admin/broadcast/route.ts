import { NextRequest, NextResponse } from "next/server";
import { createBroadcast, getActiveBroadcasts, deleteBroadcast, Broadcast } from "@/lib/db";
import { parseJsonBody, handleApiError } from "@/lib/api";

function isAdmin(req: NextRequest) {
  return req.headers.get("x-user-role") === "admin";
}

function isAuthenticated(req: NextRequest) {
  return !!req.headers.get("x-user-id");
}

export async function GET(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const broadcasts = await getActiveBroadcasts();
    return NextResponse.json({ broadcasts });
  } catch (err) {
    return handleApiError("crm/admin/broadcast GET", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const parsed = await parseJsonBody<{ message?: string; type?: Broadcast["type"]; expiresInDays?: number }>(req);
    if (!parsed.ok) return parsed.response;
    const { message, type, expiresInDays } = parsed.data;
    if (!message || !type) return NextResponse.json({ error: "message and type required" }, { status: 400 });
    const createdBy = req.headers.get("x-user-name") ?? "Admin";
    const broadcast = await createBroadcast(message, type, expiresInDays ?? 3, createdBy);
    return NextResponse.json(broadcast);
  } catch (err) {
    return handleApiError("crm/admin/broadcast POST", err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const parsed = await parseJsonBody<{ id?: string }>(req);
    if (!parsed.ok) return parsed.response;
    const { id } = parsed.data;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await deleteBroadcast(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError("crm/admin/broadcast DELETE", err);
  }
}
