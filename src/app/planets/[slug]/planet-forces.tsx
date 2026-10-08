import { getTopUnitsForFaction } from "@/lib/openhammer";

// Top units of each faction present in a planet's area. The API is a
// third-party dependency, so a failure degrades to a notice instead of an error.
export async function PlanetForces({ factions }: { factions: string[] }) {
  if (factions.length === 0) return null;

  const results = await Promise.all(
    factions.map(async (faction) => {
      try {
        return { faction, units: await getTopUnitsForFaction(faction) };
      } catch {
        return { faction, units: null };
      }
    }),
  );

  return (
    <section>
      <h2>Forces in the region</h2>
      {results.map(({ faction, units }) => (
        <div key={faction} className="faction-block">
          <h3>{faction}</h3>
          {units === null ? (
            <p className="muted">Unit data is unavailable right now.</p>
          ) : (
            <table className="unit-table">
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Pts</th>
                  <th>M</th>
                  <th>T</th>
                  <th>Sv</th>
                  <th>W</th>
                  <th>Ld</th>
                  <th>OC</th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit) => (
                  <tr key={unit.id}>
                    <td>{unit.name}</td>
                    <td>{unit.points}</td>
                    <td>{unit.stats.M}</td>
                    <td>{unit.stats.T}</td>
                    <td>
                      {unit.stats.SV}
                      {unit.invulnSave ? ` / ${unit.invulnSave}` : ""}
                    </td>
                    <td>{unit.stats.W}</td>
                    <td>{unit.stats.LD}</td>
                    <td>{unit.stats.OC}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </section>
  );
}
