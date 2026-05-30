import { getWaitlistCount } from "@cashlight/db";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { PricingPage } from "@/components/marketing/pricing-page";
import { pricingPageJsonLd } from "@/lib/seo/json-ld";
import { PRICING_METADATA } from "@/lib/seo/metadata";

export const metadata: Metadata = PRICING_METADATA;
/** Refresh founding bar count from Supabase periodically */
export const revalidate = 30;

export default async function PricingRoute() {
  let initialWaitlistClaimed = 0;
  try {
    initialWaitlistClaimed = await getWaitlistCount();
  } catch (error) {
    console.error(
      "[pricing] waitlist count",
      error instanceof Error ? error.message : error,
    );
  }

  return (
    <>
      <JsonLd data={pricingPageJsonLd()} />
      <PricingPage initialWaitlistClaimed={initialWaitlistClaimed} />
    </>
  );
}
