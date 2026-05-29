import type { Metadata } from "next";
import { ContactPage } from "@/components/marketing/contact-page";
import { CONTACT_METADATA } from "@/lib/seo/metadata";

export const metadata: Metadata = CONTACT_METADATA;
export const dynamic = "force-static";

export default function ContactRoute() {
  return <ContactPage />;
}
