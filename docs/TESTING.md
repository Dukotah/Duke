# Testing the CRM

The CRM is tested with **vitest** (`npm test`). Tests live next to the code as
`*.test.ts`. There are three layers:

1. **Pure-logic tests** — no I/O. e.g. `lib/crm/automation.test.ts` (`validateRules`),
   `api/crm/leads/route.test.ts` (`parseCSVLine`), `lib/crm/merge.test.ts` (normalizers).
2. **Redis-backed lib tests** — exercise the storage helpers against the file-backed
   `LocalRedis` (no Upstash needed). e.g. `lib/crm/{tasks,tags,merge,smartlists,
   notifications,sequenceConfig}.test.ts`.
3. **Route-handler tests** — drive an exported route handler with a real `NextRequest`
   and assert the HTTP contract (401 / 403 / 400 / 2xx). e.g.
   `api/crm/custom-leads/route.test.ts`, `api/crm/admin/outreach/route.test.ts`.

## Isolated Redis for integration tests

Any test that touches Redis must isolate its store so it never pollutes the dev
`.local-db.json`. Call the shared helper **once** at the top of the suite:

```ts
import { setupIsolatedRedis } from "@/lib/crm/testRedis";

setupIsolatedRedis("my-label"); // points LocalRedis at an isolated temp file,
                                // flushes every key before each test, cleans up after
```

It registers `beforeAll`/`beforeEach`/`afterAll` (via `LOCAL_DB_FILE` +
`__resetLocalRedis()`). Use a unique `label` per suite. Don't prefix helpers with
`use*` — that trips `react-hooks/rules-of-hooks` (hence `setupIsolatedRedis`, not
`useIsolatedRedis`).

> Reminder: when app code calls a Redis command, `LocalRedis` must implement it.
> `lib/localRedis.test.ts` is a parity guard that scans `src/**` for `redis.<m>(` /
> `getRedis().<m>(` calls and fails if any method is missing — add it to `LocalRedis`
> rather than working around it.

## Route-handler pattern

Import the handler(s) and build a `NextRequest` with the headers the middleware would
normally inject (`x-user-id`, `x-user-role`):

```ts
import { NextRequest } from "next/server";
import { GET, POST } from "./route";

function makeReq(method: string, { userId, role, body }: { userId?: string; role?: string; body?: unknown } = {}) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (userId) headers["x-user-id"] = userId;
  if (role) headers["x-user-role"] = role;
  return new NextRequest("http://localhost/api/crm/...", {
    method,
    headers,
    body: body === undefined ? undefined : typeof body === "string" ? body : JSON.stringify(body),
  });
}

const res = await POST(makeReq("POST", { userId: "u1", body: { name: "Acme" } }));
expect(res.status).toBe(201);
expect(await res.json()).toMatchObject({ name: "Acme" });
```

Auth headers are injected by `src/middleware.ts` in production; tests set them directly.
Admin-only API routes enforce `requireAdmin(req)` themselves (the `/crm/admin` page
redirect does not cover `/api/crm/*`), so assert the `403` path with no `x-user-role:
admin`.

## Gates

Before committing, run: `npm test` (vitest) · `npx tsc --noEmit` · `npx next build`.
All three must pass with zero regressions.
