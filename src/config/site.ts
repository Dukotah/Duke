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
export const GOOGLE_REVIEW_URL = "";
