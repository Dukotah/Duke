/**
 * Local lead scraper — run this on your OWN machine, not the server.
 *
 * Sources:
 *   - Google Maps
 *   - Yelp
 *   - Yellow Pages
 *   - Better Business Bureau
 *   - OpenStreetMap (Overpass API) — all businesses in Sonoma County with websites
 *   - Santa Rosa Open Data Portal (business licenses)
 *   - Email enrichment — visits each website and extracts contact email
 *
 * Usage:
 *   node scripts/scrape-leads.mjs
 *   node scripts/scrape-leads.mjs --category "restaurants" --city "Petaluma"
 *   node scripts/scrape-leads.mjs --sources osm              ← just OSM bulk pull
 *   node scripts/scrape-leads.mjs --sources osm,santarosa    ← open data sources only
 *   node scripts/scrape-leads.mjs --enrich                   ← enrich existing CSV with emails
 *   node scripts/scrape-leads.mjs --sources all --enrich     ← scrape everything then enrich
 *
 * Output:
 *   scripts/leads-output.csv   — import this into /admin/outreach
 *   scripts/leads-enriched.csv — same data + contact emails (if --enrich used)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.join(__dirname, "leads-output.csv");
const ENRICHED_FILE = path.join(__dirname, "leads-enriched.csv");

// ─── CLI args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const getArg = (name) => { const i = args.indexOf(`--${name}`); return i !== -1 ? args[i + 1] : null; };
const hasFlag = (name) => args.includes(`--${name}`);

const CATEGORY  = getArg("category") ?? "restaurants";
const CITY      = getArg("city") ?? "Petaluma";
const SOURCES   = (getArg("sources") ?? "all").toLowerCase().split(",");
const USE_ALL   = SOURCES.includes("all");
const MAX       = parseInt(getArg("max") ?? "25", 10);
const ENRICH    = hasFlag("enrich");

const use = (s) => USE_ALL || SOURCES.includes(s);

console.log("\n🚀 Copper Bay Tech — Lead Scraper");
console.log("─".repeat(45));
if (!use("osm") && !use("santarosa")) {
  console.log(`   Category : ${CATEGORY}`);
  console.log(`   City     : ${CITY}, CA`);
}
console.log(`   Sources  : ${USE_ALL ? "all" : SOURCES.join(", ")}`);
console.log(`   Enrich   : ${ENRICH ? "yes (find contact emails)" : "no"}`);
console.log("─".repeat(45) + "\n");

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function get(url, headers = {}) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      ...headers,
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function getJson(url, headers = {}) {
  const res = await fetch(url, {
    headers: { "Accept": "application/json", ...headers },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function cleanDomain(url) {
  if (!url) return null;
  try {
    const u = new URL(url.startsWith("http") ? url : "https://" + url);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch { return null; }
}

function normalizeUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return "https://" + url;
}

// ─── Source: OpenStreetMap (Overpass API) ────────────────────────────────────
// Pulls ALL businesses in Sonoma County that have a website tag.
// This is the richest free source — no category filter, covers everything.

async function scrapeOSM() {
  console.log("  🗺️  OpenStreetMap — all Sonoma County businesses with websites...");

  // Bounding box for Sonoma County: south, west, north, east
  const bbox = "38.15,-123.53,38.87,-122.35";

  const query = `
[out:json][timeout:60];
(
  node["name"]["website"](${bbox});
  node["name"]["contact:website"](${bbox});
  way["name"]["website"](${bbox});
  way["name"]["contact:website"](${bbox});
);
out center 500;
  `.trim();

  const url = "https://overpass-api.de/api/interpreter";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
    signal: AbortSignal.timeout(90000),
  });

  if (!res.ok) throw new Error(`Overpass API HTTP ${res.status}`);
  const data = await res.json();

  const results = [];
  for (const el of data.elements ?? []) {
    const t = el.tags ?? {};
    const name = t.name;
    if (!name) continue;
    const website = t.website || t["contact:website"] || null;
    const phone = t.phone || t["contact:phone"] || null;
    const street = [t["addr:housenumber"], t["addr:street"]].filter(Boolean).join(" ");
    const city = t["addr:city"] || "";
    const address = [street, city, "CA"].filter(Boolean).join(", ") || "Sonoma County, CA";

    results.push({ business_name: name, website, phone, address, source: "osm" });
  }

  console.log(`     → ${results.length} businesses with website tags found`);

  // Also query for businesses WITHOUT websites — we'll try to enrich them
  if (results.length < 100) {
    console.log("     → Running secondary query for businesses without website tags...");
    const query2 = `
[out:json][timeout:60];
(
  node["name"]["amenity"](${bbox});
  node["name"]["shop"](${bbox});
);
out center 1000;
    `.trim();

    const res2 = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query2)}`,
      signal: AbortSignal.timeout(90000),
    });

    if (res2.ok) {
      const data2 = await res2.json();
      let noWebCount = 0;
      for (const el of data2.elements ?? []) {
        const t = el.tags ?? {};
        if (!t.name || t.website || t["contact:website"]) continue; // skip if already has website
        const street = [t["addr:housenumber"], t["addr:street"]].filter(Boolean).join(" ");
        const city2 = t["addr:city"] || "";
        results.push({
          business_name: t.name,
          website: null,
          phone: t.phone || t["contact:phone"] || null,
          address: [street, city2, "CA"].filter(Boolean).join(", ") || "Sonoma County, CA",
          source: "osm_no_website",
        });
        noWebCount++;
      }
      console.log(`     → ${noWebCount} additional businesses (no website yet — enrichment can find them)`);
    }
  }

  return results;
}

// ─── Source: Santa Rosa Open Data ────────────────────────────────────────────

async function scrapeSantaRosaOpenData() {
  console.log("  🏛️  Santa Rosa Open Data Portal...");

  // Try the Socrata API — search for business license datasets
  const catalogUrl = "https://opendata.srcity.org/api/catalog/v1?q=business+license&limit=10";

  let datasets = [];
  try {
    const catalog = await getJson(catalogUrl);
    datasets = catalog.results ?? [];
    console.log(`     → Found ${datasets.length} potential datasets in catalog`);
    for (const d of datasets) {
      console.log(`       • ${d.name} (${d.resource?.id ?? "?"})`);
    }
  } catch (err) {
    console.warn(`     ⚠️  Catalog fetch failed: ${err.message}`);
  }

  const results = [];

  // Try known Socrata dataset IDs for Santa Rosa business licenses
  const knownIds = [
    "tguh-kpqn", // common Socrata business license dataset ID pattern
    "9xyq-qnhp",
    "r2bh-kqrr",
  ];

  for (const id of knownIds) {
    try {
      const url = `https://opendata.srcity.org/resource/${id}.json?$limit=1000`;
      const rows = await getJson(url);
      if (Array.isArray(rows) && rows.length > 0) {
        console.log(`     → Dataset ${id}: ${rows.length} records`);
        for (const row of rows) {
          const name = row.business_name || row.dba_name || row.name || row.licensee_name;
          if (!name) continue;
          results.push({
            business_name: name,
            website: row.website || row.url || null,
            phone: row.phone || row.business_phone || null,
            address: [row.address, row.city || "Santa Rosa", "CA"].filter(Boolean).join(", "),
            source: "santa_rosa_opendata",
          });
        }
      }
    } catch {
      // dataset ID doesn't exist, skip silently
    }
  }

  // Also try the HDL business license search (Santa Rosa's public search tool)
  try {
    const hdlUrl = "https://santarosa.hdlgov.com/Business/api/BusinessSearch?searchTerm=&businessType=&status=Active&page=1&pageSize=100";
    const hdlData = await getJson(hdlUrl, { Referer: "https://santarosa.hdlgov.com/Business" });
    const businesses = hdlData.data ?? hdlData.businesses ?? hdlData.results ?? [];
    console.log(`     → HDL portal: ${businesses.length} records`);
    for (const b of businesses) {
      const name = b.businessName || b.dbaName || b.name;
      if (!name) continue;
      results.push({
        business_name: name,
        website: b.website || null,
        phone: b.phone || null,
        address: [b.address, b.city || "Santa Rosa", "CA"].filter(Boolean).join(", "),
        source: "santa_rosa_hdl",
      });
    }
  } catch (err) {
    console.warn(`     ⚠️  HDL portal failed: ${err.message}`);
  }

  console.log(`     → ${results.length} total businesses from Santa Rosa data`);
  return results;
}

// ─── Source: Google Maps ──────────────────────────────────────────────────────

async function scrapeGoogleMaps(category, city) {
  console.log(`  📍 Google Maps — ${category} in ${city}...`);
  const query = encodeURIComponent(`${category} ${city} CA`);
  const html = await get(`https://www.google.com/maps/search/${query}`);
  const results = [];

  const nameMatches = [...html.matchAll(/,"([A-Z][^"]{2,60})",null,null,\d/g)];
  const websiteMatches = [...html.matchAll(/"(https?:\/\/(?!maps\.google|goo\.gl|google\.com|googleapis)[^"]{8,120})"/g)];
  const phoneMatches = [...html.matchAll(/"(\+?1?[-.\s]?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4})"/g)];

  const websites = websiteMatches.map((m) => m[1])
    .filter((w) => !w.includes("google") && !w.includes("gstatic"));

  for (let i = 0; i < Math.min(nameMatches.length, MAX); i++) {
    const name = nameMatches[i]?.[1];
    if (!name || name.length < 3) continue;
    results.push({ business_name: name, website: websites[i] ?? null, phone: phoneMatches[i]?.[1] ?? null, address: `${city}, CA`, source: "google_maps" });
  }

  console.log(`     → ${results.length} found`);
  return results;
}

// ─── Source: Yelp ─────────────────────────────────────────────────────────────

async function scrapeYelp(category, city) {
  console.log(`  ⭐ Yelp — ${category} in ${city}...`);
  const url = `https://www.yelp.com/search?find_desc=${encodeURIComponent(category)}&find_loc=${encodeURIComponent(`${city}, CA`)}`;
  const html = await get(url);
  const results = [];

  const jsonMatch = html.match(/<!--\{"locale"([\s\S]+?)-->/);
  if (jsonMatch) {
    try {
      const json = JSON.parse('{"locale"' + jsonMatch[1]);
      const items = json?.legacyProps?.searchAppProps?.searchPageProps?.mainContentComponentsListProps ?? [];
      for (const item of items) {
        if (results.length >= MAX) break;
        const biz = item?.searchResultBusiness;
        if (!biz?.name) continue;
        results.push({ business_name: biz.name, website: biz.website?.href ?? null, phone: biz.phone ?? null, address: biz.formattedAddress ?? `${city}, CA`, source: "yelp" });
      }
    } catch { /* fall through */ }
  }

  if (results.length === 0) {
    const names = [...html.matchAll(/"bizName"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
    const urls = [...html.matchAll(/"biz_url"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
    for (let i = 0; i < Math.min(names.length, MAX); i++) {
      results.push({ business_name: names[i], website: urls[i] ?? null, phone: null, address: `${city}, CA`, source: "yelp" });
    }
  }

  console.log(`     → ${results.length} found`);
  return results;
}

// ─── Source: Yellow Pages ─────────────────────────────────────────────────────

async function scrapeYellowPages(category, city) {
  console.log(`  📒 Yellow Pages — ${category} in ${city}...`);
  const url = `https://www.yellowpages.com/search?search_terms=${encodeURIComponent(category)}&geo_location_terms=${encodeURIComponent(`${city}, CA`)}`;
  const html = await get(url);
  const results = [];

  const listings = html.match(/<div class="[^"]*result[^"]*"[\s\S]*?<\/article>/g) ?? [];
  for (const listing of listings.slice(0, MAX)) {
    const name = listing.match(/class="[^"]*business-name[^"]*"[^>]*>(?:<[^>]+>)*([^<]+)/)?.[1]?.trim();
    if (!name) continue;
    results.push({
      business_name: name,
      website: listing.match(/class="[^"]*track-visit-website[^"]*"\s+href="([^"]+)"/)?.[1] ?? null,
      phone: listing.match(/class="[^"]*phone[^"]*"[^>]*>([^<]+)/)?.[1]?.trim() ?? null,
      address: [
        listing.match(/class="[^"]*street-address[^"]*"[^>]*>([^<]+)/)?.[1]?.trim(),
        listing.match(/class="[^"]*locality[^"]*"[^>]*>([^<]+)/)?.[1]?.trim(),
      ].filter(Boolean).join(", ") || `${city}, CA`,
      source: "yellowpages",
    });
  }

  // Fallback
  if (results.length === 0) {
    const names = [...html.matchAll(/itemprop="name"[^>]*>([^<]{3,60})</g)].map((m) => m[1].trim());
    const websites = [...html.matchAll(/href="(https?:\/\/(?!www\.yellowpages)[^"]+)"/g)].map((m) => m[1]);
    const phones = [...html.matchAll(/itemprop="telephone"[^>]*>([^<]+)</g)].map((m) => m[1].trim());
    for (let i = 0; i < Math.min(names.length, MAX); i++) {
      results.push({ business_name: names[i], website: websites[i] ?? null, phone: phones[i] ?? null, address: `${city}, CA`, source: "yellowpages" });
    }
  }

  console.log(`     → ${results.length} found`);
  return results;
}

// ─── Source: BBB ──────────────────────────────────────────────────────────────

async function scrapeBBB(category, city) {
  console.log(`  🅱️  BBB — ${category} in ${city}...`);
  const url = `https://www.bbb.org/search?find_country=USA&find_loc=${encodeURIComponent(`${city}, CA`)}&find_text=${encodeURIComponent(category)}&page=1`;
  const html = await get(url);
  const results = [];

  const names = [...html.matchAll(/"name"\s*:\s*"([^"]{3,80})"/g)].map((m) => m[1]);
  const urls = [...html.matchAll(/"url"\s*:\s*"(https?:\/\/(?!www\.bbb\.org)[^"]+)"/g)].map((m) => m[1]);
  const phones = [...html.matchAll(/"telephone"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);

  for (let i = 0; i < Math.min(names.length, MAX); i++) {
    const name = names[i]?.trim();
    if (!name || name.includes("BBB") || name.includes("©")) continue;
    results.push({ business_name: name, website: urls[i] ?? null, phone: phones[i] ?? null, address: `${city}, CA`, source: "bbb" });
  }

  console.log(`     → ${results.length} found`);
  return results;
}

// ─── Enrichment: find contact email from website ──────────────────────────────

async function enrichWithEmails(businesses) {
  console.log(`\n📧 Enriching ${businesses.filter(b => b.website).length} businesses with contact emails...`);
  const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  const skipDomains = ["sentry.io", "wix.com", "squarespace.com", "wordpress.com", "example.com", "yourdomain"];

  const enriched = [];
  let found = 0;

  for (let i = 0; i < businesses.length; i++) {
    const b = businesses[i];
    if (!b.website) {
      enriched.push({ ...b, email: null });
      continue;
    }

    process.stdout.write(`\r     ${i + 1}/${businesses.length} — ${b.business_name.slice(0, 40).padEnd(40)}`);

    try {
      const url = normalizeUrl(b.website);
      const html = await get(url);

      // Check homepage first
      let emails = [...(html.match(emailRegex) ?? [])]
        .filter((e) => !skipDomains.some((d) => e.includes(d)))
        .filter((e) => !e.includes("@2x") && !e.includes(".png") && !e.includes(".jpg"));

      // If no email on homepage, try /contact page
      if (emails.length === 0) {
        try {
          const contactUrl = new URL("/contact", url).href;
          const contactHtml = await get(contactUrl);
          emails = [...(contactHtml.match(emailRegex) ?? [])]
            .filter((e) => !skipDomains.some((d) => e.includes(d)));
        } catch { /* no /contact page */ }
      }

      const email = emails[0] ?? null;
      if (email) found++;
      enriched.push({ ...b, email });
    } catch {
      enriched.push({ ...b, email: null });
    }

    await sleep(800); // be polite
  }

  console.log(`\n     → Found emails for ${found} of ${businesses.filter(b => b.website).length} businesses`);
  return enriched;
}

// ─── CSV helpers ──────────────────────────────────────────────────────────────

function loadExistingKeys() {
  if (!fs.existsSync(OUTPUT_FILE)) return new Set();
  const lines = fs.readFileSync(OUTPUT_FILE, "utf8").split("\n").slice(1).filter(Boolean);
  return new Set(lines.map((l) => {
    const cols = l.split(",");
    const domain = cleanDomain(cols[1]?.replace(/"/g, ""));
    const name = cols[0]?.replace(/"/g, "").toLowerCase().trim();
    return domain || name;
  }).filter(Boolean));
}

function esc(v) { return `"${(v ?? "").toString().replace(/"/g, '""')}"`; }

function writeCSV(file, rows, extraHeaders = []) {
  const headers = ["business_name", "website", "phone", "address", "source", ...extraHeaders];
  const lines = rows.map((r) => [r.business_name, r.website ?? "", r.phone ?? "", r.address ?? "", r.source ?? "", ...extraHeaders.map((h) => r[h] ?? "")].map(esc).join(","));
  fs.writeFileSync(file, headers.join(",") + "\n" + lines.join("\n") + "\n", "utf8");
}

function appendCSV(file, rows, extraHeaders = []) {
  const lines = rows.map((r) => [r.business_name, r.website ?? "", r.phone ?? "", r.address ?? "", r.source ?? "", ...extraHeaders.map((h) => r[h] ?? "")].map(esc).join(","));
  fs.appendFileSync(file, lines.join("\n") + "\n", "utf8");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const existing = loadExistingKeys();
  const allResults = [];

  const run = async (label, fn) => {
    try {
      const results = await fn();
      allResults.push(...results);
      await sleep(2000);
    } catch (err) {
      console.warn(`\n  ⚠️  ${label} failed: ${err.message}`);
    }
  };

  // Bulk sources (no category filter)
  if (use("osm"))        await run("OSM", () => scrapeOSM());
  if (use("santarosa"))  await run("Santa Rosa", () => scrapeSantaRosaOpenData());

  // Category-based sources
  const cities = use("osm") || use("santarosa")
    ? ["Petaluma", "Santa Rosa", "Sebastopol", "Rohnert Park", "Cotati", "Windsor", "Healdsburg", "Sonoma"]
    : [CITY];

  const categories = use("osm") || use("santarosa")
    ? [CATEGORY]
    : [CATEGORY];

  for (const city of cities) {
    for (const category of categories) {
      if (use("google"))      await run("Google Maps",   () => scrapeGoogleMaps(category, city));
      if (use("yelp"))        await run("Yelp",          () => scrapeYelp(category, city));
      if (use("yellowpages")) await run("Yellow Pages",  () => scrapeYellowPages(category, city));
      if (use("bbb"))         await run("BBB",           () => scrapeBBB(category, city));
      if (cities.length > 1) await sleep(1500);
    }
  }

  // Deduplicate
  const seen = new Set(existing);
  const fresh = [];
  for (const b of allResults) {
    const key = cleanDomain(b.website) ?? b.business_name.toLowerCase().trim();
    if (seen.has(key)) continue;
    seen.add(key);
    fresh.push(b);
  }

  if (fresh.length === 0) {
    console.log("\n⚠️  No new businesses found.\n");
    return;
  }

  // Write main CSV
  const isNew = !fs.existsSync(OUTPUT_FILE);
  if (isNew) writeCSV(OUTPUT_FILE, fresh);
  else appendCSV(OUTPUT_FILE, fresh);

  console.log(`\n${"─".repeat(45)}`);
  console.log(`✅ Scraped ${allResults.length} total, ${fresh.length} new businesses`);
  console.log(`   Duplicates skipped: ${allResults.length - fresh.length}`);

  // Source breakdown
  const bySource = {};
  fresh.forEach((b) => { bySource[b.source] = (bySource[b.source] ?? 0) + 1; });
  Object.entries(bySource).forEach(([s, n]) => console.log(`   ${s.padEnd(22)}: ${n}`));

  // Enrichment
  let finalData = fresh;
  if (ENRICH) {
    finalData = await enrichWithEmails(fresh);
    writeCSV(ENRICHED_FILE, finalData, ["email"]);
    const withEmail = finalData.filter((b) => b.email).length;
    console.log(`\n📧 Enriched CSV: ${ENRICHED_FILE}`);
    console.log(`   Businesses with email: ${withEmail}/${fresh.length}`);
  }

  console.log(`\n📄 Output: scripts/leads-output.csv`);
  if (ENRICH) console.log(`📄 Enriched: scripts/leads-enriched.csv`);
  console.log(`\nNext steps:`);
  console.log(`  1. Go to /admin/outreach on your site`);
  console.log(`  2. Drag leads-output.csv onto the drop zone`);
  console.log(`  3. Click "Audit next 5 leads" to start scoring\n`);
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err.message);
  process.exit(1);
});
