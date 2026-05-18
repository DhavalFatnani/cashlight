-- Run in Supabase SQL editor or via migration tooling
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'landing',
  created_at timestamptz not null default now(),
  constraint waitlist_email_unique unique (email)
);

create index if not exists waitlist_created_at_idx on public.waitlist (created_at);

alter table public.waitlist enable row level security;

-- Service role bypasses RLS; no public policies needed for server-only writes
