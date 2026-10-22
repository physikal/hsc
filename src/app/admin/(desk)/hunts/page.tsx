import { requireAdmin } from "@/lib/auth";
import AdminHuntsClient from "./hunts-client";

export const dynamic = "force-dynamic";

export default async function AdminHuntsPage() {
  await requireAdmin();
  return <AdminHuntsClient />;
}
