import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Client Testimonials | Copper Bay Tech — Sonoma County",
  description:
    "Examples of the kind of web design, IT support, and cybersecurity work Copper Bay Tech does for Sonoma County businesses across Petaluma, Santa Rosa, and beyond.",
  alternates: { canonical: "https://copperbaytech.com/testimonials" },
  openGraph: {
    title: "Client Testimonials | Copper Bay Tech",
    description:
      "What Sonoma County business owners say about Copper Bay Tech — web design, IT support, and cybersecurity.",
    url: "https://copperbaytech.com/testimonials",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const testimonials = [
  {
    quote: "Before Copper Bay Tech, our website was embarrassingly slow and half the contact form submissions were going to spam. They rebuilt everything in two weeks — we've already gotten three new inquiries through the site. Best investment I made this year.",
    author: "Maria T.",
    role: "Owner",
    company: "Petaluma Home Staging Co.",
    service: "Web Development",
    stars: 5,
  },
  {
    quote: "I had no idea how exposed we were until they ran a security audit. They found two open ports and outdated firmware on our router that we'd had for years. Fixed it same day, no drama. I sleep better at night knowing someone actually checked.",
    author: "James R.",
    role: "Principal",
    company: "Santa Rosa Insurance Group",
    service: "Cybersecurity",
    stars: 5,
  },
  {
    quote: "We moved our whole office to the cloud and it was seamless. Duke handled everything — setup, staff training, the works. Our team was up and running in a day. The in-person training session made all the difference.",
    author: "Sandra K.",
    role: "Office Manager",
    company: "Sebastopol Family Dental",
    service: "IT Support & Cloud",
    stars: 5,
  },
  {
    quote: "I'd been putting off a website for two years because every quote I got was way too much money. Duke came in, understood exactly what I needed, and built something I'm actually proud of — at a price that made sense for a small shop like mine.",
    author: "Tom H.",
    role: "Owner",
    company: "Bodega Bay Marine Supplies",
    service: "Web Development",
    stars: 5,
  },
  {
    quote: "We had a ransomware scare — nothing got encrypted but it was too close for comfort. Duke came in, found what happened, cleaned it up, and set us up with proper endpoint protection. Responsive, professional, and explained everything clearly.",
    author: "Rachel P.",
    role: "Practice Manager",
    company: "Rohnert Park Physical Therapy",
    service: "Cybersecurity",
    stars: 5,
  },
  {
    quote: "Our old IT company took days to respond to anything. With Copper Bay Tech I text Duke and get a response the same afternoon. It's night and day. We're a 6-person office and actually feel like we have real IT support now.",
    author: "Michael B.",
    role: "Owner",
    company: "Windsor Accounting Group",
    service: "IT Support",
    stars: 5,
  },
  {
    quote: "Duke redesigned our restaurant website and set up online ordering — we saw a 40% increase in pickup orders in the first month. The new site loads fast, looks great on phones, and doesn't break every time we add a special.",
    author: "Lisa N.",
    role: "Owner",
    company: "Cotati Kitchen & Bar",
    service: "Web Development",
    stars: 5,
  },
  {
    quote: "We needed help fast — our server crashed on a Monday morning with clients coming in. Duke had us back up in under three hours. He's since set up automated backups and monitoring so we don't have to worry about it anymore.",
    author: "Carlos M.",
    role: "Managing Partner",
    company: "Healdsburg Law Group",
    service: "IT Support",
    stars: 5,
  },
  {
    quote: "Super knowledgeable, explains things without talking down to you, and actually follows through. Rare combination in IT. We've been with Copper Bay for over a year now and have no plans to change.",
    author: "Diane F.",
    role: "Operations Director",
    company: "Sonoma Valley Winery",
    service: "IT Support & Security",
    stars: 5,
  },
];

const serviceColors: Record<string, string> = {
  "Web Development": "text-blue-400 bg-blue-500/10",
  "Cybersecurity": "text-red-400 bg-red-500/10",
  "IT Support & Cloud": "text-purple-400 bg-purple-500/10",
  "IT Support": "text-purple-400 bg-purple-500/10",
  "IT Support & Security": "text-orange-400 bg-orange-500/10",
};

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-[#18181B] text-white">
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-orange-500/20">
            Client Stories
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            What Sonoma County{" "}
            <span className="text-orange-400">Businesses Say</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Sample stories illustrating the kind of work we do for North Bay businesses — restaurants, dental offices, law firms, insurance agencies, and more.
          </p>
          <div className="mt-6">
            <span className="inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-zinc-400">
              Illustrative sample feedback — not verified client reviews.
            </span>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="break-inside-avoid bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4"
              >
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} size={12} className="text-orange-400 fill-orange-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-zinc-300 text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>

                {/* Author */}
                <div className="pt-2 border-t border-zinc-800 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-white font-semibold text-sm">{t.author}</p>
                    <p className="text-zinc-500 text-xs">{t.role}, {t.company}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex-shrink-0 ${serviceColors[t.service] ?? "text-zinc-400 bg-zinc-800"}`}>
                    {t.service}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-2xl p-8 text-center border border-orange-500/30" style={{ background: "linear-gradient(135deg, #1C1917 0%, #18181B 100%)" }}>
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3">Ready to be next?</p>
            <h2 className="text-white text-2xl font-black mb-3">Let&apos;s solve your tech problems</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
              Free 30-minute consultation. No sales pitch — just a real conversation about your business and what we can actually help with.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/schedule"
                className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm"
              >
                Book a Free Call
              </Link>
              <Link
                href="/#contact"
                className="inline-block bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-8 py-3 rounded-full transition-colors text-sm"
              >
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
