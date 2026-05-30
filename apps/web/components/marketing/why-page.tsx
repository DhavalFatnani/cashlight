import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { LEDGER } from "@/lib/marketing-content";

export function WhyPage() {
  return (
    <MarketingPageShell fitViewport className="why-page why-page-shell">
      <section className="block why-page-section" id="difference">
        <div className="wrap-narrow">
          <div className="section-head">
            <p className="ses">An open memo</p>
            <h1>
              Why we&apos;ll always <em>tell you the truth.</em>
            </h1>
          </div>
          <div className="memo">
            <div className="from">
              <b>From</b> &nbsp; Cashlight team
              <br />
              <b>To</b> &nbsp;&nbsp;&nbsp; Whoever is reading this
              <br />
              <b>Re</b> &nbsp;&nbsp;&nbsp; Why we&apos;re different, in plain
              language.
            </div>
            <h3>
              The <em>honest</em> part.
            </h3>
            <p className="intro">
              Free apps earn on what they sell you. We charge a subscription —
              so we only win when you find us useful.
            </p>

            <div className="ledger">
              {LEDGER.map((row) => (
                <div key={row.them} className="ledger-row">
                  <div className="them">{row.them}</div>
                  <div className="arrow">→</div>
                  <div className="us">{row.us}</div>
                </div>
              ))}
            </div>

            <div className="signoff">
              — <b>The Cashlight team</b>
            </div>
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
