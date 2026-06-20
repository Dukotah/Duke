# AUTO_EVOLUTION.md

> Long-term memory for the autonomous self-improvement loop on the Copper Bay Tech
> CRM (`duke-crm` worktree, branch `crm-cockpit`). One epoch = one Audit → Execute →
> Verify → Re-Plan cycle. Newest epoch on top.

---

## Epoch 8 — 2026-06-20

### 1. Current Status
Green. **vitest 204 passed (18 files) · tsc 0 · eslint 0 · next build exit 0.** Branch
~12 commits ahead of `origin/main`, not pushed. Integration-test boilerplate is now
shared; four Redis-backed libs (tasks, tags, merge, smartlists) are covered.

### 2. Completed in This Epoch
- **Extracted `src/lib/crm/testRedis.ts`** — `setupIsolatedRedis(label)` registers the
  beforeAll/beforeEach/afterAll that point LocalRedis at an isolated temp file + flush
  between tests. Refactored the tasks/tags/merge suites onto it (removed the
  triplicated temp-store boilerplate).
- **Added `src/lib/crm/smartlists.test.ts`** (5 tests): private list owner-only
  visibility, team lists visible to all, private-before-shared ordering, owned-delete,
  and shared-list owner-only delete. 199 → 204.
- **Lint gotcha fixed:** a `use`-prefixed helper (`useIsolatedRedis`) tripped
  `react-hooks/rules-of-hooks` — renamed to `setupIsolatedRedis`. (Confirmed a
  vitest-importing helper under `src/` does NOT break `next build`.)

### 3. Discovered Debt / Opportunities
- `notifications.ts` and `sequenceConfig.ts` remain the last untested Redis-backed
  libs — both now one-liners with `setupIsolatedRedis`.
- Carried forward: older admin routes still on local admin closures (vs `requireAdmin`).
- Naming convention note for future helpers: avoid the `use*` prefix outside React
  hooks (the lint can't tell the difference).

### 4. The Next Epoch Roadmap
1. **Integration-test `notifications.ts`** (add → list newest-first, ~100-entry cap,
   markNotificationRead by id + mark-all).
2. **Integration-test `sequenceConfig.ts`** (returns the default `SEQUENCE` when unset,
   the persisted override after `saveSequenceConfig`).
3. **Finish authz consolidation:** migrate remaining older admin routes (`revenue`,
   `submissions`, `users`, `territory`, `admin/health`, `admin/outreach`) to shared
   `requireAdmin`, with per-method care for `broadcast`'s intentionally-open GET.
4. **Audit the `/api/crm/*` non-admin routes** for consistent 401 handling + input
   validation (parseJsonBody usage) — spot-check for any unguarded mutating route.
5. **Consider a CONTRIBUTING/testing note** documenting the `setupIsolatedRedis`
   pattern so future lib tests follow it.

---

## Epoch 7 — 2026-06-20
- `merge.test.ts` (9): normalizers, all guard branches, end-to-end merge + delete,
  findDuplicates email grouping. 190 → 199.

## Epoch 6 — 2026-06-20
- `tags.test.ts` (6) + `localRedis.test.ts` parity guard. 183 → 190.

## Epoch 5 — 2026-06-20
- Fixed `LocalRedis` missing 5 commands; `__resetLocalRedis()` + `tasks.test.ts` (6).
  177 → 183.

## Epoch 4 — 2026-06-20
- Removed orphaned `Pipeline.tsx`; `.gitattributes`; dropped a wasted query in
  `/api/crm/demos`. Lint pristine.

## Epoch 3 — 2026-06-20
- Consolidated `automation`/`merge`/`sequences` authz onto shared `requireAdmin`.

## Epoch 2 — 2026-06-20
- Extracted pure `validateRules()` + `automation.test.ts` (9). 168 → 177.

## Epoch 1 — 2026-06-20
- `requireAdmin(req)` in `lib/api.ts`; guarded `admin/funnel` + `admin/template-stats`;
  `leads/route.test.ts` (8). 160 → 168. `/api/crm/*` is session-gated by middleware;
  admin-only API routes must self-enforce.
