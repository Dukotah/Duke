#!/usr/bin/env node
/*
 * clear-demos.mjs — empty the CRM "New" tab / demos board for a fresh start.
 * Deletes the owner's custom leads + the lead_previews hash (the demo cards).
 * DRY-RUN by default; pass --commit to actually delete. Reads Upstash creds from
 * Duke/.env.local (same loader as sync-demos-to-crm.mjs).
 *
 *   node scripts/clear-demos.mjs            # dry-run: show what WOULD be deleted
 *   node scripts/clear-demos.mjs --commit   # actually delete
 *   node scripts/clear-demos.mjs --owner you@x
 */
import { readFileSync } from "node:fs";

try {
  for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
    const m = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!(m[1] in process.env)) process.env[m[1]] = v;
  }
} catch { /* env may be set another way */ }

const argv = process.argv.slice(2);
const COMMIT = argv.includes("--commit");
const OWNER_EMAIL = ((argv.indexOf("--owner") >= 0 ? argv[argv.indexOf("--owner") + 1] : null) || process.env.CRM_IMPORT_OWNER_EMAIL || "dukotah@gmail.com").toLowerCase();

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
if (!url || !token) { console.error("Missing UPSTASH_REDIS_REST_URL/TOKEN (set them in Duke/.env.local)."); process.exit(1); }

async function main() {
  const { Redis } = await import("@upstash/redis");
  const r = new Redis({ url, token });

  const ids = await r.smembers("users:index");
  const users = [];
  for (const id of ids) { const u = await r.hgetall(`user:${id}`); if (u) users.push(u); }
  const owner = users.find((u) => (u.email || "").toLowerCase() === OWNER_EMAIL) || users.find((u) => u.role === "admin") || users[0];
  if (!owner) { console.error("No CRM users found — is this the right store?"); process.exit(1); }
  console.log(`Owner: ${owner.email} (id ${owner.id})  [${COMMIT ? "COMMIT" : "DRY-RUN"}]`);

  // Custom leads for this owner.
  const leadIds = await r.smembers(`custom_leads:${owner.id}`);
  let demoCount = 0;
  const sample = [];
  for (const id of leadIds) {
    const l = await r.hgetall(`custom_lead:${id}`);
    if (!l) continue;
    if (/^Demo built/i.test(l.notes || "")) demoCount++;
    if (sample.length < 12) sample.push(`${l.name}${/^Demo built/i.test(l.notes || "") ? " (demo)" : ""}`);
  }
  // Demo previews.
  const previews = await r.hgetall("lead_previews");
  const previewKeys = previews ? Object.keys(previews) : [];

  console.log(`\nCustom leads: ${leadIds.length}  (of which ${demoCount} tagged "Demo built")`);
  console.log(`Demo previews (lead_previews): ${previewKeys.length}`);
  console.log(`Sample leads: ${sample.join(", ") || "(none)"}`);

  if (!COMMIT) {
    console.log(`\nDRY-RUN — nothing deleted. Re-run with --commit to delete all ${leadIds.length} custom lead(s) + the previews hash.`);
    return;
  }

  let del = 0;
  for (const id of leadIds) { await r.del(`custom_lead:${id}`); del++; }
  if (leadIds.length) await r.del(`custom_leads:${owner.id}`);
  if (previewKeys.length) await r.del("lead_previews");
  console.log(`\n✓ Deleted ${del} custom lead(s), the custom_leads:${owner.id} set, and the lead_previews hash. The New tab is now empty.`);
}

main().catch((e) => { console.error(e?.message || e); process.exit(1); });
