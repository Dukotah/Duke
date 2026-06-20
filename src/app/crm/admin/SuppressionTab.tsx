"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ShieldOff, Search, Plus, Check, RotateCcw } from "lucide-react";

// ─── Suppression / Unsubscribe admin view ─────────────────────────────────────
// Inspect every address on the outreach suppression list (people who clicked the
// one-click unsubscribe in our emails, plus anyone an admin opted out manually),
// search across them, and add/remove entries by hand. Backed by
// /api/crm/admin/outreach (GET list · POST suppress · DELETE re-allow), which in
// turn reads the same set hit by /api/unsubscribe.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SuppressionTab() {
  const H = { fontFamily: "var(--font-heading)" };
  const [suppressed, setSuppressed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/admin/outreach");
      if (res.ok) {
        const d = await res.json();
        setSuppressed(d.suppressed ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]); // eslint-disable-line react-hooks/set-state-in-effect

  async function suppress(e: React.FormEvent) {
    e.preventDefault();
    const clean = newEmail.trim().toLowerCase();
    if (!EMAIL_RE.test(clean)) { setError("Enter a valid email address."); return; }
    if (suppressed.includes(clean)) { setError("That address is already suppressed."); return; }
    setAdding(true); setError("");
    try {
      const res = await fetch("/api/crm/admin/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean }),
      });
      if (res.ok) {
        setSuppressed((prev) => [...prev, clean].sort());
        setNewEmail("");
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Could not suppress that address.");
      }
    } finally {
      setAdding(false);
    }
  }

  async function reAllow(email: string) {
    setSuppressed((prev) => prev.filter((e) => e !== email));
    await fetch("/api/crm/admin/outreach", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? suppressed.filter((e) => e.includes(q)) : suppressed;
    return [...list].sort();
  }, [suppressed, query]);

  return (
    <div className="space-y-5">
      {/* Summary + manual suppress */}
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-3">
        <div className="bg-[var(--crm-surface)] rounded-xl border border-[var(--crm-border)] px-5 py-4 lg:min-w-[180px]">
          <div className="flex items-center gap-2 text-xs text-[var(--crm-text-3)] mb-2" style={H}>
            <ShieldOff size={14} className="text-red-400" />Suppressed addresses
          </div>
          <p className="text-2xl font-bold text-[var(--crm-text)] tabular-nums" style={H}>{suppressed.length}</p>
        </div>

        <form onSubmit={suppress} className="bg-[var(--crm-surface)] rounded-xl border border-[var(--crm-border)] px-5 py-4">
          <p className="text-xs font-semibold text-[var(--crm-text-3)] uppercase tracking-wider mb-2" style={H}>
            Manually suppress an address
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => { setNewEmail(e.target.value); if (error) setError(""); }}
              placeholder="someone@example.com"
              className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-[var(--crm-surface-2)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors"
              style={H}
            />
            <button
              type="submit"
              disabled={adding || !newEmail.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--crm-accent)", ...H }}>
              <Plus size={14} />{adding ? "Adding…" : "Suppress"}
            </button>
          </div>
          {error && <p className="text-xs text-red-400 mt-2" style={H}>{error}</p>}
          <p className="text-xs text-[var(--crm-text-3)] mt-2" style={H}>
            Use this when someone opts out by phone or reply. They&apos;ll be skipped on every send.
          </p>
        </form>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--crm-text-3)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search suppressed emails…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors"
          style={H}
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-[var(--crm-accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : suppressed.length === 0 ? (
        <div className="text-center py-16 text-[var(--crm-text-3)] text-sm bg-[var(--crm-surface)] rounded-xl border border-[var(--crm-border)]" style={H}>
          Nobody has unsubscribed. 🎉
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-[var(--crm-text-3)] text-sm bg-[var(--crm-surface)] rounded-xl border border-[var(--crm-border)]" style={H}>
          No suppressed addresses match &quot;{query}&quot;.
        </div>
      ) : (
        <div className="bg-[var(--crm-surface)] rounded-xl border border-[var(--crm-border)] divide-y divide-[var(--crm-border)]">
          {filtered.map((email) => (
            <div key={email} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <span className="text-sm text-[var(--crm-text-2)] truncate flex items-center gap-2" style={H}>
                <ShieldOff size={12} className="text-red-400 shrink-0" />{email}
              </span>
              <button onClick={() => reAllow(email)}
                className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--crm-text-3)] hover:text-green-500 transition-colors" style={H}>
                <RotateCcw size={11} />Re-allow
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-[var(--crm-text-3)] px-1 flex items-start gap-1.5" style={H}>
        <Check size={12} className="text-[var(--crm-text-3)] shrink-0 mt-0.5" />
        Suppressed addresses are skipped on every send. Re-allow only with the person&apos;s consent.
      </p>
    </div>
  );
}
