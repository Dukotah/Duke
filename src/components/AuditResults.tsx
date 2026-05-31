"use client";

import { useRef } from "react";
import Link from "next/link";

interface Metric {
  value: string;
  score: number | null;
  title: string;
}

interface Opportunity {
  title?: string;
  description?: string;
  displayValue?: string;
  score?: number | null;
}

interface AuditData {
  url: string;
  score: number;
  fetchTime?: string;
  metrics: {
    fcp: Metric;
    lcp: Metric;
    tbt: Metric;
    cls: Metric;
    si: Metric;
    tti: Metric;
  };
  opportunities: Opportunity[];
}

function scoreColor(score: number | null): string {
  if (score === null) return "#71717A";
  if (score >= 0.9) return "#22C55E";
  if (score >= 0.5) return "#F97316";
  return "#EF4444";
}

function scoreLabel(score: number): { label: string; color: string; ring: string } {
  if (score >= 90) return { label: "Fast", color: "#22C55E", ring: "#22C55E" };
  if (score >= 50) return { label: "Needs Work", color: "#F97316", ring: "#F97316" };
  return { label: "Slow", color: "#EF4444", ring: "#EF4444" };
}

function ScoreCircle({ score }: { score: number }) {
  const { label, color, ring } = scoreLabel(score);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#27272A" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke={ring}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black" style={{ color }}>{score}</span>
          <span className="text-xs text-zinc-400 font-medium">/ 100</span>
        </div>
      </div>
      <span className="text-sm font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

function MetricCard({ metric, abbr }: { metric: Metric; abbr: string }) {
  const color = scoreColor(metric.score);
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">{abbr}</span>
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <div className="text-xl font-bold text-white">{metric.value}</div>
      <div className="text-xs text-zinc-500 truncate">{metric.title}</div>
    </div>
  );
}

export default function AuditResults({ data }: { data: AuditData }) {
  const ctaRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-8">
      {/* Score + summary */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <ScoreCircle score={data.score} />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-zinc-400 text-sm mb-1 break-all">{data.url}</p>
          <h3 className="text-2xl font-black text-white mb-2">
            Performance Score: {data.score}/100
          </h3>
          <p className="text-zinc-400 text-sm">
            {data.score >= 90
              ? "Your site is well-optimized. A few small tweaks could push it even further."
              : data.score >= 50
              ? "There are real performance issues hurting user experience and conversions. These are fixable."
              : "Critical performance problems are costing you visitors and sales. This needs immediate attention."}
          </p>
          {data.fetchTime && (
            <p className="text-zinc-600 text-xs mt-2">
              Tested {new Date(data.fetchTime).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Core Web Vitals */}
      <div>
        <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Core Web Vitals
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <MetricCard metric={data.metrics.fcp} abbr="FCP" />
          <MetricCard metric={data.metrics.lcp} abbr="LCP" />
          <MetricCard metric={data.metrics.tbt} abbr="TBT" />
          <MetricCard metric={data.metrics.cls} abbr="CLS" />
          <MetricCard metric={data.metrics.si} abbr="SI" />
          <MetricCard metric={data.metrics.tti} abbr="TTI" />
        </div>
      </div>

      {/* Opportunities */}
      {data.opportunities.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Top Issues Found
          </h4>
          <div className="space-y-3">
            {data.opportunities.map((opp, i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-4 items-start"
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: scoreColor(opp.score ?? null) }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-white font-semibold text-sm">{opp.title}</p>
                    {opp.displayValue && (
                      <span className="text-xs text-orange-400 font-mono shrink-0">
                        {opp.displayValue}
                      </span>
                    )}
                  </div>
                  {opp.description && (
                    <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{opp.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div
        ref={ctaRef}
        className="rounded-2xl p-6 text-center"
        style={{
          background: "linear-gradient(135deg, #18181B 0%, #1C1917 100%)",
          border: "1px solid #F97316",
        }}
      >
        <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Free Fix Consultation
        </p>
        <h4 className="text-white text-xl font-black mb-2">
          Want us to fix this?
        </h4>
        <p className="text-zinc-400 text-sm mb-5 max-w-sm mx-auto">
          Copper Bay Tech can resolve most performance issues in under a week. Get a
          free 30-minute call to see exactly what we&apos;d do.
        </p>
        <Link
          href="/#contact"
          className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm"
        >
          Get a Free Performance Review
        </Link>
      </div>
    </div>
  );
}
