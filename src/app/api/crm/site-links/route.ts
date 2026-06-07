import { NextRequest, NextResponse } from "next/server";
import { parseJsonBody, handleApiError } from "@/lib/api";
import { getCustomLeads, createCustomLead, setDemoLink, setEmailOverride, clearWebsiteLinkData, WEBSITE_LEADS_OWNER } from "@/lib/db";
import { loadAllLeads } from "@/app/api/crm/leads/route";
import { findMatches, pickPrimary, type ManifestEntry, type MatchableLead } from "@/lib/leadMatch";

// Cap to keep one request bounded — the real manifest is a handful of sites.
const MAX_MANIFEST = 2000;
const isHttpUrl = (u: string) => /^https?:\/\/.+/i.test(u);

// Admin-only. Triggered by the "Sync website links" button in the CRM admin.
// Takes the websites repo's sites-manifest.json (array of generated demo sites)
// and, for each site, finds the matching lead (by email / phone / business name)
// and attaches the demo URL — or creates a new custom lead when none matches.
// The URL then flows into outreach via the {demoUrl} template variable.

function isAdmin(req: NextRequest): boolean {
  return req.headers.get("x-user-role") === "admin";
}

interface SyncResult {
  business: string;
  url: string;
  action: "matched" | "created";
  leadId: string;
  // How many lead records the link was attached to (duplicates of one business).
  linkedCount?: number;
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(req)) return NextResponse.json({ error: "Admins only" }, { status: 403 });

    const parsed = await parseJsonBody<{ manifest?: ManifestEntry[] }>(req);
    if (!parsed.ok) return parsed.response;
    const manifest = parsed.data.manifest;
    if (!Array.isArray(manifest)) {
      return NextResponse.json({ error: "Expected { manifest: [...] }" }, { status: 400 });
    }
    if (manifest.length > MAX_MANIFEST) {
      return NextResponse.json({ error: `Manifest too large (max ${MAX_MANIFEST})` }, { status: 413 });
    }

    // Searchable set: the shared CSV leads + this admin's custom leads + the
    // global website-synced leads. Including the website-owned set is what makes
    // re-syncing idempotent (a prior run's lead is matched, not duplicated).
    // Custom lead ids are namespaced to match how the leads API exposes them.
    const csv = await loadAllLeads();
    const own = await getCustomLeads(userId);
    const fromWebsites = userId === WEBSITE_LEADS_OWNER ? [] : await getCustomLeads(WEBSITE_LEADS_OWNER);
    const ownIds = new Set(own.map((l) => l.id));
    const custom = [...own, ...fromWebsites.filter((l) => !ownIds.has(l.id))];
    const searchable: MatchableLead[] = [
      ...csv.map((l) => ({ id: l.id, name: l.name, phone: l.phone, email: l.email })),
      ...custom.map((l) => ({ id: `custom:${l.id}`, name: l.name, phone: l.phone, email: l.email })),
    ];

    let matched = 0;
    let created = 0;
    let skipped = 0;
    const results: SyncResult[] = [];
    // Non-fatal data-quality notes surfaced to the admin (e.g. a business that
    // matched but had no email on file, or a created lead with no contact email).
    const warnings: string[] = [];

    for (const entry of manifest) {
      const url = (entry?.url ?? "").trim();
      const business = (entry?.business ?? "").trim();
      const email = (entry?.email ?? "").trim();
      const phone = (entry?.phone ?? "").trim();

      // Need a valid http(s) URL to attach (it gets injected into emails), and
      // at least one thing to match/identify on.
      if (!isHttpUrl(url) || (!email && !phone && !business)) {
        skipped++;
        continue;
      }

      const hits = findMatches({ business, phone, email }, searchable);
      if (hits.length > 0) {
        // Attach to every duplicate record of this business so the link shows
        // no matter which row a rep opens.
        for (const h of hits) await setDemoLink(h.id, url);
        // The most recognizable matched record (name matches the business).
        const primary = pickPrimary(hits, business) ?? hits[0];
        // Enrichment: if we know an email but none of the matched records has
        // one, stamp it on the primary record so the business is reachable in
        // the email-only outreach list. Only one record, to avoid dup sends.
        const emailable = hits.some((h) => h.email && h.email.trim() !== "");
        if (email && !emailable) {
          await setEmailOverride(primary.id, email);
          warnings.push(`${business}: no record had an email on file — added ${email} so it's reachable.`);
        } else if (!email && !emailable) {
          warnings.push(`${business}: matched ${hits.length} record(s) but none has an email, and the manifest has none either — not reachable by email.`);
        }
        matched++;
        results.push({ business, url, action: "matched", leadId: primary.id, linkedCount: hits.length });
      } else {
        const lead = await createCustomLead(WEBSITE_LEADS_OWNER, {
          name: business || entry.slug || "Unknown business",
          phone,
          email,
          website: "",
          city: (entry?.city ?? "").trim(),
          county: "",
          niche: "website",
          notes: "Auto-added from generated website manifest.",
          demoUrl: url,
        });
        // Make it matchable on a subsequent sync run too.
        searchable.push({ id: `custom:${lead.id}`, name: lead.name, phone: lead.phone, email: lead.email });
        created++;
        results.push({ business: lead.name, url, action: "created", leadId: `custom:${lead.id}` });
        if (!email) {
          warnings.push(`${lead.name}: created as a new lead but has no email — add one to reach it by email.`);
        }
      }
    }

    return NextResponse.json({ matched, created, skipped, total: manifest.length, results, warnings });
  } catch (err) {
    return handleApiError("crm/site-links POST", err);
  }
}

// Admin-only. Undo all website-link data (demo links, email overrides, and the
// global website-owned leads). Does not touch any other CRM data.
export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!isAdmin(req)) return NextResponse.json({ error: "Admins only" }, { status: 403 });

    const cleared = await clearWebsiteLinkData();
    return NextResponse.json({ ok: true, cleared });
  } catch (err) {
    return handleApiError("crm/site-links DELETE", err);
  }
}
