# AUTO_EVOLUTION.md

> Long-term memory for the autonomous self-improvement loop on the Copper Bay Tech
> CRM (`duke-crm` worktree, branch `crm-cockpit`). One epoch = one Audit → Execute →
> Verify → Re-Plan cycle. Newest epoch on top.

---

## Epoch 7 — 2026-06-20

### 1. Current Status
Green. **vitest 199 passed (17 files) · tsc 0 · eslint 0 · next build exit 0.** Branch
~11 commits ahead of `origin/main`, not pushed. The riskiest module (`merge.ts`) now
has integration coverage; three Redis-backed libs (tasks, tags, merge) are tested.

### 2. Completed in This Epoch
- **`src/lib/crm/merge.test.ts`** (9 tests) covering the highest-risk module:
  - pure normalizers (`normEmail`/`normPhone`/`normNameCity`) incl. country-code
    stripping and the both-fields-required rule;
  - every `mergeLeads` guard branch (missing ids, survivor===loser no-op, CSV-loser
    refusal, unknown-loser "not found");
  - an **end-to-end merge**: real `createCustomLead` loser + seeded `lead_actions`,
    merged into a CSV survivor — asserts counters re-pointed onto survivor, loser
    action record removed, and the loser custom lead deleted from storage AND its
    owner index;
  - `findDuplicates` grouping two custom leads that share an email.
  190 → 199.

### 3. Discovered Debt / Opportunities
- The temp-store harness (beforeAll/beforeEach/afterAll + `__resetLocalRedis`) is now
  duplicated across tasks/tags/merge tests — ripe for a shared `isolatedRedis()` helper.
- `smartlists.ts`, `notifications.ts`, `sequenceConfig.ts` still untested (now trivial
  with the harness).
- Carried forward: older admin routes still on local admin closures (vs `requireAdmin`).

### 4. The Next Epoch Roadmap
1. **Extract a shared test helper** (`src/lib/crm/testRedis.ts` exposing
   `useIsolatedRedis()`), and refactor tasks/tags/merge tests onto it — removes the
   repeated temp-store boilerplate before it spreads further.
2. **Integration-test `smartlists.ts`** (private vs team scope, create/list/delete).
3. **Integration-test `notifications.ts`** (add/list ordering, ~100 cap, markRead).
4. **Finish authz consolidation:** migrate remaining older admin routes to shared
   `requireAdmin` (per-method care for `broadcast`'s open GET).
5. **Integration-test `sequenceConfig.ts`** (default fallback vs persisted override).

---

## Epoch 6 — 2026-06-20
- `tags.test.ts` (6) + `localRedis.test.ts` parity guard (scans src for redis.<m>()
  calls, asserts each exists on LocalRedis). 183 → 190.

## Epoch 5 — 2026-06-20
- Fixed `LocalRedis` missing 5 commands (`hget`/`hdel`/`rpush`/`zrem`/`exists`);
  `__resetLocalRedis()` + `tasks.test.ts` (6). 177 → 183.

## Epoch 4 — 2026-06-20
- Removed orphaned `Pipeline.tsx`; `.gitattributes`; dropped a wasted query in
  `/api/crm/demos`. Lint pristine.

## Epoch 3 — 2026-06-20
- Consolidated `automation`/`merge`/`sequences` authz onto shared `requireAdmin`.

## Epoch 2 — 2026-06-20
- Extracted pure `validateRules()` + `automation.test.ts` (9). 168 → 177.

## Epoch 1 — 2026-06-20
- `requireAdmin(req)` in `lib/api.ts`; guarded `admin/funnel` + `admin/template-stats`;
  `leads/route.test.ts` (8). 160 → 168. Note: `/api/crm/*` is session-gated by
  middleware; admin-only API routes must self-enforce.
