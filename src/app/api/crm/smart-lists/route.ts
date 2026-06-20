import { NextRequest, NextResponse } from "next/server";
import { createSmartList, getSmartLists, deleteSmartList } from "@/lib/crm/smartlists";
import { parseJsonBody, handleApiError } from "@/lib/api";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// GET /api/crm/smart-lists — returns private + team smart lists for current user
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const lists = await getSmartLists(userId);
    return NextResponse.json(lists);
  } catch (err) {
    return handleApiError("crm/smart-lists GET", err);
  }
}

// POST /api/crm/smart-lists — { name, scope, filters, ownerName? }
export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await parseJsonBody<{
      name?: string;
      scope?: string;
      filters?: Record<string, string>;
      ownerName?: string;
    }>(req);
    if (!parsed.ok) return parsed.response;

    const { name, scope, filters, ownerName } = parsed.data;

    if (!name?.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    if (scope !== "private" && scope !== "team") {
      return NextResponse.json({ error: "scope must be 'private' or 'team'" }, { status: 400 });
    }
    if (!filters || typeof filters !== "object") {
      return NextResponse.json({ error: "filters must be an object" }, { status: 400 });
    }

    const list = await createSmartList(userId, {
      name,
      scope,
      filters,
      ownerName,
    });
    return NextResponse.json(list, { status: 201 });
  } catch (err) {
    return handleApiError("crm/smart-lists POST", err);
  }
}

// DELETE /api/crm/smart-lists — { id }
export async function DELETE(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await parseJsonBody<{ id?: string }>(req);
    if (!parsed.ok) return parsed.response;
    const { id } = parsed.data;

    if (!id?.trim()) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await deleteSmartList(userId, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError("crm/smart-lists DELETE", err);
  }
}
