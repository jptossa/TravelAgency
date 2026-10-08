import { cacheLife } from "next/cache";

// OpenHammer API (https://openhammer-api-production.up.railway.app/docs).
// Unit data is public and rarely changes, so it is fetched server-side and cached.
const API_BASE = "https://openhammer-api-production.up.railway.app";
const EDITION = "10e";

export type Unit = {
  id: string;
  name: string;
  points: number;
  stats: { M: string; T: string; SV: string; W: string; LD: string; OC: string };
  invulnSave: string | null;
};

// Subset of the API response that we use.
type ApiUnit = {
  id: string;
  name: string;
  points: { base: number };
  stats: Unit["stats"];
  invuln_save: string | null;
};

// Highest-points units of a faction. Fetches extra so that discontinued
// "[Legends]" entries can be dropped before trimming to `count`.
export async function getTopUnitsForFaction(
  faction: string,
  count = 6,
): Promise<Unit[]> {
  "use cache";
  cacheLife("days");

  const params = new URLSearchParams({
    faction,
    sort_by: "-points",
    limit: String(count * 4),
  });
  const res = await fetch(`${API_BASE}/v1/${EDITION}/units?${params}`);
  if (!res.ok) {
    throw new Error(`OpenHammer API returned ${res.status} for "${faction}"`);
  }

  const units = (await res.json()) as ApiUnit[];
  return units
    .filter((unit) => !unit.name.includes("[Legends]"))
    .slice(0, count)
    .map((unit) => ({
      id: unit.id,
      name: unit.name,
      points: unit.points.base,
      stats: unit.stats,
      invulnSave: unit.invuln_save,
    }));
}
