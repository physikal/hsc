import { cookies } from "next/headers";
import { BookingConfirmation } from "@/components/booking-confirmation";
import { BookingConfirmationClient } from "@/components/booking-confirmation-client";
import {
  bookingReceiptCookieName,
  decodeBookingReceipt,
} from "@/lib/booking-receipt";
import { getBooking } from "@/lib/db";
import type { BookingWithDetails } from "@/lib/types";

export const dynamic = "force-dynamic";

async function resolveBooking(id: string): Promise<BookingWithDetails | null> {
  const fromStore = await getBooking(id);
  if (fromStore && fromStore.status !== "cancelled") return fromStore;

  const cookieStore = await cookies();
  const fromCookie = decodeBookingReceipt(
    cookieStore.get(bookingReceiptCookieName(id))?.value,
  );
  if (fromCookie && fromCookie.id === id && fromCookie.status !== "cancelled") {
    return fromCookie;
  }

  return null;
}

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await resolveBooking(id);

  if (booking) {
    return <BookingConfirmation booking={booking} />;
  }

  // Serverless instances may not share the in-memory store; fall back to the
  // browser receipt saved at submit time so guests never hit a hard 404.
  return <BookingConfirmationClient id={id} />;
}
