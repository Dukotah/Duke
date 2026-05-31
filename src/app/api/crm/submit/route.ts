import { NextRequest, NextResponse } from "next/server";
import { createSubmission, getSubmissionsByUser } from "@/lib/db";

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  const repName = req.headers.get("x-user-name");
  if (!userId || !repName) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { leadId, leadName, leadCity, leadPhone, leadEmail, leadWebsite, leadTier, pitch, repNotes, estimatedBudget } = body;
  if (!leadId || !leadName) return NextResponse.json({ error: "leadId and leadName required" }, { status: 400 });

  // Prevent duplicate submissions
  const existing = await getSubmissionsByUser(userId);
  const dupe = existing.find((s) => s.leadId === leadId && s.status !== "rejected");
  if (dupe) return NextResponse.json({ error: "Already submitted" }, { status: 409 });

  const sub = await createSubmission({
    userId, repName, leadId, leadName, leadCity: leadCity ?? "", leadPhone: leadPhone ?? "",
    leadEmail: leadEmail ?? "", leadWebsite: leadWebsite ?? "", leadTier: leadTier ?? "",
    pitch: pitch ?? "", repNotes: repNotes ?? "", estimatedBudget: estimatedBudget ?? "",
  });

  return NextResponse.json(sub);
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const subs = await getSubmissionsByUser(userId);
  return NextResponse.json(subs);
}
