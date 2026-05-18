# Cashlight

AI-powered financial health for Indians.

## Setup

```bash
pnpm install
cp .env.example apps/web/.env.local
# Or keep .env.local at repo root and symlink: ln -sf ../../.env.local apps/web/.env.local
# Add Supabase URL, publishable key, and secret key; run packages/db/migrations/000_waitlist.sql
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build the landing page

Scaffold is ready. In Cursor, run the prompt in **`docs/Prompt_1_Landing_page.md`** — project rules in `.cursor/rules/` and `AGENTS.md` guide output quality.

## Structure

- `apps/web` — Next.js marketing site
- `packages/db` — Supabase / waitlist
- `docs/` — product prompts and specs
