"use client";

import { useEffect } from "react";

// Catches errors thrown in the root layout itself. Because it replaces the
// root layout when active, it must render its own <html> and <body>. Kept
// dependency-free and inline-styled so it works even if app CSS failed to load.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#18181B",
          color: "#ffffff",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <p
            style={{
              color: "#F97316",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              marginBottom: "1rem",
            }}
          >
            Copper Bay Tech
          </p>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700, margin: "0 0 1rem" }}>
            Something went wrong.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", margin: "0 0 2rem", lineHeight: 1.6 }}>
            We hit an unexpected error loading the site. Please try again, or
            call us at (707) 239-6725.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              backgroundColor: "#F97316",
              color: "#ffffff",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.875rem 1.75rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
