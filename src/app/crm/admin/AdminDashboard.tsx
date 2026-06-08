"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut, Users, Send, DollarSign, Check, X, Plus,
  Phone, Mail, Globe, Flame, Zap, CheckCircle2, Eye, Trash2,
  TrendingUp, BarChart2, Megaphone, Trophy, AlertTriangle, Star, Copy,
} from "lucide-react";
import SuppressionTab from "./SuppressionTab";
import { variantRates } from "@/lib/crm/abtest";
import { GOOGLE_REVIEW_URL } from "@/config/site";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PublicUser {
  id: string; name: string; email: string; role: "admin" | "rep";
  commissionRate: number; active: boolean; createdAt: string;
}

interface RepStats {
  totalSubmissions: number; accepted: number; rejected: number;
  pendingPayout: number; totalPaid: number; totalEarned: number;
}

interface RepWithStats extends PublicUser {
  stats: RepStats; leadsWorked: number;
}

interface Submission {
  id: string; userId: string; repName: string; leadId: string; leadName: string;
  leadCity: string; leadPhone: string; leadEmail: string; leadWebsite: string;
  leadTier: string; pitch: string; repNotes: string; estimatedBudget: string;
  status: "pending" | "accepted" | "rejected"; dealValue?: number;
  commissionAmount?: number; commissionPaid?: boolean; submittedAt: string; resolvedAt?: string;
}

interface LeaderboardEntry {
  userId: string; name: string; email: string;
  submissionsThisMonth: number; acceptedThisMonth: number;
  callsThisMonth: number; totalEarned: number; currentStreak: number; rank: number;
}

interface RevenueData {
  thisMonth: { deals: number; revenue: number; commissions: number };
  allTime: { deals: number; revenue: number; commissions: number };
  pipeline: { interested: number; submitted: number; projectedValue: number };
  monthlyTrend: { month: string; revenue: number; deals: number }[];
  dealsThisMonth: Submission[];
}

interface Broadcast {
  id: string; message: string; type: "info" | "success" | "urgent";
  createdAt: string; expiresAt: string; createdBy: string;
}

// ─── Create Rep Modal ─────────────────────────────────────────────────────────

function CreateRepModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", commissionRate: "0.10" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const H = { fontFamily: "var(--font-heading)" };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/crm/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, commissionRate: parseFloat(form.commissionRate) }),
    });
    if (res.ok) { onCreated(); onClose(); }
    else { const d = await res.json(); setError(d.error ?? "Failed"); setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-[#1C1C1F] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white" style={H}>Add Sales Rep</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: "name", label: "Name", type: "text", placeholder: "Jane Smith" },
            { key: "email", label: "Email", type: "email", placeholder: "jane@example.com" },
            { key: "password", label: "Password", type: "password", placeholder: "Set a strong password" },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2" style={H}>{label}</label>
              <input type={type} value={form[key as keyof typeof form]} onChange={(e) => set(key, e.target.value)} required
                placeholder={placeholder}
                className="w-full px-4 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 transition-colors"
                style={H} />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2" style={H}>Commission Rate</label>
            <select value={form.commissionRate} onChange={(e) => set("commissionRate", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-sm text-white focus:outline-none focus:border-[#F97316]/50 transition-colors"
              style={H}>
              {[5, 8, 10, 12, 15, 20].map((r) => (
                <option key={r} value={(r / 100).toFixed(2)}>{r}% commission</option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-red-400" style={H}>{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
            style={{ backgroundColor: "#F97316", ...H }}>
            <Plus size={14} />{loading ? "Creating…" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Resolve submission modal ─────────────────────────────────────────────────

function ResolveModal({ sub, onClose, onResolved }: { sub: Submission; onClose: () => void; onResolved: () => void }) {
  const [action, setAction] = useState<"accept" | "reject">("accept");
  const [dealValue, setDealValue] = useState("");
  const [loading, setLoading] = useState(false);
  const H = { fontFamily: "var(--font-heading)" };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/crm/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sub.id, action, dealValue: action === "accept" && dealValue ? parseFloat(dealValue) : undefined }),
    });
    onResolved(); onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-[#1C1C1F] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white" style={H}>Review Submission</h2>
            <p className="text-sm text-white/40 mt-0.5" style={H}>{sub.repName} → {sub.leadName}</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60"><X size={18} /></button>
        </div>
        <div className="bg-[#111113] rounded-xl border border-white/[0.06] p-4 mb-5 space-y-2">
          {sub.leadPhone && <p className="text-xs text-white/60 flex items-center gap-2" style={H}><Phone size={11} className="text-[#F97316]/60" />{sub.leadPhone}</p>}
          {sub.leadEmail && <p className="text-xs text-white/60 flex items-center gap-2" style={H}><Mail size={11} className="text-[#F97316]/60" />{sub.leadEmail}</p>}
          {sub.estimatedBudget && <p className="text-xs text-white/60 flex items-center gap-2" style={H}><DollarSign size={11} className="text-[#F97316]/60" />Est. budget: {sub.estimatedBudget}</p>}
          <div className="mt-2 pt-2 border-t border-white/[0.06]">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1" style={H}>Rep Notes</p>
            <p className="text-sm text-white/70" style={H}>{sub.repNotes}</p>
          </div>
          {sub.pitch && (
            <div className="mt-2 pt-2 border-t border-white/[0.06]">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-1" style={H}>Pitch</p>
              <p className="text-xs text-white/50 italic" style={H}>&ldquo;{sub.pitch}&rdquo;</p>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            {(["accept", "reject"] as const).map((a) => (
              <button key={a} type="button" onClick={() => setAction(a)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all capitalize ${
                  action === a
                    ? a === "accept" ? "bg-green-400/15 text-green-400 border-green-400/30" : "bg-red-400/15 text-red-400 border-red-400/30"
                    : "bg-white/[0.03] text-white/40 border-white/10 hover:border-white/20"
                }`} style={H}>
                {a === "accept" ? <span className="flex items-center justify-center gap-1.5"><Check size={13} />Accept</span> : <span className="flex items-center justify-center gap-1.5"><X size={13} />Pass</span>}
              </button>
            ))}
          </div>
          {action === "accept" && (
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2" style={H}>Deal Value (for commission calc)</label>
              <input type="number" value={dealValue} onChange={(e) => setDealValue(e.target.value)}
                placeholder="e.g. 2500" min="0" step="50"
                className="w-full px-4 py-2.5 rounded-xl bg-[#111113] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 transition-colors"
                style={H} />
              {dealValue && <p className="text-xs text-green-400/70 mt-1" style={H}>Commission auto-calculated at rep&apos;s rate</p>}
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ backgroundColor: action === "accept" ? "#22c55e" : "#ef4444", ...H }}>
            {loading ? "Saving…" : action === "accept" ? "Accept & Record Commission" : "Pass on This Lead"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Leaderboard Tab ──────────────────────────────────────────────────────────

function LeaderboardTab() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const H = { fontFamily: "var(--font-heading)" };

  useEffect(() => {
    fetch("/api/crm/admin/leaderboard")
      .then((r) => r.json())
      .then((d) => { setEntries(d.leaderboard ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function shareLeaderboard() {
    const now = new Date();
    const monthName = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const lines = [
      `🏆 Copper BayTech Sales Leaderboard — ${monthName}`,
      "",
      ...entries.map((e) => {
        const medal = e.rank === 1 ? "🥇" : e.rank === 2 ? "🥈" : e.rank === 3 ? "🥉" : `#${e.rank}`;
        return `${medal} ${e.name} — ${e.submissionsThisMonth} submissions, ${e.callsThisMonth} calls, $${e.totalEarned.toFixed(0)} earned`;
      }),
    ];
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const medals = ["🥇", "🥈", "🥉"];
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (entries.length === 0) return (
    <div className="text-center py-16 text-white/25 text-sm" style={H}>
      No reps yet. Add sales reps to see rankings here.
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/40" style={H}>
          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} rankings
        </p>
        <button onClick={shareLeaderboard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.04] text-white/60 border border-white/10 hover:border-white/20 transition-colors"
          style={H}>
          {copied ? <><Check size={11} />Copied!</> : <><Trophy size={11} />Share Leaderboard</>}
        </button>
      </div>

      {/* Top 3 */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {top3.map((entry) => (
            <div key={entry.userId}
              className={`bg-[#1C1C1F] rounded-2xl border p-5 space-y-3 ${
                entry.rank === 1 ? "border-yellow-400/30 bg-yellow-400/5" :
                entry.rank === 2 ? "border-zinc-400/20" :
                "border-orange-400/20"
              }`}>
              <div className="flex items-center justify-between">
                <span className="text-3xl">{medals[entry.rank - 1]}</span>
                {entry.currentStreak > 0 && (
                  <span className="text-xs text-orange-400 flex items-center gap-1" style={H}>
                    <Flame size={10} />{entry.currentStreak}d
                  </span>
                )}
              </div>
              <div>
                <p className="font-bold text-white text-base" style={H}>{entry.name}</p>
                <p className="text-xs text-white/40 truncate" style={H}>{entry.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-[#111113] rounded-lg py-2">
                  <p className="text-xs text-white/30" style={H}>Submissions</p>
                  <p className="text-lg font-bold text-white" style={H}>{entry.submissionsThisMonth}</p>
                </div>
                <div className="bg-[#111113] rounded-lg py-2">
                  <p className="text-xs text-white/30" style={H}>Calls</p>
                  <p className="text-lg font-bold text-white" style={H}>{entry.callsThisMonth}</p>
                </div>
                <div className="bg-[#111113] rounded-lg py-2">
                  <p className="text-xs text-white/30" style={H}>Accepted</p>
                  <p className="text-lg font-bold text-green-400" style={H}>{entry.acceptedThisMonth}</p>
                </div>
                <div className="bg-[#111113] rounded-lg py-2">
                  <p className="text-xs text-white/30" style={H}>Earned</p>
                  <p className="text-sm font-bold text-[#F97316]" style={H}>${entry.totalEarned.toFixed(0)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rest of the list */}
      {rest.length > 0 && (
        <div className="space-y-2">
          {rest.map((entry) => (
            <div key={entry.userId} className="flex items-center gap-4 bg-[#1C1C1F] border border-white/[0.06] rounded-xl px-4 py-3">
              <span className="text-lg font-bold text-white/30 w-8 tabular-nums" style={H}>#{entry.rank}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm" style={H}>{entry.name}</p>
                <p className="text-xs text-white/35" style={H}>{entry.email}</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-white/50" style={H}>
                <span><span className="text-white font-semibold">{entry.callsThisMonth}</span> calls</span>
                <span><span className="text-white font-semibold">{entry.submissionsThisMonth}</span> subs</span>
                <span><span className="text-green-400 font-semibold">{entry.acceptedThisMonth}</span> accepted</span>
                <span><span className="text-[#F97316] font-semibold">${entry.totalEarned.toFixed(0)}</span> earned</span>
              </div>
              {entry.currentStreak > 0 && (
                <span className="text-xs text-orange-400 flex items-center gap-1 shrink-0" style={H}>
                  <Flame size={10} />{entry.currentStreak}d
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Revenue Tab ──────────────────────────────────────────────────────────────

function RevenueTab() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const H = { fontFamily: "var(--font-heading)" };

  useEffect(() => {
    fetch("/api/crm/admin/revenue")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data) return <div className="text-center py-16 text-white/25 text-sm" style={H}>Could not load revenue data.</div>;

  const maxRevenue = Math.max(...data.monthlyTrend.map((m) => m.revenue), 1);

  return (
    <div className="space-y-5">
      {/* Hero numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "This Month Revenue", val: `$${data.thisMonth.revenue.toLocaleString()}`, sub: `${data.thisMonth.deals} deals`, color: "text-[#F97316]" },
          { label: "All-Time Revenue", val: `$${data.allTime.revenue.toLocaleString()}`, sub: `${data.allTime.deals} deals total`, color: "text-white" },
          { label: "Commissions Owed", val: `$${data.thisMonth.commissions.toFixed(2)}`, sub: "this month", color: "text-amber-400" },
        ].map(({ label, val, sub, color }) => (
          <div key={label} className="crm-surface rounded-2xl p-6">
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2.5" style={H}>{label}</p>
            <p className={`text-[32px] leading-none font-bold tabular-nums tracking-tight ${color}`} style={H}>{val}</p>
            <p className="text-xs text-white/30 mt-2" style={H}>{sub}</p>
          </div>
        ))}
      </div>

      {/* 6-month trend bar chart (CSS only) */}
      <div className="bg-[#1C1C1F] border border-white/[0.06] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <BarChart2 size={14} className="text-[#F97316]" />
          <h3 className="text-sm font-bold text-white" style={H}>6-Month Revenue Trend</h3>
        </div>
        <div className="flex items-end gap-2 h-32">
          {data.monthlyTrend.map((m) => {
            const pct = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                <p className="text-xs font-bold text-white/60 tabular-nums" style={H}>
                  {m.revenue > 0 ? `$${(m.revenue / 1000).toFixed(1)}k` : "–"}
                </p>
                <div className="w-full rounded-t-md bg-[#F97316]/20 overflow-hidden relative" style={{ height: "80px" }}>
                  <div
                    className="absolute bottom-0 w-full rounded-t-md bg-[#F97316] transition-all"
                    style={{ height: `${pct}%` }}
                  />
                </div>
                <p className="text-[9px] text-white/30 text-center leading-tight" style={H}>{m.month.split(" ")[0]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pipeline funnel */}
      <div className="bg-[#1C1C1F] border border-white/[0.06] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={14} className="text-[#F97316]" />
          <h3 className="text-sm font-bold text-white" style={H}>Pipeline Funnel</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: "Interested", count: data.pipeline.interested, color: "bg-[#F97316]", pct: 100 },
            { label: "Submitted (Pending)", count: data.pipeline.submitted, color: "bg-amber-400", pct: 66 },
            { label: "Projected Value", count: null, val: `$${data.pipeline.projectedValue.toLocaleString()}`, color: "bg-green-400", pct: 33 },
          ].map(({ label, count, val, color, pct }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-white/50" style={H}>{label}</p>
                <p className="text-sm font-bold text-white" style={H}>{count !== null ? count : val}</p>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deals this month */}
      {data.dealsThisMonth.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-white mb-3" style={H}>Deals Closed This Month</h3>
          <div className="space-y-2">
            {data.dealsThisMonth.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between bg-[#1C1C1F] border border-white/[0.06] rounded-xl px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white" style={H}>{sub.leadName}</p>
                  <p className="text-xs text-white/40" style={H}>{sub.repName} · {new Date(sub.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-green-400" style={H}>${(sub.dealValue ?? 0).toLocaleString()}</p>
                  {sub.commissionAmount && <p className="text-xs text-white/40" style={H}>+${sub.commissionAmount.toFixed(2)} comm.</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Broadcast Panel ──────────────────────────────────────────────────────────

function BroadcastPanel() {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "success" | "urgent">("info");
  const [expiresInDays, setExpiresInDays] = useState(3);
  const [sending, setSending] = useState(false);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const H = { fontFamily: "var(--font-heading)" };

  const loadBroadcasts = useCallback(async () => {
    const res = await fetch("/api/crm/admin/broadcast");
    if (res.ok) {
      const d = await res.json();
      setBroadcasts(d.broadcasts ?? []);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { loadBroadcasts(); }, [loadBroadcasts]);

  async function sendBroadcast() {
    if (!message.trim()) return;
    setSending(true);
    await fetch("/api/crm/admin/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, type, expiresInDays }),
    });
    setMessage("");
    await loadBroadcasts();
    setSending(false);
  }

  async function deleteBroadcast(id: string) {
    await fetch("/api/crm/admin/broadcast", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadBroadcasts();
  }

  const typeColors = {
    info: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    success: "text-green-400 bg-green-400/10 border-green-400/20",
    urgent: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return (
    <div className="bg-[#1C1C1F] border border-white/[0.06] rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Megaphone size={14} className="text-[#F97316]" />
        <h3 className="text-sm font-bold text-white" style={H}>Broadcast to All Reps</h3>
      </div>

      <div className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message to show as a banner in every rep's dashboard…"
          rows={2}
          className="w-full px-4 py-3 rounded-xl bg-[#111113] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F97316]/50 transition-colors resize-none"
          style={H}
        />
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-1">
            {(["info", "success", "urgent"] as const).map((t) => (
              <button key={t} onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-all ${
                  type === t ? typeColors[t] : "bg-white/[0.03] text-white/40 border-white/10"
                }`} style={H}>
                {t === "info" ? "ℹ️ Info" : t === "success" ? "✅ Success" : "🚨 Urgent"}
              </button>
            ))}
          </div>
          <select
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(parseInt(e.target.value))}
            className="px-3 py-1.5 rounded-lg bg-[#111113] border border-white/10 text-xs text-white focus:outline-none"
            style={H}>
            <option value={1}>Expires in 1 day</option>
            <option value={3}>Expires in 3 days</option>
            <option value={7}>Expires in 7 days</option>
          </select>
          <button
            onClick={sendBroadcast}
            disabled={sending || !message.trim()}
            className="ml-auto inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40 transition-all hover:opacity-90"
            style={{ backgroundColor: "#F97316", ...H }}>
            <Megaphone size={13} />{sending ? "Sending…" : "Send to All Reps"}
          </button>
        </div>
      </div>

      {/* Active broadcasts */}
      {broadcasts.length > 0 && (
        <div className="space-y-2 border-t border-white/[0.06] pt-4">
          <p className="text-xs text-white/40 uppercase tracking-wider" style={H}>Active Broadcasts</p>
          {broadcasts.map((b) => (
            <div key={b.id} className={`flex items-start justify-between gap-3 px-3 py-2.5 rounded-xl border ${typeColors[b.type]}`}>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium" style={H}>{b.message}</p>
                <p className="text-xs opacity-60 mt-0.5" style={H}>
                  By {b.createdBy} · expires {new Date(b.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
              <button onClick={() => deleteBroadcast(b.id)} className="opacity-50 hover:opacity-100 transition-opacity shrink-0 mt-0.5">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

interface Territory {
  userId: string; counties: string[]; niches: string[]; updatedAt: string;
}

const ALL_COUNTIES = ["Sonoma", "Napa", "Marin", "Mendocino", "Lake", "Solano"];
const COMMON_NICHES = ["restaurant", "salon", "retail", "auto_repair", "dental", "law_office", "real_estate", "contractor", "plumber", "electrician", "gym", "spa", "cafe", "bakery", "bar"];

function TerritoryTab({ reps }: { reps: RepWithStats[] }) {
  const [territories, setTerritories] = useState<Record<string, Territory>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [editCounties, setEditCounties] = useState<string[]>([]);
  const [editNiches, setEditNiches] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const H = { fontFamily: "var(--font-heading)" };

  useEffect(() => {
    fetch("/api/crm/admin/territory")
      .then((r) => r.json())
      .then((d) => setTerritories(d.territories ?? {}))
      .catch(() => {});
  }, []);

  function startEdit(rep: RepWithStats) {
    setEditing(rep.id);
    const t = territories[rep.id];
    setEditCounties(t?.counties ?? []);
    setEditNiches(t?.niches ?? []);
  }

  async function saveTerritory(userId: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/crm/admin/territory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, counties: editCounties, niches: editNiches }),
      });
      if (res.ok) {
        const d = await res.json();
        setTerritories((prev) => ({ ...prev, [userId]: d.territory }));
        setEditing(null);
      }
    } finally { setSaving(false); }
  }

  async function removeTerritory(userId: string) {
    await fetch("/api/crm/admin/territory", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    setTerritories((prev) => { const n = { ...prev }; delete n[userId]; return n; });
    setEditing(null);
  }

  function toggleItem(arr: string[], setArr: (v: string[]) => void, item: string) {
    setArr(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  }

  return (
    <div className="space-y-3">
      {reps.length === 0 ? (
        <div className="text-center py-16 text-white/25 text-sm" style={H}>No sales reps yet.</div>
      ) : (
        <div className="space-y-2">
          {reps.map((rep) => {
            const t = territories[rep.id];
            const isEditing = editing === rep.id;
            return (
              <div key={rep.id} className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-bold text-white" style={H}>{rep.name}</p>
                    <p className="text-xs text-white/40 mt-0.5" style={H}>{rep.email}</p>
                    {t ? (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {t.counties.length > 0 ? t.counties.map((c) => (
                          <span key={c} className="text-xs bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 px-2 py-0.5 rounded-full" style={H}>{c.charAt(0).toUpperCase() + c.slice(1)}</span>
                        )) : <span className="text-xs text-white/30" style={H}>All counties</span>}
                        {t.niches.map((n) => (
                          <span key={n} className="text-xs bg-blue-400/10 text-blue-400 border border-blue-400/20 px-2 py-0.5 rounded-full" style={H}>{n.replace(/_/g, " ")}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-white/30 mt-1 inline-block" style={H}>All Areas</span>
                    )}
                  </div>
                  <button onClick={() => isEditing ? setEditing(null) : startEdit(rep)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-colors"
                    style={H}>
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>

                {isEditing && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2" style={H}>Counties (leave blank = all)</p>
                      <div className="flex flex-wrap gap-2">
                        {ALL_COUNTIES.map((c) => (
                          <button key={c} type="button" onClick={() => toggleItem(editCounties, setEditCounties, c.toLowerCase())}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${editCounties.includes(c.toLowerCase()) ? "bg-[#F97316]/15 text-[#F97316] border-[#F97316]/30" : "bg-white/[0.04] text-white/50 border-white/10 hover:border-white/20"}`}
                            style={H}>{c}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2" style={H}>Niches (leave blank = all)</p>
                      <div className="flex flex-wrap gap-2">
                        {COMMON_NICHES.map((n) => (
                          <button key={n} type="button" onClick={() => toggleItem(editNiches, setEditNiches, n)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${editNiches.includes(n) ? "bg-blue-400/15 text-blue-400 border-blue-400/30" : "bg-white/[0.04] text-white/50 border-white/10 hover:border-white/20"}`}
                            style={H}>{n.replace(/_/g, " ")}</button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button onClick={() => saveTerritory(rep.id)} disabled={saving}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-all hover:opacity-90"
                        style={{ backgroundColor: "#F97316", ...H }}>
                        {saving ? "Saving…" : "Save Territory"}
                      </button>
                      {t && (
                        <button onClick={() => removeTerritory(rep.id)}
                          className="px-4 py-2 rounded-xl text-sm font-semibold text-red-400 bg-red-400/10 border border-red-400/20 hover:bg-red-400/15 transition-all"
                          style={H}>
                          Remove Restriction
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Email Tab ────────────────────────────────────────────────────────────────

interface SendEntry {
  userId: string; repName: string; leadId: string; leadName: string;
  email: string; subject: string; sentAt: string; delivered?: boolean;
}

function EmailTab() {
  const H = { fontFamily: "var(--font-heading)" };
  const [entries, setEntries] = useState<SendEntry[]>([]);
  const [suppressed, setSuppressed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/admin/outreach");
      if (res.ok) {
        const d = await res.json();
        setEntries(d.entries ?? []);
        setSuppressed(d.suppressed ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { load(); }, [load]);

  async function reAllow(email: string) {
    setSuppressed((prev) => prev.filter((e) => e !== email));
    await fetch("/api/crm/admin/outreach", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  }

  const fmt = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    return isNaN(d.getTime()) ? iso : d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Entries logged while the delivery integration is off (delivered === false).
  const loggedOnly = entries.filter((e) => e.delivered === false).length;

  return (
    <div className="space-y-5">
      {/* Practice-mode banner — emails are being tracked but not delivered yet */}
      {loggedOnly > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3" style={H}>
          <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-xs text-white/60 leading-relaxed">
            <span className="font-bold text-white">Email delivery isn&apos;t live yet.</span>{" "}
            {loggedOnly} recent {loggedOnly === 1 ? "email was" : "emails were"} tracked on lead timelines but not actually sent.
            Sending stays locked until the domain is verified — see <span className="text-white/80">Email delivery</span> in the Setup tab.
            This protects your domain from being flagged as spam.
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] px-4 py-4">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-2" style={H}><Mail size={14} className="text-[#F97316]" />Emails tracked (recent)</div>
          <p className="text-2xl font-bold text-white tabular-nums" style={H}>{entries.length}</p>
          {loggedOnly > 0 && (
            <p className="text-[11px] text-white/30 mt-1" style={H}>{entries.length - loggedOnly} delivered · {loggedOnly} logged</p>
          )}
        </div>
        <div className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] px-4 py-4">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-2" style={H}><X size={14} className="text-red-400" />Unsubscribes</div>
          <p className="text-2xl font-bold text-white tabular-nums" style={H}>{suppressed.length}</p>
        </div>
      </div>

      {/* Recent sends */}
      <div>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2" style={H}>Recent Sends</p>
        {entries.length === 0 ? (
          <div className="text-center py-12 text-white/25 text-sm bg-[#1C1C1F] rounded-xl border border-white/[0.06]" style={H}>
            No outreach emails logged yet.
          </div>
        ) : (
          <div className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] divide-y divide-white/[0.05]">
            {entries.map((e, i) => (
              <div key={`${e.email}-${i}`} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="text-sm font-semibold text-white truncate" style={H}>{e.subject || "(no subject)"}</p>
                    {e.delivered === false && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-white/35 bg-white/10 rounded px-1.5 py-0.5 shrink-0" style={H}>
                        logged
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 truncate mt-0.5" style={H}>
                    {e.leadName} · {e.email}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-white/50" style={H}>{e.repName}</p>
                  <p className="text-xs text-white/25 mt-0.5" style={H}>{fmt(e.sentAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unsubscribe list */}
      <div>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2" style={H}>Unsubscribed / Suppressed</p>
        {suppressed.length === 0 ? (
          <div className="text-center py-8 text-white/25 text-sm bg-[#1C1C1F] rounded-xl border border-white/[0.06]" style={H}>
            Nobody has unsubscribed. 🎉
          </div>
        ) : (
          <div className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] divide-y divide-white/[0.05]">
            {suppressed.map((email) => (
              <div key={email} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <span className="text-sm text-white/70 truncate" style={H}>{email}</span>
                <button onClick={() => reAllow(email)}
                  className="shrink-0 text-xs font-semibold text-white/40 hover:text-green-400 transition-colors" style={H}>
                  Re-allow
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-white/25 mt-2 px-1" style={H}>
          Suppressed addresses are skipped on every send. Re-allow only with the person&apos;s consent.
        </p>
      </div>
    </div>
  );
}

// ─── Setup Tab ────────────────────────────────────────────────────────────────

interface HealthCheck {
  id: string; label: string; required: boolean; ok: boolean;
  vars: string[]; okText: string; problem: string;
}

function SetupTab() {
  const H = { fontFamily: "var(--font-heading)" };
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/admin/health");
      if (res.ok) {
        const d = await res.json();
        setChecks(d.checks ?? []);
        setReady(Boolean(d.ready));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const requiredLeft = checks.filter((c) => c.required && !c.ok).length;

  return (
    <div className="space-y-5">
      {/* Overall status banner */}
      {ready ? (
        <div className="flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-4">
          <CheckCircle2 size={20} className="text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-white" style={H}>You&apos;re all set up</p>
            <p className="text-xs text-white/50 mt-1 leading-relaxed" style={H}>
              Everything required is connected. Add your sales reps in the Sales Reps tab and they can sign in right away.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-xl border border-[#F97316]/30 bg-[#F97316]/10 px-4 py-4">
          <AlertTriangle size={20} className="text-[#F97316] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-white" style={H}>
              {requiredLeft} thing{requiredLeft === 1 ? "" : "s"} left to finish setup
            </p>
            <p className="text-xs text-white/50 mt-1 leading-relaxed" style={H}>
              Add the settings marked <span className="text-[#F97316] font-semibold">Required</span> below to your hosting
              provider&apos;s environment variables, then redeploy. See <span className="text-white/70">SETUP.md</span> for
              step-by-step instructions on where to get each value.
            </p>
          </div>
        </div>
      )}

      {/* Each check */}
      <div className="space-y-2">
        {checks.map((c) => (
          <div key={c.id} className="rounded-xl border border-white/[0.06] bg-[#1C1C1F] px-4 py-3.5">
            <div className="flex items-start gap-3">
              {c.ok ? (
                <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" />
              ) : c.required ? (
                <X size={18} className="text-red-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-white" style={H}>{c.label}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 ${
                    c.required ? "bg-red-500/15 text-red-300" : "bg-white/10 text-white/40"
                  }`} style={H}>
                    {c.required ? "Required" : "Optional"}
                  </span>
                </div>
                <p className="text-xs text-white/50 mt-1 leading-relaxed" style={H}>
                  {c.ok ? c.okText : c.problem}
                </p>
                {!c.ok && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {c.vars.map((v) => (
                      <code key={v} className="text-[11px] font-mono text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20 rounded px-1.5 py-0.5">
                        {v}
                      </code>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={load}
        className="text-xs font-semibold text-white/40 hover:text-white/70 transition-colors" style={H}>
        ↻ Re-check
      </button>
    </div>
  );
}

// ─── A/B Test Tab ─────────────────────────────────────────────────────────────

interface AbVariant {
  variantId: string; subject: string; sent: number; opened: number; clicked: number; replied: number;
}

function AbTestTab() {
  const H = { fontFamily: "var(--font-heading)" };
  const [variants, setVariants] = useState<AbVariant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/crm/admin/ab-test")
      .then((r) => r.json())
      .then((d) => { setVariants(d.variants ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const pct = (n: number) => `${Math.round(n * 100)}%`;

  if (loading) return <p className="text-sm text-white/40 py-8 text-center" style={H}>Loading…</p>;
  if (variants.length === 0) {
    return (
      <div className="py-12 text-center">
        <BarChart2 size={28} className="text-white/15 mx-auto mb-3" />
        <p className="text-sm text-white/40" style={H}>No A/B data yet.</p>
        <p className="text-xs text-white/25 mt-1" style={H}>Send outreach with two or more subject lines to start a test.</p>
      </div>
    );
  }

  // Best open rate among variants with enough volume to matter.
  const ranked = [...variants].sort((a, b) => variantRates(b).openRate - variantRates(a).openRate);
  const winnerId = ranked.find((v) => v.sent >= 5)?.variantId;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-white/35 border-b border-white/[0.06]">
            <th className="py-2 pr-4 font-semibold" style={H}>Subject line</th>
            <th className="py-2 px-3 font-semibold text-right" style={H}>Sent</th>
            <th className="py-2 px-3 font-semibold text-right" style={H}>Open</th>
            <th className="py-2 px-3 font-semibold text-right" style={H}>Click</th>
            <th className="py-2 px-3 font-semibold text-right" style={H}>Reply</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((v) => {
            const r = variantRates(v);
            const isWinner = v.variantId === winnerId;
            return (
              <tr key={v.variantId} className="border-b border-white/[0.04]">
                <td className="py-2.5 pr-4 text-white/80" style={H}>
                  {isWinner && <span className="text-[#F97316] mr-1.5" title="Best open rate">★</span>}
                  {v.subject}
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums text-white/60">{v.sent}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-white/80">{pct(r.openRate)}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-white/80">{pct(r.clickRate)}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-green-400">{pct(r.replyRate)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-xs text-white/25 mt-3" style={H}>★ = best open rate (needs ≥5 sends to call a winner).</p>
    </div>
  );
}

// ─── Reviews Tab (testimonial requests on won deals) ──────────────────────────

interface TestimonialReq {
  id: string; leadId: string; leadName: string; leadEmail: string;
  repName: string; dealValue: number; status: "pending" | "sent" | "dismissed"; createdAt: string;
}

function ReviewsTab() {
  const H = { fontFamily: "var(--font-heading)" };
  const [requests, setRequests] = useState<TestimonialReq[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/crm/admin/testimonials")
      .then((r) => r.json())
      .then((d) => { setRequests(d.requests ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const setStatus = async (id: string, status: "sent" | "dismissed" | "pending") => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch("/api/crm/admin/testimonials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    }).catch(() => {});
  };

  const askMessage = (r: TestimonialReq) =>
    `Hi! It was a pleasure working with ${r.leadName}. If you have a minute, a quick Google review would mean a lot and helps other local businesses find us` +
    (GOOGLE_REVIEW_URL ? `: ${GOOGLE_REVIEW_URL}` : ".") + `\n\nThank you!\n— Copper Bay Tech`;

  const copyAsk = (r: TestimonialReq) => {
    navigator.clipboard.writeText(askMessage(r));
    setCopied(r.id);
    setTimeout(() => setCopied(null), 1500);
  };

  if (loading) return <p className="text-sm text-white/40 py-8 text-center" style={H}>Loading…</p>;

  const pending = requests.filter((r) => r.status === "pending");
  const rest = requests.filter((r) => r.status !== "pending");

  if (requests.length === 0) {
    return (
      <div className="py-12 text-center">
        <Star size={28} className="text-white/15 mx-auto mb-3" />
        <p className="text-sm text-white/40" style={H}>No review requests yet.</p>
        <p className="text-xs text-white/25 mt-1" style={H}>When you accept a won deal, we&apos;ll queue a review ask here.</p>
      </div>
    );
  }

  const Row = ({ r }: { r: TestimonialReq }) => (
    <div className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white/85" style={H}>{r.leadName}</p>
          <p className="text-xs text-white/40 mt-0.5" style={H}>
            {r.repName} · ${Number(r.dealValue).toLocaleString()} · {new Date(r.createdAt).toLocaleDateString()}
            {r.status !== "pending" && <span className="ml-2 uppercase tracking-wider text-white/30">· {r.status}</span>}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => copyAsk(r)} title="Copy review-ask message"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.05] text-white/60 hover:text-white border border-white/10 text-xs font-semibold transition-colors" style={H}>
            {copied === r.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          </button>
          {r.leadEmail && (
            <a href={`mailto:${r.leadEmail}?subject=${encodeURIComponent("Quick favor — a Google review?")}&body=${encodeURIComponent(askMessage(r))}`}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/25 hover:bg-[#F97316]/25 text-xs font-semibold transition-colors" style={H}>
              <Mail size={12} />
            </a>
          )}
          {r.status === "pending" ? (
            <>
              <button onClick={() => setStatus(r.id, "sent")} title="Mark sent"
                className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-green-500/15 text-green-300 border border-green-500/25 text-xs font-semibold transition-colors" style={H}>
                <Check size={12} />
              </button>
              <button onClick={() => setStatus(r.id, "dismissed")} title="Dismiss"
                className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-white/[0.05] text-white/40 hover:text-white border border-white/10 text-xs font-semibold transition-colors" style={H}>
                <X size={12} />
              </button>
            </>
          ) : (
            <button onClick={() => setStatus(r.id, "pending")} title="Re-open"
              className="text-xs text-white/30 hover:text-white/60 px-2" style={H}>↺</button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {!GOOGLE_REVIEW_URL && (
        <p className="text-xs text-yellow-300/80 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2" style={H}>
          Set GOOGLE_REVIEW_URL in config/site.ts to include your review link in the ask.
        </p>
      )}
      {pending.length > 0 && <div className="space-y-2">{pending.map((r) => <Row key={r.id} r={r} />)}</div>}
      {rest.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider pt-2" style={H}>Handled</p>
          {rest.map((r) => <Row key={r.id} r={r} />)}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard({ adminName }: { adminName: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<"submissions" | "reps" | "territories" | "leaderboard" | "revenue" | "email" | "abtest" | "reviews" | "suppression" | "setup">("submissions");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [reps, setReps] = useState<RepWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [resolveSub, setResolveSub] = useState<Submission | null>(null);
  const [subFilter, setSubFilter] = useState<"" | "pending" | "accepted" | "rejected">("");
  const [loadError, setLoadError] = useState<string | null>(null);
  // Lightweight setup status for the dashboard nudge. null = not yet checked.
  const [setupLeft, setSetupLeft] = useState<number | null>(null);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const p = subFilter ? `?filter=${subFilter}` : "";
      const res = await fetch(`/api/crm/admin/submissions${p}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = await res.json();
      setSubmissions(d.submissions ?? []);
      setReps(d.repStats ?? []);
    } catch {
      setLoadError("Couldn't load dashboard data — check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }, [subFilter]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { load(); }, [load]);

  // Check setup health once on mount so we can nudge if required items are missing.
  const checkSetup = useCallback(() => {
    fetch("/api/crm/admin/health")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.checks) {
          setSetupLeft(d.checks.filter((c: HealthCheck) => c.required && !c.ok).length);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => { checkSetup(); }, [checkSetup]);

  // Re-check whenever the admin opens the Setup tab, so the nudge clears once fixed.
  useEffect(() => { if (tab === "setup") checkSetup(); }, [tab, checkSetup]);

  async function markPaid(id: string) {
    await fetch("/api/crm/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "markPaid" }),
    });
    load();
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch("/api/crm/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !active }),
    });
    load();
  }

  async function handleLogout() {
    await fetch("/api/crm/logout", { method: "POST" });
    router.push("/crm/login");
  }

  const pending = submissions.filter((s) => s.status === "pending");
  const totalPendingPayout = reps.reduce((sum, r) => sum + (r.stats?.pendingPayout ?? 0), 0);
  const H = { fontFamily: "var(--font-heading)" };

  return (
    <>
      {showCreate && <CreateRepModal onClose={() => setShowCreate(false)} onCreated={load} />}
      {resolveSub && <ResolveModal sub={resolveSub} onClose={() => setResolveSub(null)} onResolved={load} />}

      <div className="min-h-screen crm-backdrop text-white/80" style={H}>
        {/* Header */}
        <header className="border-b border-white/[0.06] crm-chrome sticky top-0 z-40">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-15 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[19px] font-bold tracking-tight text-white">Copper Bay<span className="text-[#F97316]">Tech</span></span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] font-semibold text-white/30 border-l border-white/10 pl-3">Admin <span className="text-white/45 normal-case tracking-normal">· {adminName}</span></span>
            </div>
            <div className="flex items-center gap-1">
              <a href="/crm" className="text-xs font-medium text-white/45 hover:text-white bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 rounded-full px-2.5 py-1.5 transition-colors flex items-center gap-1.5">
                <Eye size={12} />View as rep
              </a>
              <button onClick={handleLogout} className="inline-flex items-center gap-1.5 text-xs font-medium text-white/35 hover:text-white/70 transition-colors px-2.5 py-1.5">
                <LogOut size={13} />Sign out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-5">

          {/* Overview stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { label: "Sales Reps", val: reps.length, color: "text-white", icon: <Users size={15} /> },
              { label: "Pending Review", val: pending.length, color: "text-[#F97316]", icon: <Send size={15} /> },
              { label: "Pending Payout", val: `$${totalPendingPayout.toFixed(2)}`, color: "text-amber-400", icon: <DollarSign size={15} /> },
              { label: "Total Submissions", val: submissions.length, color: "text-white/70", icon: <CheckCircle2 size={15} /> },
            ].map(({ label, val, color, icon }) => (
              <div key={label} className="crm-surface rounded-2xl px-4 py-4">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-2.5" style={H}>
                  <span className={color}>{icon}</span>{label}
                </div>
                <p className={`text-[28px] leading-none font-bold tabular-nums tracking-tight ${color}`} style={H}>{val}</p>
              </div>
            ))}
          </div>

          {/* Broadcast panel (always visible above tabs) */}
          <BroadcastPanel />

          {/* Setup nudge — only when required items are missing and not on the Setup tab */}
          {!nudgeDismissed && setupLeft !== null && setupLeft > 0 && tab !== "setup" && (
            <div className="flex items-center gap-3 rounded-xl border border-[#F97316]/30 bg-[#F97316]/10 px-4 py-3" style={H}>
              <AlertTriangle size={16} className="text-[#F97316] shrink-0" />
              <p className="text-sm text-white/80 flex-1 leading-relaxed">
                <span className="font-bold text-white">Finish setup</span>
                {" — "}{setupLeft} required {setupLeft === 1 ? "item needs" : "items need"} attention before the CRM is fully live.
              </p>
              <button onClick={() => setTab("setup")}
                className="text-xs font-bold text-[#F97316] hover:text-[#F97316]/80 whitespace-nowrap transition-colors">
                Finish setup →
              </button>
              <button onClick={() => setNudgeDismissed(true)} aria-label="Dismiss setup reminder"
                className="text-white/30 hover:text-white/60 transition-colors shrink-0">
                <X size={14} />
              </button>
            </div>
          )}

          {loadError && (
            <div className="flex items-center justify-between gap-3 px-4 py-3 mb-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm" style={H}>
              <span className="flex items-center gap-2"><AlertTriangle size={14} className="shrink-0" />{loadError}</span>
              <button onClick={load} className="text-xs font-semibold underline hover:no-underline shrink-0">Retry</button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-white/[0.06] overflow-x-auto">
            {[
              { key: "submissions", label: "Submissions", count: pending.length },
              { key: "territories", label: "Territories", count: 0 },
              { key: "reps", label: "Sales Reps", count: reps.length },
              { key: "email", label: "Email", count: 0 },
              { key: "abtest", label: "A/B Tests", count: 0 },
              { key: "reviews", label: "Reviews", count: 0 },
              { key: "suppression", label: "Suppression", count: 0 },
              { key: "leaderboard", label: "Leaderboard", count: 0 },
              { key: "revenue", label: "Revenue", count: 0 },
              { key: "setup", label: "Setup", count: setupLeft ?? 0 },
            ].map(({ key, label, count }) => (
              <button key={key} onClick={() => setTab(key as typeof tab)} aria-current={tab === key ? "page" : undefined}
                className={`relative px-4 py-3 text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap focus-visible:outline-none ${
                  tab === key ? "text-[#F97316]" : "text-white/40 hover:text-white/75"
                }`} style={H}>
                {label}
                {count > 0 && (
                  <span className={`text-[11px] rounded-full px-2 py-0.5 font-bold transition-colors ${tab === key ? "bg-[#F97316] text-white" : "bg-white/10 text-white/50"}`}>
                    {count}
                  </span>
                )}
                {tab === key && <span className="absolute bottom-[-1px] left-2 right-2 h-0.5 bg-[#F97316] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.6)]" />}
              </button>
            ))}
          </div>

          {/* Submissions tab */}
          {tab === "submissions" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {(["", "pending", "accepted", "rejected"] as const).map((f) => (
                  <button key={f || "all"} onClick={() => setSubFilter(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize ${
                      subFilter === f ? "bg-[#F97316]/15 text-[#F97316] border-[#F97316]/30" : "bg-white/[0.04] text-white/50 border-white/10 hover:border-white/20"
                    }`} style={H}>
                    {f || "All"} {f === "pending" && pending.length > 0 && `(${pending.length})`}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-6 h-6 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-16 text-white/25 text-sm" style={H}>
                  No submissions yet. When a rep pushes a hot lead, it appears here.
                </div>
              ) : (
                <div className="space-y-2">
                  {submissions.map((sub) => (
                    <div key={sub.id} className="crm-surface rounded-2xl p-5">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-white" style={H}>{sub.leadName}</h3>
                            {sub.leadCity && <span className="text-xs text-white/40" style={H}>{sub.leadCity}</span>}
                            {sub.leadTier && (
                              <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${
                                sub.leadTier === "A" ? "text-orange-400 bg-orange-400/10 border-orange-400/20" :
                                sub.leadTier === "B" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
                                "text-zinc-400 bg-zinc-400/10 border-zinc-400/20"
                              }`} style={H}>
                                {sub.leadTier === "A" ? <Flame size={9} className="inline mr-1" /> : sub.leadTier === "B" ? <Zap size={9} className="inline mr-1" /> : <Globe size={9} className="inline mr-1" />}
                                Tier {sub.leadTier}
                              </span>
                            )}
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                              sub.status === "pending" ? "text-[#F97316] bg-[#F97316]/10 border-[#F97316]/20" :
                              sub.status === "accepted" ? "text-green-400 bg-green-400/10 border-green-400/20" :
                              "text-zinc-500 bg-zinc-500/10 border-zinc-500/20"
                            }`} style={H}>
                              {sub.status === "pending" ? "⏳ Pending" : sub.status === "accepted" ? "✓ Accepted" : "✕ Rejected"}
                            </span>
                          </div>
                          <p className="text-xs text-white/40 mt-1" style={H}>Submitted by <strong className="text-white/60">{sub.repName}</strong> · {new Date(sub.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap shrink-0">
                          {sub.status === "pending" && (
                            <button onClick={() => setResolveSub(sub)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 hover:bg-[#F97316]/20 transition-colors"
                              style={H}>
                              <CheckCircle2 size={13} />Review
                            </button>
                          )}
                          {sub.status === "accepted" && sub.commissionAmount && !sub.commissionPaid && (
                            <button onClick={() => markPaid(sub.id)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-green-400/10 text-green-400 border border-green-400/20 hover:bg-green-400/20 transition-colors"
                              style={H}>
                              <DollarSign size={13} />Mark Paid (${sub.commissionAmount.toFixed(2)})
                            </button>
                          )}
                          {sub.commissionPaid && (
                            <span className="text-xs text-green-400/60 flex items-center gap-1" style={H}><Check size={11} />Paid ${sub.commissionAmount?.toFixed(2)}</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                        <div className="flex flex-col gap-1.5">
                          {sub.leadPhone && <a href={`tel:${sub.leadPhone}`} className="text-xs text-white/60 hover:text-[#F97316] flex items-center gap-2 transition-colors" style={H}><Phone size={11} className="text-[#F97316]/50 shrink-0" />{sub.leadPhone}</a>}
                          {sub.leadEmail && <a href={`mailto:${sub.leadEmail}`} className="text-xs text-white/60 hover:text-[#F97316] flex items-center gap-2 transition-colors" style={H}><Mail size={11} className="text-[#F97316]/50 shrink-0" />{sub.leadEmail}</a>}
                          {sub.estimatedBudget && <p className="text-xs text-white/50 flex items-center gap-2" style={H}><DollarSign size={11} className="text-[#F97316]/50 shrink-0" />Est: {sub.estimatedBudget}</p>}
                          {sub.dealValue && <p className="text-xs text-green-400/70 flex items-center gap-2" style={H}><DollarSign size={11} />Deal: ${sub.dealValue.toLocaleString()}</p>}
                        </div>
                        {sub.repNotes && (
                          <div className="sm:col-span-2 bg-[#111113] rounded-lg px-3 py-2.5">
                            <p className="text-xs text-white/30 uppercase tracking-wider mb-1" style={H}>Rep Notes</p>
                            <p className="text-sm text-white/70" style={H}>{sub.repNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Territories tab */}
          {tab === "territories" && <TerritoryTab reps={reps} />}

          {/* Reps tab */}
          {tab === "reps" && (
            <div className="space-y-3">
              <div className="flex justify-end">
                <button onClick={() => setShowCreate(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "#F97316", ...H }}>
                  <Plus size={14} />Add Sales Rep
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-6 h-6 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : reps.length === 0 ? (
                <div className="text-center py-16 text-white/25 text-sm" style={H}>
                  No sales reps yet. Add one to get started.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {reps.map((rep) => (
                    <div key={rep.id} className={`crm-surface crm-surface-hover rounded-2xl p-5 space-y-4 ${rep.active ? "" : "opacity-50"}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-white" style={H}>{rep.name}</p>
                          <p className="text-xs text-white/40 mt-0.5" style={H}>{rep.email}</p>
                          <p className="text-xs text-[#F97316]/70 mt-1" style={H}>{Math.round(rep.commissionRate * 100)}% commission</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => toggleActive(rep.id, rep.active)}
                            className={`text-xs px-2.5 py-1 rounded-full border font-semibold transition-colors ${rep.active ? "text-green-400 bg-green-400/10 border-green-400/20 hover:bg-green-400/15" : "text-zinc-500 bg-zinc-500/10 border-zinc-500/20"}`}
                            style={H}>
                            {rep.active ? "Active" : "Inactive"}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Leads Worked", val: rep.leadsWorked },
                          { label: "Submissions", val: rep.stats?.totalSubmissions ?? 0 },
                          { label: "Accepted", val: rep.stats?.accepted ?? 0 },
                          { label: "Pending Payout", val: `$${(rep.stats?.pendingPayout ?? 0).toFixed(2)}` },
                        ].map(({ label, val }) => (
                          <div key={label} className="bg-[#111113] rounded-lg px-3 py-2">
                            <p className="text-xs text-white/30" style={H}>{label}</p>
                            <p className="text-sm font-bold text-white/80 mt-0.5" style={H}>{val}</p>
                          </div>
                        ))}
                      </div>

                      {(rep.stats?.totalEarned ?? 0) > 0 && (
                        <div className="flex items-center justify-between text-xs border-t border-white/[0.06] pt-3" style={H}>
                          <span className="text-white/40">Total earned</span>
                          <span className="text-green-400 font-bold">${(rep.stats?.totalEarned ?? 0).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Leaderboard tab */}
          {tab === "email" && <EmailTab />}

          {tab === "abtest" && <AbTestTab />}

          {tab === "reviews" && <ReviewsTab />}

          {tab === "suppression" && <SuppressionTab />}

          {tab === "setup" && <SetupTab />}

          {tab === "leaderboard" && <LeaderboardTab />}

          {/* Revenue tab */}
          {tab === "revenue" && <RevenueTab />}

        </main>
      </div>
    </>
  );
}
