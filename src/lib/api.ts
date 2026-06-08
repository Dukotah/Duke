// Shared helpers for API route handlers: safe JSON parsing and consistent
// error responses. Codifies the patterns already used across the route
// handlers so every route fails the same way — with a proper status code and
// without ever leaking a stack trace to the client.
import { NextResponse } from "next/server";
import { reportError } from "@/lib/log";

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
 * Turn an unexpected error into a safe 500 response. Logs the full error
 * server-side (for debugging) but only ever returns a generic message to the
 * client — never a stack trace or internal detail.
 */
export function handleApiError(context: string, err: unknown): NextResponse {
  reportError(`api/${context}`, err);
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}
