"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Gauge, Globe, Loader2, Zap, ArrowRight, AlertCircle,
  Calculator, PhoneMissed, Activity, Mail, Check, RotateCcw,
} from "lucide-react";
import { RevealOnScroll, useReducedMotion } from "@/components/motion";
import { track } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";

// ── Audit API response shape (mirrors src/app/api/audit/route.ts) ──
interface AuditData {
  url: string;
  score: number;
  fetchTime?: string;
  metrics: {
    fcp: Metric; lcp: Metric; tbt: Metric; cls: Metric; si: Metric; tti: Metric;
  };
  opportunities: {
    title?: string;
    description?: string;
    displayValue?: string;
    score?: number | null;
  }[];
}
type Metric = { value: string; score: number | null; title: string };

const H = { fontFamily: "var(--font-heading)" };
const BODY = { fontFamily: "var(--font-body)" };
// Numerals: tabular for stable count-up width (no mono font is wired site-wide).
const NUM = { fontFamily: "var(--font-heading)", fontVariantNumeric: "tabular-nums" } as const;

// Copper is rationed: score colors stay within the brand, only red signals failure.
function scoreColor(score: number) {
  if (score >= 90) return "var(--copper-bright)";
  if (score >= 50) return "var(--copper)";
  return "#E5604D"; // functional red only — a genuinely failing score
}
function scoreLabel(score: number) {
  if (score >= 90) return "Good";
  if (score >= 50) return "Needs work";
  return "Poor";
}
function metricColor(score: number | null) {
  if (score === null) return "var(--text-3)";
  if (score >= 0.9) return "var(--copper-bright)";
  if (score >= 0.5) return "var(--copper)";
  return "#E5604D";
}

// Secondary bento tiles — real working tool routes.
const moreTools = [
  {
    href: "/pricing",
    icon: Calculator,
    title: "Build your plan",
    desc: "Pick a website package and care plan and see your price — no sales call.",
    cta: "Open the builder",
  },
  {
    href: "/it-health-check",
    icon: Activity,
    title: "IT health check",
    desc: "A 2-minute quiz that flags the security and IT risks hiding in your business.",
    cta: "Take the quiz",
  },
  {
    href: "/tools/missed-call-calculator",
    icon: PhoneMissed,
    title: "Missed-call calculator",
    desc: "Estimate the revenue you lose every month from calls that go unanswered.",
    cta: "Run the numbers",
  },
];

export default function ToolsTeaser() {
  const reduceMotion = useReducedMotion();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AuditData | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  async function runAudit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const json = await res.json();

      if (!res.ok) {
        // 429 quota / 400 invalid / 502 unavailable all return { error }.
        setError(json.error || "Audit failed — please try again.");
      } else {
        setData(json);
        track("audit_run", {
          location: "home_bento",
          score: typeof json.score === "number" ? json.score : null,
        });
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 120);
      }
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setData(null);
    setError(null);
    setUrl("");
  }

  return (
    <section className="bg-ink-0 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <RevealOnScroll direction="up" className="mx-auto mb-12 max-w-2xl text-center">
          <span
            className="mb-6 inline-block rounded-full border border-copper-dim px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-copper-bright"
            style={{ ...H, backgroundColor: "rgba(192,122,62,0.10)" }}
          >
            Free tools · No signup
          </span>
          <h2 className="mb-4 text-3xl font-bold text-warm sm:text-4xl" style={H}>
            See exactly where you stand
          </h2>
          <p className="text-lg text-warm-2" style={BODY}>
            Run the instant site audit below — no email wall, no sales call. Then explore
            the other free tools when you&apos;re ready.
          </p>
        </RevealOnScroll>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
          {/* CENTERPIECE — Instant Site Audit (spans 2 cols on desktop) */}
          <RevealOnScroll
            direction="up"
            distance={24}
            className="lg:col-span-2"
            as="div"
          >
            <div
              ref={resultsRef}
              className="surface-2 flex h-full flex-col rounded-3xl p-6 sm:p-8"
            >
              {!data ? (
                <AuditIntake
                  url={url}
                  setUrl={setUrl}
                  loading={loading}
                  error={error}
                  onSubmit={runAudit}
                />
              ) : (
                <AuditReport
                  data={data}
                  reduceMotion={!!reduceMotion}
                  onReset={reset}
                />
              )}
            </div>
          </RevealOnScroll>

          {/* Tall secondary tile — plan builder gets visual priority */}
          <RevealOnScroll direction="up" distance={24} delay={0.08} as="div">
            <Link
              href={moreTools[0].href}
              onClick={() => track("tool_open", { tool: "plan_builder", location: "home_bento" })}
              className="group flex h-full flex-col justify-between rounded-3xl border border-hairline bg-ink-2 p-6 transition-colors hover:border-copper-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-glow"
            >
              <div>
                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-copper-dim text-copper-bright" style={{ backgroundColor: "rgba(192,122,62,0.12)" }}>
                  <Calculator size={19} strokeWidth={2} aria-hidden />
                </span>
                <h3 className="mb-2 text-lg font-bold text-warm" style={H}>
                  {moreTools[0].title}
                </h3>
                <p className="text-sm leading-relaxed text-warm-2" style={BODY}>
                  {moreTools[0].desc}
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-copper-bright" style={H}>
                {moreTools[0].cta}
                <ArrowRight
                  size={15}
                  className="-translate-x-0.5 transition-transform group-hover:translate-x-0 motion-reduce:transition-none"
                  aria-hidden
                />
              </span>
            </Link>
          </RevealOnScroll>

          {/* Bottom row — two compact tool tiles */}
          {moreTools.slice(1).map((t, i) => (
            <RevealOnScroll
              key={t.href}
              direction="up"
              distance={24}
              delay={0.12 + i * 0.06}
              as="div"
              className={i === 0 ? "lg:col-span-2" : ""}
            >
              <Link
                href={t.href}
                onClick={() => track("tool_open", { tool: t.href, location: "home_bento" })}
                className="group flex h-full flex-col rounded-3xl border border-hairline bg-ink-1 p-6 transition-colors hover:border-copper-dim hover:bg-ink-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper-glow sm:flex-row sm:items-center sm:gap-5"
              >
                <span className="mb-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-copper-dim text-copper-bright sm:mb-0" style={{ backgroundColor: "rgba(192,122,62,0.12)" }}>
                  <t.icon size={19} strokeWidth={2} aria-hidden />
                </span>
                <div className="flex-1">
                  <h3 className="mb-1.5 flex items-center gap-1.5 text-base font-bold text-warm" style={H}>
                    {t.title}
                    <ArrowRight
                      size={14}
                      className="-translate-x-1 text-copper opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
                      aria-hidden
                    />
                  </h3>
                  <p className="text-sm leading-relaxed text-warm-2" style={BODY}>
                    {t.desc}
                  </p>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        {/* View all */}
        <div className="mt-10 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-warm-2 transition-colors hover:text-copper-bright focus-visible:outline-none focus-visible:text-copper-bright"
            style={H}
          >
            View all free tools <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Audit intake (URL form) ───────────────────────── */

function AuditIntake({
  url, setUrl, loading, error, onSubmit,
}: {
  url: string;
  setUrl: (v: string) => void;
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const features = ["Speed score", "Core Web Vitals", "Top issues to fix"];
  return (
    <div className="flex h-full flex-col justify-center">
      <span
        className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-copper-dim px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-copper-bright"
        style={{ ...H, backgroundColor: "rgba(192,122,62,0.12)" }}
      >
        <Gauge size={13} strokeWidth={2.5} aria-hidden />
        Instant site audit
      </span>
      <h3 className="mb-2.5 text-2xl font-bold text-warm sm:text-3xl" style={H}>
        How fast is your website?
      </h3>
      <p className="mb-6 max-w-md text-base text-warm-2" style={BODY}>
        A slow site quietly costs you customers and search rankings. Enter your URL for a
        free Google PageSpeed audit in seconds.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="group relative flex-1">
          <Globe
            size={18}
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-warm-3 transition-colors group-focus-within:text-copper-bright"
          />
          <input
            type="text"
            inputMode="url"
            autoComplete="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourwebsite.com"
            aria-label="Website URL to audit"
            disabled={loading}
            className="w-full rounded-full border border-hairline bg-ink-0 py-3.5 pl-11 pr-5 text-[15px] text-warm outline-none transition-all placeholder:text-warm-3 hover:border-copper-dim focus:border-copper focus:ring-4 focus:ring-copper-glow disabled:opacity-60"
            style={BODY}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-copper px-7 py-3.5 text-sm font-bold text-ink-0 transition-all hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-copper-glow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-copper motion-safe:active:scale-[0.98]"
          style={H}
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin motion-reduce:hidden" aria-hidden /> Analyzing…</>
          ) : (
            <><Zap size={16} strokeWidth={2.5} aria-hidden /> Run free audit</>
          )}
        </button>
      </form>

      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-2xl border border-[#E5604D]/30 bg-[#E5604D]/10 px-4 py-3 text-left text-sm text-[#F0A99C]"
          style={BODY}
        >
          <AlertCircle size={17} className="mt-0.5 shrink-0" style={{ color: "#E5604D" }} aria-hidden />
          <span>{error}</span>
        </div>
      )}

      {!error && (
        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-warm-3" style={BODY}>
          {features.map((f) => (
            <li key={f} className="inline-flex items-center gap-1.5">
              <Check size={13} className="text-copper" aria-hidden /> {f}
            </li>
          ))}
        </ul>
      )}

      {loading && (
        <div aria-hidden className="mt-6 grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl border border-hairline bg-ink-1 motion-safe:animate-pulse"
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Audit report (results) ───────────────────────── */

function AuditReport({
  data, reduceMotion, onReset,
}: {
  data: AuditData;
  reduceMotion: boolean;
  onReset: () => void;
}) {
  const display = useCountUp(data.score, reduceMotion);
  const color = scoreColor(data.score);

  const vitals: { key: keyof AuditData["metrics"]; short: string }[] = [
    { key: "lcp", short: "LCP" },
    { key: "cls", short: "CLS" },
    { key: "tbt", short: "TBT" },
    { key: "fcp", short: "FCP" },
    { key: "si", short: "Speed" },
    { key: "tti", short: "TTI" },
  ];
  const issues = data.opportunities.filter((o) => o.title).slice(0, 3);

  return (
    <div>
      {/* Score + host */}
      <div className="flex items-center gap-5 border-b border-hairline pb-6">
        <div
          className="relative grid h-24 w-24 shrink-0 place-items-center rounded-full"
          style={{ border: `4px solid ${color}`, background: `color-mix(in srgb, ${color} 12%, transparent)` }}
        >
          <span className="text-3xl font-extrabold leading-none" style={{ ...NUM, color }}>
            {display}
          </span>
        </div>
        <div className="min-w-0">
          <p className="mb-0.5 truncate text-xs text-warm-3" style={BODY} title={data.url}>
            {prettyHost(data.url)}
          </p>
          <p className="text-xl font-bold text-warm" style={H}>
            Performance: <span style={{ color }}>{scoreLabel(data.score)}</span>
          </p>
          <p className="mt-0.5 text-xs text-warm-3" style={BODY}>
            Google uses this score as a ranking signal.
          </p>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-3 gap-2.5 py-6 sm:grid-cols-6">
        {vitals.map(({ key, short }) => {
          const m = data.metrics[key];
          return (
            <div key={key} className="rounded-xl border border-hairline bg-ink-1 px-2.5 py-3 text-center">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-warm-3" style={H}>
                {short}
              </p>
              <p className="text-sm font-bold leading-tight" style={{ ...NUM, color: metricColor(m.score) }}>
                {m.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Top issues */}
      {issues.length > 0 && (
        <div className="border-t border-hairline pt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-warm-3" style={H}>
            Top issues to fix
          </p>
          <ul className="space-y-2.5">
            {issues.map((o, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm" style={BODY}>
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" aria-hidden />
                <span className="text-warm-2">
                  <span className="font-semibold text-warm">{o.title}</span>
                  {o.displayValue ? <span className="text-warm-3"> — {o.displayValue}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Email-the-report capture + reset */}
      <EmailReport url={data.url} auditData={data} />

      <button
        type="button"
        onClick={onReset}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-warm-3 transition-colors hover:text-copper-bright focus-visible:outline-none focus-visible:text-copper-bright"
        style={H}
      >
        <RotateCcw size={12} aria-hidden /> Audit another site
      </button>
    </div>
  );
}

/* ─────────────────── Email the full report (lead capture) ─────────────────── */

function EmailReport({ url, auditData }: { url: string; auditData: AuditData }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || state === "sending") return;

    setState("sending");
    setMsg(null);
    try {
      const res = await fetch("/api/audit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), url, auditData }),
      });
      const json = await res.json().catch(() => ({}));

      if (res.ok && json.ok) {
        setState("done");
        track("audit_lead", { location: "home_bento", score: auditData.score });
        return;
      }
      throw new Error(json.error || "send_failed");
    } catch {
      // Graceful fallback: still bank the lead via /api/capture so a Resend or
      // quota hiccup never loses a hand-raiser. Either path = the lead lands.
      try {
        const res2 = await fetch("/api/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            website: url,
            context: `Instant site audit — score ${auditData.score}/100 for ${url}`,
            attribution: getAttribution(),
          }),
        });
        if (res2.ok) {
          setState("done");
          track("audit_lead", { location: "home_bento", fallback: true, score: auditData.score });
          return;
        }
        const j2 = await res2.json().catch(() => ({}));
        throw new Error(j2.error || "capture_failed");
      } catch {
        setState("error");
        setMsg("Couldn't send right now — call or text (707) 239-6725 and we'll send it over.");
      }
    }
  }

  if (state === "done") {
    return (
      <div
        className="mt-6 flex items-start gap-3 rounded-2xl border border-copper-dim px-4 py-3.5"
        style={{ backgroundColor: "rgba(192,122,62,0.10)" }}
        role="status"
      >
        <Check size={18} className="mt-0.5 shrink-0 text-copper-bright" aria-hidden />
        <p className="text-sm text-warm-2" style={BODY}>
          <span className="font-semibold text-warm">Report on its way.</span> Check your inbox
          for the full breakdown — we&apos;ll never spam you.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 rounded-2xl border border-hairline bg-ink-1 p-4 sm:p-5">
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-warm" style={H}>
        <Mail size={15} className="text-copper-bright" aria-hidden />
        Email me the full report
      </p>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@business.com"
          aria-label="Your email for the full audit report"
          disabled={state === "sending"}
          className="w-full flex-1 rounded-full border border-hairline bg-ink-0 px-5 py-3 text-[15px] text-warm outline-none transition-all placeholder:text-warm-3 hover:border-copper-dim focus:border-copper focus:ring-4 focus:ring-copper-glow disabled:opacity-60"
          style={BODY}
        />
        <button
          type="submit"
          disabled={state === "sending" || !email.includes("@")}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-copper px-6 py-3 text-sm font-bold text-ink-0 transition-all hover:bg-copper-bright focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-copper-glow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-copper motion-safe:active:scale-[0.98]"
          style={H}
        >
          {state === "sending" ? (
            <><Loader2 size={15} className="animate-spin motion-reduce:hidden" aria-hidden /> Sending…</>
          ) : (
            "Send report"
          )}
        </button>
      </div>
      {state === "error" && msg && (
        <p role="alert" className="mt-2.5 flex items-start gap-2 text-xs text-[#F0A99C]" style={BODY}>
          <AlertCircle size={14} className="mt-px shrink-0" style={{ color: "#E5604D" }} aria-hidden />
          {msg}
        </p>
      )}
    </form>
  );
}

/* ───────────────────────────── helpers ───────────────────────────── */

// rAF count-up to the score; reduced-motion snaps to the final value instantly.
// (AuditReport only mounts once data arrives, so `target` is stable per instance.)
function useCountUp(target: number, reduceMotion: boolean) {
  const [value, setValue] = useState(reduceMotion ? target : 0);

  useEffect(() => {
    // Reduced motion: the initial state already holds the final value — nothing
    // to animate, and we never setState synchronously inside the effect.
    if (reduceMotion) return;

    let raf = 0;
    const start = performance.now();
    const dur = 900;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduceMotion]);

  return value;
}

function prettyHost(u: string) {
  try {
    return new URL(u).host.replace(/^www\./, "");
  } catch {
    return u.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
  }
}
