import { NextRequest, NextResponse } from "next/server";
import { getAllTerritories, setTerritory, deleteTerritory } from "@/lib/db";

function requireAdmin(req: NextRequest) {
  const role = req.headers.get("x-user-role");
  if (role !== "admin") return NextResponse.json({ error: "Admin only" }, { status: 403 });
  return null;
}

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const territories = await getAllTerritories();
  return NextResponse.json({ territories });
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const body = await req.json();
  const { userId, counties, niches } = body as { userId: string; counties: string[]; niches: string[] };
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const territory = await setTerritory(userId, {
    counties: counties ?? [],
    niches: niches ?? [],
  });
  return NextResponse.json({ territory });
}

export async function DELETE(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const body = await req.json();
  const { userId } = body as { userId: string };
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  await deleteTerritory(userId);
  return NextResponse.json({ ok: true });
}
