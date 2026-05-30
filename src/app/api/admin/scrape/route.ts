import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

interface PlacesResult {
  name: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  place_id: string;
}

async function searchPlaces(query: string, apiKey: string): Promise<PlacesResult[]> {
  const params = new URLSearchParams({ query, key: apiKey });
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`
  );
  if (!res.ok) throw new Error(`Places API error: ${res.status}`);
  const data = await res.json();

  if (data.status === "REQUEST_DENIED") throw new Error(data.error_message ?? "API key invalid or Places API not enabled");
  if (data.status === "ZERO_RESULTS") return [];
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") throw new Error(`Places API: ${data.status}`);

  return data.results ?? [];
}

async function getPlaceDetails(placeId: string, apiKey: string): Promise<{ website?: string; phone?: string }> {
  const params = new URLSearchParams({
    place_id: placeId,
    fields: "website,formatted_phone_number",
    key: apiKey,
  });
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?${params}`
  );
  if (!res.ok) return {};
  const data = await res.json();
  return {
    website: data.result?.website ?? null,
    phone: data.result?.formatted_phone_number ?? null,
  };
}

function parseManualCSV(csv: string, city: string, category: string) {
  return csv
    .trim()
    .split("\n")
    .filter(Boolean)
    .slice(0, 50)
    .map((line) => {
      const [business_name, website, phone, address] = line.split(",").map((s) => s.trim());
      return {
        business_name: business_name ?? "Unknown",
        website: website || null,
        phone: phone || null,
        address: address || null,
        city,
        category,
      };
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
      const apiKey = process.env.GOOGLE_PLACES_API_KEY;
      if (!apiKey) {
        return NextResponse.json({
          error: "GOOGLE_PLACES_API_KEY not set. Add it to .env.local — see setup instructions on the dashboard.",
        }, { status: 400 });
      }

      const query = `${category} in ${city}, CA`;
      const places = await searchPlaces(query, apiKey);

      // Fetch details (website + phone) in parallel, max 20
      const detailed = await Promise.all(
        places.slice(0, 20).map(async (p) => {
          const details = await getPlaceDetails(p.place_id, apiKey);
          return {
            business_name: p.name,
            website: details.website ?? null,
            phone: details.phone ?? null,
            address: p.formatted_address ?? null,
            city,
            category,
          };
        })
      );

      businesses = detailed;
    }

    if (businesses.length === 0) {
      return NextResponse.json({ error: "No businesses found for that search." }, { status: 404 });
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
