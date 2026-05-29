import { LandingGapsSection } from "@/components/marketing/landing-gaps-section";
import { LandingPageClient } from "@/components/marketing/landing-page-client";
import { LandingPricingTeaserSection } from "@/components/marketing/landing-pricing-teaser-section";

/**
 * Landing — hero (in client shell) + gaps + pricing teaser + footer CTA.
 * Copy: section components + `lib/marketing-content.ts`
 */
export default function MarketingPage() {
  return (
    <LandingPageClient>
      <LandingGapsSection />
      <LandingPricingTeaserSection />
    </LandingPageClient>
  );
}
