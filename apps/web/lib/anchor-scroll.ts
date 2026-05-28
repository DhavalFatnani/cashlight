/** Fallback if nav not in DOM yet — keep in sync with `nav.top .inner` in globals.css */
const NAV_HEIGHT_FALLBACK_PX = 66;
/** Space between nav bottom and the target label */
const LABEL_GAP_PX = 14;

/** Scroll offsets for in-page nav targets (nav height + optional breathing room). */
export const ANCHOR_IDS = ["how", "pricing", "cta"] as const;
export type AnchorId = (typeof ANCHOR_IDS)[number];

/** Added to offset so we don't scroll past the label (corrects slight overshoot). */
const OFFSET_CORRECTION_PX: Record<AnchorId, number> = {
  how: 0,
  pricing: -25,
  cta: 6,
};

const LABEL_SELECTORS: Record<AnchorId, string> = {
  how: "#how",
  pricing: "#pricing",
  cta: "#cta .footer-cta h2",
};

const PROCESS_OUTER_SELECTOR =
  ".process-section:not([aria-hidden]) .process-outer:not(.process-outer--static)";

export function isAnchorId(id: string): id is AnchorId {
  return (ANCHOR_IDS as readonly string[]).includes(id);
}

function getNavHeightPx(): number {
  const inner = document.querySelector("nav.top .inner");
  if (!inner) return NAV_HEIGHT_FALLBACK_PX;
  return Math.ceil(inner.getBoundingClientRect().height);
}

function getScrollOffsetPx(id: AnchorId): number {
  return getNavHeightPx() + LABEL_GAP_PX + OFFSET_CORRECTION_PX[id];
}

/** Layout Y in document — stable for hash / scroll-up (unlike sticky getBoundingClientRect). */
function getDocumentY(el: Element): number {
  return el.getBoundingClientRect().top + window.scrollY;
}

/**
 * #how sits in a sticky scroller; its painted rect moves while the layout anchor
 * stays at the process track top. Always derive Y from the track outer box.
 */
function getHowScrollTop(): number | null {
  const outer = document.querySelector<HTMLElement>(PROCESS_OUTER_SELECTOR);
  const label = document.getElementById("how");
  const anchor = outer ?? label;
  if (!anchor) return null;
  // Scroll to ~20% into the process section to reveal step 1
  const outerHeight = outer?.getBoundingClientRect().height || 0;
  const revealOffset = outerHeight * 0.1;
  return getDocumentY(anchor) - getScrollOffsetPx("how") + revealOffset;
}

function scrollToY(top: number, behavior: ScrollBehavior): void {
  window.scrollTo({ top: Math.max(0, top), behavior });
}

function scrollToElement(
  el: Element,
  offsetPx: number,
  behavior: ScrollBehavior,
): void {
  scrollToY(getDocumentY(el) - offsetPx, behavior);
}

function resolveAnchorElement(id: AnchorId): Element | null {
  if (id === "how") return null;
  const label = document.querySelector(LABEL_SELECTORS[id]);
  if (label) return label;
  return document.getElementById(id);
}

export function scrollToAnchor(
  id: AnchorId,
  behavior: ScrollBehavior = "smooth",
): void {
  const attempt = () => {
    if (id === "how") {
      const top = getHowScrollTop();
      if (top === null) return;
      scrollToY(top, behavior);
      return;
    }

    const el = resolveAnchorElement(id);
    if (!el) return;
    scrollToElement(el, getScrollOffsetPx(id), behavior);
  };

  attempt();
  requestAnimationFrame(() => requestAnimationFrame(attempt));

  if (id === "how") {
    window.setTimeout(attempt, 50);
    window.setTimeout(attempt, 200);
  }
}
