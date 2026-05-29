import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="site-footer site-footer--compact">
      <div className="wrap footer-meta">
        <div className="row">
          <Link href="/" className="logo" style={{ fontSize: 17 }}>
            <span className="dot" />
            Cashlight
          </Link>
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            <Link href="/#how">How it works</Link>
            <Link href="/#pricing">Pricing</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div>© 2026 Cashlight · Built in India</div>
        </div>
        <div className="disclaimer">
          Cashlight is a financial health platform, not a SEBI-registered
          investment advisor. Content is for informational purposes only.
        </div>
      </div>
    </footer>
  );
}
