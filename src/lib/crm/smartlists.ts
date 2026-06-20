// Smart Lists — named, persisted filter views (private or team-shared).
// Private lists live in `smartlist:<userId>` (a Redis list of JSON strings).
// Shared/team lists live in `smartlist:shared` (a Redis list of JSON strings).
// Both keys store the full SmartList JSON so getSmartLists can be satisfied with
// two LRANGE calls — no extra index needed.
import { getRedis } from "../redis";

export interface SmartList {
  id: string;
  userId: string;       // owner
  ownerName?: string;   // display name of the owner (for team lists)
  name: string;
  scope: "private" | "team";
  filters: Record<string, string>;
  createdAt: string;
}

const privateKey = (userId: string) => `smartlist:${userId}`;
const SHARED_KEY = "smartlist:shared";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function readList(redis: Awaited<ReturnType<typeof getRedis>>, key: string): Promise<SmartList[]> {
  const items = await redis.lrange(key, 0, -1);
  const out: SmartList[] = [];
  for (const raw of items as unknown[]) {
    try {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (parsed && typeof parsed === "object") out.push(parsed as SmartList);
    } catch {
      /* skip malformed */
    }
  }
  return out;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function createSmartList(
  userId: string,
  data: { name: string; scope: "private" | "team"; filters: Record<string, string>; ownerName?: string }
): Promise<SmartList> {
  const redis = getRedis();
  const list: SmartList = {
    id: crypto.randomUUID(),
    userId,
    ownerName: data.ownerName,
    name: data.name.trim(),
    scope: data.scope,
    filters: data.filters,
    createdAt: new Date().toISOString(),
  };
  const json = JSON.stringify(list);
  const key = data.scope === "team" ? SHARED_KEY : privateKey(userId);
  // Prepend so newest is first when we LRANGE 0 -1
  await redis.lpush(key, json);
  return list;
}

// Returns the requesting user's private lists + all shared team lists.
// Newest-first within each bucket; private lists come first.
export async function getSmartLists(userId: string): Promise<SmartList[]> {
  const redis = getRedis();
  const [priv, shared] = await Promise.all([
    readList(redis, privateKey(userId)),
    readList(redis, SHARED_KEY),
  ]);
  return [...priv, ...shared];
}

// Delete by id. The caller must own the list (same userId).
// Works by reading the list, filtering out the target, then rewriting.
export async function deleteSmartList(userId: string, id: string): Promise<void> {
  const redis = getRedis();

  // Check private list first
  const priv = await readList(redis, privateKey(userId));
  const newPriv = priv.filter((l) => l.id !== id);
  if (newPriv.length !== priv.length) {
    // Found in private — rewrite
    await redis.del(privateKey(userId));
    if (newPriv.length > 0) {
      // Re-push in reverse (oldest first) so LPUSH re-inverts to newest-first
      for (let i = newPriv.length - 1; i >= 0; i--) {
        await redis.rpush(privateKey(userId), JSON.stringify(newPriv[i]));
      }
    }
    return;
  }

  // Check shared list — only owner can delete
  const shared = await readList(redis, SHARED_KEY);
  const target = shared.find((l) => l.id === id);
  if (!target) return; // not found anywhere
  if (target.userId !== userId) return; // not owner — silent no-op

  const newShared = shared.filter((l) => l.id !== id);
  await redis.del(SHARED_KEY);
  if (newShared.length > 0) {
    for (let i = newShared.length - 1; i >= 0; i--) {
      await redis.rpush(SHARED_KEY, JSON.stringify(newShared[i]));
    }
  }
}
