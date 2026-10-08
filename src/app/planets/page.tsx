import Link from "next/link";
import { getPlanets } from "@/lib/planets";

export default async function PlanetsPage() {
  const planets = await getPlanets();

  return (
    <section>
      <h1>Destinations</h1>
      <ul className="planet-grid">
        {planets.map((planet) => (
          <li key={planet.id} className="planet-card">
            <Link href={`/planets/${planet.slug}`}>
              <h2>{planet.name}</h2>
              <p className="meta">
                {planet.system} system · {planet.planetType}
              </p>
              <p className="stats">
                <span className="danger" data-level={planet.dangerLevel}>
                  Danger {planet.dangerLevel}/5
                </span>
                <span>{planet.priceThrones.toLocaleString("en-US")} Thrones</span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
