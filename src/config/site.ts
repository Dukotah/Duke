// ── Update CALENDLY_URL with your actual Calendly link ───────────────────────
// Create a free account at calendly.com and paste the 30-min meeting link here.
export const CALENDLY_URL = "https://calendly.com/copperbaytech/free-consultation";

export const SITE_URL = "https://copperbaytech.com";
export const PHONE = "(707) 239-6725";
export const PHONE_HREF = "tel:+17072396725";
export const EMAIL = "contact@copperbaytech.com";

// The address outreach is sent from. Must be a verified domain in Resend.
export const OUTREACH_FROM = "contact@copperbaytech.com";

// The business name and city used everywhere (Footer, JSON-LD, etc.). This is
// the single source of truth for NAP (Name / Address / Phone) consistency.
export const BUSINESS_NAME = "Copper Bay Tech";
export const CITY = "Santa Rosa";
export const REGION = "CA";
export const COUNTRY = "US";

// CAN-SPAM requires a real physical postal address in every marketing email.
// TODO(human): real CAN-SPAM postal address — drop in the full Santa Rosa PO Box,
//   e.g. "Copper Bay Tech, PO Box 1234, Santa Rosa, CA 95402".
// Interim city-level value below removes the incorrect Petaluma address; replace
// it with the full PO Box line to be fully CAN-SPAM compliant before sending.
export const MAILING_ADDRESS = "Copper Bay Tech, Santa Rosa, CA";
