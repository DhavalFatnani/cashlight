import { getSupabaseServer } from "./client";
import { hasSurveyForEmail } from "./survey";

export type WaitlistResult = {
  position: number;
  isNew: boolean;
  surveyCompleted: boolean;
};

export async function getWaitlistCount(): Promise<number> {
  const supabase = getSupabaseServer();
  const { count, error } = await supabase
    .from("waitlist")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

export async function addToWaitlist(
  email: string,
  source: string,
): Promise<WaitlistResult> {
  const supabase = getSupabaseServer();

  const { data: existing } = await supabase
    .from("waitlist")
    .select("id, created_at")
    .eq("email", email)
    .maybeSingle();

  if (!existing) {
    const { error: insertError } = await supabase
      .from("waitlist")
      .insert({ email, source });

    if (insertError) {
      throw insertError;
    }
  }

  const createdAt = existing?.created_at;
  const { data: target } = createdAt
    ? { data: { created_at: createdAt } }
    : await supabase
        .from("waitlist")
        .select("created_at")
        .eq("email", email)
        .single();

  if (!target) {
    throw new Error("Waitlist row missing after insert");
  }

  const { count, error: positionError } = await supabase
    .from("waitlist")
    .select("*", { count: "exact", head: true })
    .lte("created_at", target.created_at);

  if (positionError) {
    throw positionError;
  }

  const surveyCompleted = await hasSurveyForEmail(email);

  return {
    position: count ?? 1,
    isNew: !existing,
    surveyCompleted,
  };
}
