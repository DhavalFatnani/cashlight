import {
  CURRENT_TOOL_OPTIONS,
  FEATURE_MAX,
  FEATURE_OPTIONS,
  FEEDBACK_MAX,
  PAIN_GAP_OPTIONS,
  PAIN_GAP_OTHER_MAX,
  PAIN_HOURS_OPTIONS,
  SITUATION_OPTIONS,
  SOURCE_OPTIONS,
  type SurveyResponse,
  WTP_OPTIONS,
} from "@/lib/survey-questions";
import {
  isSurveyPricingTierId,
  surveyPricingTierOption,
} from "@/lib/survey-pricing-tier";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidateResult =
  | { ok: true; value: SurveyResponse }
  | { ok: false; error: string };

function isStringFrom<T extends readonly string[]>(
  value: unknown,
  options: T,
): value is T[number] {
  return typeof value === "string" && (options as readonly string[]).includes(value);
}

function isStringArrayFrom<T extends readonly string[]>(
  value: unknown,
  options: T,
): value is Array<T[number]> {
  if (!Array.isArray(value)) return false;
  return value.every((v) => isStringFrom(v, options));
}

export function validateSurveyPayload(input: unknown): ValidateResult {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: "Body must be a JSON object" };
  }
  const body = input as Record<string, unknown>;

  const emailRaw = body.email;
  if (typeof emailRaw !== "string") {
    return { ok: false, error: "Email is required" };
  }
  const email = emailRaw.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Invalid email" };
  }

  if (!isStringFrom(body.source, SOURCE_OPTIONS)) {
    return { ok: false, error: "Invalid source" };
  }

  if (
    !isStringArrayFrom(body.situation, SITUATION_OPTIONS) ||
    body.situation.length === 0
  ) {
    return { ok: false, error: "Pick at least one situation" };
  }

  if (!isStringFrom(body.current_tool, CURRENT_TOOL_OPTIONS)) {
    return { ok: false, error: "Invalid current_tool" };
  }

  if (!isStringFrom(body.pain_hours, PAIN_HOURS_OPTIONS)) {
    return { ok: false, error: "Invalid pain_hours" };
  }

  if (
    !isStringArrayFrom(body.pain_gap, PAIN_GAP_OPTIONS) ||
    body.pain_gap.length === 0
  ) {
    return { ok: false, error: "Pick at least one pain point" };
  }

  let painGapOther: string | null = null;
  if (body.pain_gap.includes("Other")) {
    if (typeof body.pain_gap_other !== "string") {
      return { ok: false, error: "Please describe your other gap" };
    }
    const trimmed = body.pain_gap_other.trim();
    if (trimmed.length === 0) {
      return { ok: false, error: "Please describe your other gap" };
    }
    if (trimmed.length > PAIN_GAP_OTHER_MAX) {
      return { ok: false, error: `Keep that under ${PAIN_GAP_OTHER_MAX} characters` };
    }
    painGapOther = trimmed;
  }

  if (
    typeof body.pricing_tier !== "string" ||
    !isSurveyPricingTierId(body.pricing_tier)
  ) {
    return { ok: false, error: "Pick a tier" };
  }
  const pricingChoice = surveyPricingTierOption(body.pricing_tier);
  if (!pricingChoice) {
    return { ok: false, error: "Invalid tier" };
  }
  if (!isStringFrom(pricingChoice.wtpBand, WTP_OPTIONS)) {
    return { ok: false, error: "Invalid wtp_band mapping" };
  }

  if (
    !isStringArrayFrom(body.feature_priorities, FEATURE_OPTIONS) ||
    body.feature_priorities.length < 1 ||
    body.feature_priorities.length > FEATURE_MAX
  ) {
    return {
      ok: false,
      error: `Pick between 1 and ${FEATURE_MAX} features`,
    };
  }

  let feedback: string | null = null;
  if (body.feedback !== undefined && body.feedback !== null) {
    if (typeof body.feedback !== "string") {
      return { ok: false, error: "Feedback must be text" };
    }
    const trimmed = body.feedback.trim();
    if (trimmed.length > FEEDBACK_MAX) {
      return { ok: false, error: `Keep feedback under ${FEEDBACK_MAX} characters` };
    }
    feedback = trimmed.length > 0 ? trimmed : null;
  }

  return {
    ok: true,
    value: {
      email,
      source: body.source,
      situation: body.situation,
      current_tool: body.current_tool,
      pain_hours: body.pain_hours,
      pain_gap: body.pain_gap,
      pain_gap_other: painGapOther,
      wtp_band: pricingChoice.wtpBand,
      pricing_tier: body.pricing_tier,
      feature_priorities: body.feature_priorities,
      feedback,
    },
  };
}
