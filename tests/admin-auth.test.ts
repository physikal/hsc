import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { readdirSync, readFileSync, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { after, before, describe, test } from "node:test";
import { SignJWT } from "jose";

const repoRoot = path.resolve(import.meta.dirname, "..");
const port = Number(process.env.ADMIN_AUTH_TEST_PORT || 43921);
const serverMode = process.env.ADMIN_AUTH_TEST_SERVER === "start" ? "start" : "dev";

const PROTECTED_PAGES = [
  "/admin",
  "/admin/dashboard",
  "/admin/bookings",
  "/admin/hunts",
] as const;

const DASHBOARD_RENDER_MARKERS = [
  "Recent bookings",
  "Upcoming slots",
  "Manage hunt packages, availability slots, and guest bookings.",
];

type StoredBooking = {
  id?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  confirmationCode?: string;
};

type HttpResult = {
  status: number;
  location: string;
  body: string;
};

const REDIRECT_OR_DENIED = new Set([301, 302, 303, 307, 308, 401]);

let child: ChildProcess | undefined;
let serverLog = "";

function redact(text: string) {
  return text
    .replace(/am_[A-Za-z0-9_-]+/g, "am_[redacted]")
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/AGENT_API_KEY=\S+/g, "AGENT_API_KEY=[redacted]")
    .replace(/ADMIN_SESSION_SECRET=\S+/g, "ADMIN_SESSION_SECRET=[redacted]")
    .replace(/ADMIN_PASSWORD=\S+/g, "ADMIN_PASSWORD=[redacted]");
}

function sessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    "hco-dev-secret-change-me-in-production"
  );
}

function agentApiKey() {
  return process.env.AGENT_API_KEY || "hco-agent-dev-key";
}

type StoredStore = {
  bookings?: StoredBooking[];
  hunts?: Array<{ id?: string }>;
  slots?: Array<{ id?: string }>;
};

function loadStore(): StoredStore {
  const raw = readFileSync(path.join(repoRoot, "data/store.json"), "utf8");
  return JSON.parse(raw) as StoredStore;
}

function loadBookings(): StoredBooking[] {
  return loadStore().bookings ?? [];
}

function leakLabel(body: string, bookings: StoredBooking[]) {
  const fields: Array<[string, string | undefined]> = [];
  for (const booking of bookings) {
    fields.push(
      ["bookingId", booking.id],
      ["guestName", booking.guestName],
      ["guestEmail", booking.guestEmail],
      ["guestPhone", booking.guestPhone],
      ["confirmationCode", booking.confirmationCode],
    );
  }
  for (const [label, value] of fields) {
    if (!value || value.trim().length < 4) continue;
    if (body.includes(value)) return label;
  }
  return null;
}

function request(
  method: string,
  requestPath: string,
  init?: { cookie?: string; body?: string; headers?: Record<string, string> },
): Promise<HttpResult> {
  return new Promise((resolve, reject) => {
    const body = init?.body;
    const headers: Record<string, string> = {
      ...(init?.headers ?? {}),
    };
    if (init?.cookie) headers.cookie = init.cookie;
    if (body !== undefined) {
      headers["content-type"] = headers["content-type"] ?? "application/json";
      headers["content-length"] = String(Buffer.byteLength(body));
    }
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path: requestPath,
        method,
        headers,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          const locationHeader = res.headers.location;
          const location = Array.isArray(locationHeader)
            ? locationHeader.join(",")
            : (locationHeader ?? "");
          resolve({
            status: res.statusCode ?? 0,
            location,
            body: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );
    req.on("error", reject);
    if (body !== undefined) req.write(body);
    req.end();
  });
}

async function adminCookie() {
  const token = await new SignJWT({ role: "admin", username: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(sessionSecret()));
  return `hco_admin_session=${token}`;
}

function assertNoBookingData(result: HttpResult, label: string, bookings: StoredBooking[]) {
  const leak = leakLabel(result.body, bookings);
  assert.equal(
    leak,
    null,
    `${label} body contains ${leak ?? "booking/guest data"} (status ${result.status}, ${result.body.length} bytes)`,
  );
}

function walkTs(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git") continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walkTs(full, out);
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

async function waitForServer() {
  const deadline = Date.now() + 120_000;
  let lastError = "no response";
  while (Date.now() < deadline) {
    if (child?.exitCode !== null && child?.exitCode !== undefined) {
      throw new Error(
        `next ${serverMode} exited ${child.exitCode} before ready\n${redact(serverLog).slice(-4000)}`,
      );
    }
    try {
      const res = await request("GET", "/admin/login");
      if (res.status === 200) return;
      lastError = `status ${res.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : "request failed";
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(
    `timed out waiting for /admin/login (${lastError})\n${redact(serverLog).slice(-4000)}`,
  );
}

describe("admin auth source guards", () => {
  test("every admin page except login calls requireAdmin before rendering", () => {
    const pages = [
      "src/app/admin/page.tsx",
      "src/app/admin/(desk)/layout.tsx",
      "src/app/admin/(desk)/dashboard/page.tsx",
      "src/app/admin/(desk)/bookings/page.tsx",
      "src/app/admin/(desk)/hunts/page.tsx",
    ];
    for (const relative of pages) {
      const source = readFileSync(path.join(repoRoot, relative), "utf8");
      assert.match(source, /requireAdmin\(/, `${relative} must call requireAdmin()`);
    }
    const login = readFileSync(
      path.join(repoRoot, "src/app/admin/login/page.tsx"),
      "utf8",
    );
    assert.equal(login.includes("requireAdmin"), false);

    const dashboard = readFileSync(
      path.join(repoRoot, "src/app/admin/(desk)/dashboard/page.tsx"),
      "utf8",
    );
    assert.ok(
      dashboard.indexOf("requireAdmin(") < dashboard.indexOf("listBookings("),
      "dashboard must authorize before listBookings",
    );

    const bookingRoute = readFileSync(
      path.join(repoRoot, "src/app/api/bookings/[id]/route.ts"),
      "utf8",
    );
    assert.ok(
      bookingRoute.indexOf("requireAdmin(") < bookingRoute.indexOf("getBooking("),
      "GET /api/bookings/[id] must authorize before getBooking",
    );
  });

  test("server actions re-check requireAdmin", () => {
    const files = walkTs(path.join(repoRoot, "src"));
    const offenders: string[] = [];
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      const isServerAction = source
        .split("\n")
        .some((line) => /^["']use server["'];?\s*$/.test(line.trim()));
      if (isServerAction && !source.includes("requireAdmin(")) {
        offenders.push(path.relative(repoRoot, file));
      }
    }
    assert.deepEqual(offenders, []);
  });
});

describe("logged-out admin responses", { concurrency: 1 }, () => {
  before(async () => {
    const nextBin = path.join(repoRoot, "node_modules/next/dist/bin/next");
    const args =
      serverMode === "start"
        ? [nextBin, "start", "--port", String(port)]
        : [nextBin, "dev", "--port", String(port)];
    child = spawn(process.execPath, args, {
      cwd: repoRoot,
      env: {
        ...process.env,
        PORT: String(port),
        ...(serverMode === "start" ? { NODE_ENV: "production" } : {}),
      },
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const append = (chunk: Buffer) => {
      serverLog = (serverLog + chunk.toString("utf8")).slice(-20_000);
    };
    child.stdout?.on("data", append);
    child.stderr?.on("data", append);
    await waitForServer();
  });

  after(async () => {
    if (!child?.pid) return;
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {
      child.kill("SIGTERM");
    }
    if (child.exitCode === null) {
      await Promise.race([
        once(child, "exit"),
        new Promise((resolve) => setTimeout(resolve, 5_000)),
      ]);
    }
  });

  test("logged-out admin pages redirect or 401 with no booking or guest data", async () => {
    const bookings = loadBookings();
    assert.ok(bookings.length > 0, "store must contain bookings so the leak check is real");

    for (const page of PROTECTED_PAGES) {
      for (const headers of [
        undefined,
        { RSC: "1", Accept: "text/x-component" },
      ]) {
        const result = await request("GET", page, { headers });
        const label = `GET ${page}${headers ? " (rsc)" : ""}`;
        assert.ok(
          REDIRECT_OR_DENIED.has(result.status),
          `${label} returned ${result.status} location=${result.location} bytes=${result.body.length}`,
        );
        if (result.status !== 401) {
          assert.match(result.location, /\/admin\/login/);
        }
        assertNoBookingData(result, label, bookings);
        if (page === "/admin/dashboard") {
          for (const marker of DASHBOARD_RENDER_MARKERS) {
            assert.equal(
              result.body.includes(marker),
              false,
              `${label} still rendered the dashboard`,
            );
          }
        }
      }
    }
  });

  test("login page and login assets stay public and contain no booking data", async () => {
    const bookings = loadBookings();
    const login = await request("GET", "/admin/login");
    assert.equal(login.status, 200, `login status ${login.status}`);
    assert.equal(login.location, "");
    assertNoBookingData(login, "GET /admin/login", bookings);

    const asset = await request("GET", "/admin/login/logo.png");
    assert.ok(
      !REDIRECT_OR_DENIED.has(asset.status) || asset.status === 404,
      `login asset was auth-gated with ${asset.status}`,
    );
    assert.notEqual(asset.status, 307);
    assert.notEqual(asset.status, 302);
    assertNoBookingData(asset, "GET /admin/login/logo.png", bookings);
  });

  test("invalid admin cookie still cannot read admin pages", async () => {
    const bookings = loadBookings();
    const result = await request("GET", "/admin/dashboard", {
      cookie: "hco_admin_session=not-a-valid-token",
    });
    assert.ok(REDIRECT_OR_DENIED.has(result.status));
    assertNoBookingData(result, "GET /admin/dashboard invalid cookie", bookings);
  });

  test("logged-out admin APIs return 401 without booking or guest data", async () => {
    const bookings = loadBookings();
    const bookingId = encodeURIComponent(bookings[0]?.id || "book_missing");
    const cases: Array<[string, string, string?]> = [
      ["GET", "/api/bookings"],
      ["GET", "/api/bookings?includeCancelled=true"],
      ["GET", `/api/bookings/${bookingId}`],
      ["PATCH", `/api/bookings/${bookingId}`, JSON.stringify({ status: "cancelled" })],
      ["GET", "/api/hunts?includeCancelled=true"],
      ["POST", "/api/hunts", "{}"],
      ["PATCH", "/api/hunts/hunt_rv_15", "{}"],
      ["DELETE", "/api/hunts/hunt_rv_15"],
      ["GET", "/api/slots?includeCancelled=true"],
      ["POST", "/api/slots", "{}"],
      ["PATCH", "/api/slots/slot_1", "{}"],
      ["DELETE", "/api/slots/slot_1"],
      ["GET", "/api/auth/me"],
    ];

    for (const [method, requestPath, body] of cases) {
      const result = await request(method, requestPath, { body });
      assert.equal(
        result.status,
        401,
        `${method} ${requestPath} returned ${result.status} (${result.body.length} bytes)`,
      );
      assertNoBookingData(result, `${method} ${requestPath}`, bookings);
    }
  });

  test("public catalog and home page do not include booking or guest data", async () => {
    const store = loadStore();
    const bookings = store.bookings ?? [];
    const huntId = store.hunts?.find((hunt) => hunt.id)?.id ?? "hunt_missing";
    const slotId = store.slots?.find((slot) => slot.id)?.id ?? "slot_missing";
    for (const requestPath of [
      "/",
      "/api/hunts",
      `/api/hunts/${encodeURIComponent(huntId)}`,
      "/api/slots?availableOnly=true",
      `/api/slots/${encodeURIComponent(slotId)}`,
    ]) {
      const result = await request("GET", requestPath);
      assert.equal(
        result.status,
        200,
        `GET ${requestPath} returned ${result.status}`,
      );
      assertNoBookingData(result, `GET ${requestPath}`, bookings);
    }

    const logout = await request("POST", "/api/auth/logout");
    assert.equal(logout.status, 200);
    assertNoBookingData(logout, "POST /api/auth/logout", bookings);
  });

  test("authenticated admin session can load the dashboard", async () => {
    const bookings = loadBookings();
    const cookie = await adminCookie();
    const dashboard = await request("GET", "/admin/dashboard", { cookie });
    assert.equal(
      dashboard.status,
      200,
      `authenticated dashboard status ${dashboard.status} location=${dashboard.location} bytes=${dashboard.body.length}`,
    );
    assert.equal(
      DASHBOARD_RENDER_MARKERS.every((marker) => dashboard.body.includes(marker)),
      true,
      "authenticated dashboard did not render",
    );
    const sawGuest = bookings.some(
      (booking) => booking.guestName && dashboard.body.includes(booking.guestName),
    );
    assert.equal(sawGuest, true, "authenticated dashboard did not include a guest name");

    const listed = await request("GET", "/api/bookings?includeCancelled=true", {
      cookie,
    });
    assert.equal(listed.status, 200, `admin bookings API status ${listed.status}`);
    const sawId = bookings.some(
      (booking) => booking.id && listed.body.includes(booking.id),
    );
    assert.equal(sawId, true, "admin bookings API did not return booking ids");

    const asAgent = await request("GET", "/api/bookings", {
      headers: { authorization: `Bearer ${agentApiKey()}` },
    });
    assert.equal(asAgent.status, 200, `agent bookings API status ${asAgent.status}`);
  });
});
