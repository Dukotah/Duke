"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquareReply, AlertCircle, RefreshCw, X, Phone, Mail, Inbox } from "lucide-react";
import { RecencyBadges, relTime, type LeadAction } from "./RecencyBadges";

const H = { fontFamily: "var(--font-heading)" };

export interface RespondedReply {
  fromEmail: string;
  fromName: string;
  subject: string;
  snippet: string;
  text: string;
  html: string;
  receivedAt: string;
}

export interface RespondedLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  category: string;
  respondedAt: string;
  replyCount: number;
  reply: RespondedReply | null;
  actions?: LeadAction | null;
}

interface LeadStateLike {
  status?: string; stage?: string; lastContacted?: string;
  callCount?: number; lastOutcome?: string; followUpDate?: string;
}

interface Props {
  states: Record<string, LeadStateLike>;
  onSelectLead: (lead: RespondedLead) => void;
}

// Accessible modal that shows the FULL reply email (from, subject, date, body).
function ReplyModal({ lead, onClose }: { lead: RespondedLead; onClose: () => void }) {
  const r = lead.reply;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const when = r?.receivedAt || lead.respondedAt;
  const dateStr = when ? new Date(when).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Reply from ${lead.name}`}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-[#141416] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-white/[0.08] bg-[#F97316]/[0.06] shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <MessageSquareReply size={15} className="text-[#F97316] shrink-0" />
              <span className="text-sm font-bold text-white truncate" style={H}>{lead.name}</span>
            </div>
            <p className="text-xs text-white/45 mt-1 truncate" style={H}>
              {r?.fromName ? `${r.fromName} · ` : ""}{r?.fromEmail || lead.email}
            </p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors shrink-0" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-bold text-white" style={H}>{r?.subject || "(no subject)"}</p>
            {dateStr && <p className="text-xs text-white/35" style={H}>{dateStr}</p>}
          </div>
          {r?.html ? (
            <div className="text-sm text-white/80 leading-relaxed crm-reply-html"
              // The reply HTML comes from the lead's email; we render it read-only
              // inside the rep-only CRM. dangerouslySetInnerHTML is acceptable here
              // (internal tool, no public surface) and mirrors how mail clients show
              // a reply. Plain text is preferred when present below.
              dangerouslySetInnerHTML={{ __html: r.html }} />
          ) : (
            <pre className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-sans" style={{ fontFamily: "inherit" }}>
              {r?.text || "(empty reply — no body was captured)"}
            </pre>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-white/[0.08] shrink-0">
          <span className="text-[11px] text-white/30" style={H}>
            {lead.replyCount > 1 ? `${lead.replyCount} replies` : "1 reply"}
          </span>
          {lead.email && (
            <a href={`mailto:${lead.email}${r?.subject ? `?subject=Re: ${encodeURIComponent(r.subject)}` : ""}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F97316] hover:text-[#F97316]/80 transition-colors" style={H}>
              <Mail size={12} />Reply by email
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RespondedQueue({ states, onSelectLead }: Props) {
  const [leads, setLeads] = useState<RespondedLead[] | null>(null);
  const [error, setError] = useState("");
  const [openReply, setOpenReply] = useState<RespondedLead | null>(null);
  const todayISO = new Date().toISOString().slice(0, 10);

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/crm/responded");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLeads(Array.isArray(data.responded) ? data.responded : []);
    } catch { setError("Could not load replies."); }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader
  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      {openReply && <ReplyModal lead={openReply} onClose={() => setOpenReply(null)} />}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MessageSquareReply size={16} className="text-[#F97316]" />
          <h2 className="text-sm font-bold text-white" style={H}>Responded</h2>
          {leads && <span className="text-xs text-white/35" style={H}>{leads.length}</span>}
        </div>
        <button onClick={load} className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors" style={H}>
          <RefreshCw size={12} />Refresh
        </button>
      </div>
      <p className="text-xs text-white/30 leading-relaxed" style={H}>
        Leads who replied to an outreach email. Newest reply first — open a card to read the full message and reply back.
      </p>

      {error ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 crm-surface rounded-2xl text-center">
          <AlertCircle size={22} className="text-red-400/80" />
          <p className="text-sm text-white/60" style={H}>{error}</p>
          <button onClick={load} className="text-xs font-semibold text-[#F97316] hover:text-[#F97316]/80" style={H}>Try again</button>
        </div>
      ) : leads === null ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="crm-surface rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 crm-surface rounded-2xl text-center px-6">
          <Inbox size={24} className="text-white/20" />
          <p className="text-sm font-bold text-white/55" style={H}>No replies yet</p>
          <p className="text-xs text-white/30 max-w-sm leading-relaxed" style={H}>
            When a lead replies to an outreach email, they&apos;ll surface here automatically with their full message.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {leads.map((d) => {
            const state = states[d.id];
            return (
              <div key={d.id}
                className="crm-surface crm-surface-hover rounded-2xl overflow-hidden group">
                <div className="flex items-center gap-2 px-3.5 py-2 bg-[#F97316]/10 border-b border-[#F97316]/20">
                  <MessageSquareReply size={13} className="text-[#F97316] shrink-0" />
                  <span className="text-xs font-bold text-[#F97316]" style={H}>Responded</span>
                  {d.respondedAt && <span className="text-[11px] text-[#F97316]/60 ml-auto" style={H}>{relTime(d.respondedAt)}</span>}
                </div>
                <div className="p-3.5 space-y-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate" style={H}>{d.name}</p>
                    <p className="text-xs text-white/40 truncate" style={H}>
                      {[d.city, d.category?.replace(/_/g, " ")].filter(Boolean).join(" · ")}
                    </p>
                  </div>

                  {d.reply && (
                    <div className="rounded-xl bg-[#0e0e10] border border-white/[0.06] px-3 py-2.5 space-y-1">
                      {d.reply.subject && <p className="text-xs font-semibold text-white/75 truncate" style={H}>{d.reply.subject}</p>}
                      <p className="text-xs text-white/50 leading-snug line-clamp-2">{d.reply.snippet || "(no body captured)"}</p>
                    </div>
                  )}

                  <RecencyBadges actions={d.actions} state={state} today={todayISO} />

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <span className="inline-flex items-center gap-2 text-[11px] text-white/40" style={H}>
                      {d.phone && <span className="inline-flex items-center gap-1"><Phone size={11} className="text-[#F97316]/60" />{d.phone}</span>}
                      {!d.phone && d.email && <span className="inline-flex items-center gap-1"><Mail size={11} className="text-[#F97316]/60" />{d.email}</span>}
                    </span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setOpenReply(d)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F97316] hover:text-[#F97316]/80 transition-colors" style={H}>
                        <MessageSquareReply size={12} />View reply
                      </button>
                      <button onClick={() => onSelectLead(d)}
                        className="text-xs font-semibold text-white/45 hover:text-white/80 transition-colors" style={H}>
                        Open lead
                      </button>
                    </div>
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
