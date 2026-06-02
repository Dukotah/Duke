"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Gauge, Globe, Loader2, Zap, BarChart3, Wrench, AlertCircle } from "lucide-react";
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
    if (preUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync prefilled url from query string
      setUrl(preUrl);
    }
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
      <section className="relative overflow-hidden pt-32 pb-16 px-6 text-center">
        {/* Ambient background: radial glow + faint grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(249,115,22,0.14) 0%, rgba(249,115,22,0) 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(70% 60% at 50% 0%, #000 0%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(70% 60% at 50% 0%, #000 0%, transparent 75%)",
          }}
        />

        <div className="max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/25 shadow-[0_0_0_1px_rgba(249,115,22,0.05)]">
            <Gauge size={13} strokeWidth={2.5} />
            Free Speed Tool
          </span>
          <h1 className="text-balance text-4xl sm:text-6xl font-black mb-5 leading-[1.05] tracking-tight">
            How Fast Is{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Your Website?
            </span>
          </h1>
          <p className="text-pretty text-zinc-400 text-lg leading-relaxed mb-10 max-w-lg mx-auto">
            A slow site costs you customers. Enter your URL to get a free Google
            PageSpeed audit in seconds — no signup required.
          </p>

          {/* Input form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <div className="relative flex-1 group">
              <Globe
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-orange-400"
              />
              <input
                type="text"
                inputMode="url"
                autoComplete="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yourwebsite.com"
                aria-label="Website URL to audit"
                className="w-full bg-zinc-900/80 border border-zinc-700 rounded-full pl-11 pr-5 py-3.5 text-[15px] text-white placeholder-zinc-500 transition-all outline-none focus:border-orange-500/70 focus:ring-4 focus:ring-orange-500/15 hover:border-zinc-600 disabled:opacity-60"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500 disabled:active:scale-100 text-white font-bold px-7 py-3.5 rounded-full transition-all text-sm whitespace-nowrap shadow-lg shadow-orange-500/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Zap size={16} strokeWidth={2.5} />
                  Run Audit
                </>
              )}
            </button>
          </form>

          {error && (
            <div
              role="alert"
              className="cbt-rise mt-5 flex items-start gap-3 bg-red-500/10 border border-red-500/25 rounded-2xl px-5 py-3.5 text-left text-red-300 text-sm max-w-xl mx-auto"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </section>

      {/* Loading state — skeleton preview of the report */}
      {loading && (
        <section className="px-6 pb-16">
          <div className="max-w-2xl mx-auto cbt-rise">
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 shadow-xl shadow-black/20">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="cbt-skeleton h-32 w-32 rounded-full shrink-0" />
                <div className="flex-1 w-full space-y-3">
                  <div className="cbt-skeleton h-3 w-2/3 rounded-full" />
                  <div className="cbt-skeleton h-5 w-1/2 rounded-full" />
                  <div className="cbt-skeleton h-3 w-full rounded-full" />
                  <div className="cbt-skeleton h-3 w-4/5 rounded-full" />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="cbt-skeleton h-20 rounded-xl" />
                ))}
              </div>
            </div>
            <p className="mt-6 flex items-center justify-center gap-2 text-zinc-400 text-sm">
              <Loader2 size={15} className="animate-spin text-orange-400" />
              Running PageSpeed analysis — this takes about 15 seconds…
            </p>
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
          <div className="max-w-2xl mx-auto cbt-rise">
            <AuditResults data={data} />
          </div>
        </section>
      )}

      {/* How it works — only show when no results */}
      {!data && !loading && (
        <section className="px-6 pb-24">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-center text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-8">
              What You&apos;ll Get
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  Icon: Zap,
                  title: "Performance Score",
                  desc: "Google's 0–100 score used in search rankings",
                },
                {
                  Icon: BarChart3,
                  title: "Core Web Vitals",
                  desc: "FCP, LCP, CLS, TBT — the metrics Google actually measures",
                },
                {
                  Icon: Wrench,
                  title: "Top Issues",
                  desc: "Specific problems ranked by how much they're hurting you",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="group bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 text-center transition-all duration-200 hover:border-orange-500/30 hover:bg-zinc-900 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30"
                >
                  <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20 transition-colors group-hover:bg-orange-500/15">
                    <item.Icon size={20} strokeWidth={2.25} />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1.5">{item.title}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 relative overflow-hidden bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 text-center">
              <p className="text-pretty text-zinc-400 text-sm leading-relaxed">
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
