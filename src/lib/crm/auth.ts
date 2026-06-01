import { NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";

// Shared-token gate for admin/CRM endpoints. This is intentionally simple —
// see ROADMAP Phase 1 for moving /admin/crm behind real auth (NextAuth/Clerk).
//
// Accepts the token via `Authorization: Bearer <token>`, an `x-crm-token`
// header, or a `token` query param (handy for the open-in-browser dashboard).
export function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.CRM_ADMIN_TOKEN;
  // Fail closed: if no token is configured, admin endpoints are disabled.
  if (!expected) return false;

  const auth = req.headers.get("authorization");
  const bearer = auth?.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : undefined;
  const provided =
    bearer ||
    req.headers.get("x-crm-token") ||
    req.nextUrl.searchParams.get("token") ||
    "";

  return safeEqual(provided, expected);
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}
