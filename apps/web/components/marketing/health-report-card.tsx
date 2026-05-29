/** Sample health report card (Arjun K. · 51/100) — hero asset. */
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
          <div className="metric err">
            <div className="row">
              <div className="nm">Real savings rate</div>
              <div className="st">✕ LOW</div>
            </div>
            <div className="row">
              <div className="val" data-count="9.2" data-suffix="%">
                9.2%
              </div>
            </div>
            <div className="bar">
              <i data-w="46" data-delay="0.1" className="metric-bar-fill--danger" />
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
