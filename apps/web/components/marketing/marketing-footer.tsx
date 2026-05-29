import Link from "next/link";

type MarketingFooterProps = {
  /** When true, in-page anchors use `#id` (home). Otherwise `/#id`. */
  homeAnchors?: boolean;
  /** Omit outer `<footer>` when nested inside the home page footer. */
  embedded?: boolean;
};

export function MarketingFooter({
  homeAnchors = false,
  embedded = false,
}: MarketingFooterProps) {
  const howHref = homeAnchors ? "#how" : "/#how";
  const pricingHref = homeAnchors ? "#pricing" : "/#pricing";

  const meta = (
    <div className="wrap footer-meta">
      <div className="row footer-row">
        <Link href="/" className="logo footer-brand" style={{ fontSize: 17 }}>
          <span className="dot" />
          Cashlight
        </Link>
        <nav className="footer-links" aria-label="Site">
          <Link href={howHref}>How it works</Link>
          <Link href={pricingHref}>Pricing</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="footer-end">
          <span className="footer-copy">© 2026 Cashlight · Built in India</span>
        </div>
      </div>
      <div className="disclaimer">
        Cashlight is a financial health platform, not a SEBI-registered
        investment advisor. Content is for informational purposes only.
      </div>
    </div>
  );

  if (embedded) {
    return meta;
  }

  return <footer className="site-footer site-footer--compact">{meta}</footer>;
}
