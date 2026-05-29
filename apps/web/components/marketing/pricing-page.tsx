import Link from "next/link";
import { FoundingCounter } from "@/components/marketing/founding-counter";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { FOUNDING_PRICE_LONG, PRICING } from "@/lib/marketing-content";

export function PricingPage() {
  return (
    <MarketingPageShell fitViewport className="pricing-page-shell">
      <section className="block pricing-page-section" id="pricing">
        <div className="wrap">
          <div className="section-head">
            <div className="left">
              <div className="ses">Pricing</div>
              <h2>
                Pay us. So <em>no one else can.</em>
              </h2>
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
            <FoundingCounter />
            <Link href="/#cta" className="btn-primary pricing-waitlist-cta">
              Join waitlist
            </Link>
          </div>

          <div className="pricing">
            {PRICING.map((tier) => (
              <div
                key={tier.tier}
                className={`price${tier.popular ? " popular" : ""}`}
              >
                <div className="tier">{tier.tier}</div>
                <div className="amt">
                  {tier.amount}
                  <small>{tier.period}</small>
                </div>
                <ul>
                  {tier.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <button type="button">{tier.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
