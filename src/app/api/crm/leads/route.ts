import { NextRequest, NextResponse } from "next/server";
import { getLeads, getQueue, createLead } from "@/lib/crm/store";
import { computeHeatScore } from "@/lib/crm/scoring";

// GET /api/crm/leads?view=queue|all
export async function GET(req: NextRequest) {
  const view = req.nextUrl.searchParams.get("view");
  const leads = view === "queue" ? getQueue() : getLeads();
  return NextResponse.json({ leads });
}

// POST /api/crm/leads — add a lead (e.g. from a scrape or the audit tool)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.business || !body?.phone) {
      return NextResponse.json({ error: "business and phone are required" }, { status: 400 });
    }
    const estValue = typeof body.estValue === "number" ? body.estValue : 3000;
    const lead = createLead({
      ...body,
      estValue,
      heatScore: body.signals ? computeHeatScore(body.signals, estValue) : 0,
    });
    return NextResponse.json({ lead }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
