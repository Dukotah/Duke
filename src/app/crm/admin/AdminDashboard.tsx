"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut, Users, Send, DollarSign, Check, X, Plus, ChevronDown,
  Phone, Mail, Globe, Flame, Zap, RefreshCw, CheckCircle2, Edit2, Trash2, Eye,
} from "lucide-react";

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

// ─── Create Rep Modal ─────────────────────────────────────────────────────────

function CreateRepModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", commissionRate: "0.10" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

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

  const H = { fontFamily: "var(--font-heading)" };

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

  const commissionPreview = action === "accept" && dealValue ? null : null; // shown below
  void commissionPreview;

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
              <p className="text-xs text-white/50 italic" style={H}>"{sub.pitch}"</p>
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
              {dealValue && <p className="text-xs text-green-400/70 mt-1" style={H}>Commission auto-calculated at rep's rate</p>}
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

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard({ adminName }: { adminName: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<"submissions" | "reps">("submissions");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [reps, setReps] = useState<RepWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [resolveSub, setResolveSub] = useState<Submission | null>(null);
  const [subFilter, setSubFilter] = useState<"" | "pending" | "accepted" | "rejected">("");

  const load = useCallback(async () => {
    setLoading(true);
    const p = subFilter ? `?filter=${subFilter}` : "";
    const res = await fetch(`/api/crm/admin/submissions${p}`);
    if (res.ok) {
      const d = await res.json();
      setSubmissions(d.submissions ?? []);
      setReps(d.repStats ?? []);
    }
    setLoading(false);
  }, [subFilter]);

  useEffect(() => { load(); }, [load]);

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

      <div className="min-h-screen bg-[#111113]" style={H}>
        {/* Header */}
        <header className="border-b border-white/[0.06] bg-[#111113]/95 backdrop-blur sticky top-0 z-40">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold tracking-tight text-white">Copper Bay<span style={{ color: "#F97316" }}>Tech</span></span>
              <span className="text-xs text-white/20 hidden sm:inline">/ Admin — {adminName}</span>
            </div>
            <div className="flex items-center gap-3">
              <a href="/crm" className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1.5">
                <Eye size={12} />View as rep
              </a>
              <button onClick={handleLogout} className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/60 transition-colors">
                <LogOut size={13} />Sign out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-5">

          {/* Overview stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Sales Reps", val: reps.length, color: "text-white", icon: <Users size={14} /> },
              { label: "Pending Review", val: pending.length, color: "text-[#F97316]", icon: <Send size={14} /> },
              { label: "Pending Payout", val: `$${totalPendingPayout.toFixed(2)}`, color: "text-amber-400", icon: <DollarSign size={14} /> },
              { label: "Total Submissions", val: submissions.length, color: "text-white/70", icon: <CheckCircle2 size={14} /> },
            ].map(({ label, val, color, icon }) => (
              <div key={label} className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] px-4 py-4">
                <div className={`flex items-center gap-2 text-xs text-white/40 mb-2`} style={H}>
                  <span className={color}>{icon}</span>{label}
                </div>
                <p className={`text-2xl font-bold tabular-nums ${color}`} style={H}>{val}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-white/[0.06]">
            {[
              { key: "submissions", label: "Submissions", count: pending.length },
              { key: "reps", label: "Sales Reps", count: reps.length },
            ].map(({ key, label, count }) => (
              <button key={key} onClick={() => setTab(key as typeof tab)}
                className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                  tab === key ? "border-[#F97316] text-[#F97316]" : "border-transparent text-white/40 hover:text-white/70"
                }`} style={H}>
                {label}
                {count > 0 && (
                  <span className={`text-xs rounded-full px-2 py-0.5 font-bold ${tab === key ? "bg-[#F97316] text-white" : "bg-white/10 text-white/50"}`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Submissions tab */}
          {tab === "submissions" && (
            <div className="space-y-3">
              {/* Filter pills */}
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
                    <div key={sub.id} className="bg-[#1C1C1F] rounded-xl border border-white/[0.06] p-5">
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
                    <div key={rep.id} className={`bg-[#1C1C1F] rounded-xl border p-5 space-y-4 ${rep.active ? "border-white/[0.06]" : "border-white/[0.03] opacity-50"}`}>
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
        </main>
      </div>
    </>
  );
}
