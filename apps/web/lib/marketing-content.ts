/** Shared marketing copy and data — used across landing and subpages. */

export const FOUNDING_PRICE_MONTHLY = 49;
export const FOUNDING_PRICE_LABEL = "₹49/mo";
export const FOUNDING_PRICE_LONG = "₹49/month";
export const TOTAL_FOUNDING_SPOTS = 200;
export const SPOTS_CLAIMED = 64;
/** Shown in hero/CTA microcopy before signup */
export const WAITLIST_DISPLAY_POSITION = 64;

export const TICKER_ITEMS = [
  "Multiple bank accounts",
  "Parent support",
  "Annual bonuses",
  "Freelance income",
  "Credit card EMIs",
  "LIC policies",
  "Zomato bills",
  "Gold SIPs",
  "School fees",
  "Diwali spending",
  "IT refunds",
  "Home loan prepayment",
  "Chit funds",
  "Side gigs",
] as const;

export type GapLevel = "err" | "warn";

export type LandingGap = {
  id: string;
  level: GapLevel;
  headline: string;
  body: string;
};

/** Landing combined explainer — max 4 items */
export const LANDING_GAPS: readonly LandingGap[] = [
  {
    id: "bonus",
    level: "err",
    headline: "Your ₹2L bonus is already gone.",
    body: "It landed in March. By September there's no trace of it. Nobody flagged that it should've been invested — so it quietly became dinners and a phone.",
  },
  {
    id: "lic",
    level: "warn",
    headline: "You have two LIC policies and zero term cover.",
    body: "Someone sold you \"insurance\" that's really a bad investment. Your family isn't actually protected. We say that out loud.",
  },
  {
    id: "80c",
    level: "warn",
    headline: "You're leaving ₹62,000 of tax savings on the table.",
    body: "80C gives you ₹1.5L. You're using ₹88k. Same gap, every single year — and you're possibly on the wrong regime entirely.",
  },
  {
    id: "family",
    level: "warn",
    headline: "The ₹25,000 you send home isn't \"optional spending.\"",
    body: "It's a fixed commitment, and your real financial picture has to be built around it — not in spite of it. Most tools just call it an expense and move on.",
  },
];

export const HEALTH_DIMENSIONS = [
  {
    name: "Coverage ratio",
    description:
      "What % of your income is already spoken for before you spend a rupee.",
    example: "Your fixed obligations use 68% of income. Danger zone.",
  },
  {
    name: "Real savings rate",
    description: "What actually compounds — not what you think you save.",
    example: "4.2% of take-home is compounding. Indian average. Not enough.",
  },
  {
    name: "Emergency buffer",
    description: "How many months you can survive on liquid savings alone.",
    example: "1.3 months. Target: 6.",
  },
  {
    name: "Insurance adequacy",
    description: "Term cover as a multiple of your annual income.",
    example: "You have ₹0 of term cover. Your family is unprotected.",
  },
  {
    name: "Equity exposure",
    description: "What % of your wealth is in growth assets.",
    example: "92% in gold and FD. Inflation is eroding it.",
  },
  {
    name: "Debt-to-income ratio",
    description: "Total EMIs as a % of monthly take-home.",
    example: "34%. Within range. Watch if it crosses 40%.",
  },
  {
    name: "Irregular income rate",
    description: "What % of your bonuses and reimbursements gets invested.",
    example: "Last 3 bonuses: 0% invested. All spent within 60 days.",
  },
  {
    name: "Tax efficiency",
    description: "80C utilisation + regime optimisation.",
    example: "₹62,000 of 80C headroom unused. Old regime likely better for you.",
  },
] as const;

export const ARCHETYPES = [
  {
    icon: "🏢",
    name: "Salaried professional",
    situation: "HDFC salary, Kotak savings, ICICI joint account.",
    healthGap:
      "Real savings rate and gaps across all three accounts, in one view.",
  },
  {
    icon: "💼",
    name: "Freelancer / consultant",
    situation: "Great months, rough months. TDS deducted everywhere.",
    healthGap:
      "Health picture that respects income volatility, not a fixed salary fantasy.",
  },
  {
    icon: "👨‍👩‍👧",
    name: "Supporting family",
    situation: "₹25,000 to parents every month. ₹10,000 for a sibling's fees.",
    healthGap:
      "Commitments treated as non-negotiable, not discretionary noise.",
  },
  {
    icon: "🏠",
    name: "Dual-income household",
    situation: "Two salaries, shared EMIs, separate accounts.",
    healthGap: "One household health view both partners can actually read.",
  },
] as const;

export const LEDGER = [
  { them: "They earn commissions.", us: "We earn only from you." },
  { them: "They recommend ULIPs.", us: "We flag them. Out loud." },
  {
    them: "They show health scores.",
    us: "We show you why your score is what it is.",
  },
  { them: "They guess transaction narrations.", us: "We read every UPI string." },
  {
    them: "They ignore family transfers.",
    us: "We treat them as fixed commitments.",
  },
] as const;

export const PRICING = [
  {
    tier: "Free",
    amount: "₹0",
    period: " / forever",
    features: ["One bank statement", "Three of eight dimensions", "Snapshot only"],
    cta: "Start free",
    popular: false,
  },
  {
    tier: "Pro",
    amount: "₹299",
    period: " / month",
    features: [
      "Unlimited statements · all banks",
      "Full 8-dimension report",
      "What-if scenario explorer",
      "Tax efficiency review",
    ],
    cta: "Choose Pro",
    popular: true,
  },
  {
    tier: "Premium",
    amount: "₹999",
    period: " / month",
    features: [
      "Everything in Pro",
      "Annual human review session",
      "Family / couple linking",
      "Estate & nominee mapping",
    ],
    cta: "Choose Premium",
    popular: false,
  },
] as const;
