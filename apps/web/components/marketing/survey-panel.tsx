"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  CURRENT_TOOL_OPTIONS,
  FEATURE_MAX,
  FEATURE_OPTIONS,
  FEEDBACK_MAX,
  PAIN_GAP_OPTIONS,
  PAIN_GAP_OTHER_MAX,
  PAIN_HOURS_OPTIONS,
  SITUATION_OPTIONS,
  type SurveyResponse,
  WTP_OPTIONS,
} from "@/lib/survey-questions";

type SurveyPanelProps = {
  email: string;
  source: "hero" | "footer";
  onSubmitted: () => void;
  onSkipped: () => void;
};

type AnswerState = {
  situation: string[];
  current_tool: string | null;
  pain_hours: string | null;
  pain_gap: string | null;
  pain_gap_other: string;
  wtp_band: string | null;
  feature_priorities: string[];
  feedback: string;
};

const EMPTY: AnswerState = {
  situation: [],
  current_tool: null,
  pain_hours: null,
  pain_gap: null,
  pain_gap_other: "",
  wtp_band: null,
  feature_priorities: [],
  feedback: "",
};

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
      className={`chip${selected ? " selected" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export function SurveyPanel({
  email,
  source,
  onSubmitted,
  onSkipped,
}: SurveyPanelProps) {
  const [answers, setAnswers] = useState<AnswerState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  const remainingRequired = useMemo(() => {
    let n = 0;
    if (answers.situation.length === 0) n++;
    if (!answers.current_tool) n++;
    if (!answers.pain_hours) n++;
    if (!answers.pain_gap) n++;
    if (answers.pain_gap === "Other" && answers.pain_gap_other.trim().length === 0) n++;
    if (!answers.wtp_band) n++;
    if (answers.feature_priorities.length === 0) n++;
    return n;
  }, [answers]);

  const featureCapHit = answers.feature_priorities.length >= FEATURE_MAX;

  async function onSubmit() {
    if (remainingRequired > 0 || submitting) return;
    setSubmitting(true);
    setError(null);

    const payload: SurveyResponse = {
      email,
      source,
      situation: answers.situation as SurveyResponse["situation"],
      current_tool: answers.current_tool as SurveyResponse["current_tool"],
      pain_hours: answers.pain_hours as SurveyResponse["pain_hours"],
      pain_gap: answers.pain_gap as SurveyResponse["pain_gap"],
      pain_gap_other:
        answers.pain_gap === "Other" ? answers.pain_gap_other.trim() : null,
      wtp_band: answers.wtp_band as SurveyResponse["wtp_band"],
      feature_priorities:
        answers.feature_priorities as SurveyResponse["feature_priorities"],
      feedback: answers.feedback.trim().length > 0 ? answers.feedback.trim() : null,
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
      onSubmitted();
    } catch {
      setError("Network error. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="survey-panel" ref={panelRef}>
      <p className="survey-intro">
        <b>7 quick questions</b> while you&apos;re here. They shape what we build.
      </p>

      <fieldset>
        <legend>1 · Which best describes you?</legend>
        <div className="chip-row" role="group">
          {SITUATION_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              selected={answers.situation.includes(opt)}
              onClick={() =>
                setAnswers((a) => ({ ...a, situation: toggleIn(a.situation, opt) }))
              }
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>2 · What do you use today?</legend>
        <div className="chip-row" role="group">
          {CURRENT_TOOL_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              selected={answers.current_tool === opt}
              onClick={() => setAnswers((a) => ({ ...a, current_tool: opt }))}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>3 · Time lost per month to financial friction?</legend>
        <div className="chip-row" role="group">
          {PAIN_HOURS_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              selected={answers.pain_hours === opt}
              onClick={() => setAnswers((a) => ({ ...a, pain_hours: opt }))}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>4 · What bothers you most about money tools?</legend>
        <div className="chip-row" role="group">
          {PAIN_GAP_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              selected={answers.pain_gap === opt}
              onClick={() =>
                setAnswers((a) => ({
                  ...a,
                  pain_gap: opt,
                  pain_gap_other: opt === "Other" ? a.pain_gap_other : "",
                }))
              }
            />
          ))}
        </div>
        {answers.pain_gap === "Other" && (
          <input
            type="text"
            className="other-input"
            placeholder="Briefly…"
            maxLength={PAIN_GAP_OTHER_MAX}
            value={answers.pain_gap_other}
            onChange={(e) =>
              setAnswers((a) => ({ ...a, pain_gap_other: e.target.value }))
            }
          />
        )}
      </fieldset>

      <fieldset>
        <legend>5 · What feels fair to pay monthly?</legend>
        <div className="chip-row" role="group">
          {WTP_OPTIONS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              selected={answers.wtp_band === opt}
              onClick={() => setAnswers((a) => ({ ...a, wtp_band: opt }))}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>
          6 · Pick the 3 most valuable features.{" "}
          <span className="legend-hint">
            {answers.feature_priorities.length}/{FEATURE_MAX} picked
          </span>
        </legend>
        <div className="chip-row" role="group">
          {FEATURE_OPTIONS.map((opt) => {
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
      </fieldset>

      <fieldset>
        <legend>
          7 · What would make Cashlight a &quot;yes&quot; for you in week 1?{" "}
          <span className="legend-hint">optional</span>
        </legend>
        <textarea
          className="feedback-input"
          placeholder="One specific thing…"
          maxLength={FEEDBACK_MAX}
          value={answers.feedback}
          onChange={(e) =>
            setAnswers((a) => ({ ...a, feedback: e.target.value }))
          }
        />
        <span className="char-count">
          {answers.feedback.length}/{FEEDBACK_MAX}
        </span>
      </fieldset>

      <div className="survey-actions">
        <span
          className={`survey-status${error ? " error" : ""}`}
          aria-live="polite"
          aria-atomic="true"
        >
          {error
            ? error
            : remainingRequired > 0
              ? `Answer ${remainingRequired} more`
              : "Ready to submit"}
        </span>
        <button
          type="button"
          className="btn-ghost"
          onClick={onSkipped}
          disabled={submitting}
        >
          Skip
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={onSubmit}
          disabled={submitting || remainingRequired > 0}
        >
          {submitting ? "Sending…" : "Submit"}
        </button>
      </div>
      <p className="survey-privacy">
        Your responses help us build the right thing. We won&apos;t share them.
      </p>
    </div>
  );
}
