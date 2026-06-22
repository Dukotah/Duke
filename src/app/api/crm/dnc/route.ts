import { NextRequest, NextResponse } from "next/server";
import { getDoNotCallPhones, addDoNotCall, removeDoNotCall } from "@/lib/db";
import { parseJsonBody, handleApiError } from "@/lib/api";

// GET /api/crm/dnc — the do-not-call list (normalized digits-only phones).
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const phones = await getDoNotCallPhones();
    return NextResponse.json({ phones, count: phones.length });
  } catch (err) {
    return handleApiError("crm/dnc GET", err);
  }
}

// POST /api/crm/dnc — { phone, action: 'add'|'remove' }.
//   add    — any signed-in rep can mark a business do-not-call.
//   remove — admin only (re-allow a number).
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const userName = req.headers.get("x-user-name") ?? "Unknown";
    const isAdmin = req.headers.get("x-user-role") === "admin";
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await parseJsonBody<{ phone?: string; action?: "add" | "remove" }>(req);
    if (!parsed.ok) return parsed.response;
    const { phone, action } = parsed.data;
    if (!phone || !action) {
      return NextResponse.json({ error: "phone and action required" }, { status: 400 });
    }

    if (action === "add") {
      await addDoNotCall(phone, userName);
      return NextResponse.json({ ok: true });
    }

    if (action === "remove") {
      if (!isAdmin) {
        return NextResponse.json({ error: "Only an admin can remove a number" }, { status: 403 });
      }
      await removeDoNotCall(phone);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return handleApiError("crm/dnc POST", err);
  }
}
