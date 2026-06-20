import { NextRequest, NextResponse } from "next/server";
import { parseJsonBody, handleApiError } from "@/lib/api";
import {
  createTag,
  getTags,
  deleteTag,
  addLeadTag,
  removeLeadTag,
  getAllLeadTagMap,
} from "@/lib/crm/tags";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// GET /api/crm/tags — { tags: Tag[], leadTagMap: Record<string, string[]> }
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [tags, leadTagMap] = await Promise.all([
      getTags(userId),
      getAllLeadTagMap(userId),
    ]);
    return NextResponse.json({ tags, leadTagMap });
  } catch (err) {
    return handleApiError("crm/tags GET", err);
  }
}

// POST /api/crm/tags — create a tag def { label, color }
export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await parseJsonBody<{ label?: string; color?: string }>(req);
    if (!parsed.ok) return parsed.response;
    const { label, color } = parsed.data;

    if (!label?.trim()) {
      return NextResponse.json({ error: "label is required" }, { status: 400 });
    }
    if (!color?.trim()) {
      return NextResponse.json({ error: "color is required" }, { status: 400 });
    }

    const tag = await createTag(userId, { label: label.trim(), color: color.trim() });
    return NextResponse.json(tag, { status: 201 });
  } catch (err) {
    return handleApiError("crm/tags POST", err);
  }
}

// DELETE /api/crm/tags?id=<tagId> — remove tag def and scrub from all leads
export async function DELETE(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    await deleteTag(userId, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError("crm/tags DELETE", err);
  }
}

// PATCH /api/crm/tags — add or remove a tag on a lead
// Body: { leadId: string; tagId: string; op: "add" | "remove" }
export async function PATCH(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await parseJsonBody<{
      leadId?: string;
      tagId?: string;
      op?: "add" | "remove";
    }>(req);
    if (!parsed.ok) return parsed.response;
    const { leadId, tagId, op } = parsed.data;

    if (!leadId || !tagId || (op !== "add" && op !== "remove")) {
      return NextResponse.json(
        { error: "leadId, tagId, and op (add|remove) are required" },
        { status: 400 }
      );
    }

    if (op === "add") {
      await addLeadTag(userId, leadId, tagId);
    } else {
      await removeLeadTag(userId, leadId, tagId);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError("crm/tags PATCH", err);
  }
}
