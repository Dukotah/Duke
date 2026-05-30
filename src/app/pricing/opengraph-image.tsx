import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Pricing & Estimates — Copper Bay Tech";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const tiers = [
  { name: "Foundation", range: "$1.5k–$4k", tag: "Websites" },
  { name: "Core Ops", range: "$800–$2.5k/mo", tag: "IT Support" },
  { name: "Security", range: "$600–$12k+", tag: "Cyber + Apps" },
];

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#18181B",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M0 40 Q20 20 40 40 Q60 60 80 40' fill='none' stroke='%23F97316' stroke-width='0.8'/%3E%3C/svg%3E")` }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#F97316" }} />

        <div>
          <div style={{ display: "flex", alignItems: "center", background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 100, padding: "8px 20px", marginBottom: 28 }}>
            <span style={{ color: "#F97316", fontSize: 14, fontWeight: 600, letterSpacing: "0.1em" }}>TRANSPARENT PRICING · FLAT-FEE · NO SURPRISES</span>
          </div>
          <div style={{ fontSize: 64, fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 16 }}>
            What might <span style={{ color: "#F97316" }}>it cost?</span>
          </div>
          <div style={{ fontSize: 22, color: "rgba(255,255,255,0.5)" }}>
            4 questions · no email required · instant ballpark
          </div>
        </div>

        <div style={{ display: "flex", gap: 24, width: "100%" }}>
          {tiers.map((t, i) => (
            <div
              key={t.name}
              style={{
                flex: 1,
                background: i === 1 ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.05)",
                border: i === 1 ? "1px solid rgba(249,115,22,0.4)" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16,
                padding: "24px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 12, color: i === 1 ? "#F97316" : "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.1em" }}>{t.tag.toUpperCase()}</span>
              <span style={{ fontSize: 15, color: "rgba(255,255,255,0.6)" }}>{t.name}</span>
              <span style={{ fontSize: 28, fontWeight: 900, color: "#FFFFFF" }}>{t.range}</span>
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 32, right: 80, fontSize: 18, fontWeight: 800, color: "rgba(255,255,255,0.25)" }}>
          Copper Bay<span style={{ color: "#F97316" }}>Tech</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
