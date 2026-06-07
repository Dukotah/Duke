"use client";

import { useState } from "react";
import { Globe, Upload, Check, AlertTriangle } from "lucide-react";

const H = { fontFamily: "var(--font-heading)" };

interface ManifestEntry {
  slug: string;
  business: string;
  phone: string;
  email: string;
  city: string;
  url: string;
}

interface SyncResult {
  business: string;
  url: string;
  action: "matched" | "created";
  leadId: string;
  linkedCount?: number;
}

interface SyncResponse {
  matched: number;
  created: number;
  skipped: number;
  total: number;
  results: SyncResult[];
  warnings?: string[];
}

// Validate the parsed JSON looks like a manifest before sending it.
function asManifest(data: unknown): ManifestEntry[] | null {
  if (!Array.isArray(data)) return null;
  const ok = data.every(
    (e) => e && typeof e === "object" && typeof (e as ManifestEntry).url === "string",
  );
  return ok ? (data as ManifestEntry[]) : null;
}

export default function SiteLinksTab() {
  const [manifest, setManifest] = useState<ManifestEntry[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [pasted, setPasted] = useState("");
  const [error, setError] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<SyncResponse | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [clearMsg, setClearMsg] = useState("");

  const load = (raw: string, source: string) => {
    setError(""); setResult(null); setManifest(null); setFileName("");
    if (!raw.trim()) return;
    try {
      const m = asManifest(JSON.parse(raw));
      if (!m) { setError("That isn't a valid sites-manifest.json (expected an array of sites with a url)."); return; }
      setManifest(m);
      setFileName(source);
    } catch {
      setError("Could not parse that as JSON.");
    }
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    load(await file.text(), file.name);
  };

  const clearAll = async () => {
    setClearing(true); setClearMsg(""); setError("");
    try {
      const res = await fetch("/api/crm/site-links", { method: "DELETE" });
      const d = await res.json();
      if (!res.ok) { setError(d.error ?? "Clear failed."); return; }
      const c = d.cleared ?? {};
      setClearMsg(`Cleared ${c.demoLinks ?? 0} demo link(s), ${c.emailOverrides ?? 0} email override(s), and ${c.leads ?? 0} website lead(s).`);
      setResult(null); setManifest(null); setFileName(""); setPasted("");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setClearing(false); setConfirmClear(false);
    }
  };

  const sync = async () => {
    if (!manifest) return;
    setSyncing(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/crm/site-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manifest }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error ?? "Sync failed."); return; }
      setResult(d as SyncResponse);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-5 py-2">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-white flex items-center gap-2" style={H}>
          <Globe size={16} className="text-[#F97316]" />Website Links
        </h3>
        <p className="text-sm text-white/50 leading-relaxed" style={H}>
          Attach generated demo sites to leads so the link can go out in outreach (via the
          {" "}<span className="text-white/70">{"{demoUrl}"}</span> variable). In the websites repo run
          {" "}<span className="text-white/70">npm run manifest</span>, then upload the
          {" "}<span className="text-white/70">sites-manifest.json</span> it creates. Each site is matched to a
          lead by email, phone, or business name; sites with no match become new leads.
        </p>
      </div>

      <label className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1C1C1F] border border-dashed border-white/15 cursor-pointer hover:border-[#F97316]/40 transition-colors" style={H}>
        <Upload size={15} className="text-white/40" />
        <span className="text-sm text-white/60">{fileName || "Choose sites-manifest.json…"}</span>
        <input type="file" accept="application/json,.json" className="hidden"
          onChange={(e) => onFile(e.target.files?.[0])} />
      </label>

      <details className="text-sm">
        <summary className="cursor-pointer text-white/40 hover:text-white/70" style={H}>or paste the manifest JSON</summary>
        <div className="mt-2 space-y-2">
          <textarea value={pasted} onChange={(e) => setPasted(e.target.value)}
            rows={6} placeholder='[ { "business": "...", "phone": "...", "email": "...", "city": "...", "url": "https://..." } ]'
            className="w-full px-3 py-2 rounded-xl bg-[#111113] border border-white/10 text-xs text-white placeholder-white/20 font-mono resize-none focus:outline-none focus:border-[#F97316]/50" />
          <button onClick={() => load(pasted, "pasted JSON")} disabled={!pasted.trim()}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40" style={H}>
            Load pasted JSON
          </button>
        </div>
      </details>

      {manifest && !result && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-white/50" style={H}>{manifest.length} site(s) ready to sync.</p>
          <button onClick={sync} disabled={syncing}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 disabled:opacity-40 transition-opacity"
            style={{ backgroundColor: "#F97316", ...H }}>
            <Globe size={14} />{syncing ? "Syncing…" : "Sync website links"}
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400 flex items-center gap-2" style={H}>
          <AlertTriangle size={14} />{error}
        </p>
      )}

      {result && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-green-400" style={H}>
            <Check size={15} />Synced {result.total} site(s): {result.matched} matched, {result.created} new lead(s)
            {result.skipped > 0 ? `, ${result.skipped} skipped` : ""}.
          </div>
          <div className="rounded-xl border border-white/[0.06] divide-y divide-white/[0.06] overflow-hidden">
            {result.results.map((r) => (
              <div key={r.leadId} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                <span className="text-white/70 truncate" style={H}>{r.business}</span>
                <span className={`text-xs font-semibold shrink-0 ${r.action === "matched" ? "text-green-400" : "text-[#F97316]"}`}>
                  {r.action === "matched" ? `matched${r.linkedCount && r.linkedCount > 1 ? ` ×${r.linkedCount}` : ""}` : "new lead"}
                </span>
              </div>
            ))}
          </div>

          {result.warnings && result.warnings.length > 0 && (
            <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-yellow-400 flex items-center gap-1.5" style={H}>
                <AlertTriangle size={13} />Heads up ({result.warnings.length})
              </p>
              {result.warnings.map((w, i) => (
                <p key={i} className="text-xs text-white/55 leading-relaxed" style={H}>{w}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {clearMsg && <p className="text-sm text-green-400 flex items-center gap-2" style={H}><Check size={14} />{clearMsg}</p>}

      <div className="pt-2 mt-2 border-t border-white/[0.06]">
        {!confirmClear ? (
          <button onClick={() => { setConfirmClear(true); setClearMsg(""); }}
            className="text-xs text-white/35 hover:text-red-400 transition-colors" style={H}>
            Clear all synced website links…
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/55" style={H}>
              Remove every demo link, email override, and website-created lead? (Other CRM data is untouched.)
            </span>
            <button onClick={clearAll} disabled={clearing}
              className="text-xs font-semibold text-red-400 hover:text-red-300 disabled:opacity-40" style={H}>
              {clearing ? "Clearing…" : "Yes, clear"}
            </button>
            <button onClick={() => setConfirmClear(false)} disabled={clearing}
              className="text-xs text-white/40 hover:text-white/70" style={H}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
