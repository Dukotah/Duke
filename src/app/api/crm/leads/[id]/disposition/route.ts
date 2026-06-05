import { NextRequest, NextResponse } from "next/server";
import { logDisposition } from "@/lib/crm/store";
import { DISPOSITION_LABELS, type Disposition } from "@/lib/crm/types";

// POST /api/crm/leads/:id/disposition — log the outcome of a call. This is the
// core write of the power dialer: it advances the pipeline and records the call.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const disposition = body?.disposition as Disposition;
    if (!disposition || !(disposition in DISPOSITION_LABELS)) {
      return NextResponse.json({ error: "Valid disposition is required" }, { status: 400 });
    }
    const lead = await logDisposition(id, {
      disposition,
      note: typeof body.note === "string" ? body.note : undefined,
      durationSec: typeof body.durationSec === "number" ? body.durationSec : undefined,
      repId: typeof body.repId === "string" ? body.repId : undefined,
      callbackAt: typeof body.callbackAt === "string" ? body.callbackAt : undefined,
    });
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    return NextResponse.json({ lead });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
