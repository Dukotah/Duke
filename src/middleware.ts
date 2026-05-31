import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/crm/login")) return NextResponse.next();

  const token = req.cookies.get("crm_auth")?.value;
  const expected = process.env.CRM_PASSWORD;

  if (!expected || token !== expected) {
    const login = req.nextUrl.clone();
    login.pathname = "/crm/login";
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/crm", "/crm/:path*"],
};
