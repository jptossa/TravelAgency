import Link from "next/link";
import { Suspense } from "react";
import { setBookingStatus } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type BookingRow = {
  id: string;
  user_id: string;
  travelers: number;
  departure_date: string;
  status: string;
  notes: string | null;
  created_at: string;
  planets: { name: string; slug: string };
};

const ACTIONS: { status: string; label: string }[] = [
  { status: "confirmed", label: "Confirm" },
  { status: "declined", label: "Decline" },
];

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<p className="muted">Loading booking requests…</p>}>
      <BookingsContent />
    </Suspense>
  );
}

async function BookingsContent() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();

  // Admin RLS policies make every user's requests visible here.
  const { data: bookings } = await supabase
    .from("booking_requests")
    .select(
      "id, user_id, travelers, departure_date, status, notes, created_at, planets(name, slug)",
    )
    .order("created_at", { ascending: false });
  const rows = (bookings ?? []) as unknown as BookingRow[];

  const userIds = [...new Set(rows.map((row) => row.user_id))];
  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("id, display_name").in("id", userIds)
    : { data: [] };
  const names = new Map(
    (profiles ?? []).map((p) => [p.id as string, p.display_name as string | null]),
  );

  return (
    <section>
      <Link href="/admin" className="back-link">
        ← Admin
      </Link>
      <h1>Booking requests</h1>
      {rows.length === 0 ? (
        <p className="muted">No booking requests yet.</p>
      ) : (
        <ul className="account-list">
          {rows.map((booking) => (
            <li key={booking.id} className="booking-admin-row">
              <div>
                <p>
                  <Link href={`/planets/${booking.planets.slug}`}>
                    {booking.planets.name}
                  </Link>{" "}
                  · {booking.travelers}{" "}
                  {booking.travelers === 1 ? "traveler" : "travelers"} · departs{" "}
                  {booking.departure_date}
                </p>
                <p className="muted">
                  {names.get(booking.user_id) ?? booking.user_id.slice(0, 8)}
                  {booking.notes ? ` — “${booking.notes}”` : ""}
                </p>
              </div>
              <div className="booking-admin-actions">
                <span className="status" data-status={booking.status}>
                  {booking.status}
                </span>
                {ACTIONS.filter((a) => a.status !== booking.status).map((a) => (
                  <form
                    key={a.status}
                    action={setBookingStatus.bind(null, booking.id, a.status)}
                  >
                    <button type="submit" className="link-button">
                      {a.label}
                    </button>
                  </form>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
