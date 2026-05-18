# Cashlight — agent guide

## Product

Cashlight is an AI-powered **financial health platform** for Indians — not a financial advisor. Copy and UX must frame outputs as diagnosis and scenarios, never prescriptions or product recommendations.

**Tagline:** Your money, finally understood.

## Monorepo

| Path | Purpose |
|------|---------|
| `apps/web` | Next.js 14 App Router marketing site + API routes |
| `packages/db` | Supabase client + waitlist data access |
| `docs/Prompt_1_Landing_page.md` | Full landing page spec — follow exactly when building |

## Commands

```bash
pnpm install
pnpm dev          # turbo — starts apps/web on :3000
pnpm build
pnpm typecheck
pnpm lint
```

## Environment

Copy `.env.example` → `apps/web/.env.local`. Required for waitlist API:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (client / RLS)
- `SUPABASE_SECRET_KEY` (server only — API routes via `@cashlight/db`)

Run `packages/db/migrations/000_waitlist.sql` in Supabase before testing signups.

## Landing page implementation

- **Primary file:** `apps/web/app/(marketing)/page.tsx` (single file unless > ~400 lines)
- **Reuse:** `WaitlistForm`, `Section`, tokens in `tailwind.config.ts`, `lib/animations.ts`
- **Do not add** external UI libraries — Tailwind + Framer Motion only
- **Fonts:** already wired in `app/layout.tsx` via `lib/fonts.ts`
- **API:** `POST /api/waitlist` → `@cashlight/db` `addToWaitlist`

## Design tokens (dark only)

- Background `#080808`, cards `#111111`, accent `#F5A623`
- Text: foreground / muted (55%) / subtle (28%)
- No purple, blue, or generic fintech gradients

## Code quality bar

1. **Server vs client:** keep `page.tsx` as server component; extract `"use client"` only for forms, motion, nav scroll
2. **Performance:** dynamic-import heavy motion blocks if needed; respect `prefers-reduced-motion`
3. **Accessibility:** semantic landmarks, form labels, focus states, `aria-live` on waitlist success
4. **Types:** strict TypeScript, no `any`
5. **Imports:** direct paths (`@/components/...`), no barrel files
6. **Copy:** follow brand rules in `.cursor/rules/brand-copy.mdc`

## When stuck

Read `docs/Prompt_1_Landing_page.md` section-by-section. Do not invent copy, colors, or positioning that contradicts the spec.
