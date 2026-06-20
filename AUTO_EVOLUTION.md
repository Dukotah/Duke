# AUTO_EVOLUTION.md

> Long-term memory for the autonomous self-improvement loop on the Copper Bay Tech
> CRM (`duke-crm` worktree, branch `crm-cockpit`). One epoch = one Audit → Execute →
> Verify → Re-Plan cycle. Newest epoch on top.

---

## Epoch 14 — 2026-06-20

### 1. Current Status
Green. **vitest 228 passed (23 files) · tsc 0 · eslint 0 · next build exit 0.** Branch
~18 commits ahead of `origin/main`, not pushed. Hardening arc complete; now adding
incremental route-handler breadth.

### 2. Completed in This Epoch
- **`api/crm/bulk/route.test.ts`** (5): 401 without auth; 400 on empty/non-array
  `leadIds`; 400 on unknown action; 400 when `setStage` is missing `payload.stage`; and
  the `setStage` success path mutating per-user lead state (count + `getLeadState`
  reflects the new stage) with cross-user isolation. 223 → 228.

### 3. Discovered Debt / Opportunities
- None of real risk. Remaining is optional handler-test breadth (`claim`, `state`,
  `tasks`, `tags`). Each adds incremental confidence only.

### 4. The Next Epoch Roadmap
> The CRM remains shippable; these are optional. A natural point to pause/deploy.
1. **Handler test for `/api/crm/claim`** — claim then unclaim; verify the claim record
   + cross-rep guard (a second rep can't steal an active claim).
2. **Handler test for `/api/crm/state`** — the stage-change path runs automations
   without throwing when no rules are configured; persists the patch per-user.
3. **Then pause / hand off** — flag to the owner that hardening is done; branch ready to
   review or deploy.

---

## Epoch 13 — 2026-06-20
- Admin route-handler tests (`admin/outreach`: 403/400/200) + `docs/TESTING.md`. 217 → 223.

## Epoch 12 — 2026-06-20
- First route-handler tests (`custom-leads`: 401/400/201 + isolation). 212 → 217.

## Epoch 11 — 2026-06-20
- Hardened `admin/outreach` POST body parsing. 212 tests.

## Epoch 10 — 2026-06-20
- Finished admin authz consolidation onto shared `requireAdmin` (7 routes).

## Epoch 9 — 2026-06-20
- `notifications` + `sequenceConfig` tests. All Redis libs covered. 204 → 212.

## Epoch 8 — 2026-06-20
- `setupIsolatedRedis` helper + `smartlists.test.ts`. 199 → 204.

## Epoch 7 — `merge.test.ts` (9). 190 → 199.
## Epoch 6 — `tags.test.ts` (6) + LocalRedis parity guard. 183 → 190.
## Epoch 5 — Fixed LocalRedis 5 missing commands; `tasks.test.ts` (6). 177 → 183.
## Epoch 4 — Removed orphaned `Pipeline.tsx`; `.gitattributes`; wasted-query drop.
## Epoch 3 — Consolidated automation/merge/sequences authz onto `requireAdmin`.
## Epoch 2 — Extracted `validateRules()` + tests (9). 168 → 177.
## Epoch 1 — `requireAdmin` + guarded analytics routes; `parseCSVLine` tests (8). 160 → 168.
