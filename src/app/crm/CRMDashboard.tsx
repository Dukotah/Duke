"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Phone, ChevronRight, Search, Filter, Tag, MapPin, Mail,
  Flame, Zap, ArrowUpDown, X, LayoutGrid,
  BookOpen, List, DollarSign,
  AlertCircle, Plus, CalendarClock, Sparkles, Globe, MessageSquareReply,
  Users, Sun, Moon, LogOut, CheckSquare, Square,
  Home, ClipboardList, Bookmark, Upload,
} from "lucide-react";
import dynamic from "next/dynamic";
import { CrmThemeProvider, useCrmTheme } from "./useCrmTheme";
import LeadPanel from "./components/LeadPanel";
import AddLeadModal from "./components/AddLeadModal";
import CallTimer from "./components/CallTimer";
import CommandPalette from "./components/CommandPalette";
import ShortcutsHelp from "./components/ShortcutsHelp";
import SmartLists, { type SmartListFilters } from "./components/SmartLists";
import ImportLeadsModal, { ExportButton, type ExportFilters } from "./components/ImportLeadsModal";
import { RecencyBadges, deriveTags, TAG_DEFS, type LeadAction, type TagKey } from "./components/RecencyBadges";
import { TagChip } from "./components/TagManager";

// Custom (user-defined) tag definitions + the lead→tagIds map, from /api/crm/tags.
interface CustomTag { id: string; userId: string; label: string; color: string; createdAt: string }

// ─── Broadcast Banner ─────────────────────────────────────────────────────────

interface BroadcastMsg {
  id: string; message: string; type: "info" | "success" | "urgent";
  createdAt: string; expiresAt: string; createdBy: string;
}

function BroadcastBanners() {
  const [broadcasts, setBroadcasts] = useState<BroadcastMsg[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/crm/admin/broadcast")
      .then((r) => r.json())
      .then((d) => setBroadcasts(d.broadcasts ?? []))
      .catch(() => {});
  }, []);

  const visible = broadcasts.filter((b) => !dismissed.has(b.id));
  if (visible.length === 0) return null;

  const styles = {
    info: { bar: "bg-blue-500/15 border-blue-500/30 text-blue-200", icon: "ℹ️" },
    success: { bar: "bg-green-500/15 border-green-500/30 text-green-200", icon: "✅" },
    urgent: { bar: "bg-red-500/15 border-red-500/30 text-red-200 animate-pulse", icon: "🚨" },
  };

  return (
    <div className="space-y-2 mb-4">
      {visible.map((b) => {
        const s = styles[b.type];
        return (
          <div key={b.id} className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${s.bar}`} style={H}>
            <span className="text-base shrink-0">{s.icon}</span>
            <p className="flex-1 text-sm font-medium">{b.message}</p>
            <button onClick={() => setDismissed((prev) => new Set([...prev, b.id]))} className="opacity-50 hover:opacity-100 transition-opacity shrink-0 mt-0.5">
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Leaderboard Peek ─────────────────────────────────────────────────────────

interface LeaderboardEntry {
  userId: string; name: string; rank: number;
  submissionsThisMonth: number; callsThisMonth: number; totalEarned: number;
}

function LeaderboardPeek({ userId }: { userId: string }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetch("/api/crm/admin/leaderboard")
      .then((r) => r.json())
      .then((d) => setEntries(d.leaderboard ?? []))
      .catch(() => {});
  }, []);

  if (entries.length === 0) return null;

  const myEntry = entries.find((e) => e.userId === userId);
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="crm-surface rounded-2xl p-4 mt-4" style={H}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🏆</span>
        <h3 className="text-sm font-bold text-[var(--crm-text)] tracking-tight">This Month&apos;s Rankings</h3>
        {myEntry && (
          <span className="ml-auto text-xs text-[var(--crm-accent-text)] font-semibold">
            You&apos;re #{myEntry.rank}
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        {entries.slice(0, 5).map((e) => (
          <div key={e.userId}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${e.userId === userId ? "bg-[var(--crm-accent-weak)] border border-[var(--crm-accent-border)]" : "bg-[var(--crm-surface-2)]"}`}>
            <span className="text-sm w-6 text-center">
              {e.rank <= 3 ? medals[e.rank - 1] : <span className="text-[var(--crm-text-3)] font-bold text-xs">#{e.rank}</span>}
            </span>
            <p className={`flex-1 text-sm font-semibold ${e.userId === userId ? "text-[var(--crm-accent-text)]" : "text-[var(--crm-text-2)]"}`}>{e.name}</p>
            <div className="flex items-center gap-3 text-xs text-[var(--crm-text-3)]">
              <span>{e.submissionsThisMonth} sub</span>
              <span>{e.callsThisMonth} calls</span>
            </div>
          </div>
        ))}
      </div>
      {myEntry && myEntry.rank > 5 && (
        <div className="mt-2 pt-2 border-t border-[var(--crm-border)] flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--crm-accent-weak)] border border-[var(--crm-accent-border)]">
          <span className="text-sm w-6 text-center text-[var(--crm-text-3)] font-bold text-xs">#{myEntry.rank}</span>
          <p className="flex-1 text-sm font-semibold text-[var(--crm-accent-text)]">{myEntry.name} (you)</p>
          <div className="flex items-center gap-3 text-xs text-[var(--crm-text-3)]">
            <span>{myEntry.submissionsThisMonth} sub</span>
            <span>{myEntry.callsThisMonth} calls</span>
          </div>
        </div>
      )}
    </div>
  );
}

const DemoQueue = dynamic(() => import("./components/DemoQueue"), { ssr: false });
const CallReminders = dynamic(() => import("./components/CallReminders"), { ssr: false });
const DealsBoard = dynamic(() => import("./components/DealsBoard"), { ssr: false });
const ScriptsGuide = dynamic(() => import("./components/ScriptsGuide"), { ssr: false });
const EarningsView = dynamic(() => import("./components/Earnings"), { ssr: false });
const BulkOutreach = dynamic(() => import("./components/BulkOutreach"), { ssr: false });
const EmailComposer = dynamic(() => import("./components/EmailComposer"), { ssr: false });
const RespondedQueue = dynamic(() => import("./components/RespondedQueue"), { ssr: false });
const BulkActionBar = dynamic(() => import("./components/BulkActionBar"), { ssr: false });
const TodayQueue = dynamic(() => import("./components/TodayQueue"), { ssr: false });
const TasksView = dynamic(() => import("./components/TasksView"), { ssr: false });
const NotificationsBell = dynamic(() => import("./components/NotificationsBell"), { ssr: false });
const PowerDialer = dynamic(() => import("./components/PowerDialer"), { ssr: false });

// ─── Types ────────────────────────────────────────────────────────────────────

interface Lead {
  id: string; name: string; contact_name: string; category: string; phone: string; email: string;
  email_owned: string; website: string; socials: string; best_contact: string;
  address: string; city: string; state: string; zip: string; county: string;
  tier: string; tier_reason: string; builder: string; industry_fit: string;
  outreach_score: number; pitch: string; alt_categories: string;
  // Enriched (optional) — rendered in the list; passed through to LeadPanel.
  email_status?: string; grade?: string; lead_score?: number;
  // Demo package (optional) — lets the inline email composer attach a built demo.
  previewUrl?: string | null; claimByDate?: string | null; demoCategory?: string | null; thumbnailUrl?: string | null;
  // Durable cross-rep action stamps (emailedAt/calledAt/lastOutcome/who…).
  actions?: LeadAction | null;
}

// Dot colour for enriched email deliverability status.
function deliverabilityDot(status?: string): string {
  switch ((status ?? "").toLowerCase()) {
    case "valid": return "bg-green-400";
    case "risky": return "bg-amber-400";
    case "invalid": return "bg-red-400";
    case "unknown": return "bg-zinc-500";
    default: return "bg-transparent";
  }
}

interface LeadState {
  status: "new" | "contacted" | "follow_up" | "not_interested" | "won";
  stage: string; notes: string; lastContacted?: string;
  submittedAt?: string; callCount?: number; lastOutcome?: string;
  followUpDate?: string;
}

interface Submission {
  id: string; leadId: string; leadName: string; status: "pending" | "accepted" | "rejected";
  commissionAmount?: number; commissionPaid?: boolean; submittedAt: string;
}

interface Territory {
  userId: string; counties: string[]; niches: string[]; updatedAt: string;
}

interface LeadsResponse {
  leads: Lead[]; total: number; page: number; limit: number;
  counties: string[]; niches: string[];
  tierCounts: { A: number; B: number; C: number };
  territory?: Territory | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

type View = "today" | "due" | "new" | "responded" | "tasks" | "all" | "pipeline" | "smartlists";

const LIMIT = 50;
const H = { fontFamily: "var(--font-heading)" };

// ─── Mini components ──────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "var(--crm-accent)" : score >= 60 ? "#FBBF24" : "#6B7280";
  return (
    <div className="flex items-center gap-2">
      <div className="w-12 h-1 rounded-full bg-[var(--crm-surface-3)] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color, ...H }}>{score}</span>
    </div>
  );
}

function StatusBadge({ stage, status }: { stage?: string; status: string }) {
  if (stage === "interested") return <span className="text-xs font-semibold text-[var(--crm-accent-text)] bg-[var(--crm-accent-weak)] border border-[var(--crm-accent-border)] px-2 py-0.5 rounded-full" style={H}>Interested</span>;
  if (stage === "submitted") return <span className="text-xs font-semibold text-amber-500 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full" style={H}>Submitted</span>;
  if (stage === "won" || status === "won") return <span className="text-xs font-semibold text-emerald-500 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full" style={H}>Won 🏆</span>;
  if (status === "not_interested") return <span className="text-xs font-semibold text-zinc-500 bg-zinc-500/10 border border-zinc-500/20 px-2 py-0.5 rounded-full" style={H}>Pass</span>;
  if (stage === "voicemail") return <span className="text-xs font-semibold text-blue-500 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded-full" style={H}>Voicemail</span>;
  if (stage === "called" || status === "contacted") return <span className="text-xs font-semibold text-zinc-400 bg-zinc-400/10 border border-zinc-400/20 px-2 py-0.5 rounded-full" style={H}>Called</span>;
  return <span className="text-xs font-semibold text-blue-500 bg-blue-400/5 border border-blue-400/10 px-2 py-0.5 rounded-full" style={H}>New</span>;
}

function Select({ value, onChange, children, icon: Icon }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="relative">
      {Icon && <Icon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--crm-text-3)] pointer-events-none" />}
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className={`${Icon ? "pl-8" : "pl-3"} pr-6 py-2 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors appearance-none`}
        style={H}>
        {children}
      </select>
    </div>
  );
}

// Icon button for the left nav rail footer (tools + account actions).
function RailButton({ icon: Icon, label, onClick }: {
  icon: React.ComponentType<{ size?: number; className?: string }>; label: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} title={label}
      className="flex flex-col items-center gap-1 rounded-xl py-2 text-[var(--crm-text-3)] hover:text-[var(--crm-text)] hover:bg-[var(--crm-surface-3)] transition-colors">
      <Icon size={18} />
      <span className="text-[9px] font-semibold tracking-tight leading-none">{label}</span>
    </button>
  );
}

// ─── All Leads table view ─────────────────────────────────────────────────────

function AllLeads({ states, onSelectLead, userName, selectedLeadId, initialFilters, onUpdateState, onPowerDial }: { states: Record<string, LeadState>; onSelectLead: (l: Lead) => void; userName: string; selectedLeadId?: string | null; initialFilters?: SmartListFilters | null; onUpdateState: (leadId: string, patch: Partial<LeadState>) => void; onPowerDial: (leads: Lead[]) => void }) {
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [showBulkOutreach, setShowBulkOutreach] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState(initialFilters?.q ?? "");
  const [county, setCounty] = useState(initialFilters?.county ?? "");
  const [niche, setNiche] = useState(initialFilters?.niche ?? "");
  const [tier, setTier] = useState(initialFilters?.tier ?? "");
  const [hasEmail, setHasEmail] = useState(initialFilters?.hasEmail ?? "");
  const [grade, setGrade] = useState(initialFilters?.grade ?? "");
  const [emailStatus, setEmailStatus] = useState(initialFilters?.emailStatus ?? "");
  const [sortBy, setSortBy] = useState(initialFilters?.sortBy ?? "outreach_score");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [allTerritories, setAllTerritories] = useState(false);
  // Keyboard nav: index of the focused row (J/K traversal). -1 = none.
  const [focusIdx, setFocusIdx] = useState(-1);
  // Action tag filter — client-side over the current page's leads (the durable
  // cross-rep stamps the leads API already attaches), composable with search +
  // server filters + the view-chips. null = no tag filter.
  const [tagFilter, setTagFilter] = useState<TagKey | null>(null);
  // Custom user-defined tags (from /api/crm/tags): defs + lead→tagIds map, plus
  // the active custom-tag filter (composable with everything else). null = off.
  const [customTags, setCustomTags] = useState<CustomTag[]>([]);
  const [leadTagMap, setLeadTagMap] = useState<Record<string, string[]>>({});
  const [customTagFilter, setCustomTagFilter] = useState<string | null>(null);
  // ─── Bulk multi-select ────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const todayISO = new Date().toISOString().slice(0, 10);

  // Load custom tag defs + the lead→tagIds map once for chips + the tag filter.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/crm/tags")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setCustomTags(d.tags ?? []);
        setLeadTagMap(d.leadTagMap ?? {});
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  const tagById = new Map(customTags.map((t) => [t.id, t]));

  const fetch_ = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const p = new URLSearchParams({ page: String(page), limit: String(LIMIT), sortBy,
        ...(q && { q }), ...(county && { county }), ...(niche && { niche }),
        ...(tier && { tier }), ...(hasEmail && { hasEmail }),
        ...(grade && { grade }), ...(emailStatus && { emailStatus }),
        ...(allTerritories && { allTerritories: "1" }) });
      const res = await fetch(`/api/crm/leads?${p}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch { setError("Could not load leads."); }
    finally { setLoading(false); }
  }, [q, county, niche, tier, hasEmail, grade, emailStatus, sortBy, page, allTerritories]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { fetch_(); }, [fetch_]);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: reset pagination when filters change
  useEffect(() => { setPage(1); }, [q, county, niche, tier, hasEmail, grade, emailStatus, sortBy, allTerritories]);
  const totalPages = data ? Math.ceil(data.total / LIMIT) : 0;
  const activeFilters = [q, county, niche, tier, hasEmail, grade, emailStatus].filter(Boolean).length;
  const territory = data?.territory;

  // Apply the action-tag filter client-side over the loaded page. Composable with
  // every server-side filter and the search above — those already shaped `data`.
  const visibleLeads = (data?.leads ?? []).filter((lead) => {
    if (customTagFilter && !(leadTagMap[lead.id] ?? []).includes(customTagFilter)) return false;
    if (!tagFilter) return true;
    const tags = deriveTags(lead.actions ?? null, states[lead.id] ?? null, todayISO, { previewUrl: lead.previewUrl });
    return tags.has(tagFilter);
  });

  // Derive leadMap from all loaded leads so BulkActionBar can resolve name+email
  // for cadence enrollment without an extra fetch. Accumulated across pages because
  // leads stay in memory once loaded.
  const leadMap = new Map<string, { id: string; name: string; email: string }>(
    (data?.leads ?? []).map((l) => [l.id, { id: l.id, name: l.name, email: l.email ?? "" }])
  );

  // ─── Bulk select helpers ──────────────────────────────────────────────────
  const allVisibleSelected = visibleLeads.length > 0 && visibleLeads.every((l) => selectedIds.has(l.id));
  const someVisibleSelected = visibleLeads.some((l) => selectedIds.has(l.id));

  function toggleSelectLead(e: React.MouseEvent | React.KeyboardEvent, leadId: string) {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(leadId)) next.delete(leadId);
      else next.add(leadId);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allVisibleSelected) {
      // Deselect all currently visible
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const l of visibleLeads) next.delete(l.id);
        return next;
      });
    } else {
      // Select all currently visible
      setSelectedIds((prev) => {
        const next = new Set(prev);
        for (const l of visibleLeads) next.add(l.id);
        return next;
      });
    }
  }

  // Apply a saved Smart List back into the individual filter setters.
  const handleApplySmartList = useCallback((filters: SmartListFilters) => {
    setQ(filters.q ?? "");
    setCounty(filters.county ?? "");
    setNiche(filters.niche ?? "");
    setTier(filters.tier ?? "");
    setHasEmail(filters.hasEmail ?? "");
    setGrade(filters.grade ?? "");
    setEmailStatus(filters.emailStatus ?? "");
    if (filters.sortBy !== undefined) setSortBy(filters.sortBy);
    setPage(1);
  }, []);

  // Filter object shared with SmartLists (save) and ExportButton (download).
  const currentFilters: SmartListFilters = {
    ...(q && { q }), ...(county && { county }), ...(niche && { niche }),
    ...(tier && { tier }), ...(hasEmail && { hasEmail }),
    ...(grade && { grade }), ...(emailStatus && { emailStatus }), sortBy,
  };
  const exportFilters: ExportFilters = {
    ...currentFilters,
    ...(allTerritories && { allTerritories: "1" }),
  };

  // ─── Keyboard navigation (J/K traverse, Enter open, X toggle select) ──────
  // Ignored while typing in an input/textarea/select or with modifier keys held.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el?.isContentEditable) return;
      const n = visibleLeads.length;
      if (n === 0) return;
      const k = e.key.toLowerCase();
      if (k === "j") {
        e.preventDefault();
        setFocusIdx((i) => Math.min(n - 1, i < 0 ? 0 : i + 1));
      } else if (k === "k") {
        e.preventDefault();
        setFocusIdx((i) => Math.max(0, i < 0 ? 0 : i - 1));
      } else if (e.key === "Enter") {
        if (focusIdx >= 0 && focusIdx < n) { e.preventDefault(); onSelectLead(visibleLeads[focusIdx]); }
      } else if (k === "x") {
        if (focusIdx >= 0 && focusIdx < n) {
          e.preventDefault();
          const id = visibleLeads[focusIdx].id;
          setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
          });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visibleLeads, focusIdx, onSelectLead]);

  // Keep the focused row in bounds when the list size changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clamp focus when list shrinks
    setFocusIdx((i) => (i >= visibleLeads.length ? visibleLeads.length - 1 : i));
  }, [visibleLeads.length]);

  return (
    <div className="space-y-3">
      {showBulkOutreach && <BulkOutreach repName={userName} onClose={() => setShowBulkOutreach(false)} />}
      {showImport && (
        <ImportLeadsModal
          onClose={() => setShowImport(false)}
          onImported={() => { fetch_(); }}
        />
      )}
      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--crm-text-3)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, city, niche…"
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)] focus:ring-2 focus:ring-[var(--crm-accent-weak)] transition-all"
            style={H} />
          {q && <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)]"><X size={13} /></button>}
        </div>
        <button onClick={() => setShowFilters((v) => !v)}
          className={`inline-flex items-center gap-1.5 px-3 rounded-xl text-sm border transition-all ${showFilters || activeFilters > 0 ? "bg-[var(--crm-accent-weak)] text-[var(--crm-accent-text)] border-[var(--crm-accent-border)]" : "bg-[var(--crm-surface)] text-[var(--crm-text-2)] border-[var(--crm-border)]"}`}
          style={H}>
          <Filter size={13} />
          {activeFilters > 0 && <span className="bg-[var(--crm-accent)] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{activeFilters}</span>}
        </button>
        <button onClick={() => onPowerDial(visibleLeads)} disabled={visibleLeads.length === 0}
          className="inline-flex items-center gap-1.5 px-3 rounded-xl text-sm font-bold border bg-[var(--crm-accent)] text-white border-[var(--crm-accent)] hover:brightness-110 transition-all disabled:opacity-40"
          title="Power Dialer — call through this filtered list" style={H}>
          <Zap size={13} />
          <span className="hidden sm:inline">Power Dialer</span>
        </button>
        <button onClick={() => setShowBulkOutreach(true)}
          className="inline-flex items-center gap-1.5 px-3 rounded-xl text-sm bg-[var(--crm-surface)] text-[var(--crm-text-2)] border border-[var(--crm-border)] hover:text-[var(--crm-text)] hover:border-[var(--crm-border-strong)] transition-all"
          title="Bulk Email" style={H}>
          <Mail size={13} />
          <span className="hidden sm:inline">Bulk Email</span>
        </button>
        <ExportButton filters={exportFilters} className="inline-flex items-center gap-1.5 px-3 rounded-xl text-sm bg-[var(--crm-surface)] text-[var(--crm-text-2)] border border-[var(--crm-border)] hover:text-[var(--crm-text)] hover:border-[var(--crm-border-strong)] transition-all h-auto" />
        <button onClick={() => setShowImport(true)}
          className="inline-flex items-center gap-1.5 px-3 rounded-xl text-sm bg-[var(--crm-surface)] text-[var(--crm-text-2)] border border-[var(--crm-border)] hover:text-[var(--crm-text)] hover:border-[var(--crm-border-strong)] transition-all"
          title="Import CSV" style={H}>
          <Upload size={13} />
          <span className="hidden sm:inline">Import CSV</span>
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 p-3 bg-[var(--crm-surface)] rounded-xl border border-[var(--crm-border)]">
          <Select value={county} onChange={setCounty} icon={MapPin}>
            <option value="">All Counties</option>
            {data?.counties.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select value={niche} onChange={setNiche} icon={Tag}>
            <option value="">All Niches</option>
            {data?.niches.map((n) => <option key={n} value={n}>{n.replace(/_/g, " ")}</option>)}
          </Select>
          <Select value={tier} onChange={setTier}>
            <option value="">All Tiers</option>
            <option value="A">🔥 No Website</option>
            <option value="B">⚡ DIY Site</option>
            <option value="C">Has Site</option>
          </Select>
          <Select value={hasEmail} onChange={setHasEmail} icon={Mail}>
            <option value="">Any Email</option>
            <option value="yes">Has email</option>
            <option value="no">No email</option>
          </Select>
          <Select value={grade} onChange={setGrade}>
            <option value="">All Grades</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
            <option value="D">Grade D</option>
          </Select>
          <Select value={emailStatus} onChange={setEmailStatus} icon={Mail}>
            <option value="">Any deliverability</option>
            <option value="deliverable">Deliverable</option>
            <option value="valid">Verified email</option>
            <option value="risky">Risky</option>
            <option value="invalid">Invalid</option>
          </Select>
          <Select value={sortBy} onChange={setSortBy} icon={ArrowUpDown}>
            <option value="outreach_score">Best score</option>
            <option value="name">Name A–Z</option>
            <option value="city">City A–Z</option>
          </Select>
          {activeFilters > 0 && (
            <button onClick={() => { setQ(""); setCounty(""); setNiche(""); setTier(""); setHasEmail(""); setGrade(""); setEmailStatus(""); }}
              className="inline-flex items-center gap-1 text-xs text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] px-2" style={H}>
              <X size={11} />Clear
            </button>
          )}
        </div>
      )}

      {/* Saved smart lists — save the current filter set, recall in one click */}
      <SmartLists currentFilters={currentFilters} onApply={handleApplySmartList} userName={userName} />

      {/* Quick pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => { setTier(tier === "A" ? "" : "A"); setPage(1); }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${tier === "A" ? "bg-orange-400/15 text-orange-400 border-orange-400/30" : "bg-[var(--crm-surface-3)] text-[var(--crm-text-3)] border-[var(--crm-border)]"}`}
          style={H}><Flame size={10} />No Website</button>
        <button onClick={() => { setHasEmail(hasEmail === "yes" ? "" : "yes"); setPage(1); }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${hasEmail === "yes" ? "bg-blue-400/15 text-blue-500 border-blue-400/30" : "bg-[var(--crm-surface-3)] text-[var(--crm-text-3)] border-[var(--crm-border)]"}`}
          style={H}><Mail size={10} />Has Email</button>
      </div>

      {/* Action tags — one click finds a group ("Emailed", "Follow-up due", …).
          Composable with the search/filters above and the view-chips. */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {TAG_DEFS.map((t) => {
          const active = tagFilter === t.key;
          return (
            <button key={t.key} onClick={() => setTagFilter(active ? null : t.key)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${active ? "bg-[var(--crm-accent-weak)] text-[var(--crm-accent-text)] border-[var(--crm-accent-border)]" : "bg-[var(--crm-surface-3)] text-[var(--crm-text-3)] border-[var(--crm-border)] hover:text-[var(--crm-text-2)] hover:border-[var(--crm-border-strong)]"}`}
              style={H}>
              <t.icon size={10} />{t.label}
            </button>
          );
        })}
        {tagFilter && (
          <button onClick={() => setTagFilter(null)}
            className="inline-flex items-center gap-1 text-[11px] text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] px-1.5" style={H}>
            <X size={10} />Clear tag
          </button>
        )}
      </div>

      {/* Custom user-defined tags — one click filters People to that tag.
          Composable with the action tags, search, and server filters. */}
      {customTags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {customTags.map((t) => {
            const active = customTagFilter === t.id;
            return (
              <button key={t.id} onClick={() => setCustomTagFilter(active ? null : t.id)}
                className={`rounded-full transition-all ${active ? "ring-2 ring-[var(--crm-accent-border)]" : "opacity-80 hover:opacity-100"}`}
                style={H} aria-pressed={active}>
                <TagChip tag={t} small />
              </button>
            );
          })}
          {customTagFilter && (
            <button onClick={() => setCustomTagFilter(null)}
              className="inline-flex items-center gap-1 text-[11px] text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] px-1.5" style={H}>
              <X size={10} />Clear tag
            </button>
          )}
        </div>
      )}

      {/* Territory badge + toggle */}
      {territory && (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 text-xs text-[var(--crm-text-2)] bg-[var(--crm-surface)] border border-[var(--crm-border)] px-3 py-1.5 rounded-full" style={H}>
            <MapPin size={10} className="text-[var(--crm-accent-text)]" />
            {territory.counties.length > 0 ? territory.counties.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(", ") : "All Areas"}
            {territory.niches.length > 0 && <span className="text-[var(--crm-text-3)]">· {territory.niches.join(", ")}</span>}
          </div>
          <button onClick={() => setAllTerritories((v) => !v)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${allTerritories ? "bg-[var(--crm-accent-weak)] text-[var(--crm-accent-text)] border-[var(--crm-accent-border)]" : "text-[var(--crm-text-3)] border-[var(--crm-border)] bg-[var(--crm-surface-3)] hover:border-[var(--crm-border-strong)]"}`}
            style={H}>
            {allTerritories ? "My Territory" : "Show all areas"}
          </button>
        </div>
      )}

      {/* Results count + select-all control */}
      {data && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-[var(--crm-text-3)]" style={H}>
            {tagFilter ? (
              <><span className="text-[var(--crm-text)] font-semibold">{visibleLeads.length.toLocaleString()}</span> tagged on this page · </>
            ) : (
              <><span className="text-[var(--crm-text)] font-semibold">{data.total.toLocaleString()}</span> leads · </>
            )}
            page {page} of {totalPages}
            · 🔥 {data.tierCounts.A.toLocaleString()} no-site
          </p>
          {/* Select-all (filtered page) toggle */}
          <button
            onClick={toggleSelectAll}
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
              allVisibleSelected
                ? "bg-[var(--crm-accent-weak)] text-[var(--crm-accent-text)] border-[var(--crm-accent-border)]"
                : someVisibleSelected
                ? "bg-[var(--crm-surface-3)] text-[var(--crm-text-2)] border-[var(--crm-border)]"
                : "bg-[var(--crm-surface-3)] text-[var(--crm-text-3)] border-[var(--crm-border)] hover:text-[var(--crm-text-2)]"
            }`}
            style={H}
          >
            {allVisibleSelected
              ? <><CheckSquare size={11} />Deselect page</>
              : <><Square size={11} />Select page ({visibleLeads.length})</>}
          </button>
        </div>
      )}

      {/* List */}
      {error ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 crm-surface rounded-2xl text-center">
          <AlertCircle size={22} className="text-red-400/80" />
          <p className="text-sm text-[var(--crm-text-2)]" style={H}>{error}</p>
          <button onClick={() => fetch_()} className="text-xs font-semibold text-[var(--crm-accent-text)] hover:opacity-80 transition-colors" style={H}>Try again</button>
        </div>
      ) : loading ? (
        <div className="space-y-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5 crm-surface rounded-2xl animate-pulse">
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-2/5 rounded-full bg-[var(--crm-surface-3)]" />
                <div className="h-2.5 w-3/5 rounded-full bg-[var(--crm-surface-3)]" />
                <div className="h-1.5 w-16 rounded-full bg-[var(--crm-surface-3)]" />
              </div>
              <div className="h-3.5 w-3.5 rounded-full bg-[var(--crm-surface-3)]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1.5">
          {visibleLeads.map((lead, idx) => {
            const state = states[lead.id];
            const isChecked = selectedIds.has(lead.id);
            const isFocused = focusIdx === idx;
            return (
              <div key={lead.id}
                onClick={() => { setFocusIdx(idx); onSelectLead(lead); }} role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelectLead(lead); } }}
                className={`crm-surface crm-surface-hover flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer active:scale-[0.99] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent-border)] ${isChecked ? "ring-2 ring-[var(--crm-accent-border)] bg-[var(--crm-accent-weak)]" : selectedLeadId === lead.id ? "ring-2 ring-[var(--crm-accent-border)] bg-[var(--crm-accent-weak)]" : isFocused ? "ring-2 ring-[var(--crm-accent-border)]/60" : ""}`}>
                {/* Per-row checkbox — click/key without opening the lead panel */}
                <button
                  onClick={(e) => toggleSelectLead(e, lead.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleSelectLead(e, lead.id); } }}
                  aria-label={isChecked ? `Deselect ${lead.name}` : `Select ${lead.name}`}
                  className={`shrink-0 rounded-md p-0.5 transition-colors ${isChecked ? "text-[var(--crm-accent-text)]" : "text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)]"}`}
                >
                  {isChecked ? <CheckSquare size={15} /> : <Square size={15} />}
                </button>
                {lead.thumbnailUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={lead.thumbnailUrl} alt="" loading="lazy"
                    className="hidden sm:block w-16 h-9 rounded-md object-cover border border-[var(--crm-border)] shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-[var(--crm-text)] truncate group-hover:text-[var(--crm-accent-text)] transition-colors" style={H}>{lead.name}</p>
                    {lead.tier === "A" && <Flame size={11} className="text-orange-400 shrink-0" />}
                    {lead.tier === "B" && <Zap size={11} className="text-yellow-400 shrink-0" />}
                    {lead.grade && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${
                        lead.grade === "A" ? "text-orange-400 bg-orange-400/10 border-orange-400/20" :
                        lead.grade === "B" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
                        "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"
                      }`} style={H}>{lead.grade}</span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--crm-text-3)] mt-0.5 capitalize" style={H}>{lead.city} · {lead.category.replace(/_/g, " ")}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <ScoreBar score={lead.outreach_score} />
                    {state && <StatusBadge stage={state.stage} status={state.status} />}
                  </div>
                  {/* Durable cross-rep recency badges — what's been done, by whom. */}
                  <RecencyBadges actions={lead.actions} state={state} today={todayISO} previewUrl={lead.previewUrl} className="mt-2" />
                  {/* Custom user-defined tag chips */}
                  {(leadTagMap[lead.id] ?? []).length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      {(leadTagMap[lead.id] ?? []).map((tagId) => {
                        const t = tagById.get(tagId);
                        return t ? <TagChip key={tagId} tag={t} small /> : null;
                      })}
                    </div>
                  )}
                  {/* Inline-editable stage / tier / follow-up — edit without opening the panel.
                      stopPropagation so changing a cell doesn't open the lead. */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={state?.stage ?? "to_call"}
                      onChange={(e) => onUpdateState(lead.id, { stage: e.target.value })}
                      aria-label={`Stage for ${lead.name}`}
                      className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-[var(--crm-surface-3)] border border-[var(--crm-border)] text-[var(--crm-text-2)] focus:outline-none focus:border-[var(--crm-accent-border)] appearance-none cursor-pointer"
                      style={H}
                    >
                      <option value="to_call">To call</option>
                      <option value="called">Called</option>
                      <option value="voicemail">Voicemail</option>
                      <option value="call_back">Call back</option>
                      <option value="contacted">Contacted</option>
                      <option value="interested">Interested</option>
                      <option value="submitted">Submitted</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                    <select
                      value={state?.status ?? "new"}
                      onChange={(e) => onUpdateState(lead.id, { status: e.target.value as LeadState["status"] })}
                      aria-label={`Status for ${lead.name}`}
                      className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-[var(--crm-surface-3)] border border-[var(--crm-border)] text-[var(--crm-text-2)] focus:outline-none focus:border-[var(--crm-accent-border)] appearance-none cursor-pointer"
                      style={H}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="follow_up">Follow up</option>
                      <option value="not_interested">Not interested</option>
                      <option value="won">Won</option>
                    </select>
                    <input
                      type="date"
                      value={state?.followUpDate ?? ""}
                      onChange={(e) => onUpdateState(lead.id, { followUpDate: e.target.value })}
                      aria-label={`Follow-up date for ${lead.name}`}
                      className="text-[11px] font-semibold px-2 py-1 rounded-lg bg-[var(--crm-surface-3)] border border-[var(--crm-border)] text-[var(--crm-text-2)] focus:outline-none focus:border-[var(--crm-accent-border)] cursor-pointer"
                      style={H}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {lead.phone && <span className="text-xs text-[var(--crm-text-3)] hidden sm:flex items-center gap-1 tabular-nums" style={H}><Phone size={9} />{lead.phone}</span>}
                  {lead.email && (
                    <span className="text-xs text-[var(--crm-text-3)] hidden sm:flex items-center gap-1.5" style={H}>
                      {lead.email_status && <span className={`w-1.5 h-1.5 rounded-full ${deliverabilityDot(lead.email_status)}`} title={`Email: ${lead.email_status}`} />}
                      <Mail size={9} />email
                    </span>
                  )}
                  {lead.website && (
                    <a
                      href={/^https?:\/\//i.test(lead.website) ? lead.website : `https://${lead.website}`}
                      target="_blank" rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title={`Existing site (source): ${lead.website}`}
                      className="text-xs text-[var(--crm-text-3)] hidden sm:flex items-center gap-1 hover:text-[var(--crm-accent-text)] transition-colors"
                      style={H}
                    >
                      <Globe size={9} />current site
                    </a>
                  )}
                  <ChevronRight size={15} className="text-[var(--crm-text-3)] group-hover:text-[var(--crm-accent-text)] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
          {/* Floating bulk action bar — appears when any leads are selected */}
          {selectedIds.size > 0 && (
            <BulkActionBar
              selectedIds={selectedIds}
              leadMap={leadMap}
              onClear={() => setSelectedIds(new Set())}
              onDone={() => { setSelectedIds(new Set()); fetch_(); }}
            />
          )}
          {visibleLeads.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-14 crm-surface rounded-2xl text-center px-6">
              <Search size={22} className="text-[var(--crm-text-3)]" />
              <p className="text-sm font-semibold text-[var(--crm-text-2)]" style={H}>No leads match your filters</p>
              <p className="text-xs text-[var(--crm-text-3)]" style={H}>
                {tagFilter ? "No leads on this page carry that tag — try another tag or clear it." : "Try clearing a filter or widening your territory."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {data && totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
            className="text-sm font-medium text-[var(--crm-text-2)] hover:text-[var(--crm-text)] disabled:opacity-20 disabled:hover:text-[var(--crm-text-2)] transition-colors px-3.5 py-2 rounded-xl border border-[var(--crm-border)] hover:border-[var(--crm-border-strong)] hover:bg-[var(--crm-surface-3)]"
            style={H}>← Prev</button>
          <span className="text-xs font-medium text-[var(--crm-text-3)] tabular-nums" style={H}>{page} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            className="text-sm font-medium text-[var(--crm-text-2)] hover:text-[var(--crm-text)] disabled:opacity-20 disabled:hover:text-[var(--crm-text-2)] transition-colors px-3.5 py-2 rounded-xl border border-[var(--crm-border)] hover:border-[var(--crm-border-strong)] hover:bg-[var(--crm-surface-3)]"
            style={H}>Next →</button>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard shell ──────────────────────────────────────────────────────────

export default function CRMDashboard(props: { userId: string; userName: string; role: "admin" | "rep" }) {
  return (
    <CrmThemeProvider>
      <CRMWorkspace {...props} />
    </CrmThemeProvider>
  );
}

function CRMWorkspace({ userId, userName, role }: { userId: string; userName: string; role: "admin" | "rep" }) {
  const router = useRouter();
  const { theme, toggle: toggleTheme } = useCrmTheme();
  const [view, setView] = useState<View>("today");
  const [showPalette, setShowPalette] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  // Power Dialer — full-screen call-session overlay. The queue is the caller's
  // current filtered list (passed from the launching view); null = closed.
  const [dialerQueue, setDialerQueue] = useState<Lead[] | null>(null);
  // Filters pushed from the Smart Lists rail into the All-leads view on mount.
  const [pendingFilters, setPendingFilters] = useState<SmartListFilters | null>(null);
  const [allLeadsKey, setAllLeadsKey] = useState(0);
  const [showScripts, setShowScripts] = useState(false);
  const [showEarnings, setShowEarnings] = useState(false);
  const [loggedToday, setLoggedToday] = useState<number | null>(null);
  const [states, setStates] = useState<Record<string, LeadState>>({});
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [statesLoaded, setStatesLoaded] = useState(false);
  const [showAddLead, setShowAddLead] = useState(false);
  const [queueRefreshKey, setQueueRefreshKey] = useState(0);
  const [respondedCount, setRespondedCount] = useState(0);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [emailLead, setEmailLead] = useState<Lead | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  // Desktop = dock the lead detail beside the list (cockpit). Mobile keeps the
  // slide-over overlay. Default false so SSR/first paint matches the mobile path.
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // ⌘K / Ctrl+K opens the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setShowPalette((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // "?" opens the keyboard shortcuts help overlay (only when not typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el?.isContentEditable) return;
      if (e.key === "?") {
        e.preventDefault();
        setShowShortcuts((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Open a lead by id from the palette: try the loaded set, else fetch it.
  const selectLeadById = useCallback(async (leadId: string) => {
    const found = allLeads.find((l) => l.id === leadId);
    if (found) { setSelectedLead(found); return; }
    try {
      const res = await fetch(`/api/crm/leads?limit=1&q=${encodeURIComponent(leadId)}`);
      const d = await res.json();
      const hit = (d.leads as Lead[] | undefined)?.find((l) => l.id === leadId) ?? d.leads?.[0];
      if (hit) setSelectedLead(hit);
    } catch { /* palette already closed; non-fatal */ }
  }, [allLeads]);

  // Load all state + submissions once
  useEffect(() => {
    fetch("/api/crm/state").then((r) => r.json()).then((d) => { setStates(d); setStatesLoaded(true); }).catch((e) => {
      console.error("CRM: failed to load lead states", e);
      setStatesLoaded(true);
      setLoadError("Couldn't load your lead queue — check your connection and refresh.");
    });
    fetch("/api/crm/submit").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setSubmissions(d); }).catch((e) => console.error("CRM: failed to load submissions", e));
    // Read-only: today's logged calls for the stats strip (Today N/50).
    fetch("/api/crm/goals").then((r) => r.json()).then((d) => {
      if (typeof d?.dailyStats?.callsLogged === "number") setLoggedToday(d.dailyStats.callsLogged);
    }).catch((e) => console.error("CRM: failed to load goals", e));
    // Count of leads who replied — drives the "Responded" chip badge.
    fetch("/api/crm/responded").then((r) => r.json()).then((d) => {
      if (Array.isArray(d?.responded)) setRespondedCount(d.responded.length);
    }).catch((e) => console.error("CRM: failed to load responded count", e));
  }, []);

  // Load leads for pipeline (needs all touched leads)
  useEffect(() => {
    if (!statesLoaded) return;
    const ids = Object.keys(states);
    if (ids.length === 0) return;
    // Fetch a broad set for pipeline
    fetch("/api/crm/leads?limit=100&sortBy=outreach_score").then((r) => r.json()).then((d) => {
      if (d.leads) setAllLeads(d.leads);
    }).catch((e) => console.error("CRM: failed to load pipeline leads", e));
  }, [statesLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateState = useCallback(async (leadId: string, patch: Partial<LeadState>) => {
    setStates((prev) => {
      const cur = prev[leadId] ?? { status: "new", stage: "to_call", notes: "" };
      return { ...prev, [leadId]: { ...cur, ...patch } };
    });
    await fetch("/api/crm/state", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, ...patch }),
    });
  }, []);

  const refreshSubs = useCallback(() => {
    fetch("/api/crm/submit").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setSubmissions(d); }).catch((e) => console.error("CRM: failed to refresh submissions", e));
  }, []);

  // Email sent from a queue card. The outreach API already logs the email and
  // schedules a follow-up server-side; mirror that in local state (mirrors
  // LeadPanel.handleEmailSent) so the queue updates without a refetch.
  const handleQueueEmailSent = useCallback(() => {
    if (!emailLead) return;
    const leadId = emailLead.id;
    const nowDisplay = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const fu = new Date(); fu.setDate(fu.getDate() + 3);
    const fuISO = fu.toISOString().slice(0, 10);
    const cur = states[leadId];
    const terminal = cur?.status === "won" || cur?.status === "not_interested";
    updateState(leadId, terminal
      ? { lastContacted: nowDisplay }
      : { status: "contacted", lastContacted: nowDisplay, followUpDate: fuISO });
  }, [emailLead, states, updateState]);

  const handleCallOutcome = useCallback(async (outcome: string, explicitLeadId?: string) => {
    // CallTimer passes only the outcome (uses activeLead); PowerDialer passes an
    // explicit leadId per queued lead. Resolve whichever was given.
    const leadId = explicitLeadId ?? activeLead?.id;
    if (!leadId) return;
    if (!explicitLeadId) setActiveLead(null);
    const outcomeToStage: Record<string, string> = {
      no_answer: "called",
      voicemail: "voicemail",
      call_back: "call_back",
      interested: "interested",
    };
    // Map the outcome to a status the same way LeadPanel.logOutcome does, so a
    // PowerDialer "not_interested" / "call_back" doesn't get flattened to
    // "contacted" (which would leave dead leads in the active queue).
    const status: LeadState["status"] =
      outcome === "not_interested"
        ? "not_interested"
        : outcome === "interested" || outcome === "call_back"
          ? "follow_up"
          : "contacted";
    const patch: Partial<LeadState> = {
      stage: outcomeToStage[outcome] ?? "called",
      status,
      lastOutcome: outcome,
      lastContacted: new Date().toISOString(),
    };
    // Compute the new call count from the current snapshot ONCE so the optimistic
    // update and the persisted value agree. Reading states[leadId] inside the
    // fetch body would send a stale (closed-over) count on rapid back-to-back
    // calls from the PowerDialer.
    const newCount = (states[leadId]?.callCount ?? 0) + 1;
    setStates((prev) => {
      const cur = prev[leadId] ?? { status: "new", stage: "to_call", notes: "" };
      return { ...prev, [leadId]: { ...cur, ...patch, callCount: newCount } };
    });
    await fetch("/api/crm/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, ...patch, callCount: newCount }),
    });
    // Mirror the durable, cross-rep action stamp (mirrors LeadPanel.logOutcome
    // and CallReminders.logDisposition). /api/crm/state is PER-USER only, so
    // without this the CallTimer dialer — the primary call path — never stamps
    // the global lead_actions hash and other reps see no Called/Voicemail mark.
    try {
      await fetch("/api/crm/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, type: "call", outcome }),
      });
    } catch { /* state already persisted above; stamp is additive */ }
  }, [activeLead, states]);

  async function handleLogout() {
    await fetch("/api/crm/logout", { method: "POST" });
    router.push("/crm/login");
  }

  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const earnedTotal = submissions.filter((s) => s.status === "accepted").reduce((sum, s) => sum + (s.commissionAmount ?? 0), 0);
  const interestedCount = Object.values(states).filter((s) => s.stage === "interested").length;
  // Due follow-ups — mirrors the /api/crm/reminders filter so the tab badge
  // matches the Follow-ups view without an extra fetch.
  const todayISO = new Date().toISOString().slice(0, 10);
  const dueCount = Object.values(states).filter(
    (s) => s.followUpDate && !["lost", "won", "submitted"].includes(s.stage) && s.followUpDate <= todayISO
  ).length;

  // Left nav-rail sections. Each drives the center list in place (no navigation),
  // FUB-style: a persistent rail rather than top chips.
  const navItems: { key: View; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badge: number | null }[] = [
    { key: "today", label: "Today", icon: Home, badge: null },
    { key: "due", label: "Follow-ups", icon: CalendarClock, badge: dueCount || null },
    { key: "new", label: "Demos", icon: Sparkles, badge: null },
    { key: "responded", label: "Replies", icon: MessageSquareReply, badge: respondedCount || null },
    { key: "tasks", label: "Tasks", icon: ClipboardList, badge: null },
    { key: "all", label: "People", icon: Users, badge: null },
    { key: "pipeline", label: "Pipeline", icon: LayoutGrid, badge: interestedCount || null },
    { key: "smartlists", label: "Lists", icon: Bookmark, badge: null },
  ];
  const sectionTitle: Record<View, string> = {
    today: "Today", due: "Follow-ups due", new: "Demos & new leads", responded: "Replies",
    tasks: "Tasks", all: "All people", pipeline: "Pipeline", smartlists: "Saved Lists",
  };

  return (
    <div data-crm-theme={theme} className="contents">
      {activeLead && (
        <CallTimer
          lead={activeLead}
          onOutcome={handleCallOutcome}
          onDismiss={() => setActiveLead(null)}
        />
      )}
      {showAddLead && (
        <AddLeadModal
          onClose={() => setShowAddLead(false)}
          onAdded={() => { setQueueRefreshKey((k) => k + 1); setShowAddLead(false); }}
        />
      )}
      <CommandPalette
        open={showPalette}
        onClose={() => setShowPalette(false)}
        onGoTo={(v) => setView(v)}
        onAddLead={() => setShowAddLead(true)}
        onToggleTheme={toggleTheme}
        onSelectLead={(r) => selectLeadById(r.id)}
      />
      <ShortcutsHelp open={showShortcuts} onClose={() => setShowShortcuts(false)} />
      {dialerQueue && (
        <PowerDialer
          leads={dialerQueue}
          states={states}
          onLogOutcome={(leadId, outcome) => handleCallOutcome(outcome, leadId)}
          onClose={() => setDialerQueue(null)}
        />
      )}
      {/* Mobile: lead detail as a right slide-over overlay. On desktop it docks
          inline beside the list (rendered in the main row below). */}
      {selectedLead && !isDesktop && (
        <LeadPanel lead={selectedLead}
          state={states[selectedLead.id] ?? { status: "new", stage: "to_call", notes: "" }}
          submission={submissions.find((s) => s.leadId === selectedLead.id)}
          repName={userName}
          onClose={() => setSelectedLead(null)}
          onUpdate={(patch) => updateState(selectedLead.id, patch)}
          onSubmitted={refreshSubs} />
      )}
      {emailLead && emailLead.email && (
        <EmailComposer
          lead={{
            id: emailLead.id,
            name: emailLead.name,
            contactName: emailLead.contact_name,
            email: emailLead.email,
            city: emailLead.city,
            previewUrl: emailLead.previewUrl ?? undefined,
            claimByDate: emailLead.claimByDate ?? undefined,
            demoCategory: emailLead.demoCategory ?? undefined,
            emailStatus: emailLead.email_status,
          }}
          repName={userName}
          onClose={() => setEmailLead(null)}
          onSent={handleQueueEmailSent}
        />
      )}

      {/* Scripts reference — right slide-over */}
      {showScripts && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowScripts(false)} />
          <div className="relative w-full sm:w-[560px] lg:w-[640px] bg-[var(--crm-surface-2)] border-l border-[var(--crm-border)] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 h-15 py-3 border-b border-[var(--crm-border)] shrink-0">
              <span className="text-sm font-bold text-[var(--crm-text)] tracking-tight flex items-center gap-2" style={H}><BookOpen size={15} className="text-[var(--crm-accent-text)]" />Scripts &amp; Guide</span>
              <button onClick={() => setShowScripts(false)} className="text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] transition-colors"><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <ScriptsGuide />
            </div>
          </div>
        </div>
      )}

      {/* Earnings breakdown — right slide-over */}
      {showEarnings && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowEarnings(false)} />
          <div className="relative w-full sm:w-[560px] lg:w-[640px] bg-[var(--crm-surface-2)] border-l border-[var(--crm-border)] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 h-15 py-3 border-b border-[var(--crm-border)] shrink-0">
              <span className="text-sm font-bold text-[var(--crm-text)] tracking-tight flex items-center gap-2" style={H}>💰 Earnings</span>
              <button onClick={() => setShowEarnings(false)} className="text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] transition-colors"><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <EarningsView states={states} repName={userName} />
              <LeaderboardPeek userId={userId} />
            </div>
          </div>
        </div>
      )}

      <div className="h-[100dvh] overflow-hidden crm-backdrop flex text-[var(--crm-text)]" style={H}>

        {/* ── Left nav rail (tablet+) — the persistent FUB-style navigation ── */}
        <nav className="hidden sm:flex flex-col items-center w-[68px] shrink-0 crm-panel border-r border-[var(--crm-border)] py-3" aria-label="CRM sections">
          <div className="w-9 h-9 rounded-xl bg-[var(--crm-accent)] flex items-center justify-center text-white font-bold text-[13px] shrink-0" title="Copper Bay Tech — Sales" style={H}>CB</div>
          <div className="mt-4 flex flex-col gap-1 w-full px-2">
            {navItems.map((item) => {
              const active = view === item.key;
              return (
                <button key={item.key} onClick={() => setView(item.key)} title={item.label}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex flex-col items-center gap-1 rounded-xl py-2 transition-colors ${active ? "bg-[var(--crm-accent-weak)] text-[var(--crm-accent-text)]" : "text-[var(--crm-text-3)] hover:text-[var(--crm-text)] hover:bg-[var(--crm-surface-3)]"}`}>
                  {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-[var(--crm-accent)]" />}
                  <item.icon size={19} />
                  <span className="text-[9px] font-semibold tracking-tight leading-none">{item.label}</span>
                  {item.badge ? (
                    <span className="absolute top-1 right-1.5 bg-[var(--crm-accent)] text-white text-[9px] font-bold rounded-full min-w-[15px] h-[15px] px-1 flex items-center justify-center">{item.badge}</span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* Rail footer — tools + theme + account */}
          <div className="mt-auto flex flex-col gap-1 w-full px-2">
            {role === "admin" && (
              <RailButton icon={LayoutGrid} label="Reports" onClick={() => router.push("/crm/admin")} />
            )}
            <RailButton icon={DollarSign} label="Earnings" onClick={() => setShowEarnings(true)} />
            <RailButton icon={BookOpen} label="Scripts" onClick={() => setShowScripts(true)} />
            <RailButton icon={theme === "dark" ? Sun : Moon} label={theme === "dark" ? "Light" : "Dark"} onClick={toggleTheme} />
            <RailButton icon={LogOut} label="Sign out" onClick={handleLogout} />
            <div className="mx-auto mt-1 w-8 h-8 rounded-full bg-[var(--crm-accent-weak)] ring-1 ring-[var(--crm-accent-border)] flex items-center justify-center text-xs font-bold text-[var(--crm-accent-text)]" title={userName} style={H}>
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </nav>

        {/* ── Main column ──────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">

          {loadError && (
            <div role="alert" className="flex items-center justify-between gap-3 px-4 py-2.5 bg-red-500/15 border-b border-red-500/30 text-red-200 text-sm">
              <span>{loadError}</span>
              <button onClick={() => setLoadError(null)} className="shrink-0 text-red-200/70 hover:text-red-100 text-xs font-semibold uppercase tracking-wide">Dismiss</button>
            </div>
          )}

          {/* Slim section header */}
          <header className="crm-chrome border-b border-[var(--crm-border)] shrink-0 h-14 flex items-center gap-3 px-4 z-20">
            <h1 className="text-[15px] font-bold text-[var(--crm-text)] tracking-tight truncate" style={H}>{sectionTitle[view]}</h1>
            <div className="ml-auto flex items-center gap-2">
              <NotificationsBell onSelectLead={(leadId) => selectLeadById(leadId)} />
              <button onClick={() => setShowPalette(true)} title="Search & commands (⌘K)"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--crm-text-2)] bg-[var(--crm-surface-3)] border border-[var(--crm-border)] px-2.5 py-1.5 rounded-full hover:text-[var(--crm-text)] transition-colors" style={H}>
                <Search size={12} /><span className="hidden lg:inline">Search</span>
                <span className="text-[var(--crm-text-3)] text-[10px]">⌘K</span>
              </button>
              <span className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-[var(--crm-text-2)] bg-[var(--crm-surface-3)] border border-[var(--crm-border)] px-2.5 py-1.5 rounded-full" style={H}>
                <span className="text-[var(--crm-text-3)]">Today</span>
                <span className="text-[var(--crm-text)] tabular-nums">{loggedToday ?? "—"}<span className="text-[var(--crm-text-3)]">/50</span></span>
              </span>
              <button onClick={() => setShowEarnings(true)}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-green-500 dark:text-green-300 bg-green-400/10 border border-green-400/25 px-2.5 py-1.5 rounded-full hover:bg-green-400/15 transition-colors"
                style={H} title="View earnings breakdown">
                <DollarSign size={12} />{earnedTotal.toLocaleString()}
                {pendingCount > 0 && <span className="text-[var(--crm-text-3)] font-medium hidden lg:inline">· {pendingCount} pending</span>}
              </button>
              <button onClick={() => setShowAddLead(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[var(--crm-accent)] px-3 py-1.5 rounded-full hover:brightness-110 transition-all active:scale-95"
                style={H}>
                <Plus size={14} /><span className="hidden sm:inline">Add lead</span>
              </button>
            </div>
          </header>

          {/* Main row — list + docked detail */}
          <div className="flex-1 flex min-h-0">
            <div key={view} className="crm-rise flex-1 min-w-0 px-4 pt-5 pb-24 sm:pb-6 overflow-y-auto">
              <BroadcastBanners />
              {view === "today" && (
              <TodayQueue
                onSelectLead={(leadId, leadName) => {
                  const found = allLeads.find((l) => l.id === leadId);
                  if (found) { setSelectedLead(found); return; }
                  setSelectedLead({ id: leadId, name: leadName } as Lead);
                }}
              />
            )}
              {view === "due" && (
              <CallReminders
                states={states}
                allLeads={allLeads}
                onSelectLead={(l) => setSelectedLead(l as Lead)}
                onUpdateState={updateState}
              />
            )}
            {view === "new" && (
              <DemoQueue
                key={queueRefreshKey}
                states={states}
                onSelectLead={(l) => setSelectedLead(l as unknown as Lead)}
              />
            )}
            {view === "responded" && (
              <RespondedQueue
                states={states}
                onSelectLead={(l) => setSelectedLead(l as unknown as Lead)}
              />
            )}
            {view === "tasks" && (
              <TasksView onSelectLead={(leadId) => selectLeadById(leadId)} />
            )}
            {view === "all" && (
              <AllLeads key={allLeadsKey} states={states} onSelectLead={setSelectedLead} userName={userName} selectedLeadId={selectedLead?.id} initialFilters={pendingFilters} onUpdateState={updateState} onPowerDial={(leads) => setDialerQueue(leads)} />
            )}
            {view === "pipeline" && (
              <DealsBoard leads={allLeads} states={states} submissions={submissions} onSelectLead={(l) => setSelectedLead(l as Lead)} onStageChange={(leadId, stage) => updateState(leadId, { stage })} />
            )}
            {view === "smartlists" && (
              <SmartLists
                railMode
                currentFilters={{}}
                userName={userName}
                onApply={(f) => { setPendingFilters(f); setAllLeadsKey((k) => k + 1); setView("all"); }}
              />
            )}
          </div>

            {/* Docked lead detail (desktop cockpit). Always rendered on desktop so the
                two-pane frame is fixed; shows the empty state until a lead is picked. */}
            {isDesktop && (
              <aside className="hidden lg:flex w-[480px] xl:w-[560px] 2xl:w-[640px] shrink-0 flex-col border-l border-[var(--crm-border)] crm-panel overflow-hidden pb-4">
                {selectedLead ? (
                  <LeadPanel inline lead={selectedLead}
                    state={states[selectedLead.id] ?? { status: "new", stage: "to_call", notes: "" }}
                    submission={submissions.find((s) => s.leadId === selectedLead.id)}
                    repName={userName}
                    onClose={() => setSelectedLead(null)}
                    onUpdate={(patch) => updateState(selectedLead.id, patch)}
                    onSubmitted={refreshSubs} />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--crm-surface-3)] border border-[var(--crm-border)] flex items-center justify-center">
                      <List size={24} className="text-[var(--crm-text-3)]" />
                    </div>
                    <p className="text-sm font-bold text-[var(--crm-text-2)]" style={H}>Select a lead to start</p>
                    <p className="text-xs text-[var(--crm-text-3)] max-w-[16rem] leading-relaxed" style={H}>Pick a lead from the list and their full workspace — email, call, outcomes and notes — opens here.</p>
                  </div>
                )}
              </aside>
            )}
          </div>

          {/* ── Mobile bottom nav (phones) — mirrors the desktop rail ────────── */}
          <nav className="sm:hidden shrink-0 crm-chrome border-t border-[var(--crm-border)] flex items-center justify-around px-1 py-1.5" aria-label="CRM sections">
            {navItems.map((item) => {
              const active = view === item.key;
              return (
                <button key={item.key} onClick={() => setView(item.key)} aria-current={active ? "page" : undefined}
                  className={`relative flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${active ? "text-[var(--crm-accent-text)]" : "text-[var(--crm-text-3)]"}`}>
                  <item.icon size={18} />
                  <span className="text-[9px] font-semibold leading-none">{item.label}</span>
                  {item.badge ? (
                    <span className="absolute top-0 right-1 bg-[var(--crm-accent)] text-white text-[8px] font-bold rounded-full min-w-[13px] h-[13px] px-0.5 flex items-center justify-center">{item.badge}</span>
                  ) : null}
                </button>
              );
            })}
            <button onClick={toggleTheme} aria-label="Toggle theme"
              className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[var(--crm-text-3)]">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              <span className="text-[9px] font-semibold leading-none">{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
          </nav>
        </div>

        {/* FAB — add lead (phones only; desktop uses the header button). Sits
            above the mobile bottom nav. */}
        <button onClick={() => setShowAddLead(true)}
          className="crm-glow-brand sm:hidden fixed bottom-20 right-4 z-40 w-[54px] h-[54px] rounded-full flex items-center justify-center bg-[var(--crm-accent)] transition-all duration-200 active:scale-95 hover:brightness-110 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crm-accent-border)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--crm-bg)]"
          aria-label="Add lead">
          <Plus size={22} className="text-white" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
