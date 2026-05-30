import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Copper Bay Tech — IT & Web Development for Sonoma County";
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
        {/* Topographic pattern background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.07,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M0 40 Q20 20 40 40 Q60 60 80 40' fill='none' stroke='%23F97316' stroke-width='0.8'/%3E%3Cpath d='M0 20 Q20 0 40 20 Q60 40 80 20' fill='none' stroke='%23F97316' stroke-width='0.5'/%3E%3Cpath d='M0 60 Q20 40 40 60 Q60 80 80 60' fill='none' stroke='%23F97316' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Orange accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "#F97316",
          }}
        />

        {/* Location badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(249,115,22,0.15)",
            border: "1px solid rgba(249,115,22,0.3)",
            borderRadius: 100,
            padding: "8px 20px",
            marginBottom: 28,
          }}
        >
          <span style={{ color: "#F97316", fontSize: 14, fontWeight: 600, letterSpacing: "0.1em" }}>
            SONOMA COUNTY · NORTH BAY CALIFORNIA
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "#FFFFFF",
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: 800,
          }}
        >
          Built for local business.{" "}
          <span style={{ color: "#F97316" }}>Built to last.</span>
        </div>

        {/* Sub-headline */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
            marginBottom: 48,
            maxWidth: 680,
            lineHeight: 1.5,
          }}
        >
          Custom websites, IT support, and cybersecurity for Sonoma County businesses.
        </div>

        {/* Brand name + divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF" }}>
            Copper Bay<span style={{ color: "#F97316" }}>Tech</span>
          </div>
          <div style={{ width: 2, height: 28, background: "rgba(255,255,255,0.2)" }} />
          <div style={{ fontSize: 18, color: "rgba(255,255,255,0.4)" }}>
            copperbaytech.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
