// Task management — Redis hash tasks:<userId>
// Each task is stored as a JSON-serialised value keyed by task id.
import { getRedis } from "@/lib/redis";

export type Task = {
  id: string;
  userId: string;
  leadId?: string;
  leadName?: string;
  title: string;
  type: "call" | "email" | "todo";
  dueAt?: string;       // ISO string
  snoozedUntil?: string; // ISO string
  done: boolean;
  createdAt: string;    // ISO string
};

const key = (userId: string) => `tasks:${userId}`;

export async function createTask(
  userId: string,
  data: {
    leadId?: string;
    leadName?: string;
    title: string;
    type?: "call" | "email" | "todo";
    dueAt?: string;
  }
): Promise<Task> {
  const redis = getRedis();
  const task: Task = {
    id: crypto.randomUUID(),
    userId,
    leadId: data.leadId,
    leadName: data.leadName,
    title: data.title.trim(),
    type: data.type ?? "todo",
    dueAt: data.dueAt,
    snoozedUntil: undefined,
    done: false,
    createdAt: new Date().toISOString(),
  };
  await redis.hset(key(userId), { [task.id]: JSON.stringify(task) });
  return task;
}

export async function getTasks(userId: string): Promise<Task[]> {
  const redis = getRedis();
  const raw = await redis.hgetall(key(userId));
  if (!raw) return [];
  return Object.values(raw as Record<string, string>)
    .map((v) => {
      try {
        return JSON.parse(v) as Task;
      } catch {
        return null;
      }
    })
    .filter((t): t is Task => t !== null)
    .sort((a, b) => {
      // Sort by dueAt asc, tasks without dueAt go to the end
      if (a.dueAt && b.dueAt) return a.dueAt.localeCompare(b.dueAt);
      if (a.dueAt) return -1;
      if (b.dueAt) return 1;
      return a.createdAt.localeCompare(b.createdAt);
    });
}

export async function updateTask(
  userId: string,
  id: string,
  patch: Partial<Omit<Task, "id" | "userId" | "createdAt">>
): Promise<void> {
  const redis = getRedis();
  const raw = await redis.hget(key(userId), id);
  if (!raw) return;
  const existing = JSON.parse(raw as string) as Task;
  const updated: Task = { ...existing, ...patch };
  await redis.hset(key(userId), { [id]: JSON.stringify(updated) });
}

export async function deleteTask(userId: string, id: string): Promise<void> {
  const redis = getRedis();
  await redis.hdel(key(userId), id);
}
