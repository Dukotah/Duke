import { NextRequest, NextResponse } from "next/server";
import { getCustomLeads, getTerritory } from "@/lib/db";
// Re-use the shared CSV parser + filter logic from the leads route without
// duplicating the Lead type or the full getLeads() caching layer.
import { getLeads, type Lead } from "../leads/route";

// Columns to include in the export, in order.
const COLUMNS: { header: string; get: (l: Lead & { isCustom?: boolean }) => string }[] = [
  { header: "id",             get: (l) => l.id },
  { header: "name",           get: (l) => l.name },
  { header: "contact_name",   get: (l) => l.contact_name },
  { header: "category",       get: (l) => l.category },
  { header: "phone",          get: (l) => l.phone },
  { header: "email",          get: (l) => l.email },
  { header: "website",        get: (l) => l.website },
  { header: "city",           get: (l) => l.city },
  { header: "state",          get: (l) => l.state },
  { header: "county",         get: (l) => l.county },
  { header: "tier",           get: (l) => l.tier },
  { header: "tier_reason",    get: (l) => l.tier_reason },
  { header: "industry_fit",   get: (l) => l.industry_fit },
  { header: "outreach_score", get: (l) => String(l.outreach_score) },
  { header: "score",          get: (l) => String(l.score) },
  { header: "best_contact",   get: (l) => l.best_contact },
  { header: "pitch",          get: (l) => l.pitch },
  { header: "grade",          get: (l) => l.grade ?? "" },
  { header: "email_status",   get: (l) => l.email_status ?? "" },
  { header: "reach_channel",  get: (l) => l.reach_channel ?? "" },
  { header: "need_signal",    get: (l) => l.need_signal ?? "" },
  { header: "is_chain",       get: (l) => l.is_chain },
  { header: "source",         get: (l) => (l as Lead & { isCustom?: boolean; source?: string }).isCustom ? ((l as Lead & { source?: string }).source ?? "custom") : "csv" },
];

function csvCell(v: string): string {
  // Wrap in quotes if the value contains comma, quote, or newline.
  if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sp = req.nextUrl.searchParams;
    const q            = sp.get("q")?.toLowerCase() ?? "";
    const county       = sp.get("county") ?? "";
    const niche        = sp.get("niche") ?? "";
    const tier         = sp.get("tier") ?? "";
    const hasEmail     = sp.get("hasEmail") ?? "";
    const hasWebsite   = sp.get("hasWebsite") ?? "";
    const emailStatus  = sp.get("emailStatus") ?? "";
    const grade        = sp.get("grade") ?? "";
    const reachChannel = sp.get("reachChannel") ?? "";
    const hotLeads     = sp.get("hotLeads") === "1";
    const allTerritories = sp.get("allTerritories") === "1";
    const sortBy       = sp.get("sortBy") ?? "outreach_score";

    const all = await getLeads();
    let filtered = all;

    // Territory filtering — mirrors leads route exactly.
    if (!allTerritories) {
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
    if (county)       filtered = filtered.filter((l) => l.county.toLowerCase() === county.toLowerCase());
    if (niche)        filtered = filtered.filter((l) => l.category.toLowerCase() === niche.toLowerCase());
    if (tier)         filtered = filtered.filter((l) => l.tier.toUpperCase() === tier.toUpperCase());
    if (hasEmail === "yes") filtered = filtered.filter((l) => !!l.email);
    if (hasEmail === "no")  filtered = filtered.filter((l) => !l.email);
    if (hasWebsite === "yes") filtered = filtered.filter((l) => !!l.website);
    if (hasWebsite === "no")  filtered = filtered.filter((l) => !l.website);
    if (emailStatus === "deliverable") filtered = filtered.filter((l) => !!l.email && (l.email_status ?? "").toLowerCase() !== "invalid");
    else if (emailStatus) filtered = filtered.filter((l) => (l.email_status ?? "").toLowerCase() === emailStatus.toLowerCase());
    if (grade)        filtered = filtered.filter((l) => (l.grade ?? "").toUpperCase() === grade.toUpperCase());
    if (reachChannel) filtered = filtered.filter((l) => (l.reach_channel ?? "") === reachChannel);
    if (hotLeads)     filtered = filtered.filter((l) => l.tier === "A" && l.industry_fit === "high");

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "name")  return a.name.localeCompare(b.name);
      if (sortBy === "city")  return a.city.localeCompare(b.city);
      if (sortBy === "score") return b.score - a.score;
      return b.outreach_score - a.outreach_score;
    });

    // Prepend custom leads (same as leads route page-1 logic, but without pagination).
    type CustomLeadRow = Lead & { isCustom: true; source: "inbound" | "manual" };
    let customRows: CustomLeadRow[] = [];
    try {
      const custom = await getCustomLeads(userId);
      customRows = custom.map((cl) => {
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
    } catch { /* custom leads unavailable; export CSV-only rows */ }

    const rows: (Lead & { isCustom?: boolean; source?: string })[] = [...customRows, ...filtered];

    // Build CSV string.
    const header = COLUMNS.map((c) => csvCell(c.header)).join(",");
    const lines = rows.map((row) =>
      COLUMNS.map((c) => csvCell(c.get(row as Lead & { isCustom?: boolean }))).join(",")
    );
    const csv = [header, ...lines].join("\r\n");

    const filename = `crm-leads-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[api] crm/export:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
