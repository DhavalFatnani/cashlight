import { LANDING_GAPS } from "@/lib/marketing-content";

export function LandingGapsSection() {
  return (
    <section className="block" id="gaps">
      <div className="wrap-narrow">
        <div className="section-head reveal">
          <div className="ses">{"// THINGS WE ACTUALLY NOTICE"}</div>
          <h2>
            Four things your money is doing <em>right now</em> that no app is
            telling you about.
          </h2>
        </div>

        <div className="gap-list-desktop reveal-stagger">
          {LANDING_GAPS.map((gap) => (
            <div key={gap.id} className={`gap-card gap-card--${gap.level}`}>
              <p className="gap-card-line">{gap.line}</p>
            </div>
          ))}
        </div>

        <div className="gap-accordion-mobile reveal-stagger">
          {LANDING_GAPS.map((gap) => (
            <details key={gap.id} className={`gap-accordion gap-accordion--${gap.level}`}>
              <summary className="gap-accordion-summary">{gap.line}</summary>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
