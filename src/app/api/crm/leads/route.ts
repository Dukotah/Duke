import { NextRequest, NextResponse } from "next/server";

const CSV_URL =
  "https://raw.githubusercontent.com/dukotah/sonoma-lead-scraper/claude/lead-data-sourcing-eyOeN/lead-tracker/data/export/ALL_COUNTIES_dedup.csv";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  website: string;
  city: string;
  county: string;
  niche: string;
  address: string;
  lat: string;
  lon: string;
}

let cachedLeads: Lead[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

async function getLeads(): Promise<Lead[]> {
  if (cachedLeads && Date.now() - cacheTime < CACHE_TTL) return cachedLeads;

  const res = await fetch(CSV_URL, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status}`);

  const text = await res.text();
  const lines = text.split("\n").filter(Boolean);
  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, "_"));

  const leads: Lead[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => (row[h] = cols[idx] ?? ""));

    const name =
      row["name"] || row["business_name"] || row["business"] || row["title"] || "";
    if (!name) continue;

    leads.push({
      id: `${i}`,
      name,
      phone: row["phone"] || row["phone_number"] || "",
      website: row["website"] || row["website_url"] || row["url"] || "",
      city: row["city"] || row["locality"] || "",
      county: row["county"] || row["region"] || "",
      niche: row["niche"] || row["category"] || row["type"] || "",
      address: row["address"] || row["full_address"] || "",
      lat: row["lat"] || row["latitude"] || "",
      lon: row["lon"] || row["longitude"] || row["lng"] || "",
    });
  }

  cachedLeads = leads;
  cacheTime = Date.now();
  return leads;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const q = searchParams.get("q")?.toLowerCase() ?? "";
    const county = searchParams.get("county") ?? "";
    const niche = searchParams.get("niche") ?? "";
    const hasWebsite = searchParams.get("hasWebsite") ?? "";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50"));

    const all = await getLeads();

    let filtered = all;

    if (q) {
      filtered = filtered.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.niche.toLowerCase().includes(q)
      );
    }
    if (county) {
      filtered = filtered.filter((l) =>
        l.county.toLowerCase().includes(county.toLowerCase())
      );
    }
    if (niche) {
      filtered = filtered.filter((l) =>
        l.niche.toLowerCase().includes(niche.toLowerCase())
      );
    }
    if (hasWebsite === "yes") {
      filtered = filtered.filter((l) => l.website && l.website !== "");
    }
    if (hasWebsite === "no") {
      filtered = filtered.filter((l) => !l.website || l.website === "");
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const leads = filtered.slice(start, start + limit);

    // Collect filter options from full dataset
    const counties = [...new Set(all.map((l) => l.county).filter(Boolean))].sort();
    const niches = [...new Set(all.map((l) => l.niche).filter(Boolean))].sort();

    return NextResponse.json({ leads, total, page, limit, counties, niches });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load leads" }, { status: 500 });
  }
}
