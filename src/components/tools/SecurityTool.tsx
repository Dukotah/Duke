"use client";

import { useState } from "react";
import Link from "next/link";
import type { ComplianceData, ComplianceIssue } from "@/app/api/compliance/route";

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 80) return "#22C55E";
  if (score >= 50) return "#F97316";
  return "#EF4444";
}

function ScoreCircle({ score, label, size = 110 }: { score: number; label: string; size?: number }) {
  const r = size * 0.42;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#27272A" strokeWidth={size * 0.08} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color}
          strokeWidth={size * 0.08}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
          fill={color} fontSize={size * 0.22} fontWeight="bold">{score}</text>
      </svg>
      <span className="text-sm text-zinc-300 font-semibold text-center">{label}</span>
      <span className="text-xs text-zinc-500">
        {score >= 80 ? "Good" : score >= 50 ? "Needs Work" : "Critical Issues"}
      </span>
    </div>
  );
}

function IssueRow({ issue }: { issue: ComplianceIssue }) {
  const icons = { pass: "✓", warning: "⚠", error: "✗" } as const;
  const colors = {
    pass: { text: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
    warning: { text: "text-copper-bright", bg: "bg-copper/10", border: "border-copper/20" },
    error: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  } as const;
  const c = colors[issue.severity];
  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-hairline last:border-0 bg-ink-1">
      <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${c.bg} ${c.text} border ${c.border}`}>
        {icons[issue.severity]}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-white text-xs font-semibold">{issue.label}</p>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${c.bg} ${c.text}`}>
            {issue.category}
          </span>
        </div>
        <p className="text-zinc-500 text-xs mt-0.5">{issue.detail}</p>
      </div>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-2 py-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-3 bg-ink-3 rounded animate-pulse" style={{ width: `${60 + i * 10}%` }} />
      ))}
    </div>
  );
}

// ── Main Tool ─────────────────────────────────────────────────────────────────

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; data: ComplianceData }
  | { status: "error"; message: string };

function normalizeUrl(url: string) {
  let u = url.trim();
  if (!u.startsWith("http://") && !u.startsWith("https://")) u = "https://" + u;
  return u;
}

export default function SecurityTool() {
  const [inputUrl, setInputUrl] = useState("");
  const [state, setState] = useState<State>({ status: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputUrl.trim() || state.status === "loading") return;
    const url = normalizeUrl(inputUrl);
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/compliance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Check failed");
      setState({ status: "done", data: json as ComplianceData });
    } catch (err) {
      setState({ status: "error", message: err instanceof Error ? err.message : "Check failed" });
    }
  }

  const adaIssues = state.status === "done" ? state.data.issues.filter(i => i.category === "ADA") : [];
  const hipaaIssues = state.status === "done" ? state.data.issues.filter(i => i.category === "HIPAA") : [];

  return (
    <div className="text-white">
      {/* Hero */}
      <section className="pt-6 pb-12 px-0 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-copper/10 text-copper-bright text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-copper/20">
            Free Tool
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            ADA &amp; HIPAA{" "}
            <span className="text-copper-bright">Compliance Checker</span>
          </h1>
          <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
            Instantly scan your website for ADA accessibility issues (WCAG) and HIPAA privacy
            indicators. Get a clear report with actionable fixes — free, no signup.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="text"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              placeholder="yourwebsite.com"
              disabled={state.status === "loading"}
              className="flex-1 bg-ink-2 border border-hairline rounded-full px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-copper focus:border-copper transition-colors text-sm"
            />
            <button
              type="submit"
              disabled={state.status === "loading" || !inputUrl.trim()}
              className="bg-copper hover:bg-copper-bright disabled:opacity-50 disabled:cursor-not-allowed text-ink-0 font-bold px-7 py-3.5 rounded-full transition-colors text-sm whitespace-nowrap"
            >
              {state.status === "loading" ? "Scanning…" : "Check Compliance"}
            </button>
          </form>

          {state.status === "loading" && (
            <p className="text-zinc-500 text-xs mt-4">Fetching and analyzing your page — usually under 15 seconds</p>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="px-6 pb-6">
        <div className="max-w-3xl mx-auto bg-ink-2 border border-hairline rounded-xl px-5 py-3 text-xs text-zinc-500 text-center">
          <strong className="text-zinc-400">Disclaimer:</strong> This tool performs automated HTML analysis and checks for common indicators. It is not a substitute for a professional ADA or HIPAA audit. Results should be reviewed by a qualified accessibility or compliance expert.
        </div>
      </div>

      {/* Loading state */}
      {state.status === "loading" && (
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-ink-2 border border-hairline rounded-2xl p-5">
              <LoadingRows />
            </div>
          </div>
        </section>
      )}

      {/* Error state */}
      {state.status === "error" && (
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-6 py-5 text-center">
              <p className="text-red-400 font-semibold mb-1">Scan failed</p>
              <p className="text-zinc-400 text-sm">{state.message}</p>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {state.status === "done" && (
        <section className="px-6 pb-16">
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-zinc-500 text-xs text-center break-all">
              Scanned: <span className="text-zinc-300">{state.data.url}</span>
            </p>

            {/* Score cards */}
            <div className="bg-ink-2 border border-hairline rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-12">
                <ScoreCircle score={state.data.adaScore} label="ADA / WCAG Score" size={130} />
                <div className="hidden sm:block w-px h-24 bg-ink-3" />
                <ScoreCircle score={state.data.hipaaScore} label="HIPAA Readiness Score" size={130} />
              </div>
              <p className="text-zinc-600 text-xs text-center mt-6">
                Scores are based on automatically detectable indicators. A score of 100 does not guarantee full compliance.
              </p>
            </div>

            {/* ADA Issues */}
            <div className="bg-ink-2 border border-hairline rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-hairline">
                <span className="text-xl">♿</span>
                <h3 className="text-white font-bold text-sm flex-1">ADA / WCAG Accessibility</h3>
                <span className="text-xs font-semibold" style={{ color: scoreColor(state.data.adaScore) }}>
                  {adaIssues.filter(i => i.severity === "error").length} errors · {adaIssues.filter(i => i.severity === "warning").length} warnings
                </span>
              </div>
              <div className="divide-y divide-hairline">
                {adaIssues.map(issue => <IssueRow key={issue.id} issue={issue} />)}
              </div>
            </div>

            {/* HIPAA Issues */}
            <div className="bg-ink-2 border border-hairline rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-hairline">
                <span className="text-xl">🏥</span>
                <h3 className="text-white font-bold text-sm flex-1">HIPAA Privacy Indicators</h3>
                <span className="text-xs font-semibold" style={{ color: scoreColor(state.data.hipaaScore) }}>
                  {hipaaIssues.filter(i => i.severity === "error").length} errors · {hipaaIssues.filter(i => i.severity === "warning").length} warnings
                </span>
              </div>
              <div className="divide-y divide-hairline">
                {hipaaIssues.map(issue => <IssueRow key={issue.id} issue={issue} />)}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl p-6 text-center" style={{ border: "1px solid #C68A5A", background: "linear-gradient(135deg, #18181B 0%, #1C1917 100%)" }}>
              <p className="text-copper-bright text-xs font-semibold uppercase tracking-wider mb-2">Need Expert Help?</p>
              <h4 className="text-white text-xl font-black mb-2">We Can Fix These Issues</h4>
              <p className="text-zinc-400 text-sm mb-5 max-w-sm mx-auto">
                Copper Bay Tech can remediate ADA accessibility issues and help prepare your site for HIPAA compliance review. Get a free consultation.
              </p>
              <Link
                href="/#contact"
                className="inline-block bg-copper hover:bg-copper-bright text-ink-0 font-bold px-8 py-3 rounded-full transition-colors text-sm"
              >
                Get a Free Consultation
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* What gets checked — idle state */}
      {state.status === "idle" && (
        <section className="px-6 pb-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-8">
              What Gets Checked
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-ink-2 border border-hairline rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">♿</span>
                  <h3 className="text-white font-bold text-sm">ADA / WCAG Accessibility</h3>
                </div>
                <ul className="space-y-2 text-xs text-zinc-400">
                  {[
                    "Image alt text for screen readers",
                    "Form field labels",
                    "HTML language attribute",
                    "Skip navigation link",
                    "ARIA landmarks / <main> element",
                    "Heading hierarchy (H1–H6)",
                    "Descriptive link text",
                    "Table header cells",
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-copper flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-ink-2 border border-hairline rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🏥</span>
                  <h3 className="text-white font-bold text-sm">HIPAA Privacy Indicators</h3>
                </div>
                <ul className="space-y-2 text-xs text-zinc-400">
                  {[
                    "HTTPS / encrypted connection",
                    "Privacy policy presence",
                    "Terms of service",
                    "Cookie / tracking disclosure",
                    "Contact information",
                    "Form security (HTTP + forms = risk)",
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-copper flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
