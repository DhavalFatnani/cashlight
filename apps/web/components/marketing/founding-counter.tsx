"use client";

import { useEffect, useState } from "react";
import { SPOTS_CLAIMED, TOTAL_FOUNDING_SPOTS } from "@/lib/marketing-content";

export function FoundingCounter() {
  const [progressPct, setProgressPct] = useState(0);
  const targetPct = (SPOTS_CLAIMED / TOTAL_FOUNDING_SPOTS) * 100;

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

  return (
    <div className="founding-stats">
      <div className="count">
        <b>
          {SPOTS_CLAIMED} / {TOTAL_FOUNDING_SPOTS} spots claimed
        </b>
      </div>
      <div
        className="founding-progress"
        role="progressbar"
        aria-valuenow={SPOTS_CLAIMED}
        aria-valuemin={0}
        aria-valuemax={TOTAL_FOUNDING_SPOTS}
        aria-label="Founding spots claimed"
      >
        <div
          className="founding-progress-fill"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}
