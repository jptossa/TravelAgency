"use client";

import { useActionState } from "react";
import { updatePlanet, type PlanetFormState } from "@/app/admin/actions";
import type { Planet } from "@/lib/planets";

const initialState: PlanetFormState = {};

function TextField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <label>
      {label}
      <input name={name} type="text" defaultValue={defaultValue} required />
    </label>
  );
}

function ListField({
  name,
  label,
  items,
  hint,
}: {
  name: string;
  label: string;
  items: string[];
  hint?: string;
}) {
  return (
    <label>
      {label} (one per line)
      <textarea name={name} rows={4} defaultValue={items.join("\n")} />
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function PlanetForm({ planet }: { planet: Planet }) {
  const [state, formAction, pending] = useActionState(
    updatePlanet.bind(null, planet.id),
    initialState,
  );

  return (
    <form action={formAction} className="auth-form admin-form">
      <TextField name="name" label="Name" defaultValue={planet.name} />
      <TextField name="system" label="System" defaultValue={planet.system} />
      <label>
        Description
        <textarea
          name="description"
          rows={4}
          defaultValue={planet.description}
          required
        />
      </label>
      <TextField
        name="planetType"
        label="Planet type"
        defaultValue={planet.planetType}
      />
      <TextField
        name="controllingFaction"
        label="Controlling faction"
        defaultValue={planet.controllingFaction}
      />
      <TextField
        name="titheGrade"
        label="Tithe grade"
        defaultValue={planet.titheGrade}
      />
      <TextField
        name="population"
        label="Population"
        defaultValue={planet.population}
      />
      <TextField name="climate" label="Climate" defaultValue={planet.climate} />
      <TextField
        name="travelTime"
        label="Travel time"
        defaultValue={planet.travelTime}
      />
      <label>
        Price (Thrones)
        <input
          name="priceThrones"
          type="number"
          min={0}
          step={1}
          defaultValue={planet.priceThrones}
          required
        />
      </label>
      <label>
        Danger level
        <select name="dangerLevel" defaultValue={planet.dangerLevel}>
          {[1, 2, 3, 4, 5].map((level) => (
            <option key={level} value={level}>
              {level} / 5
            </option>
          ))}
        </select>
      </label>

      <ListField
        name="attractions"
        label="Main attractions"
        items={planet.attractions}
      />
      <ListField
        name="activities"
        label="Top activities"
        items={planet.activities}
      />
      <ListField
        name="activeConflicts"
        label="Active conflicts"
        items={planet.activeConflicts}
      />
      <ListField
        name="activeEnemies"
        label="Active enemies of the Imperium"
        items={planet.activeEnemies}
      />
      <ListField
        name="unitFactions"
        label="Unit factions"
        items={planet.unitFactions}
        hint="Must match OpenHammer API faction names exactly, e.g. Astra Militarum."
      />

      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      {state.message && <p role="status">{state.message}</p>}

      <button type="submit" className="button" disabled={pending}>
        {pending ? "Saving…" : "Save planet"}
      </button>
    </form>
  );
}
