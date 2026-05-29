-- Q4 pain_gap is multi-select; store as text[] (matches situation, feature_priorities).
alter table public.survey_responses
  alter column pain_gap type text[]
  using array[pain_gap];
