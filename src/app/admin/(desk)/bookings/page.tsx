import { requireAdmin } from "@/lib/auth";
import AdminBookingsClient from "./bookings-client";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  await requireAdmin();
  return <AdminBookingsClient />;
}
