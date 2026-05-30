"use client";

import { useEffect, useState } from "react";

type WaitlistProgressProps = {
  claimed: number;
  total: number;
  /** e.g. "spots claimed" or "on the waitlist" */
  countLabel?: string;
  className?: string;
};

export function WaitlistProgress({
  claimed,
  total,
  countLabel = "spots claimed",
  className = "",
}: WaitlistProgressProps) {
  const [progressPct, setProgressPct] = useState(0);
  const safeTotal = total > 0 ? total : 1;
  const displayClaimed = Math.min(claimed, safeTotal);
  const targetPct = (displayClaimed / safeTotal) * 100;

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setProgressPct(targetPct);
      return;
    }
    const id = requestAnimationFrame(() => setProgressPct(targetPct));
    return () => cancelAnimationFrame(id);
  }, [targetPct]);

  const rootClass = ["waitlist-progress", className].filter(Boolean).join(" ");

  return (
    <div className={rootClass}>
      <div className="founding-stats">
        <div className="count">
          <b>
            {claimed} / {total} {countLabel}
          </b>
        </div>
        <div
          className="founding-progress"
          role="progressbar"
          aria-valuenow={displayClaimed}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Waitlist progress: ${claimed} of ${total}`}
        >
          <div
            className="founding-progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
