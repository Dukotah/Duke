// Canonical business-name match key — byte-identical to scraper-app/contract/normalize.js
// and the Websites builder's scripts/lib/match-key.mjs. NOT yet swapped into previewKey()
// (doing so would orphan demo links already stored under the old key); future cutover.
export function norm(name: string): string {
  let n = (name || "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ");
  n = n.replace(/\b(llc|inc|incorporated|co|company|group|team|realty|realtors|real estate|properties|brokerage|the)\b/g, " ");
  return n.replace(/\s+/g, "");
}
export const matchKey = norm;
