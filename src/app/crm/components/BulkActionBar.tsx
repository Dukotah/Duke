"use client";

import { useState } from "react";
import {
  X,
  ChevronDown,
  Calendar,
  Tag,
  Users,
  GitBranch,
  Layers,
  Loader2,
} from "lucide-react";

const H = { fontFamily: "var(--font-heading)" };

// ─── Types ────────────────────────────────────────────────────────────────────

interface SelectedLead {
  id: string;
  name: string;
  email: string;
}

interface BulkActionBarProps {
  selectedIds: Set<string>;
  // When the bar needs lead name+email for the enrollCadence action the caller
  // must supply a lookup map. Optional — other actions only need the id set.
  leadMap?: Map<string, SelectedLead>;
  onClear: () => void;
  onDone: () => void;
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function BarButton({
  onClick,
  disabled,
  active,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
        ${active
          ? "bg-[var(--crm-accent-weak)] text-[var(--crm-accent-text)] border-[var(--crm-accent-border)]"
          : "bg-[var(--crm-surface-2)] text-[var(--crm-text-2)] border-[var(--crm-border)] hover:text-[var(--crm-text)] hover:border-[var(--crm-border-strong)] hover:bg-[var(--crm-surface-3)]"
        }
        disabled:opacity-40 disabled:cursor-not-allowed`}
      style={H}
    >
      {children}
    </button>
  );
}

type PanelName = "stage" | "followup" | "tag" | "cadence" | "reassign" | null;

// ─── BulkActionBar ────────────────────────────────────────────────────────────

export default function BulkActionBar({
  selectedIds,
  leadMap,
  onClear,
  onDone,
}: BulkActionBarProps) {
  const [open, setOpen] = useState<PanelName>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Per-panel input state
  const [stage, setStage] = useState("contacted");
  const [followUpDate, setFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [tag, setTag] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [toRepName, setToRepName] = useState("");

  const count = selectedIds.size;

  function togglePanel(name: PanelName) {
    setOpen((prev) => (prev === name ? null : name));
    setError("");
    setSuccess("");
  }

  async function post(
    action: string,
    payload: Record<string, unknown>
  ): Promise<boolean> {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/crm/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadIds: Array.from(selectedIds),
          action,
          payload,
        }),
      });
      const data = (await res.json()) as { updated?: number; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return false;
      }
      setSuccess(`Updated ${data.updated ?? count} leads`);
      return true;
    } catch {
      setError("Network error — try again");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleSetStage() {
    const ok = await post("setStage", { stage });
    if (ok) { setTimeout(onDone, 900); }
  }

  async function handleSetFollowUp() {
    const ok = await post("setFollowUp", { followUpDate });
    if (ok) { setTimeout(onDone, 900); }
  }

  async function handleTag() {
    if (!tag.trim()) return;
    const ok = await post("tag", { tag: tag.trim() });
    if (ok) { setTimeout(onDone, 900); }
  }

  async function handleEnrollCadence() {
    // Build the lead array from the leadMap; skip entries without email
    const leads: Array<{ id: string; name: string; email: string }> = [];
    for (const id of selectedIds) {
      const l = leadMap?.get(id);
      if (l?.email) leads.push({ id: l.id, name: l.name, email: l.email });
    }
    if (leads.length === 0) {
      setError("None of the selected leads have an email address");
      return;
    }
    const ok = await post("enrollCadence", { leads });
    if (ok) { setTimeout(onDone, 900); }
  }

  async function handleReassign() {
    if (!toUserId.trim()) return;
    const ok = await post("reassign", { toUserId: toUserId.trim(), toRepName: toRepName.trim() });
    if (ok) { setTimeout(onDone, 900); }
  }

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none"
      aria-live="polite"
    >
      {/* Main bar */}
      <div
        className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-2xl border border-[var(--crm-accent-border)] bg-[var(--crm-surface)] backdrop-blur-sm"
        style={H}
      >
        {/* Count pill */}
        <span className="text-sm font-bold text-[var(--crm-accent-text)] bg-[var(--crm-accent-weak)] px-2.5 py-1 rounded-lg shrink-0">
          {count} selected
        </span>

        <div className="flex items-center gap-1.5 flex-wrap">
          <BarButton onClick={() => togglePanel("stage")} active={open === "stage"} disabled={loading}>
            <Layers size={11} />
            Set stage
            <ChevronDown size={10} className={`transition-transform ${open === "stage" ? "rotate-180" : ""}`} />
          </BarButton>

          <BarButton onClick={() => togglePanel("followup")} active={open === "followup"} disabled={loading}>
            <Calendar size={11} />
            Follow-up
            <ChevronDown size={10} className={`transition-transform ${open === "followup" ? "rotate-180" : ""}`} />
          </BarButton>

          <BarButton onClick={() => togglePanel("tag")} active={open === "tag"} disabled={loading}>
            <Tag size={11} />
            Tag
            <ChevronDown size={10} className={`transition-transform ${open === "tag" ? "rotate-180" : ""}`} />
          </BarButton>

          <BarButton onClick={() => togglePanel("cadence")} active={open === "cadence"} disabled={loading}>
            <GitBranch size={11} />
            Enroll cadence
          </BarButton>

          <BarButton onClick={() => togglePanel("reassign")} active={open === "reassign"} disabled={loading}>
            <Users size={11} />
            Reassign
            <ChevronDown size={10} className={`transition-transform ${open === "reassign" ? "rotate-180" : ""}`} />
          </BarButton>
        </div>

        {loading && <Loader2 size={14} className="animate-spin text-[var(--crm-accent-text)] shrink-0" />}

        <button
          onClick={onClear}
          disabled={loading}
          title="Clear selection"
          className="ml-1 p-1 rounded-lg text-[var(--crm-text-3)] hover:text-[var(--crm-text)] hover:bg-[var(--crm-surface-3)] transition-colors disabled:opacity-40 shrink-0"
        >
          <X size={14} />
        </button>
      </div>

      {/* Inline panels — rendered above the bar when open */}
      {open && (
        <div
          className="pointer-events-auto order-first bg-[var(--crm-surface-2)] border border-[var(--crm-border)] rounded-2xl px-4 py-3 shadow-xl w-72"
          style={H}
        >
          {/* Feedback messages */}
          {error && (
            <p className="text-xs text-red-500 font-semibold mb-2">{error}</p>
          )}
          {success && (
            <p className="text-xs text-emerald-500 font-semibold mb-2">{success}</p>
          )}

          {open === "stage" && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-[var(--crm-text-2)] mb-2">Set stage for {count} leads</p>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] focus:outline-none focus:border-[var(--crm-accent-border)] appearance-none"
                style={H}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="called">Called</option>
                <option value="voicemail">Voicemail</option>
                <option value="interested">Interested</option>
                <option value="follow_up">Follow-up</option>
                <option value="submitted">Submitted</option>
                <option value="won">Won</option>
                <option value="not_interested">Not interested</option>
              </select>
              <button
                onClick={handleSetStage}
                disabled={loading}
                className="w-full py-2 rounded-xl text-xs font-bold bg-[var(--crm-accent)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                style={H}
              >
                Apply to {count} leads
              </button>
            </div>
          )}

          {open === "followup" && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-[var(--crm-text-2)] mb-2">Set follow-up date for {count} leads</p>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] focus:outline-none focus:border-[var(--crm-accent-border)]"
                style={H}
              />
              <button
                onClick={handleSetFollowUp}
                disabled={loading || !followUpDate}
                className="w-full py-2 rounded-xl text-xs font-bold bg-[var(--crm-accent)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                style={H}
              >
                Apply to {count} leads
              </button>
            </div>
          )}

          {open === "tag" && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-[var(--crm-text-2)] mb-2">Tag {count} leads</p>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. hot, q3-target, local"
                className="w-full px-3 py-2 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)]"
                style={H}
                onKeyDown={(e) => { if (e.key === "Enter") handleTag(); }}
              />
              <button
                onClick={handleTag}
                disabled={loading || !tag.trim()}
                className="w-full py-2 rounded-xl text-xs font-bold bg-[var(--crm-accent)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                style={H}
              >
                Tag {count} leads
              </button>
            </div>
          )}

          {open === "cadence" && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-[var(--crm-text-2)] mb-1">Enroll {count} leads in drip cadence</p>
              <p className="text-[11px] text-[var(--crm-text-3)] mb-2">
                Queues the 3-step follow-up sequence (day 3, 7, 14). Leads without an email address are skipped.
              </p>
              <button
                onClick={handleEnrollCadence}
                disabled={loading}
                className="w-full py-2 rounded-xl text-xs font-bold bg-[var(--crm-accent)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                style={H}
              >
                Enroll {count} leads
              </button>
            </div>
          )}

          {open === "reassign" && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-[var(--crm-text-2)] mb-2">Reassign {count} leads</p>
              <input
                type="text"
                value={toUserId}
                onChange={(e) => setToUserId(e.target.value)}
                placeholder="User ID"
                className="w-full px-3 py-2 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)]"
                style={H}
              />
              <input
                type="text"
                value={toRepName}
                onChange={(e) => setToRepName(e.target.value)}
                placeholder="Rep display name"
                className="w-full px-3 py-2 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)]"
                style={H}
              />
              <button
                onClick={handleReassign}
                disabled={loading || !toUserId.trim()}
                className="w-full py-2 rounded-xl text-xs font-bold bg-[var(--crm-accent)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                style={H}
              >
                Reassign {count} leads
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
