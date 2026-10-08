import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlanetBySlug, getPlanets } from "@/lib/planets";

export async function generateStaticParams() {
  const planets = await getPlanets();
  return planets.map((planet) => ({ slug: planet.slug }));
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default async function PlanetPage({
  params,
}: PageProps<"/planets/[slug]">) {
  const { slug } = await params;
  const planet = await getPlanetBySlug(slug);

  if (!planet) notFound();

  return (
    <article>
      <Link href="/planets" className="back-link">
        ← All destinations
      </Link>
      <h1>{planet.name}</h1>
      <p>{planet.description}</p>

      <dl>
        <dt>System</dt>
        <dd>{planet.system}</dd>
        <dt>Planet type</dt>
        <dd>{planet.planetType}</dd>
        <dt>Controlling faction</dt>
        <dd>{planet.controllingFaction}</dd>
        <dt>Tithe grade</dt>
        <dd>{planet.titheGrade}</dd>
        <dt>Population</dt>
        <dd>{planet.population}</dd>
        <dt>Climate</dt>
        <dd>{planet.climate}</dd>
        <dt>Price</dt>
        <dd>{planet.priceThrones.toLocaleString("en-US")} Thrones</dd>
        <dt>Danger level</dt>
        <dd>
          <span className="danger" data-level={planet.dangerLevel}>
            {planet.dangerLevel} / 5
          </span>
        </dd>
        <dt>Travel time</dt>
        <dd>{planet.travelTime}</dd>
      </dl>

      <List title="Main attractions" items={planet.attractions} />
      <List title="Top activities" items={planet.activities} />
      <List title="Active conflicts" items={planet.activeConflicts} />
      <List title="Active enemies of the Imperium" items={planet.activeEnemies} />
    </article>
  );
}
