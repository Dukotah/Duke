// Tag management — user-defined labels for leads.
// Redis keys:
//   tags:<userId>         hash  tagId -> JSON(Tag)
//   leadtags:<userId>     hash  leadId -> JSON(string[])   (array of tagIds)
import { getRedis } from "@/lib/redis";

export type Tag = {
  id: string;
  userId: string;
  label: string;
  color: string;
  createdAt: string;
};

const tagKey = (userId: string) => `tags:${userId}`;
const leadTagKey = (userId: string) => `leadtags:${userId}`;

// ─── Tag definitions ──────────────────────────────────────────────────────────

export async function createTag(
  userId: string,
  data: { label: string; color: string }
): Promise<Tag> {
  const redis = getRedis();
  const tag: Tag = {
    id: crypto.randomUUID(),
    userId,
    label: data.label.trim(),
    color: data.color,
    createdAt: new Date().toISOString(),
  };
  await redis.hset(tagKey(userId), { [tag.id]: JSON.stringify(tag) });
  return tag;
}

export async function getTags(userId: string): Promise<Tag[]> {
  const redis = getRedis();
  const raw = await redis.hgetall(tagKey(userId));
  if (!raw) return [];
  return Object.values(raw as Record<string, string>)
    .map((v) => {
      try {
        return JSON.parse(v) as Tag;
      } catch {
        return null;
      }
    })
    .filter((t): t is Tag => t !== null)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function deleteTag(userId: string, id: string): Promise<void> {
  const redis = getRedis();
  // Remove from tag definitions
  await redis.hdel(tagKey(userId), id);
  // Scrub from every lead's tag list
  const raw = await redis.hgetall(leadTagKey(userId));
  if (!raw) return;
  const updates: Record<string, string> = {};
  const removals: string[] = [];
  for (const [leadId, val] of Object.entries(raw as Record<string, string>)) {
    try {
      const ids: string[] = JSON.parse(val);
      const next = ids.filter((tid) => tid !== id);
      if (next.length === 0) {
        removals.push(leadId);
      } else if (next.length !== ids.length) {
        updates[leadId] = JSON.stringify(next);
      }
    } catch {
      // ignore corrupt entries
    }
  }
  if (Object.keys(updates).length > 0) {
    await redis.hset(leadTagKey(userId), updates);
  }
  for (const leadId of removals) {
    await redis.hdel(leadTagKey(userId), leadId);
  }
}

// ─── Lead <-> tag associations ────────────────────────────────────────────────

export async function addLeadTag(
  userId: string,
  leadId: string,
  tagId: string
): Promise<void> {
  const redis = getRedis();
  const raw = await redis.hget(leadTagKey(userId), leadId);
  const existing: string[] = raw
    ? (() => {
        try {
          return JSON.parse(raw as string) as string[];
        } catch {
          return [];
        }
      })()
    : [];
  if (!existing.includes(tagId)) {
    existing.push(tagId);
    await redis.hset(leadTagKey(userId), { [leadId]: JSON.stringify(existing) });
  }
}

export async function removeLeadTag(
  userId: string,
  leadId: string,
  tagId: string
): Promise<void> {
  const redis = getRedis();
  const raw = await redis.hget(leadTagKey(userId), leadId);
  if (!raw) return;
  const existing: string[] = (() => {
    try {
      return JSON.parse(raw as string) as string[];
    } catch {
      return [];
    }
  })();
  const next = existing.filter((tid) => tid !== tagId);
  if (next.length === 0) {
    await redis.hdel(leadTagKey(userId), leadId);
  } else {
    await redis.hset(leadTagKey(userId), { [leadId]: JSON.stringify(next) });
  }
}

export async function getLeadTags(
  userId: string,
  leadId: string
): Promise<Tag[]> {
  const redis = getRedis();
  const [rawIds, rawDefs] = await Promise.all([
    redis.hget(leadTagKey(userId), leadId),
    redis.hgetall(tagKey(userId)),
  ]);
  if (!rawIds) return [];
  const ids: string[] = (() => {
    try {
      return JSON.parse(rawIds as string) as string[];
    } catch {
      return [];
    }
  })();
  if (!rawDefs) return [];
  const defMap = new Map<string, Tag>();
  for (const [, val] of Object.entries(rawDefs as Record<string, string>)) {
    try {
      const t = JSON.parse(val) as Tag;
      defMap.set(t.id, t);
    } catch {
      // skip corrupt
    }
  }
  return ids.map((id) => defMap.get(id)).filter((t): t is Tag => t !== undefined);
}

// Returns { leadId: [tagId, ...] } for all leads — useful for rendering chips
// on lead cards without N+1 fetches.
export async function getAllLeadTagMap(
  userId: string
): Promise<Record<string, string[]>> {
  const redis = getRedis();
  const raw = await redis.hgetall(leadTagKey(userId));
  if (!raw) return {};
  const result: Record<string, string[]> = {};
  for (const [leadId, val] of Object.entries(raw as Record<string, string>)) {
    try {
      result[leadId] = JSON.parse(val) as string[];
    } catch {
      // skip corrupt
    }
  }
  return result;
}
