/**
 * Generates the static brand raster assets that cannot be produced by Astro's
 * image pipeline: the Open Graph share card and the Apple touch icon.
 *
 * Run with `node scripts/generate-brand-assets.mjs` after changing the wordmark
 * or the tagline. Output is committed, so the build itself never needs this.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OG_DIR = join(root, 'public/images/og');

const INK = '#0b0d10';
const RED = '#d81f26';
const MUTED = '#a8b0bb';

// A grotesque stack that resolves on macOS, Linux CI and Windows alike.
const SANS = 'Helvetica Neue, Helvetica, Arial, Liberation Sans, DejaVu Sans, sans-serif';

/** 1200 × 630 Open Graph / Twitter card. */
function ogSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${INK}"/>

    <!-- Hairline grid, echoing the site's rule-based layout -->
    <g stroke="#ffffff" stroke-opacity="0.055" stroke-width="1">
      <line x1="0" y1="150" x2="1200" y2="150"/>
      <line x1="0" y1="480" x2="1200" y2="480"/>
      <line x1="864" y1="0" x2="864" y2="630"/>
    </g>

    <!-- Top accent bar -->
    <rect x="80" y="72" width="72" height="6" fill="${RED}"/>

    <text x="80" y="128" font-family="${SANS}" font-size="21" font-weight="700"
          letter-spacing="4.2" fill="${MUTED}">PRECISION COMPONENT MANUFACTURER</text>

    <!-- Wordmark -->
    <text x="80" y="285" font-family="${SANS}" font-size="106" font-weight="400"
          letter-spacing="-3.5" fill="#ffffff">Gupta</text>
    <text x="80" y="392" font-family="${SANS}" font-size="106" font-weight="700"
          letter-spacing="-4" fill="#ffffff">Enterprises</text>

    <!-- Tagline -->
    <text x="80" y="454" font-family="${SANS}" font-size="27" font-weight="400"
          fill="${MUTED}">Sheet-metal &amp; tubular components for the automotive industry</text>

    <!-- Credential strip -->
    <text x="80" y="546" font-family="${SANS}" font-size="20" font-weight="700"
          letter-spacing="2.6" fill="#ffffff">ISO 9001:2015</text>
    <text x="284" y="546" font-family="${SANS}" font-size="20" font-weight="400"
          letter-spacing="2.6" fill="#5a626d">EST. 2004  ·  FARIDABAD, INDIA</text>

    <!-- Figures panel, right of the vertical rule -->
    <g font-family="${SANS}" fill="#ffffff">
      <text x="920" y="245" font-size="58" font-weight="700" letter-spacing="-2">35</text>
      <text x="920" y="275" font-size="17" font-weight="400" fill="${MUTED}">POWER PRESSES</text>
      <text x="920" y="360" font-size="58" font-weight="700" letter-spacing="-2">100%</text>
      <text x="920" y="390" font-size="17" font-weight="400" fill="${MUTED}">INSPECTED</text>
    </g>

    <!-- Bottom progress rule, as on the profile deck -->
    <rect x="0" y="624" width="1200" height="6" fill="#191d23"/>
    <rect x="0" y="624" width="300" height="6" fill="${RED}"/>
  </svg>`;
}

/** 180 × 180 Apple touch icon. */
function touchIconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
    <rect width="180" height="180" fill="${INK}"/>
    <rect x="26" y="26" width="52" height="7" fill="${RED}"/>
    <text x="90" y="126" font-family="${SANS}" font-size="76" font-weight="700"
          letter-spacing="-3" fill="#ffffff" text-anchor="middle">GE</text>
  </svg>`;
}

await mkdir(OG_DIR, { recursive: true });

await sharp(Buffer.from(ogSvg()))
  .png({ compressionLevel: 9 })
  .toFile(join(OG_DIR, 'og-default.png'));

await sharp(Buffer.from(touchIconSvg()))
  .png({ compressionLevel: 9 })
  .toFile(join(root, 'public/apple-touch-icon.png'));

console.log('Wrote public/images/og/og-default.png and public/apple-touch-icon.png');
