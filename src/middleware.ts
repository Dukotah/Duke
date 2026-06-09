import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getSessionSecret } from "./lib/session";

export async function middleware(req: NextRequest) {
      const { pathname } = req.nextUrl;
      const isApiRoute = pathname.startsWith("/api/crm/");

  // Public CRM routes
  if (pathname.startsWith("/crm/login")) return NextResponse.next();
  if (pathname.startsWith("/api/crm/login")) return NextResponse.next();
  if (pathname.startsWith("/api/crm/logout")) return NextResponse.next();
  // Resend delivery-event webhook — must be public (no session cookie). It is
  // authenticated by its Svix signature inside the route handler, not by the
  // CRM session, so it has to bypass the auth gate like login/logout do.
  if (pathname.startsWith("/api/crm/email-events")) return NextResponse.next();

  const token = req.cookies.get("crm_session")?.value;
  const secret = getSessionSecret();

  if (!token) {
          if (isApiRoute) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
          return redirectToLogin(req);
  }

  const session = await verifyToken(token, secret);
      if (!session) {
              if (isApiRoute) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
              return redirectToLogin(req);
      }

  // Admin-only routes
  if (pathname.startsWith("/crm/admin") && session.role !== "admin") {
          const url = req.nextUrl.clone();
          url.pathname = "/crm";
          return NextResponse.redirect(url);
  }

  // Pass user info via request headers (so API routes can read them)
  const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", session.userId);
      requestHeaders.set("x-user-role", session.role);
      requestHeaders.set("x-user-name", session.name);

  return NextResponse.next({
          request: { headers: requestHeaders },
  });
}

function redirectToLogin(req: NextRequest) {
      const login = req.nextUrl.clone();
      login.pathname = "/crm/login";
      login.searchParams.set("from", req.nextUrl.pathname);
      return NextResponse.redirect(login);
}

export const config = {
      matcher: ["/crm", "/crm/:path*", "/api/crm/:path*"],
};
