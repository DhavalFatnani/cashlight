# Cashlight Landing Page — Viewport & Scroll UX Prompts
# Targets: MacBook Air M4 (1280×832px default / 1470×956px More Space)
# Run after prompts 1–6.

---

## PROMPT 7 — MacBook Air M4 viewport optimisation
> Target: CSS viewport 1280×832px. Every section should land cleanly within the viewport on scroll-in, with no content peeking from the next section or cut off at the bottom.

```
In apps/web/app/(marketing)/page.tsx and globals.css, audit and fix 
the layout for MacBook Air M4 viewport: 1280×832px (default Retina 
scaling) and 1470×956px (More Space mode). 

The browser chrome (nav bar, tab bar) takes ~80px, leaving ~752px 
usable viewport height at default scaling. Design every section to 
respect this constraint.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ADD THE TARGET BREAKPOINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add a dedicated CSS breakpoint for this viewport range. 
In Tailwind (tailwind.config.ts), add a custom screen if not present:

  screens: {
    ...defaultTheme.screens,
    'mba': { 'min': '1200px', 'max': '1500px' }, 
    // targets MacBook Air 13" and 15" default + More Space modes
  }

In CSS/styled components, use:
  @media (min-width: 1200px) and (max-width: 1500px) and (max-height: 960px)

This targets MacBook Air viewports specifically without affecting 
larger desktop monitors (1920px+) or smaller laptops.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULE: NO SECTION SHOULD PEEK INTO THE NEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each section, when it enters the viewport during scroll, should 
appear as a complete visual unit — the bottom of that section 
should not be cut off AND the top of the next section should not 
be visible simultaneously (unless it's a deliberate scroll cue 
showing ~40px of the next section as a "there's more" hint).

To enforce this, audit each section's total rendered height at 
1280px width and ensure it is either:
  a) ≤ 720px (fits within the usable viewport entirely), OR
  b) > 720px with a clear visual start — meaning the section label 
     and headline are FULLY visible when the section first enters 
     the viewport, even if the full section requires scrolling

Sections that are currently peeking (based on visual audit):
- The scrolling ticker bar + "Six things" section appear to overlap
- The "Who it's for" profiles may show half the next section below

Fix by:
  - Adding overflow: hidden to section wrappers where needed
  - Ensuring section padding-bottom is at least 80px so the next 
    section's content doesn't creep up
  - Add scroll-margin-top to all sections with IDs equal to the 
    nav height (approx 72px):
      section[id] { scroll-margin-top: 72px; }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HERO SECTION — FIT THE FOLD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

At 1280×832px, the hero should feel complete above the fold.
The left copy + CTA and the right health report card should both 
be fully visible without scrolling.

At this viewport, apply:
@media (min-width: 1200px) and (max-height: 900px) {
  /* Reduce hero section min-height */
  .hero-section {
    min-height: calc(100vh - 72px); /* subtract nav height */
    padding-top: 80px;
    padding-bottom: 60px;
  }
  
  /* Scale headline down slightly */
  .hero-headline {
    font-size: clamp(2.8rem, 4vw, 3.8rem);
    line-height: 1.1;
  }
  
  /* Tighten hero body text spacing */
  .hero-body {
    margin-top: 16px;
    font-size: 15px;
    line-height: 1.55;
  }
  
  /* Health report card — constrain height */
  .health-report-card {
    max-height: calc(100vh - 200px);
    overflow: hidden; /* clip gracefully if too tall */
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION HEIGHT CONSTRAINTS AT THIS VIEWPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Apply these within the mba breakpoint 
(@media (min-width: 1200px) and (max-height: 960px)):

SECTION: "Six things every app pretends aren't happening"
  Problem: 6 log items may push section height over 900px
  Fix: 
    - Reduce gap between log items from current to 8px
    - Reduce section padding-top/bottom to 80px each
    - Each log item: padding 14px 0 (from ~20px)

SECTION: "Eight dimensions" (the 2×4 card grid)
  Problem: 2-row card grid likely overflows 832px height
  Fix:
    - At this breakpoint, keep 2 rows × 4 columns (same layout)
    - Reduce each card's internal padding to 16px (from ~24px)
    - Reduce the large metric number font size: 
        font-size: clamp(1.8rem, 3vw, 2.4rem)
    - Reduce gap between card rows to 10px

SECTION: "Who it's for" (profile cards)
  Problem: Massive vertical padding before cards appear
  Fix at this breakpoint:
    - section padding-top: 80px
    - section padding-bottom: 80px
    - Card grid: gap 12px between cards
    - Cards: padding 20px internally

SECTION: Pricing (3 cards)
  Problem: 3 pricing cards + founding tier bar may overflow
  Fix:
    - Card padding: 24px (from ~32px)
    - Price number font-size: reduce slightly (font-size: 2rem)
    - Reduce gap between pricing cards to 12px
    - Founding tier bar: margin-top 16px (from 24px)

SECTION: Footer CTA
  Fix: 
    - padding-top: 80px (from ~160px+)
    - The headline, subtitle, founding box, and email form 
      should all be visible without scrolling at 832px height

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GLOBAL TYPOGRAPHY SCALE AT THIS VIEWPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

At 1280px wide and 832px tall, headlines can afford to scale down 
slightly so more content fits within the viewport. Use clamp() 
throughout so this gracefully scales between breakpoints:

Section headlines (Instrument Serif):
  font-size: clamp(2.4rem, 4.5vw, 4rem)
  
Section subheadlines / body leads:
  font-size: clamp(0.9rem, 1.1vw, 1.05rem)

Section labels (amber uppercase):
  font-size: 11px (keep fixed — already small enough)

These clamp values ensure the text is never too large at 1280px 
while still looking proportional at 1920px+.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HORIZONTAL LAYOUT: 1280px CONTAINER MAX-WIDTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If the page uses a fixed max-width container (e.g., max-w-7xl = 1280px),
ensure padding-x on the container is at least 40px on each side at 
this viewport — so content doesn't feel edge-to-edge:

.container {
  max-width: 1280px;
  padding-left: clamp(24px, 3vw, 48px);
  padding-right: clamp(24px, 3vw, 48px);
  margin: 0 auto;
}

At 1280px viewport with 40px padding each side, content area = 1200px.
This is correct — don't change this.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DO NOT BREAK THESE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Mobile layout (375px–768px): all changes must be scoped inside 
  the mba/viewport-height media query. Do not affect mobile.
- Framer Motion animations: do not change animation logic, only 
  the layout/spacing values.
- The honest memo section: this section is almost perfectly sized 
  already. Do not touch its internal spacing.
- The ticker bar (// BUILT FOR INDIANS MANAGING): keep as-is, 
  it's a fixed-height element.
```

---

## PROMPT 8 — Process section: sticky scroll overhaul
> "// PROCESS — You drop your statements. We read every line." 
> The left content vanishes too fast. The right cards need more scroll room.
> Target: slow, deliberate scroll — each card gets full attention.

```
In apps/web/app/(marketing)/page.tsx, overhaul the scroll behaviour 
of the "// PROCESS" section entirely.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT BEHAVIOUR (the problem)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Currently:
- Left panel (headline + description) scrolls away with the page
- Right cards animate in but the total section scroll height is 
  insufficient — the section transitions before all 3 cards 
  have had time to register
- The left content disappears before the user finishes reading 
  the right cards
- Result: the section feels rushed and the "3 step" story isn't landing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TARGET BEHAVIOUR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Left panel STICKS to its position for the entire section scroll
- Right side scrolls through 3 cards, one at a time
- Each card gets its own scroll phase — roughly 1 full viewport 
  height of scroll distance per card
- The left panel only releases (scrolls away) after the 3rd card 
  has fully entered and settled
- Total section scroll distance: approximately 3 × 100vh = 300vh 
  (giving each card ~1 screen height of scroll coverage)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPLEMENTATION — STICKY SCROLL ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Restructure the section as follows:

1. OUTER WRAPPER — creates the scroll height:
   position: relative
   height: 380vh  
   /* 80vh entry + 100vh per card × 3 + 80vh exit = generous scroll room */

2. STICKY CONTAINER — sits inside the outer wrapper and sticks:
   position: sticky
   top: 0
   height: 100vh
   display: flex
   align-items: center
   overflow: hidden
   
   This container is what the user SEES. It sticks to the viewport
   while the outer wrapper's 380vh scrolls beneath it.

3. LEFT PANEL — inside the sticky container:
   width: 45%
   padding-right: 60px
   /* Content: section label, headline, italic description */
   /* This never moves — it's inside the sticky container */
   
   Add a subtle fade-out at the very end of the section scroll:
   Use Framer Motion's useScroll + useTransform to fade opacity 
   from 1 → 0 only in the last 10% of the section's scroll progress.
   This gives a clean exit instead of the abrupt disappearance.

4. RIGHT PANEL — inside the sticky container:
   width: 55%
   position: relative
   height: 100%
   overflow: hidden  /* clips cards that are off-screen */

5. CARDS — use scroll-driven positioning:

   Use Framer Motion's useScroll with the outer wrapper as the 
   scroll container reference:
   
   const { scrollYProgress } = useScroll({
     target: sectionRef,  // ref on the 380vh outer wrapper
     offset: ["start start", "end end"]
   })
   
   Card 1 (You upload):
     translateY: useTransform(scrollYProgress, [0, 0.2, 0.45, 0.55], 
                              ["0%", "0%", "-100%", "-100%"])
     opacity: useTransform(scrollYProgress, [0, 0.05, 0.4, 0.5],
                           [0, 1, 1, 0])
   
   Card 2 (We read every line):
     translateY: useTransform(scrollYProgress, [0.3, 0.5, 0.7, 0.78],
                              ["100%", "0%", "0%", "-100%"])
     opacity: useTransform(scrollYProgress, [0.3, 0.45, 0.65, 0.75],
                           [0, 1, 1, 0])
   
   Card 3 (You explore. We don't prescribe.):
     translateY: useTransform(scrollYProgress, [0.6, 0.78, 1, 1],
                              ["100%", "0%", "0%", "0%"])
     opacity: useTransform(scrollYProgress, [0.6, 0.72, 0.9, 1],
                           [0, 1, 1, 1])
   
   /* Card 3 stays in place until the section fully exits */

   Each card: position: absolute, width: 100%, top: 50%, 
   transform origin adjusted for the translateY

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP INDICATOR — ADD A PROGRESS SIGNAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add a subtle vertical progress indicator on the far right edge 
of the section to show which card is active. 3 dots, stacked 
vertically, with the active one filled amber:

Position: absolute right: 0, top: 50%, transform: translateY(-50%)
Display: flex flex-direction: column gap: 8px

Dots: 
  width: 5px, height: 5px, border-radius: 50%
  inactive: background rgba(255,255,255,0.2)
  active: background #F5A623, box-shadow: 0 0 6px rgba(245,166,35,0.6)

Active dot updates based on scroll progress:
  scrollYProgress 0–0.45 → dot 1 active
  scrollYProgress 0.45–0.72 → dot 2 active
  scrollYProgress 0.72–1 → dot 3 active

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LEFT PANEL SUBTLE ANIMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

As each card on the right transitions, give the left panel 
a very subtle response to signal the step change:

The section label ("// PROCESS") stays static.

The step counter — add a small "i → ii → iii" counter 
below the section label that updates as cards change:
  font-family: monospace
  font-size: 12px
  color: var(--amber) at 60% opacity
  content updates: "step i of iii" → "step ii of iii" → "step iii of iii"
  transition: opacity 0.3s (fade between step labels)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MACBOOK AIR M4 SPECIFIC ADJUSTMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

At 1280×832px, the sticky container is 100vh = 832px.
Left and right panels need to fit within this height comfortably.

@media (max-height: 900px) {
  /* Left panel */
  .process-headline { font-size: clamp(2rem, 3.5vw, 3rem); }
  .process-description { font-size: 14px; margin-top: 12px; }
  
  /* Right cards */
  .process-card { padding: 28px 32px; }
  .process-card-title { font-size: 20px; }
  .process-card-body { font-size: 13px; line-height: 1.5; }
  
  /* Terminal block inside card */
  .process-terminal { 
    font-size: 12px; 
    padding: 14px;
    max-height: 160px;
    overflow: hidden;
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MOBILE FALLBACK (≤768px)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The sticky scroll behaviour above is desktop-only.
On mobile, fall back to the simple stacked layout:

@media (max-width: 768px) {
  /* Outer wrapper: auto height, not 380vh */
  .process-outer { height: auto; }
  
  /* No sticky */
  .process-sticky { position: relative; height: auto; }
  
  /* Stack left panel above cards */
  .process-sticky { flex-direction: column; }
  .process-left { width: 100%; padding-right: 0; margin-bottom: 32px; }
  .process-right { width: 100%; position: relative; height: auto; 
                   overflow: visible; }
  
  /* All cards visible stacked, no animation */
  .process-card { position: relative; opacity: 1; 
                  transform: none !important; margin-bottom: 16px; }
}
```