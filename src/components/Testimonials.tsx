"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    quote:
      "Before Copper Bay Tech, our website was embarrassingly slow and half the contact form submissions were going to spam. They rebuilt everything in two weeks — we've already gotten three new inquiries through the site.",
    author: "Maria T.",
    role: "Owner, Petaluma Home Staging Co.",
    service: "Web Development",
  },
  {
    quote:
      "I had no idea how exposed we were until they ran a security audit. They found two open ports and outdated firmware on our router that we'd had for years. Fixed it same day, no drama.",
    author: "James R.",
    role: "Principal, Santa Rosa Insurance Group",
    service: "Cybersecurity",
  },
  {
    quote:
      "We moved our whole office to the cloud and it was seamless. Duke handled everything — setup, staff training, the works. Our team was up and running in a day.",
    author: "Sandra K.",
    role: "Office Manager, Sebastopol Family Dental",
    service: "IT & Cloud Migration",
  },
  {
    quote:
      "I was dreading the IT side of opening a new location. Duke came in, got our network and point-of-sale running, and explained everything in plain English. Didn't feel like I was being talked down to.",
    author: "Renee M.",
    role: "Owner, Healdsburg Provisions",
    service: "IT Support",
  },
  {
    quote:
      "We'd been burned by a web agency that delivered a template and disappeared. Copper Bay Tech actually built what we asked for, hit the deadline, and has been reachable ever since.",
    author: "Tom V.",
    role: "Principal Broker, Windsor Realty Group",
    service: "Web Development",
  },
];

function StarRow() {
  return (
    <div className="flex items-center gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={15} fill="#F97316" color="#F97316" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#FAFAF9]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest text-[#F97316] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            What clients say
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[#18181B] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Trusted by businesses
            <br className="hidden md:block" /> across Sonoma County
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} fill="#F97316" color="#F97316" />
              ))}
            </div>
            <span
              className="text-sm text-[#3F3F46]/60"
              style={{ fontFamily: "var(--font-body)" }}
            >
              5.0 average from local clients
            </span>
          </div>
        </motion.div>

        {/* Cards — 2-col grid, last card spans 2 cols on md if odd count */}
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((r, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`bg-white rounded-2xl border border-[#18181B]/10 p-8 flex flex-col shadow-sm${
                i === reviews.length - 1 && reviews.length % 2 !== 0
                  ? " md:col-span-2 md:max-w-[calc(50%-12px)] md:mx-auto"
                  : ""
              }`}
            >
              <StarRow />
              <p
                className="flex-1 text-[#3F3F46]/70 leading-relaxed mb-6 text-sm"
                style={{ fontFamily: "var(--font-body)" }}
              >
                &ldquo;{r.quote}&rdquo;
              </p>
              <footer className="flex items-center gap-3 pt-4 border-t border-[#18181B]/8">
                {/* Avatar initial */}
                <div className="w-9 h-9 rounded-full bg-[#18181B] flex items-center justify-center flex-shrink-0">
                  <span
                    className="text-sm font-bold text-[#F97316]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {r.author.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold text-[#18181B] truncate"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {r.author}
                  </p>
                  <p
                    className="text-xs text-[#3F3F46]/40 truncate"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {r.role}
                  </p>
                </div>
                <span
                  className="text-xs font-semibold uppercase tracking-widest text-[#F97316] flex-shrink-0 hidden sm:block"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {r.service}
                </span>
              </footer>
            </motion.blockquote>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-7 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Start your own success story
          </a>
        </motion.div>
      </div>
    </section>
  );
}
