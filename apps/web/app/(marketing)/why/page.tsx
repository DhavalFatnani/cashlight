import type { Metadata } from "next";
import { WhyPage } from "@/components/marketing/why-page";

export const metadata: Metadata = {
  title: "Why we're different | Cashlight",
  description:
    "Why Cashlight has no commissions, no product pitches, and no conflicts of interest.",
};

export default function WhyRoute() {
  return <WhyPage />;
}
