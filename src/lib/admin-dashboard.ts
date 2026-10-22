import { requireAdmin } from "@/lib/auth";
import { listBookings, listHunts, listSlots } from "@/lib/db";

/** Admin overview data. Auth runs before any hunt, slot, or booking read. */
export async function loadAdminDashboard() {
  await requireAdmin();
  const [hunts, slots, bookings] = await Promise.all([
    listHunts({ includeCancelled: true }),
    listSlots({ includeCancelled: true }),
    listBookings({ includeCancelled: true }),
  ]);
  return { hunts, slots, bookings };
}
