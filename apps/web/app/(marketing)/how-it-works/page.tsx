import type { Metadata } from "next";
import { HowItWorksPage } from "@/components/marketing/how-it-works-page";
import { HOW_IT_WORKS_METADATA } from "@/lib/seo/metadata";

export const metadata: Metadata = HOW_IT_WORKS_METADATA;
export const dynamic = "force-static";

export default function HowItWorksRoute() {
  return <HowItWorksPage />;
}
