import { AgentMailClient } from "agentmail";
import type { BookingWithDetails } from "@/lib/types";

export type ContactNotifyInput = {
  name: string;
  email: string;
  message: string;
};

function requiredEnv(name: string): string | null {
  const value = process.env[name]?.trim();
  return value || null;
}

/** Destination inbox Josh's agent watches (must receive as received/unread). */
export const DEFAULT_AGENT_INBOX = "jjammer@physhlab.com";
/**
 * From-inbox for app notifies. MUST differ from the agent inbox — send-to-self
 * lands with labels `sent` (not `received`/`unread`) and agent watchers miss it.
 * Prefer Josh-org `hsc-notify@physhlab.com`; `hscapp2@agentmail.to` also works
 * with the HSC service-org API key.
 */
export const DEFAULT_NOTIFY_INBOX = "hsc-notify@physhlab.com";

export function getAgentMailConfig() {
  const apiKey = requiredEnv("AGENTMAIL_API_KEY");
  if (!apiKey) {
    return null;
  }
  const agentInbox =
    requiredEnv("AGENTMAIL_AGENT_INBOX") ?? DEFAULT_AGENT_INBOX;
  let notifyInbox =
    requiredEnv("AGENTMAIL_NOTIFY_INBOX") ?? DEFAULT_NOTIFY_INBOX;
  // Guard: never From==To — that produces `sent` not `received`/`unread`.
  if (notifyInbox.toLowerCase() === agentInbox.toLowerCase()) {
    console.warn(
      `[agentmail] AGENTMAIL_NOTIFY_INBOX matched agent inbox (${notifyInbox}); using ${DEFAULT_NOTIFY_INBOX} so mail arrives as received/unread`,
    );
    notifyInbox = DEFAULT_NOTIFY_INBOX;
  }
  return { apiKey, notifyInbox, agentInbox };
}

function siteSource(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (!url) return "https://hsc-physikals-projects.vercel.app";
  return url.startsWith("http") ? url : `https://${url}`;
}

function getClient(apiKey: string) {
  return new AgentMailClient({ apiKey });
}

function formatContactBody(input: ContactNotifyInput) {
  const payload = {
    type: "contact" as const,
    source: siteSource(),
    customer: {
      name: input.name,
      email: input.email,
    },
    message: input.message,
  };

  const text = [
    "Type: contact",
    `Source: ${payload.source}`,
    "",
    "Customer:",
    `  name: ${input.name}`,
    `  email: ${input.email}`,
    `  message: ${input.message}`,
    "",
    "---json---",
    JSON.stringify(payload),
  ].join("\n");

  return { text, payload };
}

function formatBookingBody(booking: BookingWithDetails) {
  const payload = {
    type: "booking" as const,
    source: siteSource(),
    customer: {
      name: booking.guestName,
      email: booking.guestEmail,
      phone: booking.guestPhone,
    },
    booking: {
      id: booking.id,
      confirmationCode: booking.confirmationCode,
      huntTitle: booking.hunt.title,
      slotStartAt: booking.slot.startAt,
      slotEndAt: booking.slot.endAt,
      partySize: booking.partySize,
      notes: booking.notes ?? null,
      adminUrl: "/admin/bookings",
    },
  };

  const text = [
    "Type: booking",
    `Source: ${payload.source}`,
    "",
    "Customer:",
    `  name: ${booking.guestName}`,
    `  email: ${booking.guestEmail}`,
    `  phone: ${booking.guestPhone}`,
    "",
    "Booking:",
    `  id: ${booking.id}`,
    `  confirmationCode: ${booking.confirmationCode}`,
    `  huntTitle: ${booking.hunt.title}`,
    `  slotStartAt: ${booking.slot.startAt}`,
    `  slotEndAt: ${booking.slot.endAt}`,
    `  partySize: ${booking.partySize}`,
    `  notes: ${booking.notes ?? ""}`,
    `  adminUrl: /admin/bookings`,
    "",
    "---json---",
    JSON.stringify(payload),
  ].join("\n");

  return { text, payload };
}

export async function notifyContactSubmission(
  input: ContactNotifyInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const config = getAgentMailConfig();
  if (!config) {
    return {
      ok: false,
      error:
        "AgentMail is not configured (set AGENTMAIL_API_KEY; defaults: NOTIFY=hsc-notify@physhlab.com, AGENT=jjammer@physhlab.com).",
    };
  }

  const { text } = formatContactBody(input);
  try {
    const client = getClient(config.apiKey);
    await client.inboxes.messages.send(config.notifyInbox, {
      to: [config.agentInbox],
      replyTo: [input.email],
      subject: `[HSC Contact] ${input.name} <${input.email}>`,
      text,
      labels: ["hsc", "contact"],
    });
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send AgentMail notify";
    console.error("[agentmail] contact notify failed:", message);
    return { ok: false, error: message };
  }
}

export async function notifyBookingCreated(
  booking: BookingWithDetails,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const config = getAgentMailConfig();
  if (!config) {
    return {
      ok: false,
      error:
        "AgentMail is not configured (set AGENTMAIL_API_KEY; defaults: NOTIFY=hsc-notify@physhlab.com, AGENT=jjammer@physhlab.com).",
    };
  }

  const { text } = formatBookingBody(booking);
  try {
    const client = getClient(config.apiKey);
    await client.inboxes.messages.send(config.notifyInbox, {
      to: [config.agentInbox],
      replyTo: [booking.guestEmail],
      subject: `[HSC Booking] ${booking.confirmationCode} · ${booking.guestName}`,
      text,
      labels: ["hsc", "booking"],
    });
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send AgentMail notify";
    console.error("[agentmail] booking notify failed:", message);
    return { ok: false, error: message };
  }
}

/** Fire-and-forget wrapper — never throws. */
export function notifyBookingCreatedInBackground(
  booking: BookingWithDetails,
): void {
  void notifyBookingCreated(booking).catch((error) => {
    console.error("[agentmail] booking notify background error:", error);
  });
}
