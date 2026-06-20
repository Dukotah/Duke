# AUTO_EVOLUTION.md

> Long-term memory for the autonomous self-improvement loop on the Copper Bay Tech
> CRM (`duke-crm` worktree, branch `crm-cockpit`). One epoch = one Audit → Execute →
> Verify → Re-Plan cycle. Newest epoch on top.

---

## Epoch 10 — 2026-06-20

### 1. Current Status
Green. **vitest 212 passed (20 files) · tsc 0 · eslint 0 · next build exit 0.** Branch
~14 commits ahead of `origin/main`, not pushed. **Admin authorization is now fully
consolidated** — every admin-gated API route uses the single `requireAdmin` helper;
the lib layer is fully integration-tested.

### 2. Completed in This Epoch
- **Finished authz consolidation across the older admin routes** — migrated `revenue`,
  `admin/health`, `users`, `submissions`, `territory`, `admin/outreach`, and `broadcast`
  off their per-file `isAdmin`/local-`requireAdmin` closures onto the shared
  `requireAdmin` from `lib/api.ts`. Removed 7 duplicated closures. `broadcast` GET stays
  open (rep dashboard reads it); only its POST/DELETE gate. Pure refactor — 212 tests
  unchanged, build green. There are now **zero** local admin-check closures left in the
  API; one source of truth for the 403 path.

### 3. Discovered Debt / Opportunities
- The two big quality threads (lib tests, authz) are now complete. The remaining
  frontier is the **route-handler layer** (handlers themselves are untested) and a
  **client a11y/perf spot-check** of the armada-built components.
- Net assessment: the highest-risk debt from the fast armada builds has been retired
  (a real LocalRedis bug fixed, security gating unified, all Redis libs covered).
  Future epochs trend toward lower-risk polish — prioritize genuine findings over
  cosmetic churn.

### 4. The Next Epoch Roadmap
1. **Audit `/api/crm/*` non-admin mutating routes** (state, custom-leads, claim,
   activity, bulk, tasks, tags, etc.) for consistent 401 + `parseJsonBody` usage and
   input validation; fix any genuinely unguarded/over-trusting handler (real bugs only,
   no cosmetic churn).
2. **Client a11y/perf spot-check** of the new components — icon-button `aria-label`s,
   the `LeadPanel.tsx:536` `<img>` (decide: `next/image` w/ domain config, or a scoped
   eslint-disable with rationale), and any focus-trap gaps in modals.
3. **Add a short testing note** (README/CONTRIBUTING) for the `setupIsolatedRedis`
   pattern so future lib tests follow it.
4. **Re-assess:** if route-handler tests are high-value, add a thin request→response
   harness for 1–2 critical mutating routes (e.g. `/api/crm/state`).

---

## Epoch 9 — 2026-06-20
- `notifications.test.ts` (4) + `sequenceConfig.test.ts` (4). Every Redis lib now
  integration-covered. 204 → 212.

## Epoch 8 — 2026-06-20
- `setupIsolatedRedis` helper + refactor tasks/tags/merge onto it; `smartlists.test.ts`
  (5). 199 → 204.

## Epoch 7 — 2026-06-20
- `merge.test.ts` (9): normalizers, all guards, end-to-end merge + delete, dedup. 190 → 199.

## Epoch 6 — 2026-06-20
- `tags.test.ts` (6) + `localRedis.test.ts` parity guard. 183 → 190.

## Epoch 5 — 2026-06-20
- Fixed `LocalRedis` missing 5 commands; `__resetLocalRedis()` + `tasks.test.ts` (6). 177 → 183.

## Epoch 4 — 2026-06-20
- Removed orphaned `Pipeline.tsx`; `.gitattributes`; dropped a wasted query in `/api/crm/demos`.

## Epoch 3 — 2026-06-20
- Consolidated `automation`/`merge`/`sequences` authz onto shared `requireAdmin`.

## Epoch 2 — 2026-06-20
- Extracted pure `validateRules()` + `automation.test.ts` (9). 168 → 177.

## Epoch 1 — 2026-06-20
- `requireAdmin(req)` in `lib/api.ts`; guarded `admin/funnel` + `admin/template-stats`;
  `leads/route.test.ts` (8). 160 → 168.
