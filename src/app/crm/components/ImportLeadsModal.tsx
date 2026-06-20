"use client";

import { useState, useRef, useCallback } from "react";
import { X, Upload, FileText, CheckCircle, AlertCircle, Download } from "lucide-react";

const H = { fontFamily: "var(--font-heading)" };

// ─── ExportButton ─────────────────────────────────────────────────────────────
// Drop-in link that exports the currently-filtered All Leads view to CSV.
// Pass the same query-param object you're already sending to /api/crm/leads.

export interface ExportFilters {
  q?: string;
  county?: string;
  niche?: string;
  tier?: string;
  hasEmail?: string;
  hasWebsite?: string;
  emailStatus?: string;
  grade?: string;
  reachChannel?: string;
  hotLeads?: string;
  allTerritories?: string;
  sortBy?: string;
}

interface ExportButtonProps {
  filters?: ExportFilters;
  className?: string;
}

export function ExportButton({ filters = {}, className }: ExportButtonProps) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v) sp.set(k, v);
  }
  const href = `/api/crm/export${sp.size ? `?${sp}` : ""}`;

  return (
    <a
      href={href}
      download
      className={
        className ??
        "inline-flex items-center gap-1.5 px-3 rounded-xl text-sm bg-[var(--crm-surface)] text-[var(--crm-text-2)] border border-[var(--crm-border)] hover:text-[var(--crm-text)] hover:border-[var(--crm-border-strong)] transition-all h-9"
      }
      style={H}
      title="Export filtered leads to CSV"
    >
      <Download size={13} />
      <span className="hidden sm:inline">Export CSV</span>
    </a>
  );
}

// ─── ImportLeadsModal ─────────────────────────────────────────────────────────

interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

interface Props {
  onClose: () => void;
  onImported: () => void;
}

export default function ImportLeadsModal({ onClose, onImported }: Props) {
  const [csvText, setCsvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Count data rows (excluding header) for the preview.
  const rowCount = csvText.trim()
    ? Math.max(0, csvText.trim().split(/\r?\n/).filter((l) => l.trim()).length - 1)
    : 0;

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      setError("Please upload a .csv file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) ?? "";
      setCsvText(text);
      setError("");
      setResult(null);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (ev: React.DragEvent) => {
      ev.preventDefault();
      const file = ev.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  async function handleImport() {
    if (!csvText.trim()) { setError("Paste or upload a CSV first."); return; }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/crm/import-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: csvText }),
      });
      const data = (await res.json()) as ImportResult & { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Import failed");
        setLoading(false);
        return;
      }
      setResult(data);
      if (data.imported > 0) onImported();
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setCsvText("");
    setResult(null);
    setError("");
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-[var(--crm-surface-2)] border border-[var(--crm-border-strong)] rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-lg shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-[var(--crm-text)]" style={H}>
              Import Leads from CSV
            </h2>
            <p className="text-xs text-[var(--crm-text-3)] mt-0.5" style={H}>
              Paste CSV text or upload a file — duplicate emails/phones are skipped automatically.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] hover:bg-[var(--crm-surface-3)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success / result state */}
        {result ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3 py-8">
              <CheckCircle size={36} className="text-emerald-500" />
              <div className="text-center">
                <p className="text-lg font-bold text-[var(--crm-text)]" style={H}>
                  {result.imported} lead{result.imported !== 1 ? "s" : ""} imported
                </p>
                <p className="text-sm text-[var(--crm-text-3)] mt-1" style={H}>
                  {result.skipped} duplicate{result.skipped !== 1 ? "s" : ""} skipped
                </p>
              </div>
            </div>
            {result.errors.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                <p className="text-xs font-semibold text-amber-400 mb-1.5" style={H}>
                  Rows with issues ({result.errors.length}):
                </p>
                <ul className="space-y-0.5 max-h-32 overflow-y-auto">
                  {result.errors.map((e, i) => (
                    <li key={i} className="text-xs text-amber-300/80" style={H}>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[var(--crm-surface)] text-[var(--crm-text-2)] border border-[var(--crm-border)] hover:border-[var(--crm-border-strong)] transition-colors"
                style={H}
              >
                Import more
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-opacity"
                style={{ backgroundColor: "var(--crm-accent)", ...H }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Drop zone / upload */}
            <div
              className="border-2 border-dashed border-[var(--crm-border-strong)] rounded-xl p-6 text-center cursor-pointer hover:border-[var(--crm-accent-border)] hover:bg-[var(--crm-accent-weak)] transition-all"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={22} className="mx-auto mb-2 text-[var(--crm-text-3)]" />
              <p className="text-sm font-semibold text-[var(--crm-text-2)]" style={H}>
                Drop a CSV here or click to browse
              </p>
              <p className="text-xs text-[var(--crm-text-3)] mt-1" style={H}>
                Accepted columns: name, email, phone, website, city, county, niche, contact_name, notes
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-[var(--crm-border)]" />
              <span className="text-xs text-[var(--crm-text-3)]" style={H}>or paste CSV</span>
              <div className="flex-1 h-px bg-[var(--crm-border)]" />
            </div>

            {/* Paste area */}
            <div className="relative">
              <textarea
                value={csvText}
                onChange={(e) => { setCsvText(e.target.value); setError(""); setResult(null); }}
                rows={8}
                placeholder={"name,email,phone,city,county,niche\nAcme Landscaping,owner@acme.com,(707) 555-0100,Santa Rosa,Sonoma,landscaping"}
                className="w-full px-4 py-3 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border-strong)] text-xs text-[var(--crm-text-2)] placeholder:text-[var(--crm-text-3)] font-mono resize-none focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors"
                style={H}
              />
              {csvText && (
                <button
                  onClick={handleReset}
                  className="absolute top-2 right-2 p-1 rounded-lg text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] hover:bg-[var(--crm-surface-3)] transition-colors"
                  title="Clear"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Row preview */}
            {rowCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--crm-accent-weak)] border border-[var(--crm-accent-border)]">
                <FileText size={13} className="text-[var(--crm-accent-text)] shrink-0" />
                <p className="text-xs font-semibold text-[var(--crm-accent-text)]" style={H}>
                  {rowCount.toLocaleString()} row{rowCount !== 1 ? "s" : ""} ready to import
                  <span className="font-normal text-[var(--crm-text-3)] ml-1">
                    — duplicates will be skipped automatically
                  </span>
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400" style={H}>
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Action */}
            <button
              onClick={handleImport}
              disabled={loading || !csvText.trim()}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
              style={{ backgroundColor: "var(--crm-accent)", ...H }}
            >
              <Upload size={15} />
              {loading ? "Importing…" : `Import ${rowCount > 0 ? rowCount.toLocaleString() + " rows" : "CSV"}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
