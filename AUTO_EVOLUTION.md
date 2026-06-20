# AUTO_EVOLUTION.md

> Long-term memory for the autonomous self-improvement loop on the Copper Bay Tech
> CRM (`duke-crm` worktree, branch `crm-cockpit`). One epoch = one Audit → Execute →
> Verify → Re-Plan cycle. Newest epoch on top.

---

## Epoch 9 — 2026-06-20

### 1. Current Status
Green. **vitest 212 passed (20 files) · tsc 0 · eslint 0 · next build exit 0.** Branch
~13 commits ahead of `origin/main`, not pushed. **Every Redis-backed CRM lib now has
integration coverage** (tasks, tags, merge, smartlists, notifications, sequenceConfig)
+ a parity guard + a pure-logic validator/parser suite.

### 2. Completed in This Epoch
- **`src/lib/crm/notifications.test.ts`** (4): newest-first add with optional fields
  omitted + unread default; the 100-entry cap (newest retained, oldest trimmed);
  mark-one-read-by-id; mark-all-read via `__all__` with order preserved.
- **`src/lib/crm/sequenceConfig.test.ts`** (4): default `SEQUENCE` when unset; persisted
  override round-trip; fallback to default on an empty saved array; fallback on a
  corrupt stored value. 204 → 212.

### 3. Discovered Debt / Opportunities
- The lib test layer is now comprehensive; the remaining frontier shifts to the **route
  layer** (handlers are largely untested) and finishing the authz cleanup.
- Carried forward: older admin routes still on local admin closures (vs `requireAdmin`).

### 4. The Next Epoch Roadmap
1. **Finish authz consolidation:** migrate the older admin routes (`revenue`,
   `submissions`, `users`, `territory`, `admin/health`, `admin/outreach`) to the shared
   `requireAdmin`; for `broadcast`, swap only the POST/DELETE gate and leave GET open.
   One route per edit, verify after each.
2. **Audit `/api/crm/*` mutating routes** for consistent 401 + `parseJsonBody` usage;
   fix any unguarded/over-trusting handler found.
3. **Add a short testing note** (README or CONTRIBUTING) documenting the
   `setupIsolatedRedis` pattern for future lib tests.
4. **Spot-check the client components** for obvious a11y/perf nits the armada may have
   left (e.g., remaining `<img>` vs `next/image`, missing aria-labels on icon buttons).
5. **Re-plan:** with libs + authz solid, consider light route-handler tests (e.g. a
   thin request → response harness) if value/effort holds up.

---

## Epoch 8 — 2026-06-20
- Extracted `setupIsolatedRedis` test helper (`testRedis.ts`); refactored tasks/tags/
  merge onto it; added `smartlists.test.ts` (5). 199 → 204.

## Epoch 7 — 2026-06-20
- `merge.test.ts` (9): normalizers, all guards, end-to-end merge + delete, dedup. 190 → 199.

## Epoch 6 — 2026-06-20
- `tags.test.ts` (6) + `localRedis.test.ts` parity guard. 183 → 190.

## Epoch 5 — 2026-06-20
- Fixed `LocalRedis` missing 5 commands; `__resetLocalRedis()` + `tasks.test.ts` (6). 177 → 183.

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
