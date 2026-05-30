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
    <section className="py-24 px-6 bg-[#18181B]">
      <div className="max-w-3xl mx-auto text-center">
        <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
          Free Tool
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
          Is Your Website<br className="hidden sm:block" />{" "}
          <span className="text-orange-400">Losing You Business?</span>
        </h2>
        <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
          53% of visitors leave a site that takes more than 3 seconds to load.
          Check your score in 15 seconds — free, no signup.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourwebsite.com"
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-5 py-3.5 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors text-sm"
          />
          <button
            type="submit"
            disabled={!url.trim()}
            className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-7 py-3.5 rounded-full transition-colors text-sm whitespace-nowrap"
          >
            Check My Site
          </button>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-zinc-500">
          <span>✓ Google PageSpeed powered</span>
          <span>✓ Core Web Vitals included</span>
          <span>✓ No email required</span>
        </div>
      </div>
    </section>
  );
}
