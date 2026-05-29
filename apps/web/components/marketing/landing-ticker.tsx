import { TICKER_ITEMS } from "@/lib/marketing-content";

export function LandingTicker() {
  const track = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="ticker landing-ticker reveal" aria-label="Built for Indians managing">
      <div className="ticker-label">Built for Indians managing</div>
      <div className="ticker-viewport">
        <div className="ticker-track">
          {track.map((item, i) => (
            <span key={`${item}-${i}`} className="pill">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
