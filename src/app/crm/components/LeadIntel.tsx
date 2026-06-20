"use client";

import { useMemo, useState } from "react";
import {
  Flame, Copy, Check, ChevronDown, ChevronRight, Mail, Search, AlertTriangle,
} from "lucide-react";
import {
  computeHeatScore, heatBand, HEAT_LABELS, problemList, buildScript,
  buildEmailDraft, OBJECTIONS, topProblemLabel, type IntelLead,
} from "@/lib/crm/intel";

const H = { fontFamily: "var(--font-heading)" };

const BAND_STYLE: Record<"hot" | "warm" | "cool", { text: string; bg: string; border: string }> = {
  hot: { text: "text-[var(--crm-accent-text)]", bg: "bg-[var(--crm-accent-weak)]", border: "border-[var(--crm-accent-border)]" },
  warm: { text: "text-yellow-400", bg: "bg-yellow-400/15", border: "border-yellow-400/25" },
  cool: { text: "text-sky-400", bg: "bg-sky-400/15", border: "border-sky-400/25" },
};

const SEVERITY_DOT: Record<"high" | "medium" | "low", string> = {
  high: "bg-red-400",
  medium: "bg-yellow-400",
  low: "bg-[var(--crm-text-3)]",
};

function CopyBtn({ text, className = "" }: { text: string; className?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }}
      className={`p-1.5 rounded-md text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] hover:bg-[var(--crm-surface-3)] transition-colors ${className}`}
    >
      {ok ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
    </button>
  );
}

function Section({ title, defaultOpen = false, children }: {
  title: string; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[var(--crm-border)] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[var(--crm-surface-3)] transition-colors"
      >
        <span className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider" style={H}>{title}</span>
        {open ? <ChevronDown size={15} className="text-[var(--crm-text-3)] shrink-0" /> : <ChevronRight size={15} className="text-[var(--crm-text-3)] shrink-0" />}
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

export default function LeadIntel({ lead, repName }: { lead: IntelLead; repName: string }) {
  const [query, setQuery] = useState("");

  const heat = useMemo(() => computeHeatScore(lead), [lead]);
  const band = heatBand(heat);
  const problems = useMemo(() => problemList(lead), [lead]);
  const script = useMemo(() => buildScript(lead, repName), [lead, repName]);
  const email = useMemo(() => buildEmailDraft(lead, repName), [lead, repName]);
  const topProblem = useMemo(() => topProblemLabel(lead), [lead]);

  const fullScript = script
    .map((b) => `${b.heading.toUpperCase()}\n${b.lines.join("\n")}`)
    .join("\n\n");

  const objections = useMemo(() => {
    const fill = (s: string) => s.replace(/\[their top problem\]/g, topProblem);
    const q = query.trim().toLowerCase();
    return OBJECTIONS
      .map((o) => ({ trigger: o.trigger, response: fill(o.response) }))
      .filter((o) => !q || o.trigger.toLowerCase().includes(q) || o.response.toLowerCase().includes(q));
  }, [query, topProblem]);

  const bs = BAND_STYLE[band];

  return (
    <div className="px-5 py-4 border-b border-[var(--crm-border)] space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider" style={H}>Lead Intelligence</p>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${bs.bg} ${bs.border} ${bs.text}`} style={H}>
          <Flame size={11} />{HEAT_LABELS[band]} · {heat}
        </span>
      </div>

      {/* Why this lead is hot — the problem breakdown */}
      {problems.length > 0 && (
        <div className="bg-[var(--crm-surface)] rounded-xl border border-[var(--crm-border)] p-4 space-y-2.5">
          {problems.map((p) => (
            <div key={p.key} className="flex gap-2.5">
              <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${SEVERITY_DOT[p.severity]}`} />
              <div>
                <p className="text-sm text-[var(--crm-text)] font-medium" style={H}>{p.label}</p>
                <p className="text-xs text-[var(--crm-text-3)] leading-relaxed">{p.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tailored call script */}
      <Section title="Tailored Call Script">
        <div className="flex justify-end -mt-1">
          <button
            onClick={() => navigator.clipboard.writeText(fullScript)}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--crm-text-3)] hover:text-[var(--crm-text)] transition-colors" style={H}
          >
            <Copy size={11} /> Copy full script
          </button>
        </div>
        {script.map((block) => (
          <div key={block.heading} className="bg-[var(--crm-surface-2)] rounded-xl border border-[var(--crm-border)] p-3.5 relative">
            <p className="text-[11px] font-semibold text-[var(--crm-accent-text)] uppercase tracking-wider mb-2" style={H}>{block.heading}</p>
            <div className="space-y-1 pr-7">
              {block.lines.map((line, i) => (
                <p key={i} className="text-sm text-[var(--crm-text)] leading-relaxed" style={H}>{line}</p>
              ))}
            </div>
            <CopyBtn text={block.lines.join("\n")} className="absolute top-3 right-3" />
          </div>
        ))}
      </Section>

      {/* Tailored email draft */}
      <Section title="Tailored Email Draft">
        <div className="bg-[var(--crm-surface-2)] rounded-xl border border-[var(--crm-border)] p-3.5 relative">
          <p className="text-[11px] font-semibold text-[var(--crm-accent-text)] uppercase tracking-wider mb-1.5" style={H}>Subject</p>
          <p className="text-sm text-[var(--crm-text)] mb-3" style={H}>{email.subject}</p>
          <p className="text-[11px] font-semibold text-[var(--crm-accent-text)] uppercase tracking-wider mb-1.5" style={H}>Body</p>
          <p className="text-sm text-[var(--crm-text-2)] leading-relaxed whitespace-pre-wrap">{email.body}</p>
        </div>
        <div className="flex items-center gap-2">
          <CopyBtn text={`Subject: ${email.subject}\n\n${email.body}`} />
          <a
            href={`mailto:${(lead as { email?: string }).email ?? ""}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--crm-accent-weak)] text-[var(--crm-accent-text)] border border-[var(--crm-accent-border)] hover:bg-[var(--crm-accent-weak)] text-xs font-semibold transition-colors" style={H}
          >
            <Mail size={12} /> Open in mail
          </a>
        </div>
      </Section>

      {/* Searchable objection cheat sheet */}
      <Section title="Objection Cheat Sheet">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--crm-text-3)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search objections…"
            className="w-full bg-[var(--crm-surface-2)] border border-[var(--crm-border)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--crm-text-2)] placeholder:text-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)]"
            style={H}
          />
        </div>
        {objections.length === 0 ? (
          <p className="text-xs text-[var(--crm-text-3)] flex items-center gap-2" style={H}>
            <AlertTriangle size={12} /> No objection matches &ldquo;{query}&rdquo;.
          </p>
        ) : (
          objections.map((o) => (
            <div key={o.trigger} className="bg-[var(--crm-surface-2)] rounded-xl border border-[var(--crm-border)] p-3.5 relative">
              <p className="text-sm font-semibold text-[var(--crm-text)] mb-1.5 pr-7" style={H}>&ldquo;{o.trigger}&rdquo;</p>
              <p className="text-xs text-[var(--crm-text-2)] leading-relaxed">{o.response}</p>
              <CopyBtn text={o.response} className="absolute top-3 right-3" />
            </div>
          ))
        )}
      </Section>
    </div>
  );
}
