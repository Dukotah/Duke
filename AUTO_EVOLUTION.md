# AUTO_EVOLUTION.md

> Long-term memory for the autonomous self-improvement loop on the Copper Bay Tech
> CRM (`duke-crm` worktree, branch `crm-cockpit`). One epoch = one Audit → Execute →
> Verify → Re-Plan cycle. Newest epoch on top.

---

## Epoch 12 — 2026-06-20

### 1. Current Status
Green. **vitest 217 passed (21 files) · tsc 0 · eslint 0 (0 warnings) · next build exit 0.**
Branch ~16 commits ahead of `origin/main`, not pushed. The route layer now has its first
handler-level tests, and the long-standing test gap (handlers untested) is broken open.

### 2. Completed in This Epoch
- **a11y/perf spot-check:** found the `LeadPanel` `<img>` is already handled (scoped
  `eslint-disable` + `alt` + `loading="lazy"`, added by the polish armada) and eslint is
  fully clean — **no churn warranted**, so none made.
- **First route-handler tests — `src/app/api/crm/custom-leads/route.test.ts`** (5): drives
  the exported `GET`/`POST` with real `NextRequest` objects and asserts the contract —
  401 without `x-user-id`, 400 on malformed body, 400 on blank name, 201 on create, and
  GET per-user isolation. Confirms `NextRequest` constructs cleanly under vitest, so this
  harness now generalizes to the rest of the route layer. 212 → 217.

### 3. Discovered Debt / Opportunities
- Route-handler testing is now unblocked. Highest next value: assert the **`requireAdmin`
  403 contract** at the handler level (one admin route) and the **outreach POST 400** fix
  from epoch 11 (currently only covered transitively).
- The codebase is in strong shape; remaining work is incremental test breadth + docs.

### 4. The Next Epoch Roadmap
1. **Route-handler test for the admin authz contract:** pick one admin route (e.g.
   `admin/users` or `admin/broadcast`) and assert 403 without `x-user-role: admin`,
   success with it — locking in the `requireAdmin` behavior end-to-end.
2. **Route-handler test for `admin/outreach` POST** — 403 non-admin, 400 on malformed
   body (the epoch-11 hardening), 200 on a valid email.
3. **Add a short testing note** (README/CONTRIBUTING) documenting `setupIsolatedRedis`
   and the NextRequest route-handler pattern for future contributors.
4. **Re-assess:** with security, the LocalRedis bug, full lib coverage, authz unification,
   route-body safety, and initial route-handler tests all done, weigh whether further
   epochs add real value or it's time to pause the loop / consider deploy.

---

## Epoch 11 — 2026-06-20
- Audited route body handling; hardened `admin/outreach` POST (raw req.json → parseJsonBody
  + try/handleApiError). 212 tests.

## Epoch 10 — 2026-06-20
- Finished admin authz consolidation onto shared `requireAdmin` (7 routes). 212 tests.

## Epoch 9 — 2026-06-20
- `notifications.test.ts` + `sequenceConfig.test.ts`. All Redis libs covered. 204 → 212.

## Epoch 8 — 2026-06-20
- `setupIsolatedRedis` helper + `smartlists.test.ts`. 199 → 204.

## Epoch 7 — 2026-06-20
- `merge.test.ts` (9). 190 → 199.

## Epoch 6 — 2026-06-20
- `tags.test.ts` (6) + LocalRedis parity guard. 183 → 190.

## Epoch 5 — 2026-06-20
- Fixed LocalRedis 5 missing commands; `tasks.test.ts` (6). 177 → 183.

## Epoch 4 — 2026-06-20
- Removed orphaned `Pipeline.tsx`; `.gitattributes`; wasted-query drop.

## Epoch 3 — 2026-06-20
- Consolidated automation/merge/sequences authz onto `requireAdmin`.

## Epoch 2 — 2026-06-20
- Extracted `validateRules()` + tests (9). 168 → 177.

## Epoch 1 — 2026-06-20
- `requireAdmin` + guarded analytics routes; `parseCSVLine` tests (8). 160 → 168.
