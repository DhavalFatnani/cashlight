# Cashlight — Section Redesign Prompt
# Target: fit both overflow sections within one viewport at 1280×832px
# This is a layout redesign, not just a font reduction.

---

## PROMPT 9 — Redesign two overflow sections
> "// where you stand" and "Why we can tell you the truth" both overflow 
> into the next scroll. Fix by redesigning their internal layouts — 
> not by shrinking text into illegibility.

```
In apps/web/app/(marketing)/page.tsx, redesign the internal layout 
of two specific sections so they fit within a single viewport at 
1280×832px. Do not change the section copy, labels, or headlines.
Layout and structure only.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1 — "// WHERE YOU STAND"
The benchmark bar section
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEM:
3 benchmark bar cards stacked vertically is too tall.
Combined height of headline + body + 3 cards + note ≈ 1100–1300px.
Doesn't fit in 752px usable height.

NEW LAYOUT — Two-part split:

LEFT COLUMN (40% width):
  - Section label: "// WHERE YOU STAND"  
  - Headline (Instrument Serif, ~2.4rem):
    "Here's what the world figured out.
    And where most Indians actually are."
  - Body paragraph (14px, muted, max-width 340px)
  - The bottom note in italic (the "as Cashlight grows..." line)
  - All left-aligned, vertically centered in the column

RIGHT COLUMN (60% width):
  - All 3 benchmark bars stacked vertically
  - Each bar card more compact than originally specified
  - Gap between cards: 10px

COMPACT BAR CARD SPEC (redesigned for tighter fit):
  Each card:
    background: rgba(255,255,255,0.03)
    border: 1px solid rgba(255,255,255,0.07)
    border-radius: 10px
    padding: 16px 20px
    NO insight text paragraph inside the card
    (move insight to a tooltip on hover — see below)

  Inside each card:
    Row 1: Dimension name (13px, 500 weight) + source citation 
           (10px, right-aligned, very muted)
    Row 2: The track bar with 3 markers (height: 6px, same spec 
           as before — you / India / global dots)
    Row 3: Legend (3 items inline, 10px, flex space-between)
           "You: 2mo" · "India: ~5mo" · "Global: 6–8mo"

  Hover state on each card:
    Show the insight text as a tooltip or 
    expand the card height with an animated reveal:
      On hover: card border-color shifts to rgba(245,166,35,0.3)
      A 4th row slides in below the legend (max-height: 0 → auto, 
      transition 0.25s ease):
        Font: 11px, color: rgba(240,237,232,0.55), italic
        Content: the insight text for that bar

  This keeps the cards compact at rest, rich on interaction.

OVERALL SECTION LAYOUT:
  display: flex
  align-items: center
  gap: 60px
  min-height: 100vh  ← fills the viewport exactly
  padding: 0 (section padding handled by the container)

  The two columns sit side by side, vertically centered.
  At 1280px wide with 80px container padding each side = 1120px.
  Left: 40% = 448px. Right: 60% = 672px minus gap.

SECTION BACKGROUND:
  Add a very subtle horizontal rule top and bottom:
    border-top: 1px solid rgba(255,255,255,0.05)
    border-bottom: 1px solid rgba(255,255,255,0.05)
  No background colour change from the page.

RESPONSIVE FALLBACK (≤ 1024px):
  Revert to stacked layout (left column above right column).
  Each bar card retains the compact style but at full width.
  Remove min-height: 100vh — let content determine height.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2 — "AN OPEN MEMO / Why we can tell you the truth."
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEM:
The memo card contains:
  - From / To / Re header block
  - "The honest part." subheading + 2-line paragraph
  - 5 contrast rows (They → We)
  - Sincerely sign-off

Combined height at current font sizes ≈ 700–800px.
Plus section padding above and below ≈ 900–1000px total.
Overflows 832px viewport.

APPROACH: Keep the memo card aesthetic exactly — just tighten 
the internal density and remove the section's outer vertical padding.

CHANGES (inside the memo card only):

1. SECTION PADDING
   Current: likely ~120px top and bottom on the section wrapper
   Change to:
     padding-top: 60px
     padding-bottom: 60px
   This alone recovers ~120px.

2. MEMO CARD PADDING
   Current: likely ~48px internal padding
   Change to:
     padding: 32px 40px
   Recovers ~32px.

3. FROM / TO / RE HEADER BLOCK
   Current: 3 rows with generous line-height
   Change:
     font-size: 12px (from ~13–14px)
     line-height: 1.4
     margin-bottom: 20px (from ~32px)
     Each row padding: 3px 0

4. "THE HONEST PART." SUBHEADING
   Current: Instrument Serif, likely ~28–32px
   Change:
     font-size: clamp(1.3rem, 2vw, 1.6rem)
     margin-bottom: 8px

5. BODY PARAGRAPH
   Current: 2 lines, ~16px
   Change:
     font-size: 14px
     line-height: 1.55
     margin-bottom: 20px (from ~32px)

6. CONTRAST ROWS (the They → We table)
   This is where the most space is lost. 5 rows with generous padding.
   Change:
     Each row: padding 10px 0 (from ~16–20px)
     Border-bottom between rows: keep (visual rhythm)
     Font-size left column (They...): 13px (from 14–15px)
     Font-size right column (We...): 13px
     The → arrow circle: width/height 24px (from ~28–32px), 
       font-size 11px
     Gap between left col, arrow, right col: 16px each
   
   This compresses the 5-row table from ~280px to ~180px.
   That's the critical 100px recovery.

7. SINCERELY SIGN-OFF
   Current: generous margin-top
   Change:
     margin-top: 16px (from ~32px)
     font-size: 13px

RESULT TARGET:
  Memo card total internal height: ~420px
  Section padding (60px × 2): 120px
  Section headline + label above card: ~80px
  Total: ~620px — fits within 752px usable height with 130px to spare.

DO NOT CHANGE:
  - The From/To/Re monospace font or colour
  - The strikethrough styling on "They earn commissions:" etc.
  - The amber italic treatment on "only", "flag", "why", "every", "fixed"
  - The "Sincerely, The Cashlight team" amber colour
  - The card border, border-radius, or background
  - Any copy whatsoever

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AFTER BOTH FIXES — VERIFY AT THESE VIEWPORTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Check both sections at:
  1. 1280 × 832px (MacBook Air M4 default)
  2. 1470 × 956px (MacBook Air M4 More Space)
  3. 1440 × 900px (common laptop)
  4. 375 × 812px (mobile — ensure stacked layout still works)

Target: both sections fit within a single viewport scroll at (1) and (2).
At (3) they should fit comfortably with room to breathe.
At (4) stacked layout should have no overflow issues.
```