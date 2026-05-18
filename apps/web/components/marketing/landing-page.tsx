"use client";

import { useEffect, useRef, useState } from "react";
import { BenchmarkSection } from "@/components/marketing/benchmark-section";
import { ProcessSection } from "@/components/marketing/process-section";
import { SurveyModal } from "@/components/marketing/survey-modal";
import { ThankYouModal } from "@/components/marketing/thank-you-modal";

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
    ts: "ii · 08:14:08",
    text: (
      <>
        Your family commitments aren&apos;t optional, but every app treats them as{" "}
        <em>discretionary</em>.
      </>
    ),
  },
  {
    level: "warn" as const,
    ts: "iii · 08:14:15",
    text: (
      <>
        A <b>₹2,00,000</b> bonus arrived. Six months later, it&apos;s gone.
      </>
    ),
  },
  {
    level: "err" as const,
    ts: "iv · 08:14:22",
    text: (
      <>
        Two LIC policies. Zero term insurance. <em>Fully mis-sold.</em>
      </>
    ),
  },
  {
    level: "warn" as const,
    ts: "v · 08:14:29",
    text: (
      <>
        80C: <b>₹1.5L</b> limit, <b>₹60,000</b> used. <em>Every year.</em>
      </>
    ),
  },
  {
    level: "warn" as const,
    ts: "vi · 08:14:36",
    text: (
      <>
        You know you should start a SIP. <em>Next month.</em>
      </>
    ),
  },
];

const DIMENSIONS = [
  {
    tone: "warn",
    nm: "Coverage ratio",
    badge: "⚠ TIGHT",
    count: "73",
    suffix: "%",
    placeholder: "73%",
    sub: "0.9 months of essential outflows",
  },
  {
    tone: "err",
    nm: "Real savings rate",
    badge: "✕ LOW",
    count: "9.2",
    suffix: "%",
    placeholder: "9.2%",
    sub: "net of EMIs & transfers",
  },
  {
    tone: "warn",
    nm: "Emergency buffer",
    badge: "⚠ THIN",
    literal: "₹54,000",
    sub: "liquid in 48 hours (about 1.8 months)",
  },
  {
    tone: "err",
    nm: "Insurance adequacy",
    badge: "✕ GAP",
    literal: "Under",
    sub: "₹25L cover vs ₹1.45Cr obligations",
  },
  {
    tone: "warn",
    nm: "Equity exposure",
    badge: "⚠ LOW",
    count: "4",
    suffix: "%",
    placeholder: "4%",
    sub: "of net worth in growth assets",
  },
  {
    tone: "ok",
    nm: "Debt-to-income",
    badge: "✓ OK",
    count: "31",
    suffix: "%",
    placeholder: "31%",
    sub: "EMIs / monthly inflow",
  },
  {
    tone: "warn",
    nm: "Irregular income",
    badge: "⚠ HIGH",
    count: "22",
    suffix: "%",
    placeholder: "22%",
    sub: "share variable / annual",
  },
  {
    tone: "warn",
    nm: "Tax efficiency",
    badge: "⚠ UNUSED 80C",
    count: "40",
    suffix: "%",
    placeholder: "40%",
    sub: "80C: ₹60k used of ₹1.5L limit",
  },
] as const;

const TOTAL_FOUNDING_SPOTS = 200;
/** Update manually each week until wired to Supabase. */
const SPOTS_CLAIMED = 64;

const AUDIENCES = [
  {
    initial: "L",
    variant: "lost" as const,
    title: "Financially lost",
    copy: "You earn decently. You pay your bills. But at the end of the month, there's nothing left — and you have no idea where it went. It's not a discipline problem. It's a visibility problem.",
  },
  {
    initial: "D",
    variant: "drowning" as const,
    title: "Financially drowning",
    copy: "A LIC policy you didn't understand. A credit card balance that won't go to zero. Decisions that made sense at the time, compounding quietly. You know something is wrong. You just can't see what.",
  },
  {
    initial: "C",
    variant: "curious" as const,
    title: "Financially curious",
    copy: "You're doing okay. But you want to know what 'okay' really means — what people at your income globally are actually doing, saving, investing. You want a number, not a vague sense that you should be doing more.",
  },
] as const;

const LEDGER = [
  { them: "They earn commissions.", us: <>We earn <em>only</em> from subscriptions.</> },
  { them: "They recommend ULIPs.", us: <>We <em>flag</em> them. Out loud.</> },
  { them: "They show health scores.", us: <>We show <em>why</em> your score is that.</> },
  { them: "They guess narrations.", us: <>We read <em>every</em> UPI string.</> },
  { them: "They ignore family transfers.", us: <>We treat them as <em>fixed</em> commitments.</> },
];

const PRICING = [
  {
    tier: "Free",
    amount: "₹0",
    period: " / forever",
    features: ["One bank statement", "Three of eight dimensions", "No scenario explorer"],
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
          <>Thanks — your input shapes what we build.</>
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
            ".reveal, .reveal-stagger, .dim-grid, .benchmark-stack",
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
        .querySelectorAll(".reveal, .reveal-stagger, .dim-grid, .benchmark-stack")
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
      <nav className={`top${scrolled ? " scrolled" : ""}`} id="topnav">
        <div className="inner">
          <a href="#" className="logo">
            <span className="dot" />
            Cashlight
          </a>
          <div className="nav-links">
            <a href="#how">How it works</a>
            <a href="#who">Who it&apos;s for</a>
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
            <div className="ses reveal">Live · v0.4 · Indian markets · IST 09:47</div>
            <h1 className="reveal">
              Most people at your income are still <em>guessing</em> with their
              money.
            </h1>
            <p className="hero-descriptor reveal">
              Cashlight shows you where you stand — and what the financially
              sorted do differently.
            </p>
            <p className="hero-sub reveal">
              You juggle multiple accounts, support family, get lumpy bonuses, and
              pay EMIs across banks. Somewhere between your salary and your
              savings, something is going wrong — and no app has been honest
              enough to show you what.
              <br />
              <br />
              Cashlight reads your actual statements,{" "}
              <b>
                benchmarks you against what people at your income globally are
                actually doing
              </b>
              , and shows you exactly where the gap is. Not charts. Not guesses.
              A real picture.
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
          <div className="ticker-label">Built for Indians managing</div>
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
            style={{ display: "block", marginBottom: 42 }}
          >
            <div className="ses">Things we noticed</div>
            <h2>
              Six things every app pretends <em>aren&apos;t</em> happening.
            </h2>
            <p className="lede">
              Open any Indian money app. Then open your statements. The gap between
              them is what we built Cashlight to close.
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

      <section className="block" id="dimensions">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="left">
              <div className="ses">Eight dimensions</div>
              <h2>
                Your financial health, <em>actually</em> measured.
              </h2>
              <p className="lede">
                Every number is computed from your real transactions. No surveys,
                no estimates, no &ldquo;rate yourself out of 10.&rdquo;
              </p>
            </div>
            <div className="right">8 / 8 readings · sample</div>
          </div>
          <div className="dim-grid reveal-stagger">
            {DIMENSIONS.map((d) => (
              <div key={d.nm} className={`dim ${d.tone}`}>
                <div className="top">
                  <div className="nm">{d.nm}</div>
                  <div className="badge">{d.badge}</div>
                </div>
                {"literal" in d ? (
                  <div className="val">{d.literal}</div>
                ) : (
                  <div
                    className="val"
                    data-count={d.count}
                    data-suffix={d.suffix}
                    {...("prefix" in d && d.prefix ? { "data-prefix": d.prefix } : {})}
                  >
                    {d.placeholder}
                  </div>
                )}
                <div className="sub">{d.sub}</div>
              </div>
            ))}
          </div>
          <p className="dim-illustrative-note reveal">
            Numbers shown are illustrative. Yours will be computed from your
            actual statements.
          </p>
        </div>
      </section>

      <BenchmarkSection />

      <section className="block" id="who">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="left">
              <div className="ses">Who it&apos;s for</div>
              <h2>
                You&apos;re not bad with money.{" "}
                <em>You just never had the full picture.</em>
              </h2>
            </div>
            <div className="right">3 states · v1</div>
          </div>
          <div className="aud-grid reveal-stagger">
            {AUDIENCES.map((a) => (
              <div key={a.title} className={`aud aud--${a.variant}`}>
                <div className="ic">{a.initial}</div>
                <h4>{a.title}</h4>
                <p className="aud-copy">{a.copy}</p>
              </div>
            ))}
          </div>

          <aside className="rescue-callout reveal">
            <div className="ses">{"// a note"}</div>
            <h3 className="rescue-callout-head">
              If you earn well and still feel broke —
            </h3>
            <p className="rescue-callout-sub">
              it&apos;s not you. It&apos;s that nobody ever showed you the full
              picture.
            </p>
            <p className="rescue-callout-body">
              Most Indians who are struggling financially aren&apos;t struggling
              because they earn too little. They&apos;re struggling because
              their money is split across accounts, committed to family before
              it&apos;s counted, disappearing into products they were sold rather
              than ones they chose — and no tool has ever mapped the whole
              picture honestly.
              <br />
              <br />
              That&apos;s what Cashlight is for.
            </p>
            <a className="rescue-callout-link" href="#how">
              See how it works ↓
            </a>
          </aside>
        </div>
      </section>

      <section className="block" id="difference">
        <div className="wrap-narrow">
          <div
            className="section-head reveal"
            style={{ display: "block" }}
          >
            <div className="ses">An open memo</div>
            <h2>
              Why we can <em>tell you the truth.</em>
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
              Most &ldquo;free&rdquo; Indian money apps are funded by the products
              they push. ULIPs. Endowments. &ldquo;Tax-saving&rdquo; insurance.
              Every recommendation comes with a commission.{" "}
              <b>We can&apos;t compete with that on price. But we can on truth.</b>
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
              Sincerely,
              <b>The Cashlight team</b>
            </div>
          </div>
        </div>
      </section>

      <section className="block" id="pricing">
        <div className="wrap">
          <div className="section-head reveal">
            <div className="left">
              <div className="ses">Pricing</div>
              <h2>
                Pay us. So <em>nobody else has to buy us.</em>
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
          <div className="founding reveal">
            <div className="lbl">{"// founding"}</div>
            <div className="copy">
              <b>₹29 / month</b>, locked for life. First 200 users only.
            </div>
            <FoundingCounter />
          </div>
        </div>
      </section>

      <section className="final" id="cta">
        <div className="wrap-narrow">
          <h2 className="reveal">
            For Indians who want to understand their money, <em>honestly</em>.
          </h2>
          <p className="ps reveal">
            Built by a small team in India. Funded by subscriptions, not by what
            we sell you.
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
      </section>

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

      <footer>
        <div className="wrap">
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
    </>
  );
}
