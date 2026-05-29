import type { Metadata } from "next";
import { getSiteUrl, shouldIndexSite } from "@/lib/site-url";

export type MarketingPath =
  | "/"
  | "/how-it-works"
  | "/pricing"
  | "/why"
  | "/contact";

const DEFAULT_OG_ALT = "Cashlight — Your money, finally understood.";

type BuildPageMetadataInput = {
  path: MarketingPath;
  title: string;
  description: string;
  ogImageAlt?: string;
};

export function buildPageMetadata({
  path,
  title,
  description,
  ogImageAlt = DEFAULT_OG_ALT,
}: BuildPageMetadataInput): Metadata {
  const siteUrl = getSiteUrl();
  const canonicalUrl = new URL(path, siteUrl);
  const ogImageUrl = new URL("/api/og", siteUrl);

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: canonicalUrl,
      siteName: "Cashlight",
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
  };
}

export const HOME_METADATA = buildPageMetadata({
  path: "/",
  title:
    "Cashlight — Understand Your Money in 90 Seconds | Financial Health for Indians",
  description:
    "Cashlight reads your bank statements and builds a personal financial health report for Indians in about 90 seconds. See coverage, savings, insurance, and tax gaps—no commissions.",
  ogImageAlt:
    "Cashlight — Understand your money with a statement-based health report for Indians.",
});

export const HOW_IT_WORKS_METADATA = buildPageMetadata({
  path: "/how-it-works",
  title: "How Cashlight Works — 8 Dimensions of Financial Health",
  description:
    "See how Cashlight ingests your statements, scores eight dimensions of financial health, and surfaces scenarios—built for Indian salaries, EMIs, bonuses, and family support.",
  ogImageAlt: "How Cashlight works — eight dimensions of financial health.",
});

export const PRICING_METADATA = buildPageMetadata({
  path: "/pricing",
  title: "Cashlight Pricing — No Ads, No Commissions",
  description:
    "Subscription-only pricing: founding tier at ₹49/mo (first 200), plus Free, Pro, and Premium plans. No ads, no commissions, no product pitches—just your financial health report.",
  ogImageAlt: "Cashlight pricing — founding tier and subscription plans.",
});

export const WHY_METADATA = buildPageMetadata({
  path: "/why",
  title: "Why Cashlight Has No Commissions",
  description:
    "Cashlight charges a subscription so we never earn from selling you products. Read why a conflict-free model matters for honest financial health—not advice or pitches.",
  ogImageAlt: "Why Cashlight has no commissions or product sales.",
});

export const CONTACT_METADATA = buildPageMetadata({
  path: "/contact",
  title: "Contact Cashlight",
  description:
    "Email or WhatsApp the Cashlight team about the waitlist, founding access, early product questions, or how we read your statements—no ticket queue.",
  ogImageAlt: "Contact the Cashlight team.",
});

export function rootRobotsMetadata(): Metadata["robots"] {
  if (shouldIndexSite()) {
    return { index: true, follow: true };
  }
  return { index: false, follow: false };
}
