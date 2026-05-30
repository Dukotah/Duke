"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Send,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  Globe,
  Mail,
  Trash2,
} from "lucide-react";
import { Lead, LeadStatus } from "@/lib/db";

const STATUS_COLORS: Record<LeadStatus, string> = {
  scraped: "bg-zinc-700 text-zinc-300",
  audited: "bg-blue-900 text-blue-300",
  drafted: "bg-yellow-900 text-yellow-300",
  approved: "bg-green-900 text-green-300",
  sent: "bg-purple-900 text-purple-300",
  skipped: "bg-red-900/40 text-red-400",
};

const CITIES = ["Petaluma", "Santa Rosa", "Sebastopol", "Rohnert Park", "Cotati", "Windsor", "Healdsburg", "Sonoma"];
const CATEGORIES = [
  "restaurants",
  "law offices",
  "dental offices",
  "contractors",
  "auto repair",
  "hair salons",
  "real estate agents",
  "insurance agents",
  "accountants",
  "plumbers",
  "HVAC",
  "florists",
];

export default function OutreachDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [scrapeCategory, setScrapeCategory] = useState(CATEGORIES[0]);
  const [scrapeCity, setScrapeCity] = useState(CITIES[0]);
  const [scraping, setScraping] = useState(false);
  const [auditing, setAuditing] = useState(false);
  const [sending, setSending] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, number>>({});

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const loadLeads = useCallback(async () => {
    const url =
      filterStatus === "all"
        ? "/api/admin/leads"
        : `/api/admin/leads?status=${filterStatus}`;
    const res = await fetch(url);
    const data: Lead[] = await res.json();
    setLeads(data);

    // compute stats
    const s: Record<string, number> = {};
    data.forEach((l) => {
      s[l.status] = (s[l.status] ?? 0) + 1;
    });
    setStats(s);
  }, [filterStatus]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  async function handleScrape() {
    setScraping(true);
    try {
      const res = await fetch("/api/admin/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: scrapeCategory, city: scrapeCity }),
      });
      const data = await res.json();
      if (data.error) showToast(`Error: ${data.error}`);
      else showToast(`Found ${data.total} businesses, added ${data.added} new leads`);
      loadLeads();
    } finally {
      setScraping(false);
    }
  }

  async function handleAudit() {
    setAuditing(true);
    try {
      const res = await fetch("/api/admin/audit-leads", { method: "POST" });
      const data = await res.json();
      showToast(data.message ?? `Audited ${data.processed} leads`);
      loadLeads();
    } finally {
      setAuditing(false);
    }
  }

  async function handleApprove(lead: Lead) {
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lead.id, status: "approved" }),
    });
    showToast(`${lead.business_name} approved`);
    loadLeads();
  }

  async function handleSkip(lead: Lead) {
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lead.id, status: "skipped" }),
    });
    loadLeads();
  }

  async function handleDelete(lead: Lead) {
    await fetch("/api/admin/leads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lead.id }),
    });
    loadLeads();
  }

  async function handleSend(lead: Lead) {
    setSending(lead.id);
    try {
      const res = await fetch("/api/admin/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id }),
      });
      const data = await res.json();
      if (data.error) showToast(`Error: ${data.error}`);
      else showToast(`Sent! Check your email for the outreach draft.`);
      loadLeads();
    } finally {
      setSending(null);
    }
  }

  function startEdit(lead: Lead) {
    setEditingId(lead.id);
    setEditSubject(lead.email_subject ?? "");
    setEditBody(lead.email_body ?? "");
  }

  async function saveEdit(id: number) {
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email_subject: editSubject, email_body: editBody }),
    });
    setEditingId(null);
    showToast("Email saved");
    loadLeads();
  }

  const filtered =
    filterStatus === "all" ? leads : leads.filter((l) => l.status === filterStatus);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-zinc-800 border border-zinc-700 text-white text-sm px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Outreach Dashboard</h1>
            <p className="text-zinc-500 text-sm mt-1">Find leads → audit sites → review emails → send</p>
          </div>
          <a href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Back to site
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          {(["scraped", "audited", "drafted", "approved", "sent", "skipped"] as LeadStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? "all" : s)}
              className={`rounded-xl p-3 text-center transition-all border ${
                filterStatus === s
                  ? "border-orange-500 bg-orange-500/10"
                  : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
              }`}
            >
              <div className="text-2xl font-bold text-white">{stats[s] ?? 0}</div>
              <div className={`text-xs mt-1 capitalize px-2 py-0.5 rounded-full inline-block ${STATUS_COLORS[s]}`}>
                {s}
              </div>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {/* Scrape */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Search size={16} className="text-orange-400" />
              <span className="text-sm font-semibold">Find Leads</span>
            </div>
            <div className="flex gap-2 mb-3">
              <select
                value={scrapeCategory}
                onChange={(e) => setScrapeCategory(e.target.value)}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={scrapeCity}
                onChange={(e) => setScrapeCity(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleScrape}
              disabled={scraping}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {scraping ? <><RefreshCw size={14} className="animate-spin" /> Scraping…</> : <><Search size={14} /> Scrape Google Maps</>}
            </button>
          </div>

          {/* Audit */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-orange-400" />
              <span className="text-sm font-semibold">Audit & Draft Emails</span>
            </div>
            <p className="text-zinc-500 text-xs mb-4">
              Runs the next 5 unaudited leads through PageSpeed, filters sites scoring under 70, and writes a personalized email for each.
            </p>
            <button
              onClick={handleAudit}
              disabled={auditing}
              className="w-full bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {auditing ? <><RefreshCw size={14} className="animate-spin" /> Auditing…</> : <><Zap size={14} /> Audit next 5 leads</>}
            </button>
          </div>
        </div>

        {/* Lead list */}
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center text-zinc-600 py-16 text-sm">
              No leads yet — scrape some businesses to get started.
            </div>
          )}

          {filtered.map((lead) => {
            const isExpanded = expandedId === lead.id;
            const isEditing = editingId === lead.id;

            return (
              <div
                key={lead.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
              >
                {/* Row */}
                <div className="flex items-center gap-3 p-4">
                  {/* Score badge */}
                  {lead.score !== null ? (
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        lead.score < 30
                          ? "bg-red-500/20 text-red-400"
                          : lead.score < 50
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {lead.score}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <Globe size={16} className="text-zinc-600" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{lead.business_name}</p>
                    <p className="text-zinc-500 text-xs truncate">{lead.website ?? "No website"}</p>
                  </div>

                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize hidden sm:inline-block ${STATUS_COLORS[lead.status]}`}>
                    {lead.status}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {lead.status === "drafted" && (
                      <button
                        onClick={() => handleApprove(lead)}
                        title="Approve"
                        className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {lead.status === "approved" && (
                      <button
                        onClick={() => handleSend(lead)}
                        disabled={sending === lead.id}
                        title="Send"
                        className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {sending === lead.id ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                      </button>
                    )}
                    {["drafted", "approved"].includes(lead.status) && (
                      <button
                        onClick={() => handleSkip(lead)}
                        title="Skip"
                        className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <XCircle size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(lead)}
                      title="Delete"
                      className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    {lead.email_body && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                        className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded email */}
                {isExpanded && lead.email_body && (
                  <div className="border-t border-zinc-800 p-4">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-zinc-500 mb-1 block">Subject</label>
                          <input
                            value={editSubject}
                            onChange={(e) => setEditSubject(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-zinc-500 mb-1 block">Body</label>
                          <textarea
                            value={editBody}
                            onChange={(e) => setEditBody(e.target.value)}
                            rows={12}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 font-mono resize-y"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(lead.id)}
                            className="bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-zinc-700 hover:bg-zinc-600 text-white text-xs px-4 py-2 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Mail size={12} />
                            <span className="font-medium text-zinc-300">{lead.email_subject}</span>
                          </div>
                          <button
                            onClick={() => startEdit(lead)}
                            className="text-xs text-orange-400 hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                        <pre className="text-xs text-zinc-400 whitespace-pre-wrap font-sans leading-relaxed bg-zinc-800/50 rounded-lg p-4">
                          {lead.email_body}
                        </pre>
                        {lead.status === "drafted" && (
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => handleApprove(lead)}
                              className="bg-green-600 hover:bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              <CheckCircle size={12} /> Approve & queue
                            </button>
                            <button
                              onClick={() => handleSkip(lead)}
                              className="bg-zinc-700 hover:bg-zinc-600 text-white text-xs px-4 py-2 rounded-lg transition-colors"
                            >
                              Skip
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
