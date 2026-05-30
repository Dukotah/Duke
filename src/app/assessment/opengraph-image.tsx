import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Free IT Security Assessment — Copper Bay Tech";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          justifyContent: "flex-end",
          padding: "72px 80px",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M0 40 Q20 20 40 40 Q60 60 80 40' fill='none' stroke='%23F97316' stroke-width='0.8'/%3E%3C/svg%3E")` }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "#DC2626" }} />

        <div style={{ display: "flex", alignItems: "center", background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 100, padding: "8px 20px", marginBottom: 28 }}>
          <span style={{ color: "#EF4444", fontSize: 14, fontWeight: 600, letterSpacing: "0.1em" }}>FREE · NO SIGNUP REQUIRED</span>
        </div>

        <div style={{ fontSize: 64, fontWeight: 900, color: "#FFFFFF", lineHeight: 1.1, marginBottom: 24, maxWidth: 800 }}>
          How exposed is your{" "}
          <span style={{ color: "#F97316" }}>business?</span>
        </div>

        <div style={{ fontSize: 24, color: "rgba(255,255,255,0.6)", marginBottom: 48, maxWidth: 680, lineHeight: 1.5 }}>
          6 questions. 2 minutes. Get your IT security risk score and a personalized action plan — free.
        </div>

        <div style={{ display: "flex", gap: 40 }}>
          {["Passwords", "Network", "Backups", "Website", "Updates", "Offboarding"].map(label => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: "#F97316" }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{label}</span>
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 48, right: 80, fontSize: 20, fontWeight: 800, color: "rgba(255,255,255,0.3)" }}>
          Copper Bay<span style={{ color: "#F97316" }}>Tech</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
