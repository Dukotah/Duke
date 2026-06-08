"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Send, Save, RotateCcw, Check, Mail } from "lucide-react";
import {
  loadTemplates,
  saveTemplateOverride,
  resetTemplateOverride,
  hasOverride,
  personalize,
  type EmailTemplate,
} from "./emailTemplates";
import { firstName } from "@/lib/outreach";

const H = { fontFamily: "var(--font-heading)" };

interface ComposerLead {
  id: string;
  name: string;
  contactName?: string;
  email: string;
  city: string;
  previewUrl?: string;
  claimByDate?: string;
}

interface Props {
  lead: ComposerLead;
  repName: string;
  onClose: () => void;
  // Called after a successful send so the parent can refresh state/activity.
  onSent?: () => void;
}

export default function EmailComposer({ lead, repName, onClose, onSent }: Props) {
  const [templates, setTemplates] = useState<EmailTemplate[]>(() => loadTemplates());
  const [templateKey, setTemplateKey] = useState(templates[0].key);
  const [subject, setSubject] = useState(templates[0].subject);
  const [body, setBody] = useState(templates[0].body);
  const [fromName, setFromName] = useState(repName);

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [delivered, setDelivered] = useState(true);
  const [savedFlash, setSavedFlash] = useState(false);

  // Today's sending capacity (warm-up ramp) so a rep can't blow past the daily cap.
  const [capacity, setCapacity] = useState<{ sentToday: number; dailyCap: number; remaining: number; live: boolean } | null>(null);
  const fetchCapacity = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/outreach");
      if (res.ok) setCapacity(await res.json());
    } catch { /* non-fatal */ }
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { fetchCapacity(); }, [fetchCapacity]);

  const atCap = !!capacity && capacity.remaining < 1;

  const editable = templateKey !== "custom";
  const overridden = editable && hasOverride(templateKey);

  const applyTemplate = (key: string) => {
    setTemplateKey(key);
    const tmpl = templates.find((t) => t.key === key);
    if (tmpl && key !== "custom") {
      setSubject(tmpl.subject);
      setBody(tmpl.body);
    }
  };

  // {name} greeting uses the contact's first name when known, else falls back
  // to "there" (handled in personalize); {business} carries the company name.
  // {demoUrl} and {claimByDate} are substituted when the lead has a demo package.
  const vars = { name: firstName(lead.contactName), business: lead.name, city: lead.city, fromName, demoUrl: lead.previewUrl ?? "", claimByDate: lead.claimByDate ?? "" };

  // A template that links a demo ({demoUrl}) is broken if no demo has been built
  // for this lead — it would send "here's your demo:" with a blank link. Block the
  // send and tell the rep to attach a demo first.
  const needsDemo = /\{demoUrl\}/i.test(subject + body) && !lead.previewUrl?.trim();

  const saveEdits = () => {
    saveTemplateOverride(templateKey, subject, body);
    setTemplates((prev) => prev.map((t) => (t.key === templateKey ? { ...t, subject, body } : t)));
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const resetEdits = () => {
    resetTemplateOverride(templateKey);
    const fresh = loadTemplates();
    setTemplates(fresh);
    const tmpl = fresh.find((t) => t.key === templateKey);
    if (tmpl) {
      setSubject(tmpl.subject);
      setBody(tmpl.body);
    }
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim() || atCap || needsDemo) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/crm/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leads: [{ id: lead.id, name: lead.name, contactName: lead.contactName, email: lead.email, city: lead.city, previewUrl: lead.previewUrl, claimByDate: lead.claimByDate }],
          subject,
          body,
          fromName,
        }),
      });
      const d = await res.json();
      if (!res.ok || (d.sent ?? 0) < 1) {
        setError(d.error ?? (d.failed ? "Send failed — check the address and try again" : "Could not send"));
        setSending(false);
        return;
      }
      setDelivered((d.delivered ?? 0) >= 1);
      setDone(true);
      onSent?.();
      fetchCapacity(); // reflect the just-consumed daily budget
    } catch {
      setError("Network error — please try again");
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-[#1C1C1F] border border-white/10 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-white/[0.07] shrink-0">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-white flex items-center gap-2" style={H}>
              <Mail size={15} className="text-[#F97316]" />Send Email
            </h2>
            <p className="text-xs text-white/40 mt-0.5 truncate" style={H}>{lead.name} · {lead.email}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors shrink-0"><X size={18} /></button>
        </div>

        {done ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center gap-4">
            <div className="text-5xl">{delivered ? "✉️" : "📝"}</div>
            <h3 className="text-lg font-bold text-white" style={H}>
              {delivered ? `Email sent to ${lead.name}` : `Email logged for ${lead.name}`}
            </h3>
            <p className="text-sm text-white/50" style={H}>
              {delivered
                ? "Logged to their timeline. A follow up was scheduled for 3 days out."
                : "Email delivery isn't live yet, so this was recorded on their timeline (not actually sent). A follow up was scheduled for 3 days out."}
            </p>
            <button onClick={onClose} className="px-8 py-3 rounded-xl text-sm font-bold text-white" style={{ backgroundColor: "#F97316", ...H }}>Done</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Templates */}
              <div className="flex flex-wrap gap-2">
                {templates.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => applyTemplate(t.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      templateKey === t.key
                        ? "bg-[#F97316]/10 border-[#F97316]/30 text-[#F97316]"
                        : "bg-[#111113] border-white/10 text-white/50 hover:text-white/80"
                    }`}
                    style={H}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* From */}
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2" style={H}>Your Name</label>
                <input value={fromName} onChange={(e) => setFromName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-sm text-white focus:outline-none focus:border-[#F97316]/50" style={H} />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2" style={H}>Subject</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject — use {name}, {business}, {city}"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50" style={H} />
              </div>

              {/* Body */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-wider" style={H}>Message</label>
                  {editable && (
                    <div className="flex items-center gap-3">
                      <button onClick={saveEdits} className="text-xs font-semibold text-white/40 hover:text-[#F97316] flex items-center gap-1 transition-colors" style={H}>
                        {savedFlash ? <><Check size={11} className="text-green-400" />Saved</> : <><Save size={11} />Save edits</>}
                      </button>
                      {overridden && (
                        <button onClick={resetEdits} className="text-xs font-semibold text-white/30 hover:text-white/60 flex items-center gap-1 transition-colors" style={H}>
                          <RotateCcw size={11} />Reset
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-white/25 mb-2" style={H}>Variables: {"{name}"}, {"{business}"}, {"{city}"}, {"{fromName}"}, {"{demoUrl}"}, {"{claimByDate}"}</p>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={11}
                  placeholder="Write your message…"
                  className="w-full px-4 py-3 rounded-xl bg-[#111113] border border-white/10 text-sm text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#F97316]/50 leading-relaxed" style={H} />
              </div>

              {/* Preview */}
              {(subject.trim() || body.trim()) && (
                <div className="bg-[#111113] rounded-xl border border-white/[0.06] p-4 space-y-2">
                  <p className="text-xs text-white/35 font-semibold uppercase tracking-wider" style={H}>Preview for {lead.name}</p>
                  <p className="text-sm text-white font-semibold" style={H}>{personalize(subject, vars)}</p>
                  <pre className="text-sm text-white/75 whitespace-pre-wrap leading-relaxed font-sans" style={H}>{personalize(body, vars)}</pre>
                </div>
              )}

              {needsDemo && (
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-amber-300" style={H}>
                  <span className="text-base leading-none shrink-0">⚠️</span>
                  <p className="text-sm leading-snug">
                    This template links a demo site, but no demo has been built for <span className="font-semibold">{lead.name}</span> yet.
                    Build one in the /websites factory and sync it first, or pick a different template.
                  </p>
                </div>
              )}

              {error && <p className="text-sm text-red-400 px-1" style={H}>{error}</p>}
            </div>

            {/* Action bar */}
            <div className="shrink-0 border-t border-white/[0.07] px-5 py-4">
              {capacity && (
                <p className={`text-xs mb-3 flex items-center gap-1.5 ${atCap ? "text-yellow-400" : "text-white/35"}`} style={H}>
                  <Send size={11} className="shrink-0" />
                  {atCap
                    ? "Daily sending cap reached — resumes tomorrow"
                    : `${capacity.remaining} of ${capacity.dailyCap} left in today's cap${capacity.live ? "" : " · practice mode (tracked, not sent)"}`}
                </p>
              )}
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="px-4 py-3 rounded-xl text-sm font-semibold text-white/60 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors" style={H}>Cancel</button>
                <button onClick={handleSend} disabled={sending || !subject.trim() || !body.trim() || atCap || needsDemo}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
                  style={{ backgroundColor: "#F97316", ...H }}>
                  <Send size={14} />{sending ? "Sending…" : atCap ? "Daily cap reached" : needsDemo ? "No demo built yet" : `Send to ${lead.name}`}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
