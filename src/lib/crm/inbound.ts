// Inbound free-tool / freemium lead bridge.
//
// Free-tool and freemium signups used to only fire an email and never reach the
// CRM. This module is the bridge: a scored lead from a public tool (e.g. the
// Business Analysis report) is upserted into the very same SQLite store the
// dialer reads from (`./store`), so it shows up in the queue and the pipeline.
//
// Dedup mirrors the website-link sync: match an existing lead by email, then
// phone (last 10 digits), then normalized business name — reusing the pure
// helpers in `@/lib/leadMatch`. On a hit we enrich the existing record (attach
// scores / grade / recommended service / source, set the first-touch source
// only if it was never set) instead of creating a duplicate.
//
// Resilience: the store is async and may be unavailable (e.g. a read-only
// deploy filesystem). A normal "store unavailable" failure must NOT
// throw to the caller — the public tool's primary job is the email/report, the
// CRM write is best-effort — so we catch, log, and return a best-effort result.

import {
  createLead,
  getLead,
  getLeads,
  updateLead,
  addNote,
} from "./store";
import { normalizeBusiness, normalizeEmail, phoneKey } from "@/lib/leadMatch";

export interface InboundLeadInput {
  email: string;
  businessName?: string;
  website?: string;
  phone?: string;
  scores?: {
    overall: number;
    website: number;
    local: number;
    social: number;
    branding: number;
  };
  grade?: string; // e.g. "B"
  recommendedService?: string; // the "biggest opportunity" service
  source: string; // e.g. "Business Analysis"
}

export interface CreateInboundLeadResult {
  id: string;
  created: boolean;
}

// Build the human-readable enrichment note we stamp on the lead's timeline.
// The Lead model has no first-class columns for grade / recommended service /
// per-area scores, so the timeline is where they live (the same place a rep
// reads context before a call). Returns null when there's nothing to record.
function buildEnrichmentNote(input: InboundLeadInput): string | null {
  const parts: string[] = [];
  if (input.grade) parts.push(`Grade: ${input.grade}`);
  if (input.scores) {
    const s = input.scores;
    parts.push(
      `Scores — overall ${s.overall}, website ${s.website}, local ${s.local}, ` +
        `social ${s.social}, branding ${s.branding}`,
    );
  }
  if (input.recommendedService) {
    parts.push(`Biggest opportunity: ${input.recommendedService}`);
  }
  if (parts.length === 0) return null;
  return `${input.source} result\n${parts.join("\n")}`;
}

// Find an existing lead matching the inbound contact, by email → phone → name,
// reusing the shared normalizers so this stays consistent with the website-link
// sync. Returns the lead id, or null when there's no match.
async function findExistingId(input: InboundLeadInput): Promise<string | null> {
  const leads = await getLeads();

  const email = normalizeEmail(input.email);
  if (email) {
    const m = leads.find((l) => normalizeEmail(l.email) === email);
    if (m) return m.id;
  }

  const phone = phoneKey(input.phone);
  if (phone.length === 10) {
    const m = leads.find((l) => phoneKey(l.phone) === phone);
    if (m) return m.id;
  }

  const biz = normalizeBusiness(input.businessName);
  if (biz) {
    const m = leads.find((l) => normalizeBusiness(l.business) === biz);
    if (m) return m.id;
  }

  return null;
}

/**
 * Upsert a scored inbound lead into the CRM store.
 *
 * - Dedups against existing leads by email, then phone, then business name.
 * - On a match: enriches the existing lead (heat score from `scores.overall`,
 *   fills in any blank email / phone / website, records the report as a note)
 *   and returns `{ id, created: false }`. The first-touch `source` is preserved
 *   when already set; otherwise the inbound source is stamped.
 * - On no match: creates a new lead with the inbound source and returns
 *   `{ id, created: true }`.
 *
 * Never throws for a normal "store unavailable" case — logs and returns a
 * best-effort result so the caller's email/report flow is unaffected.
 */
export async function createInboundLead(
  input: InboundLeadInput,
): Promise<CreateInboundLeadResult> {
  try {
    const existingId = await findExistingId(input);

    if (existingId) {
      const existing = await getLead(existingId);
      // Only enrich blanks, never clobber a rep's edits.
      const patch: Parameters<typeof updateLead>[1] = {};
      if (existing) {
        if (!existing.email?.trim() && input.email.trim()) {
          patch.email = input.email.trim();
        }
        if (!existing.phone?.trim() && input.phone?.trim()) {
          patch.phone = input.phone.trim();
        }
        if (!existing.website?.trim() && input.website?.trim()) {
          patch.website = input.website.trim();
        }
        // First-touch source wins: only stamp when it was never set.
        if (!existing.source?.trim()) patch.source = input.source;
        // A fresh score should reflect current heat.
        if (typeof input.scores?.overall === "number") {
          patch.heatScore = input.scores.overall;
        }
      }
      if (Object.keys(patch).length > 0) await updateLead(existingId, patch);

      const note = buildEnrichmentNote(input);
      if (note) await addNote(existingId, note);

      return { id: existingId, created: false };
    }

    const lead = await createLead({
      business: input.businessName?.trim() || input.email,
      phone: input.phone?.trim() || "",
      email: input.email.trim(),
      website: input.website?.trim() || undefined,
      source: input.source,
      heatScore:
        typeof input.scores?.overall === "number" ? input.scores.overall : 0,
    });

    const note = buildEnrichmentNote(input);
    if (note) await addNote(lead.id, note);

    return { id: lead.id, created: true };
  } catch (err) {
    // Store unavailable (e.g. read-only FS) — don't break the caller's primary
    // email/report flow. Log and return a best-effort, non-persisted result.
    console.error("[crm] createInboundLead failed; lead not persisted", err);
    return { id: "", created: false };
  }
}
