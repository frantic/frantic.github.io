#!/usr/bin/env node

// OG Image Generator — zero dependencies
// Generates 1200x630 black-on-white density art PNGs seeded by title.
// Usage: ./scripts/og-image.js "Post Title" output.png
//        ./scripts/og-image.js --all (generates for all posts)

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// --- Config ---
const W = 1200;
const H = 630;
const COLS = 65;
const ROWS = 30;
const MARGIN_X = 30;
const MARGIN_Y = 30;

// Warm Paper palette
const BG = { r: 0xf0, g: 0xeb, b: 0xe3 };  // #f0ebe3
const INK = { r: 0x2d, g: 0x29, b: 0x26 }; // #2d2926

// --- PRNG (mulberry32) ---
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++)
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h;
}

// --- Value noise ---
function makeNoise(rng) {
  const size = 256;
  const grid = [];
  for (let i = 0; i < size * size; i++) grid[i] = rng();
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function smooth(t) {
    return t * t * (3 - 2 * t);
  }
  return function (x, y) {
    const xi = Math.floor(x) & (size - 1);
    const yi = Math.floor(y) & (size - 1);
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const sx = smooth(xf);
    const sy = smooth(yf);
    const g = (r, c) =>
      grid[((yi + r) & (size - 1)) * size + ((xi + c) & (size - 1))];
    return lerp(lerp(g(0, 0), g(0, 1), sx), lerp(g(1, 0), g(1, 1), sx), sy);
  };
}

// --- Minimal PNG encoder ---
function encodePNG(width, height, pixels) {
  // pixels is Uint8Array of length width*height*3 (RGB)
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = c ^ buf[i];
      for (let j = 0; j < 8; j++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeB = Buffer.from(type, 'ascii');
    const crcInput = Buffer.concat([typeB, data]);
    const crcB = Buffer.alloc(4);
    crcB.writeUInt32BE(crc32(crcInput), 0);
    return Buffer.concat([len, typeB, data, crcB]);
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // IDAT - raw pixel data with filter byte per row
  const rowBytes = width * 3;
  const raw = Buffer.alloc(height * (1 + rowBytes));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + rowBytes)] = 0; // no filter
    for (let x = 0; x < rowBytes; x++) {
      raw[y * (1 + rowBytes) + 1 + x] = pixels[y * rowBytes + x];
    }
  }
  const compressed = zlib.deflateSync(raw);

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- Glyph rasterizer (no fonts needed) ---
// Each glyph is drawn into a cell as simple geometry
// pixels is RGB buffer, we blend ink color at given opacity
function drawGlyph(pixels, imgW, cx, cy, cellW, cellH, weight) {
  // weight: 0-6 mapping to visual density
  if (weight <= 0) return;

  const hw = Math.floor(cellW / 2);
  const hh = Math.floor(cellH / 2);

  function blendPixel(x, y, opacity) {
    if (x < 0 || x >= imgW || y < 0 || y >= H) return;
    const idx = (y * imgW + x) * 3;
    const a = opacity;
    pixels[idx]     = Math.round(pixels[idx]     + (INK.r - pixels[idx])     * a);
    pixels[idx + 1] = Math.round(pixels[idx + 1] + (INK.g - pixels[idx + 1]) * a);
    pixels[idx + 2] = Math.round(pixels[idx + 2] + (INK.b - pixels[idx + 2]) * a);
  }

  function fillCircle(x0, y0, r, opacity) {
    const r2 = r * r;
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy <= r2) blendPixel(x0 + dx, y0 + dy, opacity);
      }
    }
  }

  function hLine(x0, y0, len, opacity) {
    for (let i = 0; i < len; i++) blendPixel(x0 + i, y0, opacity);
  }
  function vLine(x0, y0, len, opacity) {
    for (let i = 0; i < len; i++) blendPixel(x0, y0 + i, opacity);
  }

  switch (weight) {
    case 1: // tiny dot
      fillCircle(cx, cy, 1, 0.3);
      break;
    case 2: // small dot
      fillCircle(cx, cy, 2, 0.45);
      break;
    case 3: // cross thin
      hLine(cx - hw + 2, cy, cellW - 4, 0.5);
      vLine(cx, cy - hh + 2, cellH - 4, 0.5);
      break;
    case 4: // cross thick
      for (let t = -1; t <= 1; t++) {
        hLine(cx - hw + 1, cy + t, cellW - 2, 0.6);
        vLine(cx + t, cy - hh + 1, cellH - 2, 0.6);
      }
      break;
    case 5: // hash
      for (let t = -1; t <= 1; t++) {
        hLine(cx - hw + 1, cy - 2 + t, cellW - 2, 0.7);
        hLine(cx - hw + 1, cy + 2 + t, cellW - 2, 0.7);
        vLine(cx - 2 + t, cy - hh + 1, cellH - 2, 0.7);
        vLine(cx + 2 + t, cy - hh + 1, cellH - 2, 0.7);
      }
      break;
    case 6: // filled block
      for (let dy = -hh + 1; dy < hh; dy++) {
        hLine(cx - hw + 1, cy + dy, cellW - 2, 0.85);
      }
      break;
  }
}

// --- Generate OG image ---
function generateOG(title, style) {
  style = style || 'turbulent'; // 'turbulent' or 'radial'
  const seed = hashStr(title);
  const rng = mulberry32(seed);
  const noise = makeNoise(rng);

  const pixels = new Uint8Array(W * H * 3);
  // Fill with background color
  for (let i = 0; i < W * H; i++) {
    pixels[i * 3]     = BG.r;
    pixels[i * 3 + 1] = BG.g;
    pixels[i * 3 + 2] = BG.b;
  }

  const cellW = Math.floor((W - MARGIN_X * 2) / COLS);
  const cellH = Math.floor((H - MARGIN_Y * 2) / ROWS);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let n;
      if (style === 'radial') {
        // Radial: density from seeded center
        const cxNorm = 0.2 + noise(seed * 0.001, 0) * 0.6;
        const cyNorm = 0.2 + noise(0, seed * 0.001) * 0.6;
        const dx = c / COLS - cxNorm;
        const dy = r / ROWS - cyNorm;
        const dist = Math.sqrt(dx * dx + dy * dy) * 2.5;
        const nv = noise(c * 0.1, r * 0.1);
        n = Math.max(0, Math.min(1, 1 - dist + (nv - 0.5) * 0.6));
      } else {
        // Turbulent: layered octaves
        const n1 = noise(c * 0.05, r * 0.05);
        const n2 = noise(c * 0.12, r * 0.12);
        const n3 = noise(c * 0.25, r * 0.25);
        n = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
      }

      const weight = Math.floor(n * 7); // 0-6
      const cx = MARGIN_X + c * cellW + Math.floor(cellW / 2);
      const cy = MARGIN_Y + r * cellH + Math.floor(cellH / 2);
      drawGlyph(pixels, W, cx, cy, cellW, cellH, weight);
    }
  }

  return encodePNG(W, H, pixels);
}

// --- CLI ---
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args[0] === '--all') {
    // Generate for all posts
    const postsDir = path.join(__dirname, '..', '_posts');
    const notesDir = path.join(__dirname, '..', '_notes');
    const outDir = path.join(__dirname, '..', 'assets', 'og');
    fs.mkdirSync(outDir, { recursive: true });

    const files = [];
    if (fs.existsSync(postsDir))
      files.push(
        ...fs.readdirSync(postsDir).map((f) => path.join(postsDir, f))
      );
    if (fs.existsSync(notesDir))
      files.push(
        ...fs.readdirSync(notesDir).map((f) => path.join(notesDir, f))
      );

    let count = 0;
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const content = fs.readFileSync(file, 'utf8');
      const titleMatch = content.match(/^title:\s*["']?(.+?)["']?\s*$/m);
      const permalinkMatch = content.match(/^permalink:\s*\/?(.+?)\s*$/m);
      const slugMatch = content.match(/^slug:\s*["']?(.+?)["']?\s*$/m);
      const fileSlug = path.basename(file, '.md').replace(/^\d{4}-\d{2}-\d{2}-/, '');
      const slug = permalinkMatch ? permalinkMatch[1] : (slugMatch ? slugMatch[1] : fileSlug);
      const title = titleMatch ? titleMatch[1] : slug;

      // Alternate styles based on title hash
      const style = hashStr(title) % 2 === 0 ? 'turbulent' : 'radial';
      const png = generateOG(title, style);
      const outFile = path.join(outDir, slug + '.png');
      fs.writeFileSync(outFile, png);
      count++;
    }
    console.log(`Generated ${count} OG images in assets/og/`);
  } else if (args.length >= 1) {
    const title = args[0];
    const style = args[2] || 'turbulent';
    const outFile = args[1] || 'og-image.png';
    const png = generateOG(title, style);
    fs.writeFileSync(outFile, png);
    console.log(`Generated ${outFile} (${png.length} bytes)`);
  } else {
    console.log('Usage:');
    console.log('  ./scripts/og-image.js "Post Title" [output.png] [turbulent|radial]');
    console.log('  ./scripts/og-image.js --all');
  }
}

module.exports = { generateOG, hashStr };
