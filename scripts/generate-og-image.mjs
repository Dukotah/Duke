import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '../public/og-image.png');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#18181B"/>

  <!-- Orange accent bar -->
  <rect x="100" y="300" width="120" height="8" fill="#F97316" rx="4"/>

  <!-- Brand text -->
  <text x="100" y="250" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="120" fill="#FFFFFF" letter-spacing="-3">COPPER BAY</text>
  <text x="100" y="400" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="120" fill="#F97316" letter-spacing="-3">TECH</text>

  <!-- Tagline -->
  <text x="105" y="470" font-family="Arial, sans-serif" font-weight="400" font-size="34" fill="#FFFFFF" opacity="0.55" letter-spacing="6">IT &amp; WEB DEVELOPMENT &#183; SONOMA COUNTY</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log('✓ public/og-image.png generated (1200x630).');
