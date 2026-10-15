# AGENTS.md

Next.js 16 / React 19 admin panel for the Al Qasr fragrance catalog. Originally scaffolded by v0.app.

## Commands

- Install: `pnpm install` (package manager pinned to `pnpm@12.3.4`)
- Dev server: `pnpm dev`
- Build: `pnpm build`
- Production: `pnpm start`

There is **no** test, lint, or typecheck script, and no ESLint/Prettier config. To typecheck, run `pnpm exec tsc --noEmit` manually.

## Gotchas

- `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so `pnpm build` passes even with TypeScript errors. Run `tsc --noEmit` to actually verify types.
- Tailwind v4: no `tailwind.config.*`. Theme tokens live in `app/globals.css` via `@theme` / `:root` CSS variables. Custom fonts (`.font-serif`) are also defined there.
- shadcn is configured with the `base-nova` style (`components.json`) and builds on `@base-ui/react`, not Radix. Add UI via `pnpm dlx shadcn@latest add <name>`; components land in `components/ui/`.
- Path alias `@/*` maps to the repo root (not `src/`).

## Architecture

- `app/` — App Router. `page.tsx` (overview) is a static mock with hardcoded data; `app/products/page.tsx` and `app/categories/page.tsx` are `"use client"` pages wired to the real API. `app/signin/page.tsx` is the public login route.
- `lib/api.ts` — single axios instance for all backend calls. Base URL is hardcoded to `http://localhost:8000`; update it here when deploying the backend. Auth token lives in `sessionStorage` key `access_token` (use the exported `getAuthToken` / `setAuthToken` / `clearAuthToken` helpers) and is sent as a Bearer header. Endpoints are grouped into `authApi` and `catalogApi`.
- `components/auth-guard.tsx` — client-side route guard mounted once in `app/layout.tsx`. It reads `access_token` from `sessionStorage` (middleware cannot see it) and redirects protected routes to `/signin`, and `/signin` back to `/` when a token exists. `"use client"` is required for pages behind it since the guard is client-only.
- API responses are unwrapped defensively as `response.data?.data?.items ?? response.data?.data ?? []` — preserve this pattern when adding list calls. Login reads the token as `response.data?.data?.access_token ?? response.data?.access_token ?? ...`.

## Conventions

- No comments in source.
- Existing pages favor dense inline Tailwind class strings with a single hardcoded warm/neutral palette (e.g. `#f7f6f2`, `#20221f`); match it rather than introducing design tokens.
