import Link from "next/link";
import {
  CONTACT_EMAIL,
  CONTACT_WHATSAPP_E164,
  contactMailtoUrl,
  contactWhatsAppUrl,
} from "@/lib/contact";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";

const WHATSAPP_DISPLAY = `+${CONTACT_WHATSAPP_E164.slice(0, 2)} ${CONTACT_WHATSAPP_E164.slice(2, 7)} ${CONTACT_WHATSAPP_E164.slice(7)}`;

export function ContactPage() {
  const mailWaitlist = contactMailtoUrl("Cashlight waitlist");
  const mailGeneral = contactMailtoUrl("Cashlight — question");
  const waGeneral = contactWhatsAppUrl(
    "Hi — I have a question about Cashlight.",
  );

  return (
    <MarketingPageShell fitViewport className="contact-page contact-page-shell">
      <section className="block contact-block contact-page-section" id="contact">
        <div className="wrap-narrow">
          <div className="section-head">
            <div className="left">
              <div className="ses">{"// CONTACT"}</div>
              <h2>
                Talk to the people building <em>Cashlight.</em>
              </h2>
              <p className="lede">
                Waitlist, early access, or how we read your numbers — email or
                WhatsApp, no ticket queue.
              </p>
            </div>
          </div>

          <div className="contact-grid">
            <a href={mailWaitlist} className="contact-card">
              <span className="contact-card-label">Email</span>
              <span className="contact-card-value">{CONTACT_EMAIL}</span>
              <span className="contact-card-hint">
                Waitlist, founding tier, or early access
              </span>
            </a>

            <a
              href={waGeneral}
              className="contact-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-card-label">WhatsApp</span>
              <span className="contact-card-value">{WHATSAPP_DISPLAY}</span>
              <span className="contact-card-hint">
                Quick questions — we reply when we can
              </span>
            </a>
          </div>

          <p className="contact-note">
            Not investment advice. Mention your banks if you ask about
            statements. Sensitive topics:{" "}
            <a href={mailGeneral}>email</a>.
          </p>

          <p className="contact-back">
            <Link href="/">← Back to home</Link>
            <span className="contact-back-sep">·</span>
            <Link href="/#cta">Join the waitlist</Link>
          </p>
        </div>
      </section>
    </MarketingPageShell>
  );
}
