"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type MarketingNavProps = {
  /** Show amber “Join waitlist” CTA (default true). */
  showCta?: boolean;
};

export function MarketingNav({ showCta = true }: MarketingNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`top${scrolled ? " scrolled" : ""}`} id="topnav">
      <div className="inner">
        <div className="nav-brand">
          <Link href="/" className="logo">
            <span className="dot" />
            Cashlight
          </Link>
        </div>
        <div className="nav-links">
          <Link href="/how-it-works">How it works</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
        </div>
        {showCta ? (
          <Link href="/#cta" className="nav-cta">
            Join waitlist
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
