import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";
import ArticleHeader from "@/components/ArticleHeader";

const TITLE = "How AI Actually Helps a Sonoma County Restaurant (2026)";
const DESCRIPTION =
  "Practical, no-hype AI for Sonoma County restaurants in 2026: stop missing reservation and takeout calls, automate online ordering and review replies, cut no-shows, and clear scheduling busywork.";
const URL = "https://copperbaytech.com/blog/ai-for-restaurants-sonoma-county";

const blogSchema = blogPostingSchema({
  title: TITLE,
  description: DESCRIPTION,
  url: URL,
  datePublished: "2026-06-20",
});

export const metadata: Metadata = {
  title: `${TITLE} | Copper Bay Tech`,
  description: DESCRIPTION,
  keywords:
    "AI for restaurants, restaurant AI phone answering, Sonoma County restaurant technology, AI reservations Petaluma, missed call restaurant, no-show reduction, restaurant review automation Santa Rosa",
  alternates: {
    canonical: URL,
  },
  openGraph: {
    title: `${TITLE} | Copper Bay Tech`,
    description: DESCRIPTION,
    url: URL,
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function Article() {
  return (
    <>
      <JsonLd schema={blogSchema} />
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", url: "https://copperbaytech.com" },
          { name: "Blog", url: "https://copperbaytech.com/blog" },
          { name: "AI for Sonoma County Restaurants" },
        ])}
      />
      <Nav />
      <main>
        <ArticleHeader
          tag="AI &amp; Automation"
          title="How AI Actually Helps a Sonoma County Restaurant (2026)"
          date="June 20, 2026"
          readTime="7 min read"
        />

        <section className="py-12 bg-ink-0">
          <div className="max-w-2xl mx-auto px-6" style={{ fontFamily: "var(--font-body)" }}>
            <p className="text-zinc-300 leading-relaxed mb-5">
              If you run a restaurant in Sonoma County, you already know the problem with most &ldquo;AI for
              restaurants&rdquo; pitches: they&apos;re written by people who have never worked a Saturday rush in
              Healdsburg with a full dining room, a line at the door, and the phone ringing off the hook. The
              honest version is less exciting and a lot more useful. AI won&apos;t cook your food or replace your
              people. What it can do is plug the small, expensive leaks that thin margins and tourist-season chaos
              make worse. Here&apos;s what actually moves the needle in 2026, owner to owner.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Never miss a reservation or takeout call again
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-5">
              This is the big one, and it&apos;s the most overlooked. During service, your phone is the lowest
              priority in the building. A host with a wait list and a POS in their face is not going to drop
              everything to talk a tourist through your wine pairings. So the call goes to voicemail, and the
              caller just books the next place on the highway. Every one of those is a table you paid rent and
              payroll to keep ready, sitting empty.
            </p>
            <p className="text-zinc-300 leading-relaxed mb-5">
              An AI phone answering system picks up every call in your restaurant&apos;s voice, day or night. It can
              answer the questions you get fifty times a day, take a reservation or a takeout order straight onto
              your system, and text a real human the second something is outside its lane. It doesn&apos;t get
              flustered at 7:45 on a Friday. The math is brutal in a good way: if you miss even a handful of
              reservation calls a week and the average check is what it is around here, the lost revenue dwarfs the
              cost. You can{" "}
              <Link
                href="/tools#missed-call"
                className="text-copper-bright underline underline-offset-2 hover:text-copper transition-colors"
              >
                run your own numbers through our missed-call calculator
              </Link>{" "}
              in about thirty seconds.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Online ordering and reservations that run themselves
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-5">
              Most of your bookings and takeout orders should never touch a human at all. Where AI earns its keep
              is in the seams between systems: confirming reservations, sending a text reminder the day before,
              filling a last-minute cancellation from your waitlist, and answering the &ldquo;are you dog
              friendly / do you have a gluten-free menu / is the patio open&rdquo; questions automatically across
              your site, Google, and DMs. Done right, your team only gets pulled in when a guest actually needs a
              person — a big party, a special occasion, a problem. The rest just quietly works.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Cut no-shows on weekend nights
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-5">
              A no-show on a Saturday is a hole you can&apos;t fill at 8pm. Automated, friendly reminders — a text
              the day before and a quick confirm-or-cancel the morning of — meaningfully reduce no-shows without
              you lifting a finger. When someone does cancel, the same system can offer the slot to the next party
              on your waitlist before the table ever goes cold. It&apos;s not magic; it&apos;s just doing the
              follow-up nobody on a busy floor has time to do consistently.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Reviews: more of them, and replies to all of them
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-5">
              In a county this dependent on tourists and weekend drive-ins, your Google and Yelp rating <em>is</em>{" "}
              your reservation funnel. Most happy guests never get asked to review, and most owners are too slammed
              to reply to the ones that come in. AI can prompt the right guest at the right moment and draft a
              thoughtful, on-brand reply to every review — the glowing ones and the one-star ones — for you to
              approve. More five-star reviews, fewer angry comments left hanging in public, and none of it eating
              your one night off.
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              The back-office grind: scheduling, social, and admin
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              The work that eats your post-close evenings is often the most automatable:
            </p>
            <ul className="space-y-2 mb-5 text-zinc-300">
              {[
                "Turning a rough idea of who's available into a draft staff schedule you can adjust, instead of a blank spreadsheet at midnight",
                "Drafting the week's social posts from a photo of tonight's special — for you to glance at and post, not autopilot",
                "Answering routine vendor and staff emails so they're ready to send",
                "A simple assistant trained on your own menu, allergens, and policies, so new hires get answers without interrupting a manager mid-service",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-copper flex-shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              What to be honest about
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-5">
              Not every shiny tool belongs in a restaurant. Be wary of anything that posts to social on full
              autopilot, quotes prices or makes promises without a human checking, or parks your guest data
              somewhere you can&apos;t point to. The rule we use: AI should do one narrow job well, hand off to a
              person the moment it&apos;s unsure, and never invent a fact about your menu or your hours. If you want
              the broader, non-restaurant version of this, we wrote it up in{" "}
              <Link
                href="/blog/how-ai-helps-sonoma-county-small-businesses"
                className="text-copper-bright underline underline-offset-2 hover:text-copper transition-colors"
              >
                how AI actually helps a Sonoma County small business
              </Link>
              .
            </p>

            <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Where to start
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-5">
              Don&apos;t boil the ocean. Start with your biggest leak — for almost every restaurant we work with,
              that&apos;s missed calls during service. Put one piece on it, trained on your real menu and tested
              before it ever talks to a guest, then add the next thing once it&apos;s clearly paying for itself. If
              you want the full lay of the land first, our{" "}
              <Link
                href="/blog/restaurant-technology-guide-sonoma-county"
                className="text-copper-bright underline underline-offset-2 hover:text-copper transition-colors"
              >
                Sonoma County restaurant technology guide
              </Link>{" "}
              walks through the whole stack, and we can fold any of this into ongoing{" "}
              <Link
                href="/it-support-sonoma-county"
                className="text-copper-bright underline underline-offset-2 hover:text-copper transition-colors"
              >
                IT support
              </Link>{" "}
              so there&apos;s one number to call when something breaks at the worst possible time.
            </p>

            <div className="rounded-2xl border border-copper-dim bg-ink-1 p-8 text-center mt-12">
              <p className="text-white font-bold text-lg mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                Curious what AI could win back for your restaurant?
              </p>
              <p className="text-white/60 text-sm mb-5">
                Free, no-jargon call. We&apos;ll find the one leak costing you the most and tell you straight
                whether it&apos;s worth fixing.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full bg-copper px-6 py-3 text-sm font-bold text-ink-0 transition-colors hover:bg-copper-bright"
              >
                Get a free consultation
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
