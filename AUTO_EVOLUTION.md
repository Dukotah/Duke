# AUTO_EVOLUTION.md

> Long-term memory for the autonomous self-improvement loop on the Copper Bay Tech
> CRM (`duke-crm` worktree, branch `crm-cockpit`). One epoch = one Audit → Execute →
> Verify → Re-Plan cycle. Newest epoch on top.

---

## Epoch 16 — 2026-06-20

### 1. Current Status
Green. **vitest 237 passed (25 files) · tsc 0 · eslint 0 · next build exit 0.** Branch
~20 commits ahead of `origin/main`, not pushed. **All originally-planned hardening +
the optional handler-test list are complete.** The CRM is shippable.

### 2. Completed in This Epoch
- **`api/crm/state/route.test.ts`** (4): GET/POST 401 unauth; POST 400 without leadId;
  patch persists + GET reflects it (per-user isolation); the stage-change path fires
  automations safely (`{rulesFired:0, actionsRun:0}`) with no rules and persists the new
  stage. (Confirmed `getLeadState` correctly treats a status-less hash as "no state" —
  not a bug.) 233 → 237.

### 3. Discovered Debt / Opportunities
- No real risk remains. The loop has reached its planned hand-off point. There is still
  **genuine (lower-value) breadth**: ~15 other route handlers (`today`, `tasks`, `tags`,
  `search`, `activity`, `import-leads`, `export`, `sequences`, `automation`, `merge`,
  `notifications`, `smart-lists`, `contacts`, `companies`, `deals`) have no handler-level
  contract tests. Adding them is real regression insurance, not cosmetic churn — but
  marginal value is low. **Recommend pausing the loop and reviewing/deploying.**

### 4. The Next Epoch Roadmap
> ⚑ Owner decision point: hardening is done; the branch is review/deploy-ready. If the
> loop keeps running (per the "use up credits today" directive), continue genuine
> handler-test breadth — otherwise pause + deploy.
1. **Handler tests for the remaining query/mutation routes** — batch a few per epoch
   (e.g. `today`, `tasks`, `tags`, `search`), asserting the 401/400/2xx contract each.
2. **Pause / hand off** whenever the owner is ready to review or deploy `crm-cockpit`.

---

## Epoch 15 — 2026-06-20
- `api/crm/claim/route.test.ts` (5): claim/unclaim, 409 cross-rep guard + admin override,
  403 non-owner unclaim. 228 → 233.

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
