import { SignJWT, jwtVerify } from "jose";

export const ADMIN_SESSION_COOKIE = "hco_admin_session";

export type AdminSession = { role: string; username: string };

function secretKey() {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    "hco-dev-secret-change-me-in-production";
  return new TextEncoder().encode(secret);
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "horseshoe",
  };
}

export function getAgentApiKey() {
  return process.env.AGENT_API_KEY || "hco-agent-dev-key";
}

export async function createAdminSessionToken(username: string) {
  return new SignJWT({ role: "admin", username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function verifyAdminToken(
  token: string,
): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.role !== "admin" || typeof payload.username !== "string") {
      return null;
    }
    return { role: "admin", username: payload.username };
  } catch {
    return null;
  }
}

export function readBearerToken(authorization: string | null): string | null {
  if (!authorization) return null;
  const [scheme, token] = authorization.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}
