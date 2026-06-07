#!/usr/bin/env node
/**
 * clear-website-links.mjs — remove all data created by the website-link sync.
 *
 * Deletes every `demolink:*` key (demo URLs attached to leads) and every
 * lead owned by the synthetic `website` owner (leads auto-created from the
 * manifest). Safe to run repeatedly. Reads Upstash creds from .env.local.
 *
 * Usage: node scripts/clear-website-links.mjs
 */
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Redis } from "@upstash/redis";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function readEnv(src, key) {
  const m = src.match(new RegExp(`^${key}=(.*)$`, "m"));
  return m ? m[1].trim().replace(/^"|"$/g, "") : "";
}

const env = await readFile(join(ROOT, ".env.local"), "utf8");
const redis = new Redis({
  url: readEnv(env, "UPSTASH_REDIS_REST_URL"),
  token: readEnv(env, "UPSTASH_REDIS_REST_TOKEN"),
});

const WEBSITE_OWNER = "website";

const demoKeys = await redis.keys("demolink:*");
for (const k of demoKeys) await redis.del(k);

const overrideKeys = await redis.keys("emailoverride:*");
for (const k of overrideKeys) await redis.del(k);

const leadIds = await redis.smembers(`custom_leads:${WEBSITE_OWNER}`);
for (const id of leadIds) await redis.del(`custom_lead:${id}`);
if (leadIds.length) await redis.del(`custom_leads:${WEBSITE_OWNER}`);

console.log(
  `Cleared ${demoKeys.length} demo-link(s), ${overrideKeys.length} email override(s), and ${leadIds.length} website lead(s).`,
);
