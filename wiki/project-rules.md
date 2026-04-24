# Project Rules

This workspace is the live Islander Roofing and Siding site built with Vite, TailwindCSS, and vanilla JavaScript.

## Content
- Keep copy specific to roofing, siding, maintenance, inspections, and local Mid-Island service areas.
- Use domain language when it helps homeowners understand the work.
- Favor clear, production-ready labels over generic labels.
- Use the full company name: Islander Roofing and Siding. Islander Roofing & Siding is also acceptable. Never shorten it to Islander Roofing.

## Design
- Use a black, white, and slate palette only.
- Preserve responsive layouts and accessible contrast.
- Keep the shared shell chrome consistent, but do not add page-authored footer blocks.

## Routes
- Rename slugs directly when content changes.
- Do not add redirects unless explicitly requested.
- Keep the route count and page structure stable unless the task requires otherwise.

## Build
- Source pages live in `src/`.
- Production output is baked into `docs/`.
- Preserve `public/CNAME` and other required static files during builds.

## Component Atlas
- The shared-component integration page lives at `/atlas` and should stay source-only, using existing component mounts and data attributes rather than edits to the component modules.
- When a shared component, route, or interaction changes, update the atlas page and its Playwright coverage in the same change.
- Treat the atlas page as a living reference for shell, primitives, and interaction behavior.

## Neighborhood Briefs
- Treat the home page as the general area hub and use it to point into the neighborhood briefs when the user is still choosing a local angle.
- Add a neighborhood page only when it represents a distinct homeowner problem, housing stock, or exposure pattern that is worth its own route.
- Keep each brief specific to one local pattern and reuse the same page structure: hero, problem framing, best-fit services, scope path, and a clear quote CTA.
- Update the Areas hub and any home-page area links when a new brief is added so the route map stays discoverable.
- Keep the page count, labels, and route names in sync across source pages, the hub page, tests, and generated output.

## Testing
- When a page, component, route, or interaction changes, update the related Vitest and Playwright coverage in the same change.
- Remove or rewrite tests when the underlying behavior is removed or replaced.
- Prefer adding focused coverage close to the changed surface rather than leaving broad, outdated end-to-end assertions in place.
