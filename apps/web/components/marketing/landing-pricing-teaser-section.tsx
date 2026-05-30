import Link from "next/link";
import { FoundingCounter } from "@/components/marketing/founding-counter";
import { FOUNDING_PRICE_LONG } from "@/lib/marketing-content";

export function LandingPricingTeaserSection() {
  return (
    <section className="block pricing-teaser-block" id="pricing-teaser">
      <div className="wrap-narrow">
        <div className="section-head reveal">
          <div className="ses">{"// FOUNDING"}</div>
          <h2>
            Pay us. So <em>no one else does.</em>
          </h2>
          <p className="lede">
            Paid by you — not manufacturers. No ads, no commissions, no whispered
            product pitches.
          </p>
        </div>

        <div className="founding founding--pricing-teaser reveal">
          <div className="lbl">{"// founding"}</div>
          <div className="copy">
            <b>{FOUNDING_PRICE_LONG}</b>, locked for life. First 200 people.
          </div>
          <FoundingCounter />
        </div>

        <p className="pricing-teaser-link reveal">
          <Link href="/pricing">See what&apos;s in Free, Pro &amp; Premium →</Link>
        </p>
      </div>
    </section>
  );
}
