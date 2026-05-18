Build a production-grade marketing landing page for Cashlight — an AI-powered 
personal finance platform for Indians. This is the most important page we will 
ever build. It must be visually world-class and convert visitors to waitlist signups.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Single file: apps/web/app/(marketing)/page.tsx
- Next.js 14 App Router, TypeScript, Tailwind CSS
- No external UI libraries. Pure Tailwind + custom CSS where needed.
- Google Fonts via next/font:
    display → "Instrument Serif"
    body    → "DM Sans"
- Framer Motion for scroll animations
- Waitlist form: POST to /api/waitlist (log to console for now, show success state)
- Fully responsive: mobile-first, perfect at 375px and 1440px
- Dark theme only: background #080808, accent #F5A623 (amber)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BRAND + POSITIONING RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: Cashlight
Tagline: "Your money, finally understood."
Tone: Sharp, confident, warm. Like a brilliant CA friend — not a bank, 
      not a startup bro, not a robo-advisor.

CRITICAL POSITIONING — must be reflected in every line of copy:
- Cashlight is a financial health platform, NOT a financial advisor
- It shows you your financial health report and possible scenarios
- It does NOT recommend specific stocks, mutual funds, or securities
- It does NOT give investment advice in the SEBI RIA sense
- The edge over competitors is HONESTY OF RELATIONSHIP — 
  no commissions, no conflicts, no products to sell
- Frame all outputs as: "here is what your numbers say" 
  NOT "here is what you must do"
- Think: a doctor who reads your bloodwork and explains what it means, 
  not a doctor who prescribes without examining you

Avoid entirely:
- "We'll tell you exactly what to do" (too advisory)
- "Invest in X fund" or any specific product recommendation
- Dashboard language: "insights", "analytics", "data-driven"
- Anything that sounds like Walnut, MoneyView, or a robo-advisor
- Purple. Blue. Generic fintech gradients.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE SECTIONS (in order)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

── 1. NAV ──────────────────────────────
Fixed top nav. Logo left. Links center: How it works | Who it's for | Pricing.
CTA right: "Join waitlist" (amber button).
Blurs on scroll with backdrop-filter.

── 2. HERO ─────────────────────────────
Large Instrument Serif headline, two lines:
  Line 1: "Your money is"
  Line 2 (italic, amber): "more complicated than any app admits."

Subhead in DM Sans, muted, 2-3 lines:
  "You juggle multiple accounts, support family, get lumpy bonuses,
   and pay EMIs across banks. Most tools show you charts.
   Cashlight reads your actual statements and shows you 
   where you really stand — and what your options are."

Waitlist form: email input + "Get early access" button, side by side.
Below form: "No credit card. No spam. Founding tier ₹29/mo — 200 spots only."

Background: Deep black. Subtle radial amber glow behind headline.
No hero image. The headline IS the hero.

── 3. SOCIAL PROOF STRIP ───────────────
Thin strip, muted:
"Built for Indians managing:"

CSS infinite-scroll ticker (no JS library):
  Multiple bank accounts · Parent support · Annual bonuses · 
  Freelance income · Credit card EMIs · LIC policies · 
  Zomato bills · Gold SIPs · School fees · Diwali spending · 
  IT refunds · Home loan prepayment · Chit funds · Side gigs ·
  HRA claims · 80C planning · Medical emergencies

── 4. THE PROBLEM ──────────────────────
Section label: "THE PROBLEM"
Headline (Instrument Serif): "Smart Indians are flying blind."

6-card grid. Each card: short punchy statement + one line of context.
All framed as diagnostic observations, not accusations:

  ① "Three bank accounts, no unified picture."
     Salary here, joint account there, savings elsewhere. 
     No tool has ever seen all of it together.

  ② "Your family commitments aren't optional — but every app treats them as discretionary."
     Supporting parents and siblings is a fixed obligation, 
     not something to "cut back on".

  ③ "A ₹2L bonus arrived. Six months later, it's gone."
     Irregular income — bonuses, LTA, reimbursements — 
     lands and evaporates with no plan behind it.

  ④ "Two LIC policies. Zero term insurance. Fully mis-sold."
     The tool that suggested those policies earned a commission on them. 
     Cashlight earns nothing from insurance.

  ⑤ "80C: ₹1.5L limit, ₹60,000 used. Every year."
     Tax season arrives, you scramble, you miss it. 
     Old vs new regime — you picked one and hoped for the best.

  ⑥ "You know you should start a SIP. Next month."
     Next month has been happening for three years. 
     Every month without equity exposure costs compounding you can't recover.

── 5. HOW IT WORKS ─────────────────────
Section label: "HOW IT WORKS"
Headline: "From scattered statements to a clear financial picture."

3 steps. Large step number in Instrument Serif italic (amber, low opacity).

  Step 01 — Upload
  "Drop statements from any Indian bank."
  PDF, XLS, or CSV. HDFC, SBI, ICICI, Kotak, IDFC, Axis, and more.
  We read the raw narrations — every UPI string, every ACH code.
  Show bank name chips: HDFC · SBI · ICICI · Kotak · IDFC · Axis · Yes Bank

  Step 02 — Understand
  "Cashlight reads every line and builds your financial health report."
  It separates real expenses from family transfers, inter-account 
  moves, investments, and irregular income. It learns your patterns.
  It shows you 8 health dimensions: savings rate, coverage ratio, 
  insurance adequacy, equity exposure, emergency buffer, and more.

  Step 03 — Explore
  "See where you stand. Understand your options."
  Not a prescription — a diagnosis. Cashlight shows you what your 
  numbers mean, what's working, what's fragile, and what scenarios 
  are possible if you change one thing at a time.
  You can ask: "What if I moved ₹5k more into investments?" 
  and see exactly how it changes your picture.

── 6. WHAT CASHLIGHT SHOWS YOU ─────────
Section label: "YOUR FINANCIAL HEALTH"
Headline: "Eight dimensions. One honest picture."

Show 8 metric cards in a grid. Each has a name, a plain-English 
description, and an example reading:

  Coverage ratio
  "What % of your income is already spoken for before you spend a rupee."
  Example: "Your fixed obligations use 68% of income. Danger zone."

  Real savings rate
  "What actually compounds — not what you think you save."
  Example: "4.2% of take-home is compounding. Indian average. Not enough."

  Emergency buffer
  "How many months you can survive on liquid savings alone."
  Example: "1.3 months. Target: 6."

  Insurance adequacy  
  "Term cover as a multiple of your annual income."
  Example: "You have ₹0 of term cover. Your family is unprotected."

  Equity exposure
  "What % of your wealth is in growth assets."
  Example: "92% in gold and FD. Inflation is eroding it."

  Debt-to-income ratio
  "Total EMIs as a % of monthly take-home."
  Example: "34%. Within range. Watch if it crosses 40%."

  Irregular income rate
  "What % of your bonuses and reimbursements gets invested."
  Example: "Last 3 bonuses: 0% invested. All spent within 60 days."

  Tax efficiency
  "80C utilisation + regime optimisation."
  Example: "₹62,000 of 80C headroom unused. Old regime likely better for you."

── 7. WHO IT'S FOR ─────────────────────
Section label: "WHO IT'S FOR"
Headline: "One platform. Every kind of Indian earner."

4 cards with icon, archetype name, one-line situation, 
one specific health gap Cashlight surfaces:

  🏢 Salaried professional
  "HDFC salary, Kotak savings, ICICI joint account."
  Cashlight shows you your real savings rate across all three 
  and where the gaps are.

  💼 Freelancer / consultant
  "Great months, rough months. TDS deducted everywhere."
  Cashlight builds a health picture that accounts for 
  income volatility — not one that assumes a fixed salary.

  👨‍👩‍👧 Supporting family
  "₹25,000 to parents every month. ₹10,000 for a sibling's fees."
  Cashlight treats your commitments as non-negotiable 
  and measures your health around them.

  🏠 Dual-income household
  "Two salaries, shared EMIs, separate accounts."
  Cashlight gives you a single household health view 
  both partners can see.

── 8. WHAT MAKES US DIFFERENT ──────────
Section label: "THE DIFFERENCE"
Headline: "Every other tool has something to sell you."

2-column layout. Left: "They" column. Right: "Cashlight" column.

  They earn commissions on insurance → We earn only from your subscription
  They recommend ULIPs → We flag them
  They show you charts → We show you your financial health
  They guess at narrations → We read every UPI string
  They ignore family transfers → We treat them as fixed commitments
  They treat your bonus as income → We flag it for deployment
  They give you a dashboard → We give you a diagnosis

Below this, a single amber-bordered callout:
  "Cashlight has no financial products to sell. 
   No insurance commissions. No mutual fund trail fees. No ads.
   We make money only when you find us valuable enough to pay for.
   That's the only business model that keeps us honest."

── 9. IMPORTANT — WHAT WE ARE ──────────
Small but important section. Muted text, honest framing.
No section label. Just a short paragraph:

  "Cashlight is a financial health platform — not a financial advisor. 
   We read your statements, compute your health metrics, and show you 
   what your numbers mean. We show you scenarios, not prescriptions. 
   For specific investment or tax decisions, we'll always tell you 
   when you need a qualified professional."

This builds trust. It's the thing no one else says honestly.

── 10. PRICING ─────────────────────────
Section label: "PRICING"
Headline: "Simple. No hidden fees. No upsell."

3 cards:

Free:
- 1 bank, 3 months of history
- AI categorisation of all transactions
- Basic health snapshot (all 8 dimensions)
- 3 scenario explorations

Pro ₹299/mo [MOST POPULAR]:
- Unlimited banks and full history
- Complete financial health report
- Goal scenarios (home, car, retirement)
- Irregular income tracking and deployment scenarios
- Insurance adequacy check + 80C utilisation report
- Monthly report updates as statements come in
- Chat to explore "what if" scenarios

Premium ₹999/mo:
- Everything in Pro
- Household / couple view
- Tax filing assist + old vs new regime comparison
- Quarterly human review call (CA-backed)
- Priority support

Founding tier callout (amber border, below cards):
  "Founding tier: ₹29/mo — locked for life. First 200 users only.
   You get Pro features. We get early feedback that shapes the product.
   A fair deal."

── 11. FINAL WAITLIST CTA ──────────────
Full-width section.
Headline (Instrument Serif, large, centered):
  "For Indians who want to understand"
  "their money — honestly."

Repeat email waitlist form.
Below: "Join 200 founding users. ₹29/mo locked for life."

── 12. FOOTER ──────────────────────────
Logo | "Light up your money."
Links: Privacy · Terms · Contact
"Cashlight is a financial health platform. 
 We are not SEBI-registered investment advisors. 
 Content is for informational purposes only."
© 2025 Cashlight. Built in India.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANIMATIONS (Framer Motion)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Hero headline: staggered word-by-word fade up on load
- Each section: fade up on scroll enter (useInView)
- Problem cards: stagger 0.08s delay between cards
- Health dimension cards: count-up animation on numbers when scrolled to
- Ticker strip: pure CSS infinite scroll, no JS
- Form submit: loading spinner → success state with position number

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WAITLIST API ROUTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Create apps/web/app/api/waitlist/route.ts:
- POST: receives { email, source }
- Validate email format
- Save to Supabase table: waitlist (id, email, source, created_at)
- Return { success: true, position: N } — N = total signups count
- Success message: "You're #47 on the list. We'll be in touch."
- Handle duplicate email gracefully — return same position, no error

Create migration: packages/db/migrations/000_waitlist.sql

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Background: #080808
Cards: #111111, 1px border rgba(255,255,255,0.08)
Accent: #F5A623 amber — headlines, CTAs, section labels, metric callouts
Body text: #F0EDE8 full opacity | 55% opacity secondary | 28% opacity tertiary
Section labels: 11px, 700, 2px letter-spacing, amber, uppercase
Headlines: Instrument Serif — italic for emphasis words, amber for key phrases
Body: DM Sans 300–400, 1.7 line height
Spacing: minimum 100px between sections on desktop
Never use purple. Never use blue. No generic fintech gradients.
₹ symbol appears naturally in copy — not as a decorative element
Mobile: single column, proportional font sizes, full-width CTA buttons

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUALITY BAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This page should feel like it was designed by a senior product designer 
at a well-funded Indian fintech — not generated.
Every line of copy should feel written for someone who is slightly 
embarrassed they don't have their finances sorted, and relieved 
that someone finally gets the Indian complexity.
The tone is: "We see your situation clearly. Here is what it looks like."
Not: "We'll fix you." Not: "Buy this product." 
Just: honest, specific, and on your side.