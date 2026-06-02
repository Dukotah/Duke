import { useState } from "react";
import { Mail, Send, Copy, ExternalLink, RefreshCw, Check } from "lucide-react";
import type { Lead, Rep } from "@/lib/crm/types";
import { buildEmailDraft, problemList } from "@/lib/crm/scoring";
import LeadQueue from "./LeadQueue";

export default function EmailTab({
  leads,
  active,
  reps,
  repId,
  onSelect,
  onSent,
}: {
  leads: Lead[];
  active: Lead | null;
  reps: Rep[];
  repId: string;
  onSelect: (id: string) => void;
  onSent: (lead: Lead) => void;
}) {
  const repName = reps.find((r) => r.id === repId)?.name ?? "Me";

  return (
    <div className="grid h-full grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)]">
      <div className="hidden min-h-0 lg:block">
        <LeadQueue leads={leads} activeId={active?.id ?? null} onSelect={onSelect} />
      </div>
      <div className="min-h-0 overflow-y-auto">
        {active ? (
          <Composer key={active.id} lead={active} repName={repName} repId={repId} onSent={onSent} />
        ) : (
          <div className="grid h-full place-items-center rounded-2xl border border-zinc-800 bg-zinc-900">
            <p className="text-sm text-zinc-500">Select a lead to write to them.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Composer({
  lead,
  repName,
  repId,
  onSent,
}: {
  lead: Lead;
  repName: string;
  repId: string;
  onSent: (lead: Lead) => void;
}) {
  const initial = buildEmailDraft(lead, repName);
  const [to, setTo] = useState(lead.email ?? "");
  const [subject, setSubject] = useState(initial.subject);
  const [body, setBody] = useState(initial.body);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [copied, setCopied] = useState(false);

  function regenerate() {
    const d = buildEmailDraft(lead, repName);
    setSubject(d.subject);
    setBody(d.body);
    setStatus(null);
  }

  async function persistEmailIfNew() {
    if (to.trim() && to.trim() !== (lead.email ?? "")) {
      await fetch(`/api/crm/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: to.trim() }),
      }).catch(() => {});
    }
  }

  async function send(viaProvider: boolean) {
    if (!to.trim()) {
      setStatus({ kind: "err", msg: "Add a recipient email first." });
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      await persistEmailIfNew();
      const res = await fetch(`/api/crm/leads/${lead.id}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: to.trim(), subject, body, repId, send: viaProvider }),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus({ kind: "err", msg: json.error || "Couldn't send." });
        return;
      }
      onSent(json.lead);
      setStatus({
        kind: "ok",
        msg: json.sent
          ? "Sent and logged to the timeline."
          : "Logged to the timeline. (Email provider not configured — use Open in mail app to actually send.)",
      });
    } catch {
      setStatus({ kind: "err", msg: "Network error — please try again." });
    } finally {
      setBusy(false);
    }
  }

  function openInMailApp() {
    const href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(href, "_blank");
    // Record it as an outreach without trying to send through the provider.
    void send(false);
  }

  async function copyBody() {
    try {
      await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  const problems = problemList(lead.signals);
  const field =
    "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none";

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Mail size={18} className="text-orange-400" />
          <h2 className="text-lg font-bold text-white">{lead.business}</h2>
        </div>
        <button
          onClick={regenerate}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
        >
          <RefreshCw size={13} /> Regenerate draft
        </button>
      </div>

      {problems.length > 0 && (
        <p className="mb-4 text-xs text-zinc-500">
          Draft references: {problems.slice(0, 3).map((p) => p.label).join(" · ")}
        </p>
      )}

      <div className="space-y-3">
        <label className="block text-xs text-zinc-400">
          To
          <input className={field} type="email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="name@business.com" />
        </label>
        <label className="block text-xs text-zinc-400">
          Subject
          <input className={field} value={subject} onChange={(e) => setSubject(e.target.value)} />
        </label>
        <label className="block text-xs text-zinc-400">
          Body
          <textarea className={`${field} min-h-[220px] resize-y leading-relaxed`} value={body} onChange={(e) => setBody(e.target.value)} />
        </label>
      </div>

      {status && (
        <p
          className={`mt-3 rounded-lg px-3 py-2 text-sm ${
            status.kind === "ok" ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-400"
          }`}
        >
          {status.msg}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => send(true)}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-400 disabled:opacity-50"
        >
          <Send size={15} /> {busy ? "Sending…" : "Send"}
        </button>
        <button
          onClick={openInMailApp}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
        >
          <ExternalLink size={15} /> Open in mail app
        </button>
        <button
          onClick={copyBody}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
