"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Send, Mail } from "lucide-react";
import {
  loadTemplates,
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
  // Demo package category (e.g. "winery") — used to pick the best default template.
  demoCategory?: string;
  // Their existing site + its enriched quality ("dead"/"thin"/"ok"/…) — used to
  // pick between the No-Website and Site-Upgrade pitches for no-demo leads.
  website?: string;
  siteQuality?: string;
  // Enriched MX-verified deliverability: valid | risky | invalid | unknown.
  emailStatus?: string;
}

// Open straight to the template the lead's DATA calls for, so the rep sees a
// ready-to-send email instead of a wrong pitch they have to swap out:
//   1. Demo built       → the matching demo template (winery script / demo intro).
//   2. Live website, no demo → the Site-Upgrade pitch.
//   3. No (or dead) site → the No-Website pitch.
// It only ever opens to a demo template when a real demo exists, and only to
// No-Website when there's genuinely no live site to talk about.
function pickInitialTemplate(templates: EmailTemplate[], lead: ComposerLead): EmailTemplate {
  const find = (k: string) => templates.find((t) => t.key === k);
  if (lead.previewUrl) {
    const cat = (lead.demoCategory ?? "").toLowerCase();
    if (cat === "winery") { const w = find("winery_demo"); if (w) return w; }
    return find("student_demo") ?? find("demo_intro") ?? templates[0];
  }
  const hasSite = (lead.website ?? "").trim().length > 0;
  const deadSite = ["dead", "none", "no site", "broken", "down", "offline"].includes((lead.siteQuality ?? "").toLowerCase());
  if (hasSite && !deadSite) { const u = find("diy_upgrade"); if (u) return u; }
  return find("student_no_website") ?? find("no_website") ?? templates[0];
}

interface Props {
  lead: ComposerLead;
  repName: string;
  onClose: () => void;
  // Called after a successful send so the parent can refresh state/activity.
  onSent?: () => void;
  // Email-sending profile of the signed-in rep. "restricted" locks editing to
  // approved templates (the server renders from templateKey regardless). Default "full".
  emailMode?: "full" | "restricted" | "off";
}

export default function EmailComposer({ lead, repName, onClose, onSent, emailMode = "full" }: Props) {
  const restricted = emailMode === "restricted";
  // Restricted reps only get the approved built-in templates (no free-form
  // "custom" scratch, no rep-authored ones). Server enforces this too.
  const [templates] = useState<EmailTemplate[]>(() =>
    restricted
      ? loadTemplates().filter((t) => t.key !== "custom" && !t.key.startsWith("custom_"))
      : loadTemplates());
  const initialTemplate = pickInitialTemplate(templates, lead);
  // The editable fields hold the FINAL personalized text for this lead (tokens
  // already filled in), so what the rep sees is exactly what sends — one message,
  // no separate preview.
  const initialVars = { name: firstName(lead.contactName), business: lead.name, city: lead.city, fromName: repName, demoUrl: lead.previewUrl ?? "", claimByDate: lead.claimByDate ?? "" };
  const [templateKey, setTemplateKey] = useState(initialTemplate.key);
  const [subject, setSubject] = useState(() => personalize(initialTemplate.subject, initialVars));
  const [body, setBody] = useState(() => personalize(initialTemplate.body, initialVars));
  const [fromName, setFromName] = useState(repName);

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [delivered, setDelivered] = useState(true);
  // Deliverability guard: warn-with-override for any non-valid address so a rep
  // doesn't unknowingly hard-bounce the warm-up domain. A "valid" (MX-verified)
  // address needs no confirmation; legacy leads (no status) are treated as valid.
  const [overrideRisky, setOverrideRisky] = useState(false);
  const emailStatus = (lead.emailStatus ?? "").toLowerCase();
  const riskyEmail = emailStatus === "invalid" || emailStatus === "risky" || emailStatus === "unknown";
  const blockedByDeliverability = riskyEmail && !overrideRisky;

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

  // Switching templates re-fills the editable fields with the personalized text
  // for THIS lead (real name, city, demo link), so the box is always ready to send.
  const vars = { name: firstName(lead.contactName), business: lead.name, city: lead.city, fromName, demoUrl: lead.previewUrl ?? "", claimByDate: lead.claimByDate ?? "" };

  const applyTemplate = (key: string) => {
    setTemplateKey(key);
    const tmpl = templates.find((t) => t.key === key);
    if (tmpl && key !== "custom") {
      setSubject(personalize(tmpl.subject, vars));
      setBody(personalize(tmpl.body, vars));
    } else if (key === "custom") {
      setSubject("");
      setBody("");
    }
  };

  // A demo template is broken if no demo exists for this lead (it would send a
  // blank link). Check the RAW template, since the editable body already has the
  // link substituted in.
  const activeTemplate = templates.find((t) => t.key === templateKey);
  const needsDemo = !!activeTemplate && /\{demoUrl\}/i.test(activeTemplate.subject + activeTemplate.body) && !lead.previewUrl?.trim();

  const handleSend = async () => {
    if (!subject.trim() || !body.trim() || atCap || needsDemo || blockedByDeliverability) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/crm/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leads: [{ id: lead.id, name: lead.name, contactName: lead.contactName, email: lead.email, city: lead.city, previewUrl: lead.previewUrl, claimByDate: lead.claimByDate, emailStatus: lead.emailStatus }],
          subject,
          body,
          fromName,
          templateKey,
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
                <input value={subject} onChange={(e) => setSubject(e.target.value)} readOnly={restricted}
                  placeholder="Subject"
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 ${restricted ? "opacity-70 cursor-not-allowed" : ""}`} style={H} />
              </div>

              {/* Body — already personalized for this lead; this is what sends. */}
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2" style={H}>Message</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={15} readOnly={restricted}
                  placeholder="Write your message…"
                  className={`w-full px-4 py-3 rounded-xl bg-[#111113] border border-white/10 text-sm text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#F97316]/50 leading-relaxed ${restricted ? "opacity-70 cursor-not-allowed" : ""}`} style={H} />
                <p className="text-xs text-white/25 mt-2" style={H}>
                  {restricted
                    ? `Approved template, personalized for ${lead.name}. Pick a different template above to change it.`
                    : `Already filled in for ${lead.name} — edit anything you like, then send. This is exactly what goes out.`}
                </p>
              </div>

              {needsDemo && (
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-amber-300" style={H}>
                  <span className="text-base leading-none shrink-0">⚠️</span>
                  <p className="text-sm leading-snug">
                    This template links a demo site, but no demo has been built for <span className="font-semibold">{lead.name}</span> yet.
                    Build one in the /websites factory and sync it first, or pick a different template.
                  </p>
                </div>
              )}

              {riskyEmail && (
                <div className={`rounded-xl border px-4 py-3 ${emailStatus === "invalid" ? "border-red-400/30 bg-red-400/10 text-red-300" : "border-amber-400/30 bg-amber-400/10 text-amber-300"}`} style={H}>
                  <div className="flex items-start gap-2.5">
                    <span className="text-base leading-none shrink-0">{emailStatus === "invalid" ? "⛔" : "⚠️"}</span>
                    <p className="text-sm leading-snug">
                      {emailStatus === "invalid"
                        ? <>This address <span className="font-semibold">failed verification</span> — it likely has no working inbox. Sending risks a hard bounce, which hurts the warm-up domain.</>
                        : emailStatus === "risky"
                          ? <>This address looks <span className="font-semibold">risky</span> (catch-all or low-quality). It may bounce.</>
                          : <>This address <span className="font-semibold">couldn&apos;t be verified</span>. It may or may not deliver.</>}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 mt-2.5 ml-[26px] cursor-pointer select-none">
                    <input type="checkbox" checked={overrideRisky} onChange={(e) => setOverrideRisky(e.target.checked)} className="accent-current" />
                    <span className="text-xs font-semibold">Send anyway</span>
                  </label>
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
                <button onClick={handleSend} disabled={sending || !subject.trim() || !body.trim() || atCap || needsDemo || blockedByDeliverability}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
                  style={{ backgroundColor: "#F97316", ...H }}>
                  <Send size={14} />{sending ? "Sending…" : atCap ? "Daily cap reached" : needsDemo ? "No demo built yet" : blockedByDeliverability ? "Confirm address to send" : `Send to ${lead.name}`}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
