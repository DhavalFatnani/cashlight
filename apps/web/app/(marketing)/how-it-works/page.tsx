import type { Metadata } from "next";
import { HowItWorksPage } from "@/components/marketing/how-it-works-page";

export const metadata: Metadata = {
  title: "How it works | Cashlight",
  description:
    "How Cashlight reads your statements, scores eight dimensions of financial health, and who it is built for.",
};

export default function HowItWorksRoute() {
  return <HowItWorksPage />;
}
