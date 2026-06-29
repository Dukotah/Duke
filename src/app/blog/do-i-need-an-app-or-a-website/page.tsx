import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import JsonLd, { blogPostingSchema, breadcrumbSchema, faqSchema } from "@/components/JsonLd";
import ArticleHeader from "@/components/ArticleHeader";

const URL = "https://copperbaytech.com/blog/do-i-need-an-app-or-a-website";

export const metadata: Metadata = {
  title: "Do I Need an App or a Website? | Copper Bay Tech",
  description: "Most small businesses need a website or web app, not a native phone app. Here is a plain-spoken guide to deciding which one fits your goals and budget.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Do I Need an App or a Website? | Copper Bay Tech",
    description: "Most small businesses need a website or web app, not a native phone app. Here is a plain-spoken guide to deciding which one fits your goals and budget.",
    url: URL,
    siteName: "Copper Bay Tech",
    type: "article",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function Article() {
  return (
    <>
      <JsonLd schema={blogPostingSchema({ title: "Do I Need an App or a Website for My Business?", description: "Most small businesses need a website or web app, not a native phone app. Here is a plain-spoken guide to deciding which one fits your goals and budget.", url: URL, datePublished: "2026-06-27" })} />
      <JsonLd schema={breadcrumbSchema([{ name: "Home", url: "https://copperbaytech.com" }, { name: "Blog", url: "https://copperbaytech.com/blog" }, { name: "App or Website?" }])} />
      <JsonLd schema={faqSchema([{ q: "Is a website cheaper than a mobile app?", a: "Almost always, yes. In our experience a custom website runs in the low-to-mid four figures and a capable web app in the mid four to five figures, while a polished native app usually starts higher and takes longer because you maintain separate Apple and Android versions. The web also gets you live and earning faster." }, { q: "Can a website send push notifications like an app?", a: "Yes. Modern web apps can send push notifications on Android and on recent iPhones when a user adds the site to their home screen. For most businesses this is more than enough, so notifications alone are rarely a good reason to build native." }, { q: "What is a progressive web app (PWA)?", a: "A PWA is a web app built so people can add it to their phone home screen and open it full-screen with your icon, like a real app, including notifications and some offline use. You build one thing that works everywhere, with no app-store fees or approvals, at web-app cost." }, { q: "Do I need both a website and an app?", a: "If you build a native app, you still need a website, because apps do not appear in Google searches and many customers will never download anything. That is why we recommend starting with the web and adding a native app later only if real, repeat usage justifies it." }, { q: "How do I know if my idea really needs a native app?", a: "Ask whether people will use it several times a week and whether it depends heavily on the camera, GPS, sensors, or offline use. If both are true, price out a native app. If not, a website, web app, or installable PWA will serve you better for less." }])} />
      <Nav />
      <main>
        <ArticleHeader tag={"Custom Software"} title={"Do I Need an App or a Website for My Business?"} date="June 27, 2026" readTime={"7 min read"} />

        <section className="py-12 bg-ink-0">
          <div className="max-w-2xl mx-auto px-6">
            <div className="prose prose-zinc max-w-none text-zinc-300 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>

              <p className="text-lg text-zinc-400 mb-8 leading-relaxed">For the large majority of small businesses, the answer is a website or a web app, not a native phone app people download from the App Store. A website earns trust, gets found on Google, and works on every device the moment someone clicks. A native app only makes sense when people will use your product over and over, every week, and you genuinely need phone-specific features like push notifications, offline use, or the camera. If you are choosing between the two, start with a website or web app and treat a native app as a later step you grow into, not the place you begin.</p>

              <div className="rounded-xl border border-hairline bg-ink-1 p-6 mb-10">
                <p className="text-sm font-semibold text-copper uppercase tracking-wide mb-3" style={{ fontFamily: "var(--font-heading)" }}>Key takeaways</p>
                <ul className="space-y-2 list-disc pl-5 text-zinc-300">
                  <li>Most small businesses need a website or web app, not a native app, because the web is found on Google, works everywhere instantly, and costs less.</li>
                  <li>Native apps make sense mainly for daily, habitual use or heavy reliance on phone hardware like camera, GPS, or offline mode.</li>
                  <li>An installable progressive web app (PWA) gives you the app feel and icon without app-store cost, approvals, or separate Apple and Android builds.</li>
                  <li>Even if you build a native app, you still need a website, so start with the web and add native only when repeat usage justifies it.</li>
                </ul>
              </div>
              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>What is the actual difference between an app and a website?</h2>
              <p className="mb-6">A website is something people reach by typing an address or clicking a Google result. It opens instantly in a browser, works on phones, tablets, and laptops, and never has to be installed. A web app is a website that does more than show information: it lets people log in, book, pay, fill out forms, see a dashboard, or manage an account. A booking system, a customer portal, and an online store are all web apps even though they live at a normal web address.</p>
              <p className="mb-6">A native app is a separate program a person downloads from the Apple App Store or Google Play. It installs onto the phone, gets an icon on the home screen, and can use phone hardware directly. Native apps are powerful, but they cost more, take longer, and require people to decide to download and keep them before they ever get value.</p>
              <p className="mb-6">Here is the part most owners do not realize: a modern web app can do almost everything people assume requires a native app. It can send notifications, behave like an installed app, take payments, and store logins. The web has closed most of the gap, which is why the right starting point for nearly every small business is the web.</p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>When a website or web app is the right choice</h2>
              <p className="mb-6">Choose a website or web app when your main job is to be found, build trust, and let people take an action without friction. That covers the overwhelming majority of small businesses we work with.</p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>You need to be found on Google</strong> Native apps do not show up in normal search results. If you want customers to discover you when they search for your service, you need a website. This alone rules out a native app for most local businesses.</li>
                <li><strong>People use you occasionally, not daily</strong> A contractor, law firm, clinic, restaurant, or consultant gets visited a handful of times by each customer. Nobody downloads an app to book a plumber once. A website removes every barrier between interest and action.</li>
                <li><strong>You sell, book, or collect information</strong> Online stores, appointment booking, quote requests, and intake forms all work beautifully as web apps. Customers click a link and they are in, with nothing to install.</li>
                <li><strong>You want one thing to maintain</strong> A website works on every phone and computer at once. A native app means building and maintaining separate versions for Apple and Android, plus the website you still need anyway.</li>
                <li><strong>Budget and speed matter</strong> In our experience, a custom website typically runs in the low-to-mid four figures and a capable web app in the mid four to five figures, while a polished native app usually starts higher and takes considerably longer. The web gets you to market faster for less.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>When a native app actually makes sense</h2>
              <p className="mb-6">Native apps are not a bad idea. They are simply the right tool for a narrower set of jobs. The honest test is whether people will open it again and again, and whether it needs the phone itself to do its job.</p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>Daily, habitual use</strong> If customers or staff would realistically open it several times a week, the home-screen icon and one-tap access of a native app start to pay off. Think fitness tracking, daily logging, or a tool field crews live in all day.</li>
                <li><strong>Deep phone hardware needs</strong> Heavy, real-time use of the camera, GPS, Bluetooth, sensors, or reliable offline operation where there is no signal can push you toward native. Light versions of these work on the web; intensive use often does not.</li>
                <li><strong>Rich push notifications as a core feature</strong> If timely notifications are central to the product and not just a nice-to-have, native still has an edge, though web push has become quite capable on Android and modern iPhones.</li>
                <li><strong>You are selling the app itself</strong> If your business model is a product people pay to download or subscribe to inside an app store, then being in the store is the point.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>The option most owners do not know about: the installable web app</h2>
              <p className="mb-6">There is a middle path that gives you most of the app experience without the app-store cost, and it is the right answer surprisingly often. It is called a progressive web app, or PWA: a web app built so people can add it to their phone home screen, open it full-screen with your icon like a real app, receive notifications, and even use parts of it offline.</p>
              <p className="mb-6">The advantage is that you build one thing, it works everywhere, it is found on Google, and there are no app-store approvals, fees, or separate Apple and Android versions to maintain. For a customer portal, a booking tool, an internal tool your team uses, or a service you want people to revisit, a PWA delivers the app feel at web-app cost and speed.</p>
              <p className="mb-6">In our experience, when an owner says they want an app, what they actually want is the convenience, the icon, and the polish, not the App Store specifically. A PWA gives them exactly that. We reach for a true native build only when the daily-use and hardware tests above clearly call for it.</p>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>A simple decision checklist</h2>
              <p className="mb-6">Run your idea through these questions in order. The first clear yes points you to your answer.</p>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><strong>Do you need to be found on Google?</strong> If yes, you need a website. Build that first, regardless of anything else.</li>
                <li><strong>Will people use it many times every week?</strong> If no, a website or web app is plenty. If yes, keep going.</li>
                <li><strong>Does it lean hard on the camera, GPS, sensors, or offline use?</strong> If no, a web app or installable PWA covers you. If yes, a native app is worth pricing out.</li>
                <li><strong>Is your business model selling the app in a store?</strong> If yes, go native. If no, the web is almost certainly your better, cheaper, faster move.</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mt-10 mb-4" style={{ fontFamily: "var(--font-heading)" }}>How we help you decide</h2>
              <p className="mb-6">We are a small, founder-led shop in Santa Rosa serving Sonoma County and clients across the U.S., and we have no incentive to oversell you a native app you do not need. Every project is custom-coded with no templates or page builders, and you get one accountable owner from start to finish who replies within one business day.</p>
              <p className="mb-6">When an owner comes to us asking for an app, we start by mapping what success actually looks like: who uses it, how often, on what device, and what action you need them to take. More often than not, the right build is a fast custom website or a web app, sometimes made installable as a PWA. When the math genuinely favors native, we will tell you plainly and build it right. Either way, you get enterprise-grade thinking without the enterprise price, and a clear recommendation instead of a sales pitch.</p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Frequently asked questions</h2>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>Is a website cheaper than a mobile app?</h3>
              <p className="mb-6">Almost always, yes. In our experience a custom website runs in the low-to-mid four figures and a capable web app in the mid four to five figures, while a polished native app usually starts higher and takes longer because you maintain separate Apple and Android versions. The web also gets you live and earning faster.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>Can a website send push notifications like an app?</h3>
              <p className="mb-6">Yes. Modern web apps can send push notifications on Android and on recent iPhones when a user adds the site to their home screen. For most businesses this is more than enough, so notifications alone are rarely a good reason to build native.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>What is a progressive web app (PWA)?</h3>
              <p className="mb-6">A PWA is a web app built so people can add it to their phone home screen and open it full-screen with your icon, like a real app, including notifications and some offline use. You build one thing that works everywhere, with no app-store fees or approvals, at web-app cost.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>Do I need both a website and an app?</h3>
              <p className="mb-6">If you build a native app, you still need a website, because apps do not appear in Google searches and many customers will never download anything. That is why we recommend starting with the web and adding a native app later only if real, repeat usage justifies it.</p>
              <h3 className="text-lg font-semibold text-white mt-6 mb-2" style={{ fontFamily: "var(--font-heading)" }}>How do I know if my idea really needs a native app?</h3>
              <p className="mb-6">Ask whether people will use it several times a week and whether it depends heavily on the camera, GPS, sensors, or offline use. If both are true, price out a native app. If not, a website, web app, or installable PWA will serve you better for less.</p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Related reading</h2>
              <ul className="mb-6 space-y-2 list-disc pl-5">
                <li><Link href="/web-development" className="text-copper hover:text-copper-bright underline">custom software and web app development</Link></li>
                <li><Link href="/pricing" className="text-copper hover:text-copper-bright underline">see our pricing</Link></li>
              </ul>

              <div className="mt-12 rounded-xl border border-hairline bg-ink-1 p-8 text-center">
                <p className="text-xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)" }}>Thinking about a project?</p>
                <p className="text-zinc-400 mb-6">Copper Bay Tech builds custom websites and software for small businesses &mdash; founder-led, custom-coded, and built to last. Get a straight answer and a free consultation.</p>
                <Link href="/get-started" className="inline-flex items-center gap-2 rounded-lg bg-copper px-6 py-3 font-semibold text-ink-0 hover:bg-copper-bright transition-colors">Get started <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
