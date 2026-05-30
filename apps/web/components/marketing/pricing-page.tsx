import Link from "next/link";
import { FoundingCounter } from "@/components/marketing/founding-counter";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { PricingTiers } from "@/components/marketing/pricing-tiers";
import { FOUNDING_PRICE_LONG, TOTAL_FOUNDING_SPOTS } from "@/lib/marketing-content";

type PricingPageProps = {
  initialWaitlistClaimed?: number;
};

export function PricingPage({ initialWaitlistClaimed }: PricingPageProps = {}) {
  return (
    <MarketingPageShell fitViewport className="pricing-page-shell">
      <section className="block pricing-page-section" id="pricing">
        <div className="wrap">
          <div className="section-head">
            <div className="left">
              <p className="ses">Pricing</p>
              <h1>
                Pay us. So <em>no one else can.</em>
              </h1>
              <p className="lede">
                Your subscription only. No ads, commissions, or conflicts.
              </p>
            </div>
            <div className="right">GST included · INR</div>
          </div>

          <div className="founding founding--pricing">
            <div className="founding-pricing-main">
              <div className="lbl">{"// founding"}</div>
              <p className="copy">
                <b>{FOUNDING_PRICE_LONG}</b>, locked for life. First 200 users
                only.
              </p>
            </div>
            <FoundingCounter
              initialClaimed={initialWaitlistClaimed}
              initialTotal={TOTAL_FOUNDING_SPOTS}
            />
            <Link href="/#cta" className="btn-primary pricing-waitlist-cta">
              Join waitlist
            </Link>
          </div>

          <PricingTiers />
        </div>
      </section>
    </MarketingPageShell>
  );
}
