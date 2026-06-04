"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

interface CompareResult {
  url: string;
  speed: number | null;
  ssl: boolean | null;
  sslDays: number | null;
  seo: number | null;
  mobile: number | null;
  accessibility: number | null;
  error?: string;
}

function scoreColor(score: number | null) {
  if (score === null) return "#71717A";
  if (score >= 90) return "#22C55E";
  if (score >= 50) return "#F97316";
  return "#EF4444";
}

function ScoreBar({ score, label }: { score: number | null; label: string }) {
  const color = scoreColor(score);
  const pct = score ?? 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-zinc-400 text-xs">{label}</span>
        <span className="text-sm font-bold" style={{ color }}>{score ?? "—"}</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function WinnerBadge({ side }: { side: "left" | "right" | "tie" }) {
  if (side === "tie") return <span className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider">Tie</span>;
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${side === "left" ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"}`}>
      {side === "left" ? "You win" : "They win"}
    </span>
  );
}

function CompareColumn({ result, color, label }: { result: CompareResult | null; loading: boolean; color: string; label: string }) {
  return (
    <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800" style={{ borderTop: `3px solid ${color}` }}>
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color }}>{label}</p>
        <p className="text-white font-bold text-sm truncate">{result?.url ?? "—"}</p>
      </div>
      {result && (
        <div className="p-5 space-y-4">
          <ScoreBar score={result.speed} label="Speed" />
          <ScoreBar score={result.seo} label="SEO" />
          <ScoreBar score={result.mobile} label="Mobile" />
          <ScoreBar score={result.accessibility} label="Accessibility" />
          <div className="pt-2 border-t border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-xs">SSL Valid</span>
              <span className={`text-xs font-bold ${result.ssl ? "text-green-400" : "text-red-400"}`}>
                {result.ssl === null ? "—" : result.ssl ? "✓ Yes" : "✗ No"}
              </span>
            </div>
            {result.sslDays !== null && (
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-xs">SSL Expires</span>
                <span className={`text-xs font-bold ${result.sslDays < 30 ? "text-red-400" : "text-zinc-300"}`}>
                  {result.sslDays}d
                </span>
              </div>
            )}
          </div>
          {result.error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

function normalizeUrl(url: string) {
  let u = url.trim();
  if (!u.startsWith("http://") && !u.startsWith("https://")) u = "https://" + u;
  return u;
}

async function auditSite(url: string): Promise<CompareResult> {
  const results: CompareResult = { url, speed: null, ssl: null, sslDays: null, seo: null, mobile: null, accessibility: null };

  await Promise.allSettled([
    fetch("/api/audit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) })
      .then(r => r.json()).then(d => { results.speed = d.score ?? null; }),
    fetch("/api/ssl", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) })
      .then(r => r.json()).then(d => { results.ssl = d.valid ?? false; results.sslDays = d.daysUntilExpiry ?? null; }),
    fetch("/api/seo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) })
      .then(r => r.json()).then(d => { results.seo = d.score ?? null; }),
    fetch("/api/mobile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) })
      .then(r => r.json()).then(d => { results.mobile = d.mobileScore ?? null; results.accessibility = d.accessibilityScore ?? null; }),
  ]);

  return results;
}

function compareWinner(a: number | null, b: number | null): "left" | "right" | "tie" {
  if (a === null && b === null) return "tie";
  if (a === null) return "right";
  if (b === null) return "left";
  if (a > b) return "left";
  if (b > a) return "right";
  return "tie";
}

export default function CompareClient() {
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultA, setResultA] = useState<CompareResult | null>(null);
  const [resultB, setResultB] = useState<CompareResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!urlA.trim() || !urlB.trim() || loading) return;
    setLoading(true);
    setResultA(null);
    setResultB(null);

    const [a, b] = await Promise.all([
      auditSite(normalizeUrl(urlA)),
      auditSite(normalizeUrl(urlB)),
    ]);
    setResultA(a);
    setResultB(b);
    setLoading(false);
  }

  const categories: { key: keyof CompareResult; label: string }[] = [
    { key: "speed", label: "Speed" },
    { key: "seo", label: "SEO" },
    { key: "mobile", label: "Mobile" },
    { key: "accessibility", label: "Accessibility" },
  ];

  const hasResults = resultA !== null && resultB !== null;

  return (
    <div className="min-h-screen bg-[#18181B] text-white">
      <Nav />

      <section className="pt-32 pb-12 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
            Free Tool
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            Compare Your Site to{" "}
            <span className="text-orange-400">Competitors</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
            Enter two URLs and see a side-by-side breakdown — speed, SEO, mobile, SSL, and accessibility. No signup, no fluff.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 text-[10px] font-bold uppercase tracking-wider">You</span>
                <input
                  type="text"
                  value={urlA}
                  onChange={e => setUrlA(e.target.value)}
                  placeholder="yoursite.com"
                  disabled={loading}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-full pl-12 pr-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-[10px] font-bold uppercase tracking-wider">Them</span>
                <input
                  type="text"
                  value={urlB}
                  onChange={e => setUrlB(e.target.value)}
                  placeholder="competitor.com"
                  disabled={loading}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-full pl-12 pr-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !urlA.trim() || !urlB.trim()}
              className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-10 py-3.5 rounded-full transition-colors text-sm"
            >
              {loading ? "Analyzing both sites…" : "Run Comparison"}
            </button>
          </form>

          {loading && (
            <p className="text-zinc-500 text-xs mt-4">
              Running audits in parallel — speed, SSL, SEO, and mobile checks for both sites
            </p>
          )}
        </div>
      </section>

      {/* Loading skeleton */}
      {loading && (
        <section className="px-6 pb-16">
          <div className="max-w-4xl mx-auto flex gap-4">
            {[0, 1].map(i => (
              <div key={i} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3 animate-pulse">
                <div className="h-4 bg-zinc-800 rounded w-1/3" />
                <div className="h-3 bg-zinc-800 rounded w-2/3" />
                {[0, 1, 2, 3].map(j => (
                  <div key={j} className="h-8 bg-zinc-800 rounded" />
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Results */}
      {hasResults && (
        <section className="px-6 pb-16">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Scorecard overview */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800">
                <h2 className="text-white font-bold">Head-to-Head Scorecard</h2>
              </div>
              <div className="divide-y divide-zinc-800">
                {categories.map(({ key, label }) => {
                  const a = resultA[key] as number | null;
                  const b = resultB[key] as number | null;
                  const winner = compareWinner(a, b);
                  return (
                    <div key={key} className="flex items-center gap-4 px-6 py-4">
                      <span className="text-white font-semibold text-sm w-28">{label}</span>
                      <div className="flex-1 flex items-center gap-3">
                        <span className="text-sm font-bold w-8 text-right" style={{ color: scoreColor(a) }}>{a ?? "—"}</span>
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden flex justify-end">
                            <div className="h-full rounded-full transition-all" style={{ width: `${a ?? 0}%`, backgroundColor: scoreColor(a) }} />
                          </div>
                          <div className="w-px h-4 bg-zinc-700 flex-shrink-0" />
                          <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${b ?? 0}%`, backgroundColor: scoreColor(b) }} />
                          </div>
                        </div>
                        <span className="text-sm font-bold w-8" style={{ color: scoreColor(b) }}>{b ?? "—"}</span>
                      </div>
                      <div className="w-20 flex justify-end">
                        <WinnerBadge side={winner} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Side by side detail */}
            <div className="flex gap-4">
              <CompareColumn result={resultA} loading={false} color="#F97316" label="Your Site" />
              <CompareColumn result={resultB} loading={false} color="#60A5FA" label="Competitor" />
            </div>

            {/* CTA */}
            <div className="rounded-2xl p-6 text-center border border-orange-500/30" style={{ background: "linear-gradient(135deg, #18181B 0%, #1C1917 100%)" }}>
              <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">Falling behind?</p>
              <h4 className="text-white text-xl font-black mb-2">We can close the gap — fast</h4>
              <p className="text-zinc-400 text-sm mb-5 max-w-sm mx-auto">
                Copper Bay Tech specializes in rapidly improving site scores for Sonoma County businesses. Free 30-min consultation.
              </p>
              <Link
                href="/#contact"
                className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm"
              >
                Get a Free Review
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      {!hasResults && !loading && (
        <section className="px-6 pb-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6">What Gets Compared</h2>
            <div className="grid sm:grid-cols-4 gap-3">
              {[
                { icon: "⚡", label: "Speed Score", desc: "Google PageSpeed performance" },
                { icon: "🔍", label: "SEO Health", desc: "On-page optimization score" },
                { icon: "📱", label: "Mobile", desc: "Mobile responsiveness" },
                { icon: "♿", label: "Accessibility", desc: "WCAG compliance score" },
              ].map(item => (
                <div key={item.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-white font-bold text-xs mb-1">{item.label}</p>
                  <p className="text-zinc-500 text-[11px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
