import { TOTAL_FOUNDING_SPOTS } from "@/lib/marketing-content";

export type WaitlistStats = {
  claimed: number;
  total: number;
};

export const WAITLIST_STATS_DEFAULT: WaitlistStats = {
  claimed: 0,
  total: TOTAL_FOUNDING_SPOTS,
};

export async function fetchWaitlistStats(): Promise<WaitlistStats> {
  const res = await fetch("/api/waitlist", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load waitlist stats");
  }
  const data = (await res.json()) as {
    claimed?: number;
    total?: number;
  };
  return {
    claimed: typeof data.claimed === "number" ? data.claimed : 0,
    total: typeof data.total === "number" ? data.total : TOTAL_FOUNDING_SPOTS,
  };
}
