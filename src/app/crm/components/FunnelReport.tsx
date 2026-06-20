"use client";

import { useEffect, useState, useCallback } from "react";
import { TrendingDown, BarChart2, Mail, RefreshCw, InboxIcon } from "lucide-react";

const H = { fontFamily: "var(--font-heading)" };

// ─── Types ────────────────────────────────────────────────────────────────────

interface FunnelStage {
  key: string;
  label: string;
  count: number;
  convPct: number;    // conversion from previous stage
  overallPct: number; // relative to first stage (leads)
}

interface FunnelData {
  stages: FunnelStage[];
  repCount: number;
}

interface TemplateRow {
  template: string;
  sent: number;
  opens: number;
  clicks: number;
  replies: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
}

interface TemplateData {
  templates: TemplateRow[];
}

// ─── Mini bar gauge ───────────────────────────────────────────────────────────

function RateBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div
        className="h-1.5 rounded-full bg-[var(--crm-surface-3)] overflow-hidden flex-1"
        style={{ minWidth: 40, maxWidth: 80 }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-[var(--crm-text-2)] w-8 shrink-0" style={H}>
        {pct}%
      </span>
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function SkeletonBlock({ h = "h-4", w = "w-full" }: { h?: string; w?: string }) {
  return (
    <div
      className={`${h} ${w} rounded-lg bg-[var(--crm-surface-3)] animate-pulse`}
      aria-hidden="true"
    />
  );
}

function FunnelSkeleton() {
  return (
    <div className="bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-2xl p-5 space-y-5">
      <SkeletonBlock h="h-4" w="w-36" />
      <div className="space-y-4">
        {[80, 62, 48, 34, 22].map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <SkeletonBlock h="h-3" w="w-32" />
            <div className="flex-1 h-8 rounded-lg bg-[var(--crm-surface-2)] animate-pulse" style={{ maxWidth: `${w}%` }} />
            <SkeletonBlock h="h-3" w="w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TemplateSkeleton() {
  return (
    <div className="bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-2xl p-5 space-y-4">
      <SkeletonBlock h="h-4" w="w-44" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 py-2 border-b border-[var(--crm-border)]">
            <SkeletonBlock h="h-3" w="w-1/3" />
            <SkeletonBlock h="h-3" w="w-10" />
            <SkeletonBlock h="h-1.5" w="w-20" />
            <SkeletonBlock h="h-1.5" w="w-20" />
            <SkeletonBlock h="h-1.5" w="w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Funnel Section ───────────────────────────────────────────────────────────

function FunnelSection({ data }: { data: FunnelData }) {
  const { stages } = data;
  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  const barColors = [
    "bg-[var(--crm-accent)]",
    "bg-orange-400",
    "bg-amber-400",
    "bg-yellow-400",
    "bg-lime-500",
    "bg-emerald-500",
  ];

  return (
    <div className="bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-2xl p-5 space-y-5">
      <div className="flex items-center gap-2">
        <TrendingDown size={14} className="text-[var(--crm-accent)]" aria-hidden="true" />
        <h3 className="text-sm font-bold text-[var(--crm-text)]" style={H}>
          Pipeline Funnel
        </h3>
        <span className="ml-auto text-xs text-[var(--crm-text-3)]" style={H}>
          {data.repCount} rep{data.repCount !== 1 ? "s" : ""}
        </span>
      </div>

      {stages.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--crm-surface-2)] border border-[var(--crm-border)] flex items-center justify-center">
            <TrendingDown size={20} className="text-[var(--crm-text-3)]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--crm-text-2)]" style={H}>No funnel data yet</p>
            <p className="text-xs text-[var(--crm-text-3)] mt-1" style={H}>
              Move leads through pipeline stages and data will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {stages.map((stage, i) => {
            const widthPct = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
            const color = barColors[i] ?? "bg-[var(--crm-accent)]";
            const isFirst = i === 0;

            return (
              <div key={stage.key}>
                {!isFirst && (
                  <div className="flex items-center gap-2 mb-2 pl-1" aria-hidden="true">
                    <span className="text-[var(--crm-text-3)] text-xs">↓</span>
                    <span
                      className={`text-xs font-semibold tabular-nums ${
                        stage.convPct >= 50
                          ? "text-emerald-500"
                          : stage.convPct >= 20
                          ? "text-amber-500"
                          : "text-red-400"
                      }`}
                      style={H}
                    >
                      {stage.convPct}% conversion
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-32 sm:w-40 shrink-0">
                    <p className="text-xs font-semibold text-[var(--crm-text-2)] truncate" style={H}>
                      {stage.label}
                    </p>
                  </div>

                  <div
                    className="flex-1 relative h-8 bg-[var(--crm-surface-2)] rounded-lg overflow-hidden"
                    aria-label={`${stage.label}: ${stage.count.toLocaleString()} leads`}
                  >
                    <div
                      className={`absolute inset-y-0 left-0 ${color} rounded-lg transition-all duration-700 opacity-90`}
                      style={{ width: `${widthPct}%`, minWidth: stage.count > 0 ? "2px" : 0 }}
                    />
                    <div className="absolute inset-0 flex items-center px-3">
                      <span
                        className="text-xs font-bold tabular-nums text-white drop-shadow"
                        style={{ ...H, textShadow: "0 1px 3px rgba(0,0,0,0.55)" }}
                      >
                        {stage.count.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="w-10 sm:w-12 text-right shrink-0">
                    <span className="text-xs tabular-nums text-[var(--crm-text-3)]" style={H}>
                      {stage.overallPct}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Template Performance Section ─────────────────────────────────────────────

function TemplateSection({ data }: { data: TemplateData }) {
  const { templates } = data;
  const maxSent = Math.max(...templates.map((t) => t.sent), 1);

  return (
    <div className="bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Mail size={14} className="text-[var(--crm-accent)]" aria-hidden="true" />
        <h3 className="text-sm font-bold text-[var(--crm-text)]" style={H}>
          Template Performance
        </h3>
        <span className="ml-auto text-xs text-[var(--crm-text-3)]" style={H}>
          by subject line
        </span>
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--crm-surface-2)] border border-[var(--crm-border)] flex items-center justify-center">
            <InboxIcon size={20} className="text-[var(--crm-text-3)]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--crm-text-2)]" style={H}>No outreach emails logged yet</p>
            <p className="text-xs text-[var(--crm-text-3)] mt-1" style={H}>
              Send outreach emails and open/click/reply events will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full min-w-[540px] text-xs" style={H}>
            <thead>
              <tr className="text-[var(--crm-text-3)] uppercase tracking-wider text-[10px]">
                <th className="text-left pb-3 pr-4 font-semibold w-[36%]">Template / Subject</th>
                <th className="text-right pb-3 pr-4 font-semibold w-14">Sent</th>
                <th className="pb-3 pr-4 font-semibold text-center w-[18%]">Open Rate</th>
                <th className="pb-3 pr-4 font-semibold text-center w-[18%]">Click Rate</th>
                <th className="pb-3 font-semibold text-center w-[18%]">Reply Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--crm-border)]">
              {templates.map((t, i) => {
                const sentBarPct = (t.sent / maxSent) * 100;
                return (
                  <tr key={i} className="group hover:bg-[var(--crm-surface-3)] transition-colors duration-150">
                    <td className="py-3 pr-4 align-top">
                      <div>
                        <p
                          className="font-semibold text-[var(--crm-text)] leading-snug line-clamp-2"
                          title={t.template}
                          style={H}
                        >
                          {t.template}
                        </p>
                        <div
                          className="mt-1.5 h-1 bg-[var(--crm-surface-3)] rounded-full overflow-hidden w-full max-w-[160px]"
                          role="presentation"
                        >
                          <div
                            className="h-full bg-[var(--crm-accent)] rounded-full transition-all duration-500"
                            style={{ width: `${sentBarPct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 pr-4 text-right align-top">
                      <span className="font-bold text-[var(--crm-text)] tabular-nums">
                        {t.sent.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3 pr-4 align-top">
                      <RateBar pct={t.openRate} color="bg-blue-500" />
                    </td>

                    <td className="py-3 pr-4 align-top">
                      <RateBar pct={t.clickRate} color="bg-[var(--crm-accent)]" />
                    </td>

                    <td className="py-3 align-top">
                      <RateBar pct={t.replyRate} color="bg-emerald-500" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-wrap gap-4 pt-2 border-t border-[var(--crm-border)]">
        {[
          { color: "bg-blue-500", label: "Open rate" },
          { color: "bg-[var(--crm-accent)]", label: "Click rate" },
          { color: "bg-emerald-500", label: "Reply rate" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm ${color}`} aria-hidden="true" />
            <span className="text-[11px] text-[var(--crm-text-3)]" style={H}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FunnelReport() {
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null);
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [fRes, tRes] = await Promise.all([
        fetch("/api/crm/admin/funnel"),
        fetch("/api/crm/admin/template-stats"),
      ]);
      if (!fRes.ok || !tRes.ok) {
        setError("Failed to load report data.");
        return;
      }
      const [fJson, tJson] = await Promise.all([fRes.json(), tRes.json()]);
      setFunnelData(fJson as FunnelData);
      setTemplateData(tJson as TemplateData);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { void load(); }, [load]);

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 size={15} className="text-[var(--crm-accent)]" aria-hidden="true" />
          <h2 className="text-sm font-bold text-[var(--crm-text)]" style={H}>
            Funnel &amp; Template Report
          </h2>
        </div>
        <button
          onClick={() => void load()}
          disabled={loading}
          aria-label="Refresh report"
          className="inline-flex items-center gap-1.5 min-h-[40px] px-3 text-xs font-semibold text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] disabled:opacity-40 transition-colors rounded-lg hover:bg-[var(--crm-surface-3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)]"
          style={H}
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} aria-hidden="true" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div aria-busy="true" aria-label="Loading report data">
          <div className="space-y-5">
            <FunnelSkeleton />
            <TemplateSkeleton />
          </div>
        </div>
      ) : error ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-3 py-14 text-center bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-2xl"
        >
          <p className="text-sm text-red-500 font-semibold" style={H}>{error}</p>
          <button
            onClick={() => void load()}
            className="text-xs text-[var(--crm-text-3)] underline underline-offset-2 hover:text-[var(--crm-text-2)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)] rounded"
            style={H}
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {funnelData && <FunnelSection data={funnelData} />}
          {templateData && <TemplateSection data={templateData} />}
        </>
      )}
    </div>
  );
}
