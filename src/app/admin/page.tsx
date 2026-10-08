import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="muted">Loading…</p>}>
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { count } = await supabase
    .from("booking_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  return (
    <section>
      <h1>Admin</h1>
      <ul>
        <li>
          <Link href="/admin/bookings">Booking requests</Link> —{" "}
          {count ?? 0} pending
        </li>
        <li>
          <Link href="/admin/planets">Manage planets</Link>
        </li>
      </ul>
    </section>
  );
}
