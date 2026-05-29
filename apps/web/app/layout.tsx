import type { Metadata } from "next";
import { dmSans, instrumentSerif } from "@/lib/fonts";
import { rootRobotsMetadata } from "@/lib/seo/metadata";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const siteUrl = getSiteUrl();
const defaultTitle = "Cashlight | Your money, finally understood.";
const defaultDescription =
  "AI-powered financial health for Indians. Read your statements, see where you stand, explore scenarios. No commissions, no products to sell.";

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
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Cashlight — Your money, finally understood.",
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
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Cashlight — Your money, finally understood.",
      },
    ],
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
