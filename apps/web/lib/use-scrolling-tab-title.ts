"use client";

import { useEffect } from "react";

/** Matches layout metadata — the line users should see sliding in the tab. */
const TAGLINE = "Your money, finally understood.";
const TAB_PREFIX = "Cashlight · ";
const LOOP_GAP = "          ";
const DEFAULT_TITLE = "Cashlight | Your money, finally understood.";

/** Characters per second — lower = slower, smoother read in the tab. */
const SCROLL_SPEED = 7.5;
/** Visible window width in the tab (browsers truncate long titles anyway). */
const WINDOW_CHARS = 38;

export function useScrollingTabTitle(): void {
  useEffect(() => {
    const track = `${TAGLINE}${LOOP_GAP}`;
    let offset = 0;
    let lastTime = performance.now();
    let rafId = 0;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    function setStaticTitle() {
      document.title = DEFAULT_TITLE;
    }

    function frame(now: number) {
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      offset = (offset + delta * SCROLL_SPEED) % track.length;
      const start = Math.floor(offset);
      const rotated = track.slice(start) + track.slice(0, start);
      document.title = TAB_PREFIX + rotated.slice(0, WINDOW_CHARS);
      rafId = requestAnimationFrame(frame);
    }

    function start() {
      cancelAnimationFrame(rafId);
      lastTime = performance.now();
      rafId = requestAnimationFrame(frame);
    }

    function stop() {
      cancelAnimationFrame(rafId);
      setStaticTitle();
    }

    if (reduced.matches) {
      setStaticTitle();
    } else {
      start();
    }

    const onMotionChange = () => {
      if (reduced.matches) stop();
      else start();
    };
    reduced.addEventListener("change", onMotionChange);

    return () => {
      reduced.removeEventListener("change", onMotionChange);
      stop();
    };
  }, []);
}
