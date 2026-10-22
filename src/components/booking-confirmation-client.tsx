"use client";

import { useSyncExternalStore } from "react";
import {
  BookingConfirmation,
  BookingConfirmationMissing,
} from "@/components/booking-confirmation";
import { loadBookingReceiptClient } from "@/lib/booking-receipt";
import type { BookingWithDetails } from "@/lib/types";

function subscribeToBookingReceipt() {
  return () => {};
}

const receiptSnapshots = new Map<string, BookingWithDetails | null>();

function readBookingReceiptSnapshot(id: string): BookingWithDetails | null {
  const cached = receiptSnapshots.get(id);
  if (cached !== undefined) return cached;
  const booking = loadBookingReceiptClient(id);
  receiptSnapshots.set(id, booking);
  return booking;
}

export function BookingConfirmationClient({ id }: { id: string }) {
  const booking = useSyncExternalStore(
    subscribeToBookingReceipt,
    () => readBookingReceiptSnapshot(id),
    () => undefined,
  );

  if (booking === undefined) {
    return (
      <div className="pt-24">
        <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
          <p className="text-sm text-[var(--brand-ink)]/55">
            Loading confirmation…
          </p>
        </div>
      </div>
    );
  }

  if (!booking || booking.status === "cancelled") {
    return <BookingConfirmationMissing id={id} />;
  }

  return <BookingConfirmation booking={booking} />;
}
