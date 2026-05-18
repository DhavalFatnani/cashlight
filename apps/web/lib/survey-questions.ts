/**
 * Single source of truth for the post-signup survey.
 * Imported by both the client UI (`SurveyPanel`) and the API route
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

export type SurveyResponse = {
  email: string;
  source: (typeof SOURCE_OPTIONS)[number];
  situation: Array<(typeof SITUATION_OPTIONS)[number]>;
  current_tool: (typeof CURRENT_TOOL_OPTIONS)[number];
  pain_hours: (typeof PAIN_HOURS_OPTIONS)[number];
  pain_gap: (typeof PAIN_GAP_OPTIONS)[number];
  pain_gap_other: string | null;
  wtp_band: (typeof WTP_OPTIONS)[number];
  feature_priorities: Array<(typeof FEATURE_OPTIONS)[number]>;
  feedback: string | null;
};
