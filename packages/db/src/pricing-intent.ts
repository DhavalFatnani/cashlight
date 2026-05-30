import { getSupabaseServer } from "./client";

export const PRICING_TIER_IDS = ["free", "pro", "premium", "founding"] as const;
export type PricingTierId = (typeof PRICING_TIER_IDS)[number];

export type PricingIntentInput = {
  email: string;
  tier: PricingTierId;
  amountInr: number;
  billingPeriod: string;
  ctaLabel: string;
};

export function isPricingTierId(value: string): value is PricingTierId {
  return (PRICING_TIER_IDS as readonly string[]).includes(value);
}

export async function recordPricingIntent(
  input: PricingIntentInput,
): Promise<void> {
  const supabase = getSupabaseServer();
  const { error } = await supabase.from("pricing_intents").insert({
    email: input.email,
    tier: input.tier,
    amount_inr: input.amountInr,
    billing_period: input.billingPeriod,
    cta_label: input.ctaLabel,
  });
  if (error) throw error;
}

export async function getLatestPricingIntentTier(
  email: string,
): Promise<PricingTierId | null> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("pricing_intents")
    .select("tier")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  const tier = data?.tier;
  if (typeof tier !== "string" || !isPricingTierId(tier)) return null;
  return tier;
}
