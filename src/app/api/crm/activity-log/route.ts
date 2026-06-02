import { NextRequest, NextResponse } from "next/server";
import { getAllLeadStates, getActivity, ActivityEntry } from "@/lib/db";
import { handleApiError } from "@/lib/api";

export interface ActivityLogEntry extends ActivityEntry {
  leadId: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const leadStates = await getAllLeadStates(userId);

    // Filter leads that have been contacted
    const activeLeadIds = Object.entries(leadStates)
      .filter(([, state]) => (state.callCount ?? 0) > 0 || !!state.lastContacted)
      .map(([leadId]) => leadId);

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);

    const allEntries: ActivityLogEntry[] = [];

    await Promise.all(
      activeLeadIds.map(async (leadId) => {
        const entries = await getActivity(leadId);
        for (const entry of entries) {
          if (entry.userId !== userId) continue;
          const entryDate = new Date(entry.createdAt);
          if (entryDate < cutoff) continue;
          allEntries.push({ ...entry, leadId });
        }
      })
    );

    allEntries.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(allEntries.slice(0, 100));
  } catch (err) {
    return handleApiError("crm/activity-log GET", err);
  }
}
