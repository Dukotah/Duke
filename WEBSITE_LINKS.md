# Website Links → CRM → Outreach

Attaches generated demo-site URLs (from the `Dukotah/websites` Astro monorepo) to
CRM leads so the link can go out in cold outreach via the `{demoUrl}` variable.

## How it works
1. **websites repo:** `npm run manifest` scans `sites/*` and writes
   `sites-manifest.json` (`{slug, business, phone, email, city, url}` per site).
2. **CRM admin → "Website Links" tab:** upload (or paste) that JSON and click
   **Sync website links**.
3. The sync matches each site to a lead by **email → phone → business name**
   (normalized), attaching the demo URL to **every** matching record. Sites with
   no match become global "website"-owned leads.
4. Reps pick the **🌐 Demo Ready** template; `{demoUrl}` renders the live URL.

## Architecture notes
- CRM leads = read-only scraper CSV (GitHub) + writable Redis "custom leads".
  Demo URLs ride a Redis `demolink:<leadId>` map merged onto leads at read time
  (same pattern as `claims`). Nothing is written back to the CSV.
- Matching/merge code: `src/lib/leadMatch.ts`, `src/lib/db.ts`,
  `src/app/api/crm/leads/route.ts`, `src/app/api/crm/site-links/route.ts`.
- Outreach injection: `src/lib/outreach.ts` + `src/app/crm/components/*`.
- Maintenance: `scripts/clear-website-links.mjs` removes all sync artifacts.

## Status (verified live, local dev, practice mode)
- Sync, matching (incl. duplicate records), read-back, `{demoUrl}` render, and
  re-sync idempotency all confirmed against real data.
- Branches: `feat/website-links-to-crm` (Duke), `feat/sites-manifest` (websites).
  Not pushed / not deployed.

---

## Overnight roadmap (autonomous, local only — no deploys)
Worked top-down; each item verified with tsc + lint + tests + build before moving on.

> **Overnight result: R1–R6 done & verified (tsc + lint + 100 tests + build all
> green; key paths verified live against real data). R7 (commits) intentionally
> left undone — changes are uncommitted on the feature branches for your review.
> Prod Redis cleaned back to baseline.**

- [x] **R1 — Email enrichment.** When the manifest has an email but the matched
  CSV record(s) have none (e.g. Bear Flag Towing), make the business reachable so
  it appears in the email-only outreach list. Redis `emailoverride:<leadId>` map,
  merged into the lead's email *before* the `hasEmail` filter.
- [x] **R2 — Sync data-quality warnings.** Sync result returns `warnings[]` and the
  admin UI shows a "Heads up" panel. (Used unit-tested pure helpers instead of a
  full `planSync` extraction — same coverage, less churn.)
- [x] **R3 — Manifest dead-link check.** `npm run manifest -- --check` HEAD/GET-checks
  each URL; flags non-responding sites (caught thecornercup.coffee + driftwood).
- [x] **R4 — Tests.** `findMatches`, `pickPrimary`, `{demoUrl}` personalize covered
  (100 tests pass). Email-override + warnings verified live against real data.
- [x] **R5 — Docs.** This file + a "Feeding demo links to the CRM" section in the
  websites README.
- [x] **R6 — Final verification.** tsc + full lint + 100 tests + production build
  all green.
- [ ] **R7 — Commits.** Deferred: standing policy is to commit only when asked.
  Changes sit uncommitted on `feat/website-links-to-crm` / `feat/sites-manifest`
  for review; the 5 pre-existing WIP files in Duke were never touched.

### Additional polish (done & verified)
- [x] **In-app admin clear.** `DELETE /api/crm/site-links` (admin-only) +
  `clearWebsiteLinkData()` remove all demo links, email overrides, and
  website-owned leads — with a two-step confirm button in the Website Links tab.
  No more depending on the CLI script (which needs prod creds). Verified live.
- [x] **Read-path test coverage.** Extracted the email-override merge into a pure,
  unit-tested `applyEmailOverrides()` (104 tests total).
- [x] **Sync result polish.** Matched rows show `×N` when a business spans
  multiple records; warnings shown in a "Heads up" panel.

### Known follow-ups (not blockers)
- Login: first click of the 👑 Admin quick-access button occasionally needs a
  repeat (likely pre-hydration); minor, not investigated.
- Outreach lead picker paginates — a recognizable business can sit on page 2.
- Demo-link key is the CSV lead id (same fragility as the existing `claims`
  feature) — fine as long as the scraper CSV keeps stable ids.
- **Scale note (pre-existing, not this feature):** the scraper CSV lead source is
  ~44 MB, over Next's 2 MB fetch-cache limit, so every cold fetch logs a cache
  warning and re-downloads. The route's in-memory 1-hour cache mitigates it, but
  long-term the lead source should move to a DB/paginated API rather than a
  single large CSV pulled into memory.

### Progress log
- (start) Cleanup run; baseline restored. Roadmap written.
- R1 ✅ Email enrichment done + verified live: a matched business with no email on
  file gets the manifest email stamped on its most recognizable record
  (`pickPrimary`), so it shows in the email-only outreach list with its demo link.
  Bear Flag Towing now reachable. New `emailoverride:` Redis map merged before the
  hasEmail filter. clear-website-links.mjs updated to wipe overrides too.
- R2 ✅ Sync now returns `warnings[]` (no-email-on-file → enriched; created-without-
  email; matched-but-unreachable) and the admin tab shows them. Pure matching
  logic (`findMatches`, `pickPrimary`) unit-tested instead of a full planSync
  extraction (same coverage, less churn).
