import { NextRequest, NextResponse } from "next/server";
import { getCustomLeads, getAllClaims, getTerritory, getLeadPreviewObjects, previewKey } from "@/lib/db";

export const CSV_URL =
  "https://raw.githubusercontent.com/dukotah/sonoma-lead-scraper/claude/lead-data-sourcing-eyOeN/lead-tracker/data/export/ALL_COUNTIES_dedup.csv";

export interface Lead {
  id: string;
  name: string;
  contact_name: string;
  category: string;
  alt_categories: string;
  phone: string;
  phone_fmt: string;
  email: string;
  email_owned: string;
  website: string;
  socials: string;
  social_platforms: string;
  best_contact: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  lat: string;
  lon: string;
  tier: string;
  tier_reason: string;
  builder: string;
  industry_fit: string;
  outreach_score: number;
  score: number;
  pitch: string;
  is_chain: string;
  /** Demo/preview site built for this prospect by the /websites factory, if any. */
  previewUrl?: string | null;
  demoStatus?: string | null;
  demoFlags?: string[] | null;
  demoCategory?: string | null;
  demoArea?: string | null;
  claimByDate?: string | null;
  thumbnailUrl?: string | null;
}

let cachedLeads: Lead[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 1000 * 60 * 60;

export function clearLeadsCache() {
  cachedLeads = null;
  cacheTime = 0;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

async function getLeads(): Promise<Lead[]> {
  if (cachedLeads && Date.now() - cacheTime < CACHE_TTL) return cachedLeads;

  const res = await fetch(CSV_URL, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Failed to fetch CSV: ${res.status}`);

  const text = await res.text();
  const lines = text.split("\n").filter(Boolean);
  const rawHeaders = parseCSVLine(lines[0]);
  const headers = rawHeaders.map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));

  const col = (row: string[], key: string) => {
    const idx = headers.indexOf(key);
    return idx >= 0 ? (row[idx] ?? "").trim() : "";
  };

  const leads: Lead[] = [];
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    const name = col(row, "name") || col(row, "business") || col(row, "business_name");
    if (!name) continue;

    leads.push({
      id: col(row, "id") || String(i),
      name,
      contact_name: col(row, "contact_name") || col(row, "contact") || col(row, "owner_name") || col(row, "owner") || col(row, "contact_person"),
      category: col(row, "category") || col(row, "niche"),
      alt_categories: col(row, "alt_categories"),
      phone: col(row, "phone_fmt") || col(row, "phone"),
      phone_fmt: col(row, "phone_fmt"),
      email: col(row, "email"),
      email_owned: col(row, "email_owned"),
      website: col(row, "website"),
      socials: col(row, "socials"),
      social_platforms: col(row, "social_platforms"),
      best_contact: col(row, "best_contact"),
      address: col(row, "address"),
      city: col(row, "city"),
      state: col(row, "state"),
      zip: col(row, "zip"),
      county: col(row, "county"),
      lat: col(row, "lat"),
      lon: col(row, "lon"),
      tier: col(row, "tier"),
      tier_reason: col(row, "tier_reason"),
      builder: col(row, "builder"),
      industry_fit: col(row, "industry_fit"),
      outreach_score: parseFloat(col(row, "outreach_score")) || 0,
      score: parseFloat(col(row, "score")) || 0,
      pitch: col(row, "pitch"),
      is_chain: col(row, "is_chain"),
    });
  }

  cachedLeads = leads;
  cacheTime = Date.now();
  return leads;
}

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const q = sp.get("q")?.toLowerCase() ?? "";
    const county = sp.get("county") ?? "";
    const niche = sp.get("niche") ?? "";
    const tier = sp.get("tier") ?? "";
    const industryFit = sp.get("industryFit") ?? "";
    const bestContact = sp.get("bestContact") ?? "";
    const hasEmail = sp.get("hasEmail") ?? "";
    const hasWebsite = sp.get("hasWebsite") ?? "";
    const hotLeads = sp.get("hotLeads") === "1";
    const allTerritories = sp.get("allTerritories") === "1";
    const sortBy = sp.get("sortBy") ?? "outreach_score";
    const page = Math.max(1, parseInt(sp.get("page") ?? "1"));
    const limit = Math.min(100, parseInt(sp.get("limit") ?? "50"));

    const userId = req.headers.get("x-user-id");

    const all = await getLeads();
    let filtered = all;

    // Territory filtering — apply unless allTerritories=1
    if (userId && !allTerritories) {
      const territory = await getTerritory(userId);
      if (territory) {
        if (territory.counties.length > 0) {
          filtered = filtered.filter((l) =>
            territory.counties.some((c) => c.toLowerCase() === l.county.toLowerCase())
          );
        }
        if (territory.niches.length > 0) {
          filtered = filtered.filter((l) =>
            territory.niches.some((n) => n.toLowerCase() === l.category.toLowerCase())
          );
        }
      }
    }

    if (q) filtered = filtered.filter((l) =>
      l.name.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.pitch.toLowerCase().includes(q)
    );
    if (county) filtered = filtered.filter((l) => l.county.toLowerCase() === county.toLowerCase());
    if (niche) filtered = filtered.filter((l) => l.category.toLowerCase() === niche.toLowerCase());
    if (tier) filtered = filtered.filter((l) => l.tier.toUpperCase() === tier.toUpperCase());
    if (industryFit) filtered = filtered.filter((l) => l.industry_fit.toLowerCase() === industryFit.toLowerCase());
    if (bestContact) filtered = filtered.filter((l) => l.best_contact.toLowerCase() === bestContact.toLowerCase());
    if (hasEmail === "yes") filtered = filtered.filter((l) => !!l.email);
    if (hasEmail === "no") filtered = filtered.filter((l) => !l.email);
    if (hasWebsite === "no") filtered = filtered.filter((l) => !l.website);
    if (hasWebsite === "yes") filtered = filtered.filter((l) => !!l.website);
    if (hotLeads) filtered = filtered.filter((l) => l.tier === "A" && l.industry_fit === "high");

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "city") return a.city.localeCompare(b.city);
      if (sortBy === "score") return b.score - a.score;
      return b.outreach_score - a.outreach_score; // default
    });

    // Fetch custom leads for this user and prepend them
    let customLeads: (Lead & { isCustom: true; source: "inbound" | "manual" })[] = [];
    if (userId) {
      try {
        const custom = await getCustomLeads(userId);
        customLeads = custom.map((cl) => {
        // Inbound leads (audit/tool/contact captures) note themselves "Inbound …";
        // everything else is a lead Duke added by hand. Inbound = hottest = a real
        // hand-raiser, so flag it for the queue to surface above cold tier-A leads.
        const inbound = (cl.notes ?? "").trim().toLowerCase().startsWith("inbound");
        return {
          id: `custom:${cl.id}`,
          name: cl.name,
          contact_name: cl.contactName ?? "",
          category: cl.niche || "custom",
          alt_categories: "",
          phone: cl.phone,
          phone_fmt: cl.phone,
          email: cl.email,
          email_owned: "0",
          website: cl.website,
          socials: "",
          social_platforms: "",
          best_contact: cl.phone ? "phone" : cl.email ? "email" : "",
          address: "",
          city: cl.city,
          state: "",
          zip: "",
          county: cl.county,
          lat: "",
          lon: "",
          tier: "A",
          tier_reason: inbound ? "Inbound — warm hand-raiser" : "Manually added lead",
          builder: "",
          industry_fit: "high",
          outreach_score: 100,
          score: 100,
          pitch: cl.notes || `Hi, I'm reaching out to ${cl.name} — do you have 2 minutes?`,
          is_chain: "0",
          isCustom: true as const,
          source: inbound ? ("inbound" as const) : ("manual" as const),
        };
        });
      } catch {}
    }

    const total = filtered.length + customLeads.length;
    const pagedCustom = customLeads.slice(Math.max(0, (page - 1) * limit - filtered.length));
    const remainingLimit = limit - Math.min(customLeads.length, Math.max(0, limit - Math.max(0, (page - 1) * limit - customLeads.length)));
    const pagedFiltered = filtered.slice(
      Math.max(0, (page - 1) * limit - customLeads.length),
      Math.max(0, (page - 1) * limit - customLeads.length) + remainingLimit
    );
    // Simpler: on page 1 prepend custom leads, then fill with csv leads
    const pageLeads = page === 1
      ? [...customLeads, ...filtered].slice(0, limit)
      : filtered.slice((page - 1) * limit - customLeads.length, (page - 1) * limit - customLeads.length + limit);
    // suppress unused vars
    void pagedCustom; void pagedFiltered;

    // Merge claim info + any preview-site link (attached by the /websites factory,
    // matched on normalized business name). One HGETALL covers the whole page.
    const claims = await getAllClaims();
    const claimMap: Record<string, { userId: string; repName: string }> = {};
    for (const c of claims) claimMap[c.leadId] = { userId: c.userId, repName: c.repName };
    const previews = await getLeadPreviewObjects();
    const leads = pageLeads.map((l) => {
      const pkg = previews[previewKey(l.name)];
      return {
        ...l,
        claimedBy: claimMap[l.id] ?? null,
        previewUrl: pkg?.previewUrl ?? null,
        demoStatus: pkg?.status ?? null,
        demoFlags: pkg?.flags ?? null,
        demoCategory: pkg?.category ?? null,
        demoArea: pkg?.area ?? null,
        claimByDate: pkg?.claimByDate ?? null,
        thumbnailUrl: pkg?.thumbnailUrl ?? null,
      };
    });

    const counties = [...new Set(all.map((l) => l.county).filter(Boolean))].sort();
    const niches = [...new Set(all.map((l) => l.category).filter(Boolean))].sort();

    // Tier breakdown of filtered results
    const tierCounts = {
      A: filtered.filter((l) => l.tier === "A").length,
      B: filtered.filter((l) => l.tier === "B").length,
      C: filtered.filter((l) => l.tier === "C").length,
    };

    // Territory info for current user
    const territory = userId ? await getTerritory(userId) : null;

    return NextResponse.json({ leads, total, page, limit, counties, niches, tierCounts, territory });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load leads" }, { status: 500 });
  }
}
