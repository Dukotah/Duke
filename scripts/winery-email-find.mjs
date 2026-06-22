#!/usr/bin/env node
/*
 * winery-email-find.mjs — discover each winery's REAL published email from its
 * own website (lowest-bounce source), then MX-verify the domain so we only keep
 * addresses that can actually receive mail. Read-only; prints a report.
 */
import dns from 'node:dns/promises';

const WINERIES = [
  { name: 'Maboroshi Wine', website: 'http://www.maboroshiwine.com/' },
  { name: 'Albini Family Vineyards', website: 'http://www.albinifamilyvineyards.com' },
  { name: 'Mueller Winery', website: 'http://www.muellerwine.com' },
  { name: 'La Dolce Vita Wine Lounge', website: 'http://www.ldvwine.com/' },
  { name: 'CAST Wines', website: 'http://www.castwines.com' },
  { name: 'Christopher Creek Winery', website: 'http://www.christophercreek.com/' },
  { name: 'Tyge William Cellars', website: 'http://tygewilliamcellars.com/' },
  { name: 'Char Vale Vineyards and Winery', website: 'http://www.charvalewinery.com/' },
  { name: 'D & L Carinalli Vineyards', website: 'http://www.dlcarinallivineyards.com/' },
  { name: 'The Meeker Vineyard Tasting Room', website: 'http://www.meekerwine.com/' },
];

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
// junk that looks like an email but isn't a real inbox
const JUNK = /(@2x|@3x|\.(png|jpg|jpeg|gif|webp|svg|css|js)$|sentry|wixpress|example\.|\.local|u003e|domain\.com|email\.com|yourdomain|sentry\.io)/i;
const ROLE = /^(info|contact|hello|sales|admin|office|tastingroom|tasting|wine|winery|events|orders|reservations)@/i;

const hostOf = (u) => { try { return new URL(u).host.replace(/^www\./, ''); } catch { return ''; } };

async function fetchText(url) {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 18000);
    const res = await fetch(url, { signal: ctl.signal, redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (compatible; CopperBayBot/1.0)' } });
    clearTimeout(t);
    if (!res.ok) return '';
    return await res.text();
  } catch { return ''; }
}

function candidatePages(website) {
  const base = website.replace(/\/+$/, '');
  return [website, `${base}/contact`, `${base}/contact-us`, `${base}/about`, `${base}/visit`];
}

async function emailsFromSite(website) {
  const found = new Set();
  for (const url of candidatePages(website)) {
    const html = await fetchText(url);
    if (!html) continue;
    // decode the most common HTML entity obfuscations
    const text = html.replace(/&#64;|&commat;|\s\[at\]\s|\s\(at\)\s/gi, '@').replace(/&#46;|\s\[dot\]\s/gi, '.');
    for (const m of text.matchAll(EMAIL_RE)) {
      const e = m[0].toLowerCase();
      if (!JUNK.test(e)) found.add(e);
    }
    if (found.size) break; // homepage/contact usually enough; stop early
  }
  return [...found];
}

async function mxOk(domain) {
  try { const mx = await dns.resolveMx(domain); return mx && mx.length > 0; }
  catch {
    try { const a = await dns.resolve(domain); return a && a.length > 0; } // A record fallback
    catch { return false; }
  }
}

// Prefer an on-domain address; among those prefer a personal inbox over a role one.
function pickBest(emails, siteHost) {
  const onDomain = emails.filter((e) => e.split('@')[1]?.endsWith(siteHost));
  const pool = onDomain.length ? onDomain : emails;
  const personal = pool.filter((e) => !ROLE.test(e));
  return (personal[0] || pool[0] || null);
}

async function main() {
  console.log('Discovering + MX-verifying winery emails (read-only)\n');
  const results = [];
  for (const w of WINERIES) {
    const siteHost = hostOf(w.website);
    const emails = await emailsFromSite(w.website);
    let best = pickBest(emails, siteHost);
    let mx = false, mxDomain = '';
    if (best) { mxDomain = best.split('@')[1]; mx = await mxOk(mxDomain); }
    const verdict = !best ? 'NONE FOUND' : mx ? 'OK (deliverable)' : 'BAD MX (would bounce)';
    results.push({ name: w.name, best, mx, all: emails, verdict });
    console.log(`${w.name.padEnd(34)} ${verdict.padEnd(22)} ${best || ''}${emails.length > 1 ? `   [also: ${emails.filter((e) => e !== best).join(', ')}]` : ''}`);
  }
  const good = results.filter((r) => r.best && r.mx);
  console.log(`\nDeliverable: ${good.length}/10 · none-found: ${results.filter((r) => !r.best).length} · bad-MX: ${results.filter((r) => r.best && !r.mx).length}`);
  console.log('\nJSON:'); console.log(JSON.stringify(results.map((r) => ({ name: r.name, email: r.best, deliverable: !!(r.best && r.mx) })), null, 0));
}
main();
