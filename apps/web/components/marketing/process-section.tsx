"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { HowItWorksIntroPanel } from "@/components/marketing/how-it-works-intro-panel";
import { useEffect, useRef, useState, type ReactNode } from "react";

type ProcessStep = {
  num: string;
  title: string;
  body: ReactNode;
  terminal: ReactNode;
  banks?: string[];
};

const PROCESS_STEPS: ProcessStep[] = [
  {
    num: "i.",
    title: "You upload",
    body: (
      <>
        Drop PDFs, XLS, or CSVs from{" "}
        <b>HDFC, SBI, ICICI, IDFC, Kotak, Axis</b>. Full history, including years
        before any aggregator existed.
      </>
    ),
    terminal: (
      <>
        <div>
          <span className="prompt">$</span> ingest hdfc_oct.pdf
        </div>
        <div>
          <span className="prompt">$</span> ingest icici_oct.xls
        </div>
        <div>
          <span className="prompt">$</span> ingest kotak_oct.csv
        </div>
        <div className="ok">✓ 3 files · 1,284 rows</div>
      </>
    ),
    banks: ["HDFC", "SBI", "ICICI", "Kotak", "IDFC", "Axis", "Yes Bank"],
  },
  {
    num: "ii.",
    title: "We read every line",
    body: (
      <>
        Every UPI string, every standing instruction, every &ldquo;ZOMATOXX&rdquo;
        narration. We separate <b>family transfers from discretionary</b>, EMIs from
        rent.
      </>
    ),
    terminal: (
      <>
        <div>
          <span className="prompt">$</span> classify --narrations
        </div>
        <div>
          matched <span className="ok">1,217 / 1,284</span>{" "}
          <span className="muted">(94.7%)</span>
        </div>
        <div>
          flagged <span className="warn">67 anomalies</span>
        </div>
        <div className="ok">✓ 8-dim health report ready</div>
      </>
    ),
  },
  {
    num: "iii.",
    title: "You explore. We don't prescribe.",
    body: (
      <>
        Ask <b>&ldquo;what if I move ₹20k from my LIC to NPS?&rdquo;</b> Or{" "}
        <b>&ldquo;what if my parents need ₹5k more next month?&rdquo;</b> A diagnosis.
        Never a sales pitch.
      </>
    ),
    terminal: (
      <>
        <div>
          <span className="prompt">$</span> simulate --lic→nps
        </div>
        <div>
          coverage: 4.2 → <span className="ok">5.1 mo</span>
        </div>
        <div>
          tax eff: 42 → <span className="ok">71 %</span>
        </div>
        <div className="ok">✓ scenario saved</div>
      </>
    ),
  },
];

const STEP_LABELS = ["step i of iii", "step ii of iii", "step iii of iii"] as const;

function ProcessCard({
  step,
  y,
  opacity,
}: {
  step: ProcessStep;
  y: MotionValue<string>;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.article
      className="process-card step"
      style={{ y, opacity, top: "50%" }}
    >
      <div className="copy">
        <div className="head">
          <div className="num">{step.num}</div>
          <h3 className="process-card-title">{step.title}</h3>
        </div>
        <p className="process-card-body">{step.body}</p>
        {step.banks && (
          <div className="bank-chips">
            {step.banks.map((bank) => (
              <span key={bank} className="bank-chip">
                {bank}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="process-terminal console">{step.terminal}</div>
    </motion.article>
  );
}

function ProcessStacked() {
  return (
    <section
      id="how"
      className="block process-section"
      aria-labelledby="how-it-works-intro-heading"
    >
      <HowItWorksIntroPanel />
      <div className="wrap">
        <div className="process-outer process-outer--static">
          <div className="process-sticky process-sticky--static">
            <div className="process-sticky-inner">
              <div className="process-left reveal">
                <div className="process-label ses">{"// process"}</div>
                <h2 className="process-headline">
                  You drop your statements. <em>We read every line.</em>
                </h2>
                <p className="process-description">
                  Three steps, in plain English. No magic, no &ldquo;patent-pending AI
                  engine.&rdquo; Just careful reading. And a little arithmetic.
                </p>
              </div>
              <div className="process-right process-right--static">
                <div className="process-cards-static reveal-stagger">
                  {PROCESS_STEPS.map((step) => (
                    <article key={step.num} className="process-card step">
                      <div className="copy">
                        <div className="head">
                          <div className="num">{step.num}</div>
                          <h3 className="process-card-title">{step.title}</h3>
                        </div>
                        <p className="process-card-body">{step.body}</p>
                        {step.banks && (
                          <div className="bank-chips">
                            {step.banks.map((bank) => (
                              <span key={bank} className="bank-chip">
                                {bank}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="process-terminal console">{step.terminal}</div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessStickyScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const leftOpacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);

  const card1Y = useTransform(
    scrollYProgress,
    [0, 0.2, 0.45, 0.55],
    ["0%", "0%", "-100%", "-100%"],
  );
  const card1Opacity = useTransform(scrollYProgress, [0, 0.05, 0.4, 0.5], [0, 1, 1, 0]);

  const card2Y = useTransform(
    scrollYProgress,
    [0.3, 0.5, 0.7, 0.78],
    ["100%", "0%", "0%", "-100%"],
  );
  const card2Opacity = useTransform(
    scrollYProgress,
    [0.3, 0.45, 0.65, 0.75],
    [0, 1, 1, 0],
  );

  const card3Y = useTransform(
    scrollYProgress,
    [0.6, 0.78, 1, 1],
    ["100%", "0%", "0%", "0%"],
  );
  const card3Opacity = useTransform(scrollYProgress, [0.6, 0.72, 0.9, 1], [0, 1, 1, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v < 0.45) setActiveStep(0);
    else if (v < 0.72) setActiveStep(1);
    else setActiveStep(2);
  });

  return (
    <section
      id="how"
      className="block process-section"
      aria-labelledby="how-it-works-intro-heading"
    >
      <HowItWorksIntroPanel />
      <div ref={sectionRef} className="process-outer">
        <div className="process-sticky">
          <div className="wrap process-sticky-inner">
            <motion.div className="process-left" style={{ opacity: leftOpacity }}>
              <div className="process-label ses">{"// process"}</div>
              <div className="process-step-counter" aria-live="polite">
                {STEP_LABELS.map((label, i) => (
                  <span key={label} className={i === activeStep ? "is-active" : ""}>
                    {label}
                  </span>
                ))}
              </div>
              <h2 id="process-heading" className="process-headline">
                You drop your statements. <em>We read every line.</em>
              </h2>
              <p className="process-description">
                Three steps, in plain English. No magic, no &ldquo;patent-pending AI
                engine.&rdquo; Just careful reading. And a little arithmetic.
              </p>
            </motion.div>

            <div className="process-right">
              <ProcessCard
                step={PROCESS_STEPS[0]!}
                y={card1Y}
                opacity={card1Opacity}
              />
              <ProcessCard
                step={PROCESS_STEPS[1]!}
                y={card2Y}
                opacity={card2Opacity}
              />
              <ProcessCard
                step={PROCESS_STEPS[2]!}
                y={card3Y}
                opacity={card3Opacity}
              />
            </div>

            <div className="process-dots" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span key={i} className={i === activeStep ? "is-active" : undefined} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProcessSection() {
  const [mode, setMode] = useState<"desktop" | "static" | null>(null);

  useEffect(() => {
    function resolve() {
      const mobile = window.matchMedia("(max-width: 768px)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setMode(mobile || reduced ? "static" : "desktop");
    }
    resolve();
    const mqMobile = window.matchMedia("(max-width: 768px)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    mqMobile.addEventListener("change", resolve);
    mqReduced.addEventListener("change", resolve);
    return () => {
      mqMobile.removeEventListener("change", resolve);
      mqReduced.removeEventListener("change", resolve);
    };
  }, []);

  if (mode === null) {
    return (
      <section id="how" className="block process-section" aria-hidden>
        <HowItWorksIntroPanel />
        <div className="process-outer process-outer--static" />
      </section>
    );
  }

  return mode === "static" ? <ProcessStacked /> : <ProcessStickyScroll />;
}
