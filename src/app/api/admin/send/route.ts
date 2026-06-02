import { NextRequest, NextResponse } from "next/server";
import { getDb, Lead } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const db = getDb();
  const lead = db.prepare(`SELECT * FROM leads WHERE id = ?`).get(id) as Lead | undefined;

  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  if (lead.status !== "approved")
    return NextResponse.json({ error: "Lead must be approved before sending" }, { status: 400 });
  if (!lead.website)
    return NextResponse.json({ error: "No email address — send manually" }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Dev mode — just mark as sent
    db.prepare(`UPDATE leads SET status = 'sent', sent_at = datetime('now') WHERE id = ?`).run(id);
    return NextResponse.json({ ok: true, note: "No RESEND_API_KEY — marked sent without sending" });
  }

  // Extract contact email from website domain as best-guess
  // Real usage: you'd have collected the contact email during scraping
  // For now we notify yourself so you can reach out manually
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Duke <contact@copperbaytech.com>",
      to: ["contact@copperbaytech.com"], // sends to you as a draft-review step
      subject: `[OUTREACH READY] ${lead.business_name} — ${lead.email_subject}`,
      text: `Business: ${lead.business_name}\nWebsite: ${lead.website}\nScore: ${lead.score}\n\n---\nSUBJECT: ${lead.email_subject}\n\n${lead.email_body}`,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `Resend error: ${err}` }, { status: 500 });
  }

  db.prepare(`UPDATE leads SET status = 'sent', sent_at = datetime('now') WHERE id = ?`).run(id);
  return NextResponse.json({ ok: true });
}
