import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { generateOutreachEmail } from "@/lib/emailTemplates";

export async function POST() {
  const db = getDb();

  // Get leads that have a website but haven't been audited yet
  const leads = db
    .prepare(`SELECT * FROM leads WHERE status = 'scraped' AND website IS NOT NULL LIMIT 5`)
    .all() as { id: number; website: string; business_name: string }[];

  if (leads.length === 0) {
    return NextResponse.json({ message: "No leads to audit" });
  }

  const results = [];

  for (const lead of leads) {
    try {
      let url = lead.website.trim();
      if (!url.startsWith("http")) url = "https://" + url;

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const auditData = await res.json();

      if (!res.ok || auditData.error) {
        db.prepare(`UPDATE leads SET status = 'skipped', notes = ? WHERE id = ?`).run(
          auditData.error ?? "Audit failed",
          lead.id
        );
        results.push({ id: lead.id, status: "skipped" });
        continue;
      }

      const score: number = auditData.score ?? 0;

      // Only keep leads with poor scores — these are warm prospects
      if (score >= 70) {
        db.prepare(`UPDATE leads SET status = 'skipped', score = ?, notes = 'Score too high', audited_at = datetime('now') WHERE id = ?`).run(
          score,
          lead.id
        );
        results.push({ id: lead.id, status: "skipped", score, reason: "score too high" });
        continue;
      }

      const { subject, body } = generateOutreachEmail(lead.business_name, url, auditData);

      db.prepare(`
        UPDATE leads
        SET status = 'drafted', score = ?, audit_data = ?, email_subject = ?, email_body = ?, audited_at = datetime('now')
        WHERE id = ?
      `).run(score, JSON.stringify(auditData), subject, body, lead.id);

      results.push({ id: lead.id, status: "drafted", score });
    } catch (err) {
      db.prepare(`UPDATE leads SET status = 'skipped', notes = ? WHERE id = ?`).run(String(err), lead.id);
      results.push({ id: lead.id, status: "error", error: String(err) });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
