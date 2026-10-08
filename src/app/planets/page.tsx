import Link from "next/link";
import { getPlanets } from "@/lib/planets";

export default async function PlanetsPage() {
  const planets = await getPlanets();

  return (
    <section>
      <h1>Destinations</h1>
      <ul>
        {planets.map((planet) => (
          <li key={planet.id}>
            <Link href={`/planets/${planet.slug}`}>{planet.name}</Link> —{" "}
            {planet.system} system · {planet.planetType} · Danger{" "}
            {planet.dangerLevel}/5 ·{" "}
            {planet.priceThrones.toLocaleString("en-US")} Thrones
          </li>
        ))}
      </ul>
    </section>
  );
}
