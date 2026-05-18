"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ThankYouModalProps = {
  open: boolean;
  position: number;
  variant: "returning" | "survey_done";
  onClose: () => void;
};

export function ThankYouModal({
  open,
  position,
  variant,
  onClose,
}: ThankYouModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

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
        className="modal-dialog thank-you-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="thank-you-title"
        tabIndex={-1}
      >
        <h2 id="thank-you-title" className="thank-you-title">
          You&apos;re <span className="thank-you-position">#{position}</span> on
          the list.
        </h2>
        <p className="thank-you-body">
          {variant === "returning" ? (
            <>
              We already have your answers and we&apos;re building with them in
              mind. We&apos;ll be in touch.
            </>
          ) : (
            <>Thanks — your input shapes what we build. We&apos;ll be in touch.</>
          )}
        </p>
        <button type="button" className="btn-primary thank-you-done" onClick={onClose}>
          Done
        </button>
      </div>
    </div>,
    document.body,
  );
}
