import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import BlogEmailCapture from "@/components/BlogEmailCapture";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "How to Set Up and Optimize Your Google Business Profile in Sonoma County | Copper Bay Tech",
  description:
    "A step-by-step guide to claiming, verifying, and optimizing your Google Business Profile so Sonoma County customers can find you in Google Maps and local search.",
  openGraph: {
    url: "https://copperbaytech.com/blog/google-business-profile-setup-sonoma-county",
  },
};

const steps = [
  {
    num: "01",
    title: "Claim or create your profile",
    body: "Go to business.google.com and search for your business name. If it exists (Google may have auto-created a listing), claim it. If not, create a new one. Use your exact legal business name — consistency matters for SEO.",
  },
  {
    num: "02",
    title: "Verify your listing",
    body: "Google will send a postcard to your business address with a verification code (usually arrives in 5–14 days). Some businesses qualify for phone or email verification. Until you verify, your listing won't show up prominently in search.",
  },
  {
    num: "03",
    title: "Fill in every field completely",
    body: "Don't skip anything. Business hours, phone number, website URL, service area, business description (up to 750 characters), and attributes (like 'wheelchair accessible' or 'free Wi-Fi'). Incomplete profiles rank lower — Google rewards completeness.",
  },
  {
    num: "04",
    title: "Choose the right primary category",
    body: "Your primary category is the most important ranking factor. Be specific: 'Italian Restaurant' beats 'Restaurant.' You can add secondary categories too. Browse Google's category list and pick the most accurate option for your main service.",
  },
  {
    num: "05",
    title: "Add high-quality photos",
    body: "Businesses with photos get 42% more requests for directions and 35% more website clicks. Add your exterior (so customers recognize you), interior, team, and product/service photos. Aim for at least 10 photos. Update them regularly — Google notices freshness.",
  },
  {
    num: "06",
    title: "Actively collect reviews",
    body: "Reviews are the single biggest factor in local rankings after proximity. Ask every satisfied customer directly — not with a mass email, but one-on-one. Get your Google review link (in your GBP dashboard under 'Get more reviews') and text it to customers the same day as service.",
  },
  {
    num: "07",
    title: "Post weekly updates",
    body: "GBP posts (offers, events, updates) show up in your listing and signal to Google that you're active. One post per week takes 5 minutes and makes your profile look current. Highlight seasonal promotions, new services, or simple tips relevant to your industry.",
  },
];

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "How to Set Up and Optimize Your Google Business Profile in Sonoma County", description: "A step-by-step guide to claiming, verifying, and optimizing your Google Business Profile so Sonoma County customers can find you in Google Maps and local search.", url: "https://copperbaytech.com/blog/google-business-profile-setup-sonoma-county", datePublished: "2026-06-01" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "Google Business Profile Setup Sonoma" }])} />
      <Nav />
      <main>
        <section className="pt-32 pb-8 bg-[#18181B]">
          <div className="max-w-2xl mx-auto px-6">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              <ArrowLeft size={14} /> All Resources
            </Link>
            <span className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: "rgba(249,115,22,0.15)", color: "#F97316", fontFamily: "var(--font-heading)" }}>
              Local SEO
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              How to Set Up and Optimize Your Google Business Profile in Sonoma County
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-body)" }}>6 min read · June 2026</p>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-6" style={{ fontFamily: "var(--font-body)" }}>
            <p className="text-lg text-[#3F3F46]/70 mb-6 leading-relaxed">
              If a Petaluma resident searches &quot;plumber near me&quot; or &quot;wine tasting in Healdsburg,&quot; the first thing they see is the Google Map Pack — three local businesses displayed with ratings, hours, and directions. Getting into that pack is one of the highest-ROI things a local business can do. Your Google Business Profile (GBP) is how you get there.
            </p>
            <p className="text-[#3F3F46]/70 mb-10 leading-relaxed">
              Most businesses either haven&apos;t claimed their profile, or they have a half-complete listing sitting there making them look unprofessional. Here&apos;s how to do it right.
            </p>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Why Google Business Profile matters
            </h2>
            <p className="text-[#3F3F46]/70 mb-6 leading-relaxed">
              Nearly half of all Google searches have local intent — people looking for things near them. Google Business Profile is how Google decides which local businesses to show for those searches. It&apos;s free, it feeds directly into Google Maps, and it works especially well for service-area businesses in places like Santa Rosa, Sebastopol, Sonoma, and Windsor.
            </p>
            <p className="text-[#3F3F46]/70 mb-10 leading-relaxed">
              A well-optimized profile can generate more leads than a mediocre website. And unlike paid ads, once you set it up and earn reviews, the leads keep coming without ongoing ad spend.
            </p>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Step-by-step setup and optimization
            </h2>

            <div className="space-y-8 mb-10">
              {steps.map((step) => (
                <div key={step.num} className="flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[#18181B] flex items-center justify-center">
                      <span className="text-sm font-bold text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>{step.num}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#18181B] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{step.title}</h3>
                    <p className="text-sm text-[#3F3F46]/70 leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Sonoma County-specific tips
            </h2>
            <ul className="space-y-3 mb-10">
              {[
                "Set your service area to include all cities you serve — Petaluma, Santa Rosa, Sebastopol, Rohnert Park, Sonoma, Healdsburg, Windsor, and Novato if applicable. Don't just list your home base.",
                "If you serve wine country businesses, add relevant attributes like 'serves wine country clientele' or 'bilingual staff' if true — these help with voice search.",
                "Respond to every review, good and bad, within 24 hours. In a tight-knit community like Sonoma County, your responsiveness signals trustworthiness to both Google and potential customers.",
                "Use your GBP posts to highlight Sonoma County-relevant events — harvest season, local festivals, or partnerships with local organizations.",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-3 p-4 rounded-xl bg-[#FAFAF9] border border-[#18181B]/10">
                  <CheckCircle size={16} className="flex-shrink-0 mt-0.5" color="#F97316" />
                  <span className="text-sm text-[#3F3F46]/70">{tip}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-bold text-[#18181B] mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Common mistakes to avoid
            </h2>
            <div className="space-y-3 mb-10">
              {[
                { mistake: "Using a P.O. box as your business address", fix: "Google requires a real, verifiable address. Use a coworking space or registered agent address if you work from home." },
                { mistake: "Keyword-stuffing your business name", fix: "Don't add 'Best Plumber Sonoma County' to your business name — it violates Google's guidelines and can get your listing suspended." },
                { mistake: "Ignoring negative reviews", fix: "A thoughtful, professional response to a bad review often looks better than perfect 5-star ratings with no response at all." },
              ].map((item) => (
                <div key={item.mistake} className="rounded-xl border border-[#18181B]/10 p-5 bg-[#FAFAF9]">
                  <h3 className="font-semibold text-[#18181B] text-sm mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                    ✗ {item.mistake}
                  </h3>
                  <p className="text-sm text-[#3F3F46]/60 leading-relaxed">{item.fix}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 rounded-2xl bg-[#18181B] text-white">
              <p className="text-sm font-semibold mb-2 text-[#F97316]" style={{ fontFamily: "var(--font-heading)" }}>Not sure where you stand?</p>
              <p className="text-sm text-white/70 mb-4">
                We offer a free local SEO review for Sonoma County businesses — we&apos;ll audit your GBP, check your citations, and tell you exactly what&apos;s holding your rankings back.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-[#18181B] bg-[#F97316] hover:bg-[#ea6c0a] transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Get a free local SEO review <ArrowRight size={14} />
              </Link>
            </div>

            <BlogEmailCapture />

            <div className="mt-10 pt-8 border-t border-[#18181B]/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#3F3F46]/50 hover:text-[#18181B] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                <ArrowLeft size={14} /> Back to Resources
              </Link>
              <Link href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#F97316] hover:bg-[#ea6c0a] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                Free Consultation <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
