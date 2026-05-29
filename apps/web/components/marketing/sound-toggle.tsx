"use client";

import { useEffect, useState } from "react";
import { playPaymentSound } from "@/lib/play-payment-sound";

const PULSE_SEEN_KEY = "cashlight-sound-seen";

function SpeakerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

export function SoundToggle() {
  /** Default `true` so SSR + initial paint never pulses (no flash before the
   * effect reads localStorage). The effect demotes to `false` for first-time
   * visitors to enable the attention pulse. */
  const [hasInteracted, setHasInteracted] = useState(true);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(PULSE_SEEN_KEY)) {
        setHasInteracted(false);
      }
    } catch {
      // Private mode / blocked storage — skip the pulse, no big deal.
    }
  }, []);

  function handlePlay() {
    if (!hasInteracted) {
      setHasInteracted(true);
      try {
        window.localStorage.setItem(PULSE_SEEN_KEY, "1");
      } catch {
        // ignore storage failures
      }
    }

    void playPaymentSound();
  }

  return (
    <button
      type="button"
      className={`sound-toggle${hasInteracted ? "" : " is-pulsing"}`}
      onClick={handlePlay}
      aria-label="Play payment success sound"
    >
      <SpeakerIcon />
    </button>
  );
}
