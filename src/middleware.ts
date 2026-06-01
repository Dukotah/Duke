import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/session";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const isApiRoute = pathname.startsWith("/api/crm/");

  // Public CRM routes
  if (pathname.startsWith("/crm/login")) return NextResponse.next();

  const token = req.cookies.get("crm_session")?.value;
    const secret = process.env.SESSION_SECRET;

  if (!secret || !token) {
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

  // Pass user info to API routes via header
  const res = NextResponse.next();
    res.headers.set("x-user-id", session.userId);
    res.headers.set("x-user-role", session.role);
    res.headers.set("x-user-name", session.name);
    return res;
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
