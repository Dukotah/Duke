import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Free Website Health Check — Copper Bay Tech";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const checks = [
  { icon: "⚡", label: "Speed" },
  { icon: "🔒", label: "SSL" },
  { icon: "🔍", label: "SEO" },
  { icon: "🔗", label: "Links" },
  { icon: "📱", label: "Mobile" },
  { icon: "♿", label: "ADA" },
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
            <span style={{ color: "#F97316", fontSize: 14, fontWeight: 600, letterSpacing: "0.1em" }}>FREE TOOL · NO SIGNUP</span>
          </div>
          <div style={{ fontSize: 60, fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 16 }}>
            Full Website{" "}
            <span style={{ color: "#F97316" }}>Health Check</span>
          </div>
          <div style={{ fontSize: 22, color: "rgba(255,255,255,0.5)" }}>
            6 checks in parallel — enter your URL and get a complete audit instantly
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {checks.map(c => (
            <div
              key={c.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16,
                padding: "20px 24px",
                minWidth: 130,
              }}
            >
              <span style={{ fontSize: 32 }}>{c.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{c.label}</span>
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
