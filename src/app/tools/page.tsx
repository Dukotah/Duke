"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// ── Types ────────────────────────────────────────────────────────────────────

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
  title: string;
  description: string;
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
  url: string;
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex justify-center py-10">
      <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="mt-5 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-3 text-red-400 text-sm">
      {msg}
    </div>
  );
}

function UrlForm({
  url,
  setUrl,
  loading,
  onSubmit,
  placeholder,
  buttonLabel,
}: {
  url: string;
  setUrl: (v: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  buttonLabel?: string;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={placeholder ?? "yourwebsite.com"}
        disabled={loading}
        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
      />
      <button
        type="submit"
        disabled={loading || !url.trim()}
        className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-7 py-3.5 rounded-full transition-colors text-sm whitespace-nowrap"
      >
        {loading ? "Checking…" : (buttonLabel ?? "Check")}
      </button>
    </form>
  );
}

// ── Score Circle (reused for SEO + Mobile) ───────────────────────────────────

function ScoreCircle({ score, label, size = 120 }: { score: number; label: string; size?: number }) {
  const r = size * 0.45;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? "#22C55E" : score >= 50 ? "#F97316" : "#EF4444";
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#27272A" strokeWidth={size * 0.08} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={size * 0.08}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={size * 0.22} fontWeight="bold">
          {score}
        </text>
      </svg>
      <span className="text-xs text-zinc-400 text-center">{label}</span>
    </div>
  );
}

// ── SSL Tab ───────────────────────────────────────────────────────────────────

function SSLTab() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SSLData | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true); setError(null); setData(null);
    try {
      const res = await fetch("/api/ssl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "SSL check failed"); return; }
      if (json.error) { setError(json.error); return; }
      setData(json);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  const expiryColor = data
    ? data.daysUntilExpiry < 0
      ? "text-red-400"
      : data.daysUntilExpiry < 10
      ? "text-red-400"
      : data.daysUntilExpiry < 30
      ? "text-orange-400"
      : "text-green-400"
    : "";

  return (
    <div>
      <UrlForm url={url} setUrl={setUrl} loading={loading} onSubmit={handleSubmit} buttonLabel="Check SSL" />
      {error && <ErrorBox msg={error} />}
      {loading && <Spinner />}
      {data && (
        <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          {/* Valid / Invalid badge */}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${data.valid && !data.error ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
              {data.valid && !data.error ? "✓" : "✗"}
            </div>
            <div>
              <p className="text-white font-bold text-lg">{data.valid && !data.error ? "SSL Certificate Valid" : "SSL Issue Detected"}</p>
              <p className="text-zinc-400 text-sm">{data.hostname}</p>
            </div>
          </div>

          {!data.error && (
            <div className="grid sm:grid-cols-3 gap-4 pt-2 border-t border-zinc-800">
              <div className="bg-[#18181B] rounded-xl p-4">
                <p className="text-zinc-500 text-xs mb-1">Days Until Expiry</p>
                <p className={`text-2xl font-black ${expiryColor}`}>{data.daysUntilExpiry}</p>
                <p className="text-zinc-500 text-xs mt-1">
                  {data.daysUntilExpiry < 0 ? "Expired" : data.daysUntilExpiry < 10 ? "Critical" : data.daysUntilExpiry < 30 ? "Renew Soon" : "Good"}
                </p>
              </div>
              <div className="bg-[#18181B] rounded-xl p-4">
                <p className="text-zinc-500 text-xs mb-1">Expires At</p>
                <p className="text-white font-bold text-sm">
                  {data.expiresAt ? new Date(data.expiresAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                </p>
              </div>
              <div className="bg-[#18181B] rounded-xl p-4">
                <p className="text-zinc-500 text-xs mb-1">Issuer</p>
                <p className="text-white font-bold text-sm truncate">{data.issuer || "Unknown"}</p>
              </div>
            </div>
          )}

          {data.error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{data.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── SEO Tab ───────────────────────────────────────────────────────────────────

function SEOTab() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SEOData | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true); setError(null); setData(null);
    try {
      const res = await fetch("/api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "SEO check failed"); return; }
      setData(json);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  const severityIcon = (s: SEOIssue["severity"]) =>
    s === "pass" ? "✓" : s === "warning" ? "⚠" : "✗";
  const severityColor = (s: SEOIssue["severity"]) =>
    s === "pass" ? "text-green-400" : s === "warning" ? "text-orange-400" : "text-red-400";
  const severityBg = (s: SEOIssue["severity"]) =>
    s === "pass" ? "bg-green-500/10" : s === "warning" ? "bg-orange-500/10" : "bg-red-500/10";

  return (
    <div>
      <UrlForm url={url} setUrl={setUrl} loading={loading} onSubmit={handleSubmit} buttonLabel="Analyze SEO" />
      {error && <ErrorBox msg={error} />}
      {loading && <Spinner />}
      {data && (
        <div className="mt-6 space-y-5">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
            <ScoreCircle score={data.score} label="SEO Score" size={100} />
            <div>
              <p className="text-white font-bold text-lg">{data.url}</p>
              <p className="text-zinc-400 text-sm mt-1">
                {data.issues.filter((i) => i.severity === "pass").length} passed ·{" "}
                {data.issues.filter((i) => i.severity === "warning").length} warnings ·{" "}
                {data.issues.filter((i) => i.severity === "error").length} errors
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            {data.issues.map((issue, i) => (
              <div key={i} className={`flex items-start gap-3 px-5 py-4 ${i < data.issues.length - 1 ? "border-b border-zinc-800" : ""}`}>
                <span className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${severityBg(issue.severity)} ${severityColor(issue.severity)}`}>
                  {severityIcon(issue.severity)}
                </span>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold">{issue.label}</p>
                  <p className="text-zinc-400 text-xs mt-0.5 break-words">{issue.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Broken Links Tab ──────────────────────────────────────────────────────────

function LinksTab() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LinksData | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true); setError(null); setData(null);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Link check failed"); return; }
      setData(json);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <UrlForm url={url} setUrl={setUrl} loading={loading} onSubmit={handleSubmit} buttonLabel="Scan Links" />
      {error && <ErrorBox msg={error} />}
      {loading && (
        <div className="flex flex-col items-center py-10 gap-4">
          <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Scanning links — this may take up to 30 seconds…</p>
        </div>
      )}
      {data && (
        <div className="mt-6 space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total", value: data.total, color: "text-white" },
              { label: "OK", value: data.ok, color: "text-green-400" },
              { label: "Broken", value: data.broken.length, color: "text-red-400" },
              { label: "Redirects", value: data.redirects.length, color: "text-orange-400" },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-zinc-500 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Broken */}
          {data.broken.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-2">
                <span className="text-red-400 font-bold text-sm">Broken Links</span>
                <span className="bg-red-500/10 text-red-400 text-xs px-2 py-0.5 rounded-full">{data.broken.length}</span>
              </div>
              {data.broken.map((link, i) => (
                <div key={i} className={`px-5 py-3 flex items-start gap-3 ${i < data.broken.length - 1 ? "border-b border-zinc-800" : ""}`}>
                  <span className="bg-red-500/10 text-red-400 text-xs font-bold px-2 py-1 rounded flex-shrink-0">
                    {link.status === 0 ? "ERR" : link.status}
                  </span>
                  <div className="min-w-0">
                    <p className="text-zinc-300 text-xs break-all">{link.url}</p>
                    {link.text && link.text !== link.url && (
                      <p className="text-zinc-500 text-xs mt-0.5 truncate">"{link.text}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Redirects */}
          {data.redirects.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-2">
                <span className="text-orange-400 font-bold text-sm">Redirects</span>
                <span className="bg-orange-500/10 text-orange-400 text-xs px-2 py-0.5 rounded-full">{data.redirects.length}</span>
              </div>
              {data.redirects.map((link, i) => (
                <div key={i} className={`px-5 py-3 flex items-start gap-3 ${i < data.redirects.length - 1 ? "border-b border-zinc-800" : ""}`}>
                  <span className="bg-orange-500/10 text-orange-400 text-xs font-bold px-2 py-1 rounded flex-shrink-0">
                    {link.status}
                  </span>
                  <div className="min-w-0">
                    <p className="text-zinc-300 text-xs break-all">{link.url}</p>
                    {link.text && link.text !== link.url && (
                      <p className="text-zinc-500 text-xs mt-0.5 truncate">"{link.text}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.broken.length === 0 && data.redirects.length === 0 && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl px-6 py-5 text-green-400 text-sm text-center font-semibold">
              All {data.total} links checked are working correctly.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Mobile Tab ────────────────────────────────────────────────────────────────

function MobileTab() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MobileData | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true); setError(null); setData(null);
    try {
      const res = await fetch("/api/mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Mobile check failed"); return; }
      setData(json);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  const checkColor = (ok: boolean) => ok ? "text-green-400" : "text-red-400";
  const checkBg = (ok: boolean) => ok ? "bg-green-500/10" : "bg-red-500/10";
  const checkIcon = (ok: boolean) => ok ? "✓" : "✗";

  return (
    <div>
      <UrlForm url={url} setUrl={setUrl} loading={loading} onSubmit={handleSubmit} buttonLabel="Check Mobile" />
      <p className="text-zinc-500 text-xs mt-2">Powered by Google PageSpeed Insights — takes ~15 seconds</p>
      {error && <ErrorBox msg={error} />}
      {loading && (
        <div className="flex flex-col items-center py-10 gap-4">
          <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Running mobile analysis — this takes about 15 seconds…</p>
        </div>
      )}
      {data && (
        <div className="mt-6 space-y-5">
          {/* Score circles */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <ScoreCircle score={data.mobileScore} label="Overall Mobile" />
              <ScoreCircle score={data.accessibilityScore} label="Accessibility" />
              <ScoreCircle score={data.seoScore} label="SEO" />
              <ScoreCircle score={data.bestPracticesScore} label="Best Practices" />
            </div>
          </div>

          {/* Quick checks */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-800">
              <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Quick Checks</p>
            </div>
            {[
              { label: "Viewport Configured", desc: "Meta viewport tag present for mobile scaling", ok: data.viewport },
              { label: "Text Size Legible", desc: "Font sizes are readable without zooming", ok: data.textSizeOk },
              { label: "Tap Targets Sized Correctly", desc: "Buttons and links are large enough to tap", ok: data.tapTargetsOk },
            ].map((check, i) => (
              <div key={i} className={`flex items-center gap-4 px-5 py-4 ${i < 2 ? "border-b border-zinc-800" : ""}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${checkBg(check.ok)} ${checkColor(check.ok)}`}>
                  {checkIcon(check.ok)}
                </span>
                <div>
                  <p className="text-white text-sm font-semibold">{check.label}</p>
                  <p className="text-zinc-500 text-xs">{check.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Speed Audit Tab ───────────────────────────────────────────────────────────

function SpeedTab() {
  const [url, setUrl] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    window.location.href = `/audit?url=${encodeURIComponent(url.trim())}`;
  }

  return (
    <div>
      <UrlForm url={url} setUrl={setUrl} loading={false} onSubmit={handleSubmit} buttonLabel="Run Speed Audit" placeholder="yourwebsite.com" />
      <p className="text-zinc-500 text-xs mt-2">Powered by Google PageSpeed Insights — opens the full audit page</p>
      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {[
          { icon: "⚡", title: "Performance Score", desc: "Google's 0–100 score used in search rankings" },
          { icon: "📊", title: "Core Web Vitals", desc: "FCP, LCP, CLS, TBT — metrics Google actually measures" },
          { icon: "🔧", title: "Top Opportunities", desc: "Specific issues ranked by how much they hurt you" },
        ].map((item) => (
          <div key={item.title} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center">
            <div className="text-2xl mb-3">{item.icon}</div>
            <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
            <p className="text-zinc-500 text-xs">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: "speed", label: "Speed Audit" },
  { id: "ssl", label: "SSL Check" },
  { id: "seo", label: "SEO Inspector" },
  { id: "links", label: "Broken Links" },
  { id: "mobile", label: "Mobile Check" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("speed");

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
            Free Website{" "}
            <span className="text-orange-400">Audit Tools</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Check your site&apos;s speed, SSL certificate, SEO health, broken links, and mobile
            friendliness — all free, no signup needed. The same tools we use for our clients.
          </p>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          {/* Tab bar */}
          <div className="flex overflow-x-auto gap-1 mb-8 border-b border-zinc-800 pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none ${
                  activeTab === tab.id
                    ? "text-orange-400"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="min-h-[300px]">
            {activeTab === "speed" && <SpeedTab />}
            {activeTab === "ssl" && <SSLTab />}
            {activeTab === "seo" && <SEOTab />}
            {activeTab === "links" && <LinksTab />}
            {activeTab === "mobile" && <MobileTab />}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-3">
            Need Help Fixing What You Found?
          </h2>
          <p className="text-zinc-400 mb-6">
            Copper Bay Tech specialises in turning poor scores into high-performing websites. Get a free consultation.
          </p>
          <a
            href="/contact"
            className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-7 py-3.5 rounded-full transition-colors text-sm"
          >
            Get a Free Consultation
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
