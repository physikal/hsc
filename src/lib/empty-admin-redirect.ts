import { NextResponse } from "next/server";

/** 307 to the login page with no response body. */
export function emptyAdminLoginRedirect() {
  return new NextResponse(null, {
    status: 307,
    headers: {
      Location: "/admin/login",
      "Cache-Control": "private, no-store",
      "Content-Length": "0",
    },
  });
}
