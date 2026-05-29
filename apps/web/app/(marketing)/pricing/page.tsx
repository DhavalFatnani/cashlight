import type { Metadata } from "next";
import { PricingPage } from "@/components/marketing/pricing-page";

export const metadata: Metadata = {
  title: "Pricing | Cashlight",
  description:
    "Cashlight pricing: founding tier and full plans. No ads, no commissions.",
};

export default function PricingRoute() {
  return <PricingPage />;
}
