import type { Metadata } from "next";
import { getDefaultOgImageUrl } from "@/lib/seo/og-image-url";
import { OG_IMAGE_ALT, OG_IMAGE_SIZE } from "@/lib/seo/og-image";
import { getSiteUrl, shouldIndexSite } from "@/lib/site-url";

export type MarketingPath =
  | "/"
  | "/how-it-works"
  | "/pricing"
  | "/why"
  | "/contact";

type BuildPageMetadataInput = {
  path: MarketingPath;
  title: string;
  description: string;
  ogImageAlt?: string;
};

function openGraphImages(ogImageAlt: string): NonNullable<Metadata["openGraph"]>["images"] {
  const ogImageUrl = getDefaultOgImageUrl().href;
  return [
    {
      url: ogImageUrl,
      secureUrl: ogImageUrl,
      width: OG_IMAGE_SIZE.width,
      height: OG_IMAGE_SIZE.height,
      alt: ogImageAlt,
      type: "image/png",
    },
  ];
}

export function buildPageMetadata({
  path,
  title,
  description,
  ogImageAlt = OG_IMAGE_ALT,
}: BuildPageMetadataInput): Metadata {
  const siteUrl = getSiteUrl();
  const canonicalUrl = new URL(path, siteUrl);
  const ogImageUrl = getDefaultOgImageUrl().href;

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
      images: openGraphImages(ogImageAlt),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: OG_IMAGE_SIZE.width,
          height: OG_IMAGE_SIZE.height,
          alt: ogImageAlt,
        },
      ],
    },
    other: {
      "og:image": ogImageUrl,
      "og:image:secure_url": ogImageUrl,
      "og:image:width": String(OG_IMAGE_SIZE.width),
      "og:image:height": String(OG_IMAGE_SIZE.height),
      "og:image:type": "image/png",
      "og:image:alt": ogImageAlt,
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
    "See how Cashlight links accounts via Account Aggregator (with statement upload as fallback), scores eight dimensions of financial health, and surfaces scenarios for Indian salaries, EMIs, bonuses, and family support.",
  ogImageAlt: "How Cashlight works — eight dimensions of financial health.",
});

export const PRICING_METADATA = buildPageMetadata({
  path: "/pricing",
  title: "Cashlight Pricing — No Ads, No Commissions",
  description:
    "Subscription-only pricing: founding tier at ₹49/mo (first 200), plus Free, Pro, and Premium tiers. No ads, no commissions, no product pitches. Just your financial health report and scenarios.",
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
