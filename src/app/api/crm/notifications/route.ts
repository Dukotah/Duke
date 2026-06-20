import { NextRequest, NextResponse } from "next/server";
import { getNotifications, markNotificationRead } from "@/lib/crm/notifications";
import { parseJsonBody, handleApiError } from "@/lib/api";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// GET /api/crm/notifications — returns all notifications for the current user
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const notifications = await getNotifications(userId);
    return NextResponse.json(notifications);
  } catch (err) {
    return handleApiError("crm/notifications GET", err);
  }
}

// PATCH /api/crm/notifications — mark one or all notifications read
// Body: { id: string }  — pass "__all__" to mark all read
export async function PATCH(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await parseJsonBody<{ id?: string }>(req);
    if (!parsed.ok) return parsed.response;
    const { id } = parsed.data;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await markNotificationRead(userId, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError("crm/notifications PATCH", err);
  }
}
