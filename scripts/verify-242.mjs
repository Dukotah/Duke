// Standalone verification of the local grade-A CSV through Duke's REAL parser
// logic (copied verbatim from src/app/api/crm/leads/route.ts) so we can confirm
// the data layer is correct without needing Redis / a full Next boot.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV = path.join(__dirname, "..", "public", "grade_a_242.csv");

function parseCSVLine(line) {
  const result = []; let current = ""; let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { if (inQuotes && line[i + 1] === '"') { current += '"'; i++; } else inQuotes = !inQuotes; }
    else if (ch === "," && !inQuotes) { result.push(current); current = ""; }
    else current += ch;
  }
  result.push(current); return result;
}

const text = fs.readFileSync(CSV, "utf8");
const lines = text.split("\n").filter(Boolean);
const rawHeaders = parseCSVLine(lines[0]);
const norm = (h) => h.trim().toLowerCase().replace(/\s+/g, "_");
const isCanonical = (raw) => /^[a-z0-9_]+$/.test(raw.trim());
const headerIndex = {};
rawHeaders.forEach((raw, i) => {
  const key = norm(raw);
  if (!(key in headerIndex) || (isCanonical(raw) && !isCanonical(rawHeaders[headerIndex[key]]))) headerIndex[key] = i;
});
const col = (row, key) => { const idx = headerIndex[key] ?? -1; return idx >= 0 ? (row[idx] ?? "").trim() : ""; };

const leads = [];
for (let i = 1; i < lines.length; i++) {
  const row = parseCSVLine(lines[i]);
  const name = col(row, "name") || col(row, "business") || col(row, "business_name");
  if (!name) continue;
  const leadScore = parseFloat(col(row, "lead_score"));
  leads.push({
    name,
    grade: col(row, "lead_grade"),
    score: Number.isFinite(leadScore) ? leadScore : undefined,
    email: col(row, "email"),
    email_status: col(row, "email_status"),
    phone: col(row, "phone_e164") || col(row, "phone"),
    site_quality: col(row, "site_quality"),
    reach_channel: col(row, "reach_channel"),
    fingerprint: col(row, "fingerprint"),
    recommended_action: col(row, "recommended_action"),
  });
}

const by = (f) => leads.reduce((m, l) => ((m[f(l) || "—"] = (m[f(l) || "—"] || 0) + 1), m), {});
console.log(`parsed leads:        ${leads.length}`);
console.log(`grades:              ${JSON.stringify(by((l) => l.grade))}`);
console.log(`missing fingerprint: ${leads.filter((l) => !l.fingerprint).length}`);
console.log(`missing score:       ${leads.filter((l) => l.score === undefined).length}`);
console.log(`with email:          ${leads.filter((l) => l.email).length}`);
console.log(`email_status valid:  ${leads.filter((l) => l.email_status === "valid").length}`);
console.log(`site_quality:        ${JSON.stringify(by((l) => l.site_quality))}`);
console.log(`reach_channel:       ${JSON.stringify(by((l) => l.reach_channel))}`);
console.log(`\nsample (top 3 by score):`);
[...leads].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 3)
  .forEach((l) => console.log(`  ${l.score}  ${l.grade}  ${l.name}  <${l.email || "no-email"}>  ${l.phone}  [${l.recommended_action}]`));
