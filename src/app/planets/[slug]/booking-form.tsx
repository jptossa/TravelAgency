"use client";

import { useActionState } from "react";
import { requestBooking, type BookingState } from "@/app/planets/actions";

const initialState: BookingState = {};

export function BookingForm({
  planetId,
  minDate,
}: {
  planetId: string;
  minDate: string;
}) {
  const [state, formAction, pending] = useActionState(
    requestBooking,
    initialState,
  );

  return (
    <form action={formAction} className="auth-form booking-form">
      <input type="hidden" name="planetId" value={planetId} />
      <label>
        Travelers
        <input
          name="travelers"
          type="number"
          min={1}
          max={20}
          defaultValue={1}
          required
        />
      </label>
      <label>
        Departure date
        <input name="departureDate" type="date" min={minDate} required />
      </label>
      <label>
        Notes (optional)
        <textarea name="notes" rows={3} maxLength={500} />
      </label>

      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      {state.message && <p role="status">{state.message}</p>}

      <button type="submit" className="button" disabled={pending}>
        {pending ? "Submitting…" : "Request booking"}
      </button>
    </form>
  );
}
