import { getSiteUrl } from "@/lib/site-url";
import {
  FOUNDING_PRICE_MONTHLY,
  PRICING,
} from "@/lib/marketing-content";

type JsonLd = Record<string, unknown>;

function siteOrigin(): string {
  return getSiteUrl().origin;
}

export function organizationJsonLd(): JsonLd {
  const origin = siteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Cashlight",
    url: origin,
    logo: `${origin}/icon.svg`,
    email: "hello@cashlight.in",
  };
}

export function softwareApplicationJsonLd(): JsonLd {
  const origin = siteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Cashlight",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: origin,
    description:
      "AI-powered financial health for Indians. Reads bank statements and surfaces an honest health report—no commissions or product sales.",
    offers: [
      {
        "@type": "Offer",
        name: "Founding",
        price: FOUNDING_PRICE_MONTHLY,
        priceCurrency: "INR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: FOUNDING_PRICE_MONTHLY,
          priceCurrency: "INR",
          unitText: "MONTH",
        },
        url: `${origin}/pricing`,
        availability: "https://schema.org/LimitedAvailability",
      },
      ...PRICING.map((tier) => ({
        "@type": "Offer",
        name: tier.tier,
        price: tier.amount === "₹0" ? 0 : parseInt(tier.amount.replace(/[^\d]/g, ""), 10),
        priceCurrency: "INR",
        url: `${origin}/pricing`,
      })),
    ],
  };
}

export function homePageJsonLd(): JsonLd[] {
  return [organizationJsonLd(), softwareApplicationJsonLd()];
}

export function pricingPageJsonLd(): JsonLd {
  const origin = siteOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Cashlight",
    description:
      "Subscription financial health platform for Indians. Founding, Free, Pro, and Premium tiers.",
    brand: {
      "@type": "Brand",
      name: "Cashlight",
    },
    url: `${origin}/pricing`,
    offers: [
      {
        "@type": "Offer",
        name: "Founding",
        price: FOUNDING_PRICE_MONTHLY,
        priceCurrency: "INR",
        url: `${origin}/pricing`,
        availability: "https://schema.org/LimitedAvailability",
        eligibleQuantity: {
          "@type": "QuantitativeValue",
          maxValue: 200,
        },
      },
      ...PRICING.map((tier) => ({
        "@type": "Offer",
        name: tier.tier,
        price:
          tier.amount === "₹0"
            ? 0
            : parseInt(tier.amount.replace(/[^\d]/g, ""), 10),
        priceCurrency: "INR",
        url: `${origin}/pricing`,
      })),
    ],
  };
}
