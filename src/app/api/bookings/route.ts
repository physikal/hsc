import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { notifyBookingCreatedInBackground } from "@/lib/agentmail";
import { requireAdminOrAgent } from "@/lib/auth";
import {
  bookingReceiptCookieName,
  encodeBookingReceipt,
} from "@/lib/booking-receipt";
import { createBooking, listBookings } from "@/lib/db";

export const runtime = "nodejs";

const createSchema = z.object({
  slotId: z.string().min(1),
  guestName: z.string().min(2),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(7),
  partySize: z.number().int().positive(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const auth = await requireAdminOrAgent(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const slotId = req.nextUrl.searchParams.get("slotId") ?? undefined;
    const includeCancelled =
      req.nextUrl.searchParams.get("includeCancelled") === "true";
    const bookings = await listBookings({ slotId, includeCancelled });
    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to list bookings",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = createSchema.parse(await req.json());
    const booking = await createBooking(body);
    // Side-effect only — booking succeeds even if AgentMail notify fails.
    notifyBookingCreatedInBackground(booking);

    const response = NextResponse.json({ booking }, { status: 201 });
    // Persist a per-guest receipt cookie so confirmation works across
    // serverless instances that do not share the in-memory store.
    response.cookies.set({
      name: bookingReceiptCookieName(booking.id),
      value: encodeBookingReceipt(booking),
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    const status =
      message.includes("capacity") ||
      message.includes("cancelled") ||
      message.includes("not found") ||
      message.includes("Party size")
        ? 409
        : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
