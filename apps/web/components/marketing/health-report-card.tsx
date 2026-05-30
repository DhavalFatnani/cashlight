/** Sample health report card (Arjun K. · 51/100) — hero asset. */

const BENCHMARK_MAX_PCT = 30;
const BENCHMARK_YOU_PCT = 9.2;

type BenchmarkNode = {
  id: string;
  label: string;
  align: "center" | "end" | "start";
  /** Visual position on the rail (may differ slightly from raw % for label clearance). */
  positionPct: number;
};

const BENCHMARK_NODES: readonly BenchmarkNode[] = [
  {
    id: "you",
    label: "You · 9.2%",
    align: "center",
    positionPct: (BENCHMARK_YOU_PCT / BENCHMARK_MAX_PCT) * 100,
  },
  {
    id: "india",
    label: "India · 18%",
    align: "center",
    positionPct: 56,
  },
  {
    id: "global",
    label: "Global · 22%",
    align: "center",
    positionPct: 76,
  },
];

export function HealthReportCard() {
  return (
    <div className="report reveal">
      <div className="report-head">
        <div className="tit">
          Cashlight <b>{"// health report"}</b> · sample
        </div>
        <div className="lights">
          <span className="live" />
          <span />
          <span />
        </div>
      </div>
      <div className="report-body">
        <div className="summary-row">
          <div className="left">
            <div className="who">Subject · 34, Bengaluru · salaried ₹14.5L/yr</div>
            <div className="name">Arjun K.</div>
          </div>
          <div className="right">
            <div className="score" data-count="51">
              51<span className="of"> / 100</span>
            </div>
            <div className="grade">
              Grade C+ · <em>needs attention</em>
            </div>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric warn">
            <div className="row">
              <div className="nm">Coverage ratio</div>
              <div className="st">⚠ TIGHT</div>
            </div>
            <div className="row">
              <div className="val" data-count="73" data-suffix="%">
                73%
              </div>
            </div>
            <div className="bar">
              <i data-w="73" data-delay="0" className="metric-bar-fill--danger" />
            </div>
          </div>
          <div className="metric warn">
            <div className="row">
              <div className="nm">Emergency buffer</div>
              <div className="st">⚠ THIN</div>
            </div>
            <div className="row">
              <div className="val" data-count="1.8" data-suffix=" mo">
                1.8 mo
              </div>
            </div>
            <div className="bar">
              <i data-w="22" data-delay="0.2" className="metric-bar-fill--danger" />
            </div>
          </div>
          <div className="metric err">
            <div className="row">
              <div className="nm">Insurance adequacy</div>
              <div className="st">✕ MIS-SOLD</div>
            </div>
            <div className="row">
              <div className="val">2 LIC · 0 term</div>
            </div>
            <div className="bar">
              <i data-w="8" data-delay="0.3" className="metric-bar-fill--muted" />
            </div>
          </div>
          <div className="metric ok">
            <div className="row">
              <div className="nm">Debt-to-income</div>
              <div className="st">✓ OK</div>
            </div>
            <div className="row">
              <div className="val" data-count="31" data-suffix="%">
                31%
              </div>
            </div>
            <div className="bar">
              <i data-w="31" data-delay="0.4" className="metric-bar-fill--ok" />
            </div>
          </div>
          <div className="metric warn">
            <div className="row">
              <div className="nm">Tax efficiency</div>
              <div className="st">⚠ UNUSED 80C</div>
            </div>
            <div className="row">
              <div className="val">₹60k/₹1.5L UNUSED 80C</div>
            </div>
            <div className="bar">
              <i data-w="40" data-delay="0.5" className="metric-bar-fill--amber" />
            </div>
          </div>
        </div>

        <div
          className="savings-benchmark"
          aria-label="Real savings rate compared to India and global medians"
        >
          <div className="savings-benchmark-label">REAL SAVINGS RATE</div>
          <div className="savings-benchmark-rail">
            <div className="savings-benchmark-rail-line" aria-hidden />
            {BENCHMARK_NODES.map((node) => (
              <div
                key={node.id}
                className={`savings-benchmark-node savings-benchmark-node--${node.id} savings-benchmark-node--align-${node.align}`}
                style={{ left: `${node.positionPct}%` }}
              >
                <span className="savings-benchmark-node-dot" />
                <span
                  className={
                    node.id === "you"
                      ? "savings-benchmark-node-label savings-benchmark-node-label--you"
                      : "savings-benchmark-node-label"
                  }
                >
                  {node.label}
                </span>
              </div>
            ))}
          </div>
          <p className="savings-benchmark-caption">
            You&apos;re saving about half of what the median Indian does.
          </p>
        </div>
      </div>
      <div className="report-footer">
        <div>
          <span className="blink" />
          Reading statements · HDFC + ICICI + Kotak
        </div>
        <div>1,284 narrations parsed</div>
      </div>
    </div>
  );
}
