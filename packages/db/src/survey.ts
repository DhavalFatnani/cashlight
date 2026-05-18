import { getSupabaseServer } from "./client";

export type SurveyPayload = {
  email: string;
  source: string;
  situation: string[];
  current_tool: string;
  pain_hours: string;
  pain_gap: string;
  pain_gap_other: string | null;
  wtp_band: string;
  feature_priorities: string[];
  feedback: string | null;
};

export async function submitSurvey(payload: SurveyPayload): Promise<void> {
  const supabase = getSupabaseServer();

  const { error } = await supabase.from("survey_responses").insert({
    email: payload.email,
    source: payload.source,
    situation: payload.situation,
    current_tool: payload.current_tool,
    pain_hours: payload.pain_hours,
    pain_gap: payload.pain_gap,
    pain_gap_other: payload.pain_gap_other,
    wtp_band: payload.wtp_band,
    feature_priorities: payload.feature_priorities,
    feedback: payload.feedback,
  });

  if (error) throw error;
}
