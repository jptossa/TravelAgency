import { cacheLife, cacheTag } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase";

export type Planet = {
  id: string;
  slug: string;
  name: string;
  system: string;
  description: string;
  planetType: string; // e.g. "Death World", "Hive World", "Fortress World"
  controllingFaction: string;
  titheGrade: string; // Imperial tithe grade, e.g. "Decuma Particular"
  population: string; // descriptive, e.g. "12 billion"
  climate: string;
  priceThrones: number; // trip price in Imperial Thrones
  dangerLevel: 1 | 2 | 3 | 4 | 5;
  travelTime: string; // warp transit from Holy Terra, e.g. "3 weeks"
  attractions: string[];
  activities: string[];
  activeConflicts: string[];
  activeEnemies: string[];
  unitFactions: string[]; // exact OpenHammer API faction names for this area
};

// Row shape of public.planets (see supabase/migrations).
export type PlanetRow = {
  id: string;
  slug: string;
  name: string;
  system: string;
  description: string;
  planet_type: string;
  controlling_faction: string;
  tithe_grade: string;
  population: string;
  climate: string;
  price_thrones: number;
  danger_level: number;
  travel_time: string;
  attractions: string[];
  activities: string[];
  active_conflicts: string[];
  active_enemies: string[];
  unit_factions: string[];
};

export function toPlanet(row: PlanetRow): Planet {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    system: row.system,
    description: row.description,
    planetType: row.planet_type,
    controllingFaction: row.controlling_faction,
    titheGrade: row.tithe_grade,
    population: row.population,
    climate: row.climate,
    priceThrones: row.price_thrones,
    dangerLevel: row.danger_level as Planet["dangerLevel"],
    travelTime: row.travel_time,
    attractions: row.attractions,
    activities: row.activities,
    activeConflicts: row.active_conflicts,
    activeEnemies: row.active_enemies,
    unitFactions: row.unit_factions ?? [],
  };
}

// Catalogue data is public and changes rarely, so cache query results.
export async function getPlanets(): Promise<Planet[]> {
  "use cache";
  cacheTag("planets");
  cacheLife("hours");

  const { data, error } = await createSupabaseClient()
    .from("planets")
    .select("*")
    .order("name");

  if (error) throw new Error(`Failed to load planets: ${error.message}`);
  return (data as PlanetRow[]).map(toPlanet);
}

export async function getPlanetBySlug(slug: string): Promise<Planet | null> {
  "use cache";
  cacheTag("planets");
  cacheLife("hours");

  const { data, error } = await createSupabaseClient()
    .from("planets")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`Failed to load planet: ${error.message}`);
  return data ? toPlanet(data as PlanetRow) : null;
}
