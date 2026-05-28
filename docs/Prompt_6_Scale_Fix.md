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

# Cashlight — Remove Hero Status Bar

---

## PROMPT 14 — Remove the "Live · v0.4 · Indian markets · IST 09:47" bar

```
In apps/web/app/(marketing)/page.tsx, remove the status bar 
that sits above the hero headline.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT TO REMOVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Delete the element containing:
  "Live · v0.4 · Indian markets · IST 09:47"

This includes:
  - The amber dot / live indicator
  - The text content
  - Any live clock logic or useEffect updating the time
  - Any interval or setTimeout tied to the clock
  - The wrapper element and all its styles

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT TO KEEP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Everything else in the hero section stays exactly as-is:
  - Hero headline
  - Subline and body paragraphs
  - Email input + CTA button
  - Founding tier note
  - The floating health report card on the right
  - The scrolling ticker below the hero

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AFTER REMOVING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The hero headline becomes the first visible element in the 
hero section below the nav. Ensure the top padding/margin 
above the headline looks balanced without the status bar — 
adjust by a maximum of 16px if needed. Do not over-pad.
```

# Cashlight — Content Reduction + Copy Humanisation
# Two changes in one prompt. Simpler page, warmer language.

---

## PROMPT 15 — Cut the clutter, fix the copy

```
Two passes on apps/web/app/(marketing)/page.tsx:
1. Remove three sections to reduce cognitive load
2. Replace em dashes and flatten formal phrasing throughout

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASS 1 — SECTION CUTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Remove these three sections entirely from the page:

REMOVE 1: "Eight dimensions" section
  The section labelled "EIGHT DIMENSIONS" with the 2×4 card grid
  showing Coverage ratio, Real savings rate, Emergency buffer etc.
  Delete the entire section — component, data, styles.
  Reason: product-level detail on a waitlist page. 
  The hero health report card already shows the concept visually.
  This will come back in the product itself.

REMOVE 2: "// WHERE YOU STAND" benchmark bars section
  The new section added with 3 benchmark bars (Emergency buffer, 
  Real savings rate, Equity exposure) and the left/right split layout.
  Delete the entire section — component, data, styles.
  Reason: adds significant cognitive load before the user has 
  even decided they trust the product. 
  The concept survives in the honest memo and the hero card.

REMOVE 3: "WHO IT'S FOR" section
  The section with the 3 psychographic cards (Financially lost, 
  Financially drowning, Financially curious) and the rescue 
  callout ("// a note — If you earn well and still feel broke").
  Delete the entire section — component, data, styles.
  Reason: the hero copy already speaks directly to this person. 
  Restating it mid-page interrupts the argument.

NEW PAGE FLOW AFTER CUTS:
  1. Nav
  2. Hero (headline + body + CTA + health report card)
  3. Ticker (// BUILT FOR INDIANS MANAGING)
  4. Six things (condensed — see Pass 2 below)
  5. Process (// PROCESS — 3 steps, keep as-is)
  6. Honest memo (Why we can tell you the truth)
  7. Pricing
  8. Footer CTA
  9. Footer

Also remove "Who it's for" from the nav links since the section 
no longer exists. Nav becomes:
  How it works | Pricing
(Two links. Cleaner.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PASS 2 — COPY HUMANISATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Replace every em dash (—) in the page copy with warmer, 
more conversational alternatives. Also fix specific phrases 
that feel stiff or editorial for a first-time visitor.

HERO SECTION:

Current body text:
"You juggle multiple accounts, support family, get lumpy bonuses, 
and pay EMIs across banks. Somewhere between your salary and your 
savings, something is going wrong — and no app has been honest 
enough to show you what."

Replace with:
"You juggle multiple accounts, support family, get lumpy bonuses, 
and pay EMIs across banks. Somewhere between your salary and your 
savings, something is going wrong. No app has been honest enough 
to show you what. Until now."

Current second paragraph:
"Cashlight reads your actual statements, benchmarks you against 
what people at your income globally are actually doing, and shows 
you exactly where the gap is. Not charts. Not guesses. A real picture."

Replace with:
"Cashlight reads your actual statements and shows you where you 
actually stand — compared to what people at your income around 
the world are doing. Not charts. Not guesses. A real picture."

SIX THINGS SECTION:

Condense from 6 items to 4. Remove items iii and vi 
(bonus drift and SIP procrastination — these are less 
visceral than the others). Keep:

  i  · Three bank accounts. Some apps see them all. 
       None tell you what your numbers mean.          ERROR

  ii · Your family commitments aren't optional.
       Every app treats them like they are.           WARN

  iii· Two LIC policies. Zero term insurance.
       Fully mis-sold.                                ERROR

  iv · 80C: ₹1.5L limit. ₹60,000 used.
       Every year.                                    WARN

Update the timestamps so they still feel sequential:
  i   · 08:14:02
  ii  · 08:14:09
  iii · 08:14:17
  iv  · 08:14:24

Section headline — replace:
  Current: "Six things every app pretends aren't happening."
  New: "Four things every app pretends aren't happening."

Section label — replace:
  Current: "THINGS WE NOTICED"
  New: "// THINGS WE NOTICED"
  (add the // prefix to match other section label style)

Section body — replace:
  Current: "Open any Indian money app. Then open your statements. 
  The gap between them is what we built Cashlight to close."
  New: "Open any Indian finance app. Then open your actual 
  bank statements. The gap is what Cashlight exists to close."

PROCESS SECTION:

Step iii copy — replace:
  Current: 'Run "what if I shift ₹20k from LIC to NPS?" 
  Run "what if my parents need ₹5k more?" 
  A diagnosis, never a sales pitch.'
  
  New: 'Ask "what if I move ₹20k from my LIC to NPS?" 
  Or "what if my parents need ₹5k more next month?" 
  A diagnosis. Never a sales pitch.'

HONEST MEMO SECTION:

Section headline — replace:
  Current: "Why we can tell you the truth."
  New: "Why we'll always tell you the truth."
  (more confident, forward-looking)

Body paragraph — replace:
  Current: 'Most "free" Indian money apps are funded by the 
  products they push. ULIPs. Endowments. "Tax-saving" insurance. 
  Every recommendation comes with a commission. We can't compete 
  with that on price. But we can on truth.'
  
  New: 'Most free Indian money apps are paid by the products 
  they push on you. Every recommendation comes with a commission 
  baked in. We charge you a subscription instead. That means 
  the only thing we get paid for is being useful to you.'

Contrast rows — minor edits for flow:

  Row 1:
    Left:  "They earn commissions."        (remove strikethrough styling — 
    Right: "We earn only from you."         keep it cleaner)
  
  Row 2:
    Left:  "They recommend ULIPs."
    Right: "We flag them. Out loud."
  
  Row 3:
    Left:  "They show health scores."
    Right: "We show you why your score is what it is."
  
  Row 4:
    Left:  "They guess transaction narrations."
    Right: "We read every UPI string."
  
  Row 5:
    Left:  "They ignore family transfers."
    Right: "We treat them as fixed commitments."

  Note: remove the strikethrough on the left column items. 
  The muted grey colour already signals "that's them not us."
  Strikethrough adds visual noise on a dark background.

Sign-off — replace:
  Current: "Sincerely, The Cashlight team"
  New: "— The Cashlight team"
  (the em dash here is intentional and correct — 
  it's a signature convention, keep it)

PRICING SECTION:

Headline — replace:
  Current: "Pay us. So nobody else has to buy us."
  New: "Pay us. So no one else can."
  (tighter, same meaning, more memorable)

Free tier — replace "No scenario explorer" with:
  "Snapshot only"
  (more descriptive of what you get, not what you don't)

FOOTER CTA:

Current headline:
  "For Indians who want to understand their money, honestly."

Replace with:
  "Your money, finally understood."
  (this is the tagline — use it here as the closing statement,
  Instrument Serif, large, with "finally" in amber italic)

Current subline:
  "Built by a small team in India. Funded entirely by our users. 
  Nothing else."

Replace with:
  "Built in India. Funded by the people who use it. Nothing else."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GLOBAL EM DASH RULE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After all the above, do a final pass:

Search for all remaining — (em dash) characters in the JSX copy.
For each one, make a judgment call:

  · If it's mid-sentence creating a clause → replace with a 
    full stop and start a new sentence instead.
    Example: "we read it — all of it" → "We read all of it."

  · If it's a list separator or label → replace with a colon.
    Example: "Coverage ratio — TIGHT" → already handled by the 
    badge system, no em dash needed in copy.

  · If it's a signature or attribution → keep it.
    Example: "— The Cashlight team" → correct, keep.

  · If it's in a "before/after" contrast → replace with →
    Example: "They earn commissions — we don't" → already 
    handled by the row layout with → arrows.

The goal: zero em dashes in flowing copy. 
Only permitted in signatures and the contrast row arrows (→).
```