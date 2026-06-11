"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Phone, ChevronRight, Search, Filter, Tag, MapPin, Mail,
  Flame, Zap, ArrowUpDown, X, LayoutGrid,
  BookOpen, List, DollarSign,
  AlertCircle, Plus, CalendarClock,
} from "lucide-react";
import dynamic from "next/dynamic";
import LeadPanel from "./components/LeadPanel";
import AddLeadModal from "./components/AddLeadModal";
import CallTimer from "./components/CallTimer";
import { RecencyBadges, deriveTags, TAG_DEFS, type LeadAction, type TagKey } from "./components/RecencyBadges";

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
        <h3 className="text-sm font-bold text-white tracking-tight">This Month&apos;s Rankings</h3>
        {myEntry && (
          <span className="ml-auto text-xs text-[#F97316] font-semibold">
            You&apos;re #{myEntry.rank}
          </span>
        )}
      </div>
      <div className="space-y-1.5">
        {entries.slice(0, 5).map((e) => (
          <div key={e.userId}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${e.userId === userId ? "bg-[#F97316]/10 border border-[#F97316]/20" : "bg-[#111113]"}`}>
            <span className="text-sm w-6 text-center">
              {e.rank <= 3 ? medals[e.rank - 1] : <span className="text-white/30 font-bold text-xs">#{e.rank}</span>}
            </span>
            <p className={`flex-1 text-sm font-semibold ${e.userId === userId ? "text-[#F97316]" : "text-white/70"}`}>{e.name}</p>
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span>{e.submissionsThisMonth} sub</span>
              <span>{e.callsThisMonth} calls</span>
            </div>
          </div>
        ))}
      </div>
      {myEntry && myEntry.rank > 5 && (
        <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center gap-3 px-3 py-2 rounded-lg bg-[#F97316]/10 border border-[#F97316]/20">
          <span className="text-sm w-6 text-center text-white/30 font-bold text-xs">#{myEntry.rank}</span>
          <p className="flex-1 text-sm font-semibold text-[#F97316]">{myEntry.name} (you)</p>
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span>{myEntry.submissionsThisMonth} sub</span>
            <span>{myEntry.callsThisMonth} calls</span>
          </div>
        </div>
      )}
    </div>
  );
}

const CallQueue = dynamic(() => import("./components/CallQueue"), { ssr: false });
const CallReminders = dynamic(() => import("./components/CallReminders"), { ssr: false });
const Pipeline = dynamic(() => import("./components/Pipeline"), { ssr: false });
const ScriptsGuide = dynamic(() => import("./components/ScriptsGuide"), { ssr: false });
const EarningsView = dynamic(() => import("./components/Earnings"), { ssr: false });
const BulkOutreach = dynamic(() => import("./components/BulkOutreach"), { ssr: false });
const EmailComposer = dynamic(() => import("./components/EmailComposer"), { ssr: false });

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
  previewUrl?: string | null; claimByDate?: string | null; demoCategory?: string | null;
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

type View = "due" | "new" | "all" | "pipeline";

const CHIPS: { key: View; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: "due", label: "Due today", icon: CalendarClock },
  { key: "new", label: "New", icon: Phone },
  { key: "all", label: "All", icon: List },
  { key: "pipeline", label: "Pipeline", icon: LayoutGrid },
];

const LIMIT = 50;
const H = { fontFamily: "var(--font-heading)" };

// ─── Mini components ──────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "#F97316" : score >= 60 ? "#FBBF24" : "#6B7280";
  return (
    <div className="flex items-center gap-2">
      <div className="w-12 h-1 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color, ...H }}>{score}</span>
    </div>
  );
}

function StatusBadge({ stage, status }: { stage?: string; status: string }) {
  if (stage === "interested") return <span className="text-xs font-semibold text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20 px-2 py-0.5 rounded-full" style={H}>Interested</span>;
  if (stage === "submitted") return <span className="text-xs font-semibold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded-full" style={H}>Submitted</span>;
  if (stage === "won" || status === "won") return <span className="text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full" style={H}>Won 🏆</span>;
  if (status === "not_interested") return <span className="text-xs font-semibold text-zinc-500 bg-zinc-500/10 border border-zinc-500/20 px-2 py-0.5 rounded-full" style={H}>Pass</span>;
  if (stage === "voicemail") return <span className="text-xs font-semibold text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded-full" style={H}>Voicemail</span>;
  if (stage === "called" || status === "contacted") return <span className="text-xs font-semibold text-zinc-400 bg-zinc-400/10 border border-zinc-400/20 px-2 py-0.5 rounded-full" style={H}>Called</span>;
  return <span className="text-xs font-semibold text-blue-400/60 bg-blue-400/5 border border-blue-400/10 px-2 py-0.5 rounded-full" style={H}>New</span>;
}

function Select({ value, onChange, children, icon: Icon }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="relative">
      {Icon && <Icon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />}
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className={`${Icon ? "pl-8" : "pl-3"} pr-6 py-2 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white focus:outline-none focus:border-[#F97316]/50 transition-colors appearance-none`}
        style={H}>
        {children}
      </select>
    </div>
  );
}

// ─── All Leads table view ─────────────────────────────────────────────────────

function AllLeads({ states, onSelectLead, userName, selectedLeadId }: { states: Record<string, LeadState>; onSelectLead: (l: Lead) => void; userName: string; selectedLeadId?: string | null }) {
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [showBulkOutreach, setShowBulkOutreach] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [county, setCounty] = useState("");
  const [niche, setNiche] = useState("");
  const [tier, setTier] = useState("");
  const [hasEmail, setHasEmail] = useState("");
  const [grade, setGrade] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [sortBy, setSortBy] = useState("outreach_score");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [allTerritories, setAllTerritories] = useState(false);
  // Action tag filter — client-side over the current page's leads (the durable
  // cross-rep stamps the leads API already attaches), composable with search +
  // server filters + the view-chips. null = no tag filter.
  const [tagFilter, setTagFilter] = useState<TagKey | null>(null);
  const todayISO = new Date().toISOString().slice(0, 10);

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
    if (!tagFilter) return true;
    const tags = deriveTags(lead.actions ?? null, states[lead.id] ?? null, todayISO, { previewUrl: lead.previewUrl });
    return tags.has(tagFilter);
  });

  return (
    <div className="space-y-3">
      {showBulkOutreach && <BulkOutreach repName={userName} onClose={() => setShowBulkOutreach(false)} />}
      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, city, niche…"
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 focus:ring-2 focus:ring-[#F97316]/15 transition-all"
            style={H} />
          {q && <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"><X size={13} /></button>}
        </div>
        <button onClick={() => setShowFilters((v) => !v)}
          className={`inline-flex items-center gap-1.5 px-3 rounded-xl text-sm border transition-all ${showFilters || activeFilters > 0 ? "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/30" : "bg-[#1C1C1F] text-white/50 border-white/10"}`}
          style={H}>
          <Filter size={13} />
          {activeFilters > 0 && <span className="bg-[#F97316] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{activeFilters}</span>}
        </button>
        <button onClick={() => setShowBulkOutreach(true)}
          className="inline-flex items-center gap-1.5 px-3 rounded-xl text-sm bg-[#1C1C1F] text-white/50 border border-white/10 hover:text-white/80 hover:border-white/20 transition-all"
          title="Bulk Email" style={H}>
          <Mail size={13} />
          <span className="hidden sm:inline">Bulk Email</span>
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 p-3 bg-[#1C1C1F] rounded-xl border border-white/[0.06]">
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
              className="inline-flex items-center gap-1 text-xs text-white/30 hover:text-white/60 px-2" style={H}>
              <X size={11} />Clear
            </button>
          )}
        </div>
      )}

      {/* Quick pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => { setTier(tier === "A" ? "" : "A"); setPage(1); }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${tier === "A" ? "bg-orange-400/15 text-orange-400 border-orange-400/30" : "bg-white/[0.03] text-white/40 border-white/10"}`}
          style={H}><Flame size={10} />No Website</button>
        <button onClick={() => { setHasEmail(hasEmail === "yes" ? "" : "yes"); setPage(1); }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${hasEmail === "yes" ? "bg-blue-400/15 text-blue-400 border-blue-400/30" : "bg-white/[0.03] text-white/40 border-white/10"}`}
          style={H}><Mail size={10} />Has Email</button>
      </div>

      {/* Action tags — one click finds a group ("Emailed", "Follow-up due", …).
          Composable with the search/filters above and the view-chips. */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {TAG_DEFS.map((t) => {
          const active = tagFilter === t.key;
          return (
            <button key={t.key} onClick={() => setTagFilter(active ? null : t.key)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${active ? "bg-[#F97316]/15 text-[#F97316] border-[#F97316]/35" : "bg-white/[0.03] text-white/40 border-white/10 hover:text-white/70 hover:border-white/20"}`}
              style={H}>
              <t.icon size={10} />{t.label}
            </button>
          );
        })}
        {tagFilter && (
          <button onClick={() => setTagFilter(null)}
            className="inline-flex items-center gap-1 text-[11px] text-white/30 hover:text-white/60 px-1.5" style={H}>
            <X size={10} />Clear tag
          </button>
        )}
      </div>

      {/* Territory badge + toggle */}
      {territory && (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="inline-flex items-center gap-1.5 text-xs text-white/50 bg-[#1C1C1F] border border-white/[0.08] px-3 py-1.5 rounded-full" style={H}>
            <MapPin size={10} className="text-[#F97316]" />
            {territory.counties.length > 0 ? territory.counties.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(", ") : "All Areas"}
            {territory.niches.length > 0 && <span className="text-white/30">· {territory.niches.join(", ")}</span>}
          </div>
          <button onClick={() => setAllTerritories((v) => !v)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${allTerritories ? "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/30" : "text-white/35 border-white/10 bg-white/[0.03] hover:border-white/20"}`}
            style={H}>
            {allTerritories ? "My Territory" : "Show all areas"}
          </button>
        </div>
      )}

      {/* Results count */}
      {data && (
        <p className="text-xs text-white/30" style={H}>
          {tagFilter ? (
            <><span className="text-white font-semibold">{visibleLeads.length.toLocaleString()}</span> tagged on this page · </>
          ) : (
            <><span className="text-white font-semibold">{data.total.toLocaleString()}</span> leads · </>
          )}
          page {page} of {totalPages}
          · 🔥 {data.tierCounts.A.toLocaleString()} no-site
        </p>
      )}

      {/* List */}
      {error ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 crm-surface rounded-2xl text-center">
          <AlertCircle size={22} className="text-red-400/80" />
          <p className="text-sm text-white/60" style={H}>{error}</p>
          <button onClick={() => fetch_()} className="text-xs font-semibold text-[#F97316] hover:text-[#F97316]/80 transition-colors" style={H}>Try again</button>
        </div>
      ) : loading ? (
        <div className="space-y-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5 crm-surface rounded-2xl animate-pulse">
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-2/5 rounded-full bg-white/[0.08]" />
                <div className="h-2.5 w-3/5 rounded-full bg-white/[0.05]" />
                <div className="h-1.5 w-16 rounded-full bg-white/[0.05]" />
              </div>
              <div className="h-3.5 w-3.5 rounded-full bg-white/[0.05]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1.5">
          {visibleLeads.map((lead) => {
            const state = states[lead.id];
            return (
              <div key={lead.id} onClick={() => onSelectLead(lead)} role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelectLead(lead); } }}
                className={`crm-surface crm-surface-hover flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer active:scale-[0.99] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]/40 ${selectedLeadId === lead.id ? "ring-2 ring-[#F97316]/50 bg-[#F97316]/[0.06]" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-white truncate group-hover:text-[#F97316] transition-colors" style={H}>{lead.name}</p>
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
                  <p className="text-xs text-white/40 mt-0.5 capitalize" style={H}>{lead.city} · {lead.category.replace(/_/g, " ")}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <ScoreBar score={lead.outreach_score} />
                    {state && <StatusBadge stage={state.stage} status={state.status} />}
                  </div>
                  {/* Durable cross-rep recency badges — what's been done, by whom. */}
                  <RecencyBadges actions={lead.actions} state={state} today={todayISO} previewUrl={lead.previewUrl} className="mt-2" />
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {lead.phone && <span className="text-xs text-white/35 hidden sm:flex items-center gap-1 tabular-nums" style={H}><Phone size={9} />{lead.phone}</span>}
                  {lead.email && (
                    <span className="text-xs text-white/25 hidden sm:flex items-center gap-1.5" style={H}>
                      {lead.email_status && <span className={`w-1.5 h-1.5 rounded-full ${deliverabilityDot(lead.email_status)}`} title={`Email: ${lead.email_status}`} />}
                      <Mail size={9} />email
                    </span>
                  )}
                  <ChevronRight size={15} className="text-white/20 group-hover:text-[#F97316] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
          {visibleLeads.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-14 crm-surface rounded-2xl text-center px-6">
              <Search size={22} className="text-white/20" />
              <p className="text-sm font-semibold text-white/50" style={H}>No leads match your filters</p>
              <p className="text-xs text-white/30" style={H}>
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
            className="text-sm font-medium text-white/50 hover:text-white disabled:opacity-20 disabled:hover:text-white/50 transition-colors px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/25 hover:bg-white/[0.04]"
            style={H}>← Prev</button>
          <span className="text-xs font-medium text-white/35 tabular-nums" style={H}>{page} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            className="text-sm font-medium text-white/50 hover:text-white disabled:opacity-20 disabled:hover:text-white/50 transition-colors px-3.5 py-2 rounded-xl border border-white/10 hover:border-white/25 hover:bg-white/[0.04]"
            style={H}>Next →</button>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard shell ──────────────────────────────────────────────────────────

export default function CRMDashboard({ userId, userName, role }: { userId: string; userName: string; role: "admin" | "rep" }) {
  const router = useRouter();
  const [view, setView] = useState<View>("due");
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

  const handleCallOutcome = useCallback(async (outcome: string) => {
    if (!activeLead) return;
    const leadId = activeLead.id;
    setActiveLead(null);
    const outcomeToStage: Record<string, string> = {
      no_answer: "called",
      voicemail: "voicemail",
      call_back: "call_back",
      interested: "interested",
    };
    const patch: Partial<LeadState> = {
      stage: outcomeToStage[outcome] ?? "called",
      status: outcome === "interested" ? "contacted" : "contacted",
      lastOutcome: outcome,
      lastContacted: new Date().toISOString(),
    };
    setStates((prev) => {
      const cur = prev[leadId] ?? { status: "new", stage: "to_call", notes: "" };
      return { ...prev, [leadId]: { ...cur, ...patch, callCount: (cur.callCount ?? 0) + 1 } };
    });
    await fetch("/api/crm/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, ...patch, callCount: ((states[leadId]?.callCount ?? 0) + 1) }),
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

  return (
    <>
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
          <div className="relative w-full sm:w-[560px] lg:w-[640px] bg-[#111113] border-l border-white/[0.08] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 h-15 py-3 border-b border-white/[0.07] shrink-0">
              <span className="text-sm font-bold text-white tracking-tight flex items-center gap-2" style={H}><BookOpen size={15} className="text-[#F97316]" />Scripts &amp; Guide</span>
              <button onClick={() => setShowScripts(false)} className="text-white/30 hover:text-white/70 transition-colors"><X size={16} /></button>
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
          <div className="relative w-full sm:w-[560px] lg:w-[640px] bg-[#111113] border-l border-white/[0.08] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 h-15 py-3 border-b border-white/[0.07] shrink-0">
              <span className="text-sm font-bold text-white tracking-tight flex items-center gap-2" style={H}>💰 Earnings</span>
              <button onClick={() => setShowEarnings(false)} className="text-white/30 hover:text-white/70 transition-colors"><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <EarningsView states={states} repName={userName} />
              <LeaderboardPeek userId={userId} />
            </div>
          </div>
        </div>
      )}

      <div className="h-[100dvh] overflow-hidden crm-backdrop flex flex-col text-white/80" style={H}>

        {loadError && (
          <div role="alert" className="flex items-center justify-between gap-3 px-4 py-2.5 bg-red-500/15 border-b border-red-500/30 text-red-200 text-sm">
            <span>{loadError}</span>
            <button onClick={() => setLoadError(null)} className="shrink-0 text-red-200/70 hover:text-red-100 text-xs font-semibold uppercase tracking-wide">Dismiss</button>
          </div>
        )}

        {/* Top bar */}
        <header className="border-b border-white/[0.06] crm-chrome sticky top-0 z-30 shrink-0">
          <div className="max-w-[1800px] mx-auto px-4 h-15 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-[17px] font-bold text-white tracking-tight">Copper Bay<span className="text-[#F97316]">Tech</span></span>
              <span className="hidden sm:inline-flex items-center text-[11px] uppercase tracking-[0.14em] text-white/30 font-semibold border-l border-white/10 pl-2.5">Sales</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Stats strip — hidden below md; Due survives below md as the chip badge */}
              <div className="hidden md:flex items-center gap-2 mr-1">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/55 bg-white/[0.04] border border-white/10 px-2.5 py-1.5 rounded-full" style={H}>
                  <span className="text-white/35">Today</span>
                  <span className="text-white tabular-nums">{loggedToday ?? "—"}<span className="text-white/30">/50</span></span>
                </span>
                <button onClick={() => setView("due")}
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full border transition-colors ${dueCount > 0 ? "text-amber-300 bg-amber-400/10 border-amber-400/25 hover:bg-amber-400/15" : "text-white/45 bg-white/[0.04] border-white/10 hover:text-white/70"}`}
                  style={H}>
                  <CalendarClock size={11} />
                  <span className="tabular-nums">{dueCount}</span><span className="text-white/35 hidden lg:inline">due</span>
                </button>
                <button onClick={() => setShowEarnings(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-green-300 bg-green-400/10 border border-green-400/25 px-2.5 py-1.5 rounded-full hover:bg-green-400/15 transition-colors"
                  style={H} title="View earnings breakdown">
                  ${earnedTotal.toLocaleString()}
                  {pendingCount > 0 && <span className="text-white/35 font-medium hidden lg:inline">· {pendingCount} pending</span>}
                </button>
              </div>
              {interestedCount > 0 && (
                <button onClick={() => setView("pipeline")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/25 px-2.5 py-1.5 rounded-full hover:bg-[#F97316]/15 transition-colors"
                  style={H}>
                  🔥 {interestedCount} interested
                </button>
              )}
              {/* Earnings — mobile/below-md fallback for the green stats button (which is md:hidden above). Carries the pending badge so the signal survives on phones. */}
              <button onClick={() => setShowEarnings(true)}
                className="md:hidden relative inline-flex items-center gap-1.5 text-xs font-semibold text-green-300 bg-green-400/10 border border-green-400/25 px-2.5 py-1.5 rounded-full hover:bg-green-400/15 transition-colors"
                style={H} title="View earnings breakdown" aria-label="View earnings">
                <DollarSign size={12} /><span className="hidden sm:inline tabular-nums">{earnedTotal.toLocaleString()}</span>
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-black text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center" aria-label={`${pendingCount} pending`}>{pendingCount}</span>
                )}
              </button>
              <button onClick={() => setShowScripts(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 px-2.5 py-1.5 rounded-full transition-colors"
                style={H} title="Scripts & guide">
                <BookOpen size={12} /><span className="hidden sm:inline">Scripts</span>
              </button>
              {role === "admin" && (
                <button onClick={() => router.push("/crm/admin")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 px-2.5 py-1.5 rounded-full transition-colors"
                  style={H} title="Admin dashboard — analytics, leaderboard, revenue">
                  <LayoutGrid size={12} /><span className="hidden sm:inline">Dashboard</span>
                </button>
              )}
              <div className="hidden sm:flex items-center gap-2 pl-1">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F97316]/30 to-[#F97316]/10 ring-1 ring-[#F97316]/30 flex items-center justify-center text-xs font-bold text-[#F97316]" style={H}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-white/55" style={H}>{userName}</span>
              </div>
              <button onClick={handleLogout} className="text-xs font-medium text-white/30 hover:text-white/60 transition-colors ml-0.5" style={H}>Sign out</button>
            </div>
          </div>
        </header>

        {/* View chips — drive the left list in place; no page navigation */}
        <div className="border-b border-white/[0.06] crm-chrome shrink-0">
          <div className="max-w-[1800px] mx-auto px-4 py-2 flex gap-2 overflow-x-auto">
            {CHIPS.map((c) => {
              const active = view === c.key;
              const badge = c.key === "due" && dueCount > 0 ? dueCount : null;
              return (
                <button key={c.key} onClick={() => setView(c.key)} aria-current={active ? "true" : undefined}
                  className={`shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all ${active ? "bg-[#F97316]/12 text-[#F97316] border-[#F97316]/40" : "bg-white/[0.03] text-white/50 border-white/10 hover:text-white/80 hover:border-white/20"}`}
                  style={H}>
                  <c.icon size={13} />
                  {c.label}
                  {badge && (
                    <span className="bg-[#F97316] text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">{badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main row — full-width cockpit. On desktop the lead detail docks in the
            aside on the right; the list/work pane flexes to fill the rest. */}
        <div className="flex-1 flex min-h-0 w-full max-w-[1800px] mx-auto">
          <div key={view} className="crm-rise flex-1 min-w-0 px-4 pt-5 pb-24 overflow-y-auto">
            <BroadcastBanners />
            {view === "due" && (
              <CallReminders
                states={states}
                allLeads={allLeads}
                onSelectLead={(l) => setSelectedLead(l as Lead)}
                onUpdateState={updateState}
              />
            )}
            {view === "new" && (
              <CallQueue
                key={queueRefreshKey}
                states={states}
                onSelectLead={(l) => setSelectedLead(l as Lead)}
                onRefresh={refreshSubs}
                onDialerStart={(l) => setActiveLead(l as Lead)}
                onEmailLead={(l) => setEmailLead(l as Lead)}
              />
            )}
            {view === "all" && (
              <AllLeads states={states} onSelectLead={setSelectedLead} userName={userName} selectedLeadId={selectedLead?.id} />
            )}
            {view === "pipeline" && (
              <Pipeline leads={allLeads} states={states} submissions={submissions} onSelectLead={(l) => setSelectedLead(l as Lead)} />
            )}
          </div>

          {/* Docked lead detail (desktop cockpit). Always rendered on desktop so the
              two-pane frame is fixed; shows the empty state until a lead is picked. */}
          {isDesktop && (
            <aside className="hidden lg:flex w-[480px] xl:w-[560px] 2xl:w-[640px] shrink-0 flex-col border-l border-white/[0.07] bg-[#111113] overflow-hidden pb-4">
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
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
                    <List size={24} className="text-white/25" />
                  </div>
                  <p className="text-sm font-bold text-white/55" style={H}>Select a lead to start</p>
                  <p className="text-xs text-white/30 max-w-[16rem] leading-relaxed" style={H}>Pick a lead from the list and their full workspace — email, call, outcomes and notes — opens here.</p>
                </div>
              )}
            </aside>
          )}
        </div>

        {/* FAB — add lead. On lg+ the lead detail docks in the right aside
            (480/560/640px wide); offset the FAB left of it so it floats over the
            list pane and never lands on the LeadPanel's footer/action region. */}
        <button onClick={() => setShowAddLead(true)}
          className="crm-glow-brand fixed bottom-5 right-4 lg:right-[504px] xl:right-[584px] 2xl:right-[664px] z-40 w-[54px] h-[54px] rounded-full flex items-center justify-center bg-[#F97316] transition-all duration-200 active:scale-95 hover:brightness-110 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e10]"
          aria-label="Add lead">
          <Plus size={22} className="text-white" strokeWidth={2.4} />
        </button>
      </div>
    </>
  );
}
