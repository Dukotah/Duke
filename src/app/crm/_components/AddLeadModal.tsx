import { useState } from "react";
import { X } from "lucide-react";
import type { Lead, WebsiteSignals } from "@/lib/crm/types";
import { computeHeatScore } from "@/lib/crm/scoring";
import HeatBadge from "./HeatBadge";

const EMPTY_SIGNALS: WebsiteSignals = {
  noWebsite: false,
  hasSSL: true,
  speedScore: null,
  mobileScore: null,
  brokenLinks: 0,
  notMobileFriendly: false,
  copyrightYear: null,
};

export default function AddLeadModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (lead: Lead) => void;
}) {
  const [form, setForm] = useState({
    business: "",
    contactName: "",
    phone: "",
    email: "",
    website: "",
    industry: "",
    city: "",
    estValue: "3000",
    source: "Manual",
  });
  const [signals, setSignals] = useState<WebsiteSignals>(EMPTY_SIGNALS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function setSig<K extends keyof WebsiteSignals>(k: K, v: WebsiteSignals[K]) {
    setSignals((s) => ({ ...s, [k]: v }));
  }

  const estValueNum = Number(form.estValue) || 0;
  const heatPreview = computeHeatScore(signals, estValueNum);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.business.trim() || !form.phone.trim()) {
      setError("Business name and phone are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business: form.business.trim(),
          contactName: form.contactName.trim() || undefined,
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          website: form.website.trim() || undefined,
          industry: form.industry.trim() || "Unknown",
          city: form.city.trim(),
          estValue: estValueNum,
          source: form.source.trim() || "Manual",
          signals,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Couldn't save the lead.");
        return;
      }
      onCreated(json.lead);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSaving(false);
    }
  }

  const field =
    "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="my-8 w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Add a lead</h2>
          <div className="flex items-center gap-3">
            <HeatBadge score={heatPreview} />
            <button type="button" onClick={onClose} className="text-zinc-500 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="col-span-2 text-xs text-zinc-400">
            Business *
            <input className={field} value={form.business} onChange={(e) => set("business", e.target.value)} placeholder="Acme Plumbing" />
          </label>
          <label className="text-xs text-zinc-400">
            Contact name
            <input className={field} value={form.contactName} onChange={(e) => set("contactName", e.target.value)} placeholder="Jane Doe" />
          </label>
          <label className="text-xs text-zinc-400">
            Phone *
            <input className={field} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(707) 555-0100" />
          </label>
          <label className="text-xs text-zinc-400">
            Email
            <input className={field} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@acme.com" />
          </label>
          <label className="text-xs text-zinc-400">
            Website
            <input className={field} value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="acmeplumbing.com" />
          </label>
          <label className="text-xs text-zinc-400">
            Industry
            <input className={field} value={form.industry} onChange={(e) => set("industry", e.target.value)} placeholder="Plumber" />
          </label>
          <label className="text-xs text-zinc-400">
            City
            <input className={field} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Santa Rosa" />
          </label>
          <label className="text-xs text-zinc-400">
            Est. deal value ($)
            <input className={field} type="number" min="0" value={form.estValue} onChange={(e) => set("estValue", e.target.value)} />
          </label>
          <label className="text-xs text-zinc-400">
            Source
            <input className={field} value={form.source} onChange={(e) => set("source", e.target.value)} placeholder="Manual" />
          </label>
        </div>

        {/* Website issues — drive the heat score */}
        <fieldset className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
          <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Website issues (sets the heat score)
          </legend>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Check label="No website" checked={signals.noWebsite} onChange={(v) => setSig("noWebsite", v)} />
            <Check label="Not secure (no SSL)" checked={!signals.hasSSL} onChange={(v) => setSig("hasSSL", !v)} disabled={signals.noWebsite} />
            <Check label="Not mobile-friendly" checked={signals.notMobileFriendly} onChange={(v) => setSig("notMobileFriendly", v)} disabled={signals.noWebsite} />
            <label className={`flex items-center gap-2 text-sm ${signals.noWebsite ? "opacity-40" : "text-zinc-300"}`}>
              Speed score
              <input
                type="number"
                min="0"
                max="100"
                disabled={signals.noWebsite}
                value={signals.speedScore ?? ""}
                onChange={(e) => setSig("speedScore", e.target.value === "" ? null : Number(e.target.value))}
                placeholder="0–100"
                className="w-20 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-sm text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
              />
            </label>
            <label className={`flex items-center gap-2 text-sm ${signals.noWebsite ? "opacity-40" : "text-zinc-300"}`}>
              Broken links
              <input
                type="number"
                min="0"
                disabled={signals.noWebsite}
                value={signals.brokenLinks}
                onChange={(e) => setSig("brokenLinks", Number(e.target.value) || 0)}
                className="w-20 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-sm text-white focus:border-orange-500 focus:outline-none"
              />
            </label>
          </div>
        </fieldset>

        {error && (
          <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm text-zinc-400 hover:text-white">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-orange-500 px-5 py-2 text-sm font-bold text-white hover:bg-orange-400 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Add lead"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`flex items-center gap-2 text-sm ${disabled ? "opacity-40" : "text-zinc-300"}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-zinc-700 bg-zinc-950 accent-orange-500"
      />
      {label}
    </label>
  );
}
