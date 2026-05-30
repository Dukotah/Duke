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
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#F97316",
            }}
          />
          <span style={{ color: "#F97316", fontSize: "18px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Copper Bay Tech
          </span>
        </div>
        <div
          style={{
            color: "#FFFFFF",
            fontSize: "56px",
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: "900px",
            marginBottom: "32px",
          }}
        >
          IT & Web Development for Sonoma County
        </div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "24px", lineHeight: 1.5, maxWidth: "700px" }}>
          Custom websites, IT support, and cybersecurity for small businesses.
        </div>
        <div
          style={{
            marginTop: "48px",
            display: "flex",
            gap: "16px",
          }}
        >
          {["Petaluma", "Santa Rosa", "Sebastopol", "Sonoma"].map((city) => (
            <span
              key={city}
              style={{
                background: "rgba(249,115,22,0.15)",
                color: "#F97316",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {city}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
