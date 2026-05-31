"use client";

import { useState, useEffect, useCallback } from "react";
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

function countIssues(checks: AllChecks) {
  let critical = 0, warnings = 0;
  const countCheckList = (items: Array<{ severity: string }>) => {
    items.forEach(i => { if (i.severity === "error") critical++; else if (i.severity === "warning") warnings++; });
  };
  if (checks.speed.status === "done" && checks.speed.data.score < 50) critical++;
  if (checks.ssl.status === "done" && (checks.ssl.data.error || !checks.ssl.data.valid)) critical++;
  if (checks.seo.status === "done") countCheckList(checks.seo.data.issues);
  if (checks.links.status === "done" && checks.links.data.broken.length > 0) critical += checks.links.data.broken.length;
  if (checks.mobile.status === "done" && checks.mobile.data.mobileScore < 50) critical++;
  if (checks.headers.status === "done") countCheckList(checks.headers.data.checks.map(c => ({ severity: c.severity })));
  if (checks.dns.status === "done") countCheckList(checks.dns.data.checks);
  if (checks.crawl.status === "done") countCheckList(checks.crawl.data.checks);
  return { critical, warnings };
}

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

// ── Business impact messages ──────────────────────────────────────────────────

const IMPACT: Record<string, { threshold: number; message: string }> = {
  speed:   { threshold: 70, message: "Slow sites lose 53% of visitors before the page loads — Google also penalizes slow sites in search rankings." },
  ssl:     { threshold: 99, message: "Browsers show a 'Not Secure' warning — 85% of users abandon sites that trigger security warnings." },
  seo:     { threshold: 70, message: "Poor SEO makes your business invisible on Google. Local competitors with better SEO are taking your customers." },
  links:   { threshold: 99, message: "Broken links frustrate customers and signal neglect — Google uses broken links as a quality signal against you." },
  mobile:  { threshold: 70, message: "Over 60% of web traffic is mobile. A poor mobile experience sends customers straight to your competitors." },
  headers: { threshold: 60, message: "Missing security headers expose your site to hacking and put customer data at risk — a liability for any business." },
  dns:     { threshold: 70, message: "Without SPF and DMARC records, spammers can send phishing emails pretending to be your business." },
  crawl:   { threshold: 70, message: "If Google can't crawl your site properly, it can't rank you — your business may be effectively invisible in search." },
};

function ImpactBanner({ checkKey, score }: { checkKey: string; score: number }) {
  const impact = IMPACT[checkKey];
  if (!impact || score >= impact.threshold) return null;
  return (
    <div className="mt-4 flex items-start gap-2.5 bg-orange-500/8 border border-orange-500/20 rounded-xl px-4 py-3">
      <span className="text-orange-400 text-sm flex-shrink-0 mt-0.5">💡</span>
      <p className="text-orange-300 text-xs leading-relaxed">{impact.message}</p>
    </div>
  );
}

// ── Score circle ──────────────────────────────────────────────────────────────

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
                <div className="bg-[#18181B] rounded-lg p-3"><p className="text-zinc-500 text-[10px] mb-1">Expires In</p><p className={`text-xl font-black ${expiryColor}`}>{d.daysUntilExpiry}d</p></div>
                <div className="bg-[#18181B] rounded-lg p-3"><p className="text-zinc-500 text-[10px] mb-1">Expiry Date</p><p className="text-white text-xs font-semibold">{new Date(d.expiresAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</p></div>
                <div className="bg-[#18181B] rounded-lg p-3"><p className="text-zinc-500 text-[10px] mb-1">Issuer</p><p className="text-white text-xs font-semibold truncate">{d.issuer||"Unknown"}</p></div>
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
              <span className="text-5xl font-black" style={{ color: scoreColor(d.score) }}>{d.score}</span>
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
      {state.status === "loading" && (<div className="space-y-2 py-2"><div className="h-3 bg-zinc-800 rounded animate-pulse w-4/5" /><p className="text-zinc-500 text-xs">Scanning links…</p></div>)}
      {state.status === "error" && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        const linkScore = d.total === 0 ? 100 : Math.max(0, 100 - d.broken.length * 25);
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {[{label:"Total",value:d.total,color:"text-white"},{label:"OK",value:d.ok,color:"text-green-400"},{label:"Broken",value:d.broken.length,color:"text-red-400"},{label:"Redirects",value:d.redirects.length,color:"text-orange-400"}].map(s=>(
                <div key={s.label} className="bg-[#18181B] rounded-lg p-3 text-center"><p className={`text-xl font-black ${s.color}`}>{s.value}</p><p className="text-zinc-500 text-[10px] mt-0.5">{s.label}</p></div>
              ))}
            </div>
            {d.broken.length === 0 && d.redirects.length === 0 && (
              <p className="text-green-400 text-sm text-center bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">All {d.total} links working correctly.</p>
            )}
            {d.broken.length > 0 && (
              <div className="space-y-1">
                <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">Broken</p>
                {d.broken.map((link, i) => (
                  <div key={i} className="flex items-start gap-2 bg-[#18181B] rounded-lg px-3 py-2">
                    <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">{link.status===0?"ERR":link.status}</span>
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
      {state.status === "loading" && (<div className="space-y-2 py-2"><div className="h-3 bg-zinc-800 rounded animate-pulse w-4/5" /><p className="text-zinc-500 text-xs">Running mobile analysis…</p></div>)}
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
        const passes = d.checks.filter(c=>c.severity==="pass").length;
        const errors = d.checks.filter(c=>c.severity==="error").length;
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black" style={{ color: scoreColor(d.score) }}>{d.score}</span>
              <div className="space-y-0.5">
                <p className="text-white font-semibold text-sm">{d.score>=90?"Secure":d.score>=60?"Needs Hardening":"Vulnerable"}</p>
                <p className="text-zinc-500 text-xs">{passes}/{d.checks.length} configured · {errors} critical missing</p>
              </div>
            </div>
            <CheckList checks={d.checks.map(c=>({label:c.header,severity:c.severity,detail:c.detail}))} />
            <ImpactBanner checkKey="headers" score={d.score} />
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
        const byType = d.records.reduce<Record<string,string[]>>((acc,r)=>{(acc[r.type]=acc[r.type]||[]).push(r.value);return acc;},{});
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black" style={{ color: scoreColor(d.score) }}>{d.score}</span>
              <div><p className="text-white font-semibold text-sm">{d.hostname}</p><p className="text-zinc-500 text-xs">{d.records.length} records found</p></div>
            </div>
            {Object.keys(byType).length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(byType).map(([type,vals])=>(
                  <div key={type} className="bg-[#18181B] rounded-lg p-3">
                    <p className="text-orange-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">{type}</p>
                    {vals.slice(0,2).map((v,i)=><p key={i} className="text-zinc-300 text-[11px] truncate">{v}</p>)}
                    {vals.length>2&&<p className="text-zinc-600 text-[10px]">+{vals.length-2} more</p>}
                  </div>
                ))}
              </div>
            )}
            <CheckList checks={d.checks} />
            <ImpactBanner checkKey="dns" score={d.score} />
          </div>
        );
      })()}
    </SectionCard>
  );
}

function TechResults({ state }: { state: CheckState<TechData> }) {
  const categoryColors: Record<string,string> = {
    CMS:"bg-purple-500/10 text-purple-400 border-purple-500/20",
    Framework:"bg-blue-500/10 text-blue-400 border-blue-500/20",
    "E-commerce":"bg-green-500/10 text-green-400 border-green-500/20",
    Analytics:"bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    CDN:"bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Hosting:"bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    Security:"bg-red-500/10 text-red-400 border-red-500/20",
    Payments:"bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Web Server":"bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    Library:"bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    "CSS Framework":"bg-pink-500/10 text-pink-400 border-pink-500/20",
    "CRM / Marketing":"bg-orange-500/10 text-orange-400 border-orange-500/20",
    default:"bg-zinc-800 text-zinc-400 border-zinc-700",
  };
  return (
    <SectionCard title="Tech Stack" icon="🧱" status={state.status}>
      {state.status === "loading" && <LoadingRows />}
      {state.status === "error" && <p className="text-red-400 text-sm">{state.message}</p>}
      {state.status === "done" && (() => {
        const d = state.data;
        if (d.count === 0) return <p className="text-zinc-500 text-sm text-center py-4">No recognizable technologies detected.</p>;
        const byCategory = d.categories.reduce<Record<string,TechItem[]>>((acc,cat)=>{acc[cat]=d.detected.filter(t=>t.category===cat);return acc;},{});
        return (
          <div className="space-y-4">
            <p className="text-zinc-500 text-xs">{d.count} technolog{d.count===1?"y":"ies"} detected</p>
            {Object.entries(byCategory).map(([cat,items])=>(
              <div key={cat}>
                <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider mb-2">{cat}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map(item=>{
                    const cls=categoryColors[item.category]??categoryColors.default;
                    return (
                      <span key={item.name} className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cls}`}>
                        {item.name}{item.confidence==="low"&&<span className="opacity-50 text-[9px]">~</span>}
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
        const passes = d.checks.filter(c=>c.severity==="pass").length;
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black" style={{ color: scoreColor(d.score) }}>{d.score}</span>
              <div><p className="text-white font-semibold text-sm">{d.score>=80?"Well Configured":d.score>=50?"Needs Attention":"Indexing Issues"}</p><p className="text-zinc-500 text-xs">{passes}/{d.checks.length} checks passed</p></div>
            </div>
            <CheckList checks={d.checks} />
            <ImpactBanner checkKey="crawl" score={d.score} />
          </div>
        );
      })()}
    </SectionCard>
  );
}

// ── Results column ────────────────────────────────────────────────────────────

function ResultsColumn({ checks }: { checks: AllChecks }) {
  return (
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
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ALL_CHECK_ICONS = [
  { icon: "⚡", label: "Speed",           desc: "PageSpeed & Core Web Vitals" },
  { icon: "🔒", label: "SSL",             desc: "Certificate validity & expiry" },
  { icon: "🛡️", label: "Security Headers",desc: "HSTS, CSP, clickjacking protection" },
  { icon: "🔍", label: "SEO",             desc: "Title, meta, H1s, OG tags" },
  { icon: "🗺️", label: "Crawlability",    desc: "Sitemap, robots.txt, JSON-LD" },
  { icon: "📡", label: "DNS & Email",     desc: "SPF, DMARC, MX, nameservers" },
  { icon: "🔗", label: "Links",           desc: "404s and redirect chains" },
  { icon: "📱", label: "Mobile",          desc: "Responsiveness & accessibility" },
  { icon: "🧱", label: "Tech Stack",      desc: "CMS, CDN, analytics & frameworks" },
];

const loadingState: AllChecks = {
  speed: { status: "loading" }, ssl: { status: "loading" }, seo: { status: "loading" },
  links: { status: "loading" }, mobile: { status: "loading" }, headers: { status: "loading" },
  dns: { status: "loading" }, tech: { status: "loading" }, crawl: { status: "loading" },
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ToolsPage() {
  const [mode, setMode] = useState<"single"|"compare">("single");
  const [inputUrl, setInputUrl] = useState("");
  const [inputUrlB, setInputUrlB] = useState("");
  const [checks, setChecks] = useState<AllChecks>(idle);
  const [checksB, setChecksB] = useState<AllChecks>(idle);
  const [running, setRunning] = useState(false);
  const [auditedUrl, setAuditedUrl] = useState("");
  const [auditedUrlB, setAuditedUrlB] = useState("");
  const [compareTab, setCompareTab] = useState<"A"|"B">("A");
  const [linkCopied, setLinkCopied] = useState(false);

  // Auto-run when ?url= is in the query string (from a shared link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preUrl = params.get("url");
    if (preUrl) {
      setInputUrl(preUrl);
      // slight delay to let React hydrate
      setTimeout(() => {
        document.getElementById("audit-form")?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      }, 300);
    }
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
    setLinkCopied(false);

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
            Free Tools for <span className="text-orange-400">Your Business</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
            No signup, no catch. Run a full 9-point website audit, compare with a competitor,
            assess cybersecurity risk, or get an instant project estimate.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[{label:"Website Health Check",anchor:"#health-check"},{label:"Cybersecurity Risk Quiz",anchor:"#security-quiz"},{label:"Project Cost Estimator",anchor:"#pricing-estimator"}].map(t=>(
              <a key={t.anchor} href={t.anchor} className="bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 text-zinc-300 hover:text-orange-400 text-xs font-semibold px-4 py-2 rounded-full transition-colors">{t.label}</a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Website Health Check ─────────────────────────────────────────────── */}
      <section id="health-check" className="px-6 pb-4 scroll-mt-24">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black mb-2">
            Website <span className="text-orange-400">Health Check</span>
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto mb-6">
            9 checks in parallel — speed, security, SEO, DNS, tech stack, and more.
          </p>

          {/* Mode toggle */}
          <div className="inline-flex bg-zinc-900 border border-zinc-800 rounded-full p-1 gap-1 mb-6">
            {(["single","compare"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-colors ${mode === m ? "bg-orange-500 text-white" : "text-zinc-400 hover:text-white"}`}>
                {m === "single" ? "Single URL" : "Compare Two Sites"}
              </button>
            ))}
          </div>
        </div>

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
            <p className="text-zinc-500 text-xs mt-4 text-center">
              Running 9 checks in parallel — results appear as each one completes
            </p>
          )}
        </div>
      </section>

      {/* Results */}
      {hasResults && (
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto space-y-6">

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
              <div className="space-y-4">
                {/* Shareable link */}
                <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm">Share this report</p>
                    <p className="text-zinc-500 text-xs mt-0.5 truncate">
                      {typeof window !== "undefined" ? `${window.location.origin}/tools?url=${encodeURIComponent(auditedUrl)}` : ""}
                    </p>
                  </div>
                  <button onClick={copyReportLink}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-colors ${linkCopied ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"}`}>
                    {linkCopied ? "✓ Copied!" : "Copy Link"}
                  </button>
                </div>

                {/* CTA */}
                <div className="rounded-2xl p-6 text-center" style={{ border: "1px solid #F97316", background: "linear-gradient(135deg, #18181B 0%, #1C1917 100%)" }}>
                  <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">Free Consultation</p>
                  <h4 className="text-white text-xl font-black mb-2">Want us to fix this?</h4>
                  <p className="text-zinc-400 text-sm mb-5 max-w-sm mx-auto">
                    Copper Bay Tech can resolve most issues in under a week. Get a free 30-minute call.
                  </p>
                  <a href="/#contact" className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm">
                    Get a Free Review
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* What gets checked — idle state */}
      {!hasResults && (
        <div className="px-6 pb-16">
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
              9 Checks Run Simultaneously
            </p>
            <div className="hidden sm:grid grid-cols-9 gap-2">
              {ALL_CHECK_ICONS.map(item => (
                <div key={item.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <p className="text-white font-bold text-[10px] mb-0.5 leading-tight">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="sm:hidden space-y-2">
              {ALL_CHECK_ICONS.map(item => (
                <div key={item.label} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5">
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <div><p className="text-white font-bold text-xs">{item.label}</p><p className="text-zinc-500 text-[11px]">{item.desc}</p></div>
                </div>
              ))}
            </div>
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
