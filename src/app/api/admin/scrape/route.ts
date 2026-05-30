import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

interface YelpBusiness {
  id: string;
  name: string;
  phone: string;
  location: { display_address: string[] };
  url: string;
}

interface YelpDetailsResponse {
  website?: string;
}

async function fetchYelpBusinesses(term: string, location: string, apiKey: string) {
  const params = new URLSearchParams({ term, location, limit: "20", sort_by: "rating" });
  const res = await fetch(`https://api.yelp.com/v3/businesses/search?${params}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Yelp search error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return (data.businesses ?? []) as YelpBusiness[];
}

async function fetchWebsite(businessId: string, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.yelp.com/v3/businesses/${businessId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) return null;
    const data: YelpDetailsResponse = await res.json();
    return data.website ?? null;
  } catch {
    return null;
  }
}

function parseManualCSV(csv: string, city: string, category: string) {
  return csv
    .trim()
    .split("\n")
    .filter(Boolean)
    .slice(0, 50)
    .map((line) => {
      const [business_name, website, phone, address] = line.split(",").map((s) => s.trim());
      return { business_name: business_name ?? "Unknown", website: website || null, phone: phone || null, address: address || null, city, category };
    });
}

export async function POST(req: NextRequest) {
  try {
    const { category, city, manual_csv } = await req.json();
    if (!category || !city) {
      return NextResponse.json({ error: "category and city required" }, { status: 400 });
    }

    const db = getDb();
    const dedup = db.prepare("SELECT id FROM leads WHERE website = ? AND website IS NOT NULL");
    const insert = db.prepare(`
      INSERT INTO leads (business_name, website, phone, address, city, category, status)
      VALUES (@business_name, @website, @phone, @address, @city, @category, 'scraped')
    `);

    let businesses: { business_name: string; website: string | null; phone: string | null; address: string | null; city: string; category: string }[] = [];

    if (manual_csv) {
      businesses = parseManualCSV(manual_csv, city, category);
    } else {
      const apiKey = process.env.YELP_API_KEY;
      if (!apiKey) {
        return NextResponse.json({
          error: "YELP_API_KEY not set. Add it to your .env.local file — see /admin/outreach for instructions.",
        }, { status: 400 });
      }

      const results = await fetchYelpBusinesses(category, `${city}, CA`, apiKey);

      // Fetch websites in parallel (Yelp search doesn't include website URL)
      const withWebsites = await Promise.all(
        results.map(async (b) => ({
          business_name: b.name,
          phone: b.phone || null,
          address: b.location.display_address.join(", ") || null,
          city,
          category,
          website: await fetchWebsite(b.id, apiKey),
        }))
      );

      businesses = withWebsites;
    }

    if (businesses.length === 0) {
      return NextResponse.json({ error: "No businesses found." }, { status: 404 });
    }

    let added = 0;
    for (const b of businesses) {
      if (b.website && dedup.get(b.website)) continue;
      insert.run(b);
      added++;
    }

    return NextResponse.json({ added, total: businesses.length });
  } catch (err) {
    console.error("Scrape error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
