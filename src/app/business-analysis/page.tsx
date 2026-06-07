"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// ── Types ───────────────────────────────────────────────────────────────────

interface AuditData {
  score: number;
  metrics?: Record<string, { value: string; score: number | null; title: string }>;
}
interface SSLData {
  valid: boolean;
  daysUntilExpiry: number;
  error?: string;
}
interface SEOData {
  score: number;
  issues: { label: string; severity: "pass" | "warning" | "error"; detail: string }[];
}
interface Signal {
  label: string;
  severity: "pass" | "warning" | "error";
  detail: string;
}
interface PresenceData {
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

// ── Biggest-improvement rule engine ───────────────────────────────────────────

interface Improvement {
  title: string;
  why: string;
  action: string;
  service: string;
  ctaLabel: string;
  ctaHref: string;
}

function biggestImprovement(args: {
  reachable: boolean;
  perf: number | null;
  sslOk: boolean;
  seo: number | null;
  local: number;
  social: number;
  branding: number;
}): Improvement {
  const { reachable, perf, sslOk, seo, local, social, branding } = args;

  if (!reachable) {
    return {
      title: "Get a website that actually loads",
      why: "We couldn't reach your site. Every day it's down or missing, customers searching for you find a competitor instead.",
      action: "Stand up a fast, professional, mobile-first website that turns searches into calls.",
      service: "Web Design",
      ctaLabel: "Fix my website",
      ctaHref: "/web-design-sonoma-county",
    };
  }
  if (!sslOk) {
    return {
      title: "Secure your site with HTTPS",
      why: "Your site isn't showing a valid security certificate. Browsers flag it as “Not secure,” which scares away visitors and tanks Google rankings.",
      action: "Install and auto-renew SSL so every visitor sees the trusted padlock.",
      service: "Web Design",
      ctaLabel: "Secure my site",
      ctaHref: "/#contact",
    };
  }
  if (local < 50) {
    return {
      title: "Claim & optimize your Google Business Profile",
      why: "Your local-search signals are weak. For a local business this is the single highest-ROI fix — the map pack is where ready-to-buy customers look first.",
      action: "Optimize your Google Business Profile and add local schema, address, and reviews so you show up in the map pack.",
      service: "Web Design + Local SEO",
      ctaLabel: "Boost my local presence",
      ctaHref: "/web-design-sonoma-county",
    };
  }
  if (perf !== null && perf < 50) {
    return {
      title: "Speed up your website",
      why: "Your site is slow. Over half of mobile visitors leave a page that takes more than 3 seconds — that's leads walking out the door.",
      action: "Rebuild on a fast, modern stack and optimize images so pages load in under 2 seconds.",
      service: "Web Design",
      ctaLabel: "Make my site fast",
      ctaHref: "/web-design-sonoma-county",
    };
  }
  if (seo !== null && seo < 50) {
    return {
      title: "Fix your SEO foundation",
      why: "Core SEO basics are missing, so Google can't understand or rank your pages. You're invisible for the searches that matter.",
      action: "Set proper titles, descriptions, headings, and schema so you rank for what customers actually search.",
      service: "Web Design",
      ctaLabel: "Improve my SEO",
      ctaHref: "/web-design-sonoma-county",
    };
  }
  if (social < 50) {
    return {
      title: "Build an active social presence",
      why: "We found little to no social presence linked from your site. Customers check social to confirm you're real and active before they buy.",
      action: "Connect and showcase the right 2–3 platforms, and keep them active so you stay top-of-mind.",
      service: "Web Design + Marketing",
      ctaLabel: "Grow my reach",
      ctaHref: "/#contact",
    };
  }
  if (branding < 60) {
    return {
      title: "Tighten your branding",
      why: "Inconsistent branding (icons, share images, identity) makes a real business look unfinished and forgettable.",
      action: "Polish your favicon, social share images, and brand identity so you look as professional as you are.",
      service: "Web Design",
      ctaLabel: "Polish my brand",
      ctaHref: "/web-design-sonoma-county",
    };
  }
  return {
    title: "Capture leads 24/7 with an AI assistant",
    why: "Your fundamentals are solid — the biggest gain now is converting more of the traffic you already get. Most missed leads happen after hours.",
    action: "Add an AI receptionist that answers calls and website chat, books appointments, and never misses a lead.",
    service: "AI Integration",
    ctaLabel: "See AI Integration",
    ctaHref: "/ai-integration-small-business",
  };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Donut({ score, label, size = 104 }: { score: number; label: string; size?: number }) {
  const r = size * 0.42;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#27272A" strokeWidth={size * 0.085} />
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
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={size * 0.24} fontWeight="bold">
          {score}
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
  const color = (s: Signal["severity"]) => (s === "pass" ? "text-green-400" : s === "warning" ? "text-orange-400" : "text-red-400");
  const bg = (s: Signal["severity"]) => (s === "pass" ? "bg-green-500/10" : s === "warning" ? "bg-orange-500/10" : "bg-red-500/10");
  return (
    <div className="space-y-0 rounded-xl overflow-hidden border border-zinc-800">
      {signals.map((s, i) => (
        <div key={i} className={`flex items-start gap-3 px-4 py-3 bg-[#18181B] ${i < signals.length - 1 ? "border-b border-zinc-800" : ""}`}>
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

function CategoryCard({ score, title, icon, signals, defaultOpen = false }: { score: number; title: string; icon: string; signals: Signal[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-zinc-800/40 transition-colors">
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

// ── Page ────────────────────────────────────────────────────────────────────

export default function BusinessAnalysisPage() {
  const [phase, setPhase] = useState<Phase>("intake");
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
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

    // Capture the lead immediately (hybrid: instant report + Duke follow-up).
    void fetch("/api/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        name: businessName.trim(),
        context: `Free Business Analysis — ${businessName.trim() || "business"} (${url})`,
      }),
    }).catch(() => {});

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

  const improvement = biggestImprovement({
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
    <div className="min-h-screen bg-[#18181B] text-white">
      <Nav />

      {/* ── Hero / intake ──────────────────────────────────────────────────── */}
      {phase === "intake" && (
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
              Free — No cost, no obligation
            </span>
            <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Your free <span className="text-orange-400">business analysis</span>
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
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
              />
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="yourwebsite.com"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
              />
              {error && <p className="text-red-400 text-xs px-1">{error}</p>}
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold px-7 py-4 rounded-xl transition-colors text-sm"
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
                <div key={c.label} className="bg-zinc-900 border border-zinc-800 rounded-xl py-4 px-2">
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
            <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-black mb-2" style={{ fontFamily: "var(--font-heading)" }}>Analyzing {businessName.trim() || "your business"}…</h2>
            <p className="text-zinc-400 text-sm">{scanLabel || "Running checks across your online presence."}</p>
          </div>
        </section>
      )}

      {/* ── Results ─────────────────────────────────────────────────────────── */}
      {phase === "results" && (
        <>
          <section className="pt-28 pb-6 px-6">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-zinc-500 text-xs mb-2 break-all">
                Analysis for <span className="text-zinc-300">{businessName.trim() || presence?.social[0]?.url || website}</span>
              </p>
              <div className="inline-flex items-center gap-5 bg-zinc-900 border border-zinc-800 rounded-2xl px-8 py-5 mt-3">
                <div className="text-center">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">Overall</p>
                  <p className="font-black leading-none" style={{ fontSize: "3.5rem", color: scoreColor(overall) }}>{letterGrade(overall)}</p>
                </div>
                <div className="w-px h-14 bg-zinc-800" />
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
              <div className="rounded-2xl p-7 sm:p-9" style={{ border: "1px solid #F97316", background: "linear-gradient(135deg, #1C1917 0%, #18181B 100%)" }}>
                <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-3">⭐ Your biggest opportunity</p>
                <h2 className="text-white text-2xl sm:text-3xl font-black mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                  {improvement.title}
                </h2>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-4">{improvement.why}</p>
                <div className="bg-black/30 border border-zinc-800 rounded-xl p-4 mb-5">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-wider mb-1">What to do</p>
                  <p className="text-white text-sm">{improvement.action}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={improvement.ctaHref} className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-400 text-white font-bold px-7 py-3.5 rounded-xl transition-colors text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                    {improvement.ctaLabel} →
                  </Link>
                  <Link href="/#contact" className="inline-flex items-center justify-center border border-zinc-700 hover:border-zinc-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                    Talk it through with Duke
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Category breakdown */}
          <section className="px-6 pb-6">
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center py-6">
                <Donut score={websiteScore} label="Website" />
                <Donut score={localScore} label="Google / Local" />
                <Donut score={socialScore} label="Social" />
                <Donut score={brandingScore} label="Branding" />
              </div>

              <div className="space-y-4">
                <CategoryCard score={websiteScore} title="Website" icon="🌐" signals={websiteSignals} />
                {presence && <CategoryCard score={localScore} title="Google / Local Presence" icon="📍" signals={presence.local.signals} />}
                {presence && <CategoryCard score={socialScore} title="Social Media" icon="📱" signals={presence.socialSignals} />}
                {presence && <CategoryCard score={brandingScore} title="Branding" icon="✨" signals={presence.branding.signals} />}
              </div>
            </div>
          </section>

          {/* Follow-up note + CTA */}
          <section className="px-6 pb-20">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-7 text-center">
                <h3 className="text-white text-xl font-black mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  Want the full picture?
                </h3>
                <p className="text-zinc-400 text-sm mb-5 max-w-lg mx-auto">
                  This instant scan covers the basics. Duke will personally review your Google Business Profile, social
                  activity, and branding in depth — and email {email.trim() ? <span className="text-zinc-200">{email.trim()}</span> : "you"} a
                  full report with a prioritized action plan. Free, no obligation.
                </p>
                <Link href="/schedule" className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                  Book a free 30-min call
                </Link>
                <p className="text-zinc-600 text-xs mt-4">Or call/text Duke directly at (707) 239-6725</p>
              </div>
            </div>
          </section>
        </>
      )}

      <Footer />
      <div className="h-16 md:hidden" aria-hidden="true" />
    </div>
  );
}
