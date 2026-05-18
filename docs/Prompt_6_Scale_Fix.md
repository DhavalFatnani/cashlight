# Cashlight — Base Scale Fix
# The page feels best at 90% browser zoom on MacBook Air M4.
# Fix: make 100% zoom feel like 90% zoom natively.

---

## PROMPT 10 — Fix base scale for MacBook Air M4

```
In globals.css (or wherever the root font-size is set), add the 
following media query:

@media (min-width: 1200px) and (max-width: 1600px) and (max-height: 960px) {
  html {
    font-size: 14.5px;
  }
}

That's it. One rule.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHY THIS WORKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The browser default is 16px. 90% of 16px = 14.4px.
Setting html font-size to 14.5px at this viewport means every value 
in the codebase that uses rem units scales down proportionally — 
headlines, body text, padding, gaps, border-radius — everything.

It's the equivalent of the user setting 90% zoom, but baked in 
natively so 100% zoom feels right.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT THIS AFFECTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Everything using rem — which in a well-built Next.js/Tailwind app 
is most things:
  ✓ All Tailwind text sizes (text-sm, text-xl, etc. — all rem-based)
  ✓ All Tailwind spacing (p-4, gap-6, etc. — all rem-based)
  ✓ Any custom CSS using rem
  ✓ Framer Motion values expressed in rem

Does NOT affect:
  ✗ Fixed px values (if any exist — check below)
  ✗ Viewport units (vh, vw, svh — these are unaffected, which is correct)
  ✗ The grain texture overlay (fixed position, unaffected)
  ✗ The sticky nav height (if set in px — check below)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AFTER APPLYING — CHECK THESE FOUR THINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. NAV HEIGHT
   If the nav uses a fixed px height (e.g., height: 72px), check 
   that scroll-margin-top on sections still aligns correctly. 
   If the nav height is in rem, it scales automatically — no fix needed.

2. THE AMBER ACCENT LINE UNDER MEMO CARD HEADLINE
   Small decorative elements set in px may appear slightly off after 
   the scale change. Eyeball these and convert any that look wrong 
   from px to rem.

3. BENCHMARK BAR TRACK HEIGHT
   If set as height: 6px — change to height: 0.375rem so it scales.
   Same for the marker dots: 14px → 0.875rem.

4. MOBILE (≤768px)
   The media query above is already scoped to min-width: 1200px 
   so mobile is completely unaffected. No mobile check needed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IF THE CODEBASE HAS SIGNIFICANT FIXED PX VALUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Search the codebase for hardcoded px values in layout-critical spots:
  grep -r "px" --include="*.tsx" --include="*.css" 

For any padding, margin, gap, font-size, or height set in px 
on layout elements (not borders or shadows), convert to rem:
  px value ÷ 16 = rem value
  Examples: 48px → 3rem, 24px → 1.5rem, 120px → 7.5rem

Borders (1px, 2px) and box-shadows stay in px — they should not scale.
The grain texture opacity stays as-is.
```

# Cashlight — Navbar Scroll Offset Fix

---

## PROMPT 11 — Fix navbar anchor scroll offset

```
The navbar links (How it works, Who it's for, Pricing) scroll to the 
correct sections but land with the section headline hidden behind the 
fixed navbar. Fix the scroll offset so every anchor lands with the 
section label clearly visible below the nav.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE FIX — scroll-margin-top
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

In globals.css, add:

  /* Offset all anchor targets by the nav height + breathing room */
  [id] {
    scroll-margin-top: 88px;
  }

88px = fixed nav height (~72px) + 16px breathing room so the 
section label isn't flush against the nav bottom edge.

This applies to every element with an id — which covers all 
section targets (#how, #who, #pricing, #cta) in one rule.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALSO — smooth scroll on html
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If not already set, add to globals.css:

  html {
    scroll-behavior: smooth;
  }

This ensures clicks feel like a glide, not a jump.
If the project uses Framer Motion or Lenis for scroll, 
skip this line — it may conflict. Check first.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IF NAV HEIGHT CHANGES AT ANY BREAKPOINT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If the nav is shorter on mobile (e.g., 60px), scope accordingly:

  @media (max-width: 768px) {
    [id] {
      scroll-margin-top: 72px;
    }
  }

Adjust the value to match the actual rendered nav height at each 
breakpoint. Use browser devtools → computed styles on the nav 
element to confirm the exact height if unsure.
```

# Cashlight — Who it's for: Remove Double Scale

---

## PROMPT 12 — Revert section-specific scaling on "Who it's for"

```
The "Who it's for" section was given its own explicit size reductions 
in an earlier prompt (reduced font sizes, padding, and gap values 
inside a max-height media query). Since then, a global html font-size 
of 14.5px has been applied at the MacBook Air viewport — which scaled 
the section a second time. It is now visually too small.

Fix: remove all section-specific size overrides that were applied 
to the "Who it's for" section inside any viewport/height media query. 
Let the global 14.5px base scale handle it uniformly with the rest 
of the page.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT TO REMOVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Find and delete any CSS rules scoped to the "Who it's for" section 
inside these media queries:

  @media (min-width: 1200px) and (max-height: 960px) { ... }
  @media (min-width: 1200px) and (max-width: 1500px) { ... }
  @media (min-width: 1200px) and (max-width: 1600px) and (max-height: 960px) { ... }

Specifically remove overrides for:
  - section padding-top / padding-bottom on the who-section
  - Card gap reductions (gap: 12px override)
  - Card internal padding reductions (padding: 20px override)
  - Any font-size overrides on card titles or body text 
    inside this section

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT TO KEEP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Keep the base (non-media-query) styles for this section exactly 
as they were before any viewport-specific overrides were added.
The global html { font-size: 14.5px } at the MacBook viewport 
will proportionally scale all rem-based values in this section 
automatically — no section-specific rules needed.

Also keep:
  - The psychographic card content (L / D / C cards from Prompt 4)
  - The section headline and label copy
  - The rescue callout block below the cards
  - Any Framer Motion animation on the cards
  - Mobile styles (≤ 768px) — do not touch these

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFY AFTER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

At 1280×832px the section should look proportional and consistent 
with the visual weight of all other sections on the page —
same card padding feel, same text density, same breathing room.
It should not look smaller or tighter than adjacent sections.
```

# Cashlight — Nav Scroll Anchor Fix (Precise)
# Three different root causes. Fix all three.

---

## PROMPT 13 — Fix scroll destination for all nav links

```
The three navbar links scroll to incorrect positions. Each has a 
different root cause. Fix all three precisely.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX 1 — "HOW IT WORKS" → #how (Process section)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ROOT CAUSE:
The id="how" anchor is on the 380vh outer scroll wrapper (the scroll 
engine from the sticky scroll implementation). Clicking "How it works" 
scrolls to the top of that wrapper — which is empty scroll space.
The sticky content (headline, cards) appears only once the user 
scrolls into that space, so it lands in the bottom half of the viewport.

FIX — TWO STEPS:

Step 1: Move the anchor.
  Remove id="how" from the outer 380vh wrapper.
  Add id="how" to the sticky inner container (the 100vh sticky div).
  
  The sticky container is the element with:
    position: sticky
    top: 0
    height: 100vh
  
  This is the element the user actually SEES — anchoring to it 
  means the nav link scrolls to where the content is, not where 
  the scroll engine starts.

Step 2: Set scroll-margin-top on this element explicitly.
  Since the sticky container now has the id, add inline or via 
  className:
  
    scroll-margin-top: 0px
  
  Set to 0px (not 88px) because the sticky container sits AT the 
  top of the viewport when active — there's no need to offset it 
  further. The nav is fixed and overlays it; the content below the 
  nav is what matters.
  
  If the section label ("// PROCESS") ends up hidden behind the nav, 
  adjust to scroll-margin-top: 72px (nav height only, no extra gap).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX 2 — "WHO IT'S FOR" → #who (Psychographic section)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ROOT CAUSE:
The section has excessive padding-top that pushes the section label 
and headline down within the section — even after the anchor scrolls 
correctly. The previous section's footer is visible above because 
scroll-margin-top in the global [id] CSS rule may not be applying 
in Next.js (CSS Modules or Tailwind can suppress attribute selectors).

FIX — THREE STEPS:

Step 1: Ensure scroll-margin-top is applied in Next.js.
  The global CSS rule [id] { scroll-margin-top: 88px } may not 
  cascade correctly in Next.js App Router with CSS Modules.
  
  Instead of relying on the attribute selector, add the scroll 
  offset directly via Tailwind on each section element:
  
  Add className="scroll-mt-20" to the section element with id="who".
  (scroll-mt-20 = scroll-margin-top: 80px in Tailwind — close enough 
  to 88px, or use scroll-mt-[88px] for exact value)
  
  If the project doesn't use Tailwind for this, add an inline style:
    style={{ scrollMarginTop: '88px' }}

Step 2: Remove the global [id] CSS rule from globals.css.
  Since we're now applying scroll-margin-top per element with 
  Tailwind classes, the global rule is redundant and may cause 
  conflicts. Remove:
    [id] { scroll-margin-top: 88px; }

Step 3: Apply scroll-mt-[88px] to ALL section anchor elements.
  Go through every section with an id used in nav links and add 
  the Tailwind class (or inline style). Complete list:
    id="how"    → scroll-mt-0 (handled by Fix 1 above)
    id="who"    → scroll-mt-[88px]
    id="pricing"→ scroll-mt-[88px]
    id="cta"    → scroll-mt-[88px]
  
  If there are any other anchor ids in the page, apply scroll-mt-[88px] 
  to those too.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX 3 — "PRICING" → #pricing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ROOT CAUSE:
The memo section ("Why we can tell you the truth") bottom is visible 
at the top of the viewport when the Pricing section is scrolled to.
This means the scroll-margin-top is working (user IS at the pricing 
section) but the pricing section has too much padding-top — the 
headline "Pay us. So nobody else has to buy us." starts too far 
below the top of the section.

FIX:
Apply scroll-mt-[88px] per Step 3 above.

ADDITIONALLY — reduce section padding-top on the pricing section:
  Current: likely 120px+ padding-top
  Change to: padding-top: 72px
  
  The section label "PRICING" and the headline should be the 
  first things visible within ~100px of the viewport top edge 
  after the nav (72px nav + 88px scroll margin = 160px total 
  from page top — this is where the section label should land).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERIFY EACH LINK AFTER FIXING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After applying all three fixes, click each nav link and confirm:

"How it works" →
  ✓ Sticky container visible immediately
  ✓ "// PROCESS" label and "step i of iii" visible below nav
  ✓ Left headline visible in top half of viewport
  ✓ No dead dark space above the content

"Who it's for" →
  ✓ "WHO IT'S FOR" amber label visible near top of viewport
  ✓ Headline "You're not bad with money..." fully visible
  ✓ Previous section NOT visible above
  ✓ At least 2 of the 3 profile cards visible without scrolling

"Pricing" →
  ✓ "PRICING" label visible near top
  ✓ "Pay us. So nobody else has to buy us." headline fully visible
  ✓ Memo section NOT visible above
  ✓ All 3 pricing cards visible or nearly visible

Target viewport for verification: 1280×832px (MacBook Air M4 default).
```