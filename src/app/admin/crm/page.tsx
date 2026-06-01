"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import type { Contact, ContactStatus } from "@/lib/crm/types";

const STATUS_STYLE: Record<ContactStatus, string> = {
  new: "bg-zinc-100 text-zinc-600",
  contacted: "bg-blue-100 text-blue-700",
  opened: "bg-amber-100 text-amber-700",
  clicked: "bg-orange-100 text-orange-700",
  replied: "bg-emerald-100 text-emerald-700",
  won: "bg-emerald-600 text-white",
  bounced: "bg-red-100 text-red-700",
  complained: "bg-red-100 text-red-700",
  unsubscribed: "bg-zinc-200 text-zinc-500",
  lost: "bg-zinc-200 text-zinc-500",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function CrmDashboard() {
  const [token, setToken] = useState("");
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("crm_token");
    if (saved) load(saved);
  }, []);

  async function load(t: string) {
    setToken(t);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/crm/contacts", {
        headers: { "x-crm-token": t },
      });
      if (res.status === 401) {
        setError("Invalid token.");
        setContacts(null);
        return;
      }
      if (!res.ok) {
        setError(`Error ${res.status}`);
        return;
      }
      const data = await res.json();
      setContacts(data.contacts);
      localStorage.setItem("crm_token", t);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const c = contacts ?? [];
    const by = (s: ContactStatus) => c.filter((x) => x.status === s).length;
    return {
      total: c.length,
      replied: by("replied"),
      opened: by("opened") + by("clicked"),
      contacted: by("contacted"),
      new: by("new"),
    };
  }, [contacts]);

  return (
    <main className="min-h-screen bg-[#FAFAF9] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-[#18181B]">CRM</h1>
            <p className="text-sm text-[#3F3F46]/70">
              Leads, outreach status, and email engagement.
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Admin token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load(token)}
              className="px-3 py-2 rounded-md border border-[#18181B]/15 bg-white text-sm w-48"
            />
            <button
              onClick={() => load(token)}
              className="px-4 py-2 rounded-md bg-[#F97316] text-white text-sm font-medium hover:opacity-90"
            >
              {loading ? "Loading…" : "Load"}
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {contacts && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              {(
                [
                  ["Total", stats.total],
                  ["New", stats.new],
                  ["Contacted", stats.contacted],
                  ["Opened", stats.opened],
                  ["Replied", stats.replied],
                ] as const
              ).map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg bg-white border border-[#18181B]/10 p-4"
                >
                  <div className="text-2xl font-semibold text-[#18181B]">
                    {value}
                  </div>
                  <div className="text-xs uppercase tracking-wide text-[#3F3F46]/60">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-white border border-[#18181B]/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#18181B]/[0.03] text-left text-xs uppercase tracking-wide text-[#3F3F46]/60">
                  <tr>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Emails</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium">Last activity</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-[#3F3F46]/60"
                      >
                        No contacts yet.
                      </td>
                    </tr>
                  )}
                  {contacts.map((c) => {
                    const opens = c.emails.reduce((n, e) => n + e.opens, 0);
                    const isOpen = expanded === c.id;
                    return (
                      <Fragment key={c.id}>
                        <tr
                          onClick={() => setExpanded(isOpen ? null : c.id)}
                          className="border-t border-[#18181B]/[0.06] hover:bg-[#18181B]/[0.02] cursor-pointer"
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium text-[#18181B]">
                              {c.name}
                            </div>
                            <div className="text-[#3F3F46]/70">{c.email}</div>
                            {c.business && (
                              <div className="text-xs text-[#3F3F46]/50">
                                {c.business}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[c.status]}`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#3F3F46]/80">
                            {c.emails.length} sent · {opens} opens
                          </td>
                          <td className="px-4 py-3 text-[#3F3F46]/70">
                            {c.source}
                          </td>
                          <td className="px-4 py-3 text-[#3F3F46]/70">
                            {timeAgo(c.lastActivityAt)}
                          </td>
                        </tr>
                        {isOpen && (
                          <tr className="bg-[#18181B]/[0.02]">
                            <td colSpan={5} className="px-4 py-3">
                              <div className="text-xs uppercase tracking-wide text-[#3F3F46]/50 mb-2">
                                Activity
                              </div>
                              <ul className="space-y-1">
                                {[...c.activities]
                                  .reverse()
                                  .slice(0, 12)
                                  .map((a) => (
                                    <li
                                      key={a.id}
                                      className="flex gap-3 text-[#3F3F46]/80"
                                    >
                                      <span className="text-[#3F3F46]/50 w-20 shrink-0">
                                        {timeAgo(a.at)}
                                      </span>
                                      <span className="font-medium">
                                        {a.type}
                                      </span>
                                      {a.detail && (
                                        <span className="text-[#3F3F46]/60 truncate">
                                          {a.detail}
                                        </span>
                                      )}
                                    </li>
                                  ))}
                              </ul>
                              {c.notes && (
                                <p className="mt-3 text-[#3F3F46]/70 whitespace-pre-wrap">
                                  <span className="text-[#3F3F46]/50">Notes: </span>
                                  {c.notes}
                                </p>
                              )}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {!contacts && !error && (
          <p className="text-sm text-[#3F3F46]/60">
            Enter your admin token to view the CRM.
          </p>
        )}
      </div>
    </main>
  );
}
