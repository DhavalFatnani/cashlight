import { BENCHMARK_BARS, type BenchmarkBarData } from "@/lib/benchmark-bars";

function BenchmarkBarCard({ bar }: { bar: BenchmarkBarData }) {
  return (
    <article className="benchmark-card">
      <div className="benchmark-card-header">
        <h3 className="benchmark-card-title">{bar.dimension}</h3>
        <p className="benchmark-source">{bar.source}</p>
      </div>

      <div className="benchmark-track-wrap" aria-hidden>
        <div className="benchmark-track">
          <span
            className="benchmark-marker benchmark-marker--you"
            style={{ left: `${bar.youPosition}%` }}
          />
          <span
            className="benchmark-marker benchmark-marker--india"
            style={{ left: `${bar.indiaPosition}%` }}
          />
          <span
            className="benchmark-marker benchmark-marker--global"
            style={{ left: `${bar.globalPosition}%` }}
          />
        </div>
      </div>

      <ul className="benchmark-legend" aria-label={`${bar.dimension} comparison`}>
        <li>
          <span className="benchmark-legend-dot benchmark-legend-dot--you" />
          {bar.legendYou}
        </li>
        <li>
          <span className="benchmark-legend-dot benchmark-legend-dot--india" />
          {bar.legendIndia}
        </li>
        <li>
          <span className="benchmark-legend-dot benchmark-legend-dot--global" />
          {bar.legendGlobal}
        </li>
      </ul>

      <p className="benchmark-insight-reveal">{bar.insight}</p>
    </article>
  );
}

export function BenchmarkSection() {
  return (
    <section className="block benchmark-section" id="benchmark">
      <div className="wrap benchmark-wrap">
        <div className="benchmark-grid">
          <div className="benchmark-col-left">
            <div className="benchmark-intro reveal">
              <div className="ses">{"// where you stand"}</div>
              <h2 className="benchmark-headline">
                Here&apos;s what the <em>world</em> figured out.
                <br />
                And where most Indians actually are.
              </h2>
              <p className="benchmark-lede">
                Every Cashlight suggestion is anchored to real research — not AI
                opinion. We show you three reference points for every dimension of
                your financial health: where you are, where the median Indian is,
                and where financially stable people globally have landed. No
                judgment. Just context you&apos;ve never had before.
              </p>
              <p className="benchmark-footnote">
                As Cashlight grows, these bars will include anonymised data from
                users with your exact income and family profile — making the
                benchmark increasingly specific to people actually like you.
              </p>
            </div>
          </div>

          <div className="benchmark-col-right">
            <div className="benchmark-stack reveal-stagger">
              {BENCHMARK_BARS.map((bar) => (
                <BenchmarkBarCard key={bar.id} bar={bar} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
