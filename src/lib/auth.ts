import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminCredentials,
  getAgentApiKey,
  readBearerToken,
  verifyAdminToken,
  type AdminSession,
} from "@/lib/admin-session";

export {
  ADMIN_SESSION_COOKIE as COOKIE_NAME,
  createAdminSessionToken,
  getAdminCredentials,
  getAgentApiKey,
};
export type { AdminSession };

export type AdminAccess =
  | { type: "admin"; session: AdminSession }
  | { type: "agent" };

export async function setAdminSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSessionCookie() {
  const jar = await cookies();
  jar.delete(ADMIN_SESSION_COOKIE);
}

export async function getAdminSessionFromCookies() {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function getBearerToken(req: NextRequest): string | null {
  return readBearerToken(req.headers.get("authorization"));
}

export async function requireAdminOrAgent(
  req: NextRequest,
): Promise<AdminAccess | null> {
  const agentKey = getAgentApiKey();
  const bearer = getBearerToken(req);
  if (bearer && bearer === agentKey) {
    return { type: "agent" };
  }

  const cookieToken = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (cookieToken) {
    const session = await verifyAdminToken(cookieToken);
    if (session) return { type: "admin", session };
  }

  return null;
}

/**
 * Page and layout guard. Redirects to the login page before the caller
 * fetches any admin data. Pass a request to guard a route handler: that
 * form returns 401 JSON (or an admin/agent principal) and does not redirect.
 */
export async function requireAdmin(): Promise<AdminSession>;
export async function requireAdmin(
  req: NextRequest,
): Promise<AdminAccess | NextResponse>;
export async function requireAdmin(
  req?: NextRequest,
): Promise<AdminSession | AdminAccess | NextResponse> {
  if (req) {
    const auth = await requireAdminOrAgent(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return auth;
  }

  const session = await getAdminSessionFromCookies();
  if (!session) redirect("/admin/login");
  return session;
}
