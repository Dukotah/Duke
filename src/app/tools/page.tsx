"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ITQuiz from "@/components/ITQuiz";
import PricingEstimator from "@/components/PricingEstimator";

// ── Types ─────────────────────────────────────────────────────────────────────

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

interface SEOIssue { label: string; severity: "pass" | "warning" | "error"; detail: string; }
interface SEOData { url: string; score: number; issues: SEOIssue[]; }

interface LinkItem { url: string; status: number; text: string; }
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

interface HeaderCheck { header: string; present: boolean; value: string; severity: "pass" | "warning" | "error"; detail: string; }
interface HeadersData { score: number; checks: HeaderCheck[]; url: string; }

interface DNSCheck { label: string; severity: "pass" | "warning" | "error"; detail: string; }
interface DNSRecord { type: string; value: string; }
interface DNSData { hostname: string; score: number; records: DNSRecord[]; checks: DNSCheck[]; }

interface TechItem { name: string; category: string; confidence: "high" | "medium" | "low"; }
interface TechData { url: string; detected: TechItem[]; categories: string[]; count: number; }

interface CrawlCheck { label: string; severity: "pass" | "warning" | "error"; detail: string; }
interface CrawlData { url: string; score: number; checks: CrawlCheck[]; }

type CheckState<T> = { status: "idle" } | { status: "loading" } | { status: "done"; data: T } | { status: "error"; message: string };

// ── Helpers ───────────────────────────────────────────────────────────────────

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

function sevIcon(s: "pass" | "warning" | "error") { return s === "pass" ? "✓" : s === "warning" ? "⚠" : "✗"; }
function sevColor(s: "pass" | "warning" | "error") { return s === "pass" ? "text-green-400" : s === "warning" ? "text-orange-400" : "text-red-400"; }
function sevBg(s: "pass" | "warning" | "error") { return s === "pass" ? "bg-green-500/10" : s === "warning" ? "bg-orange-500/10" : "bg-red-500/10"; }

function ScoreCircle({ score, label, size = 110 }: { score: number; label: string; size?: number }) {
  const r = size * 0.42;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#27272A" strokeWidth={size*0.08} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.08}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} />
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
          fill={color} fontSize={size*0.22} fontWeight="bold">{score}</text>
      </svg>
      <span className="text-xs text-zinc-400 text-center leading-tight">{label}</span>
    </div>
  );
}

function SectionCard({ title, icon, status, children }: {
  title: string; icon: string; status: "idle" | "loading" | "done" | "error"; children?: React.ReactNode;
}) {
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
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-3 bg-zinc-800 rounded animate-pulse" style={{ width: `${70 + i * 10}%` }} />
      ))}
    </div>
  );
}

function CheckList({ checks }: { checks: Array<{ label: string; severity: "pass" | "warning" | "error"; detail: string }> }) {
  return (
    <div className="space-y-0 rounded-xl overflow-hidden border border-zinc-800">
      {checks.map((c, i) => (
        <div key={i} className={`flex items-start gap-3 px-4 py-3 bg-[#18181B] ${i < checks.length - 1 ? "border-b border-zinc-800" : ""}`}>
          <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${sevBg(c.severity)} ${sevColor(c.severity)}`}>
            {sevIcon(c.severity)}
          </span>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold">{c.label}</p>
            <p className="text-zinc-500 text-xs mt-0.5 break-words">{c.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Result sections ───────────────────────────────────────────────────────────

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
        const expiryColor = !d.error
          ? d.daysUntilExpiry < 0 ? "text-red-400" : d.daysUntilExpiry < 30 ? "text-orange-400" : "text-green-400"
          : "text-zinc-400";
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={`text-2xl w-10 h-10 rounded-full flex items-center justify-center ${ok ? "bg-green-500/10" : "bg-red-500/10"}`}>
                {ok ? "✓" : "✗"}
              </span>
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
                  <p className="text-white text-xs font-semibold">
                    {new Date(d.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
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
            <CheckList checks={d.issues} />
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
              <p className="text-green-400 text-sm text-center bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                All {d.total} links are working correctly.
              </p>
            )}
            {d.broken.length > 0 && (
              <div className="space-y-1">
                <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">Broken</p>
                {d.broken.map((link, i) => (
                  <div key={i} className="flex items-start gap-2 bg-[#18181B] rounded-lg px-3 py-2">
                    <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                      {link.status === 0 ? "ERR" : link.status}
                    </span>
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
        const check = (ok: boolean) => ({
          icon: ok ? "✓" : "✗",
          color: ok ? "text-green-400" : "text-red-400",
          bg: ok ? "bg-green-500/10" : "bg-red-500/10",
        });
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

function HeadersResults({ state }: { state: CheckState<HeadersData> }) {
  return (
    <SectionCard title="Security Headers" icon="🛡️" status={state.status}>
      {state.status === "loading" && <LoadingRows />}
      {state.status === "error" && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        const passes = d.checks.filter(c => c.severity === "pass").length;
        const errors = d.checks.filter(c => c.severity === "error").length;
        const normalized = d.checks.map(c => ({ label: c.header, severity: c.severity, detail: c.detail }));
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black" style={{ color: scoreColor(d.score) }}>{d.score}</span>
              <div className="space-y-0.5">
                <p className="text-white font-semibold text-sm">{d.score >= 90 ? "Secure" : d.score >= 60 ? "Needs Hardening" : "Vulnerable"}</p>
                <p className="text-zinc-500 text-xs">{passes}/{d.checks.length} headers configured · {errors} critical missing</p>
              </div>
            </div>
            <CheckList checks={normalized} />
          </div>
        );
      })()}
    </SectionCard>
  );
}

function DNSResults({ state }: { state: CheckState<DNSData> }) {
  return (
    <SectionCard title="DNS & Email Security" icon="📡" status={state.status}>
      {state.status === "loading" && <LoadingRows />}
      {state.status === "error" && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        const byType = d.records.reduce<Record<string, string[]>>((acc, r) => {
          (acc[r.type] = acc[r.type] || []).push(r.value);
          return acc;
        }, {});
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black" style={{ color: scoreColor(d.score) }}>{d.score}</span>
              <div>
                <p className="text-white font-semibold text-sm">{d.hostname}</p>
                <p className="text-zinc-500 text-xs">{d.records.length} DNS records found</p>
              </div>
            </div>
            {Object.keys(byType).length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(byType).map(([type, vals]) => (
                  <div key={type} className="bg-[#18181B] rounded-lg p-3">
                    <p className="text-orange-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">{type}</p>
                    {vals.slice(0, 2).map((v, i) => (
                      <p key={i} className="text-zinc-300 text-[11px] truncate">{v}</p>
                    ))}
                    {vals.length > 2 && <p className="text-zinc-600 text-[10px]">+{vals.length - 2} more</p>}
                  </div>
                ))}
              </div>
            )}
            <CheckList checks={d.checks} />
          </div>
        );
      })()}
    </SectionCard>
  );
}

function TechResults({ state }: { state: CheckState<TechData> }) {
  const categoryColors: Record<string, string> = {
    CMS: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Framework: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "E-commerce": "bg-green-500/10 text-green-400 border-green-500/20",
    Analytics: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    CDN: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Hosting: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Security: "bg-red-500/10 text-red-400 border-red-500/20",
    Payments: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Web Server": "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    Library: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    "CSS Framework": "bg-pink-500/10 text-pink-400 border-pink-500/20",
    "CRM / Marketing": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    default: "bg-zinc-800 text-zinc-400 border-zinc-700",
  };

  return (
    <SectionCard title="Tech Stack" icon="🧱" status={state.status}>
      {state.status === "loading" && <LoadingRows />}
      {state.status === "error" && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        if (d.count === 0) {
          return <p className="text-zinc-500 text-sm text-center py-4">No recognizable technologies detected.</p>;
        }
        const byCategory = d.categories.reduce<Record<string, TechItem[]>>((acc, cat) => {
          acc[cat] = d.detected.filter(t => t.category === cat);
          return acc;
        }, {});
        return (
          <div className="space-y-4">
            <p className="text-zinc-500 text-xs">{d.count} technolog{d.count === 1 ? "y" : "ies"} detected</p>
            {Object.entries(byCategory).map(([cat, items]) => (
              <div key={cat}>
                <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider mb-2">{cat}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map(item => {
                    const cls = categoryColors[item.category] ?? categoryColors.default;
                    return (
                      <span key={item.name} className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cls}`}>
                        {item.name}
                        {item.confidence === "low" && <span className="opacity-50 text-[9px]">~</span>}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      })()}
    </SectionCard>
  );
}

function CrawlResults({ state }: { state: CheckState<CrawlData> }) {
  return (
    <SectionCard title="Crawlability & Indexing" icon="🗺️" status={state.status}>
      {state.status === "loading" && <LoadingRows />}
      {state.status === "error" && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        const passes = d.checks.filter(c => c.severity === "pass").length;
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black" style={{ color: scoreColor(d.score) }}>{d.score}</span>
              <div>
                <p className="text-white font-semibold text-sm">{d.score >= 80 ? "Well Configured" : d.score >= 50 ? "Needs Attention" : "Indexing Issues"}</p>
                <p className="text-zinc-500 text-xs">{passes}/{d.checks.length} checks passed</p>
              </div>
            </div>
            <CheckList checks={d.checks} />
          </div>
        );
      })()}
    </SectionCard>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type AllChecks = {
  speed: CheckState<SpeedData>;
  ssl: CheckState<SSLData>;
  seo: CheckState<SEOData>;
  links: CheckState<LinksData>;
  mobile: CheckState<MobileData>;
  headers: CheckState<HeadersData>;
  dns: CheckState<DNSData>;
  tech: CheckState<TechData>;
  crawl: CheckState<CrawlData>;
};

const idle: AllChecks = {
  speed:   { status: "idle" },
  ssl:     { status: "idle" },
  seo:     { status: "idle" },
  links:   { status: "idle" },
  mobile:  { status: "idle" },
  headers: { status: "idle" },
  dns:     { status: "idle" },
  tech:    { status: "idle" },
  crawl:   { status: "idle" },
};

function normalizeUrl(url: string) {
  let u = url.trim();
  if (!u.startsWith("http://") && !u.startsWith("https://")) u = "https://" + u;
  return u;
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

const ALL_CHECKS = [
  { icon: "⚡", label: "Speed", desc: "PageSpeed & Core Web Vitals" },
  { icon: "🔒", label: "SSL", desc: "Certificate validity & expiry" },
  { icon: "🔍", label: "SEO", desc: "Title, meta, H1s, OG tags" },
  { icon: "🔗", label: "Links", desc: "404s and redirect chains" },
  { icon: "📱", label: "Mobile", desc: "Responsiveness & accessibility" },
  { icon: "🛡️", label: "Security Headers", desc: "HSTS, CSP, clickjacking protection" },
  { icon: "📡", label: "DNS & Email", desc: "SPF, DMARC, MX, nameservers" },
  { icon: "🧱", label: "Tech Stack", desc: "CMS, CDN, analytics & frameworks" },
  { icon: "🗺️", label: "Crawlability", desc: "Sitemap, robots.txt, JSON-LD" },
];

export default function ToolsPage() {
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
    setChecks({
      speed:   { status: "loading" },
      ssl:     { status: "loading" },
      seo:     { status: "loading" },
      links:   { status: "loading" },
      mobile:  { status: "loading" },
      headers: { status: "loading" },
      dns:     { status: "loading" },
      tech:    { status: "loading" },
      crawl:   { status: "loading" },
    });

    const run = async <K extends keyof AllChecks, T>(key: K, endpoint: string, cast: (d: T) => AllChecks[K]) => {
      try {
        const data = await runCheck<T>(endpoint, url);
        setCheck(key, cast(data));
      } catch (err) {
        setCheck(key, { status: "error", message: err instanceof Error ? err.message : "Check failed" } as AllChecks[K]);
      }
    };

    await Promise.all([
      run<"speed",   SpeedData  >("speed",   "/api/audit",   d => ({ status: "done", data: d })),
      run<"ssl",     SSLData    >("ssl",     "/api/ssl",     d => ({ status: "done", data: d })),
      run<"seo",     SEOData    >("seo",     "/api/seo",     d => ({ status: "done", data: d })),
      run<"links",   LinksData  >("links",   "/api/links",   d => ({ status: "done", data: d })),
      run<"mobile",  MobileData >("mobile",  "/api/mobile",  d => ({ status: "done", data: d })),
      run<"headers", HeadersData>("headers", "/api/headers", d => ({ status: "done", data: d })),
      run<"dns",     DNSData    >("dns",     "/api/dns",     d => ({ status: "done", data: d })),
      run<"tech",    TechData   >("tech",    "/api/tech",    d => ({ status: "done", data: d })),
      run<"crawl",   CrawlData  >("crawl",   "/api/crawl",   d => ({ status: "done", data: d })),
    ]);

    setRunning(false);
  }

  const hasResults = Object.values(checks).some(c => c.status !== "idle");

  return (
    <div className="min-h-screen bg-[#18181B] text-white">
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
            Free Tools
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            Free Tools for{" "}
            <span className="text-orange-400">Your Business</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
            No signup, no catch. Run a full 9-point website audit, assess your cybersecurity risk,
            or get an instant project estimate.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "Website Health Check", anchor: "#health-check" },
              { label: "Cybersecurity Risk Quiz", anchor: "#security-quiz" },
              { label: "Project Cost Estimator", anchor: "#pricing-estimator" },
            ].map(t => (
              <a key={t.anchor} href={t.anchor}
                className="bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 text-zinc-300 hover:text-orange-400 text-xs font-semibold px-4 py-2 rounded-full transition-colors">
                {t.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Website Health Check ─────────────────────────────────────────────── */}
      <section id="health-check" className="px-6 pb-4 scroll-mt-24">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black mb-2">
            Website <span className="text-orange-400">Health Check</span>
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">
            9 checks in parallel — speed, security, SEO, DNS, tech stack, and more.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto justify-center">
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
            <p className="text-zinc-500 text-xs mt-4 text-center">
              Running 9 checks in parallel — results appear as each one completes
            </p>
          )}
        </div>
      </section>

      {/* Results */}
      {hasResults && (
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto">
            {auditedUrl && (
              <p className="text-zinc-500 text-xs text-center mb-6 break-all">
                Auditing: <span className="text-zinc-300">{auditedUrl}</span>
              </p>
            )}
            <div className="space-y-4">
              <SpeedResults   state={checks.speed}   />
              <SSLResults     state={checks.ssl}     />
              <HeadersResults state={checks.headers} />
              <SEOResults     state={checks.seo}     />
              <CrawlResults   state={checks.crawl}   />
              <DNSResults     state={checks.dns}     />
              <LinksResults   state={checks.links}   />
              <MobileResults  state={checks.mobile}  />
              <TechResults    state={checks.tech}    />
            </div>

            {!running && (
              <div className="mt-10 rounded-2xl p-6 text-center" style={{ border: "1px solid #F97316", background: "linear-gradient(135deg, #18181B 0%, #1C1917 100%)" }}>
                <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">Free Consultation</p>
                <h4 className="text-white text-xl font-black mb-2">Want us to fix this?</h4>
                <p className="text-zinc-400 text-sm mb-5 max-w-sm mx-auto">
                  Copper Bay Tech can resolve most issues in under a week. Get a free 30-minute call.
                </p>
                <a href="/#contact"
                  className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm">
                  Get a Free Review
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* What gets checked — only when idle */}
      {!hasResults && (
        <div className="px-6 pb-16">
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
              9 Checks Run Simultaneously
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
              {ALL_CHECKS.map(item => (
                <div key={item.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center col-span-1">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <p className="text-white font-bold text-[10px] mb-0.5 leading-tight">{item.label}</p>
                  <p className="text-zinc-500 text-[9px] leading-tight hidden sm:block">{item.desc}</p>
                </div>
              ))}
            </div>
            {/* Mobile: show description list */}
            <div className="sm:hidden mt-4 space-y-2">
              {ALL_CHECKS.map(item => (
                <div key={item.label} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5">
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-white font-bold text-xs">{item.label}</p>
                    <p className="text-zinc-500 text-[11px]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Cybersecurity Risk Quiz ──────────────────────────────────────────── */}
      <section id="security-quiz" className="scroll-mt-24">
        <ITQuiz />
      </section>

      {/* ── Project Cost Estimator ───────────────────────────────────────────── */}
      <section id="pricing-estimator" className="scroll-mt-24">
        <PricingEstimator />
      </section>

      <Footer />
    </div>
  );
}
