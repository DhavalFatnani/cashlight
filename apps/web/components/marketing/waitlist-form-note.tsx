"use client";

import { useWaitlistStats } from "@/lib/use-waitlist-stats";

/** Hero/footer microcopy: live waitlist count (no hardcoded position). */
export function WaitlistFormNote() {
  const { stats, loading } = useWaitlistStats();

  return (
    <>
      No credit card. No payment today. First {stats.total} people only.{" "}
      {loading ? (
        <span className="waitlist-form-note-loading">Updating count…</span>
      ) : (
        <em>
          {stats.claimed} / {stats.total} spots claimed.
        </em>
      )}
    </>
  );
}
