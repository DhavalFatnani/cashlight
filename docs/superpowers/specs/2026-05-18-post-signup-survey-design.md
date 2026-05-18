# Post-signup demand survey — design

**Status:** approved (2026-05-18)
**Author:** brainstormed with user
**Target:** apps/web landing page + packages/db

## Context

The waitlist captures intent (email + position). It tells us nothing about who's signing up, what they currently use, how much they'd pay, or which features they care about. We need that data to prioritise the product and pricing before we build anything substantial.

## Goals

1. Validate demand: who is signing up, what tools they already use, how acute the pain is.
2. Quantify willingness to pay against the published tiers (founding ₹29 / Pro ₹299 / Premium ₹999).
3. Surface the features the audience values most so the build order matches user priority, not founder intuition.
4. Capture qualitative depth via one open-ended prompt.
5. Do this without hurting waitlist conversion or feeling coercive.

## Non-goals

- No anonymous-only path. Survey is tied to the email the user just submitted so responses are segmentable and follow-up'able.
- No multi-step wizard. A single scrollable panel keeps friction low for 7 short questions.
- No incentive scheme (no "complete to lock founding tier"). Optional with a soft nudge only.
- No re-prompting users who skipped. One shot at submission, then done.
- No analytics dashboard in v1. Query Supabase directly.

## User flow

```
1. Visitor lands → fills hero or final-CTA waitlist form → submits email.
2. POST /api/waitlist succeeds → form card transitions to `done` state.
3. Inside the same card, in-place expansion:
     ┌─────────────────────────────────────────────┐
     │ You're #64 on the list.                      │
     │ 6 quick questions while you're here — they   │
     │ shape what we build.                         │
     │ ─────────────────────────────                │
     │ [Q1] Which best describes you?               │
     │ [Q2] What do you use today …                 │
     │ …                                            │
     │ [Q7] What's the one thing … (optional)       │
     │ ─────────────────────────────                │
     │ [Skip]               [Submit (answer 2 more)]│
     └─────────────────────────────────────────────┘
4a. Skip → revert to the existing terminal state:
       "You're #N on the list. We'll be in touch."
4b. Submit → POST /api/survey → terminal state:
       "Thanks — your input shapes what we build."
```

Both hero and final-CTA forms get the survey expansion identically (single `<WaitlistForm>` component owns the state).

## The 7 questions

| # | Type | Question | Options | Required |
|---|---|---|---|---|
| 1 | multi-select | Which best describes you? | Salaried · Freelancer/consultant · Business owner · Supporting family financially · Dual-income household · Student/early career | yes (≥1) |
| 2 | single-select | What do you use today to track your finances? | Nothing — just check statements · A spreadsheet I built · My bank's app · Walnut / Money View · INDmoney / Jupiter / Fi · A CA or financial advisor · Other | yes |
| 3 | single-select (Likert) | In a typical month, how much time do you lose to financial confusion or planning friction? | Zero — I've got a system · <1 hour · 1–3 hours · 3+ hours | yes |
| 4 | single-select | What bothers you most about the financial tools you've tried? | They push insurance / mutual funds · They show data, not insight · They ignore Indian context (UPI, family, bonuses) · The numbers don't help me decide anything · Too cluttered / too many features · Other | yes |
| 4b | text (only if Q4 = Other) | …tell us briefly | free text, ≤200 char | yes when shown |
| 5 | single-select | If Cashlight delivered what we describe, what feels fair to pay monthly? | I wouldn't pay · ₹49 · ₹99 · ₹299 (our Pro tier) · ₹999 (our Premium tier) · More if it's significantly better | yes |
| 6 | multi-select (max 3) | Pick the 3 most valuable features for you. | 8-dimension health report · "What-if" scenario simulator · Tax optimization (80C + regime) · Bonus / irregular income planning · Family / household view · Quarterly human CA review · Insurance adequacy check · Investment portfolio analysis | yes (1–3) |
| 7 | textarea | What's the one thing that would make Cashlight a "yes" for you in week 1? | free text, ≤250 char | no |

### UI rules

- Required fields block submit. Submit button label shows count of remaining: "Answer 2 more" → "Submit".
- Q6: when 3 chips are selected, remaining chips become disabled with a small "max 3" label. Selected chips can still be unselected.
- Q4 "Other": selecting it reveals a single-line input below the options (Q4b). The input is required when "Other" is selected.
- Survey panel scrolls itself into view when it expands, so the user on a long landing doesn't lose context.
- Card height transitions smoothly via CSS `max-height` (no layout jank).
- Skip is always visible, ghost styling, doesn't call the API.

## Data model

New table, new migration. Email is **not unique** — a user could resubmit, take latest per email at analysis time.

```sql
-- packages/db/migrations/001_survey_responses.sql
create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null,                   -- 'hero' | 'footer'
  situation text[] not null,              -- Q1
  current_tool text not null,             -- Q2
  pain_hours text not null,               -- Q3
  pain_gap text not null,                 -- Q4
  pain_gap_other text,                    -- Q4b, nullable
  wtp_band text not null,                 -- Q5
  feature_priorities text[] not null,     -- Q6 (1–3 entries)
  feedback text,                          -- Q7, nullable
  created_at timestamptz not null default now()
);

create index if not exists survey_responses_email_idx
  on public.survey_responses (email);

alter table public.survey_responses enable row level security;
-- No public policies. Service role inserts only.
```

Lowercase, trimmed email is stored (matches `addToWaitlist` normalisation).

Values stored as the raw option text from the questions (e.g. `"₹299 (our Pro tier)"`). Cheap to read; if/when we want richer analytics, we can map text → enums later.

## API

`POST /api/survey` — handler in `apps/web/app/api/survey/route.ts`. Thin: validate the body, delegate to `submitSurvey()` in `@cashlight/db`.

Request:
```jsonc
{
  "email": "you@example.com",
  "source": "hero",                              // "hero" | "footer"
  "situation": ["Salaried"],                     // 1+ strings
  "current_tool": "INDmoney / Jupiter / Fi",
  "pain_hours": "1–3 hours",
  "pain_gap": "Other",
  "pain_gap_other": "Doesn't handle TDS well",   // required only if pain_gap === "Other"
  "wtp_band": "₹299 (our Pro tier)",
  "feature_priorities": [                        // 1–3 entries
    "8-dimension health report",
    "Tax optimization (80C + regime)"
  ],
  "feedback": "I'd pay if it tracks my CA-prepared filings."  // optional
}
```

Response on success: `{ "success": true }` (HTTP 200).
Validation failures: `{ "error": "<reason>" }` (HTTP 400).
Server errors: `{ "error": "Unable to save response" }` (HTTP 500).

Server-side validation:
- Email matches the same regex as `/api/waitlist`.
- All required fields present.
- `source` ∈ `{"hero", "footer"}`.
- Allowed-values check per question (server holds canonical option list).
- `feature_priorities` length between 1 and 3.
- `pain_gap_other` required iff `pain_gap === "Other"`, ≤200 chars.
- `feedback` ≤250 chars.

`@cashlight/db` adds:
- `packages/db/src/survey.ts` — `submitSurvey(payload): Promise<void>`
- Re-export from `packages/db/src/index.ts`

## Front-end implementation

### State machine

`WaitlistForm` extends from its current `idle | loading | done` to:

```
idle
 ↓ submit
loading
 ↓ ok
done                         ← shows position + survey panel
 ├─ skipped                  ← user clicked Skip; collapses panel, shows terminal "We'll be in touch"
 ├─ survey_filling           ← default sub-state inside `done`
 ├─ survey_submitting        ← POST /api/survey in flight
 └─ survey_done              ← "Thanks — your input shapes what we build"
```

### Components

- `WaitlistForm` (existing, extended): owns the waitlist submit, the email it captured, and which terminal sub-state is shown.
- `SurveyPanel` (new): pure rendering of the 7-question form. Props: `email`, `source`, `onSubmitted()`, `onSkipped()`. Owns its own answer state. Calls `/api/survey` on submit.
- `QUESTIONS` constant: single source of truth array used by both `SurveyPanel` and (via API) server-side validation. Lives in a shared file — `apps/web/lib/survey-questions.ts` — importable by client and route handler.

### Styling

Reuse existing tokens — no new colors. Question blocks use `.card-surface` styling; chips reuse `.pill` pattern with selected/disabled states added. Submit/Skip reuse `.btn-primary` and a new `.btn-ghost`.

### Accessibility

- Each question is a `<fieldset>` with a `<legend>` (visually styled but semantic).
- Chips are `<button type="button" role="checkbox" aria-checked>` so screen readers announce state.
- Submit button has `aria-live` region announcing the remaining-count label changes.
- Skip and Submit are focusable in tab order, Skip first.

## Sticky details

1. **Skipping then resubmitting**: skip is terminal — the survey doesn't reappear if the user re-opens the page (we don't track skip server-side). Next time they sign up with a different email, the survey shows again. Acceptable.
2. **Hero vs footer parity**: same component, same survey. `source` lets us see which placement drives more responses.
3. **Mobile layout**: survey panel uses the same compact rules as the waitlist form on `≤640px` (16px input font to prevent iOS zoom, full-width Skip/Submit row, tighter chip padding).
4. **Build-time deps**: zero new packages. All vanilla React + existing styles.
5. **Privacy / disclaimer**: the form-note line below the survey reads "Your responses help us build the right thing. We won't share them."

## Risks / open questions

- **Repeat submissions per email**: not blocked. Analysis takes the latest. If spam becomes a problem, add a simple rate-limit on the route (e.g. one submission per email per 24h).
- **Sample bias**: only people who signed up for the waitlist answer. That's fine for the product-shaping decisions we're making; not a generalisable consumer survey.
- **WTP anchor bias**: showing tier names (₹299 = Pro) anchors people to our pricing. Intentional — we're testing acceptance of these specific tiers, not deriving from scratch.
- **Submission size**: payload is small (<2 KB), no concerns.

## Out of scope (future work)

- Dashboard view of responses.
- Re-survey campaign for people who skipped or submitted long ago.
- A/B testing different question orderings.
- CSV export tooling.

## Acceptance criteria

- A user who submits the waitlist form sees the survey panel expand within the same card.
- Skip returns the standard "You're #N. We'll be in touch." state without writing anything.
- Submit with all required fields stores a row in `survey_responses` and shows the thank-you terminal state.
- Validation errors surface inline below the offending question.
- Mobile (`≤640px`): card scrolls naturally, no horizontal overflow, tap targets ≥44px on Skip/Submit.
- `pnpm typecheck`, `pnpm lint`, `pnpm build` all green.
