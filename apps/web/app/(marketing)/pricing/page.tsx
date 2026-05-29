import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { PricingPage } from "@/components/marketing/pricing-page";
import { pricingPageJsonLd } from "@/lib/seo/json-ld";
import { PRICING_METADATA } from "@/lib/seo/metadata";

export const metadata: Metadata = PRICING_METADATA;
export const dynamic = "force-static";

export default function PricingRoute() {
  return (
    <>
      <JsonLd data={pricingPageJsonLd()} />
      <PricingPage />
    </>
  );
}
