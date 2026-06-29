// Where every "Book a Free Call" CTA points. Currently the on-site /schedule
// page (captures the lead via email and confirms manually). If you create a
// real Calendly/Cal.com account, just paste that URL here and every booking
// button across the site switches over — no other code changes needed.
// (The old hardcoded calendly.com/copperbaytech/free-consultation link 404'd.)
export const BOOKING_URL = "/schedule";

export const SITE_URL = "https://copperbaytech.com";
export const PHONE = "(707) 239-6725";
export const PHONE_HREF = "tel:+17072396725";
export const EMAIL = "contact@copperbaytech.com";

// ── Business identity / NAP — SINGLE SOURCE OF TRUTH ─────────────────────────
// Name-Address-Phone must stay byte-for-byte identical everywhere it appears:
// this file, the JSON-LD schema (JsonLd.tsx, Footer.tsx), the Google Business
// Profile, and every directory listing. Inconsistent NAP is the #1 reason AI
// assistants and search engines fail to merge your mentions into ONE entity —
// which is exactly what turns an anonymous source link ("ghost citation") into
// your *name* actually being spoken in an AI answer. Change it here, once.
export const BUSINESS_NAME = "Copper Bay Tech";
export const PHONE_E164 = "+17072396725"; // canonical form for schema / tel:

// Service-area business (no public storefront). We publish CITY + region +
// postal + geo — enough for local-pack / "near me" relevance — but deliberately
// NOT a street address: Google's guidelines say service-area businesses should
// hide the street address, and 422 Larkfield Ctr is a mail suite, not a
// walk-in office. The locality MUST match the city set on the GBP.
export const ADDRESS_LOCALITY = "Santa Rosa";
export const ADDRESS_REGION = "CA";
export const POSTAL_CODE = "95403";
export const ADDRESS_COUNTRY = "US";
export const GEO = { latitude: 38.4405, longitude: -122.7144 } as const; // Sonoma County
export const OPENING_HOURS = {
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  opens: "09:00",
  closes: "18:00",
} as const;

// The address outreach is sent from. Must be a verified domain in Resend.
export const OUTREACH_FROM = "contact@copperbaytech.com";

// CAN-SPAM requires a real physical postal address in every marketing email.
export const MAILING_ADDRESS = "Copper Bay Tech, 422 Larkfield Ctr, Santa Rosa, CA 95403";

// Your Google Business Profile "write a review" short link. Get it from the
// GBP dashboard ("Ask for reviews" → copy link), or build it as
// https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID
// When set, a "Leave a review" CTA appears on /reviews to funnel happy clients
// to Google — the single highest-leverage thing for local map-pack ranking.
// Leave "" until your GBP is live so we never link to a dead page.
export const GOOGLE_REVIEW_URL = "https://g.page/r/CXQuv4G7yohZEBM/review";

// Profiles & directory listings. Paste a full URL to (a) render the footer icon
// where one exists and (b) feed schema `sameAs` — the list that tells Google/AI
// "all of these profiles are the SAME entity." Leave "" to omit; we never emit a
// link/sameAs to a profile that doesn't exist (a dead or wrong sameAs corrupts
// the entity graph).
//
// WHY THIS MATTERS MORE THAN ANYTHING ON THE PAGE: across 23,387 AI citations
// (Omniscient Digital, 2025), reviews + listicles + forums earned 57% and
// directory/reference profiles (Crunchbase, Clutch, GBP, etc.) 17%, while a
// brand's own About/home pages earned ~2% each. Filling these in — i.e. creating
// the profiles off-site, then pasting the URLs here — is the single highest-
// leverage move for getting NAMED in AI answers. See AI-VISIBILITY-PLAYBOOK.md.
export const SOCIAL = {
  linkedin: "https://www.linkedin.com/in/dukotahhutcheon/",
  facebook: "",
  instagram: "",
  x: "",
  github: "",
  // ↓ Directory / entity-graph profiles — create these, then paste the URL.
  googleBusiness: "", // public GBP URL (g.page/... or maps.google.com/?cid=...)
  crunchbase: "",
  clutch: "",
  goodfirms: "",
  yelp: "",
} as const;

// Convenience: the non-empty profile URLs, for schema `sameAs`. Order is curated
// (most authoritative first) since some consumers display only the first few.
export const SOCIAL_URLS: string[] = Object.values(SOCIAL).filter(Boolean);
