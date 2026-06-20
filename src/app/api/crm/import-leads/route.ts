import { NextRequest, NextResponse } from "next/server";
import { createCustomLead, getCustomLeads } from "@/lib/db";
import { handleApiError } from "@/lib/api";
import { parseCSVLine } from "../leads/route";

// Normalise an email address for dedup comparison.
function normEmail(v: string): string {
  return v.trim().toLowerCase();
}

// Normalise a phone number: strip everything except digits, drop a leading "1"
// country code so "(707) 555-0100", "+17075550100", and "7075550100" all match.
function normPhone(v: string): string {
  const digits = v.replace(/\D/g, "");
  return digits.startsWith("1") && digits.length === 11 ? digits.slice(1) : digits;
}

// Parse a CSV string into row objects using the header row as keys.
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]).map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = (cells[idx] ?? "").trim(); });
    rows.push(row);
  }
  return rows;
}

// Resolve a value from a row trying several common column aliases.
function pick(row: Record<string, string>, ...keys: string[]): string {
  for (const k of keys) {
    if (row[k]) return row[k];
  }
  return "";
}

// POST /api/crm/import-leads
// Body: { csv: string }  — raw CSV text (including header row).
// Returns: { imported: number; skipped: number; errors: string[] }
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let body: { csv?: string };
    try {
      body = (await req.json()) as { csv?: string };
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const csvText = (body.csv ?? "").trim();
    if (!csvText) {
      return NextResponse.json({ error: "csv field is required" }, { status: 400 });
    }

    const rows = parseCSV(csvText);
    if (rows.length === 0) {
      return NextResponse.json({ imported: 0, skipped: 0, errors: ["CSV has no data rows"] });
    }

    // Build dedup sets from existing custom leads.
    const existing = await getCustomLeads(userId);
    const existingEmails = new Set(existing.map((l) => normEmail(l.email)).filter(Boolean));
    const existingPhones = new Set(existing.map((l) => normPhone(l.phone)).filter(Boolean));

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // 1-based, +1 for header

      const name = pick(row, "name", "business_name", "business", "company");
      if (!name) {
        errors.push(`Row ${rowNum}: missing business name — skipped`);
        skipped++;
        continue;
      }

      const email = pick(row, "email", "email_address");
      const phone = pick(row, "phone", "phone_fmt", "phone_number", "phone_e164");

      // Dedup: skip if email or phone matches an existing custom lead.
      const emailKey = normEmail(email);
      const phoneKey = normPhone(phone);

      const dupEmail = emailKey && existingEmails.has(emailKey);
      const dupPhone = phoneKey && existingPhones.has(phoneKey);

      if (dupEmail || dupPhone) {
        skipped++;
        continue;
      }

      try {
        await createCustomLead(userId, {
          name,
          contactName: pick(row, "contact_name", "contact", "owner_name", "owner"),
          phone,
          email,
          website: pick(row, "website", "url", "discovered_website"),
          city:    pick(row, "city"),
          county:  pick(row, "county"),
          niche:   pick(row, "niche", "category", "industry"),
          notes:   pick(row, "notes", "pitch", "note"),
        });

        // Add to in-memory dedup sets so later rows in the same import also dedup.
        if (emailKey) existingEmails.add(emailKey);
        if (phoneKey) existingPhones.add(phoneKey);

        imported++;
      } catch (err) {
        errors.push(`Row ${rowNum}: ${err instanceof Error ? err.message : "write failed"}`);
        skipped++;
      }
    }

    return NextResponse.json({ imported, skipped, errors });
  } catch (err) {
    return handleApiError("crm/import-leads POST", err);
  }
}
