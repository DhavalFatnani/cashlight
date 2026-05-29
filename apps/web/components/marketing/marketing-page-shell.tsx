import type { ReactNode } from "react";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";

type MarketingPageShellProps = {
  children: ReactNode;
  /** Extra class on the page content wrapper (e.g. `contact-page`). */
  className?: string;
  showCta?: boolean;
  /** Pin main + footer to one viewport (no page scroll). */
  fitViewport?: boolean;
};

/** Shared nav + content column + footer for marketing subpages. */
export function MarketingPageShell({
  children,
  className = "",
  showCta = true,
  fitViewport = false,
}: MarketingPageShellProps) {
  const pageClass = ["marketing-page", className].filter(Boolean).join(" ");

  if (fitViewport) {
    return (
      <>
        <MarketingNav showCta={showCta} />
        <div className="marketing-page-fit-shell">
          <div className={pageClass}>{children}</div>
          <MarketingFooter />
        </div>
      </>
    );
  }

  return (
    <>
      <MarketingNav showCta={showCta} />
      <div className={pageClass}>{children}</div>
      <MarketingFooter />
    </>
  );
}
