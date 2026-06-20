import { NextRequest, NextResponse } from "next/server";
import { handleApiError, requireAdmin } from "@/lib/api";
import { listUsers, getAllLeadStates, listSubmissions } from "@/lib/db";

// GET /api/crm/admin/funnel
// Aggregates pipeline funnel counts across all reps.
// Stages: leads → contacted → replied → demo/interested → submitted → won

export async function GET(req: NextRequest) {
  // Admin-only: /api/crm/admin/* is NOT role-gated by middleware, so enforce here.
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    const [users, allSubs] = await Promise.all([listUsers(), listSubmissions()]);

    const reps = users.filter((u) => u.role === "rep");

    // Accumulate per-stage counts across all reps
    let leads = 0;
    let contacted = 0;
    let replied = 0;
    let interested = 0;
    let submitted = 0;
    let won = 0;

    await Promise.all(
      reps.map(async (rep) => {
        const states = await getAllLeadStates(rep.id);
        const entries = Object.values(states);
        leads += entries.length;

        for (const s of entries) {
          const status = s.status ?? "";
          const stage = s.stage ?? "";
          const outcome = s.lastOutcome ?? "";

          // contacted: status=contacted or stage=contacted
          if (status === "contacted" || stage === "contacted") contacted++;

          // replied: lastOutcome includes "replied" or "reply"
          if (outcome === "replied" || outcome === "reply") replied++;

          // interested: status=follow_up, stage=interested, or outcome=interested
          if (
            stage === "interested" ||
            outcome === "interested" ||
            status === "follow_up"
          )
            interested++;

          // won: status=won
          if (status === "won") won++;
        }
      })
    );

    // submitted = total submissions (across all reps, de-duped by submission count)
    submitted = allSubs.length;

    // won = accepted submissions (overrides the lead-state count for accuracy)
    const wonFromSubs = allSubs.filter((s) => s.status === "accepted").length;
    won = Math.max(won, wonFromSubs);

    // Build ordered stage array with conversion percentages
    const stages = [
      { key: "leads", label: "Total Leads", count: leads },
      { key: "contacted", label: "Contacted", count: contacted },
      { key: "replied", label: "Replied / Engaged", count: replied },
      { key: "interested", label: "Interested / Follow-up", count: interested },
      { key: "submitted", label: "Submitted", count: submitted },
      { key: "won", label: "Won", count: won },
    ].map((stage, i, arr) => {
      const prev = i === 0 ? stage.count : arr[i - 1].count;
      const convPct =
        prev > 0 ? Math.round((stage.count / prev) * 100) : 0;
      const overallPct =
        leads > 0 ? Math.round((stage.count / leads) * 100) : 0;
      return { ...stage, convPct, overallPct };
    });

    return NextResponse.json({ stages, repCount: reps.length });
  } catch (err) {
    return handleApiError("crm/admin/funnel GET", err);
  }
}
