"use client";

import { HealthReportCard } from "@/components/marketing/health-report-card";
import { LandingTicker } from "@/components/marketing/landing-ticker";
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
          <div className="ses hero-eyebrow reveal">
            {"// YOUR MONEY, FINALLY UNDERSTOOD"}
          </div>
          <h1 className="reveal">
            Your money is
            <br />
            <em>more complicated than any app admits.</em>
          </h1>
          <p className="hero-descriptor reveal">
            Cashlight shows you where you stand, and what the financially sorted
            do differently.
          </p>
          <p className="hero-sub reveal">
            You juggle multiple accounts, support family, get lumpy bonuses, and
            pay EMIs across banks. Most tools show you charts. Cashlight reads
            your actual statements and shows you where you really stand — and
            what your options are.
          </p>
          <p className="hero-hint reveal">
            <em>Try clicking the nodes in the background to make payments</em>
          </p>

          <WaitlistForm
            source="hero"
            label="Want to know where you actually stand?"
            noteSuffix=", locked for life"
            surveyState={surveyState}
            onWaitlistSuccess={onWaitlistSuccess}
          />
        </div>

        <div className="hero-report-slot reveal">
          <HealthReportCard />
        </div>
      </div>

      <LandingTicker />
    </header>
  );
}
