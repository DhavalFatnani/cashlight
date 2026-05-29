/** Fallback if nav not in DOM yet — keep in sync with `nav.top .inner` in globals.css */
const NAV_HEIGHT_FALLBACK_PX = 66;
/** Space between nav bottom and the target label */
const LABEL_GAP_PX = 14;

/** In-page anchors on the marketing home page */
export const ANCHOR_IDS = ["cta"] as const;
export type AnchorId = (typeof ANCHOR_IDS)[number];

const OFFSET_CORRECTION_PX: Record<AnchorId, number> = {
  cta: 6,
};

const LABEL_SELECTORS: Record<AnchorId, string> = {
  cta: "#cta .footer-cta h2",
};

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

function getDocumentY(el: Element): number {
  return el.getBoundingClientRect().top + window.scrollY;
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
  const label = document.querySelector(LABEL_SELECTORS[id]);
  if (label) return label;
  return document.getElementById(id);
}

export function scrollToAnchor(
  id: AnchorId,
  behavior: ScrollBehavior = "smooth",
): void {
  const attempt = () => {
    const el = resolveAnchorElement(id);
    if (!el) return;
    scrollToElement(el, getScrollOffsetPx(id), behavior);
  };

  attempt();
  requestAnimationFrame(() => requestAnimationFrame(attempt));
}
