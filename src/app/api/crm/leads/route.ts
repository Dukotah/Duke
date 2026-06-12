import { NextRequest, NextResponse } from "next/server";
import { getCustomLeads, getAllClaims, getTerritory, getLeadPreviewObjects, previewKey, getLeadActions, type LeadActions } from "@/lib/db";

// Lead source CSV. Defaults to the national deduped export, but can be pointed at
// a per-region deep-enriched export (e.g. santa_rosa_ENRICHED_crm.csv hosted on
// the scraper repo) via LEADS_CSV_URL with no code change. The parser below
// handles both schemas.
export const CSV_URL =
  process.env.LEADS_CSV_URL?.trim() ||
  // The old `claude/lead-data-sourcing-eyOeN` branch was deleted; the file lives
  // on `main`. The repo is PRIVATE, so production needs GITHUB_TOKEN set (see
  // getLeads) to read this raw URL — otherwise it 404s and we fall back to cache.
  "https://raw.githubusercontent.com/dukotah/sonoma-lead-scraper/main/lead-tracker/data/export/ALL_COUNTIES_dedup.csv";

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
  // ── Deep-enrichment fields (per-region enriched export). All optional/empty on
  // the legacy national CSV, so the rest of the app keeps working unchanged. ──
  /** MX-verified deliverability: valid | risky | invalid | unknown. */
  email_status?: string;
  /** "True"/"False" — role inbox (info@…). NOT a disqualifier for this vertical. */
  email_role?: string;
  /** "True"/"False" — free provider (gmail). NOT a disqualifier. */
  email_free?: string;
  /** "True"/"False" — throwaway domain. */
  email_disposable?: string;
  /** Additional emails found, "|"-joined. */
  all_emails?: string;
  /** Normalized E.164 phone (+1707…) for dialing. */
  phone_e164?: string;
  /** "True"/"False" — offline libphonenumber validation. */
  phone_valid?: string;
  /** mobile | fixed-line | fixed-line-or-mobile | toll-free | … */
  phone_type?: string;
  /** Decision-maker contact when found (sparse). */
  owner_name?: string;
  owner_title?: string;
  owner_email?: string;
  owner_phone?: string;
  /** Site audit signals. */
  site_quality?: string; // good | thin | dead | "" (no site)
  digital_presence?: string; // none | weak | ok
  site_load_ms?: string; // homepage load time in ms (slow load = sales angle)
  /** 0–100 enriched lead score. */
  lead_score?: number;
  /** A | B | C | D — enriched grade bucket. */
  grade?: string;
  category_value?: string; // premium | solid | modest | low
  need_signal?: string; // human-readable need reason
  reach_channel?: string; // email+phone | email | phone | none
  recommended_action?: string; // plain-English next step
  score_why?: string; // "; "-joined breakdown of what drove the score
  /** Stable dedup key across re-runs. */
  fingerprint?: string;
  /** Demo/preview site built for this prospect by the /websites factory, if any. */
  previewUrl?: string | null;
  demoStatus?: string | null;
  demoFlags?: string[] | null;
  demoCategory?: string | null;
  demoArea?: string | null;
  claimByDate?: string | null;
  thumbnailUrl?: string | null;
  /** Durable, cross-rep action stamps (emailedAt/calledAt/lastOutcome/who…). */
  actions?: LeadActions | null;
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

  // Resilient load: the base lead list comes from an external CSV. If that source
  // is unreachable (deleted branch, repo turned private → 404, network error), we
  // must NOT throw — that would 500 /api/crm/leads and break the ENTIRE CRM (All
  // view, Pipeline, reminder name-resolution). Instead serve the last cached copy,
  // or an empty list so custom leads still load. GITHUB_TOKEN (optional) lets the
  // fetch read a private repo's raw content.
  let res: Response;
  try {
    res = await fetch(CSV_URL, {
      next: { revalidate: 3600 },
      ...(process.env.GITHUB_TOKEN
        ? { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } }
        : {}),
    });
  } catch (err) {
    console.error("[leads] CSV fetch failed — serving cached/empty so the CRM stays up:", err);
    return cachedLeads ?? [];
  }
  if (!res.ok) {
    console.error(`[leads] CSV source returned ${res.status} — serving cached/empty (custom leads still load). Fix CSV_URL or set GITHUB_TOKEN.`);
    return cachedLeads ?? [];
  }

  const text = await res.text();
  const lines = text.split("\n").filter(Boolean);
  const rawHeaders = parseCSVLine(lines[0]);

  // Build a normalized-key → column-index map. The enriched export carries BOTH a
  // legacy Title-Case column and a canonical snake_case one for a few fields
  // (e.g. "Email status" AND "email_status", "Digital presence" AND
  // "digital_presence"). They normalize to the same key, so on a collision prefer
  // the column whose RAW header is already snake_case — that's the canonical,
  // MX-verified value the handoff says to use (a naive indexOf would grab the
  // earlier, legacy column).
  const norm = (h: string) => h.trim().toLowerCase().replace(/\s+/g, "_");
  const isCanonical = (raw: string) => /^[a-z0-9_]+$/.test(raw.trim());
  const headerIndex: Record<string, number> = {};
  rawHeaders.forEach((raw, i) => {
    const key = norm(raw);
    if (!(key in headerIndex) || (isCanonical(raw) && !isCanonical(rawHeaders[headerIndex[key]]))) {
      headerIndex[key] = i;
    }
  });

  const col = (row: string[], key: string) => {
    const idx = headerIndex[key] ?? -1;
    return idx >= 0 ? (row[idx] ?? "").trim() : "";
  };

  // Website-status tier (the A/B/C "No Website / DIY / Has Site" badge). The
  // enriched export's legacy "Tier" column is noise here (mostly "A"), so derive
  // the badge from the need signal when present; otherwise use the legacy CSV's
  // own tier column.
  const tierFromNeed = (need: string, fallback: string) => {
    const n = need.toLowerCase();
    if (!n) return fallback;
    if (n.includes("no website")) return "A"; // no site at all
    if (n.includes("modern") || n.includes("good")) return "C"; // already has a real site
    return "B"; // dead / thin / weak / DIY
  };

  const leads: Lead[] = [];
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    const name = col(row, "name") || col(row, "business") || col(row, "business_name");
    if (!name) continue;

    const needSignal = col(row, "need_signal");
    const leadScore = parseFloat(col(row, "lead_score"));
    const hasLeadScore = Number.isFinite(leadScore);
    // Discrete socials (facebook/instagram) only exist on the enriched export;
    // synthesize the pipe-joined `socials` the UI already renders when absent.
    const fb = col(row, "facebook");
    const ig = col(row, "instagram");

    leads.push({
      id: col(row, "id") || col(row, "fingerprint") || String(i),
      name,
      contact_name: col(row, "contact_name") || col(row, "contact") || col(row, "owner_name") || col(row, "owner") || col(row, "contact_person"),
      category: col(row, "category") || col(row, "niche"),
      alt_categories: col(row, "alt_categories"),
      phone: col(row, "phone_fmt") || col(row, "phone") || col(row, "phone_e164"),
      phone_fmt: col(row, "phone_fmt"),
      email: col(row, "email"),
      email_owned: col(row, "email_owned"),
      website: col(row, "website") || col(row, "discovered_website"),
      socials: col(row, "socials") || [fb, ig].filter(Boolean).join("|"),
      social_platforms: col(row, "social_platforms"),
      best_contact: col(row, "best_contact"),
      address: col(row, "address"),
      city: col(row, "city"),
      state: col(row, "state"),
      zip: col(row, "zip"),
      county: col(row, "county"),
      lat: col(row, "lat"),
      lon: col(row, "lon"),
      tier: tierFromNeed(needSignal, col(row, "tier")),
      tier_reason: col(row, "tier_reason") || needSignal,
      builder: col(row, "builder") || col(row, "site_builder"),
      industry_fit: col(row, "industry_fit"),
      // Sort axis. The enriched export's lead_score (0–100) is the primary score;
      // fall back to the legacy outreach_score otherwise.
      outreach_score: parseFloat(col(row, "outreach_score")) || (hasLeadScore ? leadScore : 0),
      score: parseFloat(col(row, "score")) || (hasLeadScore ? leadScore : 0),
      pitch: col(row, "pitch"),
      is_chain: col(row, "is_chain"),
      // Enriched fields (empty on the legacy CSV).
      email_status: col(row, "email_status"),
      email_role: col(row, "email_role"),
      email_free: col(row, "email_free"),
      email_disposable: col(row, "email_disposable"),
      all_emails: col(row, "all_emails") || col(row, "other_emails"),
      phone_e164: col(row, "phone_e164"),
      phone_valid: col(row, "phone_valid"),
      phone_type: col(row, "phone_type"),
      owner_name: col(row, "owner_name"),
      owner_title: col(row, "owner_title"),
      owner_email: col(row, "owner_email"),
      owner_phone: col(row, "owner_phone"),
      site_quality: col(row, "site_quality"),
      digital_presence: col(row, "digital_presence"),
      site_load_ms: col(row, "site_load_ms"),
      lead_score: hasLeadScore ? leadScore : undefined,
      grade: col(row, "lead_grade"),
      category_value: col(row, "category_value"),
      need_signal: needSignal,
      reach_channel: col(row, "reach_channel"),
      recommended_action: col(row, "recommended_action"),
      score_why: col(row, "score_why"),
      fingerprint: col(row, "fingerprint"),
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
    // Enriched filters (no-op on the legacy CSV where these fields are empty).
    const emailStatus = sp.get("emailStatus") ?? ""; // valid|risky|invalid|unknown|deliverable
    const grade = sp.get("grade") ?? ""; // A|B|C|D
    const reachChannel = sp.get("reachChannel") ?? "";
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
    // "deliverable" = anything we'd actually email: has an address that isn't
    // MX-invalid. (email_status=invalid is mostly "no email present".)
    if (emailStatus === "deliverable") filtered = filtered.filter((l) => !!l.email && (l.email_status ?? "").toLowerCase() !== "invalid");
    else if (emailStatus) filtered = filtered.filter((l) => (l.email_status ?? "").toLowerCase() === emailStatus.toLowerCase());
    if (grade) filtered = filtered.filter((l) => (l.grade ?? "").toUpperCase() === grade.toUpperCase());
    if (reachChannel) filtered = filtered.filter((l) => (l.reach_channel ?? "") === reachChannel);
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
    // Durable cross-rep action stamps — one HGETALL enriches the whole page.
    const actionsMap = await getLeadActions();
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
        actions: actionsMap[l.id] ?? null,
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
