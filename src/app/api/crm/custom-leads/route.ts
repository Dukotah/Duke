import { NextRequest, NextResponse } from "next/server";
import { createCustomLead, getCustomLeads } from "@/lib/db";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// GET /api/crm/custom-leads — returns custom leads for current user
export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leads = await getCustomLeads(userId);
  return NextResponse.json(leads);
}

// POST /api/crm/custom-leads — { name, phone, email, website, city, county, niche, notes }
export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, phone = "", email = "", website = "", city = "", county = "", niche = "", notes = "" } = body;

  if (!name?.trim()) return NextResponse.json({ error: "Business name is required" }, { status: 400 });

  const lead = await createCustomLead(userId, { name: name.trim(), phone, email, website, city, county, niche, notes });
  return NextResponse.json(lead, { status: 201 });
}
