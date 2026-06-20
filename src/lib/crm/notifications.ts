// Notification storage for the in-app notification center.
// Key: notif:<userId>  — Redis list, newest at head, capped at 100 entries.
import { getRedis } from "@/lib/redis";

const CAP = 100;

export interface Notification {
  id: string;
  type: string;
  title: string;
  body?: string;
  leadId?: string;
  read: boolean;
  createdAt: string;
}

// Add a notification for a user. Prepends to the list and trims to CAP.
export async function addNotification(
  userId: string,
  data: { type: string; title: string; body?: string; leadId?: string }
): Promise<Notification> {
  const redis = getRedis();
  const notif: Notification = {
    id: crypto.randomUUID(),
    type: data.type,
    title: data.title,
    ...(data.body ? { body: data.body } : {}),
    ...(data.leadId ? { leadId: data.leadId } : {}),
    read: false,
    createdAt: new Date().toISOString(),
  };
  const key = `notif:${userId}`;
  await redis.lpush(key, JSON.stringify(notif));
  await redis.ltrim(key, 0, CAP - 1);
  return notif;
}

// Get all notifications for a user (newest first).
export async function getNotifications(userId: string): Promise<Notification[]> {
  const redis = getRedis();
  const items = await redis.lrange(`notif:${userId}`, 0, -1);
  return (items as string[]).map((s) => {
    try {
      const parsed = typeof s === "string" ? JSON.parse(s) : s;
      return parsed as Notification;
    } catch {
      return null;
    }
  }).filter(Boolean) as Notification[];
}

// Mark a single notification (by id) or all notifications as read.
export async function markNotificationRead(userId: string, id: string | "__all__"): Promise<void> {
  const redis = getRedis();
  const key = `notif:${userId}`;
  const items = await redis.lrange(key, 0, -1);

  const updated = (items as string[]).map((s) => {
    try {
      const notif = (typeof s === "string" ? JSON.parse(s) : s) as Notification;
      if (id === "__all__" || notif.id === id) {
        return JSON.stringify({ ...notif, read: true });
      }
      return s;
    } catch {
      return s;
    }
  });

  // Replace the list atomically by deleting and re-pushing in reverse order
  // (lpush reverses, so push from the end so newest ends up at head).
  await redis.del(key);
  if (updated.length > 0) {
    // redis.lpush accepts variadic args; push reversed so order is preserved.
    for (let i = updated.length - 1; i >= 0; i--) {
      await redis.lpush(key, updated[i]);
    }
  }
}
