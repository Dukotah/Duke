import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

interface ScrapedBusiness {
  business_name: string;
  website: string | null;
  phone: string | null;
  address: string | null;
}

async function scrapeGoogleMaps(query: string, city: string): Promise<ScrapedBusiness[]> {
  const searchQuery = encodeURIComponent(`${query} in ${city} CA`);
  const url = `https://www.google.com/maps/search/${searchQuery}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const html = await res.text();

  const businesses: ScrapedBusiness[] = [];

  // Extract business data from Google Maps JSON embedded in the page
  const jsonMatch = html.match(/window\.APP_INITIALIZATION_STATE\s*=\s*(\[[\s\S]+?\]);\s*window/);
  if (!jsonMatch) {
    // Fallback: parse visible text patterns for business names
    const nameMatches = html.matchAll(/"([^"]{3,60})",null,null,null,null,\[null,null,(\d+\.\d+),(-?\d+\.\d+)\]/g);
    for (const m of nameMatches) {
      if (businesses.length >= 20) break;
      businesses.push({ business_name: m[1], website: null, phone: null, address: null });
    }
    return businesses;
  }

  try {
    // Pull business name + website patterns from the raw JSON blob
    const raw = jsonMatch[1];
    const nameWebPairs = raw.matchAll(/"([A-Z][^"]{2,60})","(https?:\/\/[^"]+)"/g);
    for (const match of nameWebPairs) {
      if (businesses.length >= 25) break;
      const name = match[1];
      const site = match[2];
      if (
        site.includes("google") ||
        site.includes("facebook") ||
        site.includes("yelp") ||
        site.includes("instagram")
      )
        continue;
      businesses.push({ business_name: name, website: site, phone: null, address: null });
    }
  } catch {
    // ignore parse errors
  }

  return businesses;
}

export async function POST(req: NextRequest) {
  try {
    const { category, city } = await req.json();
    if (!category || !city) {
      return NextResponse.json({ error: "category and city required" }, { status: 400 });
    }

    const businesses = await scrapeGoogleMaps(category, city);
    if (businesses.length === 0) {
      return NextResponse.json({ error: "No businesses found — try a different category or city" }, { status: 404 });
    }

    const db = getDb();
    const insert = db.prepare(`
      INSERT OR IGNORE INTO leads (business_name, website, phone, address, city, category, status)
      VALUES (@business_name, @website, @phone, @address, @city, @category, 'scraped')
    `);

    // Use website as unique key to avoid dupes
    const dedup = db.prepare("SELECT id FROM leads WHERE website = ?");
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
