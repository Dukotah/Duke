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
      return <Mail size={14} className="text-blue-500 shrink-0" aria-hidden="true" />;
    case "email_clicked":
      return <MousePointerClick size={14} className="text-emerald-500 shrink-0" aria-hidden="true" />;
    case "email_reply":
    case "reply":
      return <Reply size={14} className="text-amber-500 shrink-0" aria-hidden="true" />;
    default:
      return <Info size={14} className="text-[var(--crm-accent-text)] shrink-0" aria-hidden="true" />;
  }
}

function notifTypeLabel(type: string): string {
  switch (type) {
    case "email_opened": return "Email opened";
    case "email_clicked": return "Link clicked";
    case "email_reply":
    case "reply": return "Reply received";
    default: return "Notification";
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

/** Skeleton row for loading state */
function SkeletonNotif() {
  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-[var(--crm-border)] last:border-b-0 animate-pulse">
      <div className="w-3.5 h-3.5 rounded-full bg-[var(--crm-surface-3)] shrink-0 mt-0.5" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 rounded bg-[var(--crm-surface-3)] w-3/4" />
        <div className="h-2.5 rounded bg-[var(--crm-surface-3)] w-1/2" />
        <div className="h-2 rounded bg-[var(--crm-surface-3)] w-1/4" />
      </div>
    </div>
  );
}

export default function NotificationsBell({ onSelectLead }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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
    } finally {
      setInitialLoading(false);
    }
  }, []);

  // Initial load + polling every 30 s. setState is invoked inside the async
  // callback AFTER the fetch resolves, not synchronously in the effect body.
  useEffect(() => {
    void fetchNotifications(); // eslint-disable-line react-hooks/set-state-in-effect
    const id = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  // Close panel when clicking outside; also handle Escape key
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

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
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
        aria-label={`Notifications${unreadCount > 0 ? ` — ${unreadCount} unread` : ""}`}
        aria-haspopup="true"
        aria-expanded={open}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--crm-border)] bg-[var(--crm-surface)] hover:bg-[var(--crm-surface-3)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--crm-accent)] focus-visible:outline-offset-1"
      >
        <Bell size={17} className="text-[var(--crm-text-2)]" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[var(--crm-accent)] text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none"
            aria-hidden="true"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-80 max-h-[480px] flex flex-col rounded-2xl border border-[var(--crm-border)] bg-[var(--crm-surface-2)] shadow-2xl overflow-hidden crm-rise"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--crm-border)] shrink-0 bg-[var(--crm-surface-2)]">
            <span className="text-sm font-bold text-[var(--crm-text)]" style={H}>
              Notifications
              {unreadCount > 0 && (
                <span className="ml-1.5 text-xs font-semibold text-[var(--crm-accent-text)]" aria-hidden="true">
                  ({unreadCount})
                </span>
              )}
            </span>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  aria-label="Mark all notifications as read"
                  className="flex items-center gap-1 text-[10px] font-semibold text-[var(--crm-text-3)] hover:text-[var(--crm-accent-text)] transition-colors px-2 py-1.5 rounded-lg hover:bg-[var(--crm-surface-3)] focus-visible:outline-2 focus-visible:outline-[var(--crm-accent)] min-h-[32px]"
                  style={H}
                >
                  <CheckCheck size={11} aria-hidden="true" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => {
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                aria-label="Close notifications"
                className="p-1.5 rounded-lg text-[var(--crm-text-3)] hover:text-[var(--crm-text)] hover:bg-[var(--crm-surface-3)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--crm-accent)] min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1" role="list" aria-live="polite" aria-label="Notification items">
            {initialLoading ? (
              <>
                <SkeletonNotif />
                <SkeletonNotif />
                <SkeletonNotif />
              </>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3 px-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--crm-surface-3)] flex items-center justify-center">
                  <Bell size={22} className="text-[var(--crm-text-3)]" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--crm-text-2)]" style={H}>
                    All caught up
                  </p>
                  <p className="text-xs text-[var(--crm-text-3)] leading-relaxed" style={H}>
                    Notifications appear here when leads open emails, click links, or reply.
                  </p>
                </div>
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} role="listitem">
                  <button
                    onClick={() => handleNotifClick(notif)}
                    aria-label={`${notifTypeLabel(notif.type)}: ${notif.title}${notif.read ? "" : " (unread)"}${notif.leadId ? " — click to open lead" : ""}`}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-[var(--crm-border)] transition-colors last:border-b-0 focus-visible:outline-2 focus-visible:outline-[var(--crm-accent)] focus-visible:outline-offset-[-2px] ${
                      notif.read
                        ? "hover:bg-[var(--crm-surface-3)]"
                        : "bg-[var(--crm-accent-weak)] hover:bg-[var(--crm-surface-3)]"
                    }`}
                  >
                    {/* Icon */}
                    <span className="mt-0.5 shrink-0">{typeIcon(notif.type)}</span>

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
                          className="text-[11px] text-[var(--crm-text-3)] mt-0.5 line-clamp-2 leading-relaxed"
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
                      <span
                        className="mt-1.5 w-2 h-2 rounded-full bg-[var(--crm-accent)] shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
