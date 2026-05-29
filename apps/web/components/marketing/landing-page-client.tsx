"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CoinBurst } from "@/components/marketing/coin-burst";
import dynamic from "next/dynamic";

const ComplexityVisualization = dynamic(
  () =>
    import("@/components/marketing/complexity-visualization").then(
      (mod) => mod.ComplexityVisualization,
    ),
  { ssr: false },
);
import { LandingCtaSection } from "@/components/marketing/landing-cta-section";
import { LandingHeroSection } from "@/components/marketing/landing-hero-section";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { SurveyModal } from "@/components/marketing/survey-modal";
import { ThankYouModal } from "@/components/marketing/thank-you-modal";
import type { WaitlistSuccessPayload } from "@/components/marketing/waitlist-form";
import { scrollToAnchor } from "@/lib/anchor-scroll";
import { useGlobalSound } from "@/lib/use-global-sound";
import { useScrollingTabTitle } from "@/lib/use-scrolling-tab-title";

type SurveyState = "default" | "submitted" | "skipped";

type PostSignupModal =
  | {
      kind: "survey";
      email: string;
      source: "hero" | "footer";
      position: number;
    }
  | {
      kind: "thanks";
      position: number;
      variant: "returning";
    };

type LandingPageClientProps = {
  children: ReactNode;
};

export function LandingPageClient({ children }: LandingPageClientProps) {
  const [modal, setModal] = useState<PostSignupModal | null>(null);
  const [surveyState, setSurveyState] = useState<SurveyState>("default");
  const [clickBursts, setClickBursts] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const { playChime, toggleSound } = useGlobalSound();
  useScrollingTabTitle();

  function handleWaitlistSuccess(payload: WaitlistSuccessPayload) {
    if (payload.surveyCompleted) {
      setSurveyState("submitted");
      setModal({
        kind: "thanks",
        position: payload.position,
        variant: "returning",
      });
      return;
    }
    const surveySource =
      payload.source === "hero" ? "hero" : "footer";
    setModal({
      kind: "survey",
      email: payload.email,
      source: surveySource,
      position: payload.position,
    });
  }

  useEffect(() => {
    let burstId = 0;
    const coarseMq = window.matchMedia("(pointer: coarse)");

    function handleClick(e: MouseEvent) {
      if (coarseMq.matches) return;
      playChime();
      const cursorTipOffsetY = 12;
      const cursorTipOffsetX = 8;
      const newBurst = {
        id: ++burstId,
        x: e.clientX - cursorTipOffsetX,
        y: e.clientY - cursorTipOffsetY,
      };
      setClickBursts((prev) => [...prev, newBurst]);
      setTimeout(() => {
        setClickBursts((prev) => prev.filter((b) => b.id !== newBurst.id));
      }, 1500);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "m" || e.key === "M") {
        toggleSound();
      }
    }

    document.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playChime, toggleSound]);

  useEffect(() => {
    const scrollRestoration = history.scrollRestoration;
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    function scrollFromHash(behavior: ScrollBehavior = "smooth") {
      const hash = window.location.hash.slice(1);
      if (hash === "cta") {
        scrollToAnchor("cta", behavior);
      }
    }

    function onHashChange() {
      scrollFromHash();
    }

    scrollFromHash("instant");
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      history.scrollRestoration = scrollRestoration;
    };
  }, []);

  useEffect(() => {
    let io: IntersectionObserver | null = null;
    let reportRaf = 0;

    function animateCount(node: HTMLElement) {
      if (node.dataset.done) return;
      node.dataset.done = "1";
      const raw = node.dataset.count ?? "0";
      const target = parseFloat(raw);
      const pref = node.dataset.prefix ?? "";
      const suff = node.dataset.suffix ?? "";
      const decPart = raw.split(".")[1] ?? "";
      const dec = decPart.length;
      const dur = 1300;
      const start = performance.now();
      const inner = node.querySelector(".of");
      const step = (t: number) => {
        const k = Math.min(1, (t - start) / dur);
        const e = 1 - Math.pow(1 - k, 3);
        const v = (target * e).toFixed(dec);
        node.textContent = pref + v + suff;
        if (inner) node.appendChild(inner);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    function animateMetricBars(root: Element) {
      root.querySelectorAll<HTMLElement>(".metric .bar i").forEach((bar) => {
        const w = bar.dataset.w;
        if (!w) return;
        const delay = parseFloat(bar.dataset.delay ?? "0");
        bar.style.transition = "none";
        bar.style.width = "0%";
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            bar.style.transition = `width 1s cubic-bezier(.22,1,.36,1) ${delay}s`;
            bar.style.width = `${w}%`;
          });
        });
      });
    }

    function runReportMetrics() {
      const report = document.querySelector(".hero .report");
      if (!report) return;
      report.querySelectorAll<HTMLElement>("[data-count]").forEach(animateCount);
      animateMetricBars(report);
    }

    function isBelowFold(el: Element) {
      const rect = el.getBoundingClientRect();
      return rect.top > window.innerHeight * 0.85;
    }

    function setup() {
      reportRaf = requestAnimationFrame(runReportMetrics);

      io = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (!en.isIntersecting) continue;
            en.target.classList.add("in");
            en.target
              .querySelectorAll<HTMLElement>("[data-count]")
              .forEach(animateCount);
            animateMetricBars(en.target);
            io?.unobserve(en.target);
          }
        },
        { threshold: 0.1, rootMargin: "0px" },
      );

      document.querySelectorAll(".reveal, .reveal-stagger").forEach((el) => {
        if (isBelowFold(el)) {
          io?.observe(el);
        } else {
          el.classList.add("in");
        }
      });
    }

    let cancelled = false;
    const scheduleSetup = () => {
      if (!cancelled) setup();
    };
    const usesIdleCallback = typeof window.requestIdleCallback === "function";
    const idleId = usesIdleCallback
      ? window.requestIdleCallback(scheduleSetup, { timeout: 1200 })
      : window.setTimeout(scheduleSetup, 1);

    return () => {
      cancelled = true;
      if (usesIdleCallback) {
        window.cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
      cancelAnimationFrame(reportRaf);
      io?.disconnect();
    };
  }, []);

  return (
    <div className="landing-page">
      <ComplexityVisualization />
      <MarketingNav
        onJoinWaitlistClick={(e) => {
          e.preventDefault();
          scrollToAnchor("cta");
        }}
      />

      <LandingHeroSection
        surveyState={surveyState}
        onWaitlistSuccess={handleWaitlistSuccess}
      />

      {children}

      <LandingCtaSection
        surveyState={surveyState}
        onWaitlistSuccess={handleWaitlistSuccess}
      />

      {modal?.kind === "survey" && (
        <SurveyModal
          open
          email={modal.email}
          source={modal.source}
          position={modal.position}
          onSubmitted={() => {
            setSurveyState("submitted");
            setModal(null);
          }}
          onSkipped={() => {
            setSurveyState("skipped");
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.kind === "thanks" && (
        <ThankYouModal
          open
          position={modal.position}
          variant="returning"
          onClose={() => setModal(null)}
        />
      )}
      {clickBursts.map((burst) => (
        <CoinBurst key={burst.id} x={burst.x} y={burst.y} />
      ))}
    </div>
  );
}
