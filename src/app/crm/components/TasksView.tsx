"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  CheckCircle2, Circle, Clock, Trash2, Pencil, AlarmClock,
  ChevronRight, Plus, Phone, Mail, ClipboardList,
  AlertTriangle, RefreshCw, CheckCheck,
} from "lucide-react";

// Mirrors src/lib/crm/tasks.ts Task type
interface Task {
  id: string;
  userId: string;
  leadId?: string;
  leadName?: string;
  title: string;
  type: "call" | "email" | "todo";
  dueAt?: string;
  snoozedUntil?: string;
  done: boolean;
  createdAt: string;
}

interface Props {
  onSelectLead: (leadId: string) => void;
}

const H = { fontFamily: "var(--font-heading)" };

const TYPE_META: Record<Task["type"], { icon: React.ElementType; label: string; color: string }> = {
  call:  { icon: Phone,         label: "Call",  color: "text-blue-500" },
  email: { icon: Mail,          label: "Email", color: "text-[var(--crm-accent-text)]" },
  todo:  { icon: ClipboardList, label: "Todo",  color: "text-[var(--crm-text-3)]" },
};

const SNOOZE_OPTIONS = [
  { label: "1 day",    days: 1 },
  { label: "3 days",   days: 3 },
  { label: "1 week",   days: 7 },
];

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}

function isOverdue(task: Task, nowMs: number): boolean {
  if (!task.dueAt) return false;
  return new Date(task.dueAt).getTime() < nowMs;
}

function isToday(task: Task, todayStr: string): boolean {
  if (!task.dueAt) return false;
  return task.dueAt.slice(0, 10) === todayStr;
}

function isSnoozed(task: Task, nowMs: number): boolean {
  if (!task.snoozedUntil) return false;
  return new Date(task.snoozedUntil).getTime() > nowMs;
}

function relativeTime(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(diff);
  const mins = Math.floor(abs / 60_000);
  const hrs = Math.floor(abs / 3_600_000);
  const days = Math.floor(abs / 86_400_000);
  const past = diff < 0;
  if (days >= 1) return past ? `${days}d ago` : `in ${days}d`;
  if (hrs >= 1)  return past ? `${hrs}h ago`  : `in ${hrs}h`;
  if (mins >= 1) return past ? `${mins}m ago` : `in ${mins}m`;
  return past ? "just now" : "soon";
}

export default function TasksView({ onSelectLead }: Props) {
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [editTitle, setEditTitle]   = useState("");
  const [snoozeOpenId, setSnoozeOpenId] = useState<string | null>(null);
  const [busy, setBusy]       = useState<string | null>(null);

  // Quick-add state
  const [addTitle, setAddTitle] = useState("");
  const [addType, setAddType]   = useState<Task["type"]>("todo");
  const [adding, setAdding]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/crm/tasks");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { load(); }, [load]);

  // eslint-disable-next-line react-hooks/purity -- wall-clock read is intentional; not component state
  const nowMs    = Date.now();
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Partition visible (not snoozed) tasks
  const { overdue, today, upcoming } = useMemo(() => {
    const visible = tasks.filter((t) => !isSnoozed(t, nowMs));
    return {
      overdue:  visible.filter((t) => isOverdue(t, nowMs) && !isToday(t, todayStr)),
      today:    visible.filter((t) => isToday(t, todayStr) || (!t.dueAt && !isOverdue(t, nowMs))),
      upcoming: visible.filter((t) => t.dueAt && !isOverdue(t, nowMs) && !isToday(t, todayStr)),
    };
  }, [tasks, nowMs, todayStr]);

  // Complete a task
  const complete = useCallback(async (id: string) => {
    setBusy(id);
    try {
      await fetch("/api/crm/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, done: true }),
      });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch { /* silent */ }
    setBusy(null);
  }, []);

  // Snooze a task
  const snooze = useCallback(async (id: string, days: number) => {
    setBusy(id);
    setSnoozeOpenId(null);
    try {
      const snoozedUntil = addDays(days);
      await fetch("/api/crm/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, snoozedUntil }),
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, snoozedUntil } : t))
      );
    } catch { /* silent */ }
    setBusy(null);
  }, []);

  // Delete a task
  const remove = useCallback(async (id: string) => {
    setBusy(id);
    try {
      await fetch(`/api/crm/tasks?id=${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch { /* silent */ }
    setBusy(null);
  }, []);

  // Save title edit
  const saveEdit = useCallback(async (id: string) => {
    if (!editTitle.trim()) { setEditingId(null); return; }
    try {
      await fetch("/api/crm/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: editTitle.trim() }),
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title: editTitle.trim() } : t))
      );
    } catch { /* silent */ }
    setEditingId(null);
  }, [editTitle]);

  // Quick-add
  const addTask = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addTitle.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/crm/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: addTitle.trim(), type: addType }),
      });
      if (res.ok) {
        const task = await res.json();
        setTasks((prev) => [...prev, task]);
        setAddTitle("");
      }
    } catch { /* silent */ }
    setAdding(false);
  }, [addTitle, addType]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-20">
        <div className="w-7 h-7 border-2 border-[var(--crm-accent)] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[var(--crm-text-3)]" style={H}>Loading tasks…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <AlertTriangle size={26} className="text-red-400/70" />
        <p className="text-sm text-[var(--crm-text-2)]" style={H}>{error}</p>
        <button onClick={load} className="inline-flex items-center gap-1.5 text-xs text-[var(--crm-accent-text)] hover:opacity-80" style={H}>
          <RefreshCw size={11} />Try again
        </button>
      </div>
    );
  }

  const totalVisible = overdue.length + today.length + upcoming.length;

  return (
    <div className="space-y-5" style={H}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--crm-text)]">Tasks</h2>
          <p className="text-xs text-[var(--crm-text-3)] mt-0.5">
            {totalVisible === 0
              ? "Nothing open — nice work!"
              : `${totalVisible} open task${totalVisible !== 1 ? "s" : ""}${overdue.length > 0 ? ` · ${overdue.length} overdue` : ""}`}
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--crm-text-3)] hover:text-[var(--crm-text-2)] transition-colors"
        >
          <RefreshCw size={11} />Refresh
        </button>
      </div>

      {/* Quick-add form */}
      <form
        onSubmit={addTask}
        className="flex gap-2 bg-[var(--crm-surface)] border border-[var(--crm-border)] rounded-2xl px-4 py-3"
      >
        <select
          value={addType}
          onChange={(e) => setAddType(e.target.value as Task["type"])}
          className="text-xs font-semibold text-[var(--crm-text-2)] bg-[var(--crm-surface-2)] border border-[var(--crm-border)] rounded-lg px-2 py-1.5 shrink-0 focus:outline-none"
        >
          <option value="todo">Todo</option>
          <option value="call">Call</option>
          <option value="email">Email</option>
        </select>
        <input
          type="text"
          value={addTitle}
          onChange={(e) => setAddTitle(e.target.value)}
          placeholder="Add a task…"
          className="flex-1 text-sm bg-transparent text-[var(--crm-text)] placeholder-[var(--crm-text-3)] focus:outline-none min-w-0"
        />
        <button
          type="submit"
          disabled={adding || !addTitle.trim()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-40"
          style={{ backgroundColor: "var(--crm-accent)" }}
        >
          <Plus size={12} />Add
        </button>
      </form>

      {/* Empty state */}
      {totalVisible === 0 && (
        <div className="text-center py-16">
          <CheckCheck size={32} className="text-emerald-400/40 mx-auto mb-3" />
          <p className="text-[var(--crm-text-2)] font-semibold">All clear!</p>
          <p className="text-sm text-[var(--crm-text-3)] mt-1">Add a task above to get started.</p>
        </div>
      )}

      {/* Overdue */}
      {overdue.length > 0 && (
        <TaskGroup
          label="Overdue"
          accent="text-red-500"
          tasks={overdue}
          busy={busy}
          editingId={editingId}
          editTitle={editTitle}
          snoozeOpenId={snoozeOpenId}
          onComplete={complete}
          onSnooze={snooze}
          onDelete={remove}
          onEditStart={(t) => { setEditingId(t.id); setEditTitle(t.title); }}
          onEditChange={setEditTitle}
          onEditSave={saveEdit}
          onEditCancel={() => setEditingId(null)}
          onSnoozeToggle={(id) => setSnoozeOpenId((prev) => (prev === id ? null : id))}
          onSelectLead={onSelectLead}
        />
      )}

      {/* Today */}
      {today.length > 0 && (
        <TaskGroup
          label="Today"
          accent="text-amber-500"
          tasks={today}
          busy={busy}
          editingId={editingId}
          editTitle={editTitle}
          snoozeOpenId={snoozeOpenId}
          onComplete={complete}
          onSnooze={snooze}
          onDelete={remove}
          onEditStart={(t) => { setEditingId(t.id); setEditTitle(t.title); }}
          onEditChange={setEditTitle}
          onEditSave={saveEdit}
          onEditCancel={() => setEditingId(null)}
          onSnoozeToggle={(id) => setSnoozeOpenId((prev) => (prev === id ? null : id))}
          onSelectLead={onSelectLead}
        />
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <TaskGroup
          label="Upcoming"
          accent="text-[var(--crm-text-2)]"
          tasks={upcoming}
          busy={busy}
          editingId={editingId}
          editTitle={editTitle}
          snoozeOpenId={snoozeOpenId}
          onComplete={complete}
          onSnooze={snooze}
          onDelete={remove}
          onEditStart={(t) => { setEditingId(t.id); setEditTitle(t.title); }}
          onEditChange={setEditTitle}
          onEditSave={saveEdit}
          onEditCancel={() => setEditingId(null)}
          onSnoozeToggle={(id) => setSnoozeOpenId((prev) => (prev === id ? null : id))}
          onSelectLead={onSelectLead}
        />
      )}
    </div>
  );
}

// ─── TaskGroup ────────────────────────────────────────────────────────────────

interface TaskGroupProps {
  label: string;
  accent: string;
  tasks: Task[];
  busy: string | null;
  editingId: string | null;
  editTitle: string;
  snoozeOpenId: string | null;
  onComplete: (id: string) => void;
  onSnooze: (id: string, days: number) => void;
  onDelete: (id: string) => void;
  onEditStart: (t: Task) => void;
  onEditChange: (v: string) => void;
  onEditSave: (id: string) => void;
  onEditCancel: () => void;
  onSnoozeToggle: (id: string) => void;
  onSelectLead: (leadId: string) => void;
}

function TaskGroup({
  label, accent, tasks, busy, editingId, editTitle, snoozeOpenId,
  onComplete, onSnooze, onDelete, onEditStart, onEditChange,
  onEditSave, onEditCancel, onSnoozeToggle, onSelectLead,
}: TaskGroupProps) {
  return (
    <div>
      <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${accent}`} style={H}>
        {label} <span className="opacity-60 font-semibold normal-case tracking-normal ml-1">{tasks.length}</span>
      </p>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isBusy={busy === task.id}
            isEditing={editingId === task.id}
            editTitle={editTitle}
            snoozeOpen={snoozeOpenId === task.id}
            onComplete={onComplete}
            onSnooze={onSnooze}
            onDelete={onDelete}
            onEditStart={onEditStart}
            onEditChange={onEditChange}
            onEditSave={onEditSave}
            onEditCancel={onEditCancel}
            onSnoozeToggle={onSnoozeToggle}
            onSelectLead={onSelectLead}
          />
        ))}
      </div>
    </div>
  );
}

// ─── TaskCard ─────────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: Task;
  isBusy: boolean;
  isEditing: boolean;
  editTitle: string;
  snoozeOpen: boolean;
  onComplete: (id: string) => void;
  onSnooze: (id: string, days: number) => void;
  onDelete: (id: string) => void;
  onEditStart: (t: Task) => void;
  onEditChange: (v: string) => void;
  onEditSave: (id: string) => void;
  onEditCancel: () => void;
  onSnoozeToggle: (id: string) => void;
  onSelectLead: (leadId: string) => void;
}

function TaskCard({
  task, isBusy, isEditing, editTitle, snoozeOpen,
  onComplete, onSnooze, onDelete, onEditStart, onEditChange,
  onEditSave, onEditCancel, onSnoozeToggle, onSelectLead,
}: TaskCardProps) {
  const meta = TYPE_META[task.type];
  const TypeIcon = meta.icon;

  return (
    <div
      className={`rounded-2xl border border-[var(--crm-border)] bg-[var(--crm-surface)] transition-opacity ${isBusy ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Complete button */}
        <button
          onClick={() => onComplete(task.id)}
          className="mt-0.5 shrink-0 text-[var(--crm-text-3)] hover:text-emerald-500 transition-colors"
          title="Mark complete"
        >
          <Circle size={18} />
        </button>

        {/* Body */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => onEditChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onEditSave(task.id);
                  if (e.key === "Escape") onEditCancel();
                }}
                className="flex-1 text-sm bg-[var(--crm-surface-2)] border border-[var(--crm-border)] rounded-lg px-2 py-1 text-[var(--crm-text)] focus:outline-none focus:border-[var(--crm-accent)]"
              />
              <button
                onClick={() => onEditSave(task.id)}
                className="text-xs font-semibold text-emerald-500 hover:opacity-80"
              >Save</button>
              <button
                onClick={onEditCancel}
                className="text-xs text-[var(--crm-text-3)] hover:opacity-80"
              >Cancel</button>
            </div>
          ) : (
            <p className="text-sm font-semibold text-[var(--crm-text)] leading-snug">{task.title}</p>
          )}

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {/* Type badge */}
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${meta.color}`}>
              <TypeIcon size={10} />{meta.label}
            </span>

            {/* Due time */}
            {task.dueAt && (
              <span className="inline-flex items-center gap-1 text-[10px] text-[var(--crm-text-3)]">
                <Clock size={9} />{relativeTime(task.dueAt)}
              </span>
            )}

            {/* Lead link */}
            {task.leadId && (
              <button
                onClick={() => onSelectLead(task.leadId!)}
                className="inline-flex items-center gap-1 text-[10px] text-[var(--crm-accent-text)] hover:opacity-80 transition-opacity"
              >
                <ChevronRight size={9} />
                {task.leadName ?? task.leadId}
              </button>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          {/* Snooze */}
          <div className="relative">
            <button
              onClick={() => onSnoozeToggle(task.id)}
              className="p-1.5 rounded-lg text-[var(--crm-text-3)] hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
              title="Snooze"
            >
              <AlarmClock size={14} />
            </button>
            {snoozeOpen && (
              <div className="absolute right-0 top-full mt-1 z-20 bg-[var(--crm-surface-2)] border border-[var(--crm-border)] rounded-xl shadow-lg py-1 min-w-[110px]">
                {SNOOZE_OPTIONS.map((opt) => (
                  <button
                    key={opt.days}
                    onClick={() => onSnooze(task.id, opt.days)}
                    className="w-full text-left px-3 py-1.5 text-xs text-[var(--crm-text-2)] hover:bg-[var(--crm-surface-3)] hover:text-[var(--crm-text)] transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Edit */}
          <button
            onClick={() => onEditStart(task)}
            className="p-1.5 rounded-lg text-[var(--crm-text-3)] hover:text-[var(--crm-text)] hover:bg-[var(--crm-surface-3)] transition-colors"
            title="Edit"
          >
            <Pencil size={14} />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-lg text-[var(--crm-text-3)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>

          {/* Complete shortcut — right-hand side for quick tap */}
          <button
            onClick={() => onComplete(task.id)}
            className="p-1.5 rounded-lg text-[var(--crm-text-3)] hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors"
            title="Complete"
          >
            <CheckCircle2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
