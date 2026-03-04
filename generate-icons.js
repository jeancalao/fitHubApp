// ============================================================
//  FitHub — Gerador de ícones PNG para PWA
//  Uso: node generate-icons.js
// ============================================================

const fs   = require('fs');
const path = require('path');
const zlib = require('zlib');

const SIZES = [72, 96, 128, 192, 512];
const OUT_DIR = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ---- PNG builder (pure Node.js, sem dependências externas) ----

function uint32BE(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n, 0);
  return b;
}

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (const byte of buf) {
    c ^= byte;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf  = uint32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([uint32BE(data.length), typeBuf, data, crcBuf]);
}

function buildPNG(size, bgR, bgG, bgB, drawFn) {
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8]  = 8;  // bit depth
  ihdr[9]  = 2;  // color type RGB
  ihdr[10] = ihdr[11] = ihdr[12] = 0;

  // Build raw image rows: each row = filter-byte(0) + RGB pixels
  const pixels = Buffer.alloc(size * size * 3);
  // Fill background
  for (let i = 0; i < size * size; i++) {
    pixels[i * 3]     = bgR;
    pixels[i * 3 + 1] = bgG;
    pixels[i * 3 + 2] = bgB;
  }

  // Let caller draw on pixels
  if (drawFn) drawFn(pixels, size);

  // Build raw rows with filter byte
  const rows = Buffer.alloc(size * (1 + size * 3));
  for (let y = 0; y < size; y++) {
    rows[y * (1 + size * 3)] = 0; // filter None
    pixels.copy(rows, y * (1 + size * 3) + 1, y * size * 3, (y + 1) * size * 3);
  }

  const compressed = zlib.deflateSync(rows, { level: 6 });
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
  return png;
}

function setPixel(pixels, size, x, y, r, g, b) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  const i = (y * size + x) * 3;
  pixels[i] = r; pixels[i + 1] = g; pixels[i + 2] = b;
}

function fillCircle(pixels, size, cx, cy, radius, r, g, b) {
  for (let y = Math.max(0, cy - radius); y <= Math.min(size - 1, cy + radius); y++) {
    for (let x = Math.max(0, cx - radius); x <= Math.min(size - 1, cx + radius); x++) {
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy <= radius * radius) setPixel(pixels, size, x, y, r, g, b);
    }
  }
}

function fillRect(pixels, size, x1, y1, w, h, r, g, b) {
  for (let y = y1; y < y1 + h; y++) {
    for (let x = x1; x < x1 + w; x++) setPixel(pixels, size, x, y, r, g, b);
  }
}

// Draw a simple dumbbell icon (white) centered on the icon
function drawDumbbell(pixels, size) {
  const s = size;
  const u = s / 64; // scale unit (1u = 1px at 64px)

  // Bar (horizontal)
  const barY  = Math.round(s * 0.5 - 3 * u);
  const barH  = Math.round(6 * u);
  const barX  = Math.round(s * 0.18);
  const barW  = Math.round(s * 0.64);
  fillRect(pixels, s, barX, barY, barW, barH, 255, 255, 255);

  // Left weight discs
  const discW  = Math.round(9 * u);
  const discH  = Math.round(22 * u);
  const discY  = Math.round(s / 2 - discH / 2);
  fillRect(pixels, s, Math.round(s * 0.14), discY, discW, discH, 255, 255, 255);
  fillRect(pixels, s, Math.round(s * 0.14) + Math.round(3 * u), discY + Math.round(3 * u),
    discW - Math.round(6 * u), discH - Math.round(6 * u), 76, 175, 80);

  // Right weight discs
  const rxBase = Math.round(s * 0.77);
  fillRect(pixels, s, rxBase, discY, discW, discH, 255, 255, 255);
  fillRect(pixels, s, rxBase + Math.round(3 * u), discY + Math.round(3 * u),
    discW - Math.round(6 * u), discH - Math.round(6 * u), 76, 175, 80);

  // Handles (grip zones)
  fillRect(pixels, s, Math.round(s * 0.23), barY - Math.round(2 * u),
    Math.round(6 * u), barH + Math.round(4 * u), 230, 230, 230);
  fillRect(pixels, s, Math.round(s * 0.71), barY - Math.round(2 * u),
    Math.round(6 * u), barH + Math.round(4 * u), 230, 230, 230);
}

// ---- Generate all sizes ----
SIZES.forEach(size => {
  const png = buildPNG(size, 76, 175, 80, drawDumbbell);
  const outPath = path.join(OUT_DIR, `icon-${size}.png`);
  fs.writeFileSync(outPath, png);
  console.log(`✓ icon-${size}.png (${png.length} bytes)`);
});

console.log('\nÍcones criados em public/icons/ ✅');
