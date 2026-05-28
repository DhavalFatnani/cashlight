"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SOUND_ENABLED_KEY = "cashlight-sound-enabled";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

function getAudioContextCtor(): typeof AudioContext | null {
  if (typeof window === "undefined") return null;
  return window.AudioContext ?? window.webkitAudioContext ?? null;
}

export function useGlobalSound() {
  const [isEnabled, setIsEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SOUND_ENABLED_KEY);
      if (stored !== null) {
        setIsEnabled(stored === "true");
      }
    } catch {
      // Private mode / blocked storage — default to enabled
    }
  }, []);

  const toggleSound = useCallback(() => {
    setIsEnabled((prev) => {
      const newValue = !prev;
      try {
        window.localStorage.setItem(SOUND_ENABLED_KEY, String(newValue));
      } catch {
        // ignore storage failures
      }
      return newValue;
    });
  }, []);

  const playChime = useCallback(() => {
    if (!isEnabled) return;

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
    master.gain.linearRampToValueAtTime(0.25, now + 0.01);
    master.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    master.connect(ctx.destination);

    // Cha-ching: Two quick bright notes with metallic tone
    const notes: Array<{ freq: number; delay: number; duration: number; gain: number; type: OscillatorType }> = [
      { freq: 1318.51, delay: 0, duration: 0.1, gain: 0.4, type: "triangle" }, // E6
      { freq: 1567.98, delay: 0.07, duration: 0.12, gain: 0.35, type: "triangle" }, // G6
    ];

    notes.forEach(({ freq, delay, duration, gain, type }) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;
      const env = ctx.createGain();
      env.gain.value = 0;
      env.gain.linearRampToValueAtTime(gain, now + delay + 0.005);
      env.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
      osc.connect(env).connect(master);
      osc.start(now + delay);
      osc.stop(now + delay + duration + 0.02);
    });

    // Add a high-pitched "ding" harmonic for sparkle
    const dingOsc = ctx.createOscillator();
    dingOsc.type = "sine";
    dingOsc.frequency.value = 2093; // C7
    const dingEnv = ctx.createGain();
    dingEnv.gain.value = 0;
    dingEnv.gain.linearRampToValueAtTime(0.15, now + 0.05);
    dingEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    dingOsc.connect(dingEnv).connect(master);
    dingOsc.start(now + 0.05);
    dingOsc.stop(now + 0.25);
  }, [isEnabled]);

  return { isEnabled, toggleSound, playChime };
}
