# Cashlight Landing Page — Cursor Prompts
# Run in order. Each prompt is self-contained.

---

## PROMPT 1 — Quick fixes (run this first, 5 min)
> Two things are actively damaging trust on every visit. Fix these before anything else.

```
In apps/web/app/(marketing)/page.tsx, make two surgical fixes:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX 1 — HEALTH REPORT SAMPLE: REPLACE ALL ZEROS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The hero health report card and the 8-dimensions section both show "0" for 
every metric. This looks broken. Replace with believable illustrative numbers 
for a fictional profile: Arjun K., 34, Bengaluru, salaried ₹14.5L/yr.

Hero card (the small floating sample card):
- Overall score: 51 / 100
- Grade: C+ · needs attention
- Coverage ratio: ⚠ TIGHT → show "73%" (danger: >65%)
- Real savings rate: ✕ LOW → show "9.2%"
- Emergency buffer: ⚠ THIN → show "1.8 mo"
- Insurance adequacy: ✕ MIS-SOLD → show "2 LIC · 0 term" (keep as-is, it's good)
- Debt-to-income: ✓ OK → show "31%"
- Tax efficiency: ⚠ UNUSED 80C → show "₹60k / ₹1.5L used"

8-dimensions section (the detailed cards):
- Coverage ratio: 73% · 0.9 months of essential outflows
- Real savings rate: 9.2% · net of EMIs & transfers
- Emergency buffer: ₹54,000 · liquid in 48 hours (about 1.8 months)
- Insurance adequacy: Under · ₹25L cover vs ₹1.45Cr obligations
- Equity exposure: 4% · of net worth in growth assets
- Debt-to-income: 31% · EMIs / monthly inflow (mark as ✓ OK)
- Irregular income: 22% · share variable / annual
- Tax efficiency: 40% · 80C: ₹60k used of ₹1.5L limit

Add a small italic note below the 8-dimensions section:
"Numbers shown are illustrative. Yours will be computed from your actual statements."
Style: 11px, var(--text-dim) or equivalent muted colour, centered.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX 2 — FOUNDING TIER COUNTER: FLIP TO SPOTS CLAIMED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Currently shows: spots remaining 200 / 200
This creates zero urgency. Flip it.

Change to show: spots claimed
- Label: "spots claimed"
- Value: "64 / 200" (hardcoded for now — matches the "#64 on the list" shown 
  in the waitlist success state, so it's believable)
- The number 64 can be a JS variable at the top of the component: 
  const SPOTS_CLAIMED = 64
  so it's easy to update manually each week.

Show a small progress bar below the counter:
- Width: 100%, height: 4px, border-radius: 2px
- Background: rgba(255,255,255,0.08)
- Fill: var(--amber) or #F5A623, width: 32% (64/200)
- Animate the fill from 0% to 32% on mount (0.8s ease-out)

This appears in both the pricing section founding tier card AND the final 
bottom CTA section. Update both instances.
```

---

## PROMPT 2 — Hero section rewrite
> Lead with who the reader IS, not what the product DOES.

```
In apps/web/app/(marketing)/page.tsx, rewrite the hero section copy.
Do not change any layout, structure, animations, or styling — copy only.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HEADLINE (the large H1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Replace:
"Your money is more complicated than any app admits."

With (preserve existing italic/bold markup style):
"Most people at your income are still *guessing* with their money."

The word "guessing" should be in Instrument Serif italic, same treatment 
as the existing italicised word in the current headline.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUBHEADLINE / DESCRIPTOR LINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add a new line immediately below the H1, before the body paragraph.
Style it like the existing section label style: 
13–14px, DM Sans, var(--text-muted), not bold.

Text: "Cashlight shows you where you stand — and what the financially sorted do differently."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BODY PARAGRAPH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Replace the existing body paragraph with:

"You juggle multiple accounts, support family, get lumpy bonuses, and pay 
EMIs across banks. Somewhere between your salary and your savings, something 
is going wrong — and no app has been honest enough to show you what.

Cashlight reads your actual statements, benchmarks you against what people 
at your income globally are actually doing, and shows you exactly where the 
gap is. Not charts. Not guesses. A real picture."

Bold "benchmarks you against what people at your income globally are actually 
doing" — this is the new hook and should stand out.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WAITLIST LABEL (above the CTA button)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The small label above the email input currently says:
"So, want in? // founding · 200 spots"

Change to:
"Want to know where you actually stand? // founding · 200 spots"

Everything else in the hero (CTA button, email input, success state, 
the floating health card, the scrolling ticker) stays unchanged.
```

---

## PROMPT 3 — New section: The benchmark bar
> This is the biggest missing piece. Add it between the 8-dimensions section and the "who it's for" section.

```
In apps/web/app/(marketing)/page.tsx, add a new full-width section between 
the "Eight dimensions" section and the "Who it's for" section.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION IDENTITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Section label (amber uppercase, existing label style):
"// where you stand"

Headline (Instrument Serif, large, existing headline style):
"Here's what the world figured out.
And where most Indians actually are."

The word "world" in italic. Line break after the period.

Body (DM Sans, muted, 15–16px):
"Every Cashlight suggestion is anchored to real research — not AI opinion. 
We show you three reference points for every dimension of your financial health: 
where you are, where the median Indian is, and where financially stable people 
globally have landed. No judgment. Just context you've never had before."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BENCHMARK BAR COMPONENT (build 3 of these)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each benchmark bar card has:
- Dimension name (13px, DM Sans 500, text-primary)
- One-line description (11px, muted)
- A horizontal track bar with 3 dot markers
- Three legend items below the bar
- A source citation at the bottom (10px, very muted)

Track bar specs:
- Full width, height: 8px, border-radius: 4px
- Background: rgba(255,255,255,0.08) — the "empty" track
- Colour zones (CSS gradient, left to right): 
  red zone 0–33% (#C0392B at 15% opacity), 
  amber zone 33–66% (#F5A623 at 15% opacity), 
  green zone 66–100% (#1D9E75 at 15% opacity)
- Three circular markers on the track:
  · YOU marker: 12px circle, #C0392B fill, 2px white border
  · INDIA marker: 12px circle, #F5A623 fill, 2px dark border  
  · GLOBAL marker: 12px circle, #1D9E75 fill, 2px dark border
- Markers animate in on scroll (Framer Motion, stagger 0.15s each)

Legend row (below bar, flex space-between):
- Each item: coloured dot (6px) + label text (11px, muted)
- "You" (red dot) | "India median" (amber dot) | "Global standard" (green dot)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE 3 BENCHMARK BARS (data)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BAR 1 — Emergency buffer
- Dimension: "Emergency buffer"
- Description: "Months of expenses you can cover without income"
- Track range: 0 to 12 months
- YOU marker position: 17% (≈ 2 months)  
- INDIA marker position: 42% (≈ 5 months)
- GLOBAL marker position: 58% (≈ 7 months)
- Legend values: "You: ~2 months" | "India median: ~5 months" | "Global: 6–8 months"
- Insight text below (12px, amber-tinted, left-bordered): 
  "A 2-month buffer means one job loss or medical bill puts you in debt. 
  68% of stable households globally maintain at least 5 months liquid."
- Source: "Source: US Federal Reserve Survey of Consumer Finances · SEBI-NCAER 2022"

BAR 2 — Real savings rate
- Dimension: "Real savings rate"
- Description: "What you actually save, net of EMIs and family transfers"
- Track range: 0 to 40%
- YOU marker position: 23% (≈ 9%)
- INDIA marker position: 46% (≈ 18%)
- GLOBAL marker position: 63% (≈ 25%)
- Legend values: "You: ~9%" | "India median: ~18%" | "Global target: 20–25%"
- Insight text: 
  "India's household savings rate is 18.4%. The global benchmark for 
  financial resilience is 20–25%. The gap is usually not income — it's visibility."
- Source: "Source: RBI Annual Report FY24 · World Bank Global Findex 2023"

BAR 3 — Equity exposure
- Dimension: "Equity exposure"
- Description: "Share of your net worth in growth assets"
- Track range: 0 to 80%
- YOU marker position: 6% (≈ 5%)
- INDIA marker position: 11% (≈ 9%)
- GLOBAL marker position: 63% (≈ 50% for age 34 using 100-minus-age rule)
- Legend values: "You: ~5%" | "India median: ~9%" | "Global (age 34): ~66%"
- Insight text: 
  "Indians hold only 5–7% of household wealth in equities. 
  Globally, the standard at age 34 is closer to 65%. 
  The difference, compounded over 20 years, is retirement."
- Source: "Source: RBI Household Balance Sheet Data · Vanguard Target Retirement Research"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Section background: same as page (#080808) with a very subtle 
  horizontal rule top and bottom (1px, rgba(255,255,255,0.06))
- Headline + body: centered, max-width 680px, margin auto
- The 3 bars: stacked vertically, max-width 720px, margin auto, gap 20px
- Each bar card: background #111111, border 1px rgba(255,255,255,0.07), 
  border-radius 12px, padding 24px
- Section vertical padding: 120px top and bottom (matching existing sections)
- Animate section in on scroll with Framer Motion (same pattern as other sections)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOTTOM NOTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Below all 3 bars, centered, 12px muted text:
"As Cashlight grows, these bars will include anonymised data from users 
with your exact income and family profile — making the benchmark 
increasingly specific to people actually like you."

Style: italic, var(--text-dim), max-width 560px, centered.
```

---

## PROMPT 4 — Psychographic audience + rescue narrative
> Replace job-type profiles with emotional states. Add the "drowning" hook.

```
In apps/web/app/(marketing)/page.tsx, make two changes to the audience section:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHANGE 1 — REPLACE "WHO IT'S FOR" PROFILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The current section "For lives that are actually complicated" shows 4 profile 
cards: Salaried professional / Freelancer / Supporting family / Dual-income couple.

Replace these 4 demographic cards with 3 psychographic state cards.
Keep the section headline and label exactly as they are.

The 3 new cards — each has:
- A single letter avatar (styled same as current S/F/P/D avatars)
- A state name (bold, 14px)
- 2–3 lines of copy (12px, muted, line-height 1.6)
- No metadata rows (remove the Accounts / Income / Pain rows)

CARD 1 — The Lost
Avatar letter: L · Avatar background: rgba(245,166,35,0.15)
State name: "Financially lost"
Copy: "You earn decently. You pay your bills. But at the end of the month, 
there's nothing left — and you have no idea where it went. 
It's not a discipline problem. It's a visibility problem."

CARD 2 — The Drowning  
Avatar letter: D · Avatar background: rgba(200,50,50,0.15)
State name: "Financially drowning"
Copy: "A LIC policy you didn't understand. A credit card balance that 
won't go to zero. Decisions that made sense at the time, compounding quietly. 
You know something is wrong. You just can't see what."

CARD 3 — The Curious
Avatar letter: C · Avatar background: rgba(45,212,191,0.1)
State name: "Financially curious"
Copy: "You're doing okay. But you want to know what 'okay' really means — 
what people at your income globally are actually doing, saving, investing. 
You want a number, not a vague sense that you should be doing more."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHANGE 2 — ADD RESCUE CALLOUT (new, between profiles and the honest memo)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Insert a full-width callout block between the 3 profile cards and the 
"Why we can tell you the truth" memo section.

Design: 
- Background: rgba(245,166,35,0.05) — very faint amber wash
- Border: 1px solid rgba(245,166,35,0.2) — amber border
- Border-radius: 12px
- Padding: 40px 48px on desktop, 28px 24px on mobile
- Max-width: 800px, centered

Content:

Small label (amber, existing label style): "// a note"

Headline (Instrument Serif, ~28px):
"If you earn well and still feel broke —"

Subline immediately below (Instrument Serif italic, ~22px, muted):
"it's not you. It's that nobody ever showed you the full picture."

Body (DM Sans, 14px, muted, max-width 560px, margin-top 16px):
"Most Indians who are struggling financially aren't struggling because 
they earn too little. They're struggling because their money is split 
across accounts, committed to family before it's counted, disappearing 
into products they were sold rather than ones they chose — and no tool 
has ever mapped the whole picture honestly.

That's what Cashlight is for."

CTA below body (text link style, amber, 13px, DM Sans 500):
"See how it works ↓"
Link: scrolls to #how section

No button — just a text link. Understated.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION HEADLINE UPDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Also update the "Who it's for" section headline from:
"For lives that are actually complicated."

To:
"You're not bad with money. *You just never had the full picture.*"

The italic treatment on "You just never had the full picture." — 
same Instrument Serif italic as rest of headlines.
The section label above it ("Who it's for") stays unchanged.
```