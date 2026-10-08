import Link from "next/link";

export default function PlanetNotFound() {
  return (
    <section className="not-found">
      <h1>Planet not found</h1>
      <p>This world is not in our charts — or has been Exterminatus&apos;d.</p>
      <Link href="/planets" className="button">
        Back to destinations
      </Link>
    </section>
  );
}
