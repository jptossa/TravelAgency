import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlanetBySlug, getPlanets } from "@/lib/planets";

export async function generateStaticParams() {
  const planets = await getPlanets();
  return planets.map((planet) => ({ slug: planet.slug }));
}

export default async function PlanetPage({
  params,
}: PageProps<"/planets/[slug]">) {
  const { slug } = await params;
  const planet = await getPlanetBySlug(slug);

  if (!planet) notFound();

  return (
    <article>
      <Link href="/planets">← All destinations</Link>
      <h1>{planet.name}</h1>
      <p>{planet.system} system</p>
      <p>{planet.description}</p>
    </article>
  );
}
