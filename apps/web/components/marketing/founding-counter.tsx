"use client";

import { WaitlistProgress } from "@/components/marketing/waitlist-progress";
import { useWaitlistStats } from "@/lib/use-waitlist-stats";

type FoundingCounterProps = {
  /** Server-rendered count — avoids loading flash when provided */
  initialClaimed?: number;
  initialTotal?: number;
};

export function FoundingCounter({
  initialClaimed,
  initialTotal,
}: FoundingCounterProps = {}) {
  const { stats, loading } = useWaitlistStats({
    claimed: initialClaimed,
    total: initialTotal,
  });

  if (loading) {
    return (
      <div className="founding-stats founding-stats--loading" aria-busy="true">
        <div className="count">
          <b>Loading waitlist…</b>
        </div>
        <div className="founding-progress" aria-hidden>
          <div className="founding-progress-fill" style={{ width: "0%" }} />
        </div>
      </div>
    );
  }

  return <WaitlistProgress claimed={stats.claimed} total={stats.total} />;
}
