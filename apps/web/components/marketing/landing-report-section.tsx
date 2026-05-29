import { HealthReportCard } from "@/components/marketing/health-report-card";

export function LandingReportSection() {
  return (
    <section className="block landing-report-section" id="report">
      <div className="wrap-narrow">
        <div className="section-head reveal">
          <div className="ses">{"// WHAT YOU GET, IN ONE LOOK"}</div>
          <h2>
            Not a dashboard. A <em>verdict.</em>
          </h2>
          <p className="lede">
            Upload your statements. Cashlight reads every line — every UPI string,
            every EMI, every transfer to your parents — and hands you one honest
            health report. A grade, eight numbers, and exactly why each one is what
            it is.
          </p>
        </div>
        <div className="landing-report-card-wrap reveal">
          <HealthReportCard />
        </div>
        <p className="report-sample-caption reveal">
          Sample report. Yours takes about 90 seconds.
        </p>
      </div>
    </section>
  );
}
