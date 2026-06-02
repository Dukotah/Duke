import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home, Phone } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { PHONE, PHONE_HREF } from "@/config/site";

export const metadata: Metadata = {
  title: "Page Not Found | Copper Bay Tech",
  robots: { index: false, follow: true },
};

const popularLinks = [
  { label: "Web Design", href: "/web-design-sonoma-county" },
  { label: "IT Support", href: "/it-support-sonoma-county" },
  { label: "Cybersecurity", href: "/cybersecurity-small-business" },
  { label: "Pricing", href: "/pricing" },
  { label: "Our Work", href: "/work" },
  { label: "Resources", href: "/blog" },
];

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#18181B] px-6 py-32">
        {/* Ambient glow to match the hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(249,115,22,0.16) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 mx-auto max-w-xl text-center">
          <p
            className="mb-5 text-[7rem] font-bold leading-none tracking-tight text-transparent md:text-[9rem]"
            style={{
              fontFamily: "var(--font-heading)",
              backgroundImage: "linear-gradient(to right, #F97316, #fbb46a)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            404
          </p>
          <h1
            className="mb-4 text-3xl font-bold text-white md:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            This page took a wrong turn.
          </h1>
          <p
            className="mx-auto mb-10 max-w-md text-pretty text-white/60"
            style={{ fontFamily: "var(--font-body)" }}
          >
            The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s
            get you back on track.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#F97316] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#F97316]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ea6c0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B] sm:w-auto"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <Home size={16} />
              Back to home
            </Link>
            <a
              href={PHONE_HREF}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B] sm:w-auto"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <Phone size={15} className="text-[#F97316]" />
              {PHONE}
            </a>
          </div>

          {/* Popular destinations */}
          <div className="mt-12 border-t border-white/10 pt-8">
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/40"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Popular pages
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {popularLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group inline-flex items-center gap-1 text-sm text-white/65 transition-colors hover:text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {l.label}
                  <ArrowRight size={13} className="text-white/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#F97316]" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
