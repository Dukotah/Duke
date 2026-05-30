import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

interface ScrapedBusiness {
  business_name: string;
  website: string | null;
  phone: string | null;
  address: string | null;
}

async function scrapeYelp(category: string, city: string): Promise<ScrapedBusiness[]> {
  const location = encodeURIComponent(`${city}, CA`);
  const find_desc = encodeURIComponent(category);
  const url = `https://www.yelp.com/search?find_desc=${find_desc}&find_loc=${location}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!res.ok) throw new Error(`Yelp fetch failed: ${res.status}`);
  const html = await res.text();

  const businesses: ScrapedBusiness[] = [];

  // Yelp embeds business data in a JSON blob in a <script> tag
  const scriptMatch = html.match(/<!--{"locale"[\s\S]+?-->/);
  if (scriptMatch) {
    try {
      const json = JSON.parse(scriptMatch[0].replace(/^<!--/, "").replace(/-->$/, ""));
      const searchResults =
        json?.legacyProps?.searchAppProps?.searchPageProps?.mainContentComponentsListProps ?? [];

      for (const item of searchResults) {
        if (businesses.length >= 20) break;
        const biz = item?.searchResultBusiness;
        if (!biz?.name) continue;
        businesses.push({
          business_name: biz.name,
          website: biz.website?.href ?? null,
          phone: biz.phone ?? null,
          address: biz.formattedAddress ?? null,
        });
      }

      if (businesses.length > 0) return businesses;
    } catch {
      // fall through to regex fallback
    }
  }

  // Regex fallback — parse business names from Yelp's structured markup
  const nameMatches = html.matchAll(/"name"\s*:\s*"([^"]{3,80})"/g);
  const websiteMatches = [...html.matchAll(/"website"\s*:\s*\{[^}]*"href"\s*:\s*"([^"]+)"/g)];
  const phoneMatches = [...html.matchAll(/"phone"\s*:\s*"([^"]+)"/g)];

  let i = 0;
  for (const m of nameMatches) {
    if (businesses.length >= 20) break;
    const name = m[1];
    if (name.length < 3 || name.includes("\\") || name === city) continue;
    businesses.push({
      business_name: name,
      website: websiteMatches[i]?.[1] ?? null,
      phone: phoneMatches[i]?.[1] ?? null,
      address: null,
    });
    i++;
  }

  return businesses;
}

function parseManualCSV(csv: string, city: string, category: string): ScrapedBusiness[] {
  const lines = csv.trim().split("\n").filter(Boolean);
  return lines.slice(0, 50).map((line) => {
    const [business_name, website, phone, address] = line.split(",").map((s) => s.trim());
    return {
      business_name: business_name ?? "Unknown",
      website: website || null,
      phone: phone || null,
      address: address || null,
    };
  });
}

export async function POST(req: NextRequest) {
  try {
    const { category, city, manual_csv } = await req.json();
    if (!category || !city) {
      return NextResponse.json({ error: "category and city required" }, { status: 400 });
    }

    let businesses: ScrapedBusiness[];

    if (manual_csv) {
      businesses = parseManualCSV(manual_csv, city, category);
    } else {
      businesses = await scrapeYelp(category, city);
    }

    if (businesses.length === 0) {
      return NextResponse.json({
        error: "No businesses found. Try the manual import — paste business names and websites as CSV.",
      }, { status: 404 });
    }

    const db = getDb();
    const dedup = db.prepare("SELECT id FROM leads WHERE website = ? AND website IS NOT NULL");
    const insert = db.prepare(`
      INSERT INTO leads (business_name, website, phone, address, city, category, status)
      VALUES (@business_name, @website, @phone, @address, @city, @category, 'scraped')
    `);

    let added = 0;
    for (const b of businesses) {
      if (b.website) {
        const existing = dedup.get(b.website);
        if (existing) continue;
      }
      insert.run({ ...b, city, category });
      added++;
    }

    return NextResponse.json({ added, total: businesses.length });
  } catch (err) {
    console.error("Scrape error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
