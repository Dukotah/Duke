"use client";

import { useState, useEffect, useCallback } from "react";
import { Globe, ExternalLink, Sparkles, AlertCircle, RefreshCw, Inbox, Phone, Mail } from "lucide-react";
import { RecencyBadges, relTime, type LeadAction } from "./RecencyBadges";

const H = { fontFamily: "var(--font-heading)" };

export interface DemoLead {
  id: string;
  name: string;
  contact_name: string;
  category: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  county: string;
  tier: string;
  tier_reason: string;
  builder: string;
  industry_fit: string;
  outreach_score: number;
  pitch: string;
  notes: string;
  createdAt: string;
  kind: "demo" | "inbound";
  isInbound: boolean;
  hasDemo: boolean;
  previewUrl: string | null;
  thumbnailUrl: string | null;
  demoStatus: string | null;
  demoCategory: string | null;
  demoArea: string | null;
  claimByDate: string | null;
  linkedAt: string;
  actions?: LeadAction | null;
}

interface LeadStateLike {
  status?: string; stage?: string; lastContacted?: string;
  callCount?: number; lastOutcome?: string; followUpDate?: string;
}

interface Props {
  states: Record<string, LeadStateLike>;
  onSelectLead: (lead: DemoLead) => void;
}

export default function DemoQueue({ states, onSelectLead }: Props) {
  const [demos, setDemos] = useState<DemoLead[] | null>(null);
  const [error, setError] = useState("");
  const todayISO = new Date().toISOString().slice(0, 10);

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/crm/demos");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDemos(Array.isArray(data.demos) ? data.demos : []);
    } catch { setError("Could not load demos."); }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader
  useEffect(() => { load(); }, [load]);

  const statusPill = (s: string | null) =>
    s === "needs_review"
      ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border text-amber-300 bg-amber-400/10 border-amber-400/25" style={H}>Needs review</span>
      : <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border text-emerald-300 bg-emerald-400/10 border-emerald-400/25" style={H}>Ready to send</span>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#F97316]" />
          <h2 className="text-sm font-bold text-white" style={H}>New</h2>
          {demos && <span className="text-xs text-white/35" style={H}>{demos.length}</span>}
        </div>
        <button onClick={load} className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors" style={H}>
          <RefreshCw size={12} />Refresh
        </button>
      </div>
      <p className="text-xs text-white/30 leading-relaxed" style={H}>
        Fresh website demos built by the tool + inbound requests (people who asked to be contacted on the site). Hand-raisers show first. The full lead database lives in the All tab.
      </p>

      {error ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 crm-surface rounded-2xl text-center">
          <AlertCircle size={22} className="text-red-400/80" />
          <p className="text-sm text-white/60" style={H}>{error}</p>
          <button onClick={load} className="text-xs font-semibold text-[#F97316] hover:text-[#F97316]/80" style={H}>Try again</button>
        </div>
      ) : demos === null ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="crm-surface rounded-2xl h-44 animate-pulse" />
          ))}
        </div>
      ) : demos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 crm-surface rounded-2xl text-center px-6">
          <Globe size={24} className="text-white/20" />
          <p className="text-sm font-bold text-white/55" style={H}>Nothing new yet</p>
          <p className="text-xs text-white/30 max-w-sm leading-relaxed" style={H}>
            Demos built by the website tool and inbound website requests will land here, ready to act on.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {demos.map((d) => {
            const state = states[d.id];
            return (
              <div key={d.id} onClick={() => onSelectLead(d)} role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelectLead(d); } }}
                className="crm-surface crm-surface-hover rounded-2xl overflow-hidden cursor-pointer active:scale-[0.99] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]/40">
                {/* Inbound (form-fill) banner — a real hand-raiser */}
                {d.isInbound && (
                  <div className="flex items-center gap-2 px-3.5 py-2 bg-[#F97316]/10 border-b border-[#F97316]/20">
                    <Inbox size={13} className="text-[#F97316] shrink-0" />
                    <span className="text-xs font-bold text-[#F97316]" style={H}>Requested contact</span>
                    {d.createdAt && <span className="text-[11px] text-[#F97316]/60 ml-auto" style={H}>{relTime(d.createdAt)}</span>}
                  </div>
                )}
                {/* Demo thumbnail (when a site was built) */}
                {d.thumbnailUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={d.thumbnailUrl} alt="" loading="lazy"
                    className="w-full aspect-[1200/630] object-cover border-b border-white/[0.06]" />
                )}
                {/* Body */}
                <div className="p-3.5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate group-hover:text-[#F97316] transition-colors" style={H}>{d.name}</p>
                      <p className="text-xs text-white/40 truncate" style={H}>
                        {[d.city, d.category?.replace(/_/g, " ")].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {d.hasDemo && statusPill(d.demoStatus)}
                  </div>

                  {/* What an inbound lead asked for */}
                  {d.isInbound && d.notes && (
                    <p className="text-xs text-white/55 leading-snug line-clamp-2" style={H}>
                      {d.notes.replace(/^inbound[:\s-]*/i, "").trim() || "Submitted a contact request on the website."}
                    </p>
                  )}

                  <RecencyBadges actions={d.actions} state={state} today={todayISO} previewUrl={d.previewUrl} />

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <span className="text-[11px] text-white/30" style={H}>
                      {d.hasDemo
                        ? (d.linkedAt ? `Built ${relTime(d.linkedAt)}` : "Demo ready")
                        : (d.phone || d.email ? "Ready to reach out" : "")}
                    </span>
                    {d.previewUrl ? (
                      <a href={d.previewUrl} target="_blank" rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F97316] hover:text-[#F97316]/80 transition-colors" style={H}>
                        <Globe size={12} />View demo<ExternalLink size={11} className="opacity-60" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-[11px] text-white/40" style={H}>
                        {d.phone && <span className="inline-flex items-center gap-1"><Phone size={11} className="text-[#F97316]/60" />{d.phone}</span>}
                        {!d.phone && d.email && <span className="inline-flex items-center gap-1"><Mail size={11} className="text-[#F97316]/60" />{d.email}</span>}
                      </span>
                    )}
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
