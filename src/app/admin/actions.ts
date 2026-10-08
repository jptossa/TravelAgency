"use server";

import { refresh, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export type PlanetFormState = { error?: string; message?: string };

const BOOKING_STATUSES = ["pending", "confirmed", "declined", "cancelled"];
const MAX_LIST_ITEMS = 20;

export async function setBookingStatus(bookingId: string, status: string) {
  await requireAdmin();
  if (!BOOKING_STATUSES.includes(status)) throw new Error("Invalid status.");

  const supabase = await createSupabaseServerClient();
  // select() so a silently-filtered update (0 rows) is detected.
  const { data, error } = await supabase
    .from("booking_requests")
    .update({ status })
    .eq("id", bookingId)
    .select("id");
  if (error || !data?.length) throw new Error("Could not update the booking.");

  refresh();
}

// One item per line, blanks dropped.
function parseList(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function updatePlanet(
  planetId: string,
  _prev: PlanetFormState,
  formData: FormData,
): Promise<PlanetFormState> {
  await requireAdmin();

  const text = (key: string) => String(formData.get(key) ?? "").trim();
  const requiredFields = [
    "name",
    "system",
    "description",
    "planetType",
    "controllingFaction",
    "titheGrade",
    "population",
    "climate",
    "travelTime",
  ];
  if (requiredFields.some((key) => !text(key))) {
    return { error: "All text fields except the lists are required." };
  }

  const price = Number(formData.get("priceThrones"));
  if (!Number.isInteger(price) || price < 0) {
    return { error: "Price must be a whole number of Thrones, 0 or more." };
  }
  const danger = Number(formData.get("dangerLevel"));
  if (!Number.isInteger(danger) || danger < 1 || danger > 5) {
    return { error: "Danger level must be between 1 and 5." };
  }

  const lists = {
    attractions: parseList(formData.get("attractions")),
    activities: parseList(formData.get("activities")),
    active_conflicts: parseList(formData.get("activeConflicts")),
    active_enemies: parseList(formData.get("activeEnemies")),
    unit_factions: parseList(formData.get("unitFactions")),
  };
  if (Object.values(lists).some((list) => list.length > MAX_LIST_ITEMS)) {
    return { error: `Lists can have at most ${MAX_LIST_ITEMS} items.` };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("planets")
    .update({
      name: text("name"),
      system: text("system"),
      description: text("description"),
      planet_type: text("planetType"),
      controlling_faction: text("controllingFaction"),
      tithe_grade: text("titheGrade"),
      population: text("population"),
      climate: text("climate"),
      travel_time: text("travelTime"),
      price_thrones: price,
      danger_level: danger,
      ...lists,
    })
    .eq("id", planetId)
    .select("id");

  if (error || !data?.length) {
    return { error: "Could not save the planet. Please try again." };
  }

  // Drop the cached catalogue so the public pages show the edit immediately.
  updateTag("planets");
  return { message: "Planet saved." };
}
