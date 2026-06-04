import { getRedis } from "./redis";
import { SITE_URL } from "@/config/site";

export interface Demo {
  slug: string;
  leadId: string;
  businessName: string;
  demoUrl: string;        // external preview URL from website builder
  screenshotUrl?: string;
  createdAt: string;
  createdBy: string;
  clicks: number;
  firstClickAt?: string;
  claimed: boolean;
  claimedAt?: string;
  claimedName?: string;
  claimedEmail?: string;
  claimedPhone?: string;
}

export function demoTrackingUrl(slug: string): string {
  return `${SITE_URL}/demo/${slug}`;
}

const KEY = (slug: string) => `demo:${slug}`;
const LEAD_KEY = (leadId: string) => `demo:lead:${leadId}`;
const LIST_KEY = "demos:list";

export async function createDemo(
  data: Omit<Demo, "clicks" | "claimed">,
): Promise<Demo> {
  const redis = getRedis();
  const demo: Demo = { ...data, clicks: 0, claimed: false };
  await redis.set(KEY(data.slug), JSON.stringify(demo));
  await redis.set(LEAD_KEY(data.leadId), data.slug);
  await redis.lpush(LIST_KEY, data.slug);
  await redis.ltrim(LIST_KEY, 0, 499);
  return demo;
}

export async function getDemo(slug: string): Promise<Demo | null> {
  const redis = getRedis();
  const raw = (await redis.get(KEY(slug))) as string | null;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Demo;
  } catch {
    return null;
  }
}

export async function recordClick(slug: string): Promise<void> {
  const redis = getRedis();
  const demo = await getDemo(slug);
  if (!demo) return;
  const updated: Demo = {
    ...demo,
    clicks: demo.clicks + 1,
    firstClickAt: demo.firstClickAt ?? new Date().toISOString(),
  };
  await redis.set(KEY(slug), JSON.stringify(updated));
}

export async function recordClaim(
  slug: string,
  name: string,
  email: string,
  phone?: string,
): Promise<void> {
  const redis = getRedis();
  const demo = await getDemo(slug);
  if (!demo) return;
  const updated: Demo = {
    ...demo,
    claimed: true,
    claimedAt: new Date().toISOString(),
    claimedName: name,
    claimedEmail: email,
    ...(phone ? { claimedPhone: phone } : {}),
  };
  await redis.set(KEY(slug), JSON.stringify(updated));
}

export async function getDemoByLeadId(leadId: string): Promise<Demo | null> {
  const redis = getRedis();
  const slug = (await redis.get(LEAD_KEY(leadId))) as string | null;
  if (!slug) return null;
  return getDemo(slug);
}

// Returns demos for given leadIds as a map: leadId → trackingUrl
export async function getDemoUrlsForLeads(
  leadIds: string[],
): Promise<Record<string, string>> {
  if (leadIds.length === 0) return {};
  const redis = getRedis();
  const keys = leadIds.map((id) => LEAD_KEY(id));
  const slugs = (await redis.mget<(string | null)[]>(...keys)) as (string | null)[];
  const result: Record<string, string> = {};
  for (let i = 0; i < leadIds.length; i++) {
    const slug = slugs[i];
    if (slug) result[leadIds[i]] = demoTrackingUrl(slug);
  }
  return result;
}

export async function listDemos(): Promise<Demo[]> {
  const redis = getRedis();
  const slugs = (await redis.lrange(LIST_KEY, 0, 199)) as string[];
  const demos = await Promise.all(slugs.map((s) => getDemo(s)));
  return demos.filter((d): d is Demo => d !== null);
}

export async function deleteDemo(slug: string): Promise<void> {
  const redis = getRedis();
  const demo = await getDemo(slug);
  if (demo) await redis.del(LEAD_KEY(demo.leadId));
  await redis.del(KEY(slug));
}
