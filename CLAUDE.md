# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A travel agency site for the solar systems and planets of the Warhammer 40k galaxy. Next.js 16 (App Router, TypeScript, `src/` dir, `@/*` → `src/*`) with Supabase planned as the database. **Supabase is not connected yet** — all data is mocked. Styling is deliberately deferred: no Tailwind, `globals.css` is empty, pages are plain semantic HTML.

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

- **Data seam:** `src/lib/planets.ts` holds the mock `PLANETS` array and exposes only async `getPlanets()` and `getPlanetBySlug(slug)`. Pages must go through these functions and never import the array, so connecting Supabase means rewriting those function bodies only.
- **`Planet` type is intentionally minimal** (`id`, `slug`, `name`, `system`, `description`). The user wants to be **asked** for the per-planet detail fields and real data when that step comes — do not invent fields.
- **Landing-page copy** (mission statement, benefits, amenities, site name) lives in `src/lib/content.ts` as placeholder text.
- **Routes** (all server components): `/` (`app/page.tsx`), `/planets` (list), `/planets/[slug]` (show page; `generateStaticParams` from `getPlanets()`, `notFound()` for unknown slugs, with a segment-level `not-found.tsx`).
