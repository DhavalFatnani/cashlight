# Post-signup demand survey — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 7-question demand survey that expands inside the waitlist form card after a successful signup, optional with a skip option, persisted to a new `survey_responses` Supabase table.

**Architecture:** A shared `QUESTIONS` constant in `apps/web/lib/survey-questions.ts` drives both the client UI (`<SurveyPanel>`) and server-side allowed-values validation (route handler `apps/web/app/api/survey/route.ts`). DB access goes through `packages/db` (`submitSurvey`). `WaitlistForm` extends its existing state machine to render `<SurveyPanel>` in-place when the waitlist submission succeeds.

**Tech Stack:** Next.js 14 App Router (TS), React 18, Supabase (`@supabase/supabase-js`), pnpm workspaces, vanilla CSS in `globals.css`. **No new dependencies.**

**Testing approach:** The project doesn't have a test framework wired (no `vitest`/`jest`). Per the project's existing conventions (AGENTS.md), `pnpm typecheck` + `pnpm lint` + `pnpm build` + manual browser verification are the validation loop. This plan follows that loop. The pure validation function is structured so a future test framework can cover it without refactoring.

**Spec:** [`docs/superpowers/specs/2026-05-18-post-signup-survey-design.md`](../specs/2026-05-18-post-signup-survey-design.md)

---

## File map

**Create:**
- `packages/db/migrations/001_survey_responses.sql` — DB migration
- `supabase/migrations/001_survey_responses.sql` — same migration mirrored (parity with existing 000)
- `packages/db/src/survey.ts` — `submitSurvey()` + payload type
- `apps/web/lib/survey-questions.ts` — `QUESTIONS` const, allowed-values lookup helpers, response payload type
- `apps/web/app/api/survey/route.ts` — `POST /api/survey` handler
- `apps/web/app/api/survey/validate.ts` — pure `validateSurveyPayload()` function (importable by route handler; structured so tests can be added later)
- `apps/web/components/marketing/survey-panel.tsx` — survey UI client component

**Modify:**
- `packages/db/src/index.ts` — re-export `submitSurvey`, `SurveyPayload`
- `apps/web/components/marketing/landing-page.tsx` — extend `WaitlistForm` state, render `<SurveyPanel>` on `done`
- `apps/web/app/globals.css` — survey panel styles, chip selected/disabled states, `.btn-ghost`, smooth expansion

---

## Task 1: Database migration

**Files:**
- Create: `packages/db/migrations/001_survey_responses.sql`
- Create: `supabase/migrations/001_survey_responses.sql`

- [ ] **Step 1: Write the migration**

Create `packages/db/migrations/001_survey_responses.sql`:

```sql
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
```

- [ ] **Step 2: Mirror to `supabase/migrations/`**

Copy the same file to `supabase/migrations/001_survey_responses.sql` so the Supabase CLI workflow stays in sync (existing repo convention).

- [ ] **Step 3: Apply migration in Supabase**

Open Supabase dashboard → SQL editor → paste the migration → run. Confirm via Table Editor that `survey_responses` exists with the listed columns and RLS enabled.

- [ ] **Step 4: Commit**

```bash
git add packages/db/migrations/001_survey_responses.sql supabase/migrations/001_survey_responses.sql
git commit -m "Add survey_responses table migration"
```

---

## Task 2: `submitSurvey()` in `@cashlight/db`

**Files:**
- Create: `packages/db/src/survey.ts`
- Modify: `packages/db/src/index.ts`

- [ ] **Step 1: Write `submitSurvey` and payload type**

Create `packages/db/src/survey.ts`:

```ts
import { getSupabaseServer } from "./client";

export type SurveyPayload = {
  email: string;
  source: string;
  situation: string[];
  current_tool: string;
  pain_hours: string;
  pain_gap: string;
  pain_gap_other: string | null;
  wtp_band: string;
  feature_priorities: string[];
  feedback: string | null;
};

export async function submitSurvey(payload: SurveyPayload): Promise<void> {
  const supabase = getSupabaseServer();

  const { error } = await supabase.from("survey_responses").insert({
    email: payload.email,
    source: payload.source,
    situation: payload.situation,
    current_tool: payload.current_tool,
    pain_hours: payload.pain_hours,
    pain_gap: payload.pain_gap,
    pain_gap_other: payload.pain_gap_other,
    wtp_band: payload.wtp_band,
    feature_priorities: payload.feature_priorities,
    feedback: payload.feedback,
  });

  if (error) throw error;
}
```

- [ ] **Step 2: Re-export from package index**

Edit `packages/db/src/index.ts`. After the existing exports, append:

```ts
export { submitSurvey, type SurveyPayload } from "./survey";
```

The full file should now read:

```ts
export { getSupabaseServer, getSupabaseAdmin } from "./client";
export { getSupabaseSecretKey, getSupabaseUrl } from "./env";
export { addToWaitlist, getWaitlistCount, type WaitlistResult } from "./waitlist";
export { submitSurvey, type SurveyPayload } from "./survey";
```

- [ ] **Step 3: Verify typecheck**

Run: `pnpm typecheck`
Expected: `Tasks: 2 successful, 2 total` with no TS errors.

- [ ] **Step 4: Commit**

```bash
git add packages/db/src/survey.ts packages/db/src/index.ts
git commit -m "Add submitSurvey to @cashlight/db"
```

---

## Task 3: Shared questions definition

**Files:**
- Create: `apps/web/lib/survey-questions.ts`

- [ ] **Step 1: Write the questions constant + types**

Create `apps/web/lib/survey-questions.ts`:

```ts
/**
 * Single source of truth for the post-signup survey.
 * Imported by both the client UI (`SurveyPanel`) and the API route
 * (`/api/survey`) so the allowed values stay in lock-step.
 */

export const SITUATION_OPTIONS = [
  "Salaried",
  "Freelancer/consultant",
  "Business owner",
  "Supporting family financially",
  "Dual-income household",
  "Student/early career",
] as const;

export const CURRENT_TOOL_OPTIONS = [
  "Nothing — just check statements",
  "A spreadsheet I built",
  "My bank's app",
  "Walnut / Money View",
  "INDmoney / Jupiter / Fi",
  "A CA or financial advisor",
  "Other",
] as const;

export const PAIN_HOURS_OPTIONS = [
  "Zero — I've got a system",
  "Less than 1 hour",
  "1–3 hours",
  "3+ hours",
] as const;

export const PAIN_GAP_OPTIONS = [
  "They push insurance / mutual funds",
  "They show data, not insight",
  "They ignore Indian context (UPI, family, bonuses)",
  "The numbers don't help me decide anything",
  "Too cluttered / too many features",
  "Other",
] as const;

export const WTP_OPTIONS = [
  "I wouldn't pay",
  "₹49/mo",
  "₹99/mo",
  "₹299/mo (our Pro tier)",
  "₹999/mo (our Premium tier)",
  "More if it's significantly better",
] as const;

export const FEATURE_OPTIONS = [
  "8-dimension health report",
  '"What-if" scenario simulator',
  "Tax optimization (80C + regime)",
  "Bonus / irregular income planning",
  "Family / household view",
  "Quarterly human CA review",
  "Insurance adequacy check",
  "Investment portfolio analysis",
] as const;

export const SOURCE_OPTIONS = ["hero", "footer"] as const;

export const FEATURE_MAX = 3;
export const PAIN_GAP_OTHER_MAX = 200;
export const FEEDBACK_MAX = 250;

export type SurveyResponse = {
  email: string;
  source: (typeof SOURCE_OPTIONS)[number];
  situation: Array<(typeof SITUATION_OPTIONS)[number]>;
  current_tool: (typeof CURRENT_TOOL_OPTIONS)[number];
  pain_hours: (typeof PAIN_HOURS_OPTIONS)[number];
  pain_gap: (typeof PAIN_GAP_OPTIONS)[number];
  pain_gap_other: string | null;
  wtp_band: (typeof WTP_OPTIONS)[number];
  feature_priorities: Array<(typeof FEATURE_OPTIONS)[number]>;
  feedback: string | null;
};
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm typecheck`
Expected: green.

- [ ] **Step 3: Commit**

```bash
git add apps/web/lib/survey-questions.ts
git commit -m "Add shared survey questions definition"
```

---

## Task 4: Pure validator

**Files:**
- Create: `apps/web/app/api/survey/validate.ts`

- [ ] **Step 1: Write the validator**

Create `apps/web/app/api/survey/validate.ts`:

```ts
import {
  CURRENT_TOOL_OPTIONS,
  FEATURE_MAX,
  FEATURE_OPTIONS,
  FEEDBACK_MAX,
  PAIN_GAP_OPTIONS,
  PAIN_GAP_OTHER_MAX,
  PAIN_HOURS_OPTIONS,
  SITUATION_OPTIONS,
  SOURCE_OPTIONS,
  type SurveyResponse,
  WTP_OPTIONS,
} from "@/lib/survey-questions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidateResult =
  | { ok: true; value: SurveyResponse }
  | { ok: false; error: string };

function isStringFrom<T extends readonly string[]>(
  value: unknown,
  options: T,
): value is T[number] {
  return typeof value === "string" && (options as readonly string[]).includes(value);
}

function isStringArrayFrom<T extends readonly string[]>(
  value: unknown,
  options: T,
): value is Array<T[number]> {
  if (!Array.isArray(value)) return false;
  return value.every((v) => isStringFrom(v, options));
}

export function validateSurveyPayload(input: unknown): ValidateResult {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: "Body must be a JSON object" };
  }
  const body = input as Record<string, unknown>;

  const emailRaw = body.email;
  if (typeof emailRaw !== "string") {
    return { ok: false, error: "Email is required" };
  }
  const email = emailRaw.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Invalid email" };
  }

  if (!isStringFrom(body.source, SOURCE_OPTIONS)) {
    return { ok: false, error: "Invalid source" };
  }

  if (
    !isStringArrayFrom(body.situation, SITUATION_OPTIONS) ||
    body.situation.length === 0
  ) {
    return { ok: false, error: "Pick at least one situation" };
  }

  if (!isStringFrom(body.current_tool, CURRENT_TOOL_OPTIONS)) {
    return { ok: false, error: "Invalid current_tool" };
  }

  if (!isStringFrom(body.pain_hours, PAIN_HOURS_OPTIONS)) {
    return { ok: false, error: "Invalid pain_hours" };
  }

  if (!isStringFrom(body.pain_gap, PAIN_GAP_OPTIONS)) {
    return { ok: false, error: "Invalid pain_gap" };
  }

  let painGapOther: string | null = null;
  if (body.pain_gap === "Other") {
    if (typeof body.pain_gap_other !== "string") {
      return { ok: false, error: "Please describe your other gap" };
    }
    const trimmed = body.pain_gap_other.trim();
    if (trimmed.length === 0) {
      return { ok: false, error: "Please describe your other gap" };
    }
    if (trimmed.length > PAIN_GAP_OTHER_MAX) {
      return { ok: false, error: `Keep that under ${PAIN_GAP_OTHER_MAX} characters` };
    }
    painGapOther = trimmed;
  }

  if (!isStringFrom(body.wtp_band, WTP_OPTIONS)) {
    return { ok: false, error: "Invalid wtp_band" };
  }

  if (
    !isStringArrayFrom(body.feature_priorities, FEATURE_OPTIONS) ||
    body.feature_priorities.length < 1 ||
    body.feature_priorities.length > FEATURE_MAX
  ) {
    return {
      ok: false,
      error: `Pick between 1 and ${FEATURE_MAX} features`,
    };
  }

  let feedback: string | null = null;
  if (body.feedback !== undefined && body.feedback !== null) {
    if (typeof body.feedback !== "string") {
      return { ok: false, error: "Feedback must be text" };
    }
    const trimmed = body.feedback.trim();
    if (trimmed.length > FEEDBACK_MAX) {
      return { ok: false, error: `Keep feedback under ${FEEDBACK_MAX} characters` };
    }
    feedback = trimmed.length > 0 ? trimmed : null;
  }

  return {
    ok: true,
    value: {
      email,
      source: body.source,
      situation: body.situation,
      current_tool: body.current_tool,
      pain_hours: body.pain_hours,
      pain_gap: body.pain_gap,
      pain_gap_other: painGapOther,
      wtp_band: body.wtp_band,
      feature_priorities: body.feature_priorities,
      feedback,
    },
  };
}
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm typecheck`
Expected: green.

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/api/survey/validate.ts
git commit -m "Add pure validator for survey payloads"
```

---

## Task 5: API route — `POST /api/survey`

**Files:**
- Create: `apps/web/app/api/survey/route.ts`

- [ ] **Step 1: Write the route handler**

Create `apps/web/app/api/survey/route.ts`:

```ts
import { submitSurvey } from "@cashlight/db";
import { NextResponse } from "next/server";

import { validateSurveyPayload } from "./validate";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = validateSurveyPayload(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    await submitSurvey(result.value);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[survey]", error);
    return NextResponse.json(
      { error: "Unable to save response" },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 2: Verify typecheck + lint**

Run: `pnpm typecheck && pnpm lint`
Expected: both green.

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/api/survey/route.ts
git commit -m "Add POST /api/survey route"
```

---

## Task 6: CSS for survey panel

**Files:**
- Modify: `apps/web/app/globals.css`

Append the new survey styles to `globals.css`. They mostly reuse existing tokens (`--card-2`, `--gold`, `--ink-mute`).

- [ ] **Step 1: Add the styles**

Append to the end of `apps/web/app/globals.css`:

```css
/* ============================================================
   Survey panel (post-signup expansion of .hero-form)
   ============================================================ */

.survey-panel {
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin-top: 18px;
  padding-top: 22px;
  border-top: 1px dashed var(--line);
  animation: heroFormIn .5s cubic-bezier(.2, .7, .2, 1) both;
}
.survey-panel .survey-intro {
  font-family: var(--serif);
  font-style: italic;
  font-size: 15px;
  color: var(--ink-dim);
  line-height: 1.55;
}
.survey-panel .survey-intro b {
  font-style: normal;
  color: var(--ink);
  font-family: var(--sans);
  font-weight: 500;
}
.survey-panel fieldset {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.survey-panel legend {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--ink-dim);
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.survey-panel legend .legend-hint {
  font-family: var(--serif);
  font-style: italic;
  font-size: 11px;
  text-transform: none;
  letter-spacing: 0;
  color: var(--ink-mute);
}
.survey-panel .chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.survey-panel .chip {
  font-family: var(--mono);
  font-size: 12px;
  background: var(--card);
  border: 1px solid var(--line);
  color: var(--ink-dim);
  padding: 8px 14px;
  border-radius: 99px;
  cursor: pointer;
  transition: all .15s;
}
.survey-panel .chip:hover:not(:disabled) {
  color: var(--gold);
  border-color: var(--line-2);
}
.survey-panel .chip.selected {
  background: rgba(232, 170, 80, .12);
  border-color: var(--gold);
  color: var(--gold);
}
.survey-panel .chip:disabled {
  opacity: .35;
  cursor: not-allowed;
}
.survey-panel input.other-input,
.survey-panel textarea.feedback-input {
  background: rgba(0, 0, 0, .3);
  border: 1px solid var(--line-2);
  color: var(--ink);
  font: inherit;
  font-family: var(--mono);
  font-size: 13px;
  padding: 12px 14px;
  border-radius: 8px;
  transition: border-color .18s;
  width: 100%;
}
.survey-panel textarea.feedback-input {
  resize: vertical;
  min-height: 88px;
  line-height: 1.5;
}
.survey-panel input.other-input:focus,
.survey-panel textarea.feedback-input:focus {
  outline: none;
  border-color: var(--gold);
}
.survey-panel input.other-input::placeholder,
.survey-panel textarea.feedback-input::placeholder {
  color: var(--ink-mute);
}
.survey-panel .char-count {
  align-self: flex-end;
  font-family: var(--mono);
  font-size: 10px;
  color: var(--ink-mute);
}
.survey-panel .survey-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
}
.survey-panel .survey-status {
  flex: 1;
  font-family: var(--serif);
  font-style: italic;
  font-size: 12.5px;
  color: var(--ink-mute);
}
.survey-panel .survey-status.error {
  color: var(--red);
  font-style: normal;
  font-family: var(--mono);
  letter-spacing: .02em;
}
.btn-ghost {
  background: transparent;
  color: var(--ink-dim);
  border: 1px solid var(--line-2);
  font-family: var(--display);
  font-weight: 500;
  font-size: 13px;
  letter-spacing: .01em;
  padding: 11px 18px;
  cursor: pointer;
  border-radius: 8px;
  transition: all .2s;
}
.btn-ghost:hover { color: var(--gold); border-color: var(--gold); }
.btn-ghost:disabled { opacity: .5; cursor: not-allowed; }
.survey-panel .survey-thanks {
  font-family: var(--serif);
  font-style: italic;
  font-size: 16px;
  color: var(--gold);
}

@media (max-width: 640px) {
  .survey-panel { gap: 18px; margin-top: 14px; padding-top: 18px; }
  .survey-panel .survey-intro { font-size: 14px; }
  .survey-panel .chip { font-size: 11.5px; padding: 8px 12px; }
  .survey-panel textarea.feedback-input { font-size: 16px; }
  .survey-panel input.other-input { font-size: 16px; }
  .survey-panel .survey-actions {
    flex-wrap: wrap;
    gap: 10px;
  }
  .btn-ghost { min-height: 44px; }
}
```

- [ ] **Step 2: Verify the build still passes**

Run: `pnpm build`
Expected: green (CSS-only change should not affect TS or pages).

- [ ] **Step 3: Commit**

```bash
git add apps/web/app/globals.css
git commit -m "Add survey panel + ghost button styles"
```

---

## Task 7: `<SurveyPanel>` component

**Files:**
- Create: `apps/web/components/marketing/survey-panel.tsx`

- [ ] **Step 1: Write the component**

Create `apps/web/components/marketing/survey-panel.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";

import {
  CURRENT_TOOL_OPTIONS,
  FEATURE_MAX,
  FEATURE_OPTIONS,
  FEEDBACK_MAX,
  PAIN_GAP_OPTIONS,
  PAIN_GAP_OTHER_MAX,
  PAIN_HOURS_OPTIONS,
  SITUATION_OPTIONS,
  type SurveyResponse,
  WTP_OPTIONS,
} from "@/lib/survey-questions";

type SurveyPanelProps = {
  email: string;
  source: "hero" | "footer";
  onSubmitted: () => void;
  onSkipped: () => void;
};

type AnswerState = {
  situation: string[];
  current_tool: string | null;
  pain_hours: string | null;
  pain_gap: string | null;
  pain_gap_other: string;
  wtp_band: string | null;
  feature_priorities: string[];
  feedback: string;
};

const EMPTY: AnswerState = {
  situation: [],
  current_tool: null,
  pain_hours: null,
  pain_gap: null,
  pain_gap_other: "",
  wtp_band: null,
  feature_priorities: [],
  feedback: "",
};

function toggleIn<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Chip({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      className={`chip${selected ? " selected" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export function SurveyPanel({
  email,
  source,
  onSubmitted,
  onSkipped,
}: SurveyPanelProps) {
  const [answers, setAnswers] = useState<AnswerState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const remainingRequired = useMemo(() => {
    let n = 0;
    if (answers.situation.length === 0) n++;
    if (!answers.current_tool) n++;
    if (!answers.pain_hours) n++;
    if (!answers.pain_gap) n++;
    if (answers.pain_gap === "Other" && answers.pain_gap_other.trim().length === 0) n++;
    if (!answers.wtp_band) n++;
    if (answers.feature_priorities.length === 0) n++;
    return n;
  }, [answers]);

  const featureCapHit = answers.feature_priorities.length >= FEATURE_MAX;

  async function onSubmit() {
    if (remainingRequired > 0 || submitting) return;
    setSubmitting(true);
    setError(null);

    const payload: SurveyResponse = {
      email,
      source,
      situation: answers.situation as SurveyResponse["situation"],
      current_tool: answers.current_tool as SurveyResponse["current_tool"],
      pain_hours: answers.pain_hours as SurveyResponse["pain_hours"],
      pain_gap: answers.pain_gap as SurveyResponse["pain_gap"],
      pain_gap_other:
        answers.pain_gap === "Other" ? answers.pain_gap_other.trim() : null,
      wtp_band: answers.wtp_band as SurveyResponse["wtp_band"],
      feature_priorities:
        answers.feature_priorities as SurveyResponse["feature_priorities"],
      feedback: answers.feedback.trim().length > 0 ? answers.feedback.trim() : null,
    };

    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setError(data.error ?? "Something went wrong. Try again.");
        setSubmitting(false);
        return;
      }
      setDone(true);
      onSubmitted();
    } catch {
      setError("Network error. Try again.");
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="survey-panel" role="status" aria-live="polite">
        <p className="survey-thanks">
          Thanks — your input shapes what we build.
        </p>
      </div>
    );
  }

  return (
    <div className="survey-panel">
      <p className="survey-intro">
        <b>6 quick questions</b> while you&apos;re here. They shape what we build.
      </p>

      <fieldset>
        <legend>1 · Which best describes you?</legend>
        <div className="chip-row" role="group">
          {SITUATION_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              selected={answers.situation.includes(opt)}
              onClick={() =>
                setAnswers((a) => ({ ...a, situation: toggleIn(a.situation, opt) }))
              }
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>2 · What do you use today?</legend>
        <div className="chip-row" role="group">
          {CURRENT_TOOL_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              selected={answers.current_tool === opt}
              onClick={() => setAnswers((a) => ({ ...a, current_tool: opt }))}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>3 · Time lost per month to financial friction?</legend>
        <div className="chip-row" role="group">
          {PAIN_HOURS_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              selected={answers.pain_hours === opt}
              onClick={() => setAnswers((a) => ({ ...a, pain_hours: opt }))}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>4 · What bothers you most about money tools?</legend>
        <div className="chip-row" role="group">
          {PAIN_GAP_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              selected={answers.pain_gap === opt}
              onClick={() =>
                setAnswers((a) => ({
                  ...a,
                  pain_gap: opt,
                  pain_gap_other: opt === "Other" ? a.pain_gap_other : "",
                }))
              }
            />
          ))}
        </div>
        {answers.pain_gap === "Other" && (
          <input
            type="text"
            className="other-input"
            placeholder="Briefly…"
            maxLength={PAIN_GAP_OTHER_MAX}
            value={answers.pain_gap_other}
            onChange={(e) =>
              setAnswers((a) => ({ ...a, pain_gap_other: e.target.value }))
            }
          />
        )}
      </fieldset>

      <fieldset>
        <legend>5 · What feels fair to pay monthly?</legend>
        <div className="chip-row" role="group">
          {WTP_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              selected={answers.wtp_band === opt}
              onClick={() => setAnswers((a) => ({ ...a, wtp_band: opt }))}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>
          6 · Pick the 3 most valuable features.{" "}
          <span className="legend-hint">
            {answers.feature_priorities.length}/{FEATURE_MAX} picked
          </span>
        </legend>
        <div className="chip-row" role="group">
          {FEATURE_OPTIONS.map((opt) => {
            const selected = answers.feature_priorities.includes(opt);
            return (
              <Chip
                key={opt}
                label={opt}
                selected={selected}
                disabled={!selected && featureCapHit}
                onClick={() =>
                  setAnswers((a) => ({
                    ...a,
                    feature_priorities: toggleIn(a.feature_priorities, opt),
                  }))
                }
              />
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend>
          7 · What would make Cashlight a &quot;yes&quot; for you in week 1?{" "}
          <span className="legend-hint">optional</span>
        </legend>
        <textarea
          className="feedback-input"
          placeholder="One specific thing…"
          maxLength={FEEDBACK_MAX}
          value={answers.feedback}
          onChange={(e) =>
            setAnswers((a) => ({ ...a, feedback: e.target.value }))
          }
        />
        <span className="char-count">
          {answers.feedback.length}/{FEEDBACK_MAX}
        </span>
      </fieldset>

      <div className="survey-actions">
        <span className={`survey-status${error ? " error" : ""}`}>
          {error
            ? error
            : remainingRequired > 0
              ? `Answer ${remainingRequired} more`
              : "Ready to submit"}
        </span>
        <button
          type="button"
          className="btn-ghost"
          onClick={onSkipped}
          disabled={submitting}
        >
          Skip
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={onSubmit}
          disabled={submitting || remainingRequired > 0}
        >
          {submitting ? "Sending…" : "Submit"}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck + lint**

Run: `pnpm typecheck && pnpm lint`
Expected: both green.

- [ ] **Step 3: Commit**

```bash
git add apps/web/components/marketing/survey-panel.tsx
git commit -m "Add SurveyPanel client component"
```

---

## Task 8: Wire `<SurveyPanel>` into `WaitlistForm`

**Files:**
- Modify: `apps/web/components/marketing/landing-page.tsx`

The current `WaitlistForm` has `state: idle | loading | done` and shows the success text when `done`. Extend it so the `done` state renders a sub-state (`filling | submitted | skipped`) and conditionally shows `<SurveyPanel>` or the existing terminal text.

- [ ] **Step 1: Import `SurveyPanel`**

In `apps/web/components/marketing/landing-page.tsx`, add this import alongside the other component imports (near the top of the file, after `useState` import):

```tsx
import { SurveyPanel } from "@/components/marketing/survey-panel";
```

- [ ] **Step 2: Extend the `FormState` and add survey sub-state**

Replace the existing `FormState` declaration:

```tsx
type FormState = "idle" | "loading" | "done" | "error";
```

with:

```tsx
type FormState = "idle" | "loading" | "done" | "error";
type SurveyState = "filling" | "submitted" | "skipped";
```

- [ ] **Step 3: Track survey state and email inside `WaitlistForm`**

Inside `WaitlistForm`, alongside the existing `useState` calls, add:

```tsx
const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
const [surveyState, setSurveyState] = useState<SurveyState>("filling");
```

- [ ] **Step 4: Capture the email on successful submission**

In the existing `onSubmit` handler, after `setState("done")` and the `if (data.isNew) onSignup?.()` line, also store the email:

Find this block:

```tsx
setPosition(data.position ?? null);
setState("done");
if (data.isNew) onSignup?.();
```

Replace with:

```tsx
setPosition(data.position ?? null);
setSubmittedEmail(v);
setSurveyState("filling");
setState("done");
if (data.isNew) onSignup?.();
```

(`v` is the validated email already in scope from the earlier `const v = email.trim();`)

- [ ] **Step 5: Render survey panel in `done` state**

Find the existing `form-success` div inside the form:

```tsx
<div className="form-success" role="status" aria-live="polite">
  You&apos;re <b>#{position ?? 64}</b> on the list. We&apos;ll be in touch.
</div>
```

Replace with:

```tsx
<div className="form-success" role="status" aria-live="polite">
  {surveyState === "skipped" || surveyState === "submitted" ? (
    <>
      You&apos;re <b>#{position ?? 64}</b> on the list. We&apos;ll be in touch.
    </>
  ) : (
    <>
      You&apos;re <b>#{position ?? 64}</b> on the list.
    </>
  )}
</div>
{state === "done" && surveyState === "filling" && submittedEmail && (
  <SurveyPanel
    email={submittedEmail}
    source={source}
    onSubmitted={() => setSurveyState("submitted")}
    onSkipped={() => setSurveyState("skipped")}
  />
)}
```

- [ ] **Step 6: Verify typecheck, lint, build**

Run: `pnpm typecheck && pnpm lint && pnpm build`
Expected: all green. Build output should now show `/api/survey` as a function route alongside `/api/waitlist`.

- [ ] **Step 7: Commit**

```bash
git add apps/web/components/marketing/landing-page.tsx
git commit -m "Render survey panel after waitlist signup"
```

---

## Task 9: End-to-end manual verification

- [ ] **Step 1: Start dev server**

Run: `pnpm dev`
Expected: `▲ Next.js 14.x.x ... - Local: http://localhost:3000` and no errors.

- [ ] **Step 2: Hero flow — happy path**

1. Open http://localhost:3000
2. Enter a fresh email in the hero waitlist form (e.g. `test-survey-{timestamp}@example.com`)
3. Click "Get early access"
4. Verify: position appears (`You're #N on the list.`) and the survey panel expands below.
5. Fill all 7 questions. Confirm:
    - Q1 multi-select toggles work
    - Q4 "Other" reveals the text input; submit button stays disabled until that input has content
    - Q6 disables remaining chips once 3 are picked
    - Q7 character counter updates
    - Submit button shows "Answer N more" while required fields remain; becomes "Submit" when complete
6. Click Submit.
7. Verify: button shows "Sending…", then the panel replaces with "Thanks — your input shapes what we build."
8. Open Supabase dashboard → Table Editor → `survey_responses`. Confirm a row exists with the submitted answers.

- [ ] **Step 3: Footer flow — skip path**

1. Reload http://localhost:3000, scroll to final CTA section.
2. Enter a different fresh email, submit.
3. When the survey panel appears, click "Skip".
4. Verify: panel collapses, terminal state shows `You're #N on the list. We'll be in touch.`.
5. Confirm no row was added to `survey_responses` for the skipped email.

- [ ] **Step 4: Validation error path**

1. Reload page, submit waitlist with a third fresh email.
2. In the survey, pick "Other" for Q4 but leave the text input blank — confirm Submit stays disabled with "Answer 1 more".
3. Fill the "Other" input, complete the rest, submit. Confirm it succeeds.

- [ ] **Step 5: Mobile responsiveness check**

In the browser DevTools, switch to iPhone-12 (390px) viewport. Walk through hero flow again:
- Chips wrap cleanly with no horizontal overflow.
- Skip/Submit row wraps to a second line if needed; both buttons remain ≥44px tall.
- Inputs do not trigger iOS auto-zoom (font ≥16px).

- [ ] **Step 6: Stop dev server**

Press `Ctrl+C` in the terminal running `pnpm dev`.

---

## Task 10: Final checks and push

- [ ] **Step 1: Confirm full build + lint + typecheck pass**

```bash
pnpm typecheck && pnpm lint && pnpm build
```
Expected: all green. Build output lists `/api/survey` as a function route.

- [ ] **Step 2: Push to deploy**

```bash
git push
```

Wait for the auto-deploy on Vercel. Confirm via:

```bash
vercel ls --cwd apps/web | head -5
```

Latest deployment should reach `● Ready`. Open the production URL and repeat the hero happy-path one more time against the live Supabase.

- [ ] **Step 3: (Optional) Set preview-environment env vars**

If preview deploys are needed for branches other than `main`, add the three Supabase env vars to the Preview environment in the Vercel dashboard (the CLI's `vercel env add` for preview has had reliability issues in this project).

---

## Self-review notes

**Spec coverage:**
- Goals 1–5 → Tasks 1, 2, 3, 7, 8 produce the data model, server function, questions, UI, and integration.
- Optional skip + soft nudge → Task 7 Skip button + Task 8 sub-state.
- Tied to email + segmentable → Task 1 column + Task 7 passing `email` from `WaitlistForm`.
- Both hero and footer → Task 8 wiring uses the shared component, so both placements get it.
- Required vs optional fields → enforced both in Task 4 validator and Task 7 UI.
- Q6 max-3 cap → Task 7 `featureCapHit` disables remaining chips.
- Mobile rules → Task 6 `@media (max-width: 640px)` block + Task 9 Step 5 verification.

**Type consistency:** `SurveyResponse` (Task 3) and `SurveyPayload` (Task 2) have matching shapes; `submitSurvey` accepts the validated `SurveyResponse` value from the validator. Field names and option values are pulled from the same constants throughout.

**No placeholders or hand-waves:** every step has the exact code, file path, and command needed.
