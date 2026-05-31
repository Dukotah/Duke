"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SpeedData {
  url: string;
  score: number;
  screenshotUrl?: string | null;
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

type CheckState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; data: T }
  | { status: "error"; message: string };

type AllChecks = {
  speed: CheckState<SpeedData>;
  ssl:   CheckState<SSLData>;
  seo:   CheckState<SEOData>;
  links: CheckState<LinksData>;
  mobile: CheckState<MobileData>;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 90) return "#22C55E";
  if (score >= 50) return "#F97316";
  return "#EF4444";
}

function scoreGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 50) return "D";
  return "F";
}

function scoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 70) return "Fair";
  if (score >= 50) return "Needs Work";
  return "Critical Issues";
}

function metricDotColor(score: number | null) {
  if (score === null) return "#71717A";
  if (score >= 0.9) return "#22C55E";
  if (score >= 0.5) return "#F97316";
  return "#EF4444";
}

function normalizeUrl(url: string) {
  let u = url.trim();
  if (!u.startsWith("http://") && !u.startsWith("https://")) u = "https://" + u;
  return u;
}

function extractDomain(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

async function runCheck<T>(endpoint: string, url: string): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `${endpoint} failed`);
  return json as T;
}

/** Compute composite score 0–100 from all available checks */
function computeComposite(checks: AllChecks): number | null {
  const speed  = checks.speed.status  === "done" ? checks.speed.data.score   : null;
  const seo    = checks.seo.status    === "done" ? checks.seo.data.score      : null;
  const mobile = checks.mobile.status === "done" ? checks.mobile.data.mobileScore : null;
  const ssl    = checks.ssl.status    === "done"
    ? (checks.ssl.data.valid && !checks.ssl.data.error ? 100 : 0)
    : null;
  const links  = checks.links.status  === "done"
    ? Math.max(0, 100 - checks.links.data.broken.length * 10)
    : null;

  // Need at least performance to show score
  if (speed === null) return null;

  const weights: Array<[number | null, number]> = [
    [speed,  0.40],
    [seo,    0.25],
    [mobile, 0.20],
    [ssl,    0.10],
    [links,  0.05],
  ];

  let totalWeight = 0;
  let weightedSum = 0;
  for (const [val, w] of weights) {
    if (val !== null) {
      weightedSum += val * w;
      totalWeight += w;
    }
  }
  if (totalWeight === 0) return null;
  return Math.round(weightedSum / totalWeight);
}

// ── Small reusable UI pieces ──────────────────────────────────────────────────

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const r = size * 0.41;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Score: ${score}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#27272A" strokeWidth={size * 0.09} />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color}
        strokeWidth={size * 0.09}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      <text x={size/2} y={size/2 - 4} textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize={size * 0.28} fontWeight="bold">{score}</text>
      <text x={size/2} y={size/2 + size * 0.19} textAnchor="middle" dominantBaseline="central"
        fill="#71717A" fontSize={size * 0.1}>/100</text>
    </svg>
  );
}

function SmallScoreRing({ score, label }: { score: number; label: string }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={72} height={72} viewBox="0 0 72 72">
        <circle cx={36} cy={36} r={r} fill="none" stroke="#27272A" strokeWidth={7} />
        <circle cx={36} cy={36} r={r} fill="none" stroke={color}
          strokeWidth={7} strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 36 36)" />
        <text x={36} y={36} textAnchor="middle" dominantBaseline="central"
          fill={color} fontSize={15} fontWeight="bold">{score}</text>
      </svg>
      <span className="text-[10px] text-zinc-400 text-center leading-tight">{label}</span>
    </div>
  );
}

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${ok ? "bg-green-500" : "bg-red-500"}`}
    />
  );
}

function SeverityBadge({ severity }: { severity: SEOIssue["severity"] }) {
  const map = {
    pass:    { bg: "bg-green-500/10",  text: "text-green-400",  icon: "✓" },
    warning: { bg: "bg-orange-500/10", text: "text-orange-400", icon: "!" },
    error:   { bg: "bg-red-500/10",    text: "text-red-400",    icon: "✗" },
  };
  const s = map[severity];
  return (
    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0 mt-0.5 ${s.bg} ${s.text}`}>
      {s.icon}
    </span>
  );
}

function LoadingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 py-1">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-3 bg-zinc-800 rounded-full animate-pulse" style={{ width: `${50 + (i * 15) % 45}%` }} />
      ))}
    </div>
  );
}

function PanelCard({ id, title, icon, statusBadge, children }: {
  id?: string;
  title: string;
  icon: string;
  statusBadge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden print:border-zinc-300 print:bg-white print:rounded-lg">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-zinc-800 print:border-zinc-200">
        <span className="text-lg">{icon}</span>
        <h3 className="text-white font-bold text-sm flex-1 print:text-zinc-900">{title}</h3>
        {statusBadge}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Business impact callout ───────────────────────────────────────────────────

function ImpactCallout({ stat, source }: { stat: string; source: string }) {
  return (
    <div className="mt-3 bg-orange-500/5 border border-orange-500/20 rounded-xl px-4 py-3 flex gap-3 items-start print:bg-orange-50 print:border-orange-200">
      <span className="text-orange-400 text-base flex-shrink-0 mt-0.5">📊</span>
      <p className="text-orange-300 text-xs leading-relaxed print:text-orange-700">
        <span className="font-semibold">Industry benchmark: </span>
        {stat}{" "}
        <span className="text-orange-500/70 text-[10px]">({source})</span>
      </p>
    </div>
  );
}

// ── KPI Summary Tile ──────────────────────────────────────────────────────────

function KpiTile({ label, icon, state, score, status, href }: {
  label: string;
  icon: string;
  state: "idle" | "loading" | "done" | "error";
  score?: number | null;
  status?: "pass" | "fail" | null;
  href: string;
}) {
  const content = () => {
    if (state === "loading") return <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />;
    if (state === "error")   return <span className="text-red-400 text-lg font-black">!</span>;
    if (state === "idle")    return <span className="text-zinc-600 text-xs">—</span>;
    if (score !== undefined && score !== null) {
      return <span className="text-xl font-black" style={{ color: scoreColor(score) }}>{score}</span>;
    }
    if (status !== null && status !== undefined) {
      return <StatusDot ok={status === "pass"} />;
    }
    return null;
  };

  return (
    <a
      href={href}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center flex flex-col items-center gap-1.5 hover:border-orange-500/40 transition-colors cursor-pointer no-underline print:border-zinc-200"
    >
      <span className="text-base">{icon}</span>
      <div className="min-h-[1.75rem] flex items-center justify-center">{content()}</div>
      <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">{label}</span>
    </a>
  );
}

// ── Dashboard Sections ────────────────────────────────────────────────────────

function PerformancePanel({ state }: { state: CheckState<SpeedData> }) {
  const statusBadge = state.status === "loading"
    ? <div className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    : state.status === "done"
    ? <span className="text-green-400 text-xs font-semibold">Done</span>
    : state.status === "error"
    ? <span className="text-red-400 text-xs font-semibold">Failed</span>
    : null;

  return (
    <PanelCard id="section-speed" title="Speed & Performance" icon="⚡" statusBadge={statusBadge}>
      {state.status === "idle"   && <p className="text-zinc-500 text-sm">Run a scan to see results.</p>}
      {state.status === "loading" && <LoadingSkeleton rows={5} />}
      {state.status === "error"  && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        const isGood = d.score >= 90;
        const isBad  = d.score < 50;
        return (
          <div className="space-y-5">
            {/* Score + screenshot */}
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <ScoreRing score={d.score} size={100} />
                <div>
                  <p className="text-white font-black text-lg" style={{ color: scoreColor(d.score) }}>
                    {scoreLabel(d.score)}
                  </p>
                  <p className="text-zinc-500 text-xs">Google PageSpeed (mobile)</p>
                  {isGood && <p className="text-green-400 text-xs mt-1 font-medium">Fast load — keeps visitors engaged</p>}
                  {isBad  && <p className="text-red-400 text-xs mt-1 font-medium">Visitors are likely bouncing</p>}
                </div>
              </div>
              {d.screenshotUrl && (
                <div className="ml-auto flex-shrink-0">
                  <p className="text-zinc-500 text-[10px] mb-1 uppercase tracking-wide">Site Screenshot</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={d.screenshotUrl}
                    alt="Site screenshot captured by Lighthouse"
                    className="w-24 h-auto rounded-lg border border-zinc-700 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Core Web Vitals grid */}
            <div>
              <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider mb-2">Core Web Vitals</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(["fcp","lcp","tbt","cls","si","tti"] as const).map(k => {
                  const m = d.metrics[k];
                  const titles: Record<string, string> = {
                    fcp: "First Contentful Paint",
                    lcp: "Largest Contentful Paint",
                    tbt: "Total Blocking Time",
                    cls: "Cumulative Layout Shift",
                    si:  "Speed Index",
                    tti: "Time to Interactive",
                  };
                  return (
                    <div key={k} className="bg-[#18181B] rounded-lg p-2.5 print:bg-zinc-50 print:border print:border-zinc-200">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: metricDotColor(m.score) }} />
                        <span className="text-zinc-500 text-[9px] uppercase tracking-wider">{k.toUpperCase()}</span>
                      </div>
                      <p className="text-white font-bold text-sm leading-tight">{m.value}</p>
                      <p className="text-zinc-600 text-[9px] mt-0.5 leading-tight">{titles[k]}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Opportunities */}
            {d.opportunities.length > 0 && (
              <div>
                <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider mb-2">Top Opportunities to Fix</p>
                <div className="space-y-0 rounded-xl overflow-hidden border border-zinc-800 print:border-zinc-200">
                  {d.opportunities.slice(0, 4).map((o, i) => (
                    <div key={i} className={`flex items-center gap-3 px-4 py-3 bg-[#18181B] print:bg-white ${i < d.opportunities.length - 1 ? "border-b border-zinc-800 print:border-zinc-200" : ""}`}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: metricDotColor(o.score ?? null) }} />
                      <span className="text-zinc-300 text-xs flex-1 print:text-zinc-700">{o.title}</span>
                      {o.displayValue && <span className="text-orange-400 text-xs font-mono">{o.displayValue}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Business impact */}
            {isBad && (
              <ImpactCallout
                stat="A 1-second delay in page load time can reduce conversions by ~7%, and 53% of mobile visitors abandon a page that takes longer than 3 seconds to load."
                source="Google / Akamai research"
              />
            )}
            {!isGood && !isBad && (
              <ImpactCallout
                stat="Pages that load in 1–3 seconds see 3× better engagement than those taking 5+ seconds. Even a half-second improvement can lift conversions."
                source="Google benchmarks"
              />
            )}

            {/* What CBT fixes */}
            {!isGood && (
              <div className="bg-[#18181B] rounded-xl px-4 py-3 border-l-2 border-orange-500 print:bg-orange-50">
                <p className="text-orange-400 text-xs font-bold uppercase tracking-wide mb-1">What a new Copper Bay Tech site delivers</p>
                <ul className="text-zinc-400 text-xs space-y-0.5 print:text-zinc-600">
                  <li>• Modern Next.js / static delivery — 90+ scores standard</li>
                  <li>• Optimized images, lazy loading, minimal JavaScript</li>
                  <li>• Global CDN so pages load fast everywhere</li>
                </ul>
              </div>
            )}
          </div>
        );
      })()}
    </PanelCard>
  );
}

function SecurityPanel({ state }: { state: CheckState<SSLData> }) {
  const statusBadge = state.status === "loading"
    ? <div className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    : state.status === "done"
    ? <span className="text-green-400 text-xs font-semibold">Done</span>
    : state.status === "error"
    ? <span className="text-red-400 text-xs font-semibold">Failed</span>
    : null;

  return (
    <PanelCard id="section-ssl" title="Security & SSL Certificate" icon="🔒" statusBadge={statusBadge}>
      {state.status === "idle"    && <p className="text-zinc-500 text-sm">Run a scan to see results.</p>}
      {state.status === "loading" && <LoadingSkeleton rows={3} />}
      {state.status === "error"   && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        const ok = d.valid && !d.error;
        const expiryUrgent = !d.error && d.daysUntilExpiry < 30;
        const expired      = !d.error && d.daysUntilExpiry < 0;
        return (
          <div className="space-y-4">
            {/* Status row */}
            <div className="flex items-center gap-3">
              <span className={`text-xl w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${ok ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                {ok ? "✓" : "✗"}
              </span>
              <div>
                <p className={`font-bold text-sm ${ok ? "text-green-400" : "text-red-400"}`}>
                  {ok ? "Certificate Valid & Active" : expired ? "Certificate EXPIRED" : "SSL Issue Detected"}
                </p>
                <p className="text-zinc-500 text-xs">{d.hostname}</p>
              </div>
            </div>

            {!d.error && (
              <div className="grid grid-cols-3 gap-2">
                <div className={`rounded-lg p-3 ${expired ? "bg-red-500/10" : expiryUrgent ? "bg-orange-500/10" : "bg-[#18181B]"} print:bg-zinc-50`}>
                  <p className="text-zinc-500 text-[10px] mb-1">Expires In</p>
                  <p className={`text-xl font-black ${expired ? "text-red-400" : expiryUrgent ? "text-orange-400" : "text-green-400"}`}>
                    {d.daysUntilExpiry}d
                  </p>
                </div>
                <div className="bg-[#18181B] rounded-lg p-3 print:bg-zinc-50">
                  <p className="text-zinc-500 text-[10px] mb-1">Expires</p>
                  <p className="text-white text-xs font-semibold">
                    {new Date(d.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
                  </p>
                </div>
                <div className="bg-[#18181B] rounded-lg p-3 print:bg-zinc-50">
                  <p className="text-zinc-500 text-[10px] mb-1">Issuer</p>
                  <p className="text-white text-xs font-semibold truncate">{d.issuer || "Unknown"}</p>
                </div>
              </div>
            )}

            {d.error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-xs">{d.error}</p>
              </div>
            )}

            {/* Business context */}
            {!ok && (
              <ImpactCallout
                stat="Browsers display 'Not Secure' warnings for sites without valid SSL — over 80% of users leave immediately when they see this warning."
                source="Google/GlobalSign research"
              />
            )}
            {expiryUrgent && !expired && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3">
                <p className="text-orange-400 text-xs font-semibold">Certificate expires in {d.daysUntilExpiry} days — renewal needed soon.</p>
              </div>
            )}

            {/* Plain-English explanation */}
            <div className="bg-[#18181B] rounded-xl px-4 py-3 border-l-2 border-zinc-700 print:bg-zinc-50 print:border-zinc-300">
              <p className="text-zinc-400 text-xs leading-relaxed print:text-zinc-600">
                {ok
                  ? "Your SSL certificate is active — visitors see the padlock and their data is encrypted. This is a baseline requirement for Google rankings and customer trust."
                  : "Without a valid SSL certificate, Google Chrome and other browsers warn visitors your site is unsafe. This kills conversions and can harm search rankings."
                }
              </p>
            </div>
          </div>
        );
      })()}
    </PanelCard>
  );
}

function SEOPanel({ state }: { state: CheckState<SEOData> }) {
  const statusBadge = state.status === "loading"
    ? <div className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    : state.status === "done"
    ? <span className="text-green-400 text-xs font-semibold">Done</span>
    : state.status === "error"
    ? <span className="text-red-400 text-xs font-semibold">Failed</span>
    : null;

  return (
    <PanelCard id="section-seo" title="SEO Health" icon="🔍" statusBadge={statusBadge}>
      {state.status === "idle"    && <p className="text-zinc-500 text-sm">Run a scan to see results.</p>}
      {state.status === "loading" && <LoadingSkeleton rows={6} />}
      {state.status === "error"   && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        const errors   = d.issues.filter(i => i.severity === "error").length;
        const warnings = d.issues.filter(i => i.severity === "warning").length;
        const passes   = d.issues.filter(i => i.severity === "pass").length;
        const hasProblems = errors > 0 || warnings > 0;
        return (
          <div className="space-y-4">
            {/* Score + summary counts */}
            <div className="flex items-center gap-5 flex-wrap">
              <ScoreRing score={d.score} size={90} />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-zinc-400 text-xs"><span className="text-white font-bold">{passes}</span> checks passed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-zinc-400 text-xs"><span className="text-white font-bold">{warnings}</span> warnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-zinc-400 text-xs"><span className="text-white font-bold">{errors}</span> errors</span>
                </div>
              </div>
            </div>

            {/* Issue list */}
            <div className="rounded-xl overflow-hidden border border-zinc-800 print:border-zinc-200">
              {d.issues.map((issue, i) => (
                <div key={i} className={`flex items-start gap-3 px-4 py-3 bg-[#18181B] print:bg-white ${i < d.issues.length - 1 ? "border-b border-zinc-800 print:border-zinc-200" : ""}`}>
                  <SeverityBadge severity={issue.severity} />
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-xs font-semibold print:text-zinc-900">{issue.label}</p>
                    <p className="text-zinc-500 text-xs mt-0.5 break-words print:text-zinc-600">{issue.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Business impact */}
            {hasProblems && (
              <ImpactCallout
                stat="75% of users never scroll past the first page of Google results. Missing title tags, meta descriptions, and H1s directly reduce your search visibility."
                source="HubSpot / Moz"
              />
            )}

            {/* Plain-English explanation */}
            <div className="bg-[#18181B] rounded-xl px-4 py-3 border-l-2 border-zinc-700 print:bg-zinc-50 print:border-zinc-300">
              <p className="text-zinc-400 text-xs leading-relaxed print:text-zinc-600">
                These tags are what Google reads to understand and rank your pages.
                {hasProblems
                  ? " The issues above are preventing this site from appearing in relevant searches — that's potential customers you're invisible to."
                  : " Your on-page SEO foundations are solid — a great base for content and ranking."
                }
              </p>
            </div>

            {hasProblems && (
              <div className="bg-[#18181B] rounded-xl px-4 py-3 border-l-2 border-orange-500 print:bg-orange-50">
                <p className="text-orange-400 text-xs font-bold uppercase tracking-wide mb-1">What Copper Bay Tech builds in from day one</p>
                <ul className="text-zinc-400 text-xs space-y-0.5 print:text-zinc-600">
                  <li>• Every page gets a unique, optimized title and meta description</li>
                  <li>• Proper heading structure (H1 → H2 → H3) on every page</li>
                  <li>• Open Graph tags for clean social media previews</li>
                  <li>• Auto-generated sitemap and robots.txt</li>
                </ul>
              </div>
            )}
          </div>
        );
      })()}
    </PanelCard>
  );
}

function LinksPanel({ state }: { state: CheckState<LinksData> }) {
  const statusBadge = state.status === "loading"
    ? <div className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    : state.status === "done"
    ? <span className="text-green-400 text-xs font-semibold">Done</span>
    : state.status === "error"
    ? <span className="text-red-400 text-xs font-semibold">Failed</span>
    : null;

  return (
    <PanelCard id="section-links" title="Link Health" icon="🔗" statusBadge={statusBadge}>
      {state.status === "idle"    && <p className="text-zinc-500 text-sm">Run a scan to see results.</p>}
      {state.status === "loading" && (
        <div className="space-y-3 py-1">
          <LoadingSkeleton rows={2} />
          <p className="text-zinc-600 text-xs">Crawling links — may take up to 30 seconds…</p>
        </div>
      )}
      {state.status === "error"   && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        const allOk = d.broken.length === 0 && d.redirects.length === 0;
        return (
          <div className="space-y-4">
            {/* Stats row */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Total",     value: d.total,             color: "text-white" },
                { label: "Working",   value: d.ok,                color: "text-green-400" },
                { label: "Broken",    value: d.broken.length,     color: "text-red-400" },
                { label: "Redirects", value: d.redirects.length,  color: "text-orange-400" },
              ].map(s => (
                <div key={s.label} className="bg-[#18181B] rounded-xl p-3 text-center print:bg-zinc-50 print:border print:border-zinc-200">
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-zinc-500 text-[10px] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {allOk && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 text-center print:bg-green-50 print:border-green-200">
                <p className="text-green-400 text-sm font-semibold print:text-green-700">All {d.total} links are working correctly ✓</p>
              </div>
            )}

            {d.broken.length > 0 && (
              <div>
                <p className="text-red-400 text-[10px] font-semibold uppercase tracking-wider mb-2">
                  Broken Links ({d.broken.length})
                </p>
                <div className="space-y-1">
                  {d.broken.map((link, i) => (
                    <div key={i} className="flex items-start gap-2 bg-[#18181B] rounded-lg px-3 py-2 print:bg-zinc-50">
                      <span className="bg-red-500/10 text-red-400 text-[9px] font-black px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">
                        {link.status === 0 ? "ERR" : link.status}
                      </span>
                      <div className="min-w-0">
                        <p className="text-zinc-300 text-xs break-all print:text-zinc-700">{link.url}</p>
                        {link.text && link.text !== link.url && (
                          <p className="text-zinc-600 text-[10px]">Link text: "{link.text.slice(0, 60)}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {d.redirects.length > 0 && (
              <div>
                <p className="text-orange-400 text-[10px] font-semibold uppercase tracking-wider mb-2">
                  Redirects ({d.redirects.length})
                </p>
                <div className="space-y-1">
                  {d.redirects.map((link, i) => (
                    <div key={i} className="flex items-start gap-2 bg-[#18181B] rounded-lg px-3 py-2 print:bg-zinc-50">
                      <span className="bg-orange-500/10 text-orange-400 text-[9px] font-black px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">
                        {link.status}
                      </span>
                      <p className="text-zinc-300 text-xs break-all print:text-zinc-700">{link.url}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Business impact */}
            {d.broken.length > 0 && (
              <>
                <ImpactCallout
                  stat="404 errors signal to Google that your site is poorly maintained — this can reduce your rankings. Broken links also frustrate visitors and destroy trust."
                  source="Google Search Central / Nielsen Norman"
                />
                <div className="bg-[#18181B] rounded-xl px-4 py-3 border-l-2 border-orange-500 print:bg-orange-50">
                  <p className="text-orange-400 text-xs font-bold uppercase tracking-wide mb-1">What Copper Bay Tech delivers</p>
                  <ul className="text-zinc-400 text-xs space-y-0.5 print:text-zinc-600">
                    <li>• All links verified before launch — zero broken links at go-live</li>
                    <li>• Proper 301 redirects for any moved or removed content</li>
                    <li>• Custom 404 page to keep lost visitors on your site</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        );
      })()}
    </PanelCard>
  );
}

function MobilePanel({ state }: { state: CheckState<MobileData> }) {
  const statusBadge = state.status === "loading"
    ? <div className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    : state.status === "done"
    ? <span className="text-green-400 text-xs font-semibold">Done</span>
    : state.status === "error"
    ? <span className="text-red-400 text-xs font-semibold">Failed</span>
    : null;

  return (
    <PanelCard id="section-mobile" title="Mobile & Accessibility" icon="📱" statusBadge={statusBadge}>
      {state.status === "idle"    && <p className="text-zinc-500 text-sm">Run a scan to see results.</p>}
      {state.status === "loading" && (
        <div className="space-y-3 py-1">
          <LoadingSkeleton rows={4} />
          <p className="text-zinc-600 text-xs">Running mobile analysis…</p>
        </div>
      )}
      {state.status === "error"   && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        const mobileIssues = !d.viewport || !d.textSizeOk || !d.tapTargetsOk;
        const checks = [
          { label: "Viewport configured",    ok: d.viewport,      detail: "Required for correct display on phones" },
          { label: "Text size legible",       ok: d.textSizeOk,    detail: "Font size ≥ 16px so text is readable" },
          { label: "Tap targets sized correctly", ok: d.tapTargetsOk, detail: "Buttons ≥ 48×48px for touch usability" },
        ];
        return (
          <div className="space-y-4">
            {/* Score circles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <SmallScoreRing score={d.mobileScore}        label="Mobile" />
              <SmallScoreRing score={d.accessibilityScore} label="Accessibility" />
              <SmallScoreRing score={d.seoScore}           label="SEO (mobile)" />
              <SmallScoreRing score={d.bestPracticesScore} label="Best Practices" />
            </div>

            {/* Check list */}
            <div className="rounded-xl overflow-hidden border border-zinc-800 print:border-zinc-200">
              {checks.map((c, i) => (
                <div key={i} className={`flex items-start gap-3 px-4 py-3 bg-[#18181B] print:bg-white ${i < checks.length - 1 ? "border-b border-zinc-800 print:border-zinc-200" : ""}`}>
                  <StatusDot ok={c.ok} />
                  <div>
                    <p className="text-white text-xs font-semibold print:text-zinc-900">{c.label}</p>
                    <p className="text-zinc-500 text-xs mt-0.5 print:text-zinc-600">{c.detail}</p>
                  </div>
                  <span className={`ml-auto text-xs font-bold ${c.ok ? "text-green-400" : "text-red-400"}`}>
                    {c.ok ? "Pass" : "Fail"}
                  </span>
                </div>
              ))}
            </div>

            {/* Business impact */}
            {mobileIssues && (
              <ImpactCallout
                stat="Over 63% of all web traffic comes from mobile devices. Google uses mobile performance as its primary ranking signal (mobile-first indexing)."
                source="Statcounter / Google Search Central"
              />
            )}

            <div className="bg-[#18181B] rounded-xl px-4 py-3 border-l-2 border-zinc-700 print:bg-zinc-50 print:border-zinc-300">
              <p className="text-zinc-400 text-xs leading-relaxed print:text-zinc-600">
                {mobileIssues
                  ? "Mobile issues here mean a poor experience for the majority of your visitors — and Google is watching. These problems can depress both traffic and conversions."
                  : "Good mobile fundamentals. Your site meets baseline standards for phone display and usability."
                }
              </p>
            </div>

            {mobileIssues && (
              <div className="bg-[#18181B] rounded-xl px-4 py-3 border-l-2 border-orange-500 print:bg-orange-50">
                <p className="text-orange-400 text-xs font-bold uppercase tracking-wide mb-1">Built mobile-first at Copper Bay Tech</p>
                <ul className="text-zinc-400 text-xs space-y-0.5 print:text-zinc-600">
                  <li>• Every site we build passes mobile tests before launch</li>
                  <li>• Accessibility standards baked in (WCAG AA)</li>
                  <li>• Touch-optimized navigation and button sizing</li>
                </ul>
              </div>
            )}
          </div>
        );
      })()}
    </PanelCard>
  );
}

// ── Composite Score Header ────────────────────────────────────────────────────

function CompositeScoreHeader({ score, domain, date }: { score: number | null; domain: string; date: string }) {
  const grade = score !== null ? scoreGrade(score) : "—";
  const label = score !== null ? scoreLabel(score) : "Scanning…";
  const color = score !== null ? scoreColor(score) : "#71717A";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden print:border-zinc-300 print:rounded-lg">
      {/* Report header bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-[#18181B] print:border-zinc-200 print:bg-zinc-50">
        <div className="flex items-center gap-2">
          <span className="text-white font-black text-base tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Copper Bay<span className="text-orange-500">Tech</span>
          </span>
          <span className="text-zinc-700 text-xs hidden sm:inline">|</span>
          <span className="text-zinc-500 text-xs hidden sm:inline">Website Health Report</span>
        </div>
        <div className="text-right">
          <p className="text-zinc-400 text-xs">{domain}</p>
          <p className="text-zinc-600 text-[10px]">{date}</p>
        </div>
      </div>

      {/* Score body */}
      <div className="p-5 flex flex-col sm:flex-row items-center gap-6">
        {/* Big grade circle */}
        <div className="flex-shrink-0 text-center">
          <div
            className="w-28 h-28 rounded-full border-4 flex items-center justify-center"
            style={{ borderColor: color }}
          >
            <span className="text-5xl font-black" style={{ color }}>{grade}</span>
          </div>
          <p className="text-zinc-500 text-xs mt-2">Overall Grade</p>
        </div>

        {/* Composite ring + text */}
        <div className="flex items-center gap-5">
          {score !== null
            ? <ScoreRing score={score} size={110} />
            : (
              <div className="w-[110px] h-[110px] rounded-full border-[10px] border-zinc-800 flex items-center justify-center animate-pulse">
                <span className="text-zinc-600 text-sm">…</span>
              </div>
            )
          }
          <div>
            <p className="text-white font-black text-2xl leading-tight" style={{ color }}>{label}</p>
            <p className="text-zinc-500 text-sm mt-1">Composite health score</p>
            <p className="text-zinc-600 text-xs mt-2 max-w-xs leading-relaxed">
              Weighted average of Performance (40%), SEO (25%), Mobile (20%), Security (10%), Links (5%).
            </p>
          </div>
        </div>

        {/* Print button — hidden in print */}
        <div className="sm:ml-auto print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            🖨 Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}

// ── KPI Row ───────────────────────────────────────────────────────────────────

function KpiRow({ checks }: { checks: AllChecks }) {
  const speedScore  = checks.speed.status  === "done" ? checks.speed.data.score  : null;
  const seoScore    = checks.seo.status    === "done" ? checks.seo.data.score    : null;
  const mobileScore = checks.mobile.status === "done" ? checks.mobile.data.mobileScore : null;
  const sslPass     = checks.ssl.status    === "done"
    ? (checks.ssl.data.valid && !checks.ssl.data.error ? "pass" : "fail") as "pass" | "fail"
    : null;
  const linksScore  = checks.links.status  === "done"
    ? Math.max(0, 100 - checks.links.data.broken.length * 10)
    : null;

  return (
    <div className="grid grid-cols-5 gap-2">
      <KpiTile label="Performance" icon="⚡" state={checks.speed.status}  score={speedScore}  href="#section-speed"  />
      <KpiTile label="SEO"         icon="🔍" state={checks.seo.status}    score={seoScore}    href="#section-seo"    />
      <KpiTile label="Security"    icon="🔒" state={checks.ssl.status}    status={sslPass}    href="#section-ssl"    />
      <KpiTile label="Mobile"      icon="📱" state={checks.mobile.status} score={mobileScore} href="#section-mobile" />
      <KpiTile label="Links"       icon="🔗" state={checks.links.status}  score={linksScore}  href="#section-links"  />
    </div>
  );
}

// ── CTA Panel ────────────────────────────────────────────────────────────────

function CtaPanel({ checks }: { checks: AllChecks }) {
  const issues: string[] = [];

  if (checks.speed.status === "done" && checks.speed.data.score < 90)
    issues.push("slow load times");
  if (checks.seo.status === "done" && checks.seo.data.score < 90)
    issues.push("SEO gaps");
  if (checks.ssl.status === "done" && (!checks.ssl.data.valid || checks.ssl.data.error))
    issues.push("SSL/security issues");
  if (checks.mobile.status === "done" && checks.mobile.data.mobileScore < 80)
    issues.push("mobile experience");
  if (checks.links.status === "done" && checks.links.data.broken.length > 0)
    issues.push("broken links");

  return (
    <div
      className="rounded-2xl p-6 sm:p-8 print:border-zinc-300 print:bg-white print:rounded-lg"
      style={{ border: "1.5px solid #F97316", background: "linear-gradient(135deg, #18181B 0%, #1C1917 100%)" }}
    >
      <div className="flex flex-col sm:flex-row gap-8 items-start">
        <div className="flex-1">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-2 print:text-orange-600">
            What We&apos;d Fix — Free Consultation
          </p>
          <h4 className="text-white text-2xl font-black mb-3 leading-tight print:text-zinc-900">
            {issues.length > 0
              ? `Your site has ${issues.length} area${issues.length > 1 ? "s" : ""} we can improve.`
              : "Your site is in great shape — let's keep it that way."
            }
          </h4>
          <p className="text-zinc-400 text-sm mb-4 max-w-md leading-relaxed print:text-zinc-600">
            Copper Bay Tech builds fast, secure, mobile-first websites for Sonoma County businesses.
            We can resolve most of these issues in under a week — and build you a site that converts visitors into customers.
          </p>

          {issues.length > 0 && (
            <ul className="space-y-2 mb-5">
              {issues.map((issue, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-zinc-300 print:text-zinc-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  We fix <span className="text-white font-semibold">{issue}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-3 items-center">
            <Link
              href="/#contact"
              className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-7 py-3 rounded-full transition-colors text-sm"
            >
              Get a Free Review
            </Link>
            <a
              href="tel:+17072396725"
              className="text-zinc-400 hover:text-white text-sm transition-colors print:text-zinc-600"
            >
              📞 (707) 239-6725
            </a>
          </div>
        </div>

        <div className="flex-shrink-0 bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 print:bg-zinc-50 print:border-zinc-200">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-wider mb-3 print:text-orange-600">What you get</p>
          <ul className="space-y-2.5">
            {[
              "90+ performance score — guaranteed",
              "Mobile-first, fully responsive design",
              "SEO-optimized from day one",
              "SSL + security best practices",
              "No broken links, no redirects",
              "Local Sonoma County support",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-zinc-300 print:text-zinc-700">
                <span className="text-green-400 font-bold flex-shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-zinc-800 print:border-zinc-200">
            <p className="text-zinc-600 text-[10px] print:text-zinc-500">
              duke@copperbaytech.com · copperbaytech.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Empty / Idle State ────────────────────────────────────────────────────────

function IdleState() {
  return (
    <div className="max-w-4xl mx-auto px-6 pb-24">
      <h2 className="text-center text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-6">
        What This Report Includes
      </h2>
      <div className="grid sm:grid-cols-5 gap-3 mb-8">
        {[
          { icon: "⚡", label: "Speed Score",     desc: "Google PageSpeed + 6 Core Web Vital metrics" },
          { icon: "🔒", label: "SSL Security",     desc: "Certificate validity, expiry & issuer" },
          { icon: "🔍", label: "SEO Audit",        desc: "Title, meta, H1, OG tags, robots & canonical" },
          { icon: "🔗", label: "Link Health",      desc: "404 errors & redirect chains on your pages" },
          { icon: "📱", label: "Mobile & A11y",    desc: "Viewport, tap targets & accessibility score" },
        ].map(item => (
          <div key={item.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="text-white font-bold text-xs mb-1">{item.label}</p>
            <p className="text-zinc-500 text-[11px] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
        <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
          Enter any URL above to generate a full health report — no signup, no limits.
          Results appear as each check completes. Powered by{" "}
          <span className="text-white font-medium">Google PageSpeed Insights</span>,
          live SSL inspection, and HTML analysis.
        </p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const idle: AllChecks = {
  speed:  { status: "idle" },
  ssl:    { status: "idle" },
  seo:    { status: "idle" },
  links:  { status: "idle" },
  mobile: { status: "idle" },
};

export default function ToolsPage() {
  const [inputUrl, setInputUrl] = useState("");
  const [checks, setChecks]     = useState<AllChecks>(idle);
  const [running, setRunning]   = useState(false);
  const [auditedUrl, setAuditedUrl] = useState("");
  const [scanDate, setScanDate] = useState("");

  function setCheck<K extends keyof AllChecks>(key: K, state: AllChecks[K]) {
    setChecks(prev => ({ ...prev, [key]: state }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputUrl.trim() || running) return;
    const url = normalizeUrl(inputUrl);
    setAuditedUrl(url);
    setScanDate(new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
    setRunning(true);
    setChecks({
      speed:  { status: "loading" },
      ssl:    { status: "loading" },
      seo:    { status: "loading" },
      links:  { status: "loading" },
      mobile: { status: "loading" },
    });

    const run = async <K extends keyof AllChecks, T>(
      key: K, endpoint: string, cast: (d: T) => AllChecks[K]
    ) => {
      try {
        const data = await runCheck<T>(endpoint, url);
        setCheck(key, cast(data));
      } catch (err) {
        setCheck(key, { status: "error", message: err instanceof Error ? err.message : "Check failed" } as AllChecks[K]);
      }
    };

    await Promise.all([
      run<"speed",  SpeedData >("speed",  "/api/audit",  d => ({ status: "done", data: d })),
      run<"ssl",    SSLData   >("ssl",    "/api/ssl",    d => ({ status: "done", data: d })),
      run<"seo",    SEOData   >("seo",    "/api/seo",    d => ({ status: "done", data: d })),
      run<"links",  LinksData >("links",  "/api/links",  d => ({ status: "done", data: d })),
      run<"mobile", MobileData>("mobile", "/api/mobile", d => ({ status: "done", data: d })),
    ]);

    setRunning(false);
  }

  const hasResults = Object.values(checks).some(c => c.status !== "idle");
  const composite  = computeComposite(checks);
  const domain     = auditedUrl ? extractDomain(auditedUrl) : "";
  const allDone    = !running && hasResults;

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          body { background: white !important; color: #18181B !important; }
          .print\\:hidden { display: none !important; }
          nav, footer { display: none !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="min-h-screen bg-[#18181B] text-white">
        <Nav />

        {/* Hero / URL input */}
        <section className="pt-28 pb-10 px-6 text-center print:hidden">
          <div className="max-w-2xl mx-auto">
            <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 border border-orange-500/20">
              Free · No Signup
            </span>
            <h1 className="text-4xl sm:text-5xl font-black mb-3 leading-tight">
              Website Health{" "}
              <span className="text-orange-400">Dashboard</span>
            </h1>
            <p className="text-zinc-400 text-base mb-7 max-w-xl mx-auto">
              Enter any URL for a complete audit — performance, security, SEO, links, and mobile. 5 checks at once, results in real time.
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

            {running && (
              <p className="text-zinc-600 text-xs mt-3">
                Running 5 checks in parallel — results appear as each one completes
              </p>
            )}
          </div>
        </section>

        {/* Dashboard — shown once at least one check has run */}
        {hasResults && (
          <section className="px-4 sm:px-6 pb-16 max-w-5xl mx-auto space-y-4">
            {/* Report header + composite score */}
            <CompositeScoreHeader score={composite} domain={domain} date={scanDate} />

            {/* KPI tiles */}
            <KpiRow checks={checks} />

            {/* Detailed panels */}
            <PerformancePanel state={checks.speed} />
            <SecurityPanel    state={checks.ssl}   />
            <SEOPanel         state={checks.seo}   />
            <LinksPanel       state={checks.links} />
            <MobilePanel      state={checks.mobile} />

            {/* CTA — shown after all checks complete */}
            {allDone && <CtaPanel checks={checks} />}
          </section>
        )}

        {/* Idle state */}
        {!hasResults && <IdleState />}

        <div className="print:hidden">
          <Footer />
        </div>
      </div>
    </>
  );
}
