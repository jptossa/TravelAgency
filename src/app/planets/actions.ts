"use server";

import { refresh } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export type BookingState = { error?: string; message?: string };

const MAX_TRAVELERS = 20;
const MAX_NOTES_LENGTH = 500;

// Adds the planet to the signed-in user's wishlist, or removes it if present.
export async function toggleWishlist(planetId: string) {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data: existing, error: readError } = await supabase
    .from("wishlist_items")
    .select("planet_id")
    .eq("user_id", user.id)
    .eq("planet_id", planetId)
    .maybeSingle();
  if (readError) throw new Error("Could not update your wishlist.");

  const { error } = existing
    ? await supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", user.id)
        .eq("planet_id", planetId)
    : await supabase
        .from("wishlist_items")
        .insert({ user_id: user.id, planet_id: planetId });
  if (error) throw new Error("Could not update your wishlist.");

  refresh();
}

export async function requestBooking(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const user = await requireUser();

  const planetId = String(formData.get("planetId") ?? "");
  const travelers = Number(formData.get("travelers"));
  const departureDate = String(formData.get("departureDate") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!planetId) return { error: "Missing destination." };
  if (
    !Number.isInteger(travelers) ||
    travelers < 1 ||
    travelers > MAX_TRAVELERS
  ) {
    return { error: `Travelers must be between 1 and ${MAX_TRAVELERS}.` };
  }
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(departureDate) ||
    Number.isNaN(Date.parse(departureDate))
  ) {
    return { error: "Choose a departure date." };
  }
  if (departureDate < new Date().toISOString().slice(0, 10)) {
    return { error: "Departure date cannot be in the past." };
  }
  if (notes.length > MAX_NOTES_LENGTH) {
    return { error: `Notes must be ${MAX_NOTES_LENGTH} characters or fewer.` };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("booking_requests").insert({
    user_id: user.id,
    planet_id: planetId,
    travelers,
    departure_date: departureDate,
    notes: notes || null,
  });

  if (error) {
    return { error: "Could not submit your request. Please try again." };
  }

  refresh();
  return { message: "Booking request submitted. It is now pending review." };
}
