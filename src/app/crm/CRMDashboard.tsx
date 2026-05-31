"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Phone,
  Globe,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
  ExternalLink,
  Tag,
  StickyNote,
  CheckCircle2,
  Clock,
  XCircle,
  Trophy,
  Inbox,
  RefreshCw,
  ChevronDown,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Lead {
  id: string;
  name: string;
  phone: string;
  website: string;
  city: string;
  county: string;
  niche: string;
  address: string;
}

type Status = "new" | "contacted" | "follow_up" | "not_interested" | "won";

interface CRMEntry {
  status: Status;
  notes: string;
  lastContacted?: string;
}

type CRMState = Record<string, CRMEntry>;

interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  counties: string[];
  niches: string[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUSES: { value: Status; label: string; color: string; bg: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { value: "new", label: "New", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", Icon: Inbox },
  { value: "contacted", label: "Contacted", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", Icon: Clock },
  { value: "follow_up", label: "Follow Up", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/20", Icon: RefreshCw },
  { value: "won", label: "Won", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20", Icon: Trophy },
  { value: "not_interested", label: "Not Interested", color: "text-zinc-500", bg: "bg-zinc-500/10 border-zinc-500/20", Icon: XCircle },
];

const STATUS_MAP = Object.fromEntries(STATUSES.map((s) => [s.value, s]));

const STORAGE_KEY = "crm_state_v1";

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useCRMState() {
  const [state, setState] = useState<CRMState>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
  }, []);

  const update = useCallback((id: string, patch: Partial<CRMEntry>) => {
    setState((prev) => {
      const current = prev[id] ?? { status: "new", notes: "" };
      const next = { ...prev, [id]: { ...current, ...patch } };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const get = useCallback(
    (id: string): CRMEntry => state[id] ?? { status: "new", notes: "" },
    [state]
  );

  const stats = {
    total: Object.keys(state).length,
    byStatus: Object.fromEntries(
      STATUSES.map((s) => [s.value, Object.values(state).filter((e) => e.status === s.value).length])
    ) as Record<Status, number>,
  };

  return { get, update, stats };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  const s = STATUS_MAP[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.color} ${s.bg}`}
      style={{ fontFamily: "var(--font-heading)" }}
    >
      <s.Icon size={10} />
      {s.label}
    </span>
  );
}

function StatusPicker({
  current,
  onChange,
}: {
  current: Status;
  onChange: (s: Status) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const s = STATUS_MAP[current];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-opacity hover:opacity-80 ${s.color} ${s.bg}`}
        style={{ fontFamily: "var(--font-heading)" }}
      >
        <s.Icon size={10} />
        {s.label}
        <ChevronDown size={10} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 bg-[#27272A] border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden">
          {STATUSES.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors hover:bg-white/5 ${opt.color} ${current === opt.value ? "bg-white/5" : ""}`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <opt.Icon size={12} />
              {opt.label}
              {current === opt.value && <CheckCircle2 size={10} className="ml-auto" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LeadRow({
  lead,
  entry,
  onUpdate,
}: {
  lead: Lead;
  entry: CRMEntry;
  onUpdate: (patch: Partial<CRMEntry>) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(entry.notes);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNotesChange = (v: string) => {
    setNotes(v);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => onUpdate({ notes: v }), 600);
  };

  const markContacted = () => {
    const now = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    onUpdate({ status: "contacted", lastContacted: now });
  };

  const hasWebsite = !!lead.website;
  const websiteDisplay = lead.website ? lead.website.replace(/^https?:\/\//, "").replace(/\/$/, "") : null;

  return (
    <>
      <tr
        className={`border-b border-white/5 transition-colors hover:bg-white/[0.02] cursor-pointer ${
          expanded ? "bg-white/[0.03]" : ""
        }`}
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="px-4 py-3">
          <div className="font-semibold text-white text-sm truncate max-w-[200px]" style={{ fontFamily: "var(--font-heading)" }}>
            {lead.name}
          </div>
          <div className="text-xs text-white/40 mt-0.5" style={{ fontFamily: "var(--font-heading)" }}>
            {lead.city || "—"}
          </div>
        </td>
        <td className="px-4 py-3 hidden sm:table-cell">
          <span
            className="inline-flex items-center gap-1.5 text-xs text-white/50"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Tag size={10} className="text-[#F97316]" />
            {lead.niche || "—"}
          </span>
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <span className="text-xs text-white/50" style={{ fontFamily: "var(--font-heading)" }}>
            {lead.county || "—"}
          </span>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          {hasWebsite ? (
            <span className="inline-flex items-center gap-1 text-xs text-green-400/80" style={{ fontFamily: "var(--font-heading)" }}>
              <Globe size={10} /> Yes
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-amber-400/80" style={{ fontFamily: "var(--font-heading)" }}>
              <Globe size={10} /> No site
            </span>
          )}
        </td>
        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
          <StatusPicker current={entry.status} onChange={(s) => onUpdate({ status: s })} />
        </td>
        <td className="px-4 py-3 hidden xl:table-cell">
          {entry.notes ? (
            <span className="text-xs text-white/30 italic truncate max-w-[140px] block" style={{ fontFamily: "var(--font-heading)" }}>
              {entry.notes.slice(0, 60)}{entry.notes.length > 60 ? "…" : ""}
            </span>
          ) : (
            <span className="text-xs text-white/20" style={{ fontFamily: "var(--font-heading)" }}>—</span>
          )}
        </td>
      </tr>

      {expanded && (
        <tr className="border-b border-white/5 bg-[#1C1C1F]">
          <td colSpan={6} className="px-4 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
              {/* Contact info */}
              <div className="flex flex-col gap-2 min-w-0">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                  Contact
                </p>
                {lead.phone && (
                  <a
                    href={`tel:${lead.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-[#F97316] transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <Phone size={13} /> {lead.phone}
                  </a>
                )}
                {lead.website && (
                  <a
                    href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-[#F97316] transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    <ExternalLink size={13} /> {websiteDisplay}
                  </a>
                )}
                {lead.address && (
                  <span className="inline-flex items-start gap-2 text-sm text-white/50" style={{ fontFamily: "var(--font-heading)" }}>
                    <MapPin size={13} className="mt-0.5 shrink-0" /> {lead.address}
                  </span>
                )}
                {entry.lastContacted && (
                  <span className="text-xs text-white/30 mt-1" style={{ fontFamily: "var(--font-heading)" }}>
                    Last contacted: {entry.lastContacted}
                  </span>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); markContacted(); }}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 hover:bg-[#F97316]/20 transition-colors self-start"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <CheckCircle2 size={12} /> Mark Contacted
                </button>
              </div>

              {/* Notes */}
              <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ fontFamily: "var(--font-heading)" }}>
                  <StickyNote size={11} /> Notes
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  rows={4}
                  placeholder="Add notes about this business…"
                  className="w-full bg-[#18181B] border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder-white/20 resize-none focus:outline-none focus:border-[#F97316]/50 transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                />
                <p className="text-xs text-white/20 mt-1" style={{ fontFamily: "var(--font-heading)" }}>
                  Auto-saved to your browser
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function CRMDashboard() {
  const router = useRouter();
  const { get, update, stats } = useCRMState();

  const [data, setData] = useState<LeadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [q, setQ] = useState("");
  const [county, setCounty] = useState("");
  const [niche, setNiche] = useState("");
  const [hasWebsite, setHasWebsite] = useState("");
  const [page, setPage] = useState(1);

  const limit = 50;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(q && { q }),
        ...(county && { county }),
        ...(niche && { niche }),
        ...(hasWebsite && { hasWebsite }),
      });
      const res = await fetch(`/api/crm/leads?${params}`);
      if (!res.ok) throw new Error("Failed to load");
      setData(await res.json());
    } catch {
      setError("Could not load leads. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [q, county, niche, hasWebsite, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [q, county, niche, hasWebsite]);

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  async function handleLogout() {
    await fetch("/api/crm/logout", { method: "POST" });
    router.push("/crm/login");
  }

  const trackedCount = stats.total;

  return (
    <div className="min-h-screen bg-[#18181B]" style={{ fontFamily: "var(--font-heading)" }}>
      {/* Header */}
      <header className="border-b border-white/10 bg-[#18181B] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-tight" style={{ color: "#FAFAF9" }}>
              Copper Bay<span style={{ color: "#F97316" }}>Tech</span>
            </span>
            <span className="text-xs text-white/20 hidden sm:inline">/ Lead CRM</span>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-[#27272A] rounded-xl border border-white/10 px-4 py-3 col-span-2 sm:col-span-1 lg:col-span-1">
            <p className="text-xs text-white/40 uppercase tracking-wider">Total Leads</p>
            <p className="text-2xl font-bold text-white mt-1">
              {data ? data.total.toLocaleString() : "—"}
            </p>
          </div>
          {STATUSES.map((s) => (
            <div key={s.value} className={`bg-[#27272A] rounded-xl border border-white/10 px-4 py-3`}>
              <p className={`text-xs uppercase tracking-wider ${s.color}`}>{s.label}</p>
              <p className={`text-xl font-bold mt-1 ${s.color}`}>
                {stats.byStatus[s.value] || 0}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#27272A] rounded-xl border border-white/10 px-4 py-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, city, niche…"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#18181B] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 transition-colors"
              />
              {q && (
                <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* County */}
            <div className="relative">
              <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="pl-8 pr-8 py-2.5 rounded-lg bg-[#18181B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#F97316]/50 transition-colors appearance-none min-w-[140px]"
              >
                <option value="">All Counties</option>
                {data?.counties.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Niche */}
            <div className="relative">
              <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="pl-8 pr-8 py-2.5 rounded-lg bg-[#18181B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#F97316]/50 transition-colors appearance-none min-w-[140px]"
              >
                <option value="">All Niches</option>
                {data?.niches.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Website filter */}
            <div className="relative">
              <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <select
                value={hasWebsite}
                onChange={(e) => setHasWebsite(e.target.value)}
                className="pl-8 pr-8 py-2.5 rounded-lg bg-[#18181B] border border-white/10 text-sm text-white focus:outline-none focus:border-[#F97316]/50 transition-colors appearance-none min-w-[140px]"
              >
                <option value="">Any Website</option>
                <option value="no">No Website (hot leads)</option>
                <option value="yes">Has Website</option>
              </select>
            </div>
          </div>

          {(q || county || niche || hasWebsite) && (
            <button
              onClick={() => { setQ(""); setCounty(""); setNiche(""); setHasWebsite(""); }}
              className="mt-3 text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
            >
              <X size={11} /> Clear all filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-[#27272A] rounded-xl border border-white/10 overflow-hidden">
          {/* Result count */}
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <p className="text-xs text-white/40">
              {loading ? "Loading…" : data ? (
                <>
                  <span className="text-white font-semibold">{data.total.toLocaleString()}</span> leads
                  {trackedCount > 0 && (
                    <span className="ml-3 text-white/30">· {trackedCount} tracked in CRM</span>
                  )}
                </>
              ) : null}
            </p>
            {data && (
              <p className="text-xs text-white/30">
                Page {page} of {totalPages}
              </p>
            )}
          </div>

          {error ? (
            <div className="text-center py-16 text-red-400 text-sm">{error}</div>
          ) : loading ? (
            <div className="text-center py-16">
              <div className="inline-flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-white/30">Loading leads…</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-white/30 uppercase tracking-wider">Business</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-white/30 uppercase tracking-wider hidden sm:table-cell">Niche</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-white/30 uppercase tracking-wider hidden md:table-cell">County</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-white/30 uppercase tracking-wider hidden lg:table-cell">Website</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-white/30 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-white/30 uppercase tracking-wider hidden xl:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.leads.map((lead) => (
                    <LeadRow
                      key={lead.id}
                      lead={lead}
                      entry={get(lead.id)}
                      onUpdate={(patch) => update(lead.id, patch)}
                    />
                  ))}
                  {data?.leads.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-sm text-white/30">
                        No leads match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {data && totalPages > 1 && (
            <div className="border-t border-white/5 px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={15} /> Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let p: number;
                  if (totalPages <= 7) {
                    p = i + 1;
                  } else if (page <= 4) {
                    p = i + 1;
                  } else if (page >= totalPages - 3) {
                    p = totalPages - 6 + i;
                  } else {
                    p = page - 3 + i;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                        p === page
                          ? "bg-[#F97316] text-white"
                          : "text-white/40 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-white/20 text-center mt-4">
          Lead data from Overture Maps (CC-BY 4.0) · Status & notes saved locally in your browser
        </p>
      </main>
    </div>
  );
}
