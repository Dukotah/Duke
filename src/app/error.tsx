"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home, Phone } from "lucide-react";
import { PHONE, PHONE_HREF } from "@/config/site";

// Route-level error boundary. Rendered inside the root layout, so it must NOT
// emit its own <html>/<body> (that's the job of global-error.tsx).
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error to the console / any attached monitoring.
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#18181B] px-6 py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.16) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-xl text-center">
        <span
          className="mb-7 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]"
          style={{
            backgroundColor: "rgba(249,115,22,0.12)",
            color: "#F97316",
            border: "1px solid rgba(249,115,22,0.28)",
            fontFamily: "var(--font-heading)",
          }}
        >
          Something went wrong
        </span>

        <h1
          className="mb-4 text-3xl font-bold text-white md:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          We hit an unexpected error.
        </h1>
        <p
          className="mx-auto mb-10 max-w-md text-pretty text-white/60"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Sorry about that — our end, not yours. Try again, head home, or give us
          a call and we&apos;ll sort it out.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#F97316] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#F97316]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ea6c0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B] sm:w-auto"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <RotateCcw size={15} />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B] sm:w-auto"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Home size={15} />
            Back to home
          </Link>
        </div>

        <a
          href={PHONE_HREF}
          className="mt-8 inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <Phone size={14} className="text-[#F97316]" />
          {PHONE}
        </a>
      </div>
    </main>
  );
}
