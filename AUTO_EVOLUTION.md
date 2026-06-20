# AUTO_EVOLUTION.md

> Long-term memory for the autonomous self-improvement loop on the Copper Bay Tech
> CRM (`duke-crm` worktree, branch `crm-cockpit`). One epoch = one Audit → Execute →
> Verify → Re-Plan cycle. Newest epoch on top.

---

## Epoch 6 — 2026-06-20

### 1. Current Status
Green. **vitest 190 passed (16 files) · tsc 0 · eslint 0 · next build exit 0.** Branch
~10 commits ahead of `origin/main`, not pushed. Two of the Redis-backed libs (tasks,
tags) now have integration coverage, and a standing parity guard prevents the
epoch-5 class of local-dev bug from recurring.

### 2. Completed in This Epoch
- **`src/lib/crm/tags.test.ts`** (6 integration tests over an isolated temp store):
  create+trim, per-user isolation, assign + resolve (`getLeadTags`/`getAllLeadTagMap`),
  idempotent `addLeadTag`, `removeLeadTag` dropping the lead entry on last tag, and the
  `deleteTag` cascade (removes the definition AND scrubs it from every lead's list).
- **`src/lib/localRedis.test.ts` — parity guard.** Scans `src/**` for `redis.<m>(` and
  `getRedis().<m>(` call sites and asserts every method exists on `LocalRedis`. Passes
  now (validates epoch 5's fix) and fails fast if future code calls an unimplemented
  command. 183 → 190.

### 3. Discovered Debt / Opportunities
- `merge.ts` remains the riskiest untested module (multi-namespace key re-pointing).
- `smartlists.ts`, `notifications.ts`, `sequenceConfig.ts` still lack integration tests
  (now straightforward with the established temp-store harness).
- Parity guard caveat: aliased clients (`const r = getRedis(); r.x()`) aren't scanned —
  acceptable, but worth a comment if an alias pattern appears later.
- Carried forward: older admin routes still on local admin closures (vs `requireAdmin`).

### 4. The Next Epoch Roadmap
1. **Integration-test `merge.ts`** — survivor keeps state/activity/claims, loser keys
   removed, no-op when survivorId === loserId, graceful when ids are unknown.
2. **Integration-test `smartlists.ts`** (private vs shared scope, create/list/delete).
3. **Integration-test `notifications.ts`** (add/list ordering + ~100 cap + markRead).
4. **Finish authz consolidation:** migrate remaining older admin routes to shared
   `requireAdmin` (per-method care for `broadcast`'s open GET).
5. **Extract a shared test helper** (`isolatedRedis()` setup/teardown) to de-duplicate
   the temp-store boilerplate now repeated across tasks/tags tests.

---

## Epoch 5 — 2026-06-20
- Fixed `LocalRedis` missing 5 commands (`hget`/`hdel`/`rpush`/`zrem`/`exists`) that
  silently threw in local dev; added `__resetLocalRedis()` + `tasks.test.ts` (6). 177 → 183.

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
