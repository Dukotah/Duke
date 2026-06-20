// Shared helpers for API route handlers: safe JSON parsing, admin gating, and
// consistent error responses. Codifies the patterns already used across the
// route handlers so every route fails the same way — with a proper status code
// and without ever leaking a stack trace to the client.
import { NextRequest, NextResponse } from "next/server";

// Result of attempting to read a JSON request body.
type JsonParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; response: NextResponse };

/**
 * Safely read and parse a JSON request body.
 *
 * A malformed or empty body throws inside `req.json()`; left unguarded that
 * surfaces as an unhandled 500. This returns a discriminated result instead so
 * callers can short-circuit with a clean `400 Invalid JSON`:
 *
 *   const parsed = await parseJsonBody<MyBody>(req);
 *   if (!parsed.ok) return parsed.response;
 *   const { ... } = parsed.data;
 */
export async function parseJsonBody<T = unknown>(
  req: Request,
): Promise<JsonParseResult<T>> {
  try {
    const data = (await req.json()) as T;
    // `null` is valid JSON but never a usable body for these routes; treat it
    // the same as a malformed payload so downstream destructuring is safe.
    if (data === null || typeof data !== "object") {
      return {
        ok: false,
        response: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }),
      };
    }
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }),
    };
  }
}

/**
 * Admin-only gate for route handlers. `src/middleware.ts` injects the CRM
 * session role as the `x-user-role` header on every authenticated request, so
 * routes can trust it. Returns a `403 Forbidden` response when the caller is
 * not an admin, or `null` when access is allowed:
 *
 *   const denied = requireAdmin(req);
 *   if (denied) return denied;
 *
 * Note: `/api/crm/*` is only session-gated by middleware (the admin redirect
 * applies to the `/crm/admin` page path, not the API), so genuinely admin-only
 * endpoints must call this themselves.
 */
export function requireAdmin(req: NextRequest): NextResponse | null {
  if (req.headers.get("x-user-role") !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

/**
 * Turn an unexpected error into a safe 500 response. Logs the full error
 * server-side (for debugging) but only ever returns a generic message to the
 * client — never a stack trace or internal detail.
 */
export function handleApiError(context: string, err: unknown): NextResponse {
  console.error(`[api] ${context}:`, err);
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}
