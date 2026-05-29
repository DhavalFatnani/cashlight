import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          background:
            "linear-gradient(145deg, #0B0A07 0%, #16130D 45%, #100E0A 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 18,
              background:
                "linear-gradient(135deg, #ffd58a 0%, #E8AA50 60%, #b87a1c 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 12,
                background: "#080808",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 5,
                  background: "#E8AA50",
                }}
              />
            </div>
          </div>
          <span
            style={{
              fontSize: 72,
              fontWeight: 600,
              color: "#F3EBDA",
              letterSpacing: "-0.02em",
            }}
          >
            Cashlight
          </span>
        </div>
        <p
          style={{
            marginTop: 56,
            fontSize: 52,
            lineHeight: 1.15,
            color: "#E8AA50",
            maxWidth: 920,
          }}
        >
          Your money, finally understood.
        </p>
        <p
          style={{
            marginTop: 28,
            fontSize: 30,
            lineHeight: 1.4,
            color: "#C8B89A",
            maxWidth: 900,
          }}
        >
          AI-powered financial health for Indians. No commissions, no products
          to sell.
        </p>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
