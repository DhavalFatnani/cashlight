import { WTP_OPTIONS } from "@/lib/survey-questions";
import {
  FOUNDING_PRICE_LABEL,
  FOUNDING_PRICE_MONTHLY,
  PRICING,
} from "@/lib/marketing-content";
import { billingPeriodFromDisplay, parseInrAmount } from "@/lib/pricing-tier";

/** Last survey step — maps to `pricing_intents` and derived `wtp_band`. */
export const SURVEY_PRICING_TIER_IDS = [
  "free",
  "pro",
  "premium",
  "founding",
  "none",
] as const;

export type SurveyPricingTierId = (typeof SURVEY_PRICING_TIER_IDS)[number];

export type SurveyPricingTierOption = {
  id: SurveyPricingTierId;
  label: string;
  amountInr: number;
  billingPeriod: string;
  wtpBand: (typeof WTP_OPTIONS)[number];
  ctaLabel: string;
};

const freeTier = PRICING.find((t) => t.id === "free");
const proTier = PRICING.find((t) => t.id === "pro");
const premiumTier = PRICING.find((t) => t.id === "premium");

if (!freeTier || !proTier || !premiumTier) {
  throw new Error("PRICING tiers missing expected ids");
}

export const SURVEY_PRICING_TIER_OPTIONS: SurveyPricingTierOption[] = [
  {
    id: "free",
    label: `${freeTier.tier} — ${freeTier.amount}${freeTier.period}`,
    amountInr: parseInrAmount(freeTier.amount),
    billingPeriod: billingPeriodFromDisplay(freeTier.period),
    wtpBand: "I wouldn't pay",
    ctaLabel: freeTier.cta,
  },
  {
    id: "pro",
    label: `${proTier.tier} — ${proTier.amount}${proTier.period}`,
    amountInr: parseInrAmount(proTier.amount),
    billingPeriod: billingPeriodFromDisplay(proTier.period),
    wtpBand: "₹299/mo (our Pro tier)",
    ctaLabel: proTier.cta,
  },
  {
    id: "premium",
    label: `${premiumTier.tier} — ${premiumTier.amount}${premiumTier.period}`,
    amountInr: parseInrAmount(premiumTier.amount),
    billingPeriod: billingPeriodFromDisplay(premiumTier.period),
    wtpBand: "₹999/mo (our Premium tier)",
    ctaLabel: premiumTier.cta,
  },
  {
    id: "founding",
    label: `Founding — ${FOUNDING_PRICE_LABEL}, locked for life`,
    amountInr: FOUNDING_PRICE_MONTHLY,
    billingPeriod: "month",
    wtpBand: "₹49/mo",
    ctaLabel: "Founding tier",
  },
  {
    id: "none",
    label: "I wouldn't pay for this",
    amountInr: 0,
    billingPeriod: "none",
    wtpBand: "I wouldn't pay",
    ctaLabel: "No paid plan",
  },
];

export function isSurveyPricingTierId(
  value: string,
): value is SurveyPricingTierId {
  return (SURVEY_PRICING_TIER_IDS as readonly string[]).includes(value);
}

export function surveyPricingTierOption(
  id: SurveyPricingTierId,
): SurveyPricingTierOption | undefined {
  return SURVEY_PRICING_TIER_OPTIONS.find((o) => o.id === id);
}

/** DB `pricing_intents.tier` — excludes survey-only `none`. */
export function pricingIntentTierFromSurvey(
  id: SurveyPricingTierId,
): "free" | "pro" | "premium" | "founding" | null {
  if (id === "none") return null;
  return id;
}
