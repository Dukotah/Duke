# AUTO_EVOLUTION.md

> Long-term memory for the autonomous self-improvement loop on the Copper Bay Tech
> CRM (`duke-crm` worktree, branch `crm-cockpit`). One epoch = one Audit → Execute →
> Verify → Re-Plan cycle. Newest epoch on top.

---

## Epoch 13 — 2026-06-20

### 1. Current Status
Green. **vitest 223 passed (22 files) · tsc 0 · eslint 0 · next build exit 0.** Branch
~17 commits ahead of `origin/main`, not pushed. **The major hardening arc is complete**
— security gating, the LocalRedis bug fix, full Redis-lib coverage, authz unification,
route-body safety, and now route-handler contract tests (per-user + admin gate), with a
testing guide for contributors.

### 2. Completed in This Epoch
- **Admin route-handler tests — `api/crm/admin/outreach/route.test.ts`** (6): GET/POST
  return `403` without `x-user-role: admin`; GET `200` for admin; POST `400` on a
  malformed body (locks the epoch-11 hardening end-to-end), `400` on an invalid email,
  `200` + normalized email on success, then verified the address appears in the
  suppression list. This pins the `requireAdmin` contract at the handler level.
- **`docs/TESTING.md`** — documents the three test layers, the `setupIsolatedRedis`
  isolation helper (+ the `use*`-prefix lint caveat), the `NextRequest` route-handler
  pattern, the LocalRedis parity guard, and the commit gates. 217 → 223.

### 3. Discovered Debt / Opportunities
- No high-value debt remains. The fast-armada risks have all been retired and the test
  pyramid now spans pure logic → Redis libs → route handlers.
- Remaining work is **optional breadth**: handler tests for other mutating routes
  (`bulk`, `claim`, `state`, `tasks`, `tags`) — low risk, incremental confidence, but
  diminishing returns.

### 4. The Next Epoch Roadmap
> NOTE: the CRM is in strong, shippable shape. Further epochs add incremental test
> breadth rather than addressing real risk — a natural point to pause the loop and/or
> deploy. If continuing:
1. **Handler test for `/api/crm/bulk`** — 401 unauth, validates `{leadIds, action}`,
   applies a simple action (e.g. `setStage`) and reflects it in lead state.
2. **Handler test for `/api/crm/claim`** — claim/unclaim flow + cross-rep claim guard.
3. **Handler test for `/api/crm/state`** — the stage-change path that fires automations
   (assert it doesn't throw with no rules configured).
4. **Then pause / hand off** — surface to the owner that the hardening is done and the
   branch is ready to review or deploy.

---

## Epoch 12 — 2026-06-20
- First route-handler tests (`custom-leads`): 401/400/201 + per-user isolation via real
  NextRequest. 212 → 217.

## Epoch 11 — 2026-06-20
- Hardened `admin/outreach` POST body parsing (raw req.json → parseJsonBody). 212 tests.

## Epoch 10 — 2026-06-20
- Finished admin authz consolidation onto shared `requireAdmin` (7 routes).

## Epoch 9 — 2026-06-20
- `notifications` + `sequenceConfig` tests. All Redis libs covered. 204 → 212.

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
