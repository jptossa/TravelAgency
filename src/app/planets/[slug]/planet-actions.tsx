import Link from "next/link";
import { toggleWishlist } from "@/app/planets/actions";
import { getCurrentUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { BookingForm } from "./booking-form";

// Wishlist button and booking form for the signed-in user. Reads the session,
// so it must render behind <Suspense> on the (otherwise cached) planet page.
export async function PlanetActions({
  planetId,
  planetName,
}: {
  planetId: string;
  planetName: string;
}) {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <section>
        <h2>Plan your voyage</h2>
        <p>
          <Link href="/login">Sign in</Link> or{" "}
          <Link href="/signup">create an account</Link> to save {planetName} to
          your wishlist or request a booking.
        </p>
      </section>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: saved } = await supabase
    .from("wishlist_items")
    .select("planet_id")
    .eq("user_id", user.id)
    .eq("planet_id", planetId)
    .maybeSingle();

  return (
    <section>
      <h2>Plan your voyage</h2>
      <form action={toggleWishlist.bind(null, planetId)}>
        <button type="submit" className="button">
          {saved ? "Remove from wishlist" : "Add to wishlist"}
        </button>
      </form>

      <h2>Request a booking</h2>
      <BookingForm
        planetId={planetId}
        minDate={new Date().toISOString().slice(0, 10)}
      />
    </section>
  );
}
