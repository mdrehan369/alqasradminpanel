# AGENTS.md

Next.js 16 / React 19 admin panel for the Al Qasr fragrance catalog. Originally scaffolded by v0.app.

## Commands

- Install: `pnpm install` (package manager pinned to `pnpm@12.3.4`)
- Dev server: `pnpm dev`
- Build: `pnpm build`
- Production: `pnpm start`

There is **no** test, lint, or typecheck script, and no ESLint config. `.prettierrc.json` sets `tabWidth: 4` (editor only; prettier is not a dependency). To typecheck, run `pnpm exec tsc --noEmit` manually.

## Gotchas

- `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so `pnpm build` passes even with TypeScript errors. Run `tsc --noEmit` to actually verify types.
- Tailwind v4: no `tailwind.config.*`. Theme tokens live in `app/globals.css` via `@theme` / `:root` CSS variables. Custom fonts (`.font-serif`) are also defined there.
- shadcn is configured with the `base-nova` style (`components.json`) and builds on `@base-ui/react`, not Radix. Add UI via `pnpm dlx shadcn@latest add <name>`; components land in `components/ui/`.
- Path alias `@/*` maps to the repo root (not `src/`).

## Architecture

- `app/` — App Router with route groups. `app/(main)/` is the dashboard shell: its `layout.tsx` renders `SidebarProvider` + `Sidebar` and a content column that owns scrolling (`h-dvh` shell, `overflow-y-auto` on content only); pages are `page.tsx` (overview, static mock data), `products/page.tsx`, `categories/page.tsx`. `app/(auth)/signin/page.tsx` is the public route (thin wrapper around `components/forms/signin.tsx`). Form components live in `components/forms/` and are `"use client"`.
- `components/sidebar.tsx` — exports the default `Sidebar`, the `SidebarProvider` (holds the mobile drawer open state), and the `useSidebar()` hook. The hamburger in `app/(main)/page.tsx` opens it via `useSidebar().setOpen`.
- Data layer — React Query is set up in `components/provider.tsx` (mounted in `app/layout.tsx`). Queries live in `queries/`, hooks (`useProduct`, `useCategory`, `useDebounce`) in `hooks/`, shared types in `types/`, query keys in `lib/constants.ts`.
- `lib/api.ts` — single axios instance for all backend calls. Base URL comes from `NEXT_PUBLIC_BACKEND_URL` in `.env` (currently `http://localhost:8000/api/v1/admin`), so all endpoint paths are relative (e.g. `/auth/`, `/products/`). Auth token lives in a **cookie** named `access_token` (use the exported `getAuthToken` / `setAuthToken` / `clearAuthToken` helpers) and is sent as a Bearer header by the request interceptor. Endpoints are grouped into `authApi` and `catalogApi`.
- `proxy.ts` (repo root) — Next.js proxy/middleware and the primary route guard. It reads the `access_token` **cookie** (not a header) and redirects protected routes to `/signin`, and `/signin` back to `/` when the cookie exists.
- `components/auth-guard.tsx` — client-side guard mounted once in `app/layout.tsx`, kept as a fallback. It reads the same `access_token` cookie via `getAuthToken`; `"use client"` is required for pages behind it since the guard is client-only.
- API responses are unwrapped defensively as `response.data?.data?.items ?? response.data?.data ?? []` — preserve this pattern when adding list calls. Login reads the token as `response.data?.data?.access_token`.

## Conventions

- No comments in source.
- Existing pages favor dense inline Tailwind class strings with a single hardcoded warm/neutral palette (e.g. `#f7f6f2`, `#20221f`); match it rather than introducing design tokens.
