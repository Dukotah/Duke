"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AuditResults from "@/components/AuditResults";

interface AuditData {
  url: string;
  score: number;
  fetchTime?: string;
  metrics: {
    fcp: { value: string; score: number | null; title: string };
    lcp: { value: string; score: number | null; title: string };
    tbt: { value: string; score: number | null; title: string };
    cls: { value: string; score: number | null; title: string };
    si:  { value: string; score: number | null; title: string };
    tti: { value: string; score: number | null; title: string };
  };
  opportunities: {
    title?: string;
    description?: string;
    displayValue?: string;
    score?: number | null;
  }[];
}

function AuditPageInner() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url");
  const [url, setUrl] = useState(urlParam ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AuditData | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Sync the input when the ?url= query param changes — done during render
  // (React's recommended pattern) rather than in an effect, which avoids the
  // cascading-render lint warning and an extra paint.
  const [prevUrlParam, setPrevUrlParam] = useState(urlParam);
  if (urlParam !== prevUrlParam) {
    setPrevUrlParam(urlParam);
    if (urlParam) setUrl(urlParam);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Audit failed. Please try again.");
      } else {
        setData(json);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--ink-900)] text-white" suppressHydrationWarning>
      <Nav />

      {/* Hero */}
      <section className="grain relative pt-32 pb-16 px-6 text-center overflow-hidden">
        <div
          className="aurora animate-drift"
          style={{ top: "-10%", left: "20%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(232,133,58,0.22), transparent 65%)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="eyebrow inline-block glass-dark text-[var(--copper-300)] px-4 py-1.5 rounded-full mb-6">
            Free Tool
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 leading-[1.05]">
            How fast is<br />
            <span className="text-gradient-copper">your website?</span>
          </h1>
          <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto" style={{ fontFamily: "var(--font-body)" }}>
            A slow site costs you customers. Enter your URL to get a free Google
            PageSpeed audit in seconds — no signup required.
          </p>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="yourwebsite.com"
              className="flex-1 bg-white/5 border border-white/15 rounded-full px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-[var(--copper-500)] focus:ring-2 focus:ring-[var(--copper-500)]/25 transition text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="btn-copper disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-7 py-3.5 rounded-full text-sm whitespace-nowrap"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {loading ? "Analyzing…" : "Run Audit"}
            </button>
          </form>

          {error && (
            <div className="mt-5 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3 text-red-400 text-sm max-w-xl mx-auto">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Loading state */}
      {loading && (
        <section className="px-6 pb-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-[var(--copper-500)] border-t-transparent rounded-full animate-spin" />
              <p className="text-zinc-400 text-sm">Running PageSpeed analysis — this takes about 15 seconds…</p>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {data && (
        <section ref={resultsRef} className="px-6 pb-24">
          <div className="max-w-2xl mx-auto">
            <AuditResults data={data} />
          </div>
        </section>
      )}

      {/* How it works — only show when no results */}
      {!data && !loading && (
        <section className="px-6 pb-24">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-center text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-8">
              What You&apos;ll Get
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  icon: "⚡",
                  title: "Performance Score",
                  desc: "Google's 0–100 score used in search rankings",
                },
                {
                  icon: "📊",
                  title: "Core Web Vitals",
                  desc: "FCP, LCP, CLS, TBT — the metrics Google actually measures",
                },
                {
                  icon: "🔧",
                  title: "Top Issues",
                  desc: "Specific problems ranked by how much they're hurting you",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center"
                >
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
                  <p className="text-zinc-500 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
              <p className="text-zinc-400 text-sm">
                Results are powered by{" "}
                <span className="text-white font-medium">Google PageSpeed Insights</span>
                {" "}— the same tool Google uses to score sites for{" "}
                <span className="text-orange-400 font-medium">search ranking</span>.
                A score below 50 can actively hurt your visibility.
              </p>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

export default function AuditPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--ink-900)]" />}>
      <AuditPageInner />
    </Suspense>
  );
}
