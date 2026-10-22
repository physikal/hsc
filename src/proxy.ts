import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminToken,
} from "@/lib/admin-session";

/**
 * Next.js 16 proxy — the middleware file convention. It runs before App
 * Router rendering, so a logged-out /admin request never fetches or streams
 * dashboard data into the redirect body.
 * /admin/login and anything under it (including login assets) stay public.
 */
function isAdminLoginPath(pathname: string) {
  return pathname === "/admin/login" || pathname.startsWith("/admin/login/");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isAdminLoginPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifyAdminToken(token) : null;
  if (session) return NextResponse.next();

  return NextResponse.redirect(new URL("/admin/login", request.url), 307);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
