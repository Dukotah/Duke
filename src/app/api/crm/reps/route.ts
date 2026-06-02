import { NextResponse } from "next/server";
import { getReps } from "@/lib/crm/store";

// GET /api/crm/reps — roster of callers, used to attribute calls.
export async function GET() {
  return NextResponse.json({ reps: getReps() });
}
