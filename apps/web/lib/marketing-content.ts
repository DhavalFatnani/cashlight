/** Shared marketing copy and data — used across landing and subpages. */

export const FOUNDING_PRICE_MONTHLY = 49;
export const FOUNDING_PRICE_LABEL = "₹49/mo";
export const FOUNDING_PRICE_LONG = "₹49/month";
export const TOTAL_FOUNDING_SPOTS = 200;

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
  line: string;
};

/** Landing combined explainer — max 4 items, one line each */
export const LANDING_GAPS: readonly LandingGap[] = [
  {
    id: "bonus",
    level: "err",
    line: "₹2L bonus in March. Gone by September. Nobody flagged investing it.",
  },
  {
    id: "lic",
    level: "warn",
    line: "Two LIC policies, zero term cover. Family isn't actually protected.",
  },
  {
    id: "80c",
    level: "warn",
    line: "₹62k of 80C headroom unused — every year. Maybe the wrong regime too.",
  },
  {
    id: "family",
    level: "warn",
    line: "₹25k home every month isn't discretionary. Your picture has to treat it that way.",
  },
];

export const HEALTH_DIMENSIONS = [
  {
    name: "Coverage ratio",
    line: "How much income is spoken for before you spend. Yours: 68% — danger zone.",
  },
  {
    name: "Real savings rate",
    line: "What actually compounds, not what you think you save. Yours: 4.2% — not enough.",
  },
  {
    name: "Emergency buffer",
    line: "Months you survive on liquid savings alone. Yours: 1.3 — target 6.",
  },
  {
    name: "Insurance adequacy",
    line: "Term cover vs annual income. Yours: ₹0 term — family unprotected.",
  },
  {
    name: "Equity exposure",
    line: "Wealth in growth assets. Yours: 92% gold and FD — inflation wins.",
  },
  {
    name: "Debt-to-income ratio",
    line: "EMIs as % of take-home. Yours: 34% — watch above 40%.",
  },
  {
    name: "Irregular income rate",
    line: "Bonuses actually invested. Last 3: 0% — spent within 60 days.",
  },
  {
    name: "Tax efficiency",
    line: "80C + regime fit. ₹62k headroom unused — old regime likely better.",
  },
] as const;

export const ARCHETYPES = [
  {
    icon: "🏢",
    name: "Salaried professional",
    line: "HDFC salary, Kotak savings, ICICI joint — real savings rate across all three, one view.",
  },
  {
    icon: "💼",
    name: "Freelancer / consultant",
    line: "Lumpy income, TDS everywhere — health that respects volatility, not a salary fantasy.",
  },
  {
    icon: "👨‍👩‍👧",
    name: "Supporting family",
    line: "₹25k to parents, ₹10k for fees — commitments as fixed lines, not noise.",
  },
  {
    icon: "🏠",
    name: "Dual-income household",
    line: "Two salaries, shared EMIs, separate accounts — one household view you both read.",
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

export const PRICING_TIER_IDS = ["free", "pro", "premium"] as const;
export type PricingTierId = (typeof PRICING_TIER_IDS)[number];

export type PricingTier = {
  id: PricingTierId;
  tier: string;
  amount: string;
  period: string;
  features: readonly string[];
  cta: string;
  popular: boolean;
};

export const PRICING: readonly PricingTier[] = [
  {
    id: "free",
    tier: "Free",
    amount: "₹0",
    period: " / forever",
    features: ["One bank statement", "Three of eight dimensions", "Snapshot only"],
    cta: "Start free",
    popular: false,
  },
  {
    id: "pro",
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
    id: "premium",
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
