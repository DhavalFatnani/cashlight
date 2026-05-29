/**
 * Payment-success clip — Universfield “level up” (permanent default).
 * Source: docs/universfield-level-up-05-326133.mp3 → public/sounds/payment-success.mp3
 */

const PAYMENT_SOUND_URL = "/sounds/payment-success.mp3";
const PLAYBACK_VOLUME = 0.62;

let template: HTMLAudioElement | null = null;

function getTemplate(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!template) {
    template = new Audio(PAYMENT_SOUND_URL);
    template.preload = "auto";
    template.volume = PLAYBACK_VOLUME;
  }
  return template;
}

/** Warm the asset on first interaction so the first click plays immediately. */
export function primePaymentSound(): void {
  const audio = getTemplate();
  if (!audio) return;
  audio.load();
}

/** Play the level-up payment-success MP3 (call from a click / tap). */
export async function playPaymentSound(): Promise<void> {
  const base = getTemplate();
  if (!base) return;

  const clip = base.cloneNode(true) as HTMLAudioElement;
  clip.volume = PLAYBACK_VOLUME;

  try {
    await clip.play();
  } catch {
    // Autoplay policy or missing asset
  }
}
