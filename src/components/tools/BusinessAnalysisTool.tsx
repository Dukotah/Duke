"use client";

import { useState } from "react";
import Link from "next/link";
import { biggestImprovement, type Improvement } from "@/lib/businessAnalysis/report";

// ── Types ───────────────────────────────────────────────────────────────────

interface AuditData {
  verified?: boolean;
  score: number;
  metrics?: Record<string, { value: string; score: number | null; title: string }>;
}
interface SSLData {
  verified?: boolean;
  valid: boolean;
  daysUntilExpiry: number;
  error?: string;
}
interface SEOData {
  verified?: boolean;
  score: number;
  issues: { label: string; severity: "pass" | "warning" | "error"; detail: string }[];
}
interface Signal {
  label: string;
  severity: "pass" | "warning" | "error";
  detail: string;
}
interface PresenceData {
  verified?: boolean;
  reachable: boolean;
  social: { platform: string; url: string }[];
  socialScore: number;
  socialSignals: Signal[];
  branding: { brandingScore: number; signals: Signal[] };
  local: { localScore: number; signals: Signal[] };
}

type Phase = "intake" | "scanning" | "results";

// ── Helpers ─────────────────────────────────────────────────────────────────

function normalizeUrl(url: string) {
  let u = url.trim();
  if (!u.startsWith("http://") && !u.startsWith("https://")) u = "https://" + u;
  return u;
}
function scoreColor(s: number) {
  if (s >= 80) return "#22C55E";
  if (s >= 50) return "#F97316";
  return "#EF4444";
}
function letterGrade(s: number) {
  if (s >= 90) return "A";
  if (s >= 80) return "B";
  if (s >= 65) return "C";
  if (s >= 50) return "D";
  return "F";
}
function gradeWord(s: number) {
  if (s >= 80) return "Strong";
  if (s >= 50) return "Needs work";
  return "At risk";
}

async function runCheck<T>(endpoint: string, url: string): Promise<T | null> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Donut({ score, label, size = 104, unverified = false }: { score: number; label: string; size?: number; unverified?: boolean }) {
  const r = size * 0.42;
  const circ = 2 * Math.PI * r;
  // When we couldn't verify a category, show a neutral muted ring + dash —
  // never a red "0" that wrongly implies the business scored badly.
  const offset = unverified ? circ : circ - (score / 100) * circ;
  const color = unverified ? "#52525B" : scoreColor(score);
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#27272A" strokeWidth={size * 0.085} />
        {!unverified && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={size * 0.085}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        )}
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={unverified ? size * 0.16 : size * 0.24} fontWeight="bold">
          {unverified ? "—" : score}
        </text>
      </svg>
      <span className="text-xs font-semibold text-zinc-300 text-center leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
        {label}
      </span>
    </div>
  );
}

function SignalList({ signals }: { signals: Signal[] }) {
  const icon = (s: Signal["severity"]) => (s === "pass" ? "✓" : s === "warning" ? "⚠" : "✗");
  const color = (s: Signal["severity"]) => (s === "pass" ? "text-green-400" : s === "warning" ? "text-copper-bright" : "text-red-400");
  const bg = (s: Signal["severity"]) => (s === "pass" ? "bg-green-500/10" : s === "warning" ? "bg-copper/10" : "bg-red-500/10");
  return (
    <div className="space-y-0 rounded-xl overflow-hidden border border-hairline">
      {signals.map((s, i) => (
        <div key={i} className={`flex items-start gap-3 px-4 py-3 bg-ink-1 ${i < signals.length - 1 ? "border-b border-hairline" : ""}`}>
          <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${bg(s.severity)} ${color(s.severity)}`}>
            {icon(s.severity)}
          </span>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold">{s.label}</p>
            <p className="text-zinc-500 text-xs mt-0.5 break-words">{s.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoryCard({ score, title, icon, signals, defaultOpen = false, unverified = false }: { score: number; title: string; icon: string; signals: Signal[]; defaultOpen?: boolean; unverified?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  // Unverified categories render a neutral, muted state — a calm "we couldn't
  // verify this" rather than a red 0 that misrepresents the business.
  if (unverified) {
    return (
      <div className="bg-ink-2 border border-hairline rounded-2xl overflow-hidden opacity-75">
        <div className="w-full flex items-center gap-4 px-5 py-4 text-left">
          <span className="text-xl grayscale">{icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="text-zinc-300 font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>{title}</h3>
            <p className="text-zinc-500 text-xs">We couldn&apos;t verify this</p>
          </div>
          <span className="text-2xl font-black text-zinc-600">—</span>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-ink-2 border border-hairline rounded-2xl overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-ink-3 transition-colors">
        <span className="text-xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>{title}</h3>
          <p className="text-zinc-500 text-xs">{gradeWord(score)}</p>
        </div>
        <span className="text-2xl font-black" style={{ color: scoreColor(score) }}>{score}</span>
        <span className="text-zinc-500 text-xs ml-1">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="px-5 pb-5"><SignalList signals={signals} /></div>}
    </div>
  );
}

// ── Tool ──────────────────────────────────────────────────────────────────

export default function BusinessAnalysisTool() {
  const [phase, setPhase] = useState<Phase>("intake");
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  // Honeypot: a real human leaves this blank; bots auto-fill every field.
  const [hp, setHp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [scanLabel, setScanLabel] = useState("");

  const [audit, setAudit] = useState<AuditData | null>(null);
  const [ssl, setSsl] = useState<SSLData | null>(null);
  const [seo, setSeo] = useState<SEOData | null>(null);
  const [presence, setPresence] = useState<PresenceData | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!website.trim()) return setError("Enter your website to run the analysis.");
    if (!email.trim() || !email.includes("@")) return setError("Enter a valid email so we can send your full report.");

    const url = normalizeUrl(website);
    setPhase("scanning");

    setScanLabel("Scanning your website…");
    const [a, s, o, p] = await Promise.all([
      runCheck<AuditData>("/api/audit", url),
      runCheck<SSLData>("/api/ssl", url),
      runCheck<SEOData>("/api/seo", url),
      runCheck<PresenceData>("/api/presence", url),
    ]);
    setAudit(a);
    setSsl(s);
    setSeo(o);
    setPresence(p);
    setPhase("results");

    // Close the loop: persist the scored lead in the CRM and email the full
    // report. We compute the scores from the freshly-resolved scan results here
    // (state updates above aren't visible yet within this tick), using the exact
    // same logic as the derived render values below so the email agrees.
    const cPerf = a?.score ?? null;
    const cSslOk = !!s?.valid && !s?.error;
    const cSslScore = s ? (cSslOk ? 100 : 0) : null;
    const cSeo = o?.score ?? null;
    const cWebsiteParts = [cPerf, cSslScore, cSeo].filter((v): v is number => v !== null);
    const cWebsite = cWebsiteParts.length ? Math.round(cWebsiteParts.reduce((x, y) => x + y, 0) / cWebsiteParts.length) : 0;
    const cLocal = p?.local.localScore ?? 0;
    const cSocial = p?.socialScore ?? 0;
    const cBranding = p?.branding.brandingScore ?? 0;
    const cOverall = Math.round(cWebsite * 0.35 + cLocal * 0.3 + cBranding * 0.2 + cSocial * 0.15);
    const cSignals = {
      reachable: p?.reachable ?? true,
      perf: cPerf,
      sslOk: cSslOk,
      seo: cSeo,
      local: cLocal,
      social: cSocial,
      branding: cBranding,
    };
    const cImprovement = biggestImprovement(cSignals);

    void fetch("/api/business-analysis/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        website: url,
        businessName: businessName.trim() || undefined,
        scores: {
          overall: cOverall,
          website: cWebsite,
          local: cLocal,
          social: cSocial,
          branding: cBranding,
        },
        grade: letterGrade(cOverall),
        recommendedService: cImprovement.service,
        signals: cSignals,
        honeypot: hp,
      }),
    }).catch(() => {});
  }

  // ── Derived scores ──────────────────────────────────────────────────────────
  const perfScore = audit?.score ?? null;
  const sslOk = !!ssl?.valid && !ssl?.error;
  const sslScore = ssl ? (sslOk ? 100 : 0) : null;
  const seoScore = seo?.score ?? null;

  const websiteParts = [perfScore, sslScore, seoScore].filter((v): v is number => v !== null);
  const websiteScore = websiteParts.length ? Math.round(websiteParts.reduce((a, b) => a + b, 0) / websiteParts.length) : 0;
  const localScore = presence?.local.localScore ?? 0;
  const socialScore = presence?.socialScore ?? 0;
  const brandingScore = presence?.branding.brandingScore ?? 0;

  // Weighted toward what moves the needle for a local business.
  const overall = Math.round(websiteScore * 0.35 + localScore * 0.3 + brandingScore * 0.2 + socialScore * 0.15);

  // Per-category verification. When a scan couldn't confirm a category, we show
  // a neutral "couldn't verify" state instead of a misleading red 0. A scan
  // counts as verified only when it ran AND its result didn't flag verified:false.
  // Website rolls up its three sub-scans: verified if any one of them verified.
  const auditVerified = !!audit && audit.verified !== false;
  const sslVerified = !!ssl && ssl.verified !== false;
  const seoVerified = !!seo && seo.verified !== false;
  const websiteVerified = auditVerified || sslVerified || seoVerified;
  const presenceVerified = !!presence && presence.verified !== false;
  const localVerified = presenceVerified;
  const socialVerified = presenceVerified;
  const brandingVerified = presenceVerified;

  const improvement: Improvement = biggestImprovement({
    reachable: presence?.reachable ?? true,
    perf: perfScore,
    sslOk,
    seo: seoScore,
    local: localScore,
    social: socialScore,
    branding: brandingScore,
  });

  const websiteSignals: Signal[] = [
    perfScore !== null
      ? { label: "Page speed", severity: perfScore >= 80 ? "pass" : perfScore >= 50 ? "warning" : "error", detail: `Performance score ${perfScore}/100` }
      : { label: "Page speed", severity: "warning", detail: "Couldn't measure speed" },
    sslScore !== null
      ? { label: "HTTPS / SSL", severity: sslOk ? "pass" : "error", detail: sslOk ? `Valid — ${ssl?.daysUntilExpiry}d until renewal` : "Not secure or invalid certificate" }
      : { label: "HTTPS / SSL", severity: "warning", detail: "Couldn't check certificate" },
    seoScore !== null
      ? { label: "On-page SEO", severity: seoScore >= 80 ? "pass" : seoScore >= 50 ? "warning" : "error", detail: `SEO health ${seoScore}/100` }
      : { label: "On-page SEO", severity: "warning", detail: "Couldn't analyze SEO" },
    ...(seo?.issues.filter((i) => i.severity !== "pass").slice(0, 4) ?? []),
  ];

  return (
    <div className="text-white">
      {/* ── Hero / intake ──────────────────────────────────────────────────── */}
      {phase === "intake" && (
        <section className="pt-6 pb-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-block bg-copper/10 text-copper-bright text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-copper/20">
              Free — No cost, no obligation
            </span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Your free <span className="text-copper-bright">business analysis</span>
            </h1>
            <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              We scan your website, branding, Google presence, and social profiles — then tell you the single biggest
              improvement you can make to grow. Instant results, plus a personal follow-up from Duke.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto text-left">
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Business name"
                className="w-full bg-ink-2 border border-hairline rounded-xl px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-copper focus:ring-copper transition-colors text-sm"
              />
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="yourwebsite.com"
                className="w-full bg-ink-2 border border-hairline rounded-xl px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-copper focus:ring-copper transition-colors text-sm"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full bg-ink-2 border border-hairline rounded-xl px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-copper focus:ring-copper transition-colors text-sm"
              />
              {/* Honeypot: hidden from humans, irresistible to bots. A filled
                  value makes the server silently drop the submission. */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
                <label htmlFor="ba-company-website">Company website (leave blank)</label>
                <input
                  id="ba-company-website"
                  type="text"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                />
              </div>
              {error && <p className="text-red-400 text-xs px-1">{error}</p>}
              <button
                type="submit"
                className="w-full bg-copper hover:bg-copper-bright text-ink-0 font-bold px-7 py-4 rounded-xl transition-colors text-sm"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Run my free analysis →
              </button>
              <p className="text-zinc-600 text-xs text-center pt-1">
                Takes about 30 seconds. We never sell or share your information.
              </p>
            </form>

            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
              {[
                { icon: "🌐", label: "Website" },
                { icon: "📍", label: "Google profile" },
                { icon: "📱", label: "Social media" },
                { icon: "✨", label: "Branding" },
              ].map((c) => (
                <div key={c.label} className="bg-ink-2 border border-hairline rounded-xl py-4 px-2">
                  <div className="text-2xl mb-1">{c.icon}</div>
                  <p className="text-zinc-400 text-xs font-semibold">{c.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Scanning ────────────────────────────────────────────────────────── */}
      {phase === "scanning" && (
        <section className="pt-40 pb-40 px-6 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-12 border-2 border-copper border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-black mb-2" style={{ fontFamily: "var(--font-heading)" }}>Analyzing {businessName.trim() || "your business"}…</h2>
            <p className="text-zinc-400 text-sm">{scanLabel || "Running checks across your online presence."}</p>
          </div>
        </section>
      )}

      {/* ── Results ─────────────────────────────────────────────────────────── */}
      {phase === "results" && (
        <>
          <section className="pt-6 pb-6 px-6">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-zinc-500 text-xs mb-2 break-all">
                Analysis for <span className="text-zinc-300">{businessName.trim() || presence?.social[0]?.url || website}</span>
              </p>
              <div className="inline-flex items-center gap-5 bg-ink-2 border border-hairline rounded-2xl px-8 py-5 mt-3">
                <div className="text-center">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Overall</p>
                  <p className="font-black leading-none" style={{ fontSize: "3.5rem", color: scoreColor(overall) }}>{letterGrade(overall)}</p>
                </div>
                <div className="w-px h-14 bg-ink-3" />
                <div className="text-center">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Presence score</p>
                  <p className="text-3xl font-black" style={{ color: scoreColor(overall) }}>{overall}</p>
                  <p className="text-zinc-600 text-[10px]">out of 100</p>
                </div>
              </div>
            </div>
          </section>

          {/* Biggest improvement — the headline payoff */}
          <section className="px-6 pb-4">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-2xl p-7 sm:p-9" style={{ border: "1px solid rgba(221,170,117,0.45)", background: "linear-gradient(135deg, #1C1917 0%, #18181B 100%)" }}>
                <p className="text-copper-bright text-xs font-semibold uppercase tracking-widest mb-3">⭐ Your biggest opportunity</p>
                <h2 className="text-white text-2xl sm:text-3xl font-black mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                  {improvement.title}
                </h2>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-4">{improvement.why}</p>
                <div className="bg-black/30 border border-hairline rounded-xl p-4 mb-5">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">What to do</p>
                  <p className="text-white text-sm">{improvement.action}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={improvement.ctaHref} className="inline-flex items-center justify-center bg-copper hover:bg-copper-bright text-ink-0 font-bold px-7 py-3.5 rounded-xl transition-colors text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                    {improvement.ctaLabel} →
                  </Link>
                  <Link href="/#contact" className="inline-flex items-center justify-center border border-hairline hover:border-copper-dim text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                    Talk it through with our team
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Category breakdown */}
          <section className="px-6 pb-6">
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center py-6">
                <Donut score={websiteScore} label="Website" unverified={!websiteVerified} />
                <Donut score={localScore} label="Google / Local" unverified={!localVerified} />
                <Donut score={socialScore} label="Social" unverified={!socialVerified} />
                <Donut score={brandingScore} label="Branding" unverified={!brandingVerified} />
              </div>

              <div className="space-y-4">
                <CategoryCard score={websiteScore} title="Website" icon="🌐" signals={websiteSignals} unverified={!websiteVerified} />
                {presence
                  ? <CategoryCard score={localScore} title="Google / Local Presence" icon="📍" signals={presence.local.signals} unverified={!localVerified} />
                  : <CategoryCard score={0} title="Google / Local Presence" icon="📍" signals={[]} unverified />}
                {presence
                  ? <CategoryCard score={socialScore} title="Social Media" icon="📱" signals={presence.socialSignals} unverified={!socialVerified} />
                  : <CategoryCard score={0} title="Social Media" icon="📱" signals={[]} unverified />}
                {presence
                  ? <CategoryCard score={brandingScore} title="Branding" icon="✨" signals={presence.branding.signals} unverified={!brandingVerified} />
                  : <CategoryCard score={0} title="Branding" icon="✨" signals={[]} unverified />}
              </div>
            </div>
          </section>

          {/* Follow-up note + CTA */}
          <section className="px-6 pb-20">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-2xl bg-ink-2 border border-hairline p-7 text-center">
                <h3 className="text-white text-xl font-black mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  Want the full picture?
                </h3>
                <p className="text-zinc-400 text-sm mb-5 max-w-lg mx-auto">
                  This instant scan covers the basics. Duke will personally review your Google Business Profile, social
                  activity, and branding in depth — and email {email.trim() ? <span className="text-zinc-200">{email.trim()}</span> : "you"} a
                  full report with a prioritized action plan. Free, no obligation.
                </p>
                <Link href="/schedule" className="inline-block bg-copper hover:bg-copper-bright text-ink-0 font-bold px-8 py-3.5 rounded-xl transition-colors text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                  Book a free 30-min call
                </Link>
                <p className="text-zinc-600 text-xs mt-4">Or call/text Duke directly at (707) 239-6725</p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
