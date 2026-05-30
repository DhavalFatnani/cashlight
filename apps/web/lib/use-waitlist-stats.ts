"use client";

import { useCallback, useEffect, useState } from "react";
import {
  WAITLIST_STATS_DEFAULT,
  fetchWaitlistStats,
  type WaitlistStats,
} from "@/lib/waitlist-stats";

export function useWaitlistStats(initial?: Partial<WaitlistStats>): {
  stats: WaitlistStats;
  loading: boolean;
  refresh: () => Promise<void>;
} {
  const initialClaimed =
    typeof initial?.claimed === "number" ? initial.claimed : undefined;
  const [stats, setStats] = useState<WaitlistStats>(() => ({
    claimed: initialClaimed ?? WAITLIST_STATS_DEFAULT.claimed,
    total:
      typeof initial?.total === "number"
        ? initial.total
        : WAITLIST_STATS_DEFAULT.total,
  }));
  const [loading, setLoading] = useState(initialClaimed === undefined);

  const refresh = useCallback(async () => {
    try {
      const next = await fetchWaitlistStats();
      setStats(next);
    } catch {
      /* keep last known stats */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { stats, loading, refresh };
}
