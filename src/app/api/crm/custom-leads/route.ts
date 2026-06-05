import { NextRequest, NextResponse } from "next/server";
import { createCustomLead, getCustomLeads } from "@/lib/db";
import { parseJsonBody, handleApiError } from "@/lib/api";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// GET /api/crm/custom-leads — returns custom leads for current user
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const leads = await getCustomLeads(userId);
    return NextResponse.json(leads);
  } catch (err) {
    return handleApiError("crm/custom-leads GET", err);
  }
}

// POST /api/crm/custom-leads — { name, phone, email, website, city, county, niche, notes }
export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await parseJsonBody<{
      name?: string; contactName?: string; phone?: string; email?: string; website?: string;
      city?: string; county?: string; niche?: string; notes?: string;
    }>(req);
    if (!parsed.ok) return parsed.response;
    const { name, contactName = "", phone = "", email = "", website = "", city = "", county = "", niche = "", notes = "" } = parsed.data;

    if (!name?.trim()) return NextResponse.json({ error: "Business name is required" }, { status: 400 });

    const lead = await createCustomLead(userId, { name: name.trim(), contactName: contactName.trim(), phone, email, website, city, county, niche, notes });
    return NextResponse.json(lead, { status: 201 });
  } catch (err) {
    return handleApiError("crm/custom-leads POST", err);
  }
}
