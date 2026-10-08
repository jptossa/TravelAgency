import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { toPlanet, type PlanetRow } from "@/lib/planets";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { PlanetForm } from "./planet-form";

export default function EditPlanetPage({
  params,
}: PageProps<"/admin/planets/[id]">) {
  // Pass the promise down so awaiting it happens behind the Suspense boundary.
  return (
    <Suspense fallback={<p className="muted">Loading planet…</p>}>
      <EditPlanetContent params={params} />
    </Suspense>
  );
}

async function EditPlanetContent({
  params,
}: {
  params: PageProps<"/admin/planets/[id]">["params"];
}) {
  await requireAdmin();
  const { id } = await params;

  // Read straight from the database (not the cached catalogue) so the form
  // always shows the latest saved values.
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("planets")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const planet = toPlanet(data as PlanetRow);

  return (
    <section>
      <Link href="/admin/planets" className="back-link">
        ← All planets
      </Link>
      <h1>Edit {planet.name}</h1>
      <PlanetForm planet={planet} />
    </section>
  );
}
