# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

`ofellabuta` is a personal Japanese-language blog/site (ofellabuta.com) built with Astro 7 as a fully static site. It has three kinds of content: long-form articles, quotes, and a "restroom in comics" (マンガの中のトイレ) series, plus a large "bibliographic" section (reading/movie logs, book reviews, etc.) that is generated at build time from an external SQLite database rather than from content files.

## Commands

- `npm run dev` — start the dev server at `localhost:4321`
- `npm run build` — build the static site (output goes to `./docs`, **not** `./dist` — see astro.config.mjs, this is set up so GitHub Pages can serve straight from `docs/`)
- `npm run preview` — preview the production build locally
- `npm run astro -- check` — run Astro's type/diagnostics checker
- There is no test suite and no lint script configured in this repo.

### Required environment variable

Pages under `src/pages/bibliographic/**` read from a SQLite database at build time via `import.meta.env.BIBLIODB_PATH`. This env var must point to a valid SQLite DB file (schema includes tables like `series`, `book_lists`, `publishers`) or `npm run build`/`npm run dev` will fail/error when those routes are rendered. There is no `.env` committed to the repo — set `BIBLIODB_PATH` locally before building/running dev if you need to touch bibliographic pages.

## Architecture

### Build output goes to `docs/`, not `dist/`

`astro.config.mjs` sets `outDir: './docs'`. The `docs/` directory is committed and is what GitHub Pages serves (see `docs/CNAME` / `public/CNAME` → `ofellabuta.com`). After making changes, `npm run build` regenerates `docs/` — treat it as build output, not hand-edited source.

### Two content sources, two very different rendering strategies

1. **Astro Content Collections** (`src/content.config.ts`) — for content authored as Markdown files under `src/content/`:
   - `articlesCollection` (`src/content/articles/*.md`) — blog posts. Frontmatter: `title`, `createdAt`, `description`, `tags: string[]`, optional `style` (a CSS filename under `public/styles/`, linked in `<head>` by `BaseLayout` for per-article custom styling).
   - `quotesCollection` (`src/content/quotes/*.md`) — short quotes. Frontmatter: `title`, `createdAt`, `source`, `description`.
   - `restroomInComicsCollection` (`src/content/restroom_in_comics/*.md`) — frontmatter: `title`, `author`, `media`, `createdAt`, `description`.
   - Collection files are named by numeric id (articles use `YYYYMMDDNNN.md`, e.g. `20260202001.md`; quotes/restroom use zero-padded sequence numbers). `getStaticPaths` for each `[...slug].astro` page maps `entry.id` directly to the route param, and prev/next navigation (`PageNavigater`) is derived by comparing these ids as strings — so id format/ordering matters.
   - **Known inconsistency**: `src/pages/tags/index.astro` and `src/pages/tags/[tag].astro` call `getCollection('articles')` (and use `article.slug`), but the collection is actually registered as `articlesCollection` (with `.id`) everywhere else. This means the tags feature is effectively non-functional/stale — be aware before assuming it works, and fix the collection name/id usage if asked to repair tagging.

2. **SQLite-backed pages** (`src/pages/bibliographic/**`) — no content collection involved. Each dynamic route (`movies/[id].astro`, `persons/[id].astro`, `series/[id].astro`, `works/[id].astro`, `prints/[id].astro`, `bookreviews/[id]/[year].astro`, `magazines/[id]/[year].astro`) opens `sqlite3.Database(import.meta.env.BIBLIODB_PATH)` inside `getStaticPaths()` to enumerate all static params/props, then opens the DB again in the page body to fetch related rows (publishers, book lists, etc.). Static pages like `bought_books.astro`, `finished_reading.astro`, `watched_movies.astro` query the DB directly without `getStaticPaths`. Row shapes are typed in `src/types/*.ts` (`series.ts`, `bookList.ts`, `publisher.ts`, `work.ts`, `movie.ts`, `person.ts`, `print.ts`, `brand.ts`, `tag.ts`, `content.ts`, plus `relatedLinks.ts`/`relatedPersons.ts`/`relatedSeries.ts`/`relatedWorks.ts` for join-style data). When editing these pages, follow the existing pattern of a small typed `getX(db, ...)` Promise-wrapper function per query rather than introducing a query abstraction.

### Layout / component structure

- `src/layouts/BaseLayout.astro` is the single page shell (`<html>`/`<head>`/`Header`/`NavigationBar`/`<slot>`/`Footer`), used by every page. It accepts `pageTitle`, `title`, `description`, and an optional `style` (per-page CSS file under `/styles/`) for OGP meta tags and article-specific styling.
- `src/components/NavigationBar.astro` embeds all quote ids in a hidden input and does client-side random selection for the "Quotes" nav link (`/quotes/<random-id>`) — this is why `quotesCollection` is fetched in a layout-adjacent component rather than a page.
- `Article.astro`, `Quote.astro`, `RestroomInComics.astro` are the per-collection-entry renderers (each takes a `CollectionEntry<'...Collection'>` prop and renders via `astro:content`'s `render()`).
- `BibliographicMenu.astro` and `BreadcrumbList.astro` are shared nav elements for the bibliographic section.
- Component `<style>` blocks use nested CSS (Astro/Lightning CSS supports native nesting) — follow that style rather than flattening selectors.

### Static reference data

`src/scripts/lib.ts` hardcodes `magazineData` (magazine key/id/title triples) used to link into `bibliographic/series/[id]` — this is the one piece of "content" that lives in TypeScript rather than the DB or content collections.
