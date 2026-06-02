import { NextRequest, NextResponse } from "next/server";
import { createSubmission, getSubmissionsByUser } from "@/lib/db";
import { parseJsonBody, handleApiError } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    const repName = req.headers.get("x-user-name");
    if (!userId || !repName) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await parseJsonBody<Record<string, unknown>>(req);
    if (!parsed.ok) return parsed.response;
    const { leadId, leadName, leadCity, leadPhone, leadEmail, leadWebsite, leadTier, pitch, repNotes, estimatedBudget } = parsed.data;
    if (!leadId || !leadName) return NextResponse.json({ error: "leadId and leadName required" }, { status: 400 });

    // Prevent duplicate submissions
    const existing = await getSubmissionsByUser(userId);
    const dupe = existing.find((s) => s.leadId === leadId && s.status !== "rejected");
    if (dupe) return NextResponse.json({ error: "Already submitted" }, { status: 409 });

    const sub = await createSubmission({
      userId, repName, leadId: String(leadId), leadName: String(leadName),
      leadCity: (leadCity as string) ?? "", leadPhone: (leadPhone as string) ?? "",
      leadEmail: (leadEmail as string) ?? "", leadWebsite: (leadWebsite as string) ?? "", leadTier: (leadTier as string) ?? "",
      pitch: (pitch as string) ?? "", repNotes: (repNotes as string) ?? "", estimatedBudget: (estimatedBudget as string) ?? "",
    });

    return NextResponse.json(sub);
  } catch (err) {
    return handleApiError("crm/submit POST", err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const subs = await getSubmissionsByUser(userId);
    return NextResponse.json(subs);
  } catch (err) {
    return handleApiError("crm/submit GET", err);
  }
}
