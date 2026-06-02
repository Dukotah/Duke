"use client";

import { useState, useCallback } from "react";
import {
  X, Mail, Save, RotateCcw, Check, Plus, Trash2, Send, Pencil,
  ShieldCheck, FlaskConical, Eye, Users,
} from "lucide-react";
import {
  loadTemplates, saveTemplateOverride, resetTemplateOverride, hasOverride,
  isCustomTemplate, createCustomTemplate, updateCustomTemplate, deleteCustomTemplate,
  personalize, type EmailTemplate,
} from "./emailTemplates";

const H = { fontFamily: "var(--font-heading)" };

// Sample lead used to show what a personalized email will look like before any
// real lead is selected. Reps can edit these to sanity-check their variables.
const DEFAULT_SAMPLE = { name: "Jordan", business: "Petaluma Plumbing", city: "Petaluma" };

interface Props {
  repName: string;
  onClose: () => void;
  // Optional: jump straight into the bulk-send flow with the lead picker.
  onBulkSend?: () => void;
}

type DeliveryMode = "unknown" | "live" | "practice";

export default function OutreachTemplates({ repName, onClose, onBulkSend }: Props) {
  const [templates, setTemplates] = useState<EmailTemplate[]>(() => loadTemplates());
  const [activeKey, setActiveKey] = useState<string>(() => templates[0]?.key ?? "custom");

  // Editable working copy for the selected template (seeded from the first one).
  const [label, setLabel] = useState(() => templates[0]?.label ?? "");
  const [subject, setSubject] = useState(() => templates[0]?.subject ?? "");
  const [body, setBody] = useState(() => templates[0]?.body ?? "");
  const [fromName, setFromName] = useState(repName);
  const [savedFlash, setSavedFlash] = useState(false);

  // Preview personalization vars (editable so reps can spot-check).
  const [sample, setSample] = useState(DEFAULT_SAMPLE);

  // Test-send state.
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sendNote, setSendNote] = useState<{ kind: "ok" | "logged" | "error"; text: string } | null>(null);

  // Delivery mode is learned from the outreach API's response (no gating change).
  const [mode, setMode] = useState<DeliveryMode>("unknown");

  const active = templates.find((t) => t.key === activeKey);
  const isCustom = active ? isCustomTemplate(active.key) : false;
  const isScratch = activeKey === "custom";
  const overridden = !isCustom && !isScratch && hasOverride(activeKey);

  // Sync the working copy whenever the selected template changes.
  const selectTemplate = useCallback((key: string) => {
    setActiveKey(key);
    const t = loadTemplates().find((x) => x.key === key);
    if (t) {
      setLabel(t.label);
      setSubject(t.subject);
      setBody(t.body);
    }
    setSendNote(null);
  }, []);

  const refreshTemplates = useCallback((nextKey?: string) => {
    const fresh = loadTemplates();
    setTemplates(fresh);
    const key = nextKey ?? activeKey;
    const t = fresh.find((x) => x.key === key) ?? fresh[0];
    if (t) {
      setActiveKey(t.key);
      setLabel(t.label);
      setSubject(t.subject);
      setBody(t.body);
    }
  }, [activeKey]);

  const flashSaved = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  // Persist edits. Built-in templates store an override; custom templates are
  // updated in place; the "custom" scratch entry isn't persisted.
  const saveEdits = () => {
    if (isScratch) return;
    if (isCustom) {
      updateCustomTemplate(activeKey, { label, subject, body });
    } else {
      saveTemplateOverride(activeKey, subject, body);
    }
    refreshTemplates();
    flashSaved();
  };

  const resetEdits = () => {
    if (isScratch) return;
    if (isCustom) {
      // Reset = re-pull the stored values (discard unsaved edits).
      const t = loadTemplates().find((x) => x.key === activeKey);
      if (t) { setLabel(t.label); setSubject(t.subject); setBody(t.body); }
      return;
    }
    resetTemplateOverride(activeKey);
    refreshTemplates();
  };

  const addTemplate = () => {
    const created = createCustomTemplate("New template", subject || "Quick question about {business}", body || "Hi {name},\n\n\n\nThanks,\n{fromName}");
    refreshTemplates(created.key);
  };

  const removeTemplate = () => {
    if (!isCustom) return;
    deleteCustomTemplate(activeKey);
    refreshTemplates();
  };

  const vars = { ...sample, fromName };
  const previewSubject = personalize(subject, vars);
  const previewBody = personalize(body, vars);

  // Send a single test email through the existing outreach endpoint. The API
  // decides whether it's actually delivered (live) or just tracked (practice).
  const sendTest = async () => {
    const email = testEmail.trim();
    if (!email || !subject.trim() || !body.trim()) return;
    setSending(true);
    setSendNote(null);
    try {
      const res = await fetch("/api/crm/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leads: [{ id: `test-${Date.now()}`, name: sample.name, email, city: sample.city }],
          subject,
          body,
          fromName,
          test: true,
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        setSendNote({ kind: "error", text: d.error ?? "Could not send test email." });
        return;
      }
      // domainVerified comes straight from the API; use it to label the mode.
      if (typeof d.domainVerified === "boolean") {
        setMode(d.domainVerified ? "live" : "practice");
      }
      const delivered = (d.delivered ?? 0) >= 1;
      if (delivered) {
        setSendNote({ kind: "ok", text: `Test email delivered to ${email}.` });
      } else if ((d.sent ?? 0) >= 1) {
        setSendNote({ kind: "logged", text: `Practice mode — logged a test to ${email} but didn't actually send it.` });
      } else {
        setSendNote({ kind: "error", text: d.skipped ? "Address was skipped (invalid or unsubscribed)." : "Nothing was sent." });
      }
    } catch {
      setSendNote({ kind: "error", text: "Network error — please try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#111113]" style={H}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] shrink-0">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Mail size={15} className="text-[#F97316]" />Email Templates
          </h2>
          <p className="text-xs text-white/40 mt-0.5">Compose, preview, and manage your outreach scripts</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {onBulkSend && (
            <button
              onClick={onBulkSend}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white/60 bg-white/5 border border-white/10 hover:text-white hover:border-white/20 transition-colors"
              style={H}
              title="Send this template to many leads"
            >
              <Users size={13} /><span className="hidden sm:inline">Bulk send</span>
            </button>
          )}
          <button onClick={onClose} className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Delivery-mode banner — only shown once we've learned the mode from a test */}
      {mode !== "unknown" && (
        <div
          className={`flex items-start gap-3 px-5 py-3 border-b shrink-0 ${
            mode === "live"
              ? "bg-green-500/5 border-green-500/15"
              : "bg-yellow-400/5 border-yellow-400/15"
          }`}
        >
          {mode === "live"
            ? <ShieldCheck size={15} className="text-green-400 shrink-0 mt-0.5" />
            : <FlaskConical size={15} className="text-yellow-400 shrink-0 mt-0.5" />}
          <p className="text-xs text-white/60 leading-relaxed">
            {mode === "live" ? (
              <><span className="font-bold text-white">Live delivery is on.</span> Test sends go out for real from your verified domain.</>
            ) : (
              <><span className="font-bold text-white">Safe practice mode.</span> Emails are tracked on lead timelines but not actually delivered. Sending stays locked until the domain is verified — this protects your domain from being flagged as spam.</>
            )}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 py-4 grid gap-4 md:grid-cols-[200px_1fr]">
          {/* Template list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Templates</p>
              <button
                onClick={addTemplate}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#F97316] hover:text-[#F97316]/80 transition-colors"
                title="New template"
              >
                <Plus size={12} />New
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {templates.map((t) => (
                <button
                  key={t.key}
                  onClick={() => selectTemplate(t.key)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all ${
                    activeKey === t.key
                      ? "bg-[#F97316]/10 border-[#F97316]/30 text-[#F97316]"
                      : "bg-[#1C1C1F] border-white/[0.06] text-white/60 hover:border-white/20"
                  }`}
                >
                  <span className="text-sm font-semibold truncate flex-1">{t.label}</span>
                  {isCustomTemplate(t.key) && <Pencil size={10} className="text-white/25 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Editor + preview */}
          <div className="space-y-4 min-w-0">
            {/* Label (custom templates only) */}
            {isCustom && (
              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Template Name</label>
                <input
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#F97316]/50"
                  style={H}
                />
              </div>
            )}

            {/* From name */}
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Your Name</label>
              <input
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#F97316]/50"
                style={H}
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Subject Line</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject — use {name}, {business}, {city}"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50"
                style={H}
              />
            </div>

            {/* Body */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Message Body</label>
                {!isScratch && (
                  <div className="flex items-center gap-3">
                    <button onClick={saveEdits} className="text-xs font-semibold text-white/40 hover:text-[#F97316] flex items-center gap-1 transition-colors">
                      {savedFlash ? <><Check size={11} className="text-green-400" />Saved</> : <><Save size={11} />Save</>}
                    </button>
                    {(overridden || isCustom) && (
                      <button onClick={resetEdits} className="text-xs font-semibold text-white/30 hover:text-white/60 flex items-center gap-1 transition-colors">
                        <RotateCcw size={11} />Reset
                      </button>
                    )}
                    {isCustom && (
                      <button onClick={removeTemplate} className="text-xs font-semibold text-white/30 hover:text-red-400 flex items-center gap-1 transition-colors">
                        <Trash2 size={11} />Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-white/25 mb-2">Variables: {"{name}"}, {"{business}"}, {"{city}"}, {"{fromName}"}</p>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={12}
                placeholder="Write your message…"
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white placeholder-white/20 resize-none focus:outline-none focus:border-[#F97316]/50 leading-relaxed"
                style={H}
              />
            </div>

            {/* Preview */}
            <div className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/35 font-semibold uppercase tracking-wider flex items-center gap-1.5"><Eye size={12} />Live Preview</p>
                <div className="flex items-center gap-2">
                  <input
                    value={sample.name}
                    onChange={(e) => setSample((s) => ({ ...s, name: e.target.value }))}
                    className="w-20 px-2 py-1 rounded-lg bg-[#111113] border border-white/10 text-xs text-white/70 focus:outline-none focus:border-[#F97316]/50"
                    placeholder="Name"
                    style={H}
                  />
                  <input
                    value={sample.business}
                    onChange={(e) => setSample((s) => ({ ...s, business: e.target.value }))}
                    className="w-28 px-2 py-1 rounded-lg bg-[#111113] border border-white/10 text-xs text-white/70 focus:outline-none focus:border-[#F97316]/50"
                    placeholder="Business"
                    style={H}
                  />
                  <input
                    value={sample.city}
                    onChange={(e) => setSample((s) => ({ ...s, city: e.target.value }))}
                    className="w-20 px-2 py-1 rounded-lg bg-[#111113] border border-white/10 text-xs text-white/70 focus:outline-none focus:border-[#F97316]/50"
                    placeholder="City"
                    style={H}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs text-white/40 font-semibold mb-1">Subject</p>
                <p className="text-sm text-white font-semibold">{previewSubject || <span className="text-white/25">No subject yet</span>}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 font-semibold mb-1">Body</p>
                <pre className="text-sm text-white/75 whitespace-pre-wrap leading-relaxed font-sans">{previewBody || <span className="text-white/25">Nothing to preview yet.</span>}</pre>
              </div>
            </div>

            {/* Test send */}
            <div className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] p-4 space-y-3">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Send a Test</p>
              <div className="flex gap-2">
                <input
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="you@example.com"
                  type="email"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50"
                  style={H}
                />
                <button
                  onClick={sendTest}
                  disabled={sending || !testEmail.trim() || !subject.trim() || !body.trim()}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity shrink-0"
                  style={{ backgroundColor: "#F97316", ...H }}
                >
                  <Send size={14} />{sending ? "Sending…" : "Test"}
                </button>
              </div>
              {sendNote && (
                <p
                  className={`text-xs leading-relaxed ${
                    sendNote.kind === "error" ? "text-red-400"
                      : sendNote.kind === "logged" ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {sendNote.text}
                </p>
              )}
              <p className="text-[11px] text-white/25 leading-relaxed">
                A test runs through the same outreach pipeline as real sends. If delivery isn&apos;t live yet, it&apos;s logged but not actually emailed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
