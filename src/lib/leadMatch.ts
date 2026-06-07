// Pure matching logic for attaching generated demo-site links to CRM leads.
// Extracted so it can be unit-tested without Redis, the CSV fetch, or a request.
//
// A site from the /websites manifest is matched to a lead by, in priority order:
// email, then phone, then business name — all normalized. The first match wins.
// Kept side-effect free: the /api/crm/site-links route composes this with the
// data layer (load leads, setDemoLink / createCustomLead).

// One entry of the websites repo's sites-manifest.json.
export interface ManifestEntry {
  slug: string;
  business: string;
  phone: string;
  email: string;
  city: string;
  url: string;
}

// The minimal shape we need to match against — works for both CSV leads and
// custom leads.
export interface MatchableLead {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export function normalizeEmail(s: string | undefined): string {
  return (s ?? "").trim().toLowerCase();
}

// Reduce a phone to comparable digits. US numbers vary in formatting and may
// carry a country-code "1" prefix, so we compare the last 10 digits.
export function phoneKey(s: string | undefined): string {
  const digits = (s ?? "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

// Lowercase, strip punctuation, collapse whitespace. "Joe's Plumbing, LLC" and
// "Joes Plumbing LLC" both become "joes plumbing llc".
export function normalizeBusiness(s: string | undefined): string {
  return (s ?? "")
    .trim()
    .toLowerCase()
    // Drop apostrophes first so "Joe's" and "Joes" collapse to the same token,
    // then turn any other punctuation into a space.
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface MatchInput {
  business: string;
  phone: string;
  email: string;
}

// Find the lead a manifest entry refers to, or null. Email and phone only match
// when both sides are present and well-formed (phone needs a full 10 digits) to
// avoid false positives on blanks or partials. Business name is the last resort.
export function matchLead(
  entry: MatchInput,
  leads: MatchableLead[],
): MatchableLead | null {
  const email = normalizeEmail(entry.email);
  if (email) {
    const m = leads.find((l) => normalizeEmail(l.email) === email);
    if (m) return m;
  }

  const phone = phoneKey(entry.phone);
  if (phone.length === 10) {
    const m = leads.find((l) => phoneKey(l.phone) === phone);
    if (m) return m;
  }

  const biz = normalizeBusiness(entry.business);
  if (biz) {
    const m = leads.find((l) => normalizeBusiness(l.name) === biz);
    if (m) return m;
  }

  return null;
}

// Find ALL lead records that refer to the same business — the scraper CSV often
// has several fragmented rows per business (e.g. "Bear Flag Towing" and
// "GABA CORP Bear Flag Towing" sharing one phone, some with an email and some
// without). A record matches on email OR phone OR business name. We attach the
// demo link to every one so the link surfaces no matter which row a rep opens,
// and email-bearing records sort first (they're the ones that get emailed).
export function findMatches(
  entry: MatchInput,
  leads: MatchableLead[],
): MatchableLead[] {
  const email = normalizeEmail(entry.email);
  const phone = phoneKey(entry.phone);
  const biz = normalizeBusiness(entry.business);

  const out: MatchableLead[] = [];
  const seen = new Set<string>();
  for (const l of leads) {
    const emailHit = email !== "" && normalizeEmail(l.email) === email;
    const phoneHit = phone.length === 10 && phoneKey(l.phone) === phone;
    const bizHit = biz !== "" && normalizeBusiness(l.name) === biz;
    if ((emailHit || phoneHit || bizHit) && !seen.has(l.id)) {
      seen.add(l.id);
      out.push(l);
    }
  }
  // Email-bearing records first — they're the deliverable ones.
  out.sort((a, b) => (b.email ? 1 : 0) - (a.email ? 1 : 0));
  return out;
}

// Fill in a lead's email from an override map when (and only when) the lead has
// no email of its own. Returns new objects for changed rows and leaves the rest
// untouched (and returns the input array unchanged when there's nothing to do).
// Applied before the outreach hasEmail filter so an enriched lead becomes
// selectable. Pure, so the read path can be unit-tested.
export function applyEmailOverrides<T extends { id: string; email?: string }>(
  leads: T[],
  overrides: Record<string, string>,
): T[] {
  if (leads.length === 0 || Object.keys(overrides).length === 0) return leads;
  return leads.map((l) =>
    !l.email?.trim() && overrides[l.id] ? { ...l, email: overrides[l.id] } : l,
  );
}

// Of several matched records, pick the most recognizable one to treat as the
// business's primary record (where we stamp an enrichment email and report).
// Prefer an exact normalized-name match, then a record whose name contains (or
// is contained by) the business name, else the first. Lets the demo link / added
// email land on the row a rep would actually recognize, not a stray duplicate.
export function pickPrimary(
  hits: MatchableLead[],
  business: string,
): MatchableLead | null {
  if (hits.length === 0) return null;
  const biz = normalizeBusiness(business);
  if (biz) {
    const exact = hits.find((h) => normalizeBusiness(h.name) === biz);
    if (exact) return exact;
    const partial = hits.find((h) => {
      const n = normalizeBusiness(h.name);
      return n !== "" && (n.includes(biz) || biz.includes(n));
    });
    if (partial) return partial;
  }
  return hits[0];
}
