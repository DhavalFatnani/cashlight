"use client";

import { useState } from "react";
import { PricingIntentModal } from "@/components/marketing/pricing-intent-modal";
import { PRICING, type PricingTier } from "@/lib/marketing-content";

export function PricingTiers() {
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const modalOpen = selectedTier !== null;

  return (
    <>
      <div className="pricing">
        {PRICING.map((tier) => (
          <div
            key={tier.id}
            className={`price${tier.popular ? " popular" : ""}`}
          >
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
            <button
              type="button"
              onClick={() => setSelectedTier(tier)}
              aria-haspopup="dialog"
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>
      <PricingIntentModal
        open={modalOpen}
        tier={selectedTier}
        onClose={() => setSelectedTier(null)}
      />
    </>
  );
}
