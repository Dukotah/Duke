"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Phone, ChevronRight, Search, Filter, Tag, MapPin, Mail, Globe,
  Flame, Zap, ArrowUpDown, X, Download, LogOut, LayoutGrid,
  BookOpen, DollarSign, List, ChevronDown, Check,
  AlertCircle, Copy,
} from "lucide-react";
import dynamic from "next/dynamic";
import LeadPanel from "./components/LeadPanel";

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
    <div className="bg-[#1C1C1F] border border-white/[0.06] rounded-2xl p-4 mt-4" style={H}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🏆</span>
        <h3 className="text-sm font-bold text-white">This Month's Rankings</h3>
        {myEntry && (
          <span className="ml-auto text-xs text-[#F97316] font-semibold">
            You're #{myEntry.rank}
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
const Pipeline = dynamic(() => import("./components/Pipeline"), { ssr: false });
const ScriptsGuide = dynamic(() => import("./components/ScriptsGuide"), { ssr: false });
const EarningsView = dynamic(() => import("./components/Earnings"), { ssr: false });

// ─── Types ────────────────────────────────────────────────────────────────────

interface Lead {
  id: string; name: string; category: string; phone: string; email: string;
  email_owned: string; website: string; socials: string; best_contact: string;
  address: string; city: string; state: string; zip: string; county: string;
  tier: string; tier_reason: string; builder: string; industry_fit: string;
  outreach_score: number; pitch: string; alt_categories: string;
}

interface LeadState {
  status: "new" | "contacted" | "follow_up" | "not_interested" | "won";
  stage: string; notes: string; lastContacted?: string;
  submittedAt?: string; callCount?: number; lastOutcome?: string;
}

interface Submission {
  id: string; leadId: string; leadName: string; status: "pending" | "accepted" | "rejected";
  commissionAmount?: number; commissionPaid?: boolean; submittedAt: string;
}

interface LeadsResponse {
  leads: Lead[]; total: number; page: number; limit: number;
  counties: string[]; niches: string[];
  tierCounts: { A: number; B: number; C: number };
}

// ─── Constants ────────────────────────────────────────────────────────────────

type Tab = "queue" | "pipeline" | "leads" | "scripts" | "earnings";

const TABS: { key: Tab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { key: "queue", label: "Queue", icon: Phone },
  { key: "pipeline", label: "Pipeline", icon: LayoutGrid },
  { key: "leads", label: "All Leads", icon: List },
  { key: "scripts", label: "Scripts", icon: BookOpen },
  { key: "earnings", label: "Earnings", icon: DollarSign },
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

function AllLeads({ states, onSelectLead }: { states: Record<string, LeadState>; onSelectLead: (l: Lead) => void }) {
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [county, setCounty] = useState("");
  const [niche, setNiche] = useState("");
  const [tier, setTier] = useState("");
  const [hasEmail, setHasEmail] = useState("");
  const [sortBy, setSortBy] = useState("outreach_score");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetch_ = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const p = new URLSearchParams({ page: String(page), limit: String(LIMIT), sortBy,
        ...(q && { q }), ...(county && { county }), ...(niche && { niche }),
        ...(tier && { tier }), ...(hasEmail && { hasEmail }) });
      const res = await fetch(`/api/crm/leads?${p}`);
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch { setError("Could not load leads."); }
    finally { setLoading(false); }
  }, [q, county, niche, tier, hasEmail, sortBy, page]);

  useEffect(() => { fetch_(); }, [fetch_]);
  useEffect(() => { setPage(1); }, [q, county, niche, tier, hasEmail, sortBy]);

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 0;
  const activeFilters = [q, county, niche, tier, hasEmail].filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, city, niche…"
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#1C1C1F] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 transition-colors"
            style={H} />
          {q && <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"><X size={13} /></button>}
        </div>
        <button onClick={() => setShowFilters((v) => !v)}
          className={`inline-flex items-center gap-1.5 px-3 rounded-xl text-sm border transition-all ${showFilters || activeFilters > 0 ? "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/30" : "bg-[#1C1C1F] text-white/50 border-white/10"}`}
          style={H}>
          <Filter size={13} />
          {activeFilters > 0 && <span className="bg-[#F97316] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{activeFilters}</span>}
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
          <Select value={sortBy} onChange={setSortBy} icon={ArrowUpDown}>
            <option value="outreach_score">Best score</option>
            <option value="name">Name A–Z</option>
            <option value="city">City A–Z</option>
          </Select>
          {activeFilters > 0 && (
            <button onClick={() => { setQ(""); setCounty(""); setNiche(""); setTier(""); setHasEmail(""); }}
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

      {/* Results count */}
      {data && (
        <p className="text-xs text-white/30" style={H}>
          <span className="text-white font-semibold">{data.total.toLocaleString()}</span> leads · page {page} of {totalPages}
          · 🔥 {data.tierCounts.A.toLocaleString()} no-site
        </p>
      )}

      {/* List */}
      {error ? (
        <div className="flex items-center justify-center gap-2 py-16 text-red-400/80 text-sm"><AlertCircle size={16} />{error}</div>
      ) : loading ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <div className="w-6 h-6 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-1.5">
          {data?.leads.map((lead) => {
            const state = states[lead.id];
            return (
              <div key={lead.id} onClick={() => onSelectLead(lead)}
                className="flex items-center gap-3 px-4 py-3.5 bg-[#1C1C1F] border border-white/[0.06] rounded-2xl cursor-pointer hover:border-[#F97316]/20 hover:bg-[#F97316]/5 transition-all active:scale-[0.99] group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-white truncate" style={H}>{lead.name}</p>
                    {lead.tier === "A" && <Flame size={11} className="text-orange-400 shrink-0" />}
                    {lead.tier === "B" && <Zap size={11} className="text-yellow-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-white/35 mt-0.5" style={H}>{lead.city} · {lead.category.replace(/_/g, " ")}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <ScoreBar score={lead.outreach_score} />
                    {state && <StatusBadge stage={state.stage} status={state.status} />}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {lead.phone && <span className="text-xs text-white/30 hidden sm:flex items-center gap-1" style={H}><Phone size={9} />{lead.phone}</span>}
                  {lead.email && <span className="text-xs text-white/25 hidden sm:flex items-center gap-1" style={H}><Mail size={9} />email</span>}
                  <ChevronRight size={14} className="text-white/20 group-hover:text-[#F97316]/50 transition-colors" />
                </div>
              </div>
            );
          })}
          {data?.leads.length === 0 && <p className="text-center py-12 text-sm text-white/25" style={H}>No leads match your filters.</p>}
        </div>
      )}

      {/* Pagination */}
      {data && totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
            className="text-sm text-white/40 hover:text-white disabled:opacity-20 transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20"
            style={H}>← Prev</button>
          <span className="text-xs text-white/30" style={H}>{page} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            className="text-sm text-white/40 hover:text-white disabled:opacity-20 transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20"
            style={H}>Next →</button>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard shell ──────────────────────────────────────────────────────────

export default function CRMDashboard({ userId, userName }: { userId: string; userName: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("queue");
  const [states, setStates] = useState<Record<string, LeadState>>({});
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [statesLoaded, setStatesLoaded] = useState(false);

  // Load all state + submissions once
  useEffect(() => {
    fetch("/api/crm/state").then((r) => r.json()).then((d) => { setStates(d); setStatesLoaded(true); }).catch(() => setStatesLoaded(true));
    fetch("/api/crm/submit").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setSubmissions(d); }).catch(() => {});
  }, []);

  // Load leads for pipeline (needs all touched leads)
  useEffect(() => {
    if (!statesLoaded) return;
    const ids = Object.keys(states);
    if (ids.length === 0) return;
    // Fetch a broad set for pipeline
    fetch("/api/crm/leads?limit=100&sortBy=outreach_score").then((r) => r.json()).then((d) => {
      if (d.leads) setAllLeads(d.leads);
    }).catch(() => {});
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
    fetch("/api/crm/submit").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setSubmissions(d); }).catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/crm/logout", { method: "POST" });
    router.push("/crm/login");
  }

  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const interestedCount = Object.values(states).filter((s) => s.stage === "interested").length;

  return (
    <>
      {selectedLead && (
        <LeadPanel lead={selectedLead}
          state={states[selectedLead.id] ?? { status: "new", stage: "to_call", notes: "" }}
          submission={submissions.find((s) => s.leadId === selectedLead.id)}
          onClose={() => setSelectedLead(null)}
          onUpdate={(patch) => updateState(selectedLead.id, patch)}
          onSubmitted={refreshSubs} />
      )}

      <div className="min-h-screen bg-[#111113] flex flex-col" style={H}>

        {/* Top bar */}
        <header className="border-b border-white/[0.06] bg-[#111113] sticky top-0 z-30 shrink-0">
          <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight">Copper Bay<span style={{ color: "#F97316" }}>Tech</span></span>
              <span className="hidden sm:inline text-xs text-white/25 font-medium">/ Sales</span>
            </div>
            <div className="flex items-center gap-3">
              {interestedCount > 0 && (
                <button onClick={() => setTab("pipeline")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20 px-2.5 py-1 rounded-full"
                  style={H}>
                  🔥 {interestedCount} interested
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-[#F97316]/20 flex items-center justify-center text-xs font-bold text-[#F97316]" style={H}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-white/50" style={H}>{userName}</span>
              </div>
              <button onClick={handleLogout} className="text-xs text-white/25 hover:text-white/50 transition-colors" style={H}>Sign out</button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 max-w-3xl mx-auto w-full px-4 pt-5 pb-24 overflow-y-auto">
          <BroadcastBanners />
          {tab === "queue" && (
            <CallQueue states={states} onSelectLead={(l) => setSelectedLead(l as Lead)} onRefresh={refreshSubs} />
          )}
          {tab === "pipeline" && (
            <Pipeline leads={allLeads} states={states} submissions={submissions} onSelectLead={(l) => setSelectedLead(l as Lead)} />
          )}
          {tab === "leads" && (
            <AllLeads states={states} onSelectLead={setSelectedLead} />
          )}
          {tab === "scripts" && <ScriptsGuide />}
          {tab === "earnings" && (
            <>
              <EarningsView states={states} repName={userName} />
              <LeaderboardPeek userId={userId} />
            </>
          )}
        </div>

        {/* Bottom tab bar — always visible */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#111113]/95 backdrop-blur border-t border-white/[0.07] pb-safe">
          <div className="max-w-3xl mx-auto flex">
            {TABS.map((t) => {
              const active = tab === t.key;
              const badge = t.key === "earnings" && pendingCount > 0 ? pendingCount : null;
              return (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors relative ${active ? "text-[#F97316]" : "text-white/30 hover:text-white/60"}`}
                  style={H}>
                  <t.icon size={20} />
                  <span className="text-[10px] font-semibold">{t.label}</span>
                  {badge && (
                    <span className="absolute top-2 right-1/4 bg-[#F97316] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                  {active && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#F97316] rounded-full" />}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
