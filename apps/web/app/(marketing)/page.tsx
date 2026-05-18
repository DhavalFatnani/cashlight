import { getWaitlistCount } from "@cashlight/db";
import { LandingPage } from "@/components/marketing/landing-page";

export const revalidate = 30;

const TOTAL_FOUNDING = 200;
const FALLBACK_SPOTS = 137;

export default async function MarketingPage() {
  let spotsRemaining = FALLBACK_SPOTS;
  try {
    const count = await getWaitlistCount();
    spotsRemaining = Math.max(0, TOTAL_FOUNDING - count);
  } catch {
    // Supabase env missing or read failed — keep fallback.
  }
  return <LandingPage initialSpots={spotsRemaining} />;
}
