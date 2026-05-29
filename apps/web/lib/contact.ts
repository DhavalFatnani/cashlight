/** Public contact channels (override via env on Vercel). */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@cashlight.in";

/** E.164 without + — used for wa.me links */
export const CONTACT_WHATSAPP_E164 =
  process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ?? "918980226979";

export function contactWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${CONTACT_WHATSAPP_E164}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function contactMailtoUrl(subject?: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  const q = params.toString();
  return q ? `mailto:${CONTACT_EMAIL}?${q}` : `mailto:${CONTACT_EMAIL}`;
}
