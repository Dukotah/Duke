"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Bell,
  Mail,
  MousePointerClick,
  Reply,
  Info,
  CheckCheck,
  X,
} from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  body?: string;
  leadId?: string;
  read: boolean;
  createdAt: string;
}

interface Props {
  onSelectLead: (leadId: string) => void;
}

const H = { fontFamily: "var(--font-heading)" };

const POLL_INTERVAL_MS = 30_000;

function typeIcon(type: string) {
  switch (type) {
    case "email_opened":
      return <Mail size={14} className="text-blue-400 shrink-0" />;
    case "email_clicked":
      return <MousePointerClick size={14} className="text-emerald-500 shrink-0" />;
    case "email_reply":
    case "reply":
      return <Reply size={14} className="text-amber-500 shrink-0" />;
    default:
      return <Info size={14} className="text-[var(--crm-accent)] shrink-0" />;
  }
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationsBell({ onSelectLead }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/crm/notifications");
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) setNotifications(data as Notification[]);
    } catch {
      // silent — don't disrupt the CRM on a failed poll
    }
  }, []);

  // Initial load + polling every 30 s.
  // eslint-disable-next-line react-hooks/set-state-in-effect -- async loader; setState runs after fetch resolves
  useEffect(() => { fetchNotifications(); const id = setInterval(fetchNotifications, POLL_INTERVAL_MS); return () => clearInterval(id); }, [fetchNotifications]);

  // Close panel when clicking outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback(async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await fetch("/api/crm/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {
      // best effort — optimistic update already applied
    }
  }, []);

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch("/api/crm/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "__all__" }),
      });
    } catch {
      // best effort
    }
  }, []);

  const handleNotifClick = useCallback(
    (notif: Notification) => {
      if (!notif.read) markRead(notif.id);
      if (notif.leadId) {
        onSelectLead(notif.leadId);
        setOpen(false);
      }
    },
    [markRead, onSelectLead]
  );

  return (
    <div className="relative" style={H}>
      {/* Bell button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--crm-border)] bg-[var(--crm-surface)] hover:bg-[var(--crm-surface-3)] transition-colors"
      >
        <Bell size={17} className="text-[var(--crm-text-2)]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[var(--crm-accent)] text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-80 max-h-[420px] flex flex-col rounded-2xl border border-[var(--crm-border)] bg-[var(--crm-surface-2)] shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--crm-border)] shrink-0">
            <span className="text-sm font-bold text-[var(--crm-text)]" style={H}>
              Notifications
              {unreadCount > 0 && (
                <span className="ml-1.5 text-xs font-semibold text-[var(--crm-accent-text)]">
                  ({unreadCount})
                </span>
              )}
            </span>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[10px] font-semibold text-[var(--crm-text-3)] hover:text-[var(--crm-accent-text)] transition-colors"
                  style={H}
                >
                  <CheckCheck size={11} />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-[var(--crm-text-3)] hover:text-[var(--crm-text)] transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Bell size={24} className="text-[var(--crm-text-3)]" />
                <p className="text-sm text-[var(--crm-text-3)]" style={H}>
                  No notifications yet
                </p>
              </div>
            ) : (
              <ul>
                {notifications.map((notif) => (
                  <li key={notif.id}>
                    <button
                      onClick={() => handleNotifClick(notif)}
                      className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-[var(--crm-border)] transition-colors last:border-b-0 ${
                        notif.read
                          ? "hover:bg-[var(--crm-surface-3)]"
                          : "bg-[var(--crm-accent-weak)] hover:bg-[var(--crm-surface-3)]"
                      }`}
                    >
                      {/* Icon */}
                      <span className="mt-0.5">{typeIcon(notif.type)}</span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs leading-snug truncate ${
                            notif.read
                              ? "text-[var(--crm-text-2)]"
                              : "text-[var(--crm-text)] font-semibold"
                          }`}
                          style={H}
                        >
                          {notif.title}
                        </p>
                        {notif.body && (
                          <p
                            className="text-[11px] text-[var(--crm-text-3)] mt-0.5 line-clamp-2"
                            style={H}
                          >
                            {notif.body}
                          </p>
                        )}
                        <p className="text-[10px] text-[var(--crm-text-3)] mt-1" style={H}>
                          {relativeTime(notif.createdAt)}
                        </p>
                      </div>

                      {/* Unread dot */}
                      {!notif.read && (
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-[var(--crm-accent)] shrink-0" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
