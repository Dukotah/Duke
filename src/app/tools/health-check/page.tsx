"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

interface SpeedData {
  url: string;
  score: number;
  metrics: {
    fcp: { value: string; score: number | null; title: string };
    lcp: { value: string; score: number | null; title: string };
    tbt: { value: string; score: number | null; title: string };
    cls: { value: string; score: number | null; title: string };
    si:  { value: string; score: number | null; title: string };
    tti: { value: string; score: number | null; title: string };
  };
  opportunities: { title?: string; displayValue?: string; score?: number | null }[];
}

interface SSLData {
  valid: boolean;
  daysUntilExpiry: number;
  expiresAt: string;
  issuer: string;
  hostname: string;
  error?: string;
}

interface SEOIssue {
  label: string;
  severity: "pass" | "warning" | "error";
  detail: string;
}

interface SEOData {
  url: string;
  score: number;
  issues: SEOIssue[];
}

interface LinkItem {
  url: string;
  status: number;
  text: string;
}

interface LinksData {
  total: number;
  broken: LinkItem[];
  redirects: Array<LinkItem & { to: string }>;
  ok: number;
}

interface MobileData {
  mobileScore: number;
  accessibilityScore: number;
  seoScore: number;
  bestPracticesScore: number;
  viewport: boolean;
  textSizeOk: boolean;
  tapTargetsOk: boolean;
}

type CheckState<T> = { status: "idle" } | { status: "loading" } | { status: "done"; data: T } | { status: "error"; message: string };

function scoreColor(score: number) {
  if (score >= 90) return "#22C55E";
  if (score >= 50) return "#F97316";
  return "#EF4444";
}

function metricDotColor(score: number | null) {
  if (score === null) return "#71717A";
  if (score >= 0.9) return "#22C55E";
  if (score >= 0.5) return "#F97316";
  return "#EF4444";
}

function ScoreCircle({ score, label, size = 110 }: { score: number; label: string; size?: number }) {
  const r = size * 0.42;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#27272A" strokeWidth={size*0.08} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.08} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={size*0.22} fontWeight="bold">{score}</text>
      </svg>
      <span className="text-xs text-zinc-400 text-center leading-tight">{label}</span>
    </div>
  );
}

function SectionCard({ title, icon, status, children }: { title: string; icon: string; status: "idle" | "loading" | "done" | "error"; children?: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
        <span className="text-xl">{icon}</span>
        <h3 className="text-white font-bold text-sm flex-1">{title}</h3>
        {status === "loading" && <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />}
        {status === "done" && <span className="text-green-400 text-xs font-semibold">Done</span>}
        {status === "error" && <span className="text-red-400 text-xs font-semibold">Failed</span>}
      </div>
      {children && <div className="p-5">{children}</div>}
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-2 py-2">
      {[...Array(3)].map((_, i) => <div key={i} className="h-3 bg-zinc-800 rounded animate-pulse" style={{ width: `${70 + i * 10}%` }} />)}
    </div>
  );
}

function SpeedResults({ state }: { state: CheckState<SpeedData> }) {
  return (
    <SectionCard title="Speed & Performance" icon="⚡" status={state.status}>
      {state.status === "loading" && <LoadingRows />}
      {state.status === "error" && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        const color = scoreColor(d.score);
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black" style={{ color }}>{d.score}</span>
              <div>
                <p className="text-white font-semibold text-sm">{d.score >= 90 ? "Fast" : d.score >= 50 ? "Needs Work" : "Slow"}</p>
                <p className="text-zinc-500 text-xs">Performance score / 100</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["fcp","lcp","tbt","cls","si","tti"] as const).map(k => {
                const m = d.metrics[k];
                return (
                  <div key={k} className="bg-[#18181B] rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: metricDotColor(m.score) }} />
                      <span className="text-zinc-500 text-[10px] uppercase tracking-wider">{k.toUpperCase()}</span>
                    </div>
                    <p className="text-white font-bold text-sm">{m.value}</p>
                  </div>
                );
              })}
            </div>
            {d.opportunities.length > 0 && (
              <div>
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">Top Issues</p>
                {d.opportunities.slice(0, 3).map((o, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 border-t border-zinc-800 first:border-0">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: metricDotColor(o.score ?? null) }} />
                    <span className="text-zinc-300 text-xs flex-1">{o.title}</span>
                    {o.displayValue && <span className="text-orange-400 text-xs font-mono">{o.displayValue}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}
    </SectionCard>
  );
}

function SSLResults({ state }: { state: CheckState<SSLData> }) {
  return (
    <SectionCard title="SSL Certificate" icon="🔒" status={state.status}>
      {state.status === "loading" && <LoadingRows />}
      {state.status === "error" && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        const ok = d.valid && !d.error;
        const expiryColor = !d.error ? d.daysUntilExpiry < 0 ? "text-red-400" : d.daysUntilExpiry < 30 ? "text-orange-400" : "text-green-400" : "text-zinc-400";
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={`text-2xl w-10 h-10 rounded-full flex items-center justify-center ${ok ? "bg-green-500/10" : "bg-red-500/10"}`}>{ok ? "✓" : "✗"}</span>
              <div>
                <p className={`font-bold text-sm ${ok ? "text-green-400" : "text-red-400"}`}>{ok ? "Certificate Valid" : "SSL Issue Detected"}</p>
                <p className="text-zinc-500 text-xs">{d.hostname}</p>
              </div>
            </div>
            {!d.error && (
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#18181B] rounded-lg p-3">
                  <p className="text-zinc-500 text-[10px] mb-1">Expires In</p>
                  <p className={`text-xl font-black ${expiryColor}`}>{d.daysUntilExpiry}d</p>
                </div>
                <div className="bg-[#18181B] rounded-lg p-3">
                  <p className="text-zinc-500 text-[10px] mb-1">Expiry Date</p>
                  <p className="text-white text-xs font-semibold">{new Date(d.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
                <div className="bg-[#18181B] rounded-lg p-3">
                  <p className="text-zinc-500 text-[10px] mb-1">Issuer</p>
                  <p className="text-white text-xs font-semibold truncate">{d.issuer || "Unknown"}</p>
                </div>
              </div>
            )}
            {d.error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{d.error}</p>}
          </div>
        );
      })()}
    </SectionCard>
  );
}

function SEOResults({ state }: { state: CheckState<SEOData> }) {
  const sevIcon = (s: SEOIssue["severity"]) => s === "pass" ? "✓" : s === "warning" ? "⚠" : "✗";
  const sevColor = (s: SEOIssue["severity"]) => s === "pass" ? "text-green-400" : s === "warning" ? "text-orange-400" : "text-red-400";
  const sevBg = (s: SEOIssue["severity"]) => s === "pass" ? "bg-green-500/10" : s === "warning" ? "bg-orange-500/10" : "bg-red-500/10";
  return (
    <SectionCard title="SEO Health" icon="🔍" status={state.status}>
      {state.status === "loading" && <LoadingRows />}
      {state.status === "error" && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        const passes = d.issues.filter(i => i.severity === "pass").length;
        const warnings = d.issues.filter(i => i.severity === "warning").length;
        const errors = d.issues.filter(i => i.severity === "error").length;
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black" style={{ color: scoreColor(d.score) }}>{d.score}</span>
              <div className="space-y-0.5">
                <p className="text-zinc-400 text-xs"><span className="text-green-400 font-semibold">{passes}</span> passed</p>
                <p className="text-zinc-400 text-xs"><span className="text-orange-400 font-semibold">{warnings}</span> warnings</p>
                <p className="text-zinc-400 text-xs"><span className="text-red-400 font-semibold">{errors}</span> errors</p>
              </div>
            </div>
            <div className="space-y-0 rounded-xl overflow-hidden border border-zinc-800">
              {d.issues.map((issue, i) => (
                <div key={i} className={`flex items-start gap-3 px-4 py-3 ${i < d.issues.length - 1 ? "border-b border-zinc-800" : ""} bg-[#18181B]`}>
                  <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${sevBg(issue.severity)} ${sevColor(issue.severity)}`}>{sevIcon(issue.severity)}</span>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-semibold">{issue.label}</p>
                    <p className="text-zinc-500 text-xs mt-0.5 break-words">{issue.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </SectionCard>
  );
}

function LinksResults({ state }: { state: CheckState<LinksData> }) {
  return (
    <SectionCard title="Broken Links" icon="🔗" status={state.status}>
      {state.status === "loading" && (
        <div className="space-y-2 py-2">
          <div className="h-3 bg-zinc-800 rounded animate-pulse w-4/5" />
          <p className="text-zinc-500 text-xs">Scanning links — up to 30 seconds…</p>
        </div>
      )}
      {state.status === "error" && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Total", value: d.total, color: "text-white" },
                { label: "OK", value: d.ok, color: "text-green-400" },
                { label: "Broken", value: d.broken.length, color: "text-red-400" },
                { label: "Redirects", value: d.redirects.length, color: "text-orange-400" },
              ].map(s => (
                <div key={s.label} className="bg-[#18181B] rounded-lg p-3 text-center">
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-zinc-500 text-[10px] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            {d.broken.length === 0 && d.redirects.length === 0 && (
              <p className="text-green-400 text-sm text-center bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">All {d.total} links are working correctly.</p>
            )}
            {d.broken.length > 0 && (
              <div className="space-y-1">
                <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">Broken</p>
                {d.broken.map((link, i) => (
                  <div key={i} className="flex items-start gap-2 bg-[#18181B] rounded-lg px-3 py-2">
                    <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">{link.status === 0 ? "ERR" : link.status}</span>
                    <p className="text-zinc-300 text-xs break-all">{link.url}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}
    </SectionCard>
  );
}

function MobileResults({ state }: { state: CheckState<MobileData> }) {
  return (
    <SectionCard title="Mobile & Accessibility" icon="📱" status={state.status}>
      {state.status === "loading" && (
        <div className="space-y-2 py-2">
          <div className="h-3 bg-zinc-800 rounded animate-pulse w-4/5" />
          <p className="text-zinc-500 text-xs">Running PageSpeed mobile analysis…</p>
        </div>
      )}
      {state.status === "error" && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        const check = (ok: boolean) => ({ icon: ok ? "✓" : "✗", color: ok ? "text-green-400" : "text-red-400", bg: ok ? "bg-green-500/10" : "bg-red-500/10" });
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ScoreCircle score={d.mobileScore} label="Mobile" size={90} />
              <ScoreCircle score={d.accessibilityScore} label="Accessibility" size={90} />
              <ScoreCircle score={d.seoScore} label="SEO" size={90} />
              <ScoreCircle score={d.bestPracticesScore} label="Best Practices" size={90} />
            </div>
            <div className="space-y-0 rounded-xl overflow-hidden border border-zinc-800">
              {[
                { label: "Viewport configured", ok: d.viewport },
                { label: "Text size legible", ok: d.textSizeOk },
                { label: "Tap targets sized correctly", ok: d.tapTargetsOk },
              ].map((c, i) => {
                const s = check(c.ok);
                return (
                  <div key={i} className={`flex items-center gap-3 px-4 py-3 bg-[#18181B] ${i < 2 ? "border-b border-zinc-800" : ""}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${s.bg} ${s.color}`}>{s.icon}</span>
                    <p className="text-white text-xs font-semibold">{c.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </SectionCard>
  );
}

type AllChecks = {
  speed: CheckState<SpeedData>;
  ssl: CheckState<SSLData>;
  seo: CheckState<SEOData>;
  links: CheckState<LinksData>;
  mobile: CheckState<MobileData>;
};

const idle: AllChecks = {
  speed: { status: "idle" }, ssl: { status: "idle" }, seo: { status: "idle" },
  links: { status: "idle" }, mobile: { status: "idle" },
};

function normalizeUrl(url: string) {
  let u = url.trim();
  if (!u.startsWith("http://") && !u.startsWith("https://")) u = "https://" + u;
  return u;
}

async function runCheck<T>(endpoint: string, url: string): Promise<T> {
  const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `${endpoint} failed`);
  return json as T;
}

export default function HealthCheckPage() {
  const [inputUrl, setInputUrl] = useState("");
  const [checks, setChecks] = useState<AllChecks>(idle);
  const [running, setRunning] = useState(false);
  const [auditedUrl, setAuditedUrl] = useState("");

  function setCheck<K extends keyof AllChecks>(key: K, state: AllChecks[K]) {
    setChecks(prev => ({ ...prev, [key]: state }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputUrl.trim() || running) return;
    const url = normalizeUrl(inputUrl);
    setAuditedUrl(url);
    setRunning(true);
    setChecks({ speed: { status: "loading" }, ssl: { status: "loading" }, seo: { status: "loading" }, links: { status: "loading" }, mobile: { status: "loading" } });

    const run = async <K extends keyof AllChecks, T>(key: K, endpoint: string, cast: (d: T) => AllChecks[K]) => {
      try {
        const data = await runCheck<T>(endpoint, url);
        setCheck(key, cast(data));
      } catch (err) {
        setCheck(key, { status: "error", message: err instanceof Error ? err.message : "Check failed" } as AllChecks[K]);
      }
    };

    await Promise.all([
      run<"speed", SpeedData>("speed", "/api/audit", d => ({ status: "done", data: d })),
      run<"ssl", SSLData>("ssl", "/api/ssl", d => ({ status: "done", data: d })),
      run<"seo", SEOData>("seo", "/api/seo", d => ({ status: "done", data: d })),
      run<"links", LinksData>("links", "/api/links", d => ({ status: "done", data: d })),
      run<"mobile", MobileData>("mobile", "/api/mobile", d => ({ status: "done", data: d })),
    ]);

    setRunning(false);
  }

  const hasResults = Object.values(checks).some(c => c.status !== "idle");

  return (
    <div className="min-h-screen bg-[#18181B] text-white">
      <Nav />

      <section className="pt-32 pb-12 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
            Free Tool
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            Full Website{" "}
            <span className="text-orange-400">Health Check</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
            Enter your URL and get a complete audit — speed, SSL, SEO, broken links, and mobile readiness — all at once. Free, no signup.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="text"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              placeholder="yourwebsite.com"
              disabled={running}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
            />
            <button
              type="submit"
              disabled={running || !inputUrl.trim()}
              className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-7 py-3.5 rounded-full transition-colors text-sm whitespace-nowrap"
            >
              {running ? "Analyzing…" : "Run Full Audit"}
            </button>
          </form>
          {running && <p className="text-zinc-500 text-xs mt-4">Running 5 checks in parallel — results appear as each one completes</p>}
        </div>
      </section>

      {hasResults && (
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto">
            {auditedUrl && <p className="text-zinc-500 text-xs text-center mb-6 break-all">Auditing: <span className="text-zinc-300">{auditedUrl}</span></p>}
            <div className="space-y-4">
              <SpeedResults state={checks.speed} />
              <SSLResults state={checks.ssl} />
              <SEOResults state={checks.seo} />
              <LinksResults state={checks.links} />
              <MobileResults state={checks.mobile} />
            </div>
            {!running && (
              <div className="mt-10 rounded-2xl p-6 text-center" style={{ border: "1px solid #F97316", background: "linear-gradient(135deg, #18181B 0%, #1C1917 100%)" }}>
                <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">Free Consultation</p>
                <h4 className="text-white text-xl font-black mb-2">Want us to fix this?</h4>
                <p className="text-zinc-400 text-sm mb-5 max-w-sm mx-auto">Copper Bay Tech can resolve most issues in under a week. Get a free 30-minute call.</p>
                <a href="/schedule" className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm">Book a Free Consultation</a>
              </div>
            )}
          </div>
        </section>
      )}

      {!hasResults && (
        <section className="px-6 pb-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6">What Gets Checked</h2>
            <div className="grid sm:grid-cols-5 gap-3">
              {[
                { icon: "⚡", label: "Speed", desc: "PageSpeed score & Core Web Vitals" },
                { icon: "🔒", label: "SSL", desc: "Certificate validity & expiry" },
                { icon: "🔍", label: "SEO", desc: "Title, meta, H1s, OG tags" },
                { icon: "🔗", label: "Links", desc: "404s and redirect chains" },
                { icon: "📱", label: "Mobile", desc: "Responsiveness & accessibility" },
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
