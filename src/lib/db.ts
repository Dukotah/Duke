// All database operations. Uses Upstash Redis.
import { getRedis } from "./redis";

// ─── Password hashing (Node crypto, no deps) ──────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, "0")).join("");
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial, 256
  );
  const hashHex = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = Uint8Array.from(saltHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial, 256
  );
  const candidate = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return candidate === hashHex;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "rep";
  commissionRate: number; // e.g. 0.10 = 10%
  createdAt: string;
  active: boolean;
}

export type PublicUser = Omit<User, "passwordHash">;

export interface LeadState {
  status: "new" | "contacted" | "follow_up" | "not_interested" | "won";
  stage: string;
  notes: string;
  lastContacted?: string;
  submittedAt?: string;
  callCount?: number;
  lastOutcome?: string;
}

export interface Submission {
  id: string; // `${userId}:${leadId}`
  userId: string;
  repName: string;
  leadId: string;
  leadName: string;
  leadCity: string;
  leadPhone: string;
  leadEmail: string;
  leadWebsite: string;
  leadTier: string;
  pitch: string;
  repNotes: string;
  estimatedBudget: string;
  status: "pending" | "accepted" | "rejected";
  dealValue?: number;
  commissionAmount?: number;
  commissionPaid?: boolean;
  submittedAt: string;
  resolvedAt?: string;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function createUser(data: Omit<User, "id" | "createdAt">): Promise<User> {
  const redis = getRedis();
  const id = crypto.randomUUID();
  const user: User = { ...data, id, createdAt: new Date().toISOString() };
  await redis.hset(`user:${id}`, user as unknown as Record<string, unknown>);
  await redis.sadd("users:index", id);
  return user;
}

export async function getUserById(id: string): Promise<User | null> {
  const redis = getRedis();
  const u = await redis.hgetall(`user:${id}`);
  if (!u || !u.id) return null;
  return u as unknown as User;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const redis = getRedis();
  const ids = await redis.smembers("users:index");
  for (const id of ids) {
    const u = await getUserById(id as string);
    if (u && u.email.toLowerCase() === email.toLowerCase()) return u;
  }
  return null;
}

export async function listUsers(): Promise<PublicUser[]> {
  const redis = getRedis();
  const ids = await redis.smembers("users:index");
  const users = await Promise.all((ids as string[]).map(getUserById));
  return (users.filter(Boolean) as User[])
    .map(({ passwordHash: _, ...u }) => u);
}

export async function updateUser(id: string, patch: Partial<Omit<User, "id">>): Promise<void> {
  const redis = getRedis();
  await redis.hset(`user:${id}`, patch as Record<string, unknown>);
}

export async function deleteUser(id: string): Promise<void> {
  const redis = getRedis();
  await redis.del(`user:${id}`);
  await redis.srem("users:index", id);
}

// ─── Lead state ───────────────────────────────────────────────────────────────

export async function getLeadState(userId: string, leadId: string): Promise<LeadState | null> {
  const redis = getRedis();
  const s = await redis.hgetall(`lead:${userId}:${leadId}`);
  if (!s || !s.status) return null;
  return s as unknown as LeadState;
}

export async function setLeadState(userId: string, leadId: string, state: Partial<LeadState>): Promise<void> {
  const redis = getRedis();
  await redis.hset(`lead:${userId}:${leadId}`, state as Record<string, unknown>);
}

export async function getAllLeadStates(userId: string): Promise<Record<string, LeadState>> {
  const redis = getRedis();
  const keys = await redis.keys(`lead:${userId}:*`);
  if (!keys.length) return {};
  const result: Record<string, LeadState> = {};
  await Promise.all(
    (keys as string[]).map(async (key) => {
      const leadId = key.replace(`lead:${userId}:`, "");
      const s = await redis.hgetall(key);
      if (s && s.status) result[leadId] = s as unknown as LeadState;
    })
  );
  return result;
}

export async function getUserLeadCount(userId: string): Promise<number> {
  const redis = getRedis();
  const keys = await redis.keys(`lead:${userId}:*`);
  return keys.length;
}

// ─── Submissions ──────────────────────────────────────────────────────────────

export async function createSubmission(data: Omit<Submission, "id" | "status" | "submittedAt">): Promise<Submission> {
  const redis = getRedis();
  const sub: Submission = {
    ...data,
    id: `${data.userId}:${data.leadId}`,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  await redis.hset(`submission:${sub.id}`, sub as unknown as Record<string, unknown>);
  await redis.zadd("submissions:index", { score: Date.now(), member: sub.id });
  // Mark the lead state as submitted
  await setLeadState(data.userId, data.leadId, { submittedAt: sub.submittedAt });
  return sub;
}

export async function listSubmissions(filter?: "pending" | "accepted" | "rejected"): Promise<Submission[]> {
  const redis = getRedis();
  const ids = await redis.zrange("submissions:index", 0, -1, { rev: true });
  const subs = await Promise.all(
    (ids as string[]).map(async (id) => {
      const s = await redis.hgetall(`submission:${id}`);
      return s as unknown as Submission;
    })
  );
  const valid = subs.filter(Boolean);
  if (filter) return valid.filter((s) => s.status === filter);
  return valid;
}

export async function getSubmissionsByUser(userId: string): Promise<Submission[]> {
  const all = await listSubmissions();
  return all.filter((s) => s.userId === userId);
}

export async function resolveSubmission(
  subId: string,
  status: "accepted" | "rejected",
  dealValue?: number
): Promise<Submission> {
  const redis = getRedis();
  const raw = await redis.hgetall(`submission:${subId}`);
  if (!raw) throw new Error("Submission not found");
  const sub = raw as unknown as Submission;

  const user = await getUserById(sub.userId);
  const commissionAmount =
    status === "accepted" && dealValue && user
      ? Math.round(dealValue * user.commissionRate * 100) / 100
      : undefined;

  const updated: Partial<Submission> = {
    status,
    resolvedAt: new Date().toISOString(),
    ...(dealValue !== undefined && { dealValue }),
    ...(commissionAmount !== undefined && { commissionAmount, commissionPaid: false }),
  };

  await redis.hset(`submission:${subId}`, updated as Record<string, unknown>);
  return { ...sub, ...updated };
}

export async function markCommissionPaid(subId: string): Promise<void> {
  const redis = getRedis();
  await redis.hset(`submission:${subId}`, { commissionPaid: true });
}

export async function getRepStats(userId: string) {
  const subs = await getSubmissionsByUser(userId);
  const accepted = subs.filter((s) => s.status === "accepted");
  const pending = accepted.filter((s) => !s.commissionPaid);
  const paid = accepted.filter((s) => s.commissionPaid);
  return {
    totalSubmissions: subs.length,
    accepted: accepted.length,
    rejected: subs.filter((s) => s.status === "rejected").length,
    pendingPayout: pending.reduce((sum, s) => sum + (s.commissionAmount ?? 0), 0),
    totalPaid: paid.reduce((sum, s) => sum + (s.commissionAmount ?? 0), 0),
    totalEarned: accepted.reduce((sum, s) => sum + (s.commissionAmount ?? 0), 0),
  };
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  userId: string;
  name: string;
  email: string;
  submissionsThisMonth: number;
  acceptedThisMonth: number;
  callsThisMonth: number;
  totalEarned: number;
  currentStreak: number;
  rank: number;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const redis = getRedis();
  const users = await listUsers();
  const reps = users.filter((u) => u.role === "rep" && u.active);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  const allSubs = await listSubmissions();

  const entries = await Promise.all(
    reps.map(async (rep) => {
      const repSubs = allSubs.filter((s) => s.userId === rep.id);
      const thisMonthSubs = repSubs.filter((s) => {
        const d = new Date(s.submittedAt);
        return d.getFullYear() === year && d.getMonth() === month;
      });
      const acceptedThisMonth = thisMonthSubs.filter((s) => s.status === "accepted").length;
      const totalEarned = repSubs
        .filter((s) => s.status === "accepted")
        .reduce((sum, s) => sum + (s.commissionAmount ?? 0), 0);

      // Count calls this month from daily Redis keys
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      let callsThisMonth = 0;
      await Promise.all(
        Array.from({ length: daysInMonth }, (_, i) => {
          const day = String(i + 1).padStart(2, "0");
          const monthStr = String(month + 1).padStart(2, "0");
          const dateStr = `${year}-${monthStr}-${day}`;
          return redis.get(`daily:${rep.id}:${dateStr}:calls`).then((v) => {
            callsThisMonth += typeof v === "number" ? v : parseInt(String(v ?? "0"), 10) || 0;
          });
        })
      );

      // Streak: consecutive days with at least 1 call (going back from today)
      let currentStreak = 0;
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const calls = await redis.get(`daily:${rep.id}:${dateStr}:calls`);
        const count = typeof calls === "number" ? calls : parseInt(String(calls ?? "0"), 10) || 0;
        if (count > 0) currentStreak++;
        else break;
      }

      return {
        userId: rep.id,
        name: rep.name,
        email: rep.email,
        submissionsThisMonth: thisMonthSubs.length,
        acceptedThisMonth,
        callsThisMonth,
        totalEarned,
        currentStreak,
        rank: 0,
      };
    })
  );

  // Sort: submissions this month, then calls, then total earned
  entries.sort((a, b) => {
    if (b.submissionsThisMonth !== a.submissionsThisMonth) return b.submissionsThisMonth - a.submissionsThisMonth;
    if (b.callsThisMonth !== a.callsThisMonth) return b.callsThisMonth - a.callsThisMonth;
    return b.totalEarned - a.totalEarned;
  });

  return entries.map((e, i) => ({ ...e, rank: i + 1 }));
}

// ─── Broadcasts ───────────────────────────────────────────────────────────────

export interface Broadcast {
  id: string;
  message: string;
  type: "info" | "success" | "urgent";
  createdAt: string;
  expiresAt: string;
  createdBy: string;
}

export async function createBroadcast(
  message: string,
  type: Broadcast["type"],
  expiresInDays: number,
  createdBy: string
): Promise<Broadcast> {
  const redis = getRedis();
  const id = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000).toISOString();
  const broadcast: Broadcast = { id, message, type, createdAt: now.toISOString(), expiresAt, createdBy };
  await redis.hset(`broadcast:${id}`, broadcast as unknown as Record<string, unknown>);
  await redis.sadd("broadcasts:index", id);
  return broadcast;
}

export async function getActiveBroadcasts(): Promise<Broadcast[]> {
  const redis = getRedis();
  const ids = await redis.smembers("broadcasts:index");
  if (!ids.length) return [];
  const broadcasts = await Promise.all(
    (ids as string[]).map(async (id) => {
      const b = await redis.hgetall(`broadcast:${id}`);
      return b as unknown as Broadcast;
    })
  );
  const now = new Date().toISOString();
  return broadcasts.filter((b) => b && b.id && b.expiresAt > now);
}

export async function deleteBroadcast(id: string): Promise<void> {
  const redis = getRedis();
  await redis.del(`broadcast:${id}`);
  await redis.srem("broadcasts:index", id);
}

// ─── Admin seed ───────────────────────────────────────────────────────────────

export async function ensureAdminExists(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const existing = await getUserByEmail(email);
  if (existing) return;

  await createUser({
    name: "Duke",
    email,
    passwordHash: await hashPassword(password),
    role: "admin",
    commissionRate: 0,
    active: true,
  });
}
