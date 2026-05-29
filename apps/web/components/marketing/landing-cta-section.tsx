"use client";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import {
  WaitlistForm,
  type SurveyState,
  type WaitlistSuccessPayload,
} from "@/components/marketing/waitlist-form";
import {
  FOUNDING_PRICE_LABEL,
  WAITLIST_DISPLAY_POSITION,
} from "@/lib/marketing-content";

type LandingCtaSectionProps = {
  surveyState: SurveyState;
  onWaitlistSuccess: (payload: WaitlistSuccessPayload) => void;
};

export function LandingCtaSection({
  surveyState,
  onWaitlistSuccess,
}: LandingCtaSectionProps) {
  return (
    <footer className="site-footer" id="cta">
      <div className="footer-cta wrap-narrow">
        <h2 className="reveal">
          Want to know where you <em>actually</em> stand?
        </h2>
        <p className="ps reveal">Founding list · we&apos;ll tell you when it&apos;s ready.</p>
        <WaitlistForm
          source="cta"
          label="Get on the founding list"
          submitLabel={`Get founding access — ${FOUNDING_PRICE_LABEL}`}
          listPosition={WAITLIST_DISPLAY_POSITION}
          surveyState={surveyState}
          onWaitlistSuccess={onWaitlistSuccess}
        />
      </div>
      <MarketingFooter embedded />
    </footer>
  );
}
