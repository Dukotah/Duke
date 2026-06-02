import { NextRequest, NextResponse } from "next/server";
import { getAllTerritories, setTerritory, deleteTerritory } from "@/lib/db";
import { parseJsonBody, handleApiError } from "@/lib/api";

function requireAdmin(req: NextRequest) {
  const role = req.headers.get("x-user-role");
  if (role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const denied = requireAdmin(req);
    if (denied) return denied;
    const territories = await getAllTerritories();
    return NextResponse.json({ territories });
  } catch (err) {
    return handleApiError("crm/admin/territory GET", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const denied = requireAdmin(req);
    if (denied) return denied;
    const parsed = await parseJsonBody<{ userId?: string; counties?: string[]; niches?: string[] }>(req);
    if (!parsed.ok) return parsed.response;
    const { userId, counties, niches } = parsed.data;
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    const territory = await setTerritory(userId, {
      counties: counties ?? [],
      niches: niches ?? [],
    });
    return NextResponse.json({ territory });
  } catch (err) {
    return handleApiError("crm/admin/territory POST", err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const denied = requireAdmin(req);
    if (denied) return denied;
    const parsed = await parseJsonBody<{ userId?: string }>(req);
    if (!parsed.ok) return parsed.response;
    const { userId } = parsed.data;
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    await deleteTerritory(userId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError("crm/admin/territory DELETE", err);
  }
}
