import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const logosDir = join(__dirname, '../public/logos');

const logos = [
  { input: 'logo-square.svg',     output: 'logo-square.png',     width: 500,  height: 500  },
  { input: 'logo-horizontal.svg', output: 'logo-horizontal.png', width: 1080, height: 680  },
  { input: 'logo-icon.svg',       output: 'logo-icon.png',       width: 250,  height: 250  },
  { input: 'logo-white.svg',      output: 'logo-white.png',      width: 500,  height: 180  },
];

for (const logo of logos) {
  const svgBuffer = readFileSync(join(logosDir, logo.input));
  await sharp(svgBuffer)
    .resize(logo.width, logo.height)
    .png()
    .toFile(join(logosDir, logo.output));
  console.log(`✓ ${logo.output}`);
}

console.log('All PNGs generated.');
