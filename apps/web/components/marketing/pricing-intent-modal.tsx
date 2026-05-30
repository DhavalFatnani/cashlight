"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PricingTier } from "@/lib/marketing-content";
import {
  billingPeriodFromDisplay,
  formatTierOffer,
  parseInrAmount,
} from "@/lib/pricing-tier";

type FormState = "idle" | "loading" | "done" | "error";

type PricingIntentModalProps = {
  open: boolean;
  tier: PricingTier | null;
  onClose: () => void;
};

export function PricingIntentModal({
  open,
  tier,
  onClose,
}: PricingIntentModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [position, setPosition] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    setState("idle");
    setPosition(null);
    setErrorMessage(null);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, tier?.id]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!tier) return;
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setErrorMessage("Enter a valid email.");
      return;
    }
    setState("loading");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/pricing-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: v,
          tier: tier.id,
          amountInr: parseInrAmount(tier.amount),
          billingPeriod: billingPeriodFromDisplay(tier.period),
          ctaLabel: tier.cta,
        }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        position?: number;
        error?: string;
      };
      if (!res.ok || !data.success) {
        setState("idle");
        setErrorMessage(data.error ?? "Something went wrong. Try again.");
        return;
      }
      setPosition(data.position ?? null);
      setState("done");
    } catch {
      setState("idle");
      setErrorMessage("Network error. Try again.");
    }
  }

  if (!open || !tier || typeof document === "undefined") return null;

  const offer = formatTierOffer(tier);

  return createPortal(
    <div
      className="modal-overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="modal-dialog pricing-intent-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        {state === "done" ? (
          <>
            <h2 id={titleId} className="pricing-intent-title">
              Interest saved for {tier.tier}.
            </h2>
            <p className="pricing-intent-body">
              {position !== null ? (
                <>
                  You&apos;re <strong>#{position}</strong> on the waitlist. We
                  noted you&apos;re open to {offer} — no charge today.
                </>
              ) : (
                <>
                  We noted you&apos;re open to {offer}. No charge today —
                  we&apos;ll be in touch.
                </>
              )}
            </p>
            <button
              type="button"
              className="btn-primary pricing-intent-done"
              onClick={onClose}
            >
              Done
            </button>
          </>
        ) : (
          <>
            <p className="pricing-intent-kicker">{"// interest"}</p>
            <h2 id={titleId} className="pricing-intent-title">
              {tier.cta}
            </h2>
            <p className="pricing-intent-body">
              Share your email so we know you&apos;re comfortable with{" "}
              <strong>{offer}</strong> for this kind of product. Nothing is
              charged now.
            </p>
            <form className="pricing-intent-form" onSubmit={onSubmit} noValidate>
              <label className="pricing-intent-label" htmlFor="pricing-intent-email">
                Email
              </label>
              <input
                id="pricing-intent-email"
                type="email"
                placeholder="you@gmail.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                disabled={state === "loading"}
              />
              {errorMessage ? (
                <p className="pricing-intent-error" role="alert">
                  {errorMessage}
                </p>
              ) : null}
              <div className="pricing-intent-actions">
                <button
                  type="button"
                  className="pricing-intent-cancel"
                  onClick={onClose}
                  disabled={state === "loading"}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={state === "loading"}
                >
                  {state === "loading" ? "Saving…" : "Save my interest"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
