export type BenchmarkBarData = {
  id: string;
  dimension: string;
  description: string;
  youPosition: number;
  indiaPosition: number;
  globalPosition: number;
  legendYou: string;
  legendIndia: string;
  legendGlobal: string;
  insight: string;
  source: string;
};

export const BENCHMARK_BARS: BenchmarkBarData[] = [
  {
    id: "emergency-buffer",
    dimension: "Emergency buffer",
    description: "Months of expenses you can cover without income",
    youPosition: 17,
    indiaPosition: 42,
    globalPosition: 58,
    legendYou: "You: ~2 months",
    legendIndia: "India median: ~5 months",
    legendGlobal: "Global: 6–8 months",
    insight:
      "A 2-month buffer means one job loss or medical bill puts you in debt. 68% of stable households globally maintain at least 5 months liquid.",
    source:
      "Source: US Federal Reserve Survey of Consumer Finances · SEBI-NCAER 2022",
  },
  {
    id: "real-savings-rate",
    dimension: "Real savings rate",
    description: "What you actually save, net of EMIs and family transfers",
    youPosition: 23,
    indiaPosition: 46,
    globalPosition: 63,
    legendYou: "You: ~9%",
    legendIndia: "India median: ~18%",
    legendGlobal: "Global target: 20–25%",
    insight:
      "India's household savings rate is 18.4%. The global benchmark for financial resilience is 20–25%. The gap is usually not income — it's visibility.",
    source: "Source: RBI Annual Report FY24 · World Bank Global Findex 2023",
  },
  {
    id: "equity-exposure",
    dimension: "Equity exposure",
    description: "Share of your net worth in growth assets",
    youPosition: 6,
    indiaPosition: 11,
    globalPosition: 63,
    legendYou: "You: ~5%",
    legendIndia: "India median: ~9%",
    legendGlobal: "Global (age 34): ~66%",
    insight:
      "Indians hold only 5–7% of household wealth in equities. Globally, the standard at age 34 is closer to 65%. The difference, compounded over 20 years, is retirement.",
    source:
      "Source: RBI Household Balance Sheet Data · Vanguard Target Retirement Research",
  },
];
