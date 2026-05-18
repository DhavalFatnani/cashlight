import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cashlight | Your money, finally understood.",
  description:
    "AI-powered financial health for Indians. Read your statements, see where you stand, explore scenarios. No commissions, no products to sell.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
