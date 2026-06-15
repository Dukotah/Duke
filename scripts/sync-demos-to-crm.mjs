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
 * QUALITY GATE (default): ONLY status:"ready" demos are synced. A needs-review
 * demo NEVER lands in the CRM New tab — the website factory's 95% self-gate holds
 * anything below the AVISP bar as needs-review, and that verdict is honored here
 * so an unreviewed/sub-bar site can't be attached to a lead or emailed. The CRM's
 * own send gate is a second line of defense; this sync simply never imports the
 * needs-review entries in the first place. Pass --include-needs-review to override
 * (e.g. to populate the dashboard for manual review) — off by default.
 *
 * Usage:
 *   node scripts/sync-demos-to-crm.mjs                       # dry-run (ready-only)
 *   node scripts/sync-demos-to-crm.mjs --commit              # write (ready-only)
 *   node scripts/sync-demos-to-crm.mjs --owner you@x         # whose New tab they land in
 *   node scripts/sync-demos-to-crm.mjs --websites <dir>
 *   node scripts/sync-demos-to-crm.mjs --include-needs-review  # ALSO sync needs-review
 *   node scripts/sync-demos-to-crm.mjs --only-ready          # (legacy no-op; ready-only is the default)
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
// READY-ONLY IS THE DEFAULT (the quality gate): needs-review demos are excluded
// from the CRM unless the caller explicitly opts in with --include-needs-review.
// --only-ready is kept as an accepted (now redundant) flag for back-compat.
const INCLUDE_NEEDS_REVIEW = has("--include-needs-review");
const ONLY_READY = !INCLUDE_NEEDS_REVIEW; // default true
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
  // QUALITY GATE: by default keep ONLY status:"ready". normStatus collapses both
  // "needs-review" and "needs_review" spellings, so neither slips through.
  let heldBack = 0;
  if (ONLY_READY) {
    const before = batch.length;
    batch = batch.filter((e) => normStatus(e.status ?? "ready") === "ready");
    heldBack = before - batch.length;
    if (heldBack) console.log(`Quality gate: holding back ${heldBack} needs-review demo(s) — only 'ready' sites sync to the CRM. (--include-needs-review to override.)`);
  }

  // 3) Existing custom leads (dedupe) + existing previews.
  const existingIds = await r.smembers(`custom_leads:${owner.id}`);
  const existing = new Map();
  for (const id of existingIds) { const l = await r.hgetall(`custom_lead:${id}`); if (l?.name) existing.set(previewKey(l.name), { id, ...l }); }

  console.log(`\nBatch: ${batch.length} prospect(s) → ${owner.email}'s New tab (${COMMIT ? "COMMIT" : "dry-run"})\n`);
  let created = 0, linkedLeads = 0, previews = 0;

  for (const e of batch) {
    if (!e.name || !e.link) continue;
    const key = previewKey(e.name);
    // Slug is segment-agnostic: prefer the manifest's `slug`, else take the last
    // path segment of the link (works for /s/<slug>, /p/<slug>, or any scheme).
    const slug = e.slug || e.link.replace(/\/+$/, "").split("/").pop();
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
