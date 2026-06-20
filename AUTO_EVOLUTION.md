# AUTO_EVOLUTION.md

> Long-term memory for the autonomous self-improvement loop on the Copper Bay Tech
> CRM (`duke-crm` worktree, branch `crm-cockpit`). One epoch = one Audit → Execute →
> Verify → Re-Plan cycle. Newest epoch on top.

---

## Epoch 15 — 2026-06-20

### 1. Current Status
Green. **vitest 233 passed (24 files) · tsc 0 · eslint 0 · next build exit 0.** Branch
~19 commits ahead of `origin/main`, not pushed. Route-handler coverage now spans a
per-user route, an admin-gated route, a bulk-mutation route, and the claim/cross-rep flow.

### 2. Completed in This Epoch
- **`api/crm/claim/route.test.ts`** (5): 401 unauth; 400 missing leadId/action (POST) +
  missing leadId (GET); claim then GET reflects it; the cross-rep guard (409) with admin
  override; owner-only unclaim (403 for a non-owner). 228 → 233.

### 3. Discovered Debt / Opportunities
- None of real risk. Only `/api/crm/state` remains on the optional handler-test list.

### 4. The Next Epoch Roadmap
> The CRM is shippable; remaining items are optional. Natural pause/deploy point.
1. **Handler test for `/api/crm/state`** — persists a per-user patch; the stage-change
   path runs automations without throwing when no rules are configured.
2. **Then pause / hand off** — surface to the owner that hardening + handler coverage are
   done and the branch is ready to review or deploy.

---

## Epoch 14 — 2026-06-20
- `api/crm/bulk/route.test.ts` (5): auth/validation + setStage mutates per-user state. 223 → 228.

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
