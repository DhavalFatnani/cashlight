"use client";

import { useEffect, useRef, useState } from "react";
import { ProcessSection } from "@/components/marketing/process-section";
import { CoinBurst } from "@/components/marketing/coin-burst";
import { ComplexityVisualization } from "@/components/marketing/complexity-visualization";
import { SurveyModal } from "@/components/marketing/survey-modal";
import { ThankYouModal } from "@/components/marketing/thank-you-modal";
import { isAnchorId, scrollToAnchor } from "@/lib/anchor-scroll";
import { useGlobalSound } from "@/lib/use-global-sound";

const TICKER_ITEMS = [
  "Multiple bank accounts",
  "Parent support",
  "Annual bonuses",
  "Freelance income",
  "Credit card EMIs",
  "LIC policies",
  "Zomato bills",
  "Gold SIPs",
  "School fees",
  "Diwali spending",
  "IT refunds",
  "Home loan prepayment",
  "Chit funds",
  "Side gigs",
] as const;

const PROBLEMS = [
  {
    level: "err" as const,
    ts: "i · 08:14:02",
    text: (
      <>
        Three bank accounts. Some apps see them all. None tell you{" "}
        <em>what your numbers mean</em>.
      </>
    ),
  },
  {
    level: "warn" as const,
    ts: "ii · 08:14:09",
    text: (
      <>
        Your family commitments aren&apos;t optional. Every app treats them like they
        are.
      </>
    ),
  },
  {
    level: "err" as const,
    ts: "iii · 08:14:17",
    text: (
      <>
        A <b>₹2L</b> bonus arrived. Six months later, it&apos;s gone.
      </>
    ),
  },
  {
    level: "warn" as const,
    ts: "iv · 08:14:24",
    text: (
      <>
        Two LIC policies. Zero term insurance. <em>Fully mis-sold.</em>
      </>
    ),
  },
  {
    level: "warn" as const,
    ts: "v · 08:14:31",
    text: (
      <>
        80C: <b>₹1.5L</b> limit. <b>₹60,000</b> used. <em>Every year.</em>
      </>
    ),
  },
  {
    level: "err" as const,
    ts: "vi · 08:14:38",
    text: (
      <>
        You know you should start a SIP. <em>Next month.</em>
      </>
    ),
  },
] as const;

const TOTAL_FOUNDING_SPOTS = 200;
/** Update manually each week until wired to Supabase. */
const SPOTS_CLAIMED = 64;

const LEDGER = [
  { them: "They earn commissions.", us: "We earn only from you." },
  { them: "They recommend ULIPs.", us: <>We flag them. <em>Out loud.</em></> },
  {
    them: "They show health scores.",
    us: "We show you why your score is what it is.",
  },
  { them: "They guess transaction narrations.", us: <>We read <em>every</em> UPI string.</> },
  {
    them: "They ignore family transfers.",
    us: "We treat them as fixed commitments.",
  },
] as const;

const HEALTH_DIMENSIONS = [
  {
    name: "Coverage ratio",
    description: "What % of your income is already spoken for before you spend a rupee.",
    example: "Your fixed obligations use 68% of income. Danger zone.",
  },
  {
    name: "Real savings rate",
    description: "What actually compounds — not what you think you save.",
    example: "4.2% of take-home is compounding. Indian average. Not enough.",
  },
  {
    name: "Emergency buffer",
    description: "How many months you can survive on liquid savings alone.",
    example: "1.3 months. Target: 6.",
  },
  {
    name: "Insurance adequacy",
    description: "Term cover as a multiple of your annual income.",
    example: "You have ₹0 of term cover. Your family is unprotected.",
  },
  {
    name: "Equity exposure",
    description: "What % of your wealth is in growth assets.",
    example: "92% in gold and FD. Inflation is eroding it.",
  },
  {
    name: "Debt-to-income ratio",
    description: "Total EMIs as a % of monthly take-home.",
    example: "34%. Within range. Watch if it crosses 40%.",
  },
  {
    name: "Irregular income rate",
    description: "What % of your bonuses and reimbursements gets invested.",
    example: "Last 3 bonuses: 0% invested. All spent within 60 days.",
  },
  {
    name: "Tax efficiency",
    description: "80C utilisation + regime optimisation.",
    example: "₹62,000 of 80C headroom unused. Old regime likely better for you.",
  },
] as const;

const ARCHETYPES = [
  {
    icon: "🏢",
    name: "Salaried professional",
    situation: "HDFC salary, Kotak savings, ICICI joint account.",
    healthGap: "Cashlight shows you your real savings rate across all three and where the gaps are.",
  },
  {
    icon: "💼",
    name: "Freelancer / consultant",
    situation: "Great months, rough months. TDS deducted everywhere.",
    healthGap: "Cashlight builds a health picture that accounts for income volatility — not one that assumes a fixed salary.",
  },
  {
    icon: "👨‍👩‍👧",
    name: "Supporting family",
    situation: "₹25,000 to parents every month. ₹10,000 for a sibling's fees.",
    healthGap: "Cashlight treats your commitments as non-negotiable and measures your health around them.",
  },
  {
    icon: "🏠",
    name: "Dual-income household",
    situation: "Two salaries, shared EMIs, separate accounts.",
    healthGap: "Cashlight gives you a single household health view both partners can see.",
  },
] as const;

const PRICING = [
  {
    tier: "Free",
    amount: "₹0",
    period: " / forever",
    features: ["One bank statement", "Three of eight dimensions", "Snapshot only"],
    cta: "Start free",
    popular: false,
  },
  {
    tier: "Pro",
    amount: "₹299",
    period: " / month",
    features: [
      "Unlimited statements · all banks",
      "Full 8-dimension report",
      "What-if scenario explorer",
      "Tax efficiency review",
    ],
    cta: "Choose Pro",
    popular: true,
  },
  {
    tier: "Premium",
    amount: "₹999",
    period: " / month",
    features: [
      "Everything in Pro",
      "Annual human review session",
      "Family / couple linking",
      "Estate & nominee mapping",
    ],
    cta: "Choose Premium",
    popular: false,
  },
] as const;

type FormState = "idle" | "loading" | "done" | "error";

type SurveyState = "default" | "submitted" | "skipped";

export type WaitlistSuccessPayload = {
  email: string;
  source: "hero" | "footer";
  position: number;
  surveyCompleted: boolean;
};

export type PostSignupModal =
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

type WaitlistFormProps = {
  source: "hero" | "footer";
  label: string;
  noteSuffix?: string;
  surveyState: SurveyState;
  onSignup?: () => void;
  onWaitlistSuccess: (payload: WaitlistSuccessPayload) => void;
};

function WaitlistForm({
  source,
  label,
  noteSuffix = "",
  surveyState,
  onSignup,
  onWaitlistSuccess,
}: WaitlistFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [position, setPosition] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function shake() {
    const f = formRef.current;
    if (!f) return;
    f.classList.add("shake");
    setTimeout(() => f.classList.remove("shake"), 360);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      shake();
      setErrorMessage("Enter a valid email.");
      return;
    }
    setState("loading");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: v, source }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        position?: number;
        isNew?: boolean;
        surveyCompleted?: boolean;
        error?: string;
      };
      if (!res.ok || !data.success) {
        shake();
        setState("idle");
        setErrorMessage(data.error ?? "Something went wrong. Try again.");
        return;
      }
      const pos = data.position ?? null;
      setPosition(pos);
      setState("done");
      if (data.isNew) onSignup?.();
      onWaitlistSuccess({
        email: v,
        source,
        position: pos ?? 0,
        surveyCompleted: data.surveyCompleted === true,
      });
    } catch {
      shake();
      setState("idle");
      setErrorMessage("Network error. Try again.");
    }
  }

  return (
    <form
      ref={formRef}
      className={`hero-form${state === "done" ? " done" : ""}`}
      noValidate
      onSubmit={onSubmit}
      aria-label="Join waitlist"
    >
      <div className="form-label">
        {label} <small>{"// founding · 200 spots"}</small>
      </div>
      <div className="form-row">
        <input
          type="email"
          placeholder="you@gmail.com"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errorMessage) setErrorMessage(null);
          }}
          disabled={state === "loading"}
        />
        <button className="btn-primary" type="submit" disabled={state === "loading"}>
          {state === "loading" ? "Joining…" : "Get early access"}
        </button>
      </div>
      <div className="form-note">
        No credit card. No spam. <b>Founding tier ₹29/mo{noteSuffix}.</b>
      </div>
      {errorMessage && (
        <div className="form-error" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="form-success" role="status" aria-live="polite">
        {surveyState === "submitted" ? (
          <>Thanks. Your input shapes what we build.</>
        ) : surveyState === "skipped" ? (
          <>
            You&apos;re <b>#{position ?? 64}</b> on the list. We&apos;ll be in touch.
          </>
        ) : (
          <>
            You&apos;re <b>#{position ?? 64}</b> on the list. We&apos;ll be in touch.
          </>
        )}
      </div>
    </form>
  );
}

function FoundingCounter() {
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
        spots claimed
        <b>
          {SPOTS_CLAIMED} / {TOTAL_FOUNDING_SPOTS}
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

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [modal, setModal] = useState<PostSignupModal | null>(null);
  const [surveyBySource, setSurveyBySource] = useState<
    Record<"hero" | "footer", SurveyState>
  >({ hero: "default", footer: "default" });
  const [clickBursts, setClickBursts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const { isEnabled, toggleSound, playChime } = useGlobalSound();

  function handleWaitlistSuccess(payload: WaitlistSuccessPayload) {
    if (payload.surveyCompleted) {
      setModal({
        kind: "thanks",
        position: payload.position,
        variant: "returning",
      });
    } else {
      setModal({
        kind: "survey",
        email: payload.email,
        source: payload.source,
        position: payload.position,
      });
    }
  }

  function closeModal() {
    setModal(null);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let burstId = 0;

    function handleClick(e: MouseEvent) {
      playChime();

      // Offset to position burst at cursor tip (pointed end of arrow)
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
      if (e.key === 'm' || e.key === 'M') {
        toggleSound();
      }
    }

    document.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playChime, toggleSound]);

  useEffect(() => {
    const scrollRestoration = history.scrollRestoration;
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    function scrollFromHash(behavior: ScrollBehavior = "smooth") {
      const id = window.location.hash.slice(1);
      if (!isAnchorId(id)) return;
      scrollToAnchor(id, behavior);
    }

    function onAnchorClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest('a[href^="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const id = href.slice(1);
      if (!isAnchorId(id)) return;
      e.preventDefault();
      scrollToAnchor(id);
      window.history.pushState(null, "", href);
    }

    function onHashChange() {
      scrollFromHash();
    }

    scrollFromHash("instant");
    document.addEventListener("click", onAnchorClick);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("hashchange", onHashChange);
      history.scrollRestoration = scrollRestoration;
    };
  }, []);

  useEffect(() => {
    let io: IntersectionObserver | null = null;
    let idleHandle: ReturnType<typeof setTimeout> | number | undefined;
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

    function animateMetricBars(root: ParentNode = document) {
      root.querySelectorAll<HTMLElement>(".report .bar > i[data-w]").forEach((bar) => {
        const delay = bar.dataset.delay ?? "0";
        bar.style.transitionDelay = `${delay}s`;
        bar.style.width = `${bar.dataset.w ?? "0"}%`;
      });
    }

    function runHeroReportMetrics() {
      document
        .querySelectorAll<HTMLElement>(".report [data-count]")
        .forEach((n) => {
          const r = n.getBoundingClientRect();
          if (r.top < window.innerHeight && n.dataset.count) {
            animateCount(n);
          }
        });
      animateMetricBars();
    }

    function isBelowFold(el: Element) {
      return el.getBoundingClientRect().top > window.innerHeight * 0.85;
    }

    function setupScrollAnimations() {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        document
          .querySelectorAll(
            ".reveal, .reveal-stagger",
          )
          .forEach((el) => el.classList.add("in"));
        runHeroReportMetrics();
        return;
      }

      reportRaf = requestAnimationFrame(runHeroReportMetrics);

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

      document
        .querySelectorAll(".reveal, .reveal-stagger")
        .forEach((el) => {
          if (isBelowFold(el)) {
            io?.observe(el);
          } else {
            el.classList.add("in");
          }
        });
    }

    function scheduleSetup() {
      if (typeof requestIdleCallback === "function") {
        idleHandle = requestIdleCallback(() => setupScrollAnimations(), {
          timeout: 2000,
        });
      } else {
        idleHandle = setTimeout(setupScrollAnimations, 1);
      }
    }

    if (document.readyState === "complete") {
      scheduleSetup();
    } else {
      window.addEventListener("load", scheduleSetup, { once: true });
    }

    return () => {
      window.removeEventListener("load", scheduleSetup);
      if (idleHandle !== undefined) {
        if (typeof cancelIdleCallback === "function") {
          cancelIdleCallback(idleHandle as number);
        } else {
          clearTimeout(idleHandle);
        }
      }
      cancelAnimationFrame(reportRaf);
      io?.disconnect();
    };
  }, []);

  return (
    <>
      <ComplexityVisualization />
      <nav className={`top${scrolled ? " scrolled" : ""}`} id="topnav">
        <div className="inner">
          <div className="nav-brand">
            <a href="#" className="logo">
              <span className="dot" />
              Cashlight
            </a>
          </div>
          <div className="nav-links">
            <a href="#how">How it works</a>
            <a href="#pricing">Pricing</a>
          </div>
          <a href="#cta" className="nav-cta">
            Join waitlist
          </a>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap hero-grid">
          <div className="hero-left">
            <h1 className="reveal">
              Your money is
              <br />
              <em>more complicated than any app admits.</em>
            </h1>
            <p className="hero-descriptor reveal">
              Cashlight shows you where you stand, and what the financially sorted
              do differently.
            </p>
            <p className="hero-sub reveal">
              You juggle multiple accounts, support family, get lumpy bonuses, and
              pay EMIs across banks. Most tools show you charts.
              Cashlight reads your actual statements and shows you
              where you really stand — and what your options are.
            </p>
            <p className="hero-hint reveal">
              <em>Try clicking the nodes in the background to make payments</em>
            </p>

            <WaitlistForm
              source="hero"
              label="Want to know where you actually stand?"
              noteSuffix=", locked for life"
              surveyState={surveyBySource.hero}
              onWaitlistSuccess={handleWaitlistSuccess}
            />
          </div>

          <div className="report reveal">
            <div className="report-head">
              <div className="tit">
                Cashlight <b>{"// health report"}</b> · sample
              </div>
              <div className="lights">
                <span className="live" />
                <span />
                <span />
              </div>
            </div>
            <div className="report-body">
              <div className="summary-row">
                <div className="left">
                  <div className="who">Subject · 34, Bengaluru · salaried ₹14.5L/yr</div>
                  <div className="name">Arjun K.</div>
                </div>
                <div className="right">
                  <div className="score" data-count="51">
                    51<span className="of"> / 100</span>
                  </div>
                  <div className="grade">
                    Grade C+ · <em>needs attention</em>
                  </div>
                </div>
              </div>

              <div className="metric-grid">
                <div className="metric warn">
                  <div className="row">
                    <div className="nm">Coverage ratio</div>
                    <div className="st">⚠ TIGHT</div>
                  </div>
                  <div className="row">
                    <div className="val" data-count="73" data-suffix="%">
                      73%
                    </div>
                  </div>
                  <div className="bar">
                    <i
                      data-w="73"
                      data-delay="0"
                      className="metric-bar-fill--danger"
                    />
                  </div>
                </div>
                <div className="metric err">
                  <div className="row">
                    <div className="nm">Real savings rate</div>
                    <div className="st">✕ LOW</div>
                  </div>
                  <div className="row">
                    <div className="val" data-count="9.2" data-suffix="%">
                      9.2%
                    </div>
                  </div>
                  <div className="bar">
                    <i
                      data-w="46"
                      data-delay="0.1"
                      className="metric-bar-fill--danger"
                    />
                  </div>
                </div>
                <div className="metric warn">
                  <div className="row">
                    <div className="nm">Emergency buffer</div>
                    <div className="st">⚠ THIN</div>
                  </div>
                  <div className="row">
                    <div className="val" data-count="1.8" data-suffix=" mo">
                      1.8 mo
                    </div>
                  </div>
                  <div className="bar">
                    <i
                      data-w="22"
                      data-delay="0.2"
                      className="metric-bar-fill--danger"
                    />
                  </div>
                </div>
                <div className="metric err">
                  <div className="row">
                    <div className="nm">Insurance adequacy</div>
                    <div className="st">✕ MIS-SOLD</div>
                  </div>
                  <div className="row">
                    <div className="val">2 LIC · 0 term</div>
                  </div>
                  <div className="bar">
                    <i
                      data-w="8"
                      data-delay="0.3"
                      className="metric-bar-fill--muted"
                    />
                  </div>
                </div>
                <div className="metric ok">
                  <div className="row">
                    <div className="nm">Debt-to-income</div>
                    <div className="st">✓ OK</div>
                  </div>
                  <div className="row">
                    <div className="val" data-count="31" data-suffix="%">
                      31%
                    </div>
                  </div>
                  <div className="bar">
                    <i
                      data-w="31"
                      data-delay="0.4"
                      className="metric-bar-fill--ok"
                    />
                  </div>
                </div>
                <div className="metric warn">
                  <div className="row">
                    <div className="nm">Tax efficiency</div>
                    <div className="st">⚠ UNUSED 80C</div>
                  </div>
                  <div className="row">
                    <div className="val">₹60k / ₹1.5L used</div>
                  </div>
                  <div className="bar">
                    <i
                      data-w="40"
                      data-delay="0.5"
                      className="metric-bar-fill--amber"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="report-footer">
              <div>
                <span className="blink" />
                Reading statements · HDFC + ICICI + Kotak
              </div>
              <div>1,284 narrations parsed</div>
            </div>
          </div>
        </div>

        <div className="ticker reveal">
          <div className="ticker-label">{"// BUILT FOR INDIANS MANAGING"}</div>
          <div className="ticker-viewport">
            <div className="ticker-track">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={`${item}-${i}`} className="pill">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="block" id="problems">
        <div className="wrap-narrow">
          <div
            className="section-head reveal"
          >
            <div className="ses">{"// THINGS WE NOTICED"}</div>
            <h2>
              Four things every app pretends <em>aren&apos;t</em> happening.
            </h2>
            <p className="lede">
              Open any Indian finance app. Then open your actual bank statements.
              The gap is what Cashlight exists to close.
            </p>
          </div>

          <div className="obs-list reveal-stagger">
            {PROBLEMS.map((p, i) => (
              <div key={i} className={`obs ${p.level}`}>
                <div className="ts">{p.ts}</div>
                <div className="text">{p.text}</div>
                <div className="level">{p.level === "err" ? "error" : "warn"}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProcessSection />

      <section className="block" id="health">
        <div className="wrap-narrow">
          <div className="section-head reveal">
            <div className="ses">{"// YOUR FINANCIAL HEALTH"}</div>
            <h2>
              Eight dimensions. <em>One honest picture.</em>
            </h2>
          </div>
          <div className="health-grid reveal-stagger">
            {HEALTH_DIMENSIONS.map((dim, i) => (
              <div key={i} className="health-card">
                <div className="health-card-name">{dim.name}</div>
                <div className="health-card-desc">{dim.description}</div>
                <div className="health-card-example">
                  <span className="health-card-example-label">Example:</span> {dim.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="who">
        <div className="wrap-narrow">
          <div className="section-head reveal">
            <div className="ses">{"// WHO IT'S FOR"}</div>
            <h2>
              One platform. <em>Every kind of Indian earner.</em>
            </h2>
          </div>
          <div className="archetype-grid reveal-stagger">
            {ARCHETYPES.map((archetype, i) => (
              <div key={i} className="archetype-card">
                <div className="archetype-icon">{archetype.icon}</div>
                <div className="archetype-name">{archetype.name}</div>
                <div className="archetype-situation">{archetype.situation}</div>
                <div className="archetype-health-gap">
                  <span className="archetype-health-gap-label">Cashlight surfaces:</span> {archetype.healthGap}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="difference">
        <div className="wrap-narrow">
          <div className="section-head reveal">
            <div className="ses">An open memo</div>
            <h2>
              Why we&apos;ll always <em>tell you the truth.</em>
            </h2>
          </div>
          <div className="memo reveal">
            <div className="from">
              <b>From</b> &nbsp; Cashlight team
              <br />
              <b>To</b> &nbsp;&nbsp;&nbsp; Whoever is reading this
              <br />
              <b>Re</b> &nbsp;&nbsp;&nbsp; Why we&apos;re different, in plain
              language.
            </div>
            <h3>
              The <em>honest</em> part.
            </h3>
            <p className="intro">
              Most free Indian money apps are paid by the products they push on
              you. Every recommendation comes with a commission baked in. We
              charge you a subscription instead. That means the only thing we get
              paid for is being useful to you.
            </p>

            <div className="ledger">
              {LEDGER.map((row, i) => (
                <div key={i} className="ledger-row">
                  <div className="them">{row.them}</div>
                  <div className="arrow">→</div>
                  <div className="us">{row.us}</div>
                </div>
              ))}
            </div>

            <div className="signoff">
              — <b>The Cashlight team</b>
            </div>
          </div>
        </div>
      </section>

      <section className="block" id="important">
        <div className="wrap-narrow">
          <div className="important-text reveal">
            Cashlight is a financial health platform — not a financial advisor. We read your statements, compute your health metrics, and show you what your numbers mean. We show you scenarios, not prescriptions. For specific investment or tax decisions, we&apos;ll always tell you when you need a qualified professional.
          </div>
        </div>
      </section>

      <section className="block" id="pricing">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="left">
              <div className="ses">Pricing</div>
              <h2>
                Pay us. So <em>no one else can.</em>
              </h2>
              <p className="lede">
                One revenue source: yours. No ads. No commissions. No conflicts
                of interest.
              </p>
            </div>
            <div className="right">GST included · INR</div>
          </div>
          <div className="pricing reveal-stagger">
            {PRICING.map((tier) => (
              <div key={tier.tier} className={`price${tier.popular ? " popular" : ""}`}>
                <div className="tier">{tier.tier}</div>
                <div className="amt">
                  {tier.amount}
                  <small>{tier.period}</small>
                </div>
                <ul>
                  {tier.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <button type="button">{tier.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer" id="cta">
        <div className="footer-cta wrap-narrow">
          <h2 className="reveal">
            Your money, <em>finally</em> understood.
          </h2>
          <p className="ps reveal">
            Built in India. Funded by the people who use it. Nothing else.
          </p>
          <div className="founding founding--cta reveal">
            <div className="lbl">{"// founding"}</div>
            <div className="copy">
              <b>₹29 / month</b>, locked for life. First 200 users only.
            </div>
            <FoundingCounter />
          </div>
          <WaitlistForm
            source="footer"
            label="Get on the list"
            surveyState={surveyBySource.footer}
            onWaitlistSuccess={handleWaitlistSuccess}
          />
        </div>
        <div className="wrap footer-meta">
          <div className="row">
            <a href="#" className="logo" style={{ fontSize: 17 }}>
              <span className="dot" />
              Cashlight
            </a>
            <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
              <a href="#how">How it works</a>
              <a href="#pricing">Pricing</a>
              <a href="#">Privacy</a>
              <a href="#">Security</a>
              <a href="#">Contact</a>
            </div>
            <div>© 2026 Cashlight · Built in India</div>
          </div>
          <div className="disclaimer">
            Cashlight is a financial health platform, not a SEBI-registered
            investment advisor. Content is for informational purposes only.
          </div>
        </div>
      </footer>

      {modal?.kind === "survey" && (
        <SurveyModal
          open
          email={modal.email}
          source={modal.source}
          position={modal.position}
          onSubmitted={() => {
            setSurveyBySource((s) => ({ ...s, [modal.source]: "submitted" }));
            closeModal();
          }}
          onSkipped={() => {
            setSurveyBySource((s) => ({ ...s, [modal.source]: "skipped" }));
            closeModal();
          }}
          onClose={closeModal}
        />
      )}
      {modal?.kind === "thanks" && (
        <ThankYouModal
          open
          position={modal.position}
          variant="returning"
          onClose={closeModal}
        />
      )}
      {clickBursts.map((burst) => (
        <CoinBurst key={burst.id} x={burst.x} y={burst.y} />
      ))}
    </>
  );
}
