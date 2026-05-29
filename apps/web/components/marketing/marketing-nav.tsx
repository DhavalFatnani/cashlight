"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

type MarketingNavProps = {
  showCta?: boolean;
  /** Landing: scroll to #cta in-page instead of navigating away */
  onJoinWaitlistClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const NAV_LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;

export function MarketingNav({
  showCta = true,
  onJoinWaitlistClick,
}: MarketingNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  const waitlistHref = onJoinWaitlistClick ? "#cta" : "/#cta";

  return (
    <nav className={`top${scrolled ? " scrolled" : ""}${menuOpen ? " nav-menu-is-open" : ""}`} id="topnav">
      <div className="inner">
        <div className="nav-brand">
          <Link
            href="/"
            className="logo"
            aria-label="Cashlight home"
            onClick={closeMenu}
          >
            <span className="dot" aria-hidden="true" />
            Cashlight
          </Link>
        </div>

        <div className="nav-links nav-desktop-only" aria-label="Site">
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        {showCta ? (
          <Link
            href={waitlistHref}
            className="nav-cta nav-desktop-only"
            onClick={onJoinWaitlistClick}
          >
            Join waitlist
          </Link>
        ) : null}

        <button
          type="button"
          className="nav-menu-toggle nav-mobile-only"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="nav-menu-toggle-bar" aria-hidden />
          <span className="nav-menu-toggle-bar" aria-hidden />
          <span className="nav-menu-toggle-bar" aria-hidden />
        </button>
      </div>

      <div
        id={menuId}
        className={`nav-menu-overlay nav-mobile-only${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
        onClick={closeMenu}
      >
        <div
          className="nav-menu-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="nav-menu-links" aria-label="Site">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-menu-link"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {showCta ? (
            <Link
              href={waitlistHref}
              className="nav-cta nav-menu-cta"
              onClick={(e) => {
                onJoinWaitlistClick?.(e);
                closeMenu();
              }}
            >
              Join waitlist
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
