import type { Metadata } from "next";
import { dmSans, instrumentSerif } from "@/lib/fonts";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const siteUrl = getSiteUrl();
const title = "Cashlight | Your money, finally understood.";
const description =
  "AI-powered financial health for Indians. Read your statements, see where you stand, explore scenarios. No commissions, no products to sell.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Cashlight",
    title,
    description,
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
    title,
    description,
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
