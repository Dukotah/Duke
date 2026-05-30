"use client";

import { useState } from "react";

export default function BlogEmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div
      className="rounded-2xl p-8 my-10"
      style={{ backgroundColor: "#18181B" }}
    >
      <h3
        className="text-lg font-bold text-white mb-2"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Get practical tech tips for Sonoma County businesses.
      </h3>
      <p
        className="text-sm text-white/50 mb-6"
        style={{ fontFamily: "var(--font-body)" }}
      >
        One email when we publish something worth reading. No spam, unsubscribe anytime.
      </p>

      {status === "success" ? (
        <p
          className="text-sm font-semibold text-[#F97316]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          You&apos;re in. We&apos;ll be in touch.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-md px-4 py-2.5 text-sm bg-white/10 text-white placeholder:text-white/30 border border-white/10 focus:outline-none focus:border-white/30"
            style={{ fontFamily: "var(--font-body)" }}
            disabled={status === "loading"}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-5 py-2.5 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors disabled:opacity-60"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p
          className="mt-3 text-xs text-red-400"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}
