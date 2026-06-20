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
  CheckCircle2,
  AlertCircle,
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
  "aria-label": ariaLabel,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  "aria-label"?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all min-h-[36px] focus-visible:outline-2 focus-visible:outline-[var(--crm-accent)] focus-visible:outline-offset-1
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

/** Shared apply button used in each panel */
function ApplyButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-2 rounded-xl text-xs font-bold bg-[var(--crm-accent)] text-white hover:brightness-110 disabled:opacity-50 transition-all focus-visible:outline-2 focus-visible:outline-[var(--crm-accent)] focus-visible:outline-offset-1 min-h-[36px]"
      style={H}
    >
      {children}
    </button>
  );
}

/** Shared text input used in each panel */
function PanelInput({
  value,
  onChange,
  onKeyDown,
  placeholder,
  type = "text",
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: string;
  "aria-label"?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className="w-full px-3 py-2 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] placeholder:text-[var(--crm-text-3)] focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors min-h-[36px]"
      style={H}
    />
  );
}

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
      setSuccess(`Updated ${data.updated ?? count} lead${(data.updated ?? count) !== 1 ? "s" : ""}`);
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
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none w-[calc(100vw-2rem)] max-w-2xl"
      aria-live="polite"
    >
      {/* Inline panels — rendered above the bar when open */}
      {open && (
        <div
          className="pointer-events-auto order-first bg-[var(--crm-surface-2)] border border-[var(--crm-border)] rounded-2xl px-4 py-4 shadow-xl w-full max-w-sm crm-rise"
          style={H}
          role="region"
          aria-label="Bulk action options"
        >
          {/* Feedback messages */}
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-red-500 font-semibold mb-3" role="alert">
              <AlertCircle size={13} aria-hidden="true" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold mb-3" role="status">
              <CheckCircle2 size={13} aria-hidden="true" />
              {success}
            </div>
          )}

          {open === "stage" && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-[var(--crm-text-2)]">Set stage for {count} lead{count !== 1 ? "s" : ""}</p>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                aria-label="Pipeline stage"
                className="w-full px-3 py-2 rounded-xl bg-[var(--crm-surface)] border border-[var(--crm-border)] text-sm text-[var(--crm-text)] focus:outline-none focus:border-[var(--crm-accent-border)] transition-colors appearance-none min-h-[36px]"
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
              <ApplyButton onClick={handleSetStage} disabled={loading}>
                {loading ? <Loader2 size={12} className="animate-spin inline mr-1" aria-hidden="true" /> : null}
                Apply to {count} lead{count !== 1 ? "s" : ""}
              </ApplyButton>
            </div>
          )}

          {open === "followup" && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-[var(--crm-text-2)]">Set follow-up date for {count} lead{count !== 1 ? "s" : ""}</p>
              <PanelInput
                type="date"
                value={followUpDate}
                onChange={setFollowUpDate}
                aria-label="Follow-up date"
              />
              <ApplyButton onClick={handleSetFollowUp} disabled={loading || !followUpDate}>
                {loading ? <Loader2 size={12} className="animate-spin inline mr-1" aria-hidden="true" /> : null}
                Apply to {count} lead{count !== 1 ? "s" : ""}
              </ApplyButton>
            </div>
          )}

          {open === "tag" && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-[var(--crm-text-2)]">Tag {count} lead{count !== 1 ? "s" : ""}</p>
              <PanelInput
                value={tag}
                onChange={setTag}
                placeholder="e.g. hot, q3-target, local"
                aria-label="Tag name"
                onKeyDown={(e) => { if (e.key === "Enter") void handleTag(); }}
              />
              <ApplyButton onClick={handleTag} disabled={loading || !tag.trim()}>
                {loading ? <Loader2 size={12} className="animate-spin inline mr-1" aria-hidden="true" /> : null}
                Tag {count} lead{count !== 1 ? "s" : ""}
              </ApplyButton>
            </div>
          )}

          {open === "cadence" && (
            <div className="space-y-3">
              <div>
                <p className="text-xs font-bold text-[var(--crm-text-2)]">Enroll {count} lead{count !== 1 ? "s" : ""} in drip cadence</p>
                <p className="text-[11px] text-[var(--crm-text-3)] mt-1 leading-relaxed">
                  Queues the 3-step follow-up sequence (day 3, 7, 14). Leads without an email address are skipped.
                </p>
              </div>
              <ApplyButton onClick={handleEnrollCadence} disabled={loading}>
                {loading ? <Loader2 size={12} className="animate-spin inline mr-1" aria-hidden="true" /> : null}
                Enroll {count} lead{count !== 1 ? "s" : ""}
              </ApplyButton>
            </div>
          )}

          {open === "reassign" && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-[var(--crm-text-2)]">Reassign {count} lead{count !== 1 ? "s" : ""}</p>
              <PanelInput
                value={toUserId}
                onChange={setToUserId}
                placeholder="User ID"
                aria-label="User ID to reassign to"
              />
              <PanelInput
                value={toRepName}
                onChange={setToRepName}
                placeholder="Rep display name"
                aria-label="Rep display name"
              />
              <ApplyButton onClick={handleReassign} disabled={loading || !toUserId.trim()}>
                {loading ? <Loader2 size={12} className="animate-spin inline mr-1" aria-hidden="true" /> : null}
                Reassign {count} lead{count !== 1 ? "s" : ""}
              </ApplyButton>
            </div>
          )}
        </div>
      )}

      {/* Main bar */}
      <div
        className="pointer-events-auto flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-2xl shadow-2xl border border-[var(--crm-accent-border)] bg-[var(--crm-surface)] backdrop-blur-sm w-full overflow-x-auto"
        style={H}
        role="toolbar"
        aria-label="Bulk actions"
      >
        {/* Count pill */}
        <span
          className="text-sm font-bold text-[var(--crm-accent-text)] bg-[var(--crm-accent-weak)] px-2.5 py-1 rounded-lg shrink-0"
          aria-live="polite"
        >
          {count} selected
        </span>

        <div className="flex items-center gap-1.5 flex-wrap">
          <BarButton
            onClick={() => togglePanel("stage")}
            active={open === "stage"}
            disabled={loading}
            aria-label="Set pipeline stage"
          >
            <Layers size={11} aria-hidden="true" />
            <span className="hidden sm:inline">Set stage</span>
            <span className="sm:hidden">Stage</span>
            <ChevronDown size={10} className={`transition-transform duration-150 ${open === "stage" ? "rotate-180" : ""}`} aria-hidden="true" />
          </BarButton>

          <BarButton
            onClick={() => togglePanel("followup")}
            active={open === "followup"}
            disabled={loading}
            aria-label="Set follow-up date"
          >
            <Calendar size={11} aria-hidden="true" />
            <span className="hidden sm:inline">Follow-up</span>
            <span className="sm:hidden">Date</span>
            <ChevronDown size={10} className={`transition-transform duration-150 ${open === "followup" ? "rotate-180" : ""}`} aria-hidden="true" />
          </BarButton>

          <BarButton
            onClick={() => togglePanel("tag")}
            active={open === "tag"}
            disabled={loading}
            aria-label="Add tag"
          >
            <Tag size={11} aria-hidden="true" />
            Tag
            <ChevronDown size={10} className={`transition-transform duration-150 ${open === "tag" ? "rotate-180" : ""}`} aria-hidden="true" />
          </BarButton>

          <BarButton
            onClick={() => togglePanel("cadence")}
            active={open === "cadence"}
            disabled={loading}
            aria-label="Enroll in email cadence"
          >
            <GitBranch size={11} aria-hidden="true" />
            <span className="hidden sm:inline">Enroll cadence</span>
            <span className="sm:hidden">Cadence</span>
          </BarButton>

          <BarButton
            onClick={() => togglePanel("reassign")}
            active={open === "reassign"}
            disabled={loading}
            aria-label="Reassign leads"
          >
            <Users size={11} aria-hidden="true" />
            Reassign
            <ChevronDown size={10} className={`transition-transform duration-150 ${open === "reassign" ? "rotate-180" : ""}`} aria-hidden="true" />
          </BarButton>
        </div>

        {loading && (
          <Loader2 size={14} className="animate-spin text-[var(--crm-accent-text)] shrink-0" aria-label="Loading" />
        )}

        <button
          onClick={onClear}
          disabled={loading}
          aria-label="Clear selection"
          className="ml-auto p-1.5 rounded-lg text-[var(--crm-text-3)] hover:text-[var(--crm-text)] hover:bg-[var(--crm-surface-3)] transition-colors disabled:opacity-40 shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[var(--crm-accent)]"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
