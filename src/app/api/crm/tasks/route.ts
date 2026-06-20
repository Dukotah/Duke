import { NextRequest, NextResponse } from "next/server";
import { parseJsonBody, handleApiError } from "@/lib/api";
import { createTask, getTasks, updateTask, deleteTask } from "@/lib/crm/tasks";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// GET /api/crm/tasks — list tasks; exclude done unless ?all=1
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const all = req.nextUrl.searchParams.get("all") === "1";
    const tasks = await getTasks(userId);
    return NextResponse.json(all ? tasks : tasks.filter((t) => !t.done));
  } catch (err) {
    return handleApiError("crm/tasks GET", err);
  }
}

// POST /api/crm/tasks — { title, type?, leadId?, leadName?, dueAt? }
export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await parseJsonBody<{
      title?: string;
      type?: "call" | "email" | "todo";
      leadId?: string;
      leadName?: string;
      dueAt?: string;
    }>(req);
    if (!parsed.ok) return parsed.response;

    const { title, type, leadId, leadName, dueAt } = parsed.data;
    if (!title?.trim()) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const task = await createTask(userId, { title, type, leadId, leadName, dueAt });
    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    return handleApiError("crm/tasks POST", err);
  }
}

// PATCH /api/crm/tasks — { id, ...patch } — update done, snoozedUntil, title, etc.
export async function PATCH(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await parseJsonBody<{
      id?: string;
      title?: string;
      type?: "call" | "email" | "todo";
      leadId?: string;
      leadName?: string;
      dueAt?: string;
      snoozedUntil?: string;
      done?: boolean;
    }>(req);
    if (!parsed.ok) return parsed.response;

    const { id, ...patch } = parsed.data;
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    await updateTask(userId, id, patch);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError("crm/tasks PATCH", err);
  }
}

// DELETE /api/crm/tasks?id=<taskId>
export async function DELETE(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    await deleteTask(userId, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError("crm/tasks DELETE", err);
  }
}
