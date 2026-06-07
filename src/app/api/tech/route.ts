import { NextRequest, NextResponse } from "next/server";
import { validateAuditUrl } from "@/lib/validate-url";

interface TechItem {
  name: string;
  category: string;
  confidence: "high" | "medium" | "low";
}

const SIGNATURES: Array<{
  name: string;
  category: string;
  headerPatterns?: Array<[string, RegExp]>;
  htmlPatterns?: RegExp[];
  confidence: "high" | "medium" | "low";
}> = [
  // CMS
  { name: "WordPress", category: "CMS", htmlPatterns: [/wp-content\//i, /wp-includes\//i, /\/wp-json\//i], confidence: "high" },
  { name: "Shopify", category: "E-commerce", htmlPatterns: [/cdn\.shopify\.com/i, /Shopify\.theme/i], headerPatterns: [["x-shopify-stage", /.*/]], confidence: "high" },
  { name: "Wix", category: "CMS", htmlPatterns: [/static\.wixstatic\.com/i, /wix\.com\/lpviral/i], confidence: "high" },
  { name: "Squarespace", category: "CMS", htmlPatterns: [/squarespace\.com/i, /static1\.squarespace\.com/i], confidence: "high" },
  { name: "Webflow", category: "CMS", htmlPatterns: [/webflow\.com/i, /assets\.website-files\.com/i], confidence: "high" },
  { name: "Ghost", category: "CMS", htmlPatterns: [/ghost\.org/i, /content\/themes\//i, /"generator" content="Ghost/i], confidence: "high" },
  { name: "Drupal", category: "CMS", htmlPatterns: [/drupal\.js/i, /Drupal\.settings/i, /\/sites\/default\/files\//i], headerPatterns: [["x-generator", /Drupal/i]], confidence: "high" },
  { name: "Joomla", category: "CMS", htmlPatterns: [/\/media\/jui\//i, /Joomla!/i], confidence: "high" },

  // Frameworks
  { name: "Next.js", category: "Framework", headerPatterns: [["x-powered-by", /Next\.js/i]], htmlPatterns: [/__NEXT_DATA__/i, /\/_next\/static\//i], confidence: "high" },
  { name: "Nuxt.js", category: "Framework", htmlPatterns: [/__nuxt/i, /_nuxt\//i], confidence: "high" },
  { name: "React", category: "Framework", htmlPatterns: [/react(?:\.min)?\.js/i, /data-reactroot/i, /data-reactid/i], confidence: "medium" },
  { name: "Vue.js", category: "Framework", htmlPatterns: [/vue(?:\.min)?\.js/i, /data-v-/i, /__vue__/i], confidence: "medium" },
  { name: "Angular", category: "Framework", htmlPatterns: [/angular(?:\.min)?\.js/i, /ng-version=/i, /\[\(ngModel\)\]/i], confidence: "medium" },
  { name: "Svelte", category: "Framework", htmlPatterns: [/svelte/i, /class="s-/], confidence: "low" },

  // CDN / Hosting
  { name: "Cloudflare", category: "CDN", headerPatterns: [["cf-ray", /.*/], ["server", /cloudflare/i]], confidence: "high" },
  { name: "Vercel", category: "Hosting", headerPatterns: [["x-vercel-id", /.*/], ["server", /Vercel/i]], confidence: "high" },
  { name: "Netlify", category: "Hosting", headerPatterns: [["x-nf-request-id", /.*/], ["server", /Netlify/i]], confidence: "high" },
  { name: "AWS CloudFront", category: "CDN", headerPatterns: [["via", /CloudFront/i], ["x-amz-cf-id", /.*/]], confidence: "high" },
  { name: "Fastly", category: "CDN", headerPatterns: [["x-served-by", /cache-/i], ["x-fastly-request-id", /.*/]], confidence: "high" },
  { name: "Google Cloud", category: "Hosting", headerPatterns: [["server", /gws/i], ["x-guploader-uploadid", /.*/]], confidence: "medium" },

  // Analytics
  { name: "Google Analytics", category: "Analytics", htmlPatterns: [/google-analytics\.com\/analytics\.js/i, /gtag\('config'/i, /UA-\d+-\d+/i, /G-[A-Z0-9]+/i], confidence: "high" },
  { name: "Google Tag Manager", category: "Analytics", htmlPatterns: [/googletagmanager\.com\/gtm\.js/i, /GTM-[A-Z0-9]+/i], confidence: "high" },
  { name: "Meta Pixel", category: "Analytics", htmlPatterns: [/connect\.facebook\.net\/.*\/fbevents\.js/i, /fbq\('init'/i], confidence: "high" },
  { name: "Hotjar", category: "Analytics", htmlPatterns: [/hotjar\.com/i, /hj\('trigger'/i], confidence: "high" },
  { name: "Segment", category: "Analytics", htmlPatterns: [/cdn\.segment\.com/i, /analytics\.identify\(/i], confidence: "high" },
  { name: "HubSpot", category: "CRM / Marketing", htmlPatterns: [/js\.hs-scripts\.com/i, /hubspot\.com/i], confidence: "high" },
  { name: "Intercom", category: "Support", htmlPatterns: [/widget\.intercom\.io/i, /Intercom\(/i], confidence: "high" },

  // JS Libraries
  { name: "jQuery", category: "Library", htmlPatterns: [/jquery(?:\.min)?\.js/i, /jquery-\d/i], confidence: "medium" },
  { name: "Tailwind CSS", category: "CSS Framework", htmlPatterns: [/tailwindcss/i, /class="[^"]*(?:flex|grid|px-|py-|text-|bg-)[^"]*"/i], confidence: "low" },
  { name: "Bootstrap", category: "CSS Framework", htmlPatterns: [/bootstrap(?:\.min)?\.css/i, /bootstrap(?:\.min)?\.js/i, /class="[^"]*(?:btn btn-|col-md-|navbar-)[^"]*"/i], confidence: "medium" },
  { name: "Font Awesome", category: "Icons", htmlPatterns: [/font-awesome/i, /fontawesome/i, /fa fa-|fas fa-|fab fa-/i], confidence: "high" },
  { name: "Google Fonts", category: "Fonts", htmlPatterns: [/fonts\.googleapis\.com/i], confidence: "high" },

  // E-commerce
  { name: "WooCommerce", category: "E-commerce", htmlPatterns: [/woocommerce/i, /\/cart\//i, /add-to-cart/i], confidence: "medium" },
  { name: "Stripe", category: "Payments", htmlPatterns: [/js\.stripe\.com/i, /Stripe\(/i], confidence: "high" },
  { name: "PayPal", category: "Payments", htmlPatterns: [/paypal\.com\/sdk/i, /PayPalButton/i], confidence: "high" },

  // Server
  { name: "Nginx", category: "Web Server", headerPatterns: [["server", /nginx/i]], confidence: "high" },
  { name: "Apache", category: "Web Server", headerPatterns: [["server", /apache/i]], confidence: "high" },
  { name: "Express", category: "Web Server", headerPatterns: [["x-powered-by", /express/i]], confidence: "high" },
  { name: "PHP", category: "Language", headerPatterns: [["x-powered-by", /php/i]], htmlPatterns: [/\.php(\?|")/i], confidence: "high" },

  // Security / Performance
  { name: "reCAPTCHA", category: "Security", htmlPatterns: [/google\.com\/recaptcha/i, /grecaptcha/i], confidence: "high" },
  { name: "Cloudflare Turnstile", category: "Security", htmlPatterns: [/challenges\.cloudflare\.com\/turnstile/i], confidence: "high" },
];

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    const validated = validateAuditUrl(url);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.reason }, { status: 400 });
    }
    const normalizedUrl = validated.url;

    let html = "";
    let responseHeaders: Headers;
    try {
      const res = await fetch(normalizedUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
        signal: AbortSignal.timeout(10000),
        redirect: "follow",
      });
      html = await res.text();
      responseHeaders = res.headers;
    } catch {
      return NextResponse.json({ error: "Failed to fetch URL" }, { status: 502 });
    }

    const detected: TechItem[] = [];
    const seen = new Set<string>();

    for (const sig of SIGNATURES) {
      if (seen.has(sig.name)) continue;
      let matched = false;

      if (sig.headerPatterns) {
        for (const [headerName, pattern] of sig.headerPatterns) {
          const val = responseHeaders.get(headerName) ?? "";
          if (pattern.test(val)) { matched = true; break; }
        }
      }

      if (!matched && sig.htmlPatterns) {
        for (const pattern of sig.htmlPatterns) {
          if (pattern.test(html)) { matched = true; break; }
        }
      }

      if (matched) {
        detected.push({ name: sig.name, category: sig.category, confidence: sig.confidence });
        seen.add(sig.name);
      }
    }

    // Group by category
    const categories = [...new Set(detected.map(t => t.category))];

    return NextResponse.json({ url: normalizedUrl, detected, categories, count: detected.length });
  } catch {
    return NextResponse.json({ error: "Failed to detect tech stack" }, { status: 500 });
  }
}
