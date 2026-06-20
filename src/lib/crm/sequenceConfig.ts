// Persisted sequence config — admins can override the hardcoded SEQUENCE via
// the Cadence Builder UI. Falls back to the default export from sequences.ts
// when no override has been saved.
import { getRedis } from "@/lib/redis";
import { SEQUENCE, SequenceStep } from "@/lib/crm/sequences";

const CONFIG_KEY = "sequence:config";

export async function getSequenceConfig(): Promise<SequenceStep[]> {
  const redis = getRedis();
  const raw = await redis.get(CONFIG_KEY);
  if (!raw) return SEQUENCE;
  try {
    const parsed = JSON.parse(raw as string) as SequenceStep[];
    if (!Array.isArray(parsed) || parsed.length === 0) return SEQUENCE;
    return parsed;
  } catch {
    return SEQUENCE;
  }
}

export async function saveSequenceConfig(steps: SequenceStep[]): Promise<void> {
  const redis = getRedis();
  await redis.set(CONFIG_KEY, JSON.stringify(steps));
}
