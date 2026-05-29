import type { Metadata } from "next";
import { dmSans, instrumentSerif } from "@/lib/fonts";
import { rootRobotsMetadata } from "@/lib/seo/metadata";
import { getDefaultOgImageUrl } from "@/lib/seo/og-image-url";
import { OG_IMAGE_ALT, OG_IMAGE_SIZE } from "@/lib/seo/og-image";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const siteUrl = getSiteUrl();
const defaultTitle = "Cashlight | Your money, finally understood.";
const defaultDescription =
  "AI-powered financial health for Indians. Read your statements, see where you stand, explore scenarios. No commissions, no products to sell.";
const defaultOgImageUrl = getDefaultOgImageUrl().href;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: defaultTitle,
    template: "%s",
  },
  description: defaultDescription,
  robots: rootRobotsMetadata(),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Cashlight",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: defaultOgImageUrl,
        secureUrl: defaultOgImageUrl,
        width: OG_IMAGE_SIZE.width,
        height: OG_IMAGE_SIZE.height,
        alt: OG_IMAGE_ALT,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: defaultOgImageUrl,
        width: OG_IMAGE_SIZE.width,
        height: OG_IMAGE_SIZE.height,
        alt: OG_IMAGE_ALT,
      },
    ],
  },
  other: {
    "og:image": defaultOgImageUrl,
    "og:image:secure_url": defaultOgImageUrl,
    "og:image:width": String(OG_IMAGE_SIZE.width),
    "og:image:height": String(OG_IMAGE_SIZE.height),
    "og:image:type": "image/png",
    "og:image:alt": OG_IMAGE_ALT,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${dmSans.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
