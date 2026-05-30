"use client";

import { useState, useRef, useEffect, Suspense } from "react";
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
  const [url, setUrl] = useState(searchParams.get("url") ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AuditData | null>(null);
  const [pendingData, setPendingData] = useState<AuditData | null>(null);
  const [email, setEmail] = useState("");
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preUrl = searchParams.get("url");
    if (preUrl) setUrl(preUrl);
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);
    setPendingData(null);

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
        setPendingData(json);
      }
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSkipEmail() {
    setData(pendingData);
    setPendingData(null);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailSubmitting(true);
    try {
      await fetch("/api/audit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), url, auditData: pendingData }),
      });
    } catch {
      // fire-and-forget — don't block the user on email capture errors
    } finally {
      setEmailSubmitting(false);
      setData(pendingData);
      setPendingData(null);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }

  return (
    <div className="min-h-screen bg-[#18181B] text-white" suppressHydrationWarning>
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
            Free Tool
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            How Fast Is<br />
            <span className="text-orange-400">Your Website?</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-10 max-w-lg mx-auto">
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
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-7 py-3.5 rounded-full transition-colors text-sm whitespace-nowrap"
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
              <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-zinc-400 text-sm">Running PageSpeed analysis — this takes about 15 seconds…</p>
            </div>
          </div>
        </section>
      )}

      {/* Email gate */}
      {pendingData && !data && (
        <section className="px-6 pb-24">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Your results are ready</h2>
              <p className="text-zinc-400 text-sm mb-6">
                Drop your email and we&apos;ll send you a copy — plus tips on how to fix the top issues we found.
              </p>
              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@yourbusiness.com"
                  className="bg-zinc-800 border border-zinc-700 rounded-full px-5 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={emailSubmitting}
                  className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold px-7 py-3 rounded-full transition-colors text-sm"
                >
                  {emailSubmitting ? "One sec…" : "Send my results"}
                </button>
              </form>
              <button
                onClick={handleSkipEmail}
                className="mt-3 text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
              >
                No thanks, just show me the results
              </button>
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
    <Suspense fallback={<div className="min-h-screen bg-[#18181B]" />}>
      <AuditPageInner />
    </Suspense>
  );
}
