"use client";

import { useEffect, useState } from "react";
import {
  BookingConfirmation,
  BookingConfirmationMissing,
} from "@/components/booking-confirmation";
import { loadBookingReceiptClient } from "@/lib/booking-receipt";
import type { BookingWithDetails } from "@/lib/types";

export function BookingConfirmationClient({ id }: { id: string }) {
  const [booking, setBooking] = useState<
    BookingWithDetails | null | undefined
  >(undefined);

  useEffect(() => {
    setBooking(loadBookingReceiptClient(id));
  }, [id]);

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
