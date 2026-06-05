import fs from "node:fs";
import path from "node:path";

const sm = fs.readFileSync("src/app/sitemap.ts", "utf8");
const paths = new Set(["/"]);
for (const m of sm.matchAll(/\$\{BASE\}(\/[A-Za-z0-9\-/]*)/g)) paths.add(m[1]);
const cityBlock = sm.match(/\[\s*((?:"[a-z-]+",?\s*)+)\]\s*\.map\(\(city\)/s);
if (cityBlock) for (const c of cityBlock[1].matchAll(/"([a-z-]+)"/g)) paths.add("/" + c[1]);
for (const s of sm.matchAll(/slug:\s*"([a-z0-9-]+)"/g)) paths.add("/blog/" + s[1]);

const routes = new Set();
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === "page.tsx") {
      let r = "/" + path.relative("src/app", d).split(path.sep).join("/");
      if (r === "/.") r = "/";
      routes.add(r);
    }
  }
})("src/app");

const excludeOk = new Set(["/crm", "/crm/admin", "/crm/login", "/thank-you", "/report", "/audit", "/assessment"]);
console.log("=== REAL PAGES MISSING FROM SITEMAP ===");
for (const m of [...routes].filter((r) => !paths.has(r)).sort())
  console.log(m + (excludeOk.has(m) ? "   (likely intentional: noindex/utility)" : "   <-- SHOULD ADD"));
console.log("\n=== In sitemap but no matching page (possibly stale) ===");
for (const s of [...paths].filter((p) => !routes.has(p)).sort()) console.log(s);
