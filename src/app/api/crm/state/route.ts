import { NextRequest, NextResponse } from "next/server";
import { getAllLeadStates, getLeadState, setLeadState, incrementDailyCalls, addActivity, LeadState } from "@/lib/db";
import { parseJsonBody, handleApiError } from "@/lib/api";
import { runStageAutomations } from "@/lib/crm/automation";

function getUserId(req: NextRequest): string | null {
  return req.headers.get("x-user-id");
}

// GET /api/crm/state — return all lead states for the current user
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const states = await getAllLeadStates(userId);
    return NextResponse.json(states);
  } catch (err) {
    return handleApiError("crm/state GET", err);
  }
}

// POST /api/crm/state — update a single lead's state
export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await parseJsonBody<{ leadId?: string; leadName?: string } & Partial<LeadState>>(req);
    if (!parsed.ok) return parsed.response;
    const { leadId, leadName, ...patch } = parsed.data;
    if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 });

    // Detect a stage transition BEFORE persisting so we can compare old → new.
    // A drag-and-drop move on the Kanban board sends a `stage`; only treat it as
    // a transition when the value actually changes.
    const prev = await getLeadState(userId, leadId);
    const fromStage = prev?.stage;
    const toStage = patch.stage;
    const stageChanged = typeof toStage === "string" && toStage !== fromStage;

    await setLeadState(userId, leadId, patch);

    // If callCount is being incremented, track it for daily goals
    if (patch.callCount !== undefined) {
      await incrementDailyCalls(userId);
    }

    let automation: { rulesFired: number; actionsRun: number } | undefined;
    if (stageChanged) {
      const repName = req.headers.get("x-user-name") ?? "";
      // (a) Timeline entry for the move. The shared ActivityEntry type uses
      // "status_change"; carry the stage transition in outcome/note so the
      // change is auditable without editing the shared db.ts type.
      try {
        await addActivity(leadId, userId, repName, {
          type: "status_change",
          outcome: `stage_change:${fromStage ?? "—"}→${toStage}`,
          note: `Stage moved from ${fromStage ?? "none"} to ${toStage}`,
        });
      } catch (actErr) {
        console.error(`[crm/state] failed to log stage_change for ${leadId}:`, actErr);
      }
      // (b) Fire any matching per-stage automation rules. Self-guarded so a
      // failing rule never breaks the state update.
      try {
        automation = await runStageAutomations(userId, leadId, leadName ?? "", fromStage, toStage);
      } catch (autoErr) {
        console.error(`[crm/state] automation run failed for ${leadId}:`, autoErr);
      }
    }

    return NextResponse.json({ ok: true, ...(automation ? { automation } : {}) });
  } catch (err) {
    return handleApiError("crm/state POST", err);
  }
}
