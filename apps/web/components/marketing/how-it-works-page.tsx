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
          </div>
          <div className="health-grid">
            {HEALTH_DIMENSIONS.map((dim) => (
              <div key={dim.name} className="health-card">
                <div className="health-card-name">{dim.name}</div>
                <p className="health-card-line">{dim.line}</p>
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
                <p className="archetype-line">{archetype.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingPageShell>
  );
}
