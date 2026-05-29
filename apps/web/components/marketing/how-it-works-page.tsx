import { ProcessSection } from "@/components/marketing/process-section";
import { MarketingPageShell } from "@/components/marketing/marketing-page-shell";
import { ARCHETYPES, HEALTH_DIMENSIONS } from "@/lib/marketing-content";

export function HowItWorksPage() {
  return (
    <MarketingPageShell className="how-it-works-page">
      <ProcessSection />

      <section className="block" id="dimensions">
        <div className="wrap-narrow">
          <div className="section-head">
            <div className="ses">{"// YOUR FINANCIAL HEALTH"}</div>
            <h2>
              Eight dimensions. <em>One honest picture.</em>
            </h2>
            <p className="lede">
              The sample report on the home page is a slice of this. Your full
              report scores each dimension from your actual narrations.
            </p>
          </div>
          <div className="health-grid">
            {HEALTH_DIMENSIONS.map((dim) => (
              <div key={dim.name} className="health-card">
                <div className="health-card-name">{dim.name}</div>
                <div className="health-card-desc">{dim.description}</div>
                <div className="health-card-example">
                  <span className="health-card-example-label">Example:</span>{" "}
                  {dim.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="personas">
        <div className="wrap-narrow">
          <div className="section-head">
            <div className="ses">{"// WHO IT'S FOR"}</div>
            <h2>
              Built for <em>how Indians actually earn.</em>
            </h2>
          </div>
          <div className="archetype-grid">
            {ARCHETYPES.map((archetype) => (
              <div key={archetype.name} className="archetype-card">
                <div className="archetype-icon">{archetype.icon}</div>
                <div className="archetype-name">{archetype.name}</div>
                <div className="archetype-situation">{archetype.situation}</div>
                <p className="archetype-oneline">{archetype.healthGap}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
