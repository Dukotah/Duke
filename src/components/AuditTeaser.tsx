"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuditTeaser() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    const encoded = encodeURIComponent(url.trim());
    router.push(`/audit?url=${encoded}`);
  }

  return (
    <section className="py-24 px-6 bg-ink-0">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block bg-copper/10 text-copper-bright text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-copper-dim">
          Free Tool
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Is Your Website<br className="hidden sm:block" />{" "}
          <span className="text-copper-bright">Losing You Business?</span>
        </h2>
        <p className="text-lg mb-10 max-w-xl mx-auto text-zinc-400">
          53% of visitors leave a site that takes more than 3 seconds to load.
          Check your score in 15 seconds — free, no signup.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <label htmlFor="audit-url-input" className="sr-only">Website URL</label>
          <input
            id="audit-url-input"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourwebsite.com"
            className="flex-1 bg-ink-2 border border-hairline rounded-full px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-copper focus:ring-copper focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0 transition-colors text-sm"
          />
          <button
            type="submit"
            disabled={!url.trim()}
            className="bg-copper hover:bg-copper-bright disabled:opacity-50 disabled:cursor-not-allowed text-ink-0 font-bold px-7 py-3.5 rounded-full transition-colors text-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ink-0"
          >
            Check My Site
          </button>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs" style={{ color: "#71717A" }}>
          <span><span aria-hidden="true">✓</span> Google PageSpeed powered</span>
          <span><span aria-hidden="true">✓</span> Core Web Vitals included</span>
          <span><span aria-hidden="true">✓</span> No email required</span>
        </div>
      </div>
    </section>
  );
}
