"use client";

import { useCallback, useEffect, useState } from "react";
import { playPaymentSound, primePaymentSound } from "@/lib/play-payment-sound";

const SOUND_ENABLED_KEY = "cashlight-sound-enabled";

export function useGlobalSound() {
  const [isEnabled, setIsEnabled] = useState(true);

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

  useEffect(() => {
    try {
      window.localStorage.removeItem("cashlight-sound-variant");
    } catch {
      // ignore
    }

    function prime() {
      primePaymentSound();
    }

    window.addEventListener("pointerdown", prime, { once: true });
    return () => window.removeEventListener("pointerdown", prime);
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
    void playPaymentSound();
  }, [isEnabled]);

  return { isEnabled, toggleSound, playChime };
}
