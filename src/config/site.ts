// ── Update CALENDLY_URL with your actual Calendly link ───────────────────────
// Create a free account at calendly.com and paste the 30-min meeting link here.
export const CALENDLY_URL = "https://calendly.com/copperbaytech/free-consultation";

export const SITE_URL = "https://copperbaytech.com";
export const PHONE = "(707) 239-6725";
export const PHONE_HREF = "tel:+17072396725";
export const EMAIL = "duke@copperbaytech.com";

// The address outreach is sent from. Must be a verified domain in Resend.
export const OUTREACH_FROM = "contact@copperbaytech.com";

// CAN-SPAM requires a real physical postal address in every *marketing* email.
// A digital agency doesn't need a street office — just a deliverable postal
// address (a P.O. Box or virtual mailbox). Set it via the MAILING_ADDRESS env
// var in your host so it can change without a code deploy. Until it's set, live
// cold outreach stays gated (see the guard in src/app/api/crm/outreach/route.ts)
// so no non-compliant mail can go out.
export const MAILING_ADDRESS = (process.env.MAILING_ADDRESS ?? "").trim();
export const hasMailingAddress = MAILING_ADDRESS.length > 0;
