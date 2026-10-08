// Mock data layer. Pages only call getPlanets() / getPlanetBySlug(), so when
// Supabase is connected only the bodies of these functions need to change.
// The Planet shape is intentionally minimal; detail fields are added later.

export type Planet = {
  id: string;
  slug: string;
  name: string;
  system: string;
  description: string;
};

const PLANETS: Planet[] = [
  {
    id: "1",
    slug: "holy-terra",
    name: "Holy Terra",
    system: "Sol",
    description:
      "The cradle of humanity and seat of the Imperium. Placeholder description.",
  },
  {
    id: "2",
    slug: "cadia",
    name: "Cadia",
    system: "Cadian",
    description:
      "A fortress world standing guard at the Eye of Terror. Placeholder description.",
  },
  {
    id: "3",
    slug: "macragge",
    name: "Macragge",
    system: "Macragge",
    description:
      "Home of the Ultramarines and the realm of Ultramar. Placeholder description.",
  },
  {
    id: "4",
    slug: "fenris",
    name: "Fenris",
    system: "Fenris",
    description:
      "A frozen death world of ice and storms, home of the Space Wolves. Placeholder description.",
  },
  {
    id: "5",
    slug: "armageddon",
    name: "Armageddon",
    system: "Armageddon",
    description:
      "An industrial hive world of vast factories and ash wastes. Placeholder description.",
  },
  {
    id: "6",
    slug: "catachan",
    name: "Catachan",
    system: "Catachan",
    description:
      "A lethal jungle death world where everything wants you dead. Placeholder description.",
  },
];

export async function getPlanets(): Promise<Planet[]> {
  return PLANETS;
}

export async function getPlanetBySlug(slug: string): Promise<Planet | null> {
  return PLANETS.find((planet) => planet.slug === slug) ?? null;
}
