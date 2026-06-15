#!/usr/bin/env node
/*
 * winery-crm-import.mjs — add the 10 Sonoma winery demos to the Duke CRM as
 * custom leads and attach their live demo links. Reuses the exact Redis key
 * shapes from src/lib/db.ts (createCustomLead / setLeadPreview / previewKey).
 *
 * Read-only by default; pass --commit to write. --owner <email> picks which
 * user the custom leads are filed under (defaults to the first admin).
 */
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { Redis } from '@upstash/redis';
import { randomUUID } from 'node:crypto';

// --- load .env.local (KEY=VALUE, ignore quotes/exports) ----------------------
try {
  for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
    const m = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!(m[1] in process.env)) process.env[m[1]] = v;
  }
} catch { /* no .env.local — env may be set another way */ }

// Pick a backend: real Upstash when creds exist (production CRM), else the same
// file-backed local store the dev server uses (.local-db.json). Both expose the
// hset/sadd/smembers/hgetall subset this script needs.
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
let redis, TARGET;
if (url && token) {
  redis = new Redis({ url, token });
  TARGET = `Upstash (production) ${url.replace(/^https?:\/\//, '').slice(0, 24)}…`;
} else {
  const FILE = new URL('../.local-db.json', import.meta.url);
  const load = () => (existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : { data: {}, expires: {} });
  const db = load();
  const save = () => writeFileSync(FILE, JSON.stringify(db));
  redis = {
    async smembers(k) { const e = db.data[k]; return e && e.t === 's' ? [...e.v] : []; },
    async hgetall(k) { const e = db.data[k]; return e && e.t === 'h' && Object.keys(e.v).length ? { ...e.v } : null; },
    async hset(k, obj) { const e = db.data[k]; const h = e && e.t === 'h' ? e.v : {}; Object.assign(h, obj); db.data[k] = { t: 'h', v: h }; save(); return Object.keys(obj).length; },
    async sadd(k, ...ms) { const e = db.data[k]; const s = e && e.t === 's' ? e.v : []; let a = 0; for (const m of ms) if (!s.includes(m)) { s.push(m); a++; } db.data[k] = { t: 's', v: s }; save(); return a; },
  };
  TARGET = `LOCAL file store (.local-db.json) — the dev-server CRM only`;
}

const COMMIT = process.argv.includes('--commit');
const ownerFlag = (() => { const i = process.argv.indexOf('--owner'); return i >= 0 ? process.argv[i + 1] : null; })();

const previewKey = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const BASE = 'https://websites-31ql.vercel.app';

// The 10 wineries (name, city used as area, phone, website, slug).
const WINERIES = [
  { name: 'Maboroshi Wine', city: 'Sebastopol', phone: '+17078291216', website: 'http://www.maboroshiwine.com/', slug: 'maboroshi-wine' },
  { name: 'Albini Family Vineyards', city: 'Windsor', phone: '+17078389249', website: 'http://www.albinifamilyvineyards.com', slug: 'albini-family-vineyards' },
  { name: 'Mueller Winery', city: 'Healdsburg', phone: '+17074738086', website: 'http://www.muellerwine.com', slug: 'mueller-winery' },
  { name: 'La Dolce Vita Wine Lounge', city: 'Petaluma', phone: '+17077636363', website: 'http://www.ldvwine.com/', slug: 'la-dolce-vita-wine-lounge' },
  { name: 'CAST Wines', city: 'Geyserville', phone: '+17074311225', website: 'http://www.castwines.com', slug: 'cast-wines' },
  { name: 'Christopher Creek Winery', city: 'Healdsburg', phone: '+17074332001', website: 'http://www.christophercreek.com/', slug: 'christopher-creek-winery' },
  { name: 'Tyge William Cellars', city: 'Sonoma', phone: '+17076088446', website: 'http://tygewilliamcellars.com/', slug: 'tyge-william-cellars' },
  { name: 'Char Vale Vineyards and Winery', city: 'Sebastopol', phone: '+17078276102', website: 'http://www.charvalewinery.com/', slug: 'char-vale-vineyards-and-winery' },
  { name: 'D & L Carinalli Vineyards', city: 'Sebastopol', phone: '+17078232220', website: 'http://www.dlcarinallivineyards.com/', slug: 'd-l-carinalli-vineyards' },
  { name: 'The Meeker Vineyard Tasting Room', city: 'Healdsburg', phone: '+17074312148', website: 'http://www.meekerwine.com/', slug: 'the-meeker-vineyard-tasting-room' },
];

async function main() {
  console.log(`Target: ${TARGET}\n`);
  // 1) Find users + pick the owner (admin).
  const ids = await redis.smembers('users:index');
  const users = [];
  for (const id of ids) { const u = await redis.hgetall(`user:${id}`); if (u) users.push(u); }
  console.log(`Users in CRM (${users.length}):`);
  for (const u of users) console.log(`  ${u.role?.padEnd(5) || '?'} ${u.email}  (id ${u.id})`);

  let owner = ownerFlag ? users.find((u) => u.email?.toLowerCase() === ownerFlag.toLowerCase()) : null;
  if (!owner) owner = users.find((u) => u.role === 'admin') || users[0];
  if (!owner) { console.error('No users found — cannot file custom leads. Is this the right Redis?'); process.exit(1); }
  console.log(`\nOwner for new leads: ${owner.email} (id ${owner.id})${ownerFlag ? '' : ' [auto: first admin]'}`);

  // 2) Existing custom leads for owner + existing previews.
  const existingIds = await redis.smembers(`custom_leads:${owner.id}`);
  const existingLeads = [];
  for (const id of existingIds) { const l = await redis.hgetall(`custom_lead:${id}`); if (l?.name) existingLeads.push(l); }
  const existingByKey = new Map(existingLeads.map((l) => [previewKey(l.name), l]));
  const previews = (await redis.hgetall('lead_previews')) || {};

  console.log(`\nPlan (${COMMIT ? 'COMMIT' : 'dry-run'}):`);
  let toCreate = 0, toLink = 0;
  for (const w of WINERIES) {
    const key = previewKey(w.name);
    const leadExists = existingByKey.has(key);
    const previewExists = key in previews;
    console.log(`  · ${w.name.padEnd(34)} lead:${leadExists ? 'exists' : 'CREATE'}  preview:${previewExists ? 'exists' : 'LINK'}`);
    if (!leadExists) toCreate++;
    if (!previewExists) toLink++;
  }
  console.log(`\n  → would create ${toCreate} lead(s), link ${toLink} preview(s).`);

  if (!COMMIT) { console.log('\nDry-run only. Re-run with --commit to write.'); return; }

  // 3) Write.
  let created = 0, linked = 0;
  for (const w of WINERIES) {
    const key = previewKey(w.name);
    if (!existingByKey.has(key)) {
      const lead = {
        id: randomUUID(), name: w.name, contactName: '', phone: w.phone, email: '',
        website: w.website, city: w.city, county: 'Sonoma', niche: 'Winery',
        notes: `Demo site built ${new Date().toISOString().slice(0, 10)}: ${BASE}/s/${w.slug}`,
        addedBy: owner.id, createdAt: new Date().toISOString(),
      };
      await redis.hset(`custom_lead:${lead.id}`, lead);
      await redis.sadd(`custom_leads:${owner.id}`, lead.id);
      created++;
    }
    const value = {
      previewUrl: `${BASE}/s/${w.slug}`, linkedAt: new Date().toISOString(),
      status: 'ready', category: 'winery', area: w.city, slug: w.slug,
    };
    await redis.hset('lead_previews', { [key]: JSON.stringify(value) });
    linked++;
  }
  console.log(`\n✓ Created ${created} custom lead(s); linked ${linked} demo preview(s) for ${owner.email}.`);
}

main().catch((e) => { console.error(e?.message || e); process.exit(1); });
