"use client";

import { useEffect, useRef, useState } from "react";

const PULSE_SEEN_KEY = "cashlight-sound-seen";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

function getAudioContextCtor(): typeof AudioContext | null {
  if (typeof window === "undefined") return null;
  return window.AudioContext ?? window.webkitAudioContext ?? null;
}

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
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(PULSE_SEEN_KEY)) {
        setHasInteracted(false);
      }
    } catch {
      // Private mode / blocked storage — skip the pulse, no big deal.
    }
  }, []);

  function playChime() {
    if (!hasInteracted) {
      setHasInteracted(true);
      try {
        window.localStorage.setItem(PULSE_SEEN_KEY, "1");
      } catch {
        // ignore storage failures
      }
    }

    const Ctor = getAudioContextCtor();
    if (!Ctor) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new Ctor();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.gain.linearRampToValueAtTime(0.22, now + 0.02);
    master.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
    master.connect(ctx.destination);

    // Warm A-major arpeggio: A4 → C#5 → E5, sine for soft tone.
    const notes: Array<{ freq: number; delay: number; duration: number; gain: number }> = [
      { freq: 440, delay: 0, duration: 0.55, gain: 0.7 },
      { freq: 554.37, delay: 0.08, duration: 0.55, gain: 0.55 },
      { freq: 659.25, delay: 0.18, duration: 0.65, gain: 0.45 },
    ];

    notes.forEach(({ freq, delay, duration, gain }) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const env = ctx.createGain();
      env.gain.value = 0;
      env.gain.linearRampToValueAtTime(gain, now + delay + 0.015);
      env.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
      osc.connect(env).connect(master);
      osc.start(now + delay);
      osc.stop(now + delay + duration + 0.05);
    });

    // Low A3 octave triangle for amber warmth under the arpeggio.
    const lowOsc = ctx.createOscillator();
    lowOsc.type = "triangle";
    lowOsc.frequency.value = 220;
    const lowEnv = ctx.createGain();
    lowEnv.gain.value = 0;
    lowEnv.gain.linearRampToValueAtTime(0.22, now + 0.02);
    lowEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    lowOsc.connect(lowEnv).connect(master);
    lowOsc.start(now);
    lowOsc.stop(now + 0.9);
  }

  return (
    <button
      type="button"
      className={`sound-toggle${hasInteracted ? "" : " is-pulsing"}`}
      onClick={playChime}
      aria-label="Play Cashlight chime"
    >
      <SpeakerIcon />
    </button>
  );
}
