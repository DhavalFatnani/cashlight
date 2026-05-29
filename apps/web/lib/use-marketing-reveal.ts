"use client";

import { useEffect } from "react";

/** Reveal `.reveal` / `.reveal-stagger` inside a section (landing runs its own global observer). */
export function useMarketingReveal(
  rootId: string | null,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled || !rootId) return;

    let io: IntersectionObserver | null = null;
    let cancelled = false;

    function setup() {
      if (cancelled || !rootId) return;

      const root = document.getElementById(rootId);
      if (!root) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const targets = root.querySelectorAll(".reveal, .reveal-stagger");

      function revealNow(el: Element) {
        el.classList.add("in");
      }

      if (reduced) {
        targets.forEach(revealNow);
        return;
      }

      function isBelowFold(el: Element) {
        return el.getBoundingClientRect().top > window.innerHeight * 0.85;
      }

      io?.disconnect();
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            revealNow(entry.target);
            io?.unobserve(entry.target);
          }
        },
        { threshold: 0.1, rootMargin: "0px" },
      );

      targets.forEach((el) => {
        if (isBelowFold(el)) {
          io?.observe(el);
        } else {
          revealNow(el);
        }
      });
    }

    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(setup);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      io?.disconnect();
    };
  }, [rootId, enabled]);
}
