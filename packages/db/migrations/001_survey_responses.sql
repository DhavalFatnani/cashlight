-- Run in Supabase SQL editor or via migration tooling
create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null,
  situation text[] not null,
  current_tool text not null,
  pain_hours text not null,
  pain_gap text not null,
  pain_gap_other text,
  wtp_band text not null,
  feature_priorities text[] not null,
  feedback text,
  created_at timestamptz not null default now()
);

create index if not exists survey_responses_email_idx
  on public.survey_responses (email);

create index if not exists survey_responses_created_at_idx
  on public.survey_responses (created_at);

alter table public.survey_responses enable row level security;

-- Service role bypasses RLS; no public policies needed for server-only writes.
