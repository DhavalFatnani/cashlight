/**
 * Single source of truth for the post-signup survey.
 * Imported by both the client UI (`SurveyModal`) and the API route
 * (`/api/survey`) so the allowed values stay in lock-step.
 */

export const SITUATION_OPTIONS = [
  "Salaried",
  "Freelancer/consultant",
  "Business owner",
  "Supporting family financially",
  "Dual-income household",
  "Student/early career",
] as const;

export const CURRENT_TOOL_OPTIONS = [
  "Nothing — just check statements",
  "A spreadsheet I built",
  "My bank's app",
  "Walnut / Money View",
  "INDmoney / Jupiter / Fi",
  "A CA or financial advisor",
  "Other",
] as const;

export const PAIN_HOURS_OPTIONS = [
  "Zero — I've got a system",
  "Less than 1 hour",
  "1–3 hours",
  "3+ hours",
] as const;

export const PAIN_GAP_OPTIONS = [
  "They push insurance / mutual funds",
  "They show data, not insight",
  "They ignore Indian context (UPI, family, bonuses)",
  "The numbers don't help me decide anything",
  "Too cluttered / too many features",
  "Other",
] as const;

export const WTP_OPTIONS = [
  "I wouldn't pay",
  "₹49/mo",
  "₹99/mo",
  "₹299/mo (our Pro tier)",
  "₹999/mo (our Premium tier)",
  "More if it's significantly better",
] as const;

export const FEATURE_OPTIONS = [
  "8-dimension health report",
  '"What-if" scenario simulator',
  "Tax optimization (80C + regime)",
  "Bonus / irregular income planning",
  "Family / household view",
  "Quarterly human CA review",
  "Insurance adequacy check",
  "Investment portfolio analysis",
] as const;

export const SOURCE_OPTIONS = ["hero", "footer"] as const;

export const FEATURE_MAX = 3;
export const PAIN_GAP_OTHER_MAX = 200;
export const FEEDBACK_MAX = 250;

export const SURVEY_STEP_COUNT = 7;

export type SurveyStepId =
  | "situation"
  | "current_tool"
  | "pain_hours"
  | "pain_gap"
  | "feature_priorities"
  | "feedback"
  | "pricing_tier";

type SurveyStepBase = {
  id: SurveyStepId;
  question: string;
  hint?: string;
};

export type SurveyStepMulti = SurveyStepBase & {
  type: "multi";
  options: readonly string[];
  required: true;
};

export type SurveyStepSingle = SurveyStepBase & {
  type: "single";
  options: readonly string[];
  required: true;
  autoAdvance: true;
};

export type SurveyStepMultiWithOther = SurveyStepBase & {
  type: "multi_with_other";
  options: readonly string[];
  otherOption: "Other";
  required: true;
};

export type SurveyStepMultiCap = SurveyStepBase & {
  type: "multi_cap";
  options: readonly string[];
  max: number;
  required: true;
};

export type SurveyStepText = SurveyStepBase & {
  type: "text";
  required: false;
  maxLength: number;
};

export type SurveyStep =
  | SurveyStepMulti
  | SurveyStepSingle
  | SurveyStepMultiWithOther
  | SurveyStepMultiCap
  | SurveyStepText;

export const SURVEY_STEPS: SurveyStep[] = [
  {
    id: "situation",
    type: "multi",
    question: "Which best describes you?",
    options: SITUATION_OPTIONS,
    required: true,
  },
  {
    id: "current_tool",
    type: "single",
    question: "What do you use today to track your finances?",
    options: CURRENT_TOOL_OPTIONS,
    required: true,
    autoAdvance: true,
  },
  {
    id: "pain_hours",
    type: "single",
    question:
      "In a typical month, how much time do you lose to financial confusion or planning friction?",
    options: PAIN_HOURS_OPTIONS,
    required: true,
    autoAdvance: true,
  },
  {
    id: "pain_gap",
    type: "multi_with_other",
    question: "What bothers you most about the financial tools you've tried?",
    options: PAIN_GAP_OPTIONS,
    otherOption: "Other",
    required: true,
  },
  {
    id: "feature_priorities",
    type: "multi_cap",
    question: "Pick the 3 most valuable features for you.",
    options: FEATURE_OPTIONS,
    max: FEATURE_MAX,
    required: true,
  },
  {
    id: "feedback",
    type: "text",
    question:
      'What\'s the one thing that would make Cashlight a "yes" for you in week 1?',
    hint: "optional",
    required: false,
    maxLength: FEEDBACK_MAX,
  },
  {
    id: "pricing_tier",
    type: "single",
    question:
      "If we launched tomorrow, which plan would you actually start on?",
    hint: "Same plans as our pricing page — pick what you’d actually use.",
    options: ["Free", "Pro", "Premium", "Founding", "None"] as const,
    required: true,
    autoAdvance: true,
  },
];

export type SurveyAnswers = {
  situation: string[];
  current_tool: string | null;
  pain_hours: string | null;
  pain_gap: string[];
  pain_gap_other: string;
  pricing_tier: string | null;
  feature_priorities: string[];
  feedback: string;
};

export const EMPTY_SURVEY_ANSWERS: SurveyAnswers = {
  situation: [],
  current_tool: null,
  pain_hours: null,
  pain_gap: [],
  pain_gap_other: "",
  pricing_tier: null,
  feature_priorities: [],
  feedback: "",
};

export type SurveyResponse = {
  email: string;
  source: (typeof SOURCE_OPTIONS)[number];
  situation: Array<(typeof SITUATION_OPTIONS)[number]>;
  current_tool: (typeof CURRENT_TOOL_OPTIONS)[number];
  pain_hours: (typeof PAIN_HOURS_OPTIONS)[number];
  pain_gap: Array<(typeof PAIN_GAP_OPTIONS)[number]>;
  pain_gap_other: string | null;
  wtp_band: (typeof WTP_OPTIONS)[number];
  /** Survey plan pick — persisted to `pricing_intents` on submit */
  pricing_tier: string;
  feature_priorities: Array<(typeof FEATURE_OPTIONS)[number]>;
  feedback: string | null;
};
