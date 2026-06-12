#!/usr/bin/env node
/*
 * sync-demos-to-crm.mjs — one command to land a generated demo batch in the CRM's
 * "New" tab. Generalizes the one-off winery import: for every prospect in the
 * website factory's outreach-links.json it (1) upserts a CUSTOM LEAD (so the lead
 * has a real name + contact, not an orphan link) and (2) attaches the demo PREVIEW
 * (link + thumbnail + status). The New tab (/api/crm/demos) reads custom leads
 * joined with previews, so the batch auto-populates there.
 *
 * Reads the website factory's data (default C:/Users/dukot/projects/Websites):
 *   - data/outreach-links.json   (name, slug, email, link, status, category, area, thumbnailUrl)
 *   - data/research/<slug>.json  (_lead: phone, city, address — fills gaps)
 * Writes to the same Upstash store the CRM uses (creds from Duke/.env.local).
 *
 * Usage:
 *   node scripts/sync-demos-to-crm.mjs                 # dry-run
 *   node scripts/sync-demos-to-crm.mjs --commit        # write
 *   node scripts/sync-demos-to-crm.mjs --owner you@x   # whose New tab they land in
 *   node scripts/sync-demos-to-crm.mjs --websites <dir>
 *   node scripts/sync-demos-to-crm.mjs --only-ready    # skip needs-review demos
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

// --- load Duke/.env.local for Upstash creds ---------------------------------
try {
  for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
    const m = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!(m[1] in process.env)) process.env[m[1]] = v;
  }
} catch { /* env may be set another way */ }

// --- args -------------------------------------------------------------------
const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f, d) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : d; };
const COMMIT = has("--commit");
const ONLY_READY = has("--only-ready");
const OWNER_EMAIL = (val("--owner") || process.env.CRM_IMPORT_OWNER_EMAIL || "dukotah@gmail.com").toLowerCase();
const WEBSITES = val("--websites", process.env.WEBSITES_FACTORY_DIR || "C:/Users/dukot/projects/Websites");
const GALLERY_BASE = (process.env.GALLERY_BASE_URL || "https://demos.copperbaytech.com").replace(/\/+$/, "");

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
if (!url || !token) { console.error("Missing UPSTASH_REDIS_REST_URL/TOKEN (set them in Duke/.env.local)."); process.exit(1); }

const previewKey = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const normStatus = (s) => (s === "needs-review" || s === "needs_review" ? "needs_review" : s === "archived" ? "archived" : "ready");

async function main() {
  const { Redis } = await import("@upstash/redis");
  const r = new Redis({ url, token });

  // 1) Resolve the owner whose New tab these land in.
  const ids = await r.smembers("users:index");
  const users = [];
  for (const id of ids) { const u = await r.hgetall(`user:${id}`); if (u) users.push(u); }
  let owner = users.find((u) => (u.email || "").toLowerCase() === OWNER_EMAIL) || users.find((u) => u.role === "admin") || users[0];
  if (!owner) { console.error("No CRM users found — is this the right store?"); process.exit(1); }
  console.log(`Owner (New tab): ${owner.email} (id ${owner.id})${owner.email?.toLowerCase() === OWNER_EMAIL ? "" : " [fallback — set --owner]"}`);

  // 2) Load the website factory's batch manifest.
  const manifestPath = join(WEBSITES, "data", "outreach-links.json");
  if (!existsSync(manifestPath)) { console.error(`No manifest at ${manifestPath}. Generate sites first.`); process.exit(1); }
  let batch = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (ONLY_READY) batch = batch.filter((e) => (e.status ?? "ready") !== "needs-review");

  // 3) Existing custom leads (dedupe) + existing previews.
  const existingIds = await r.smembers(`custom_leads:${owner.id}`);
  const existing = new Map();
  for (const id of existingIds) { const l = await r.hgetall(`custom_lead:${id}`); if (l?.name) existing.set(previewKey(l.name), { id, ...l }); }

  console.log(`\nBatch: ${batch.length} prospect(s) → ${owner.email}'s New tab (${COMMIT ? "COMMIT" : "dry-run"})\n`);
  let created = 0, linkedLeads = 0, previews = 0;

  for (const e of batch) {
    if (!e.name || !e.link) continue;
    const key = previewKey(e.name);
    const slug = e.slug || e.link.split("/p/").pop();
    // Fill contact gaps from the research file.
    let lead = {};
    try { lead = JSON.parse(readFileSync(join(WEBSITES, "data", "research", `${slug}.json`), "utf8"))._lead || {}; } catch { /* optional */ }
    const phone = lead.phone || "";
    const email = e.email || lead.email || "";
    const city = lead.city || (e.area || "").split(",")[0].trim();
    const thumb = e.thumbnailUrl ? (e.thumbnailUrl.startsWith("http") ? e.thumbnailUrl : `${GALLERY_BASE}${e.thumbnailUrl}`) : "";

    const leadExists = existing.has(key);
    console.log(`  · ${e.name.padEnd(34)} lead:${leadExists ? "exists" : "CREATE"}  demo:LINK  ${e.status === "needs-review" ? "⚠needs-review" : ""}`);

    if (!COMMIT) continue;

    // (1) upsert custom lead
    if (!leadExists) {
      const cl = {
        id: randomUUID(), name: e.name, contactName: "", phone, email,
        website: lead.website || "", city, county: "", niche: e.category || lead.category || "custom",
        notes: `Demo built ${new Date().toISOString().slice(0, 10)}: ${e.link}`,
        addedBy: owner.id, createdAt: new Date().toISOString(),
      };
      await r.hset(`custom_lead:${cl.id}`, cl);
      await r.sadd(`custom_leads:${owner.id}`, cl.id);
      existing.set(key, { id: cl.id, ...cl });
      created++;
    }
    linkedLeads++;

    // (2) attach the demo preview
    const value = {
      previewUrl: e.link, linkedAt: new Date().toISOString(), status: normStatus(e.status ?? "ready"),
      ...(e.category ? { category: e.category } : {}),
      ...(city ? { area: e.area || city } : {}),
      ...(thumb ? { thumbnailUrl: thumb } : {}),
      ...(slug ? { slug } : {}),
    };
    await r.hset("lead_previews", { [key]: JSON.stringify(value) });
    previews++;
  }

  if (!COMMIT) { console.log("\nDry-run. Re-run with --commit to sync."); return; }
  console.log(`\n✓ Synced ${batch.length} demo(s) to ${owner.email}'s New tab — created ${created} lead(s), linked ${previews} preview(s).`);
}

main().catch((e) => { console.error(e?.message || e); process.exit(1); });
