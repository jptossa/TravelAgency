import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { getPlanets } from "@/lib/planets";

export default function AdminPlanetsPage() {
  return (
    <Suspense fallback={<p className="muted">Loading planets…</p>}>
      <PlanetsContent />
    </Suspense>
  );
}

async function PlanetsContent() {
  await requireAdmin();
  const planets = await getPlanets();

  return (
    <section>
      <Link href="/admin" className="back-link">
        ← Admin
      </Link>
      <h1>Manage planets</h1>
      <ul className="account-list">
        {planets.map((planet) => (
          <li key={planet.id}>
            <span>
              {planet.name} · {planet.system} system
            </span>
            <Link href={`/admin/planets/${planet.id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
