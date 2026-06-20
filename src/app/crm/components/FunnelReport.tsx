"use client";

import { useEffect, useState } from "react";
import { TrendingDown, BarChart2, Mail, RefreshCw } from "lucide-react";

const H = { fontFamily: "var(--font-heading)" };

// ─── Types ────────────────────────────────────────────────────────────────────

interface FunnelStage {
  key: string;
  label: string;
  count: number;
  convPct: number;   // conversion from previous stage
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
      >
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-[var(--crm-text-2)] w-8 shrink-0" style={H}>
        {pct}%
      </span>
    </div>
  );
}

// ─── Spinner ─────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-[var(--crm-accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ─── Funnel Section ───────────────────────────────────────────────────────────

function FunnelSection({ data }: { data: FunnelData }) {
  const { stages } = data;
  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  // Stage accent colors — accent for top, tapering warmth to green
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
        <TrendingDown size={14} className="text-[var(--crm-accent)]" />
        <h3 className="text-sm font-bold text-[var(--crm-text)]" style={H}>
          Pipeline Funnel
        </h3>
        <span className="ml-auto text-xs text-[var(--crm-text-3)]" style={H}>
          {data.repCount} rep{data.repCount !== 1 ? "s" : ""}
        </span>
      </div>

      {stages.length === 0 ? (
        <p className="text-sm text-[var(--crm-text-3)] text-center py-8" style={H}>
          No lead data yet.
        </p>
      ) : (
        <div className="space-y-3">
          {stages.map((stage, i) => {
            const widthPct = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
            const color = barColors[i] ?? "bg-[var(--crm-accent)]";
            const isFirst = i === 0;

            return (
              <div key={stage.key}>
                {/* Conversion arrow between stages */}
                {!isFirst && (
                  <div className="flex items-center gap-2 mb-2 pl-1">
                    <span className="text-[var(--crm-text-3)] text-xs" style={H}>↓</span>
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
                  {/* Label */}
                  <div className="w-40 shrink-0">
                    <p className="text-xs font-semibold text-[var(--crm-text-2)] truncate" style={H}>
                      {stage.label}
                    </p>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 relative h-8 bg-[var(--crm-surface-2)] rounded-lg overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 ${color} rounded-lg transition-all opacity-90`}
                      style={{ width: `${widthPct}%`, minWidth: stage.count > 0 ? "2px" : 0 }}
                    />
                    <div className="absolute inset-0 flex items-center px-3">
                      <span
                        className="text-xs font-bold tabular-nums text-white drop-shadow"
                        style={{ ...H, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
                      >
                        {stage.count.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Overall % */}
                  <div className="w-12 text-right shrink-0">
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
        <Mail size={14} className="text-[var(--crm-accent)]" />
        <h3 className="text-sm font-bold text-[var(--crm-text)]" style={H}>
          Template Performance
        </h3>
        <span className="ml-auto text-xs text-[var(--crm-text-3)]" style={H}>
          by subject line
        </span>
      </div>

      {templates.length === 0 ? (
        <p className="text-sm text-[var(--crm-text-3)] text-center py-8" style={H}>
          No outreach emails logged yet.
        </p>
      ) : (
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full min-w-[540px] text-xs" style={H}>
            <thead>
              <tr className="text-[var(--crm-text-3)] uppercase tracking-wider text-[10px]">
                <th className="text-left pb-2 pr-4 font-semibold w-[36%]">Template / Subject</th>
                <th className="text-right pb-2 pr-4 font-semibold w-14">Sent</th>
                <th className="pb-2 pr-4 font-semibold text-center w-[18%]">Open Rate</th>
                <th className="pb-2 pr-4 font-semibold text-center w-[18%]">Click Rate</th>
                <th className="pb-2 font-semibold text-center w-[18%]">Reply Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--crm-border)]">
              {templates.map((t, i) => {
                const sentBarPct = (t.sent / maxSent) * 100;
                return (
                  <tr key={i} className="group hover:bg-[var(--crm-surface-3)] transition-colors">
                    {/* Subject / template label */}
                    <td className="py-3 pr-4 align-top">
                      <div>
                        <p
                          className="font-semibold text-[var(--crm-text)] leading-snug line-clamp-2"
                          title={t.template}
                          style={H}
                        >
                          {t.template}
                        </p>
                        {/* Sent volume bar */}
                        <div className="mt-1.5 h-1 bg-[var(--crm-surface-3)] rounded-full overflow-hidden w-full max-w-[160px]">
                          <div
                            className="h-full bg-[var(--crm-accent)] rounded-full"
                            style={{ width: `${sentBarPct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Sent count */}
                    <td className="py-3 pr-4 text-right align-top">
                      <span className="font-bold text-[var(--crm-text)] tabular-nums">
                        {t.sent.toLocaleString()}
                      </span>
                    </td>

                    {/* Open rate */}
                    <td className="py-3 pr-4 align-top">
                      <RateBar pct={t.openRate} color="bg-blue-500" />
                    </td>

                    {/* Click rate */}
                    <td className="py-3 pr-4 align-top">
                      <RateBar pct={t.clickRate} color="bg-[var(--crm-accent)]" />
                    </td>

                    {/* Reply rate */}
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

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-2 border-t border-[var(--crm-border)]">
        {[
          { color: "bg-blue-500", label: "Open rate" },
          { color: "bg-[var(--crm-accent)]", label: "Click rate" },
          { color: "bg-emerald-500", label: "Reply rate" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
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

  async function load() {
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
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 size={15} className="text-[var(--crm-accent)]" />
          <h2 className="text-sm font-bold text-[var(--crm-text)]" style={H}>
            Funnel &amp; Template Report
          </h2>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] disabled:opacity-40 transition-colors"
          style={H}
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="text-center py-12 text-red-400 text-sm" style={H}>
          {error}
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
