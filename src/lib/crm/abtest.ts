// A/B subject-line testing for cold outreach.
//
// Pure + deterministic so the same recipient always sees the same variant (a
// consistent experience, and stable attribution when a later open/click event
// has to be credited back to the variant that produced it), while the audience
// splits roughly evenly across the variant set. The variant id is derived from
// the subject text itself, so per-variant stats stay stable across sends even if
// the order of the variants changes between requests.

export interface SubjectVariant {
  id: string;
  subject: string;
}

// Small, stable, dependency-free string hash (djb2). Not cryptographic — just a
// well-distributed integer for bucketing.
function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33) ^ str.charCodeAt(i);
  }
  return h >>> 0; // force unsigned 32-bit
}

// Stable id for a subject line, e.g. "v_1a2b3c4d". Trimmed + lowercased so
// cosmetic whitespace/case differences don't fork the stats.
export function subjectVariantId(subject: string): string {
  return "v_" + hash(subject.trim().toLowerCase()).toString(16).padStart(8, "0");
}

// Normalize a raw list of subject lines into deduped, id-stamped variants.
export function toVariants(subjects: string[]): SubjectVariant[] {
  const seen = new Set<string>();
  const out: SubjectVariant[] = [];
  for (const raw of subjects) {
    const subject = raw.trim();
    if (!subject) continue;
    const id = subjectVariantId(subject);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ id, subject });
  }
  return out;
}

// Pick a variant for a recipient deterministically. `key` is typically the
// recipient's email so the same person always gets the same subject.
export function chooseVariant(variants: SubjectVariant[], key: string): SubjectVariant | null {
  if (variants.length === 0) return null;
  if (variants.length === 1) return variants[0];
  const idx = hash(key.trim().toLowerCase()) % variants.length;
  return variants[idx];
}

// Open / click / reply rates as fractions (0–1), guarding divide-by-zero.
export interface VariantRates {
  openRate: number;
  clickRate: number;
  replyRate: number;
}
export function variantRates(s: { sent: number; opened: number; clicked: number; replied: number }): VariantRates {
  const denom = s.sent || 0;
  if (denom === 0) return { openRate: 0, clickRate: 0, replyRate: 0 };
  return {
    openRate: s.opened / denom,
    clickRate: s.clicked / denom,
    replyRate: s.replied / denom,
  };
}
