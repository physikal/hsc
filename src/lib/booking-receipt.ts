import type { BookingWithDetails } from "./types";

export const BOOKING_RECEIPT_COOKIE_PREFIX = "hco_booking_";
export const BOOKING_RECEIPT_STORAGE_KEY = "hco_last_booking";

export function bookingReceiptCookieName(id: string): string {
  return `${BOOKING_RECEIPT_COOKIE_PREFIX}${id}`;
}

export function encodeBookingReceipt(booking: BookingWithDetails): string {
  return Buffer.from(JSON.stringify(booking), "utf8").toString("base64url");
}

export function decodeBookingReceipt(
  value: string | undefined | null,
): BookingWithDetails | null {
  if (!value) return null;
  try {
    const json = Buffer.from(value, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as BookingWithDetails;
    if (
      !parsed?.id ||
      !parsed?.confirmationCode ||
      !parsed?.hunt ||
      !parsed?.slot
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveBookingReceiptClient(booking: BookingWithDetails): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      BOOKING_RECEIPT_STORAGE_KEY,
      JSON.stringify(booking),
    );
    window.sessionStorage.setItem(
      bookingReceiptCookieName(booking.id),
      JSON.stringify(booking),
    );
  } catch {
    // Ignore quota / private-mode failures; cookie path still covers most cases.
  }
}

export function loadBookingReceiptClient(
  id: string,
): BookingWithDetails | null {
  if (typeof window === "undefined") return null;
  try {
    const byId = window.sessionStorage.getItem(bookingReceiptCookieName(id));
    if (byId) {
      const parsed = JSON.parse(byId) as BookingWithDetails;
      if (parsed?.id === id) return parsed;
    }
    const last = window.sessionStorage.getItem(BOOKING_RECEIPT_STORAGE_KEY);
    if (last) {
      const parsed = JSON.parse(last) as BookingWithDetails;
      if (parsed?.id === id) return parsed;
    }
  } catch {
    return null;
  }
  return null;
}
