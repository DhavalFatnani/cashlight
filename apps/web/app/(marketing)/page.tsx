import { JsonLd } from "@/components/seo/json-ld";
import { LandingGapsSection } from "@/components/marketing/landing-gaps-section";
import { LandingPageClient } from "@/components/marketing/landing-page-client";
import { LandingPricingTeaserSection } from "@/components/marketing/landing-pricing-teaser-section";
import { homePageJsonLd } from "@/lib/seo/json-ld";
import { HOME_METADATA } from "@/lib/seo/metadata";

export const metadata = HOME_METADATA;
export const dynamic = "force-static";

/**
 * Landing — hero (in client shell) + gaps + pricing teaser + footer CTA.
 * Copy: section components + `lib/marketing-content.ts`
 */
export default function MarketingPage() {
  return (
    <>
      <JsonLd data={homePageJsonLd()} />
      <LandingPageClient>
        <LandingGapsSection />
        <LandingPricingTeaserSection />
      </LandingPageClient>
    </>
  );
}
