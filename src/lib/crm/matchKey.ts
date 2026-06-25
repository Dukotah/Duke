// Canonical business-name normalizer — byte-identical to
// scraper-app/contract/normalize.js and the Websites builder's
// scripts/lib/match-key.mjs.
//
// TWO distinct keys, do NOT conflate them:
//   * norm()     — LOOSE suppression/dedup key. Strips distinguishing words
//                  (realty/group/team/...). Two different firms can collide,
//                  so NEVER join on it.
//   * matchKey() — TIGHT join key. Strips ONLY legal-entity forms
//                  (llc/inc/corp/co/ltd/llp/...) and keeps every distinguishing
//                  word. This is the demo<->lead JOIN key.
//
// This module is NOT yet swapped into previewKey() (doing so would orphan demo
// links already stored under the old key); it remains a future-cutover module.
// The live join still uses previewKey() in src/lib/db.ts; the manifest's
// `matchKey` value is passed through unchanged by sync/preview, never recomputed
// here with the loose key.
export function norm(name: string): string {
  let n = (name || "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ");
  n = n.replace(/\b(llc|inc|incorporated|co|company|group|team|realty|realtors|real estate|properties|brokerage|the)\b/g, " ");
  return n.replace(/\s+/g, "");
}
export function matchKey(name: string): string {
  let n = (name || "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ");
  n = n.replace(/\b(llc|inc|incorporated|corp|corporation|co|company|ltd|llp)\b/g, " ");
  return n.replace(/\s+/g, "");
}
