import { NextRequest, NextResponse } from "next/server";
import { getDb, Lead } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const db = getDb();
  const leads = status
    ? db.prepare(`SELECT * FROM leads WHERE status = ? ORDER BY created_at DESC`).all(status)
    : db.prepare(`SELECT * FROM leads ORDER BY created_at DESC`).all();

  return NextResponse.json(leads);
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const allowed = ["status", "email_subject", "email_body", "notes"] as const;
  const db = getDb();

  for (const key of allowed) {
    if (key in updates) {
      db.prepare(`UPDATE leads SET ${key} = ? WHERE id = ?`).run(updates[key], id);
    }
  }

  const updated = db.prepare(`SELECT * FROM leads WHERE id = ?`).get(id) as Lead;
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  getDb().prepare(`DELETE FROM leads WHERE id = ?`).run(id);
  return NextResponse.json({ ok: true });
}
