import {
  isPricingTierId,
  recordPricingIntent,
  submitSurvey,
} from "@cashlight/db";
import { NextResponse } from "next/server";

import {
  isSurveyPricingTierId,
  pricingIntentTierFromSurvey,
  surveyPricingTierOption,
} from "@/lib/survey-pricing-tier";
import { validateSurveyPayload } from "./validate";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = validateSurveyPayload(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const { pricing_tier: surveyPricingTier, ...surveyPayload } = result.value;
    const submitResult = await submitSurvey(surveyPayload);

    const pricingChoice = isSurveyPricingTierId(surveyPricingTier)
      ? surveyPricingTierOption(surveyPricingTier)
      : undefined;
    const intentTier =
      pricingChoice && isSurveyPricingTierId(surveyPricingTier)
        ? pricingIntentTierFromSurvey(surveyPricingTier)
        : null;
    if (
      intentTier &&
      pricingChoice &&
      isPricingTierId(intentTier) &&
      !submitResult.alreadySubmitted
    ) {
      await recordPricingIntent({
        email: result.value.email,
        tier: intentTier,
        amountInr: pricingChoice.amountInr,
        billingPeriod: pricingChoice.billingPeriod,
        ctaLabel: `Survey: ${pricingChoice.ctaLabel}`,
      });
    }

    return NextResponse.json({
      success: true,
      alreadySubmitted: submitResult.alreadySubmitted,
    });
  } catch (error) {
    console.error("[survey]", error);
    return NextResponse.json(
      { error: "Unable to save response" },
      { status: 500 },
    );
  }
}
