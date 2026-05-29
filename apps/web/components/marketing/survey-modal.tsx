"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  EMPTY_SURVEY_ANSWERS,
  FEATURE_MAX,
  PAIN_GAP_OTHER_MAX,
  SURVEY_STEP_COUNT,
  SURVEY_STEPS,
  type SurveyAnswers,
  type SurveyResponse,
  type SurveyStep,
} from "@/lib/survey-questions";

type SurveyModalProps = {
  open: boolean;
  email: string;
  source: "hero" | "footer";
  position: number;
  onSubmitted: () => void;
  onSkipped: () => void;
  onClose: () => void;
};

type Phase = "questions" | "thanks";

function toggleIn<T extends string>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Chip({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      className={`survey-chip${selected ? " selected" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

function stepIsValid(step: SurveyStep, answers: SurveyAnswers): boolean {
  switch (step.id) {
    case "situation":
      return answers.situation.length > 0;
    case "current_tool":
      return answers.current_tool !== null;
    case "pain_hours":
      return answers.pain_hours !== null;
    case "pain_gap":
      if (answers.pain_gap.length === 0) return false;
      if (answers.pain_gap.includes("Other")) {
        return answers.pain_gap_other.trim().length > 0;
      }
      return true;
    case "wtp_band":
      return answers.wtp_band !== null;
    case "feature_priorities":
      return answers.feature_priorities.length > 0;
    case "feedback":
      return true;
    default:
      return false;
  }
}

export function SurveyModal({
  open,
  email,
  source,
  position,
  onSubmitted,
  onSkipped,
  onClose,
}: SurveyModalProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>(EMPTY_SURVEY_ANSWERS);
  const [phase, setPhase] = useState<Phase>("questions");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const otherInputRef = useRef<HTMLInputElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = SURVEY_STEPS[stepIndex];
  const isLastStep = stepIndex === SURVEY_STEP_COUNT - 1;
  const canContinue = step ? stepIsValid(step, answers) : false;
  const progressPct = ((stepIndex + 1) / SURVEY_STEP_COUNT) * 100;

  const featureCapHit = answers.feature_priorities.length >= FEATURE_MAX;

  const reset = useCallback(() => {
    setStepIndex(0);
    setAnswers(EMPTY_SURVEY_ANSWERS);
    setPhase("questions");
    setSubmitting(false);
    setError(null);
  }, []);

  const handleSkip = useCallback(() => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    onSkipped();
    onClose();
  }, [onSkipped, onClose]);

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleSkip();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, [open, handleSkip]);

  const painGapIncludesOther = answers.pain_gap.includes("Other");

  useLayoutEffect(() => {
    if (
      !open ||
      phase !== "questions" ||
      step?.id !== "pain_gap" ||
      !painGapIncludesOther
    ) {
      return;
    }
    otherInputRef.current?.focus({ preventScroll: true });
  }, [open, phase, step?.id, painGapIncludesOther]);

  function goNext() {
    if (!canContinue || !step) return;
    if (isLastStep) return;
    setStepIndex((i) => i + 1);
    setError(null);
  }

  function goBack() {
    if (stepIndex === 0) return;
    setStepIndex((i) => i - 1);
    setError(null);
  }

  function scheduleAutoAdvance() {
    if (!step || step.type !== "single" || !step.autoAdvance) return;
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      setStepIndex((i) => (i < SURVEY_STEP_COUNT - 1 ? i + 1 : i));
    }, 180);
  }

  async function handleSubmit() {
    if (!canContinue || submitting) return;
    setSubmitting(true);
    setError(null);

    const payload: SurveyResponse = {
      email,
      source,
      situation: answers.situation as SurveyResponse["situation"],
      current_tool: answers.current_tool as SurveyResponse["current_tool"],
      pain_hours: answers.pain_hours as SurveyResponse["pain_hours"],
      pain_gap: answers.pain_gap as SurveyResponse["pain_gap"],
      pain_gap_other: answers.pain_gap.includes("Other")
        ? answers.pain_gap_other.trim()
        : null,
      wtp_band: answers.wtp_band as SurveyResponse["wtp_band"],
      feature_priorities:
        answers.feature_priorities as SurveyResponse["feature_priorities"],
      feedback:
        answers.feedback.trim().length > 0 ? answers.feedback.trim() : null,
    };

    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setError(data.error ?? "Something went wrong. Try again.");
        setSubmitting(false);
        return;
      }
      setPhase("thanks");
      setSubmitting(false);
    } catch {
      setError("Network error. Try again.");
      setSubmitting(false);
    }
  }

  function handleThanksDone() {
    onSubmitted();
    onClose();
  }

  function chipRowClass(stepType: SurveyStep["type"]): string {
    if (
      stepType === "multi" ||
      stepType === "multi_cap" ||
      stepType === "multi_with_other"
    ) {
      return "survey-chip-row";
    }
    return "survey-chip-row survey-chip-row--stacked";
  }

  function renderQuestionMeta(): string | null {
    if (!step) return null;
    if (step.type === "multi_cap") {
      return `${answers.feature_priorities.length} of ${FEATURE_MAX} selected`;
    }
    if (step.type === "text" && step.hint) {
      return step.hint;
    }
    if (step.type === "multi" || step.type === "multi_with_other") {
      return "Select all that apply";
    }
    return null;
  }

  function renderStepContent() {
    if (!step) return null;

    switch (step.type) {
      case "multi":
        return (
          <div className={chipRowClass(step.type)} role="group" aria-labelledby="survey-q">
            {step.options.map((opt) => (
              <Chip
                key={opt}
                label={opt}
                selected={answers.situation.includes(opt)}
                onClick={() =>
                  setAnswers((a) => ({
                    ...a,
                    situation: toggleIn(a.situation, opt),
                  }))
                }
              />
            ))}
          </div>
        );
      case "single":
        return (
          <div className={chipRowClass(step.type)} role="group" aria-labelledby="survey-q">
            {step.options.map((opt) => {
              const field =
                step.id === "current_tool"
                  ? "current_tool"
                  : step.id === "pain_hours"
                    ? "pain_hours"
                    : "wtp_band";
              return (
                <Chip
                  key={opt}
                  label={opt}
                  selected={answers[field] === opt}
                  onClick={() => {
                    setAnswers((a) => ({ ...a, [field]: opt }));
                    scheduleAutoAdvance();
                  }}
                />
              );
            })}
          </div>
        );
      case "multi_with_other":
        return (
          <div className="survey-answers-stack">
            <div className={chipRowClass(step.type)} role="group" aria-labelledby="survey-q">
              {step.options.map((opt) => (
                <Chip
                  key={opt}
                  label={opt}
                  selected={answers.pain_gap.includes(opt)}
                  onClick={() => {
                    const selectingOther =
                      opt === "Other" && !answers.pain_gap.includes("Other");
                    setAnswers((a) => {
                      const next = toggleIn(a.pain_gap, opt);
                      return {
                        ...a,
                        pain_gap: next,
                        pain_gap_other: next.includes("Other")
                          ? a.pain_gap_other
                          : "",
                      };
                    });
                    if (selectingOther) {
                      requestAnimationFrame(() => {
                        otherInputRef.current?.focus({ preventScroll: true });
                      });
                    }
                  }}
                />
              ))}
            </div>
            {painGapIncludesOther && (
              <input
                ref={otherInputRef}
                type="text"
                className="survey-text-input"
                placeholder="Briefly describe…"
                maxLength={PAIN_GAP_OTHER_MAX}
                value={answers.pain_gap_other}
                autoComplete="off"
                aria-label="Describe your other concern"
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, pain_gap_other: e.target.value }))
                }
              />
            )}
          </div>
        );
      case "multi_cap":
        return (
          <div className={chipRowClass(step.type)} role="group" aria-labelledby="survey-q">
            {step.options.map((opt) => {
              const selected = answers.feature_priorities.includes(opt);
              return (
                <Chip
                  key={opt}
                  label={opt}
                  selected={selected}
                  disabled={!selected && featureCapHit}
                  onClick={() =>
                    setAnswers((a) => ({
                      ...a,
                      feature_priorities: toggleIn(a.feature_priorities, opt),
                    }))
                  }
                />
              );
            })}
          </div>
        );
      case "text":
        return (
          <div className="survey-answers-stack survey-answers-stack--text">
            <textarea
              className="survey-textarea"
              placeholder="One specific thing…"
              maxLength={step.maxLength}
              value={answers.feedback}
              onChange={(e) =>
                setAnswers((a) => ({ ...a, feedback: e.target.value }))
              }
            />
            <span className="survey-char-count">
              {answers.feedback.length}/{step.maxLength}
            </span>
          </div>
        );
      default:
        return null;
    }
  }

  if (!open || typeof document === "undefined" || !step) return null;

  const questionMeta = phase === "questions" ? renderQuestionMeta() : null;

  return createPortal(
    <div
      className="modal-overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && phase === "questions") handleSkip();
      }}
    >
      <div
        className="modal-dialog survey-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={phase === "questions" ? "survey-q" : "survey-thanks-title"}
      >
        {phase === "thanks" ? (
          <>
            <h2 id="survey-thanks-title" className="survey-thanks-title">
              You&apos;re <span className="survey-position">#{position}</span> on
              the list.
            </h2>
            <p className="survey-thanks-body">
              Thanks. Your input shapes what we build.
            </p>
            <button
              type="button"
              className="btn-primary survey-submit-btn"
              onClick={handleThanksDone}
            >
              Done
            </button>
          </>
        ) : (
          <>
            <div className="survey-modal-header">
              <p className="survey-modal-kicker">
                7 quick questions · ~45 sec
              </p>
              <button
                type="button"
                className="btn-ghost survey-skip"
                onClick={handleSkip}
                disabled={submitting}
              >
                Skip
              </button>
            </div>

            <div className="survey-modal-body">
              <div className="survey-progress" aria-hidden>
                <div className="survey-progress-track">
                  <div
                    className="survey-progress-fill"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="survey-progress-label">
                  {stepIndex + 1} of {SURVEY_STEP_COUNT}
                </span>
              </div>

              <section className="survey-step" aria-labelledby="survey-q">
                <div className="survey-question-block">
                  <h2 id="survey-q" className="survey-question">
                    {step.question}
                  </h2>
                  {questionMeta ? (
                    <p className="survey-question-meta">{questionMeta}</p>
                  ) : null}
                </div>
                <div className="survey-answers">{renderStepContent()}</div>
              </section>

              {error ? (
                <p className="survey-error" role="alert">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="survey-modal-footer">
              <button
                type="button"
                className="btn-ghost"
                onClick={goBack}
                disabled={stepIndex === 0 || submitting}
              >
                Back
              </button>
              {isLastStep ? (
                <button
                  type="button"
                  className="btn-primary survey-submit-btn"
                  onClick={handleSubmit}
                  disabled={!canContinue || submitting}
                >
                  {submitting ? "Sending…" : "Submit"}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary survey-submit-btn"
                  onClick={goNext}
                  disabled={!canContinue || submitting}
                >
                  Continue
                </button>
              )}
            </div>

            <p className="survey-privacy">
              Your responses help us build the right thing. We won&apos;t share
              them.
            </p>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
