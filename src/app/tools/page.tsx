"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Loader2, ArrowRight, ShieldCheck, CheckCircle2, Mail } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ITQuiz from "@/components/ITQuiz";
import PricingEstimator from "@/components/PricingEstimator";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SpeedData {
  url: string; score: number;
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
interface SSLData { valid: boolean; daysUntilExpiry: number; expiresAt: string; issuer: string; hostname: string; error?: string; }
interface SEOIssue { label: string; severity: "pass" | "warning" | "error"; detail: string; }
interface SEOData { url: string; score: number; issues: SEOIssue[]; }
interface LinkItem { url: string; status: number; text: string; }
interface LinksData { total: number; broken: LinkItem[]; redirects: Array<LinkItem & { to: string }>; ok: number; }
interface MobileData { mobileScore: number; accessibilityScore: number; seoScore: number; bestPracticesScore: number; viewport: boolean; textSizeOk: boolean; tapTargetsOk: boolean; }
interface HeaderCheck { header: string; present: boolean; value: string; severity: "pass" | "warning" | "error"; detail: string; }
interface HeadersData { score: number; checks: HeaderCheck[]; url: string; }
interface DNSCheck { label: string; severity: "pass" | "warning" | "error"; detail: string; }
interface DNSRecord { type: string; value: string; }
interface DNSData { hostname: string; score: number; records: DNSRecord[]; checks: DNSCheck[]; }
interface TechItem { name: string; category: string; confidence: "high" | "medium" | "low"; }
interface TechData { url: string; detected: TechItem[]; categories: string[]; count: number; }
interface CrawlCheck { label: string; severity: "pass" | "warning" | "error"; detail: string; }
interface CrawlData { url: string; score: number; checks: CrawlCheck[]; }

interface HeaderCheck {
  name: string;
  present: boolean;
  value: string;
  recommendation: string;
  severity: "critical" | "warning" | "info";
}

interface HeadersData {
  score: number;
  passed: number;
  total: number;
  critical: number;
  checks: HeaderCheck[];
  url: string;
}

interface DNSCheck {
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

interface DNSData {
  score: number;
  passed: number;
  failed: number;
  total: number;
  checks: DNSCheck[];
  hostname: string;
}

interface SchemaCheck {
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}

interface SchemaData {
  score: number;
  passed: number;
  total: number;
  checks: SchemaCheck[];
  schemaTypes: string[];
  schemaCount: number;
  url: string;
}

interface ADAIssue {
  label: string;
  severity: "pass" | "warning" | "error";
  detail: string;
}

interface ADAData {
  score: number;
  issues: ADAIssue[];
}

type CheckState<T> = { status: "idle" } | { status: "loading" } | { status: "done"; data: T } | { status: "error"; message: string };

type AllChecks = {
  speed: CheckState<SpeedData>;   ssl: CheckState<SSLData>;
  seo: CheckState<SEOData>;       links: CheckState<LinksData>;
  mobile: CheckState<MobileData>; headers: CheckState<HeadersData>;
  dns: CheckState<DNSData>;       tech: CheckState<TechData>;
  crawl: CheckState<CrawlData>;
};

const idle: AllChecks = {
  speed: { status: "idle" }, ssl: { status: "idle" }, seo: { status: "idle" },
  links: { status: "idle" }, mobile: { status: "idle" }, headers: { status: "idle" },
  dns: { status: "idle" }, tech: { status: "idle" }, crawl: { status: "idle" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreColor(s: number) { return s >= 90 ? "#22C55E" : s >= 50 ? "#F97316" : "#EF4444"; }
function metricDotColor(s: number | null) {
  if (s === null) return "#71717A"; return s >= 0.9 ? "#22C55E" : s >= 0.5 ? "#F97316" : "#EF4444";
}
function sevIcon(s: "pass"|"warning"|"error") { return s==="pass"?"✓":s==="warning"?"⚠":"✗"; }
function sevColor(s: "pass"|"warning"|"error") { return s==="pass"?"text-green-400":s==="warning"?"text-orange-400":"text-red-400"; }
function sevBg(s: "pass"|"warning"|"error") { return s==="pass"?"bg-green-500/10":s==="warning"?"bg-orange-500/10":"bg-red-500/10"; }
function letterGrade(score: number) {
  if (score >= 90) return { grade: "A", label: "Excellent", color: "#22C55E" };
  if (score >= 75) return { grade: "B", label: "Good", color: "#84CC16" };
  if (score >= 60) return { grade: "C", label: "Average", color: "#F97316" };
  if (score >= 45) return { grade: "D", label: "Poor", color: "#EF4444" };
  return { grade: "F", label: "Critical", color: "#DC2626" };
}

function extractScore(checks: AllChecks): number | null {
  const scores: number[] = [];
  if (checks.speed.status === "done") scores.push(checks.speed.data.score);
  if (checks.ssl.status === "done") scores.push(checks.ssl.data.valid && !checks.ssl.data.error ? 100 : 20);
  if (checks.seo.status === "done") scores.push(checks.seo.data.score);
  if (checks.links.status === "done") {
    const d = checks.links.data;
    scores.push(d.total === 0 ? 100 : Math.max(0, 100 - d.broken.length * 25));
  }
  if (checks.mobile.status === "done") scores.push(checks.mobile.data.mobileScore);
  if (checks.headers.status === "done") scores.push(checks.headers.data.score);
  if (checks.dns.status === "done") scores.push(checks.dns.data.score);
  if (checks.crawl.status === "done") scores.push(checks.crawl.data.score);
  return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
}

function statusColor(s: "pass" | "warn" | "fail") {
  return s === "pass" ? "text-green-400" : s === "warn" ? "text-orange-400" : "text-red-400";
}
function statusBg(s: "pass" | "warn" | "fail") {
  return s === "pass" ? "bg-green-500/10" : s === "warn" ? "bg-orange-500/10" : "bg-red-500/10";
}
function statusIcon(s: "pass" | "warn" | "fail") {
  return s === "pass" ? "✓" : s === "warn" ? "⚠" : "✗";
}

function ScoreCircle({ score, label, size = 110 }: { score: number; label: string; size?: number }) {
  const r = size * 0.42; const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ; const color = scoreColor(score);
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

// ── Section card ──────────────────────────────────────────────────────────────

function SectionCard({ title, icon, status, children }: {
  title: string; icon: string; status: "idle"|"loading"|"done"|"error"; children?: React.ReactNode;
}) {
  return (
    <div className="cbt-rise group bg-zinc-900/70 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg shadow-black/10 transition-colors hover:border-zinc-700">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800/80 bg-gradient-to-b from-white/[0.02] to-transparent">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800/80 text-lg ring-1 ring-white/5">
          {icon}
        </span>
        <h3 className="text-white font-bold text-sm flex-1 tracking-tight">{title}</h3>
        {status === "loading" && (
          <span className="inline-flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
            <Loader2 size={13} className="animate-spin text-orange-400" />
            Running
          </span>
        )}
        {status === "done" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-green-400 text-xs font-semibold">
            <CheckCircle2 size={12} />
            Done
          </span>
        )}
        {status === "error" && (
          <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-red-400 text-xs font-semibold">
            Failed
          </span>
        )}
      </div>
      {children && <div className="p-5">{children}</div>}
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-2.5 py-1">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="cbt-skeleton h-3 rounded-full" style={{ width: `${70 + i * 10}%` }} />
      ))}
    </div>
  );
}

function CheckList({ checks }: { checks: Array<{ label: string; status: "pass" | "warn" | "fail"; detail: string }> }) {
  return (
    <div className="space-y-0 rounded-xl overflow-hidden border border-zinc-800">
      {checks.map((c, i) => (
        <div key={i} className={`flex items-start gap-3 px-4 py-3 bg-[#18181B] transition-colors hover:bg-zinc-900/60 ${i < checks.length - 1 ? "border-b border-zinc-800" : ""}`}>
          <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ring-1 ring-inset ring-white/5 ${statusBg(c.status)} ${statusColor(c.status)}`}>
            {statusIcon(c.status)}
          </span>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold">{c.label}</p>
            <p className="text-zinc-500 text-xs mt-0.5 break-words leading-relaxed">{c.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CheckList({ checks }: { checks: Array<{ label: string; severity: "pass"|"warning"|"error"; detail: string }> }) {
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

// ── Overall summary card ──────────────────────────────────────────────────────

function SummaryCard({ checks, url, label }: { checks: AllChecks; url: string; label?: string }) {
  const score = extractScore(checks);
  const { critical, warnings } = countIssues(checks);
  const total = Object.values(checks).filter(c => c.status === "done" || c.status === "error").length;
  const running = Object.values(checks).some(c => c.status === "loading");

  if (score === null && !running) return null;

  const lg = score !== null ? letterGrade(score) : null;

  return (
    <div className="rounded-2xl overflow-hidden border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-950">
      {label && (
        <div className="px-5 py-2.5 bg-zinc-800/60 border-b border-zinc-700">
          <p className="text-zinc-400 text-xs font-semibold truncate">{label}</p>
        </div>
      )}
      <div className="px-5 py-5 flex items-center gap-5">
        {lg ? (
          <div className="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center text-5xl font-black border-2"
            style={{ borderColor: lg.color, color: lg.color, background: `${lg.color}15` }}>
            {lg.grade}
          </div>
        ) : (
          <div className="flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-zinc-700">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {lg && <p className="text-white font-black text-xl mb-0.5">{lg.label}</p>}
          <p className="text-zinc-400 text-xs truncate mb-2">{url}</p>
          <div className="flex flex-wrap gap-2">
            {score !== null && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                Score: {score}/100
              </span>
            )}
            {critical > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                {critical} critical issue{critical !== 1 ? "s" : ""}
              </span>
            )}
            {warnings > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                {warnings} warning{warnings !== 1 ? "s" : ""}
              </span>
            )}
            {total > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500">
                {total}/9 checks complete
              </span>
            )}
          </div>
        </div>
      </div>
      {running && (
        <div className="h-1 bg-zinc-800">
          <div className="h-full bg-orange-500 animate-pulse" style={{ width: `${(total / 9) * 100}%`, transition: "width 0.5s" }} />
        </div>
      )}
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
        const d = state.data; const color = scoreColor(d.score);
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black tabular-nums tracking-tight leading-none" style={{ color, filter: `drop-shadow(0 0 18px ${color}40)` }}>{d.score}</span>
              <div>
                <p className="text-white font-semibold text-sm">{d.score >= 90 ? "Fast" : d.score >= 50 ? "Needs Work" : "Slow"}</p>
                <p className="text-zinc-500 text-xs">Performance score / 100</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["fcp","lcp","tbt","cls","si","tti"] as const).map(k => {
                const m = d.metrics[k];
                return (
                  <div key={k} className="bg-[#18181B] border border-zinc-800/80 rounded-lg p-3">
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
            <ImpactBanner checkKey="speed" score={d.score} />
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
        const d = state.data; const ok = d.valid && !d.error;
        const expiryColor = !d.error ? (d.daysUntilExpiry < 0 ? "text-red-400" : d.daysUntilExpiry < 30 ? "text-orange-400" : "text-green-400") : "text-zinc-400";
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={`text-2xl w-10 h-10 rounded-full flex items-center justify-center ${ok ? "bg-green-500/10" : "bg-red-500/10"}`}>{ok?"✓":"✗"}</span>
              <div>
                <p className={`font-bold text-sm ${ok ? "text-green-400" : "text-red-400"}`}>{ok ? "Certificate Valid" : "SSL Issue Detected"}</p>
                <p className="text-zinc-500 text-xs">{d.hostname}</p>
              </div>
            </div>
            {!d.error && (
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#18181B] border border-zinc-800/80 rounded-lg p-3">
                  <p className="text-zinc-500 text-[10px] mb-1">Expires In</p>
                  <p className={`text-xl font-black ${expiryColor}`}>{d.daysUntilExpiry}d</p>
                </div>
                <div className="bg-[#18181B] border border-zinc-800/80 rounded-lg p-3">
                  <p className="text-zinc-500 text-[10px] mb-1">Expiry Date</p>
                  <p className="text-white text-xs font-semibold">
                    {new Date(d.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="bg-[#18181B] border border-zinc-800/80 rounded-lg p-3">
                  <p className="text-zinc-500 text-[10px] mb-1">Issuer</p>
                  <p className="text-white text-xs font-semibold truncate">{d.issuer || "Unknown"}</p>
                </div>
              </div>
            )}
            {d.error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{d.error}</p>}
            <ImpactBanner checkKey="ssl" score={ok ? 100 : 0} />
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
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black tabular-nums tracking-tight leading-none" style={{ color: scoreColor(d.score), filter: `drop-shadow(0 0 18px ${scoreColor(d.score)}40)` }}>{d.score}</span>
              <div className="space-y-0.5">
                <p className="text-zinc-400 text-xs"><span className="text-green-400 font-semibold">{d.issues.filter(i=>i.severity==="pass").length}</span> passed</p>
                <p className="text-zinc-400 text-xs"><span className="text-orange-400 font-semibold">{d.issues.filter(i=>i.severity==="warning").length}</span> warnings</p>
                <p className="text-zinc-400 text-xs"><span className="text-red-400 font-semibold">{d.issues.filter(i=>i.severity==="error").length}</span> errors</p>
              </div>
            </div>
            <CheckList checks={d.issues} />
            <ImpactBanner checkKey="seo" score={d.score} />
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
          <div className="cbt-skeleton h-3 rounded-full w-4/5" />
          <p className="text-zinc-500 text-xs">Scanning links — up to 30 seconds…</p>
        </div>
      )}
      {state.status === "error" && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        const linkScore = d.total === 0 ? 100 : Math.max(0, 100 - d.broken.length * 25);
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Total", value: d.total, color: "text-white" },
                { label: "OK", value: d.ok, color: "text-green-400" },
                { label: "Broken", value: d.broken.length, color: "text-red-400" },
                { label: "Redirects", value: d.redirects.length, color: "text-orange-400" },
              ].map(s => (
                <div key={s.label} className="bg-[#18181B] border border-zinc-800/80 rounded-lg p-3 text-center">
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-zinc-500 text-[10px] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
            {d.broken.length === 0 && d.redirects.length === 0 && (
              <p className="text-green-400 text-sm text-center bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">All {d.total} links working correctly.</p>
            )}
            {d.broken.length > 0 && (
              <div className="space-y-1">
                <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">Broken</p>
                {d.broken.map((link, i) => (
                  <div key={i} className="flex items-start gap-2 bg-[#18181B] border border-zinc-800/80 rounded-lg px-3 py-2">
                    <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                      {link.status === 0 ? "ERR" : link.status}
                    </span>
                    <p className="text-zinc-300 text-xs break-all">{link.url}</p>
                  </div>
                ))}
              </div>
            )}
            {d.redirects.length > 0 && (
              <div className="space-y-1">
                <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">Redirects</p>
                {d.redirects.map((link, i) => (
                  <div key={i} className="flex items-start gap-2 bg-[#18181B] border border-zinc-800/80 rounded-lg px-3 py-2">
                    <span className="bg-orange-500/10 text-orange-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                      {link.status}
                    </span>
                    <p className="text-zinc-300 text-xs break-all">{link.url}</p>
                  </div>
                ))}
              </div>
            )}
            <ImpactBanner checkKey="links" score={linkScore} />
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
          <div className="cbt-skeleton h-3 rounded-full w-4/5" />
          <p className="text-zinc-500 text-xs">Running PageSpeed mobile analysis…</p>
        </div>
      )}
      {state.status === "error" && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        const check = (ok: boolean) => ({ icon: ok?"✓":"✗", color: ok?"text-green-400":"text-red-400", bg: ok?"bg-green-500/10":"bg-red-500/10" });
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ScoreCircle score={d.mobileScore} label="Mobile" size={90} />
              <ScoreCircle score={d.accessibilityScore} label="Accessibility" size={90} />
              <ScoreCircle score={d.seoScore} label="SEO" size={90} />
              <ScoreCircle score={d.bestPracticesScore} label="Best Practices" size={90} />
            </div>
            <div className="space-y-0 rounded-xl overflow-hidden border border-zinc-800">
              {[{label:"Viewport configured",ok:d.viewport},{label:"Text size legible",ok:d.textSizeOk},{label:"Tap targets sized correctly",ok:d.tapTargetsOk}].map((c,i)=>{
                const s=check(c.ok);
                return (
                  <div key={i} className={`flex items-center gap-3 px-4 py-3 bg-[#18181B] ${i<2?"border-b border-zinc-800":""}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${s.bg} ${s.color}`}>{s.icon}</span>
                    <p className="text-white text-xs font-semibold">{c.label}</p>
                  </div>
                );
              })}
            </div>
            <ImpactBanner checkKey="mobile" score={d.mobileScore} />
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
        const sevSt = (sev: HeaderCheck["severity"], present: boolean): "pass" | "warn" | "fail" =>
          present ? "pass" : sev === "critical" ? "fail" : sev === "warning" ? "warn" : "warn";
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black tabular-nums tracking-tight leading-none" style={{ color: scoreColor(d.score), filter: `drop-shadow(0 0 18px ${scoreColor(d.score)}40)` }}>{d.score}</span>
              <div className="space-y-0.5">
                <p className="text-white font-semibold text-sm">
                  {d.score >= 90 ? "Well Secured" : d.score >= 50 ? "Needs Attention" : "Security Gaps"}
                </p>
                <p className="text-zinc-500 text-xs">{d.passed}/{d.total} headers present</p>
                {d.critical > 0 && <p className="text-red-400 text-xs font-semibold">{d.critical} critical issue{d.critical > 1 ? "s" : ""}</p>}
              </div>
            </div>
            <CheckList checks={d.checks.map(c => ({
              label: c.name,
              status: sevSt(c.severity, c.present),
              detail: c.present ? c.value : c.recommendation,
            }))} />
          </div>
        );
      })()}
    </SectionCard>
  );
}

function DNSResults({ state }: { state: CheckState<DNSData> }) {
  return (
    <SectionCard title="DNS & Email Health" icon="📧" status={state.status}>
      {state.status === "loading" && (
        <div className="space-y-2 py-2">
          <div className="cbt-skeleton h-3 rounded-full w-4/5" />
          <p className="text-zinc-500 text-xs">Querying DNS records…</p>
        </div>
      )}
      {state.status === "error" && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black tabular-nums tracking-tight leading-none" style={{ color: scoreColor(d.score), filter: `drop-shadow(0 0 18px ${scoreColor(d.score)}40)` }}>{d.score}</span>
              <div className="space-y-0.5">
                <p className="text-white font-semibold text-sm">
                  {d.score >= 90 ? "Email Healthy" : d.score >= 50 ? "Some Issues" : "Email at Risk"}
                </p>
                <p className="text-zinc-500 text-xs">{d.passed}/{d.total} checks passed</p>
                {d.failed > 0 && <p className="text-red-400 text-xs font-semibold">{d.failed} failed</p>}
              </div>
            </div>
            <CheckList checks={d.checks} />
          </div>
        );
      })()}
    </SectionCard>
  );
}

function SchemaResults({ state }: { state: CheckState<SchemaData> }) {
  return (
    <SectionCard title="Schema / Local SEO" icon="🗺️" status={state.status}>
      {state.status === "loading" && <LoadingRows />}
      {state.status === "error" && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black tabular-nums tracking-tight leading-none" style={{ color: scoreColor(d.score), filter: `drop-shadow(0 0 18px ${scoreColor(d.score)}40)` }}>{d.score}</span>
              <div className="space-y-0.5">
                <p className="text-white font-semibold text-sm">
                  {d.score >= 90 ? "Schema Complete" : d.score >= 50 ? "Partially Marked Up" : "Missing Schema"}
                </p>
                <p className="text-zinc-500 text-xs">{d.schemaCount} schema block{d.schemaCount !== 1 ? "s" : ""} found</p>
                {d.schemaTypes.length > 0 && (
                  <p className="text-zinc-600 text-xs truncate max-w-[200px]">{d.schemaTypes.join(", ")}</p>
                )}
              </div>
            </div>
            <CheckList checks={d.checks} />
          </div>
        );
      })()}
    </SectionCard>
  );
}

function ADAResults({ state }: { state: CheckState<ADAData> }) {
  const sevIcon = (s: ADAIssue["severity"]) => s === "pass" ? "✓" : s === "warning" ? "⚠" : "✗";
  const sevColor = (s: ADAIssue["severity"]) => s === "pass" ? "text-green-400" : s === "warning" ? "text-orange-400" : "text-red-400";
  const sevBg = (s: ADAIssue["severity"]) => s === "pass" ? "bg-green-500/10" : s === "warning" ? "bg-orange-500/10" : "bg-red-500/10";

  return (
    <SectionCard title="ADA / WCAG Compliance" icon="♿" status={state.status}>
      {state.status === "loading" && (
        <div className="space-y-2 py-2">
          <div className="h-3 bg-zinc-800 rounded animate-pulse w-4/5" />
          <p className="text-zinc-500 text-xs">Checking accessibility signals…</p>
        </div>
      )}
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
                  <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${sevBg(issue.severity)} ${sevColor(issue.severity)}`}>
                    {sevIcon(issue.severity)}
                  </span>
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

// ── Main Page ─────────────────────────────────────────────────────────────────

interface EmailReportState { status: "idle" | "loading" | "done" | "error" }

type AllChecks = {
  speed:   CheckState<SpeedData>;
  ssl:     CheckState<SSLData>;
  seo:     CheckState<SEOData>;
  links:   CheckState<LinksData>;
  mobile:  CheckState<MobileData>;
  headers: CheckState<HeadersData>;
  dns:     CheckState<DNSData>;
  schema:  CheckState<SchemaData>;
};

const idle: AllChecks = {
  speed:   { status: "idle" },
  ssl:     { status: "idle" },
  seo:     { status: "idle" },
  links:   { status: "idle" },
  mobile:  { status: "idle" },
  headers: { status: "idle" },
  dns:     { status: "idle" },
  schema:  { status: "idle" },
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

export default function ToolsPage() {
  const [mode, setMode] = useState<"single"|"compare">("single");
  const [inputUrl, setInputUrl] = useState("");
  const [inputUrlB, setInputUrlB] = useState("");
  const [checks, setChecks] = useState<AllChecks>(idle);
  const [checksB, setChecksB] = useState<AllChecks>(idle);
  const [running, setRunning] = useState(false);
  const [auditedUrl, setAuditedUrl] = useState("");
  const [captureEmail, setCaptureEmail] = useState("");
  const [captureStatus, setCaptureStatus] = useState<"idle" | "loading" | "done">("idle");

  const handleEmailCapture = async () => {
    if (!captureEmail.includes("@") || captureStatus !== "idle") return;
    setCaptureStatus("loading");
    try {
      await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: captureEmail,
          context: `Website Audit Tool — ${auditedUrl}`,
        }),
      });
    } catch (_) {}
    setCaptureStatus("done");
  };

  // Auto-run when ?url= is in the query string (from a shared link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preUrl = params.get("url");
    if (!preUrl) return;
    const url = normalizeUrl(preUrl);
    setInputUrl(preUrl);
    setAuditedUrl(url);
    setRunning(true);
    setLinkCopied(false);
    runAllChecks(url, setCheckA, c => setChecks(c)).then(() => setRunning(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setCheckA<K extends keyof AllChecks>(key: K, state: AllChecks[K]) {
    setChecks(prev => ({ ...prev, [key]: state }));
  }
  function setCheckB<K extends keyof AllChecks>(key: K, state: AllChecks[K]) {
    setChecksB(prev => ({ ...prev, [key]: state }));
  }

  const runAllChecks = useCallback(async (url: string, setter: typeof setCheckA, setChecksFull: (c: AllChecks) => void) => {
    const run = async <K extends keyof AllChecks, T>(key: K, endpoint: string, cast: (d: T) => AllChecks[K]) => {
      try {
        const data = await runCheck<T>(endpoint, url);
        setter(key, cast(data));
      } catch (err) {
        setter(key, { status: "error", message: err instanceof Error ? err.message : "Check failed" } as AllChecks[K]);
      }
    };
    setChecksFull(loadingState);
    await Promise.all([
      run<"speed",   SpeedData  >("speed",   "/api/audit",   d=>({status:"done",data:d})),
      run<"ssl",     SSLData    >("ssl",     "/api/ssl",     d=>({status:"done",data:d})),
      run<"seo",     SEOData    >("seo",     "/api/seo",     d=>({status:"done",data:d})),
      run<"links",   LinksData  >("links",   "/api/links",   d=>({status:"done",data:d})),
      run<"mobile",  MobileData >("mobile",  "/api/mobile",  d=>({status:"done",data:d})),
      run<"headers", HeadersData>("headers", "/api/headers", d=>({status:"done",data:d})),
      run<"dns",     DNSData    >("dns",     "/api/dns",     d=>({status:"done",data:d})),
      run<"tech",    TechData   >("tech",    "/api/tech",    d=>({status:"done",data:d})),
      run<"crawl",   CrawlData  >("crawl",   "/api/crawl",   d=>({status:"done",data:d})),
    ]);
  }, []);

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
      schema:  { status: "loading" },
    });

    const run = async <K extends keyof AllChecks, T>(
      key: K,
      endpoint: string,
      cast: (d: T) => AllChecks[K]
    ) => {
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
      run<"schema",  SchemaData >("schema",  "/api/schema",  d => ({ status: "done", data: d })),
    ]);

    if (mode === "compare" && inputUrlB.trim()) {
      const urlB = normalizeUrl(inputUrlB);
      setAuditedUrlB(urlB);
      await Promise.all([
        runAllChecks(url, setCheckA, c => setChecks(c)),
        runAllChecks(urlB, setCheckB, c => setChecksB(c)),
      ]);
    } else {
      await runAllChecks(url, setCheckA, c => setChecks(c));
    }
    setRunning(false);
  }

  function copyReportLink() {
    const link = `${window.location.origin}/tools?url=${encodeURIComponent(auditedUrl)}`;
    navigator.clipboard.writeText(link).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    });
  }

  const hasResults = Object.values(checks).some(c => c.status !== "idle");
  const hasResultsB = Object.values(checksB).some(c => c.status !== "idle");
  const isCompare = mode === "compare" && hasResultsB;

export default function ToolsIndexPage() {
  return (
    <div className="min-h-screen bg-[#18181B] text-white">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-12 px-6 text-center">
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
          <span className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/25">
            <ShieldCheck size={13} strokeWidth={2.5} />
            Free Audit Suite
          </span>
          <h1 className="text-balance text-4xl sm:text-6xl font-black mb-5 leading-[1.05] tracking-tight">
            Full Website{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Health Check
            </span>
          </h1>
          <p className="text-pretty text-zinc-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Enter your URL and get a complete audit — speed, SSL, SEO, security headers, DNS health,
            schema markup, broken links, and mobile readiness — all at once. Free, no signup.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="relative flex-1 group">
              <Globe
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-orange-400"
              />
              <input
                type="text"
                inputMode="url"
                autoComplete="url"
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                placeholder="yourwebsite.com"
                aria-label="Website URL to audit"
                disabled={running}
                className="w-full bg-zinc-900/80 border border-zinc-700 rounded-full pl-11 pr-5 py-3.5 text-[15px] text-white placeholder-zinc-500 transition-all outline-none focus:border-orange-500/70 focus:ring-4 focus:ring-orange-500/15 hover:border-zinc-600 disabled:opacity-60"
              />
            </div>
            <button
              type="submit"
              disabled={running || !inputUrl.trim()}
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500 disabled:active:scale-100 text-white font-bold px-7 py-3.5 rounded-full transition-all text-sm whitespace-nowrap shadow-lg shadow-orange-500/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30"
            >
              {running ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <ShieldCheck size={16} strokeWidth={2.5} />
                  Run Full Audit
                </>
              )}
            </button>
          </form>

        <div className="max-w-3xl mx-auto">
          <form id="audit-form" onSubmit={handleSubmit} className="space-y-3">
            <div className={`flex flex-col ${mode === "compare" ? "sm:flex-row" : "sm:flex-row"} gap-3`}>
              <input type="text" value={inputUrl} onChange={e => setInputUrl(e.target.value)}
                placeholder={mode === "compare" ? "Site A — yoursite.com" : "yourwebsite.com"}
                disabled={running}
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm" />
              {mode === "compare" && (
                <input type="text" value={inputUrlB} onChange={e => setInputUrlB(e.target.value)}
                  placeholder="Site B — competitor.com" disabled={running}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm" />
              )}
              {mode === "single" && (
                <button type="submit" disabled={running || !inputUrl.trim()}
                  className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-7 py-3.5 rounded-full transition-colors text-sm whitespace-nowrap">
                  {running ? "Analyzing…" : "Run Full Audit"}
                </button>
              )}
            </div>
            {mode === "compare" && (
              <div className="flex justify-center">
                <button type="submit" disabled={running || !inputUrl.trim()}
                  className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-10 py-3.5 rounded-full transition-colors text-sm whitespace-nowrap">
                  {running ? "Analyzing Both Sites…" : "Compare Sites"}
                </button>
              </div>
            )}
          </form>
          {running && (
            <p className="flex items-center justify-center gap-2 text-zinc-500 text-xs mt-4">
              <Loader2 size={12} className="animate-spin text-orange-400" />
              Running 8 checks in parallel — results appear as each one completes
            </p>
          )}
        </div>
      </section>

      {/* Results */}
      {hasResults && (
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto">
            {auditedUrl && (
              <div className="flex justify-center mb-6">
                <span className="inline-flex items-center gap-2 max-w-full rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-1.5 text-xs">
                  <Globe size={13} className="shrink-0 text-orange-400" />
                  <span className="text-zinc-500">Auditing</span>
                  <span className="truncate font-mono text-zinc-200">{auditedUrl}</span>
                </span>
              </div>
            )}
            <div className="space-y-4">
              <SpeedResults   state={checks.speed}   />
              <SSLResults     state={checks.ssl}     />
              <HeadersResults state={checks.headers} />
              <SEOResults     state={checks.seo}     />
              <SchemaResults  state={checks.schema}  />
              <DNSResults     state={checks.dns}     />
              <LinksResults   state={checks.links}   />
              <MobileResults  state={checks.mobile}  />
            </div>

            {/* Summary / comparison header */}
            {isCompare ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <SummaryCard checks={checks} url={auditedUrl} label="Site A" />
                  <SummaryCard checks={checksB} url={auditedUrlB} label="Site B" />
                </div>
                {/* Tab selector */}
                <div className="flex gap-2">
                  {(["A","B"] as const).map(tab => (
                    <button key={tab} onClick={() => setCompareTab(tab)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${compareTab === tab ? "bg-orange-500 text-white" : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"}`}>
                      View Site {tab} Details
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <SummaryCard checks={checks} url={auditedUrl} />
            )}

            {/* Detail results */}
            {isCompare ? (
              compareTab === "A"
                ? <ResultsColumn checks={checks} />
                : <ResultsColumn checks={checksB} />
            ) : (
              <ResultsColumn checks={checks} />
            )}

            {/* Share + CTA */}
            {!running && (
              <>
                {/* Email capture */}
                <div className="cbt-rise mt-6 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 shadow-lg shadow-black/10">
                  <p className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-semibold uppercase tracking-[0.16em] mb-1">
                    <Mail size={13} />
                    Save Your Report
                  </p>
                  {captureStatus === "done" ? (
                    <p className="mt-2 flex items-start gap-2 text-green-400 text-sm">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                      <span>Sent — check your inbox. Duke will follow up if he spots anything worth flagging.</span>
                    </p>
                  ) : (
                    <>
                      <p className="text-white text-sm font-semibold mb-3">Email me this report</p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="email"
                          value={captureEmail}
                          onChange={e => setCaptureEmail(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && handleEmailCapture()}
                          placeholder="your@email.com"
                          aria-label="Your email address"
                          className="flex-1 bg-zinc-800/80 border border-zinc-700 rounded-full px-4 py-2.5 text-white placeholder-zinc-500 text-sm transition-all outline-none focus:border-orange-500/70 focus:ring-4 focus:ring-orange-500/15 hover:border-zinc-600"
                        />
                        <button
                          onClick={handleEmailCapture}
                          disabled={!captureEmail.includes("@") || captureStatus === "loading"}
                          className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 text-white font-bold px-5 py-2.5 rounded-full text-sm transition-all whitespace-nowrap shadow-md shadow-orange-500/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30"
                        >
                          {captureStatus === "loading" ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            "Send Report"
                          )}
                        </button>
                      </div>
                      <p className="text-zinc-600 text-xs mt-2">No spam. Just your results and an offer to help.</p>
                    </>
                  )}
                </div>

                {/* CTA */}
                <div
                  className="cbt-rise relative overflow-hidden mt-4 rounded-2xl p-7 text-center shadow-xl shadow-black/20"
                  style={{ border: "1px solid rgba(249,115,22,0.45)", background: "linear-gradient(135deg, #1C1917 0%, #18181B 100%)" }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-orange-500/70 to-transparent"
                  />
                  <p className="text-orange-400 text-xs font-semibold uppercase tracking-[0.18em] mb-2">Free Consultation</p>
                  <h4 className="text-white text-2xl font-black mb-2 tracking-tight">Want us to fix this?</h4>
                  <p className="text-pretty text-zinc-400 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                    Copper Bay Tech can resolve most issues in under a week. Get a free 30-minute call.
                  </p>
                  <Link
                    href="/#contact"
                    className="group inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 active:scale-[0.98] text-white font-bold px-8 py-3 rounded-full transition-all text-sm shadow-lg shadow-orange-500/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/30"
                  >
                    Get a Free Review
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* What gets checked — idle state */}
      {!hasResults && (
        <div className="px-6 pb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-6">
              What Gets Checked
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: "⚡", label: "Speed", desc: "PageSpeed score & Core Web Vitals" },
                { icon: "🔒", label: "SSL", desc: "Certificate validity & expiry" },
                { icon: "🛡️", label: "Security Headers", desc: "HSTS, CSP, X-Frame-Options & more" },
                { icon: "🔍", label: "SEO", desc: "Title, meta, H1s, OG tags" },
                { icon: "🗺️", label: "Schema / Local SEO", desc: "JSON-LD & LocalBusiness markup" },
                { icon: "📧", label: "DNS & Email", desc: "SPF, DMARC, DKIM, MX records" },
                { icon: "🔗", label: "Links", desc: "404s and redirect chains" },
                { icon: "📱", label: "Mobile", desc: "Responsiveness & accessibility" },
                { icon: "♿", label: "ADA", desc: "WCAG compliance signals" },
              ].map(item => (
                <div
                  key={item.label}
                  className="group bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 text-center transition-all duration-200 hover:border-orange-500/30 hover:bg-zinc-900 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30"
                >
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-800/80 text-xl ring-1 ring-white/5 transition-colors group-hover:bg-zinc-800">
                    {item.icon}
                  </div>
                  <p className="text-white font-bold text-xs mb-1">{item.label}</p>
                  <p className="text-zinc-500 text-[11px] leading-relaxed">{item.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-orange-400 text-sm font-semibold flex-shrink-0 group-hover:gap-2.5 transition-all pt-1">
                {tool.cta} <ArrowRight size={14} />
              </div>
            </Link>
          ))}

          <div className="mt-8 rounded-2xl p-8 text-center border border-zinc-800 bg-zinc-900">
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3">Need the full picture?</p>
            <h2 className="text-white text-xl font-black mb-3">Talk to a human</h2>
            <p className="text-zinc-400 text-sm mb-5 max-w-md mx-auto">
              These tools find the issues. We fix them. Free 30-minute consultation — no obligation, no sales pitch.
            </p>
            <a href="/schedule" className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm">
              Book a Free Call
            </a>
          </div>
        </div>
      )}

      {/* ── Cybersecurity Risk Quiz ──────────────────────────────────────────── */}
      <section id="security-quiz" className="scroll-mt-24"><ITQuiz /></section>

      {/* ── Project Cost Estimator ───────────────────────────────────────────── */}
      <section id="pricing-estimator" className="scroll-mt-24"><PricingEstimator /></section>

      <Footer />
    </div>
  );
}
