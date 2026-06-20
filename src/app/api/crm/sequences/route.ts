import { NextRequest, NextResponse } from "next/server";
import { parseJsonBody, handleApiError } from "@/lib/api";
import { getSequenceConfig, saveSequenceConfig } from "@/lib/crm/sequenceConfig";
import { SequenceStep } from "@/lib/crm/sequences";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

function getUserRole(req: NextRequest): string | null {
  return req.headers.get("x-user-role");
}

// GET /api/crm/sequences — returns current sequence steps (persisted override or default)
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const steps = await getSequenceConfig();
    return NextResponse.json({ steps });
  } catch (err) {
    return handleApiError("crm/sequences GET", err);
  }
}

// POST /api/crm/sequences — { steps: SequenceStep[] } — admin-only write
export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = getUserRole(req);
    if (role !== "admin") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    const parsed = await parseJsonBody<{ steps?: SequenceStep[] }>(req);
    if (!parsed.ok) return parsed.response;
    const { steps } = parsed.data;

    if (!Array.isArray(steps) || steps.length === 0) {
      return NextResponse.json({ error: "steps must be a non-empty array" }, { status: 400 });
    }

    // Basic shape validation on each step
    for (const s of steps) {
      if (
        typeof s.step !== "number" ||
        typeof s.delayDays !== "number" ||
        typeof s.subject !== "string" ||
        typeof s.body !== "string"
      ) {
        return NextResponse.json(
          { error: "Each step requires: step (number), delayDays (number), subject (string), body (string)" },
          { status: 400 }
        );
      }
    }

    await saveSequenceConfig(steps);
    return NextResponse.json({ ok: true, steps });
  } catch (err) {
    return handleApiError("crm/sequences POST", err);
  }
}
