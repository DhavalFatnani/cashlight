# Cashlight Landing Page — Design Polish Prompts
# Run AFTER the 4 content prompts. Pure CSS/design — no copy changes.

---

## PROMPT 5 — Visual depth: grain, nav, progress bar, card glow
> Three surgical CSS changes that separate "good" from "memorable."

```
In apps/web/app/(marketing)/page.tsx and any associated CSS/globals,
make the following design-only changes. No copy, no layout structure changes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX 1 — BACKGROUND GRAIN TEXTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The page background (#080808) is a flat void. Add a subtle noise/grain 
overlay that adds depth without changing the perceived colour.

Implementation:
Add a fixed ::after pseudo-element on the body that covers the entire 
viewport at all times:

body::after {
  content: '';
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.038;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}

Opacity must be 0.038 — not higher. This should be barely perceptible 
but clearly there when you look for it. It adds filmic texture that 
makes the dark background feel crafted, not empty.

If the SVG data URI approach causes any rendering issues in Next.js, 
use this alternative: generate a tiny base64 PNG noise texture 
(128×128px, pure noise, white on transparent) and reference it as 
a CSS background-image. Same opacity 0.038.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX 2 — NAV "JOIN WAITLIST" BUTTON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The nav CTA button is a white-outline pill that reads as secondary/ghost.
It should feel like the same urgency as the hero "Get early access" button.

Current (approximate): 
  border: 1px solid rgba(255,255,255,0.3)
  color: white
  background: transparent
  border-radius: ~20px

Change to:
  background: #F5A623
  color: #080808
  border: none
  font-weight: 600
  border-radius: 6px (match the hero button radius exactly)
  padding: 8px 18px
  font-size: 13px
  transition: background 0.2s, transform 0.15s
  
  On hover:
    background: #E8961A (slightly darker amber)
    transform: translateY(-1px)

This makes the nav CTA feel like the primary action it is. 
Every scroll position should have an amber "Join waitlist" visible.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX 3 — FOUNDING TIER PROGRESS BAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The "64 / 200 spots claimed" progress bar is currently ~4px tall and 
barely visible. It's the urgency mechanism — it needs to command attention.

Update both instances (pricing section + bottom CTA section):

Track:
  height: 6px (up from ~4px)
  border-radius: 3px
  background: rgba(255,255,255,0.08)
  width: 100% (full width of its container)

Fill:
  height: 6px
  border-radius: 3px
  background: #F5A623
  width: 32% (64/200 — tie to the SPOTS_CLAIMED JS variable: 
    width = `${(SPOTS_CLAIMED / 200) * 100}%`)
  position: relative
  
  Add a glow effect on the fill:
    box-shadow: 0 0 8px rgba(245, 166, 35, 0.6), 
                0 0 16px rgba(245, 166, 35, 0.2)

  Animate on mount (Framer Motion):
    initial: { width: 0 }
    animate: { width: `${(SPOTS_CLAIMED / 200) * 100}%` }
    transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }

The "64 / 200" counter text:
  font-size: 20px (up from current)
  font-family: monospace (keep existing)
  color: #F5A623
  font-weight: 600
  letter-spacing: 0.02em

The "spots claimed" label above it:
  font-size: 10px
  text-transform: uppercase
  letter-spacing: 0.1em
  color: rgba(240,237,232,0.4)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX 4 — STATUS BADGE REFINEMENT (8 dimensions section)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The TIGHT / LOW / THIN / GAP / OK badges on the dimension cards 
are good but slightly flat. Add a very subtle glow to the error-state 
badges (red ones) to make them feel more urgent:

For badges with ✕ or ⚠ prefix (TIGHT, LOW, THIN, GAP, HIGH, UNUSED):
  Add: box-shadow: 0 0 6px rgba(current-badge-color, 0.3)
  
  Red badges (× LOW, × GAP, × MIS-SOLD):
    box-shadow: 0 0 8px rgba(248, 113, 113, 0.25)
  
  Amber badges (⚠ TIGHT, ⚠ THIN, ⚠ HIGH, ⚠ UNUSED 80C):
    box-shadow: 0 0 8px rgba(245, 166, 35, 0.25)
  
  Green badges (✓ OK):
    no glow, they're fine as-is

This is a 1-line addition per badge variant. Subtle but it makes 
the error states feel alive rather than static.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX 5 — HERO HEALTH CARD: ADD AMBER UNDERLINE BARS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Looking at the hero health report card, each metric (Coverage ratio, 
Real savings rate, Emergency buffer, etc.) shows a number with a 
coloured underline bar beneath it. These bars appear to be static 
and uniform width.

Make them represent the actual value as a proportion:

Each metric bar:
  height: 3px
  border-radius: 1.5px
  background: rgba(255,255,255,0.06) — the track
  
  Filled portion (overlay on top):
    Coverage ratio 73%: fill 73% in #F87171 (red — over danger threshold)
    Real savings rate 9.2%: fill 46% (9.2 out of 20% target) in #F87171
    Emergency buffer 1.8mo: fill 22% (1.8 out of 8mo) in #F87171
    Debt-to-income 31%: fill 31% in #2DD4BF (teal — under 40% = OK)
    Tax efficiency 40%: fill 40% in #F5A623 (amber — partial)

  Animate on mount with staggered delay (0.1s between each bar):
    initial: { width: 0 }
    animate: { width: target% }
    transition: { duration: 0.8, ease: 'easeOut' }

These bars already exist in some form — just make them data-driven 
and animated rather than static decorations.
```

---

## PROMPT 6 — Spacing audit: kill the dead zones
> The content is excellent. Some sections make users scroll through emptiness to find it.

```
In apps/web/app/(marketing)/page.tsx, audit and fix vertical spacing 
across the page. This is a spacing-only pass — no copy, no component 
changes, no colour changes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE PROBLEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Several sections have excessive top padding that pushes the section 
headline far below the viewport edge when scrolling in. The user 
sees a dark void before the content appears. This is NOT intentional 
breathing room — it's content starting too late.

Affected sections (from visual audit):
1. "Who it's for" section — headline appears ~40% down the viewport
2. Footer CTA section ("For Indians who want to understand...") — 
   massive empty space above the headline
3. Minor: some section-to-section transitions feel over-padded

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE FIX — SECTION PADDING STANDARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Establish a consistent section padding system if one doesn't exist:

  --section-padding-y: 100px;   /* desktop */
  --section-padding-y-md: 72px; /* tablet */
  --section-padding-y-sm: 56px; /* mobile */

Apply to all top-level page sections:
  padding-top: var(--section-padding-y)
  padding-bottom: var(--section-padding-y)

Exceptions (sections that should have MORE breathing room):
  - Hero section: keep existing (it has the most content)
  - The honest memo section: keep existing (the card needs its space)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPECIFIC SECTIONS TO FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"WHO IT'S FOR" SECTION
Current: section headline appears very low in viewport on scroll-in
Fix: 
  - Reduce section padding-top to 100px max
  - The section label ("WHO IT'S FOR"), headline, and profile cards 
    should begin in the top 35% of the viewport when scrolled to
  - Remove any min-height that might be pushing content down

FOOTER CTA SECTION ("For Indians who want to understand their money, honestly.")
Current: approximately 180–200px of empty dark space above the headline
Fix:
  - padding-top: 100px on this section (from what looks like 200px+)
  - The Instrument Serif headline should be the first thing a user 
    sees when this section enters the viewport
  - The founding tier box and email form below it can keep their 
    existing internal spacing

BETWEEN-SECTION GAPS
If there are explicit margin-bottom values on sections larger than 0, 
remove them — let the section padding-top/bottom handle all spacing. 
Margin collapsing between sections creates unpredictable gaps.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCROLL ANIMATION TRIGGER TIMING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Check all Framer Motion viewport triggers. If any section's animation 
fires when the element is at 0.3+ (30% into view), lower it:

  viewport={{ once: true, amount: 0.1 }}

This ensures content animates in as soon as the section enters view, 
not after the user has scrolled deep into the empty padding. 
A section animating in at 0.3 threshold combined with large top padding 
means the user sees content appear only when 30% of an already-late 
section is visible — making the dead zone feel even longer.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MOBILE CHECK (do not break)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After the spacing fix, verify at 375px viewport:
- No section has more than 56px top padding on mobile
- The "Who it's for" profile cards stack to single column (should 
  already be the case)
- The hero health report card either:
  a) Moves below the hero copy on mobile (preferred), OR
  b) Scales down proportionally and doesn't overflow
- The honest memo section email header (From / To / Re) doesn't 
  truncate on narrow viewports
- The founding tier "64 / 200" counter and progress bar remain 
  legible at small sizes

Do not add new responsive breakpoints — work within whatever 
breakpoint system already exists in the codebase.
```