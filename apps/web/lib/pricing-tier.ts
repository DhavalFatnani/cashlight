import type { PricingTier } from "@/lib/marketing-content";

/** Parse display amount (e.g. "₹299") to integer INR for storage. */
export function parseInrAmount(amount: string): number {
  const digits = amount.replace(/\D/g, "");
  if (!digits) return 0;
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

/** Normalize period copy to a short billing_period value. */
export function billingPeriodFromDisplay(period: string): string {
  const p = period.trim().toLowerCase();
  if (p.includes("forever")) return "forever";
  if (p.includes("month")) return "month";
  if (p.includes("year")) return "year";
  return p.replace(/^\s*\/\s*/, "") || "unknown";
}

export function formatTierOffer(tier: PricingTier): string {
  return `${tier.amount}${tier.period}`.trim();
}
