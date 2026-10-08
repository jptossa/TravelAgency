// Mock data layer. Pages only call getPlanets() / getPlanetBySlug(), so when
// Supabase is connected only the bodies of these functions need to change.

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
};

const PLANETS: Planet[] = [
  {
    id: "1",
    slug: "holy-terra",
    name: "Holy Terra",
    system: "Sol",
    description:
      "The cradle of humanity and seat of the Imperium. Placeholder description.",
    planetType: "Throneworld",
    controllingFaction: "Adeptus Terra",
    titheGrade: "Exactis Extremis",
    population: "Over 20 billion",
    climate: "Polluted, continent-spanning hive-cities and mountain-sized palaces",
    priceThrones: 12000,
    dangerLevel: 2,
    travelTime: "N/A (origin)",
    attractions: ["The Imperial Palace", "The Golden Throne viewing gallery", "Ecclesiarchy cathedrals"],
    activities: ["Pilgrimage walks", "Guided Palace tours", "Relic markets"],
    activeConflicts: ["Cult uprisings in the lower hives"],
    activeEnemies: ["Genestealer cults", "Chaos infiltrators"],
  },
  {
    id: "2",
    slug: "cadia",
    name: "Cadia",
    system: "Cadian",
    description:
      "A fortress world standing guard at the Eye of Terror. Placeholder description.",
    planetType: "Fortress World",
    controllingFaction: "Astra Militarum",
    titheGrade: "Solutio Extremis",
    population: "Roughly 4 billion",
    climate: "Temperate, with harsh storms",
    priceThrones: 4500,
    dangerLevel: 5,
    travelTime: "6 weeks",
    attractions: ["Kasr fortress walls", "Monument to the fallen"],
    activities: ["Military history tours", "Live-fire demonstrations"],
    activeConflicts: ["Siege of the Cadian Gate"],
    activeEnemies: ["Black Legion", "Chaos cultists"],
  },
  {
    id: "3",
    slug: "macragge",
    name: "Macragge",
    system: "Macragge",
    description:
      "Home of the Ultramarines and the realm of Ultramar. Placeholder description.",
    planetType: "Civilised World",
    controllingFaction: "Ultramarines",
    titheGrade: "Decuma Particular",
    population: "Around 3 billion",
    climate: "Mild coastal plains and snowy highlands",
    priceThrones: 6800,
    dangerLevel: 3,
    travelTime: "5 weeks",
    attractions: ["Fortress of Hera", "Hall of Heroes"],
    activities: ["Honour-guard parade viewing", "Highland trekking"],
    activeConflicts: ["Skirmishes along the Ultramar border"],
    activeEnemies: ["Tyranid splinter fleets"],
  },
  {
    id: "4",
    slug: "fenris",
    name: "Fenris",
    system: "Fenris",
    description:
      "A frozen death world of ice and storms, home of the Space Wolves. Placeholder description.",
    planetType: "Death World",
    controllingFaction: "Space Wolves",
    titheGrade: "Aptus Non",
    population: "Sparse tribal settlements",
    climate: "Arctic, with perpetual storms and shifting ice",
    priceThrones: 3200,
    dangerLevel: 4,
    travelTime: "4 weeks",
    attractions: ["The Fang", "Aett of the Wolf Kings"],
    activities: ["Frost-beast hunts", "Sagas around the great hall fires"],
    activeConflicts: ["Wolf-clan feuds"],
    activeEnemies: ["Thousand Sons raiders"],
  },
  {
    id: "5",
    slug: "armageddon",
    name: "Armageddon",
    system: "Armageddon",
    description:
      "An industrial hive world of vast factories and ash wastes. Placeholder description.",
    planetType: "Hive World",
    controllingFaction: "Imperial Governor / Astra Militarum",
    titheGrade: "Exactis Particular",
    population: "Over 10 billion",
    climate: "Ash wastes and acidic rains",
    priceThrones: 2900,
    dangerLevel: 4,
    travelTime: "7 weeks",
    attractions: ["Hive Infernus", "The Ash Wastes overlook"],
    activities: ["Factory tours", "Ork-hunting excursions"],
    activeConflicts: ["Third War for Armageddon"],
    activeEnemies: ["Ork WAAAGH! Ghazghkull", "Daemons"],
  },
  {
    id: "6",
    slug: "catachan",
    name: "Catachan",
    system: "Catachan",
    description:
      "A lethal jungle death world where everything wants you dead. Placeholder description.",
    planetType: "Death World",
    controllingFaction: "Catachan Jungle Fighters",
    titheGrade: "Aptus Non",
    population: "Sparse, scattered tribes",
    climate: "Dense, carnivorous jungle",
    priceThrones: 2100,
    dangerLevel: 5,
    travelTime: "8 weeks",
    attractions: ["Devil's Reach canopy", "Sentient flora gardens"],
    activities: ["Survival trek", "Wildlife safari (no refunds)"],
    activeConflicts: ["Ongoing predator culls"],
    activeEnemies: ["Tyranid scouts", "Hostile megafauna"],
  },
];

export async function getPlanets(): Promise<Planet[]> {
  return PLANETS;
}

export async function getPlanetBySlug(slug: string): Promise<Planet | null> {
  return PLANETS.find((planet) => planet.slug === slug) ?? null;
}
