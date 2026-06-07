import { NextRequest, NextResponse } from "next/server";
import { getLead, updateLead, addNote } from "@/lib/crm/store";
import type { PipelineStage } from "@/lib/crm/types";

// GET /api/crm/leads/:id
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  return NextResponse.json({ lead });
}

// PATCH /api/crm/leads/:id — update stage/owner or append a note
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const patch: { stage?: PipelineStage; ownerRepId?: string; email?: string } = {};
    if (body.stage) patch.stage = body.stage as PipelineStage;
    if (body.ownerRepId) patch.ownerRepId = body.ownerRepId as string;
    if (typeof body.email === "string") patch.email = body.email.trim();

    if (typeof body.note === "string" && body.note.trim()) {
      await addNote(id, body.note.trim(), body.repId);
    }

    const lead = Object.keys(patch).length ? await updateLead(id, patch) : await getLead(id);
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    return NextResponse.json({ lead });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
