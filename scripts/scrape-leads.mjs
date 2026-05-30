/**
 * Local lead scraper — run this on your own machine, not the server.
 *
 * Usage:
 *   node scripts/scrape-leads.mjs --category "restaurants" --city "Petaluma" --sources all
 *   node scripts/scrape-leads.mjs --category "contractors" --city "Santa Rosa" --sources yelp,yellowpages
 *
 * Output: scripts/leads-output.csv  (append to existing file, deduped by website)
 *
 * Then go to /admin/outreach → "paste a list manually" → paste the CSV contents
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.join(__dirname, "leads-output.csv");

// ─── CLI args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
function getArg(name) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : null;
}

const CATEGORY = getArg("category") ?? "restaurants";
const CITY = getArg("city") ?? "Petaluma";
const SOURCES = (getArg("sources") ?? "all").toLowerCase().split(",");
const USE_ALL = SOURCES.includes("all");
const MAX_PER_SOURCE = parseInt(getArg("max") ?? "25", 10);

console.log(`\n🔍 Scraping: "${CATEGORY}" in ${CITY}, CA`);
console.log(`   Sources: ${USE_ALL ? "all" : SOURCES.join(", ")}`);
console.log(`   Max per source: ${MAX_PER_SOURCE}\n`);

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function fetchHtml(url, extraHeaders = {}) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      "Cache-Control": "no-cache",
      ...extraHeaders,
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res.text();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function cleanUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url.startsWith("http") ? url : "https://" + url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

// ─── Sources ─────────────────────────────────────────────────────────────────

async function scrapeGoogleMaps(category, city) {
  console.log("  📍 Google Maps...");
  const query = encodeURIComponent(`${category} ${city} CA`);
  const url = `https://www.google.com/maps/search/${query}`;

  const html = await fetchHtml(url);
  const results = [];

  // Google Maps embeds data as JS — extract name/website pairs
  const nameMatches = [...html.matchAll(/,"([A-Z][^"]{2,60})",null,null,\d/g)];
  const websiteMatches = [...html.matchAll(/"(https?:\/\/(?!maps\.google|goo\.gl|google\.com)[^"]{5,100})"/g)];
  const phoneMatches = [...html.matchAll(/"\+?1?[-.\s]?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}"/g)];

  const websites = websiteMatches
    .map((m) => m[1])
    .filter((w) => !w.includes("google") && !w.includes("gstatic") && !w.includes("googleapis"));

  for (let i = 0; i < Math.min(nameMatches.length, MAX_PER_SOURCE); i++) {
    const name = nameMatches[i]?.[1];
    if (!name || name.length < 3) continue;
    results.push({
      business_name: name,
      website: websites[i] ?? null,
      phone: phoneMatches[i]?.[0]?.replace(/"/g, "") ?? null,
      address: `${city}, CA`,
      source: "google_maps",
    });
  }

  console.log(`     → ${results.length} businesses found`);
  return results;
}

async function scrapeYelp(category, city) {
  console.log("  ⭐ Yelp...");
  const loc = encodeURIComponent(`${city}, CA`);
  const term = encodeURIComponent(category);
  const url = `https://www.yelp.com/search?find_desc=${term}&find_loc=${loc}`;

  const html = await fetchHtml(url);
  const results = [];

  // Try Yelp's embedded JSON
  const jsonMatch = html.match(/<!--\{"locale"([\s\S]+?)-->/);
  if (jsonMatch) {
    try {
      const raw = '{"locale"' + jsonMatch[1];
      const json = JSON.parse(raw);
      const items =
        json?.legacyProps?.searchAppProps?.searchPageProps?.mainContentComponentsListProps ?? [];

      for (const item of items) {
        if (results.length >= MAX_PER_SOURCE) break;
        const biz = item?.searchResultBusiness;
        if (!biz?.name) continue;
        results.push({
          business_name: biz.name,
          website: biz.website?.href ?? null,
          phone: biz.phone ?? null,
          address: biz.formattedAddress ?? `${city}, CA`,
          source: "yelp",
        });
      }
    } catch {
      // fall through
    }
  }

  // Fallback: regex parse
  if (results.length === 0) {
    const bizNames = [...html.matchAll(/"bizName"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
    const bizUrls = [...html.matchAll(/"biz_url"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
    for (let i = 0; i < Math.min(bizNames.length, MAX_PER_SOURCE); i++) {
      results.push({
        business_name: bizNames[i],
        website: bizUrls[i] ?? null,
        phone: null,
        address: `${city}, CA`,
        source: "yelp",
      });
    }
  }

  console.log(`     → ${results.length} businesses found`);
  return results;
}

async function scrapeYellowPages(category, city) {
  console.log("  📒 Yellow Pages...");
  const term = encodeURIComponent(category);
  const loc = encodeURIComponent(`${city}, CA`);
  const url = `https://www.yellowpages.com/search?search_terms=${term}&geo_location_terms=${loc}`;

  const html = await fetchHtml(url);
  const results = [];

  // Yellow Pages has clean semantic HTML
  const listingRegex = /<div class="[^"]*result[^"]*"[\s\S]*?<\/article>/g;
  const listings = html.match(listingRegex) ?? [];

  for (const listing of listings.slice(0, MAX_PER_SOURCE)) {
    const nameMatch = listing.match(/class="[^"]*business-name[^"]*"[^>]*>(?:<[^>]+>)*([^<]+)/);
    const websiteMatch = listing.match(/class="[^"]*track-visit-website[^"]*"\s+href="([^"]+)"/);
    const phoneMatch = listing.match(/class="[^"]*phone[^"]*"[^>]*>([^<]+)/);
    const addressMatch = listing.match(/class="[^"]*street-address[^"]*"[^>]*>([^<]+)/);
    const cityMatch = listing.match(/class="[^"]*locality[^"]*"[^>]*>([^<]+)/);

    const name = nameMatch?.[1]?.trim();
    if (!name) continue;

    results.push({
      business_name: name,
      website: websiteMatch?.[1] ?? null,
      phone: phoneMatch?.[1]?.trim() ?? null,
      address: [addressMatch?.[1]?.trim(), cityMatch?.[1]?.trim()].filter(Boolean).join(", ") || `${city}, CA`,
      source: "yellowpages",
    });
  }

  // Fallback if regex didn't match structure
  if (results.length === 0) {
    const names = [...html.matchAll(/itemprop="name"[^>]*>([^<]{3,60})</g)].map((m) => m[1].trim());
    const websites = [...html.matchAll(/href="(https?:\/\/(?!www\.yellowpages)[^"]+)"/g)].map((m) => m[1]);
    const phones = [...html.matchAll(/itemprop="telephone"[^>]*>([^<]+)</g)].map((m) => m[1].trim());

    for (let i = 0; i < Math.min(names.length, MAX_PER_SOURCE); i++) {
      results.push({
        business_name: names[i],
        website: websites[i] ?? null,
        phone: phones[i] ?? null,
        address: `${city}, CA`,
        source: "yellowpages",
      });
    }
  }

  console.log(`     → ${results.length} businesses found`);
  return results;
}

async function scrapeBBB(category, city) {
  console.log("  🅱  Better Business Bureau...");
  const term = encodeURIComponent(category);
  const loc = encodeURIComponent(`${city}, CA`);
  const url = `https://www.bbb.org/search?find_country=USA&find_loc=${loc}&find_text=${term}&page=1`;

  const html = await fetchHtml(url);
  const results = [];

  const nameMatches = [...html.matchAll(/"name"\s*:\s*"([^"]{3,80})"/g)];
  const urlMatches = [...html.matchAll(/"url"\s*:\s*"(https?:\/\/(?!www\.bbb\.org)[^"]+)"/g)];
  const phoneMatches = [...html.matchAll(/"telephone"\s*:\s*"([^"]+)"/g)];

  for (let i = 0; i < Math.min(nameMatches.length, MAX_PER_SOURCE); i++) {
    const name = nameMatches[i]?.[1]?.trim();
    if (!name || name.includes("BBB") || name.includes("©")) continue;
    results.push({
      business_name: name,
      website: urlMatches[i]?.[1] ?? null,
      phone: phoneMatches[i]?.[1] ?? null,
      address: `${city}, CA`,
      source: "bbb",
    });
  }

  console.log(`     → ${results.length} businesses found`);
  return results;
}

// ─── Dedup & CSV ─────────────────────────────────────────────────────────────

function loadExistingWebsites() {
  if (!fs.existsSync(OUTPUT_FILE)) return new Set();
  const lines = fs.readFileSync(OUTPUT_FILE, "utf8").split("\n").slice(1); // skip header
  return new Set(
    lines
      .map((l) => l.split(",")[1]?.trim())
      .filter(Boolean)
      .map(cleanUrl)
      .filter(Boolean)
  );
}

function toCSVLine(b) {
  const escape = (v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`;
  return [b.business_name, b.website ?? "", b.phone ?? "", b.address ?? "", b.source ?? ""].map(escape).join(",");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const existing = loadExistingWebsites();
  const all = [];

  const run = async (fn, source) => {
    if (!USE_ALL && !SOURCES.includes(source)) return;
    try {
      const results = await fn();
      all.push(...results);
      await sleep(1500); // be polite between sources
    } catch (err) {
      console.warn(`  ⚠️  ${source} failed: ${err.message}`);
    }
  };

  await run(() => scrapeGoogleMaps(CATEGORY, CITY), "google");
  await run(() => scrapeYelp(CATEGORY, CITY), "yelp");
  await run(() => scrapeYellowPages(CATEGORY, CITY), "yellowpages");
  await run(() => scrapeBBB(CATEGORY, CITY), "bbb");

  // Dedup: by normalized website domain
  const seen = new Set(existing);
  const fresh = [];
  for (const b of all) {
    const key = cleanUrl(b.website) ?? b.business_name.toLowerCase().trim();
    if (seen.has(key)) continue;
    seen.add(key);
    fresh.push(b);
  }

  if (fresh.length === 0) {
    console.log("\n⚠️  No new businesses found (all already in leads-output.csv)\n");
    return;
  }

  // Write CSV
  const isNew = !fs.existsSync(OUTPUT_FILE);
  const header = "business_name,website,phone,address,source\n";
  const lines = fresh.map(toCSVLine).join("\n") + "\n";

  if (isNew) {
    fs.writeFileSync(OUTPUT_FILE, header + lines, "utf8");
  } else {
    fs.appendFileSync(OUTPUT_FILE, lines, "utf8");
  }

  console.log(`\n✅ Done! ${fresh.length} new businesses saved to scripts/leads-output.csv`);
  console.log(`   Total scraped across all sources: ${all.length}`);
  console.log(`   Duplicates removed: ${all.length - fresh.length}`);
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Open scripts/leads-output.csv`);
  console.log(`   2. Go to /admin/outreach on your site`);
  console.log(`   3. Click "Or paste a list manually"`);
  console.log(`   4. Paste the CSV contents → Import\n`);
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err.message);
  process.exit(1);
});
