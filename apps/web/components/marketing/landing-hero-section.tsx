"use client";

import { HealthReportCard } from "@/components/marketing/health-report-card";
import { LandingTicker } from "@/components/marketing/landing-ticker";
import { WaitlistFormNote } from "@/components/marketing/waitlist-form-note";
import {
  WaitlistForm,
  type SurveyState,
  type WaitlistSuccessPayload,
} from "@/components/marketing/waitlist-form";

type LandingHeroSectionProps = {
  surveyState: SurveyState;
  onWaitlistSuccess: (payload: WaitlistSuccessPayload) => void;
};

export function LandingHeroSection({
  surveyState,
  onWaitlistSuccess,
}: LandingHeroSectionProps) {
  return (
    <header className="hero">
      <div className="wrap hero-grid hero-grid--landing">
        <div className="hero-left">
          <div className="hero-left-main">
            <p className="ses hero-eyebrow reveal">
              {"// YOUR MONEY, FINALLY UNDERSTOOD"}
            </p>
            <h1 className="reveal">
              You earn well.{" "}
              <em>So why does money still feel like guesswork?</em>
            </h1>
            <ul className="hero-sub-list reveal">
              <li>Money spread across three accounts.</li>
              <li>Half of it going to family.</li>
              <li>A ₹2 lakh bonus that vanished by September.</li>
              <li>EMIs you&apos;ve quietly stopped tracking.</li>
              <li>
                Earning more was supposed to make this simpler. It didn&apos;t.
              </li>
            </ul>
            <p className="hero-hint reveal">
              <em>Try clicking the nodes in the background to make payments</em>
            </p>
          </div>

          <div className="hero-left-cta reveal">
            <p className="hero-sub-payoff hero-sub-payoff--highlight">
              Cashlight reads your actual statements and shows you exactly where
              you stand, and what people earning what you earn do differently.
            </p>
            <WaitlistForm
              source="hero"
              label="Join the founding waitlist"
              submitLabel="Join the waitlist"
              formNote={<WaitlistFormNote />}
              surveyState={surveyState}
              onWaitlistSuccess={onWaitlistSuccess}
            />
          </div>
        </div>

        <div className="hero-report-slot reveal">
          <div className="hero-report-card-wrap">
            <HealthReportCard />
          </div>
          <p className="report-sample-caption hero-report-caption">
            Sample report. Yours is built from your own statements. Upload them
            and this is what you get back.
          </p>
        </div>
      </div>

      <LandingTicker />
    </header>
  );
}
