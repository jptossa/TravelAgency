import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/app/auth/actions";
import { toggleWishlist } from "@/app/planets/actions";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

type PlanetRef = { name: string; slug: string };

type WishlistRow = { planet_id: string; planets: PlanetRef };

type BookingRow = {
  id: string;
  travelers: number;
  departure_date: string;
  status: string;
  notes: string | null;
  planets: PlanetRef;
};

export default function AccountPage() {
  return (
    <Suspense fallback={<p className="muted">Loading your account…</p>}>
      <AccountContent />
    </Suspense>
  );
}

async function AccountContent() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  // Row-level security limits every query to the signed-in user's rows.
  const [{ data: profile }, { data: wishlist }, { data: bookings }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, role")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("wishlist_items")
        .select("planet_id, planets(name, slug)")
        .order("created_at", { ascending: false }),
      supabase
        .from("booking_requests")
        .select("id, travelers, departure_date, status, notes, planets(name, slug)")
        .order("created_at", { ascending: false }),
    ]);

  const wishlistRows = (wishlist ?? []) as unknown as WishlistRow[];
  const bookingRows = (bookings ?? []) as unknown as BookingRow[];

  return (
    <section>
      <h1>Your account</h1>
      <dl>
        <dt>Name</dt>
        <dd>{profile?.display_name ?? "—"}</dd>
        <dt>Email</dt>
        <dd>{user.email}</dd>
      </dl>

      <h2>Wishlist</h2>
      {wishlistRows.length === 0 ? (
        <p className="muted">
          Nothing saved yet. <Link href="/planets">Browse destinations</Link>.
        </p>
      ) : (
        <ul className="account-list">
          {wishlistRows.map((item) => (
            <li key={item.planet_id}>
              <Link href={`/planets/${item.planets.slug}`}>
                {item.planets.name}
              </Link>
              <form action={toggleWishlist.bind(null, item.planet_id)}>
                <button type="submit" className="link-button">
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <h2>Booking requests</h2>
      {bookingRows.length === 0 ? (
        <p className="muted">
          No requests yet. Open a destination to request a booking.
        </p>
      ) : (
        <ul className="account-list">
          {bookingRows.map((booking) => (
            <li key={booking.id}>
              <span>
                <Link href={`/planets/${booking.planets.slug}`}>
                  {booking.planets.name}
                </Link>{" "}
                · {booking.travelers}{" "}
                {booking.travelers === 1 ? "traveler" : "travelers"} · departs{" "}
                {booking.departure_date}
              </span>
              <span className="status" data-status={booking.status}>
                {booking.status}
              </span>
            </li>
          ))}
        </ul>
      )}

      <form action={signOut}>
        <button type="submit" className="button">
          Sign out
        </button>
      </form>
    </section>
  );
}
