import type { Metadata } from "next";
import { WhyPage } from "@/components/marketing/why-page";
import { WHY_METADATA } from "@/lib/seo/metadata";

export const metadata: Metadata = WHY_METADATA;
export const dynamic = "force-static";

export default function WhyRoute() {
  return <WhyPage />;
}
