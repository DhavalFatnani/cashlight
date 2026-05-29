import type { Metadata } from "next";
import { ContactPage } from "@/components/marketing/contact-page";

export const metadata: Metadata = {
  title: "Contact | Cashlight",
  description:
    "Reach the Cashlight team — waitlist, early access, and questions about your financial health report.",
};

export default function ContactRoute() {
  return <ContactPage />;
}
