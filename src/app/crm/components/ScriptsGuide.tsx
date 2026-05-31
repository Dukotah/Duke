"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight, DollarSign, Globe, Wrench, Shield, Search, RefreshCw } from "lucide-react";

function CopyBlock({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  const H = { fontFamily: "var(--font-heading)" };
  return (
    <div className="relative bg-[#111113] rounded-xl border border-white/[0.06] p-4 group">
      <p className="text-sm text-white/80 leading-relaxed italic pr-8" style={H}>"{text}"</p>
      <button onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); }}
        className="absolute top-3 right-3 p-1.5 rounded-md text-white/20 hover:text-white/60 hover:bg-white/5 transition-colors">
        {ok ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
      </button>
    </div>
  );
}

function Accordion({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const H = { fontFamily: "var(--font-heading)" };
  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden">
      <button onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors">
        <span className="text-sm font-semibold text-white/80" style={H}>{question}</span>
        {open ? <ChevronDown size={15} className="text-white/30 shrink-0" /> : <ChevronRight size={15} className="text-white/30 shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4">
          <CopyBlock text={answer} />
        </div>
      )}
    </div>
  );
}

const SERVICES = [
  {
    icon: Globe, color: "text-[#F97316]", bg: "bg-[#F97316]/10", border: "border-[#F97316]/20",
    name: "New Website", price: "$1,500 – $4,500", type: "One-time",
    tagline: "For businesses with no website at all",
    pitch: "We build fast, beautiful websites that show up on Google and actually get you customers. Starts at $1,500 — and most of our clients make that back in their first new customer.",
    who: "Tier A leads — anyone with no website. This is your #1 product to sell.",
  },
  {
    icon: RefreshCw, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20",
    name: "Website Redesign", price: "$1,200 – $3,500", type: "One-time",
    tagline: "For businesses with an outdated or DIY site",
    pitch: "We rebuild websites that are embarrassing their owners — old Wix sites, sites that don't work on phones, sites that look like it's 2009. Starting at $1,200.",
    who: "Tier B leads — Wix, Squarespace, Weebly sites. They built it themselves and it shows.",
  },
  {
    icon: Wrench, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20",
    name: "IT Support Retainer", price: "$299 – $799/mo", type: "Monthly",
    tagline: "Ongoing IT support for small businesses",
    pitch: "We become their IT department for a flat monthly fee. Computer issues, network problems, software setup — they call us instead of panicking. Most businesses save money vs. hiring.",
    who: "Any business with 2+ employees and computers. Especially good for offices, medical, legal.",
  },
  {
    icon: Search, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20",
    name: "Local SEO / Google Listing", price: "$299 – $599/mo", type: "Monthly",
    tagline: "Get them to show up on Google Maps",
    pitch: "We make sure when someone searches for [their type of business] in [their city], they show up. Most businesses are invisible on Google — we fix that.",
    who: "Any local business that relies on local customers. Restaurants, salons, contractors, dentists.",
  },
  {
    icon: Shield, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20",
    name: "Website Maintenance", price: "$99 – $249/mo", type: "Monthly",
    tagline: "Keep their site updated, secure, and running",
    pitch: "We keep their website up to date, secure from hackers, and working on all devices. Think of it like insurance — you hope you don't need it, but when something breaks you're really glad you have it.",
    who: "Any business with a website. Great upsell after building them one.",
  },
];

const OBJECTIONS = [
  {
    q: "We already have a website",
    a: "That's great — do you mind if I take a quick look? A lot of sites look fine but they're not optimized for Google or mobile phones, which means customers can't find you or leave before they call. I can tell you honestly in 60 seconds if yours is doing its job.",
  },
  {
    q: "We don't need a website / we get customers by word of mouth",
    a: "That's how most of the best local businesses start — and it's a sign you're doing something right. The issue is, even referrals Google you before they call. If they find nothing, or something outdated, you lose them. A website backs up your reputation.",
  },
  {
    q: "We can't afford it right now",
    a: "Totally understand — what if I could show you how one new customer from your website would pay for it? Most of our clients break even in the first month. And we have payment plans that start at under $100/month. Worth 15 minutes?",
  },
  {
    q: "We had someone build us a website before and it was a disaster",
    a: "Ugh, I hear that a lot — and it's genuinely awful when that happens. The difference with us is we're local, you can actually talk to us, and we don't disappear after we take your money. Can I show you a couple examples of what we've done?",
  },
  {
    q: "I need to talk to my partner / spouse / boss",
    a: "Of course — who should I actually be talking to about this? I'd love to set up a quick 15-minute call with both of you so nobody's playing telephone. Would [day] or [day] work?",
  },
  {
    q: "Just send me an email / send me info",
    a: "Happy to — what email should I send it to? And can I follow up by phone in a couple days? I want to make sure it doesn't get buried.",
  },
  {
    q: "We use [Wix / Squarespace / GoDaddy]",
    a: "Those are great for getting started — the issue is they look template-y, they're slow, and Google doesn't love them as much as custom sites. A lot of our clients have upgraded from exactly those platforms and the difference is night and day.",
  },
];

export default function ScriptsGuide() {
  const H = { fontFamily: "var(--font-heading)" };
  const [activeService, setActiveService] = useState<number | null>(null);

  return (
    <div className="space-y-8 pb-8">

      {/* Opening scripts */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-bold text-white" style={H}>Opening Lines</h2>
          <p className="text-xs text-white/40 mt-0.5" style={H}>Use these when they pick up. Keep it natural — read it a few times until it sounds like you.</p>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-[#F97316] uppercase tracking-wider mb-2" style={H}>They have NO website (Tier A)</p>
            <CopyBlock text="Hey [Name], this is [Your Name] with Copper Bay Tech — we help local businesses in [City] get found online. I noticed [Business Name] doesn't have a website yet — for a [type of business], that's a lot of customers searching Google and not finding you. Do you have 2 minutes?" />
          </div>
          <div>
            <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2" style={H}>They have a DIY site (Tier B)</p>
            <CopyBlock text="Hey [Name], this is [Your Name] with Copper Bay Tech — I was looking at [Business Name] online and noticed your website is on [Wix/Squarespace]. Those are fine to start, but they can hold you back on Google and look a bit template-y. We upgrade businesses to professional sites — do you have 2 minutes to talk?" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2" style={H}>Cold open (any)</p>
            <CopyBlock text="Hey [Name], this is [Your Name] with Copper Bay Tech — we help small businesses in [County] County get more customers through their website and online presence. Do you have a couple minutes, or is now a bad time?" />
          </div>
          <div>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2" style={H}>Voicemail to leave</p>
            <CopyBlock text="Hey [Name], this is [Your Name] calling from Copper Bay Tech. I help local businesses in [City] get more customers online and I had a couple ideas for [Business Name] specifically. Give me a call back at [Your Number] — takes about 5 minutes. Hope to talk soon." />
          </div>
        </div>
      </div>

      {/* Services */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-bold text-white" style={H}>What We Sell</h2>
          <p className="text-xs text-white/40 mt-0.5" style={H}>Tap any service to see the pitch and who it's for.</p>
        </div>
        <div className="space-y-2">
          {SERVICES.map((svc, i) => {
            const isOpen = activeService === i;
            return (
              <div key={svc.name} className={`rounded-2xl border transition-all overflow-hidden ${isOpen ? `${svc.border} ${svc.bg}` : "border-white/[0.06] bg-[#1C1C1F]"}`}>
                <button onClick={() => setActiveService(isOpen ? null : i)}
                  className="w-full flex items-center gap-4 px-4 py-4 text-left">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${svc.bg} border ${svc.border}`}>
                    <svc.icon size={18} className={svc.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-white" style={H}>{svc.name}</p>
                      <span className={`text-xs font-semibold ${svc.color}`} style={H}>{svc.price}</span>
                      <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full" style={H}>{svc.type}</span>
                    </div>
                    <p className="text-xs text-white/40 mt-0.5 truncate" style={H}>{svc.tagline}</p>
                  </div>
                  {isOpen ? <ChevronDown size={15} className="text-white/30 shrink-0" /> : <ChevronRight size={15} className="text-white/30 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-white/35 uppercase tracking-wider mb-2" style={H}>How to pitch it</p>
                      <CopyBlock text={svc.pitch} />
                    </div>
                    <div className={`rounded-xl border px-4 py-3 ${svc.border} ${svc.bg}`}>
                      <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1" style={H}>Best for</p>
                      <p className="text-sm text-white/70" style={H}>{svc.who}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Objections */}
      <div>
        <div className="mb-4">
          <h2 className="text-base font-bold text-white" style={H}>When They Push Back</h2>
          <p className="text-xs text-white/40 mt-0.5" style={H}>Tap the objection to see what to say. These aren't scripts — make them your own.</p>
        </div>
        <div className="space-y-2">
          {OBJECTIONS.map((o) => <Accordion key={o.q} question={o.q} answer={o.a} />)}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-[#1C1C1F] border border-white/[0.06] rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white mb-4" style={H}>💡 Quick Tips</h2>
        <div className="space-y-3">
          {[
            ["Call, don't text first", "A phone call gets you 5x more meetings than a cold text or email. Call during business hours — 10am–12pm and 2pm–5pm are best."],
            ["Always have a next step", "Never end a call without a specific next action: \"I'll call you Thursday at 2pm\" beats \"I'll be in touch.\""],
            ["Don't over-explain", "Your only job on the first call is to get a meeting or a yes/no. Don't pitch the entire service — just get them curious."],
            ["Log everything", "Notes in the CRM remind you where you left off. \"Said call back after their busy season in March\" is worth money."],
            ["High score = hot lead", "Leads with scores 80+ have no website AND are in a high-fit niche AND have a phone number. Start there."],
          ].map(([title, body]) => (
            <div key={title as string} className="flex gap-3">
              <div className="w-1 bg-[#F97316]/40 rounded-full shrink-0 mt-1" />
              <div>
                <p className="text-sm font-semibold text-white/80" style={H}>{title}</p>
                <p className="text-xs text-white/40 mt-0.5 leading-relaxed" style={H}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
