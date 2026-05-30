"use client";

import { useRef, useState } from "react";

type FormState = "idle" | "loading" | "done" | "error";

export type SurveyState = "default" | "submitted" | "skipped";

export type WaitlistSource = "hero" | "footer" | "cta";

export type WaitlistSuccessPayload = {
  email: string;
  source: WaitlistSource;
  position: number;
  surveyCompleted: boolean;
};

type WaitlistFormProps = {
  source: WaitlistSource;
  label: string;
  submitLabel?: string;
  eyebrow?: string;
  surveyState: SurveyState;
  onSignup?: () => void;
  onWaitlistSuccess: (payload: WaitlistSuccessPayload) => void;
};

export function WaitlistForm({
  source,
  label,
  submitLabel = "Join the waitlist",
  eyebrow = "// waitlist",
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
      const apiSource = source === "cta" ? "footer" : source;
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: v, source: apiSource }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        position?: number;
        isNew?: boolean;
        surveyCompleted?: boolean;
        claimed?: number;
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
        {label} <small>{eyebrow}</small>
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
          {state === "loading" ? "Joining…" : submitLabel}
        </button>
      </div>
      <div className="form-note">
        No credit card. No payment now. We&apos;ll email when it&apos;s ready.
      </div>
      {errorMessage ? (
        <div className="form-error" role="alert">
          {errorMessage}
        </div>
      ) : null}
      <div className="form-success" role="status" aria-live="polite">
        {surveyState === "submitted" ? (
          <>Thanks. Your input shapes what we build.</>
        ) : position !== null ? (
          <>
            You&apos;re <b>#{position}</b> on the list. We&apos;ll be in touch.
          </>
        ) : (
          <>You&apos;re on the list. We&apos;ll be in touch.</>
        )}
      </div>
    </form>
  );
}
