# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A travel agency site for the solar systems and planets of the Warhammer 40k galaxy. Next.js 16 (App Router, TypeScript, `src/` dir, `@/*` → `src/*`) with Supabase as the database. Styling is plain CSS (no Tailwind) in `src/app/globals.css`, themed on the Imperium of Man: void-black background, aged gold and crimson accents, parchment text, Cinzel headings and EB Garamond body (via `next/font/google` in `layout.tsx`). Colours and fonts are CSS variables in `:root`; pages are semantic HTML with a few classes (`planet-card`, `danger[data-level]`, `button`).

## Commands

```bash
npm run dev      # dev server on :3000
npm run build    # production build (also type-checks and prerenders all routes)
npm run lint     # eslint
```

There is no test runner configured.

## Next.js version caveat

`AGENTS.md` (written by `next dev`) warns that this Next.js (16.x) differs from older versions. Read the relevant guide in `node_modules/next/dist/docs/` before using an API from memory. Things already in play here:

- `next.config.ts` enables `cacheComponents` and `partialPrefetching`.
- Dynamic route `params` is a Promise (`await params`), and pages are typed with the globally generated `PageProps<"/route/[param]">` / `LayoutProps<"/">` helpers rather than hand-written prop types.

## Architecture

- **Data layer:** `src/lib/planets.ts` exposes async `getPlanets()` and `getPlanetBySlug(slug)`, which query the Supabase `planets` table (snake_case rows mapped to the camelCase `Planet` type) and are cached with `"use cache"` + `cacheLife("hours")`. Pages must only use these functions. `src/lib/supabase.ts` builds the server-side client from `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` (no `NEXT_PUBLIC_` prefix, so never sent to the browser).
- **Unit data (OpenHammer API):** `src/lib/openhammer.ts` fetches the top units by points for a faction from `https://openhammer-api-production.up.railway.app` (edition constant `EDITION`, currently `10e`), cached with `cacheLife("days")`. Each planet's `unit_factions` column holds the **exact API faction names** for the forces in its area (controlling faction + main enemies); check names against `GET /v1/10e/factions`. The planet page renders them via `planets/[slug]/planet-forces.tsx` inside `<Suspense>`, and an API failure degrades to a notice rather than breaking the page. Unit data is not stored in Supabase.
- **Auth (Supabase Auth, email + password):** two clients with different jobs. `src/lib/supabase.ts` is the anonymous client for public catalogue data and is safe inside `"use cache"`. `src/lib/supabase-server.ts` is the cookie-backed, user-scoped client (`@supabase/ssr`); it reads `cookies()`, so it can never run inside a `"use cache"` scope and must be called behind `<Suspense>` (see `user-nav.tsx` in the layout and `account/page.tsx`). `src/proxy.ts` (Next 16's replacement for middleware) only refreshes the session; real authorization lives in `src/lib/auth.ts` (`getCurrentUser`/`requireUser`) and in row-level security. Server actions for sign up/in/out are in `src/app/auth/actions.ts`; `src/app/auth/callback/route.ts` handles the email-confirmation link. Both clients share `src/lib/supabase-config.ts`.
- **User tables:** `profiles` (auto-created by a trigger on `auth.users`; `role` is `user`/`admin` and users can only update `display_name`), `wishlist_items` and `booking_requests`, all with RLS scoped to `auth.uid()`. The admin role is not wired up yet. The wishlist toggle and booking request actions live in `src/app/planets/actions.ts` (they call `refresh()` so the dynamic parts re-render); the planet page renders them via `planets/[slug]/planet-actions.tsx` inside `<Suspense>`, and the account page lists the user's wishlist and booking requests.
- **Schema:** `supabase/migrations/` holds the table (RLS on, public read-only); `supabase/seed.sql` upserts the six starter planets. Changing the `Planet` type means updating the migration, `PlanetRow`/`toPlanet`, and the seed together.
- **`Planet` type** has user-specified fields: planet type, controlling faction, tithe grade, population, climate, price (Thrones), danger level (1–5), travel time, and string lists for attractions, activities, active conflicts and active enemies. Seed values are placeholders (tithe grade names should be verified against lore); don't add fields without asking the user.
- **Landing-page copy** (mission statement, benefits, amenities, site name) lives in `src/lib/content.ts` as placeholder text.
- **Routes** (all server components): `/` (`app/page.tsx`), `/planets` (list), `/planets/[slug]` (show page; `generateStaticParams` from `getPlanets()`, `notFound()` for unknown slugs, with a segment-level `not-found.tsx`).
