import { emptyAdminLoginRedirect } from "@/lib/empty-admin-redirect";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Internal target for the admin proxy. Next.js turns a proxy/middleware
 * redirect into `res.end(location)`, which puts the URL in the body. This
 * handler is the response clients actually receive: 307, empty body.
 */
function redirect() {
  return emptyAdminLoginRedirect();
}

export const GET = redirect;
export const POST = redirect;
export const PUT = redirect;
export const PATCH = redirect;
export const DELETE = redirect;
export const HEAD = redirect;
export const OPTIONS = redirect;
