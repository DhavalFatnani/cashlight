-- Pricing page tier interest (willingness-to-pay signal per click)
create table if not exists public.pricing_intents (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  tier text not null,
  amount_inr integer not null,
  billing_period text not null,
  cta_label text not null,
  created_at timestamptz not null default now()
);

create index if not exists pricing_intents_email_idx
  on public.pricing_intents (email);

create index if not exists pricing_intents_tier_idx
  on public.pricing_intents (tier);

create index if not exists pricing_intents_created_at_idx
  on public.pricing_intents (created_at);

alter table public.pricing_intents enable row level security;
