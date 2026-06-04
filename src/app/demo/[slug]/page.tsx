import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getDemo, recordClick } from "@/lib/demo";
import ClaimForm from "./ClaimForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const demo = await getDemo(slug);
  if (!demo) return { title: "Demo | Copper Bay Tech" };
  return {
    title: `Free Website Preview for ${demo.businessName} | Copper Bay Tech`,
    description: `We built a free custom website for ${demo.businessName}. Claim it before someone else does.`,
    robots: { index: false, follow: false },
  };
}

export default async function DemoPage({ params }: Props) {
  const { slug } = await params;
  const demo = await getDemo(slug);
  if (!demo) notFound();

  // Record view on every server render (force-dynamic ensures no caching)
  await recordClick(slug);

  return (
    <div className="min-h-screen bg-[#18181B] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-4">
        <Link
          href="/"
          className="text-sm font-semibold text-white/50 hover:text-white transition-colors"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Copper Bay Tech
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              backgroundColor: "rgba(249,115,22,0.12)",
              color: "#F97316",
              border: "1px solid rgba(249,115,22,0.25)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Free Website Preview
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            We built a site for<br />
            <span style={{ color: "#F97316" }}>{demo.businessName}</span>
          </h1>
          <p
            className="text-lg text-white/60 max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            No pitch, no invoice — just a working website we put together to show
            you what it could look like. It&apos;s yours if you want it.
          </p>
        </div>

        {/* Preview */}
        <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#111113]">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#0D0D0F]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div
              className="flex-1 mx-4 px-3 py-1 rounded-md bg-white/5 text-xs text-white/30 truncate"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {demo.demoUrl.replace(/^https?:\/\//, "")}
            </div>
            <a
              href={demo.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-white/30 hover:text-white/70 transition-colors shrink-0"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <ExternalLink size={12} />
              <span className="hidden sm:inline">Open</span>
            </a>
          </div>

          {demo.screenshotUrl ? (
            /* Screenshot fallback — shown when the site can't be framed */
            <a href={demo.demoUrl} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={demo.screenshotUrl}
                alt={`${demo.businessName} website preview`}
                className="w-full object-cover object-top"
                style={{ maxHeight: "480px" }}
              />
            </a>
          ) : (
            <iframe
              src={demo.demoUrl}
              title={`${demo.businessName} website preview`}
              className="w-full"
              style={{ height: "480px", border: "none" }}
              loading="lazy"
            />
          )}
        </div>

        {/* What's included */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Mobile-first", desc: "Looks perfect on phones and tablets" },
            { label: "Fast load", desc: "Scores 90+ on Google PageSpeed" },
            { label: "SEO ready", desc: "Shows up when locals search for you" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-4 border border-white/[0.07] bg-[#111113]"
            >
              <p
                className="text-sm font-bold text-white mb-1"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {item.label}
              </p>
              <p
                className="text-xs text-white/45"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Claim form */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#111113] p-8 space-y-6">
          <div className="space-y-2">
            <h2
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ready to make it yours?
            </h2>
            <p
              className="text-white/55"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Drop your info below and we&apos;ll reach out within one business day.
              The site is complete — we just need to hand it off.
            </p>
          </div>
          <ClaimForm slug={slug} businessName={demo.businessName} />
        </div>

        {/* Footer note */}
        <p
          className="text-center text-xs text-white/25"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Built by{" "}
          <Link href="/" className="text-white/40 hover:text-white/70 transition-colors">
            Copper Bay Tech
          </Link>
          {" "}— local web design for Sonoma County businesses.
        </p>
      </main>
    </div>
  );
}
