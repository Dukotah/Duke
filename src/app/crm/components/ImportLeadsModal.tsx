"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, Upload, FileText, CheckCircle, AlertCircle, Download, Loader2 } from "lucide-react";

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
        "inline-flex items-center gap-1.5 px-3 rounded-xl text-sm bg-[var(--crm-surface)] text-[var(--crm-text-2)] border border-[var(--crm-border)] hover:text-[var(--crm-text)] hover:border-[var(--crm-accent-border)] transition-all h-9 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)]"
      }
      style={H}
      title="Export filtered leads to CSV"
      aria-label="Export filtered leads to CSV"
    >
      <Download size={13} aria-hidden="true" />
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
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Count data rows (excluding header) for the preview.
  const rowCount = csvText.trim()
    ? Math.max(0, csvText.trim().split(/\r?\n/).filter((l) => l.trim()).length - 1)
    : 0;

  // Trap focus inside modal and handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first)?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Focus the modal on mount
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

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
      setDragging(false);
      const file = ev.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((ev: React.DragEvent) => {
    ev.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

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
      role="dialog"
      aria-modal="true"
      aria-label="Import leads from CSV"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative bg-[var(--crm-surface-2)] border border-[var(--crm-border)] rounded-t-2xl sm:rounded-2xl p-6 w-full sm:max-w-lg shadow-2xl max-h-[92vh] overflow-y-auto focus-visible:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5 gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-[var(--crm-text)]" style={H}>
              Import Leads from CSV
            </h2>
            <p className="text-xs text-[var(--crm-text-3)] mt-0.5" style={H}>
              Paste CSV text or upload a file — duplicate emails/phones are skipped automatically.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close import modal"
            className="shrink-0 p-2 min-h-[40px] min-w-[40px] rounded-lg text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] hover:bg-[var(--crm-surface-3)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)]"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Success / result state */}
        {result ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3 py-10">
              <CheckCircle size={40} className="text-emerald-500" aria-hidden="true" />
              <div className="text-center">
                <p className="text-xl font-bold text-[var(--crm-text)]" style={H}>
                  {result.imported} lead{result.imported !== 1 ? "s" : ""} imported
                </p>
                <p className="text-sm text-[var(--crm-text-3)] mt-1" style={H}>
                  {result.skipped} duplicate{result.skipped !== 1 ? "s" : ""} skipped
                </p>
              </div>
            </div>
            {result.errors.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                <p className="text-xs font-semibold text-amber-500 mb-1.5" style={H}>
                  Rows with issues ({result.errors.length}):
                </p>
                <ul className="space-y-0.5 max-h-32 overflow-y-auto" aria-label="Import errors">
                  {result.errors.map((e, i) => (
                    <li key={i} className="text-xs text-amber-500/80" style={H}>
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 min-h-[44px] py-3 rounded-xl text-sm font-semibold bg-[var(--crm-surface)] text-[var(--crm-text-2)] border border-[var(--crm-border)] hover:border-[var(--crm-accent-border)] hover:bg-[var(--crm-surface-3)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)]"
                style={H}
              >
                Import more
              </button>
              <button
                onClick={onClose}
                className="flex-1 min-h-[44px] py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)] focus-visible:ring-offset-2"
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
              role="button"
              tabIndex={0}
              aria-label="Drop a CSV file here or click to browse"
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)] ${
                dragging
                  ? "border-[var(--crm-accent)] bg-[var(--crm-accent-weak)] scale-[1.01]"
                  : "border-[var(--crm-border)] hover:border-[var(--crm-accent-border)] hover:bg-[var(--crm-accent-weak)]"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileRef.current?.click(); } }}
            >
              <Upload
                size={22}
                className={`mx-auto mb-2 transition-colors ${dragging ? "text-[var(--crm-accent)]" : "text-[var(--crm-text-3)]"}`}
                aria-hidden="true"
              />
              <p className="text-sm font-semibold text-[var(--crm-text-2)]" style={H}>
                {dragging ? "Release to upload" : "Drop a CSV here or click to browse"}
              </p>
              <p className="text-xs text-[var(--crm-text-3)] mt-1" style={H}>
                Accepted columns: name, email, phone, website, city, county, niche, contact_name, notes
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                aria-hidden="true"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2" aria-hidden="true">
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
                aria-label="Paste CSV content here"
                className="w-full px-4 py-3 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-xs text-[var(--crm-text-2)] placeholder:text-[var(--crm-text-3)] font-mono resize-none focus:outline-none focus:border-[var(--crm-accent-border)] focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)] transition-colors"
                style={H}
              />
              {csvText && (
                <button
                  onClick={handleReset}
                  aria-label="Clear CSV content"
                  className="absolute top-2 right-2 p-1.5 min-h-[32px] min-w-[32px] rounded-lg text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] hover:bg-[var(--crm-surface-3)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)]"
                >
                  <X size={13} aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Row preview */}
            {rowCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[var(--crm-accent-weak)] border border-[var(--crm-accent-border)]" role="status" aria-live="polite">
                <FileText size={13} className="text-[var(--crm-accent-text)] shrink-0" aria-hidden="true" />
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
              <div
                role="alert"
                className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                style={H}
              >
                <AlertCircle size={14} className="shrink-0" aria-hidden="true" />
                {error}
              </div>
            )}

            {/* Action */}
            <button
              onClick={() => void handleImport()}
              disabled={loading || !csvText.trim()}
              className="w-full min-h-[48px] py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent)] focus-visible:ring-offset-2"
              style={{ backgroundColor: "var(--crm-accent)", ...H }}
              aria-busy={loading}
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" aria-hidden="true" />
              ) : (
                <Upload size={15} aria-hidden="true" />
              )}
              {loading
                ? "Importing…"
                : `Import ${rowCount > 0 ? rowCount.toLocaleString() + " rows" : "CSV"}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
