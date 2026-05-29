import Link from "next/link";

type MarketingFooterProps = {
  /** Omit outer `<footer>` when nested inside the home page footer. */
  embedded?: boolean;
};

export function MarketingFooter({ embedded = false }: MarketingFooterProps) {
  const meta = (
    <div className="wrap footer-meta">
      <div className="row footer-row">
        <Link href="/" className="logo footer-brand" style={{ fontSize: 17 }}>
          <span className="dot" />
          Cashlight
        </Link>
        <nav className="footer-links" aria-label="Site">
          <Link href="/how-it-works">How it works</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/why">Why</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="footer-end">
          <span className="footer-copy">© 2026 Cashlight · Built in India</span>
        </div>
      </div>
      <div className="disclaimer">
        Cashlight is a financial health platform, not a SEBI-registered
        investment advisor. We show you scenarios, not prescriptions. For
        specific investment or tax decisions, we&apos;ll tell you when you need a
        qualified professional.
      </div>
    </div>
  );

  if (embedded) {
    return meta;
  }

  return <footer className="site-footer site-footer--compact">{meta}</footer>;
}
