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
          <p className="ses hero-eyebrow reveal">
            {"// YOUR MONEY, FINALLY UNDERSTOOD"}
          </p>
          <h1 className="reveal">
            Your money is
            <br />
            <em>more complicated than any app admits.</em>
          </h1>
          <p className="hero-sub reveal">
            Multiple accounts, family you support, lumpy bonuses, EMIs across
            banks. Cashlight reads your actual statements and shows you where
            you really stand.
          </p>
          <p className="hero-hint reveal">
            <em>Try clicking the nodes in the background to make payments</em>
          </p>

          <WaitlistForm
            source="hero"
            label="Want to know where you actually stand?"
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
