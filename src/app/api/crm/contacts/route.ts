import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/crm/store";
import { isAuthorized } from "@/lib/crm/auth";

export const runtime = "nodejs";

// GET /api/crm/contacts — list every contact (admin only).
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const contacts = await getStore().listContacts();
  return NextResponse.json({ contacts });
}

// POST /api/crm/contacts — manually create / upsert a contact (admin only).
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { name, email } = body;
    if (!name || !email) {
      return NextResponse.json(
        { error: "name and email are required" },
        { status: 400 },
      );
    }
    const contact = await getStore().upsertContact({
      name,
      email,
      business: body.business,
      phone: body.phone,
      service: body.service,
      source: body.source ?? "manual",
      tags: body.tags,
      notes: body.notes,
    });
    return NextResponse.json({ contact });
  } catch (err) {
    console.error("CRM contacts POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
