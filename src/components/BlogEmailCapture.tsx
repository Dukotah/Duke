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
    <div className="rounded-2xl p-8 my-10 bg-ink-1 border border-hairline">
      <h3
        className="text-lg font-bold text-white mb-2"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Get practical tech tips for small businesses.
      </h3>
      <p
        className="text-sm text-white/50 mb-6"
        style={{ fontFamily: "var(--font-body)" }}
      >
        One email when we publish something worth reading. No spam, unsubscribe anytime.
      </p>

      <div aria-live="polite" aria-atomic="true">
        {status === "success" && (
          <p
            className="text-sm font-semibold text-copper-bright"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            You&apos;re in. We&apos;ll be in touch.
          </p>
        )}
        {status === "error" && (
          <p
            className="text-xs text-red-400"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Something went wrong. Try again.
          </p>
        )}
      </div>

      {status !== "success" && (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" noValidate>
          <label htmlFor="blog-subscribe-email" className="sr-only">
            Email address
          </label>
          <input
            id="blog-subscribe-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-md px-4 py-2.5 text-sm bg-ink-2 text-white placeholder:text-zinc-500 border border-hairline focus:outline-none focus:border-copper focus:ring-copper"
            style={{ fontFamily: "var(--font-body)" }}
            disabled={status === "loading"}
            aria-required="true"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-5 py-2.5 rounded-md text-sm font-bold text-ink-0 bg-copper hover:bg-copper-bright transition-colors disabled:opacity-60"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
}
