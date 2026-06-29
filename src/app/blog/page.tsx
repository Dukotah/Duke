import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BlogIndex from "@/components/BlogIndex";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources & Blog | Copper Bay Tech",
  description:
    "Practical IT and web advice for Sonoma County small businesses. Learn how to protect your data, improve your website, and make better tech decisions.",
  alternates: { canonical: "https://copperbaytech.com/blog" },
  openGraph: {
    title: "Resources & Blog | Copper Bay Tech",
    description:
      "Practical IT and web advice for Sonoma County small businesses. Learn how to protect your data, improve your website, and make better tech decisions.",
    url: "https://copperbaytech.com/blog",
    siteName: "Copper Bay Tech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

type Post = {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
};

const posts: Post[] = [
  // June 2026 — software/web/automation batch (cornerstone)
  {
    slug: "how-much-does-it-cost-to-build-an-app",
    tag: "Custom Software",
    title: "How Much Does It Cost to Build an App in 2026?",
    excerpt: "A plain-spoken 2026 breakdown of app development costs: web vs native, MVP vs full app, realistic price ranges, and what actually drives the number up or down.",
    readTime: "8 min read",
    date: "June 2026",
  },
  {
    slug: "do-i-need-an-app-or-a-website",
    tag: "Custom Software",
    title: "Do I Need an App or a Website for My Business?",
    excerpt: "Most small businesses need a website or web app, not a native phone app. Here is a plain-spoken guide to deciding which one fits your goals and budget.",
    readTime: "7 min read",
    date: "June 2026",
  },
  {
    slug: "what-is-a-web-application",
    tag: "Custom Software",
    title: "What Is a Web Application? (And When Your Business Needs One)",
    excerpt: "A plain-English guide to web applications for small business owners: what they are, how they differ from a website, real examples, and when you actually need one.",
    readTime: "7 min read",
    date: "June 2026",
  },
  {
    slug: "website-maintenance-cost-and-whats-included",
    tag: "Web Development",
    title: "Website Maintenance: What It Costs and What It Includes",
    excerpt: "What does website maintenance cost and what does it include? Honest monthly ranges, what a care plan covers, and how to tell if you are overpaying.",
    readTime: "7 min read",
    date: "June 2026",
  },
  {
    slug: "wordpress-vs-custom-coded-website",
    tag: "Web Development",
    title: "WordPress vs. a Custom-Coded Website: Which Is Right for You?",
    excerpt: "An honest WordPress vs. custom-coded website comparison for small business owners: real costs, speed, security, maintenance, and who truly owns the site.",
    readTime: "8 min read",
    date: "June 2026",
  },
  {
    slug: "ecommerce-website-cost-for-small-business",
    tag: "Web Development",
    title: "How Much Does an E-commerce Website Cost for a Small Business?",
    excerpt: "What an e-commerce website really costs for a small business in 2026: Shopify vs a custom store, the line items that drive price, and where to spend wisely.",
    readTime: "8 min read",
    date: "June 2026",
  },
  {
    slug: "custom-software-development-process",
    tag: "Custom Software",
    title: "The Custom Software Development Process, Explained Simply",
    excerpt: "A plain-English walkthrough of the custom software development process, from discovery to launch, plus what a good process looks like and the red flags to avoid.",
    readTime: "8 min read",
    date: "June 2026",
  },
  {
    slug: "why-build-an-mvp-first",
    tag: "Custom Software",
    title: "Why You Should Build an MVP First (and How to Scope One)",
    excerpt: "An MVP is the smallest useful version of your software. Build it first to validate the idea with real users and avoid paying for features nobody needs.",
    readTime: "7 min read",
    date: "June 2026",
  },
  {
    slug: "small-business-automation-ideas",
    tag: "AI & Automation",
    title: "10 Small Business Automation Ideas That Actually Save Money",
    excerpt: "Concrete small business automation ideas that save real money: lead intake, follow-up, scheduling, invoicing, late payments, and the payoff for each one.",
    readTime: "8 min read",
    date: "June 2026",
  },
  {
    slug: "build-vs-buy-a-crm",
    tag: "Custom Software",
    title: "Build vs. Buy a CRM: Which Makes Sense for Your Business?",
    excerpt: "Should you buy an off-the-shelf CRM or build a custom one? A plain-spoken framework for when each one wins, what each really costs, and how to choose.",
    readTime: "7 min read",
    date: "June 2026",
  },
  {
    slug: "online-booking-system-for-small-business",
    tag: "Custom Software",
    title: "Choosing an Online Booking System for Your Small Business",
    excerpt: "How to choose an online booking system for your small business: off-the-shelf vs custom-built, the features that matter, cost ranges, and red flags to avoid.",
    readTime: "7 min read",
    date: "June 2026",
  },
  {
    slug: "integrating-your-business-software",
    tag: "Custom Software",
    title: "Connecting Your Business Software: A Guide to Integrations",
    excerpt: "Disconnected business tools quietly cost you hours and money. Here is how API integrations and automation connect your software so your data flows on its own.",
    readTime: "7 min read",
    date: "June 2026",
  },
  {
    slug: "ada-website-accessibility-small-business",
    tag: "Web Development",
    title: "Website Accessibility (ADA) for Small Businesses: What You Need to Know",
    excerpt: "A plain-English guide to ADA website accessibility for small businesses: the legal risk, the customers you gain, the SEO upside, and how to get compliant.",
    readTime: "8 min read",
    date: "June 2026",
  },
  {
    slug: "what-to-prepare-before-hiring-a-web-developer",
    tag: "Business Strategy",
    title: "What to Prepare Before Hiring a Web Developer",
    excerpt: "A practical checklist of what to gather before you hire a web developer, plus how to write a simple website brief that makes your project faster and cheaper.",
    readTime: "7 min read",
    date: "June 2026",
  },
  {
    slug: "redesign-vs-rebuild-your-website",
    tag: "Web Development",
    title: "Website Redesign vs. Rebuild: Which Does Your Site Need?",
    excerpt: "Redesign or rebuild your website? A redesign reskins what works; a rebuild replaces the foundation. Here is how to tell which your site actually needs.",
    readTime: "7 min read",
    date: "June 2026",
  },
  // June 2026 — SEO/GEO cornerstone batch (web design + custom software)
  {
    slug: "how-to-choose-a-web-designer",
    tag: "Web Development",
    title: "How to Choose a Web Designer: 9 Questions to Ask Before You Hire",
    excerpt: "A plain-spoken buyer's guide to choosing a web designer. The 9 questions that separate a real web partner from a cheap one, plus the red flags to avoid.",
    readTime: "9 min read",
    date: "June 2026",
  },
  {
    slug: "do-i-still-need-a-website-in-2026",
    tag: "Business Strategy",
    title: "Do You Still Need a Website in 2026 if You Have Social Media and a Google Profile?",
    excerpt: "Yes, you still need a website in 2026 even with Facebook and a Google Business Profile. Here's why social and a Google listing aren't enough on their own.",
    readTime: "8 min read",
    date: "June 2026",
  },
  {
    slug: "how-long-does-it-take-to-build-a-website",
    tag: "Web Development",
    title: "How Long Does It Take to Build a Small Business Website?",
    excerpt: "A realistic website build timeline: 2-4 weeks for a simple site, 4-8 weeks for most small businesses, 3-6 months for complex builds. Plus what speeds it up.",
    readTime: "9 min read",
    date: "June 2026",
  },
  {
    slug: "web-design-vs-web-development",
    tag: "Web Development",
    title: "Web Design vs. Web Development: What's the Difference (and Which Do You Need)?",
    excerpt: "Web design is how a site looks and feels; web development is how it's built and works. The plain-English difference and which one your small business needs.",
    readTime: "8 min read",
    date: "June 2026",
  },
  {
    slug: "local-web-developer-vs-offshore",
    tag: "Web Development",
    title: "Hiring a Local Web Developer vs. Offshore: The Real Trade-offs",
    excerpt: "Local vs. offshore web developer: offshore wins on hourly rate; local wins on communication, accountability, and rework. The honest, dollar-by-dollar take.",
    readTime: "9 min read",
    date: "June 2026",
  },
  {
    slug: "how-much-does-custom-software-cost",
    tag: "Custom Software",
    title: "How Much Does Custom Software Cost to Build in 2026?",
    excerpt: "Custom software costs roughly $5,000 to $250,000+ depending on scope. See real 2026 price ranges, what drives the cost, and the build-vs-subscribe math.",
    readTime: "9 min read",
    date: "June 2026",
  },
  {
    slug: "custom-software-vs-off-the-shelf",
    tag: "Custom Software",
    title: "Custom Software vs. Off-the-Shelf: Which Is Right for Your Business?",
    excerpt: "Custom software vs. off-the-shelf software: an honest decision framework with real trade-offs, true costs, and a simple rule for which one fits your business.",
    readTime: "9 min read",
    date: "June 2026",
  },
  {
    slug: "what-is-custom-software-development",
    tag: "Custom Software",
    title: "What Is Custom Software Development? A Small-Business Owner's Guide",
    excerpt: "Custom software development means building an app around your exact workflow instead of forcing your business to fit a generic rented tool. A plain guide.",
    readTime: "9 min read",
    date: "June 2026",
  },
  {
    slug: "build-vs-buy-software",
    tag: "Custom Software",
    title: "Build vs. Buy: When Does Custom Software Actually Make Sense?",
    excerpt: "Should you build custom software or buy an off-the-shelf tool? A clear decision framework with the exact signals that point to each path for small businesses.",
    readTime: "9 min read",
    date: "June 2026",
  },
  {
    slug: "how-to-hire-a-software-development-company",
    tag: "Custom Software",
    title: "How to Hire a Software Development Company (What to Look For)",
    excerpt: "A plain-spoken buyer's guide to hiring a software development company: what to look for, the questions to ask, the red flags, and what custom software costs.",
    readTime: "9 min read",
    date: "June 2026",
  },
  {
    slug: "signs-your-business-has-outgrown-spreadsheets",
    tag: "Custom Software",
    title: "7 Signs Your Business Has Outgrown Spreadsheets (and Needs Custom Software)",
    excerpt: "Wondering when to replace spreadsheets with software? Here are 7 clear signs your business has outgrown Excel and Google Sheets, and what to do about it next.",
    readTime: "8 min read",
    date: "June 2026",
  },
  {
    slug: "how-long-to-build-a-custom-web-app",
    tag: "Custom Software",
    title: "How Long Does It Take to Build a Custom Web App?",
    excerpt: "A realistic timeline for building a custom web app, broken down by complexity and the five phases, from a simple internal tool to a full SaaS platform.",
    readTime: "9 min read",
    date: "June 2026",
  },
  {
    slug: "get-your-business-recommended-by-ai",
    tag: "AI & Automation",
    title: "How to Get Your Business Recommended by AI Assistants (ChatGPT, Perplexity, Google AI)",
    excerpt: "A practical guide to getting your business recommended by ChatGPT, Perplexity, and Google AI: what GEO is, what actually works, and where to start today.",
    readTime: "9 min read",
    date: "June 2026",
  },
  {
    slug: "what-makes-a-website-convert",
    tag: "Web Development",
    title: "What Makes a Small Business Website Actually Convert?",
    excerpt: "A website converts when it loads fast, says one clear thing, earns trust, and makes the next step obvious on a phone. Here is how to turn traffic into leads.",
    readTime: "9 min read",
    date: "June 2026",
  },
  // June 2026 — AI integration by industry
  {
    slug: "ai-for-sonoma-county-wineries",
    tag: "AI & Automation",
    title: "How AI Actually Helps a Sonoma County Winery (2026)",
    excerpt: "The practical, no-hype ways Sonoma County wineries use AI in 2026 — booking tasting-room calls 24/7, keeping wine-club members re-ordering, and clearing DTC busywork — plus what to skip.",
    readTime: "7 min read",
    date: "June 2026",
  },
  {
    slug: "ai-for-restaurants-sonoma-county",
    tag: "AI & Automation",
    title: "How AI Actually Helps a Sonoma County Restaurant (2026)",
    excerpt: "A no-hype, owner-to-owner guide to AI for Sonoma County restaurants — stopping missed reservation and takeout calls, automating ordering, reviews, and reminders, and clearing back-office busywork.",
    readTime: "7 min read",
    date: "June 2026",
  },
  {
    slug: "ai-for-home-services-sonoma-county",
    tag: "AI & Automation",
    title: "How AI Helps a Sonoma County HVAC, Plumbing or Electrical Business (2026)",
    excerpt: "Practical AI for the trades — capture every missed call from the field, book jobs 24/7, follow up on quotes, and generate reviews so leads stop walking to the competitor who picked up.",
    readTime: "7 min read",
    date: "June 2026",
  },
  {
    slug: "ai-for-healthcare-practices-sonoma-county",
    tag: "AI & Automation",
    title: "How AI Helps a Sonoma County Healthcare or Dental Practice (2026)",
    excerpt: "Practical, HIPAA-aware ways small healthcare and dental practices can use AI in 2026 — cutting no-shows, handling after-hours calls, easing intake, and running recalls — without putting patient data at risk.",
    readTime: "7 min read",
    date: "June 2026",
  },
  {
    slug: "ai-for-real-estate-sonoma-county",
    tag: "AI & Automation",
    title: "How AI Helps a Sonoma County Real Estate Agent (2026)",
    excerpt: "Practical, no-hype AI for Sonoma County agents and brokerages: instant lead response that wins listings, 24/7 inquiry handling, automated buyer/seller nurture, and CRM follow-up that actually happens.",
    readTime: "6 min read",
    date: "June 2026",
  },
  {
    slug: "ai-for-professional-services-sonoma-county",
    tag: "AI & Automation",
    title: "How AI Helps a Sonoma County Law, Accounting or Consulting Firm (2026)",
    excerpt: "Practical AI for Sonoma County professional firms in 2026 — client intake, after-hours inquiries, document drafting, meeting notes, and billing — with confidentiality and human review kept front and center.",
    readTime: "7 min read",
    date: "June 2026",
  },
  // June 2026 — comparison guides
  {
    slug: "squarespace-vs-custom-website-for-small-business",
    tag: "Web Development",
    title: "Squarespace vs Custom Website for Small Business: An Honest Comparison",
    excerpt: "Website builders like Squarespace are genuinely fine for some businesses — and the wrong call for others. A both-sides look at cost, SEO ceilings, lock-in, and when each option actually makes sense.",
    readTime: "7 min read",
    date: "June 2026",
  },
  {
    slug: "local-it-company-vs-national-msp",
    tag: "IT Support",
    title: "Local IT Company vs National MSP: Which Is Right for Your Small Business?",
    excerpt: "Ticket queues, rotating technicians, and per-device fees — or a direct line, flat monthly pricing, and someone who already knows your setup. An honest comparison of local IT vs national MSPs.",
    readTime: "6 min read",
    date: "June 2026",
  },
  {
    slug: "free-antivirus-vs-managed-security-small-business",
    tag: "Cybersecurity",
    title: "Free Antivirus vs Managed Security: What Small Businesses Actually Need",
    excerpt: "Free antivirus like Windows Defender is a useful layer — but only one layer. What free AV covers, the gaps that actually cause breaches, and when to move to managed security.",
    readTime: "6 min read",
    date: "June 2026",
  },
  // June 2026
  {
    slug: "how-ai-helps-sonoma-county-small-businesses",
    tag: "AI & Automation",
    title: "How AI Actually Helps a Sonoma County Small Business (2026)",
    excerpt: "Practical, non-hype ways small businesses are using AI in 2026 — answering every call, responding to leads in seconds, automating reviews, and clearing the busywork. What works, what to skip, and where to start.",
    readTime: "6 min read",
    date: "June 2026",
  },
  {
    slug: "small-business-cybersecurity-threats-sonoma-county",
    tag: "Cybersecurity",
    title: "The 5 Cybersecurity Threats Most Likely to Hit a Sonoma County Small Business in 2026",
    excerpt: "Phishing, ransomware, weak passwords, unpatched software, and lost laptops account for nearly every local breach we see. Here's what each one looks like — and the fixes that actually stop them.",
    readTime: "6 min read",
    date: "June 2026",
  },
  {
    slug: "google-business-profile-setup-sonoma-county",
    tag: "Local SEO",
    title: "How to Set Up and Optimize Your Google Business Profile in Sonoma County",
    excerpt: "A step-by-step guide to claiming, verifying, and optimizing your Google Business Profile so Sonoma County customers can find you in Google Maps and local search.",
    readTime: "6 min read",
    date: "June 2026",
  },
  {
    slug: "google-workspace-vs-microsoft-365-small-business",
    tag: "IT Support",
    title: "Google Workspace vs Microsoft 365: Which Is Right for Your Small Business?",
    excerpt: "An honest comparison of Google Workspace and Microsoft 365 for small businesses — pricing, features, and who should use which.",
    readTime: "5 min read",
    date: "June 2026",
  },
  {
    slug: "how-to-rank-on-google-maps-local-business",
    tag: "Local SEO",
    title: "How to Get Your Sonoma County Business to Rank Higher on Google Maps",
    excerpt: "The 3 factors Google uses to rank local businesses on Google Maps — and the specific steps you can take to improve your ranking in Sonoma County.",
    readTime: "5 min read",
    date: "June 2026",
  },
  {
    slug: "how-to-speed-up-your-business-website",
    tag: "Web Development",
    title: "How to Speed Up Your Business Website (Without a Developer)",
    excerpt: "Five things you can do today without touching code — and three signs it's time to call in a developer.",
    readTime: "5 min read",
    date: "June 2026",
  },
  {
    slug: "small-business-website-cost-guide",
    tag: "Web Development",
    title: "How Much Does a Business Website Cost in 2026? A Plain-English Guide",
    excerpt: "DIY builders, freelancers, agencies, custom dev — the honest price ranges, what drives costs up, and what you should expect to pay in Sonoma County.",
    readTime: "6 min read",
    date: "June 2026",
  },
  {
    slug: "what-is-a-managed-service-provider",
    tag: "IT Support",
    title: "What Is a Managed Service Provider (MSP) — and Does Your Small Business Need One?",
    excerpt: "MSP, break-fix, in-house IT — what's the difference, when does each make sense, and what should a small business in Sonoma County actually expect to pay?",
    readTime: "5 min read",
    date: "June 2026",
  },
  {
    slug: "why-your-business-needs-mfa",
    tag: "Cybersecurity",
    title: "Why Every Small Business Needs Multi-Factor Authentication (And How to Set It Up)",
    excerpt: "95% of account takeovers rely on stolen passwords alone. MFA stops them. Here's what it is, why it matters, and how to turn it on in under 10 minutes.",
    readTime: "4 min read",
    date: "June 2026",
  },
  // May 2026
  {
    slug: "best-website-for-a-sonoma-county-winery",
    tag: "Web Development",
    title: "What Makes a Great Website for a Sonoma County Winery?",
    excerpt: "Tasting room visits, wine club signups, and direct-to-consumer sales all start with your website. Here's what Sonoma County wineries get wrong — and what works.",
    readTime: "5 min read",
    date: "May 2026",
  },
  {
    slug: "hipaa-security-checklist-sonoma-county-healthcare",
    tag: "Cybersecurity",
    title: "HIPAA Security Checklist for Sonoma County Healthcare Practices",
    excerpt: "A practical HIPAA technical security checklist for small healthcare practices in Sonoma County. What you actually need — and what most practices are missing.",
    readTime: "7 min read",
    date: "May 2026",
  },
  {
    slug: "how-much-does-a-website-cost-sonoma-county",
    tag: "Web Development",
    title: "How Much Does a Website Cost in Sonoma County? (2026)",
    excerpt: "Real pricing for small business websites in Sonoma County. What you should expect to pay, what drives costs up, and how to avoid getting ripped off.",
    readTime: "6 min read",
    date: "May 2026",
  },
  {
    slug: "how-much-does-it-support-cost-for-small-business",
    tag: "IT Support",
    title: "How Much Does IT Support Cost for a Small Business in Sonoma County?",
    excerpt: "Hourly? Retainer? Break-fix? Here's what IT support actually costs for small businesses in Sonoma County — and how to avoid overpaying.",
    readTime: "6 min read",
    date: "May 2026",
  },
  {
    slug: "how-to-back-up-your-small-business-data",
    tag: "IT Support",
    title: "How to Back Up Your Small Business Data (The Right Way)",
    excerpt: "Most small business backups fail when they're actually needed. The 3-2-1 rule, cloud vs. local, and how to know your backups will actually work.",
    readTime: "6 min read",
    date: "May 2026",
  },
  {
    slug: "how-to-choose-an-it-company-sonoma-county",
    tag: "IT Support",
    title: "How to Choose an IT Company in Sonoma County (Without Getting Burned)",
    excerpt: "Most small businesses hire their first IT vendor after something breaks. Here's what to look for — and what to avoid — before you're in crisis mode.",
    readTime: "5 min read",
    date: "May 2026",
  },
  {
    slug: "managed-it-support-vs-break-fix-sonoma-county",
    tag: "IT Support",
    title: "Managed IT Support vs. Break-Fix: Which Is Right for Your Sonoma County Business?",
    excerpt: "Break-fix IT feels cheaper until something breaks at the worst possible moment. Here's how to decide which model makes sense for your Sonoma County business.",
    readTime: "5 min read",
    date: "May 2026",
  },
  {
    slug: "ransomware-protection-small-business",
    tag: "Cybersecurity",
    title: "Ransomware Protection for Small Business: What Actually Works",
    excerpt: "Small businesses are the #1 ransomware target. Here's what actually protects you — and what's a waste of money — explained without the technical jargon.",
    readTime: "7 min read",
    date: "May 2026",
  },
  {
    slug: "why-slow-websites-hurt-sonoma-county-businesses",
    tag: "Web Performance",
    title: "Why a Slow Website Is Costing Your Sonoma County Business Customers",
    excerpt: "If your site takes more than 3 seconds to load, more than half your visitors are already gone. Here's what's slowing you down and how to fix it.",
    readTime: "4 min read",
    date: "May 2026",
  },
  // April 2026
  {
    slug: "how-much-should-a-small-business-website-cost",
    tag: "Web Development",
    title: "How Much Should a Small Business Website Cost? (Honest Answer)",
    excerpt: "Website pricing ranges wildly — from $500 DIY to $50,000 agency builds. Here's what actually drives the cost and what Sonoma County small businesses should realistically expect to pay.",
    readTime: "5 min read",
    date: "April 2026",
  },
  {
    slug: "is-my-small-business-website-hipaa-compliant",
    tag: "Cybersecurity",
    title: "Is My Small Business Website HIPAA Compliant? A Plain-English Checklist",
    excerpt: "If your business collects patient info online, HIPAA applies. Here is a plain-English checklist.",
    readTime: "6 min read",
    date: "April 2026",
  },
  {
    slug: "signs-you-need-a-new-website",
    tag: "Web Development",
    title: "7 Signs It's Time for a New Business Website (Not Just a Refresh)",
    excerpt: "Some website problems can be patched. Others mean it's time to start over. Here are 7 signs your current site is holding your business back.",
    readTime: "6 min read",
    date: "April 2026",
  },
  {
    slug: "winery-cybersecurity-sonoma-county",
    tag: "Cybersecurity",
    title: "Why Sonoma County Wineries Are a Cybersecurity Target (And What to Do About It)",
    excerpt: "Wine club data, tasting room POS systems, and reservation platforms make Sonoma County wineries attractive targets. Here's what to do about it.",
    readTime: "6 min read",
    date: "April 2026",
  },
  // March 2026
  {
    slug: "5-signs-your-business-website-is-costing-you-customers",
    tag: "Web Development",
    title: "5 Signs Your Business Website Is Costing You Customers Right Now",
    excerpt: "Slow load times, broken mobile layouts, and missing contact info are invisible revenue killers. Here is how to diagnose them fast.",
    readTime: "4 min read",
    date: "March 2026",
  },
  {
    slug: "cloud-vs-local-server-small-business",
    tag: "IT Support",
    title: "Cloud vs. Local Server: What's Actually Right for Your Small Business?",
    excerpt: "Should your small business move to the cloud or keep a local server? Here's a direct comparison for businesses with 3–30 employees — including when local still makes sense.",
    readTime: "6 min read",
    date: "March 2026",
  },
  {
    slug: "google-business-profile-tips-local-business",
    tag: "Local SEO",
    title: "Google Business Profile Tips That Actually Get You Found Locally",
    excerpt: "Most local businesses leave their Google Business Profile half-filled. Here's exactly what to do to show up when customers are searching nearby.",
    readTime: "6 min read",
    date: "March 2026",
  },
  {
    slug: "restaurant-technology-guide-sonoma-county",
    tag: "IT Support",
    title: "The Small Restaurant Owner's Guide to Technology in Sonoma County",
    excerpt: "POS systems, WiFi reliability, online ordering, and data backup — a practical technology guide for Sonoma County restaurant owners.",
    readTime: "7 min read",
    date: "March 2026",
  },
  // February 2026
  {
    slug: "do-small-businesses-need-cybersecurity",
    tag: "Cybersecurity",
    title: "Do Small Businesses Really Need Cybersecurity? (Yes, Here's Why)",
    excerpt: "The myth that hackers only target large companies is costing small businesses millions. Here's the truth — and what to do about it.",
    readTime: "6 min read",
    date: "February 2026",
  },
  {
    slug: "what-is-managed-it-support",
    tag: "IT Support",
    title: "What Is Managed IT Support — and Does Your Business Need It?",
    excerpt: "Break/fix IT is reactive and unpredictable. Managed IT support is proactive and flat-fee. Here's how to know which model is right for your business.",
    readTime: "6 min read",
    date: "February 2026",
  },
  {
    slug: "what-is-ransomware-and-how-do-you-stop-it",
    tag: "Cybersecurity",
    title: "What Is Ransomware and How Do Small Businesses Actually Stop It?",
    excerpt: "Ransomware attacks on small businesses are up 300%. This is what it is, how it gets in, and the specific steps Sonoma County business owners can take to protect themselves.",
    readTime: "7 min read",
    date: "February 2026",
  },
  {
    slug: "why-your-google-business-profile-matters",
    tag: "Local SEO",
    title: "Why Your Google Business Profile Is the Most Important Page You Don't Own",
    excerpt: "Most Sonoma County small businesses ignore their Google Business Profile. Here's why it matters more than your website for local search, and exactly what to fix today.",
    readTime: "5 min read",
    date: "February 2026",
  },
  // January 2026
  {
    slug: "how-much-does-a-website-cost-for-a-small-business",
    tag: "Web Development",
    title: "How Much Does a Website Cost for a Small Business in 2026?",
    excerpt: "DIY, freelancer, or agency? We break down real website costs for small businesses in 2026 — and explain why the cheapest option often costs the most.",
    readTime: "7 min read",
    date: "January 2026",
  },
];

export default function BlogPage() {
  return (
    <div className="theme-dark min-h-screen bg-ink-0 text-white">
      <Nav />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden bg-ink-0 px-6 pt-20 pb-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(55% 45% at 20% 0%, rgba(221,170,117,0.10) 0%, rgba(221,170,117,0) 70%)",
            }}
          />
          <div className="mx-auto max-w-4xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-copper-dim bg-copper/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-copper-bright">
              Resources
            </span>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl">
              Practical tech advice for
              <br />
              <span className="text-copper-bright">Sonoma County businesses.</span>
            </h1>
            <p className="max-w-xl text-lg text-zinc-400">
              No jargon, no fluff. Just honest guidance on websites, IT, and security for local business owners.
            </p>
          </div>
        </section>

        {/* Posts — featured + category filter + grid (client) */}
        <BlogIndex posts={posts} />

        {/* CTA */}
        <section className="bg-ink-0 pb-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="rounded-2xl border border-copper-dim bg-ink-1 p-10 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-copper-bright">
                Want personalized advice?
              </p>
              <h3 className="mb-3 text-2xl font-bold text-white">Skip the reading — just ask us.</h3>
              <p className="mx-auto mb-6 max-w-md text-sm text-zinc-400">
                Free 30-minute consultation. We&apos;ll tell you exactly where you stand and what matters most for your business.
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full bg-copper px-6 py-3 text-sm font-bold text-ink-0 transition-colors hover:bg-copper-bright"
              >
                Get a Free Consultation <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
