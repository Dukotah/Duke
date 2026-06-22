"use client";

// The consolidated tool deck. One tabbed surface for every free tool.
// Progressive migration: tabs whose body has been extracted into a component
// render INLINE; the rest deep-link to their existing standalone page so the
// build stays green while we port them one at a time.

import { useState, useEffect, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { TOOL_TABS, type ToolSlug, toolBySlug } from "./registry";

function DeckLoading() {
  return (
    <div className="flex items-center justify-center gap-2 py-24 text-zinc-400 text-sm">
      <Loader2 size={16} className="animate-spin text-copper-bright" />
      Loading tool…
    </div>
  );
}

const AuditSuiteTool = dynamic(() => import("./AuditSuiteTool"), { ssr: false, loading: () => <DeckLoading /> });
const CompareTool = dynamic(() => import("./CompareTool"), { ssr: false, loading: () => <DeckLoading /> });
const MissedCallTool = dynamic(() => import("./MissedCallTool"), { ssr: false, loading: () => <DeckLoading /> });
const CostEstimatorTool = dynamic(() => import("./CostEstimatorTool"), { ssr: false, loading: () => <DeckLoading /> });
const ItHealthCheckTool = dynamic(() => import("./ItHealthCheckTool"), { ssr: false, loading: () => <DeckLoading /> });
const SecurityTool = dynamic(() => import("./SecurityTool"), { ssr: false, loading: () => <DeckLoading /> });
const EmailHeadersTool = dynamic(() => import("./EmailHeadersTool"), { ssr: false, loading: () => <DeckLoading /> });
const PasswordTool = dynamic(() => import("./PasswordTool"), { ssr: false, loading: () => <DeckLoading /> });
const BusinessAnalysisTool = dynamic(() => import("./BusinessAnalysisTool"), { ssr: false, loading: () => <DeckLoading /> });

// Every tab now renders inline. (Only the audit tab takes deep-link props.)
const INLINE: Record<ToolSlug, (p: { initialUrl?: string; autoRun?: boolean }) => ReactNode> = {
  audit: (p) => <AuditSuiteTool {...p} />,
  compare: () => <CompareTool />,
  "missed-call": () => <MissedCallTool />,
  "cost-estimator": () => <CostEstimatorTool />,
  "it-health-check": () => <ItHealthCheckTool />,
  security: () => <SecurityTool />,
  "email-headers": () => <EmailHeadersTool />,
  password: () => <PasswordTool />,
  "business-analysis": () => <BusinessAnalysisTool />,
};

function ToolPlaceholder({ slug }: { slug: ToolSlug }) {
  const meta = toolBySlug(slug)!;
  return (
    <div className="card mx-auto max-w-xl rounded-2xl p-8 text-center">
      <h3 className="text-xl font-bold text-white">{meta.title}</h3>
      <p className="mt-2 text-zinc-400">{meta.tagline}</p>
      <Link
        href={meta.href}
        className="group mt-6 inline-flex items-center gap-2 rounded-full bg-copper px-6 py-3 text-sm font-bold text-ink-0 transition-colors hover:bg-copper-bright"
      >
        Open {meta.tab}
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

export default function ToolDeck({ initial = "audit" }: { initial?: ToolSlug }) {
  const [active, setActive] = useState<ToolSlug>(initial);
  const [deep, setDeep] = useState<{ url?: string; auto?: boolean }>({});

  // Hash → active tab; ?url= → prefill + auto-run the audit tab. Read from
  // window (not useSearchParams) to avoid a Suspense boundary requirement.
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (TOOL_TABS.some((t) => t.slug === hash)) setActive(hash as ToolSlug);
    const url = new URLSearchParams(window.location.search).get("url");
    if (url) setDeep({ url, auto: true });
  }, []);

  function select(slug: ToolSlug) {
    setActive(slug);
    if (typeof history !== "undefined") history.replaceState(null, "", `#${slug}`);
  }

  const inline = INLINE[active];

  return (
    <div>
      {/* Tab strip */}
      <div
        role="tablist"
        aria-label="Free tools"
        className="flex flex-wrap justify-center gap-2"
      >
        {TOOL_TABS.map((t) => {
          const on = active === t.slug;
          return (
            <button
              key={t.slug}
              role="tab"
              type="button"
              aria-selected={on}
              onClick={() => select(t.slug)}
              className={
                "rounded-full px-4 py-2 text-sm font-medium transition-colors " +
                (on
                  ? "bg-copper text-ink-0 font-semibold"
                  : "border border-hairline bg-ink-1 text-zinc-300 hover:border-copper-dim hover:text-white")
              }
            >
              {t.tab}
            </button>
          );
        })}
      </div>

      {/* Active tool — re-mount on tab change so the reveal + tool state reset */}
      <div key={active} className="cbt-rise mt-8">
        {inline
          ? inline(active === "audit" ? { initialUrl: deep.url, autoRun: deep.auto } : {})
          : <ToolPlaceholder slug={active} />}
      </div>
    </div>
  );
}
