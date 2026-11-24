// Deterministic headless Chromium frame capture for Stickman 3D Kit.
//   node render/capture.mjs stills --episode tembok-putih-nobar --fps 24 --w 720 --h 1280
//   node render/capture.mjs full   --episode tembok-putih-nobar --frames 2371 --fps 24 --w 720 --h 1280
import { chromium } from 'playwright-core';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const argv = process.argv.slice(2);
const mode = argv[0] ?? 'stills';
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

const episode = arg('episode', 'tembok-putih-nobar');
const framesArg = arg('frames', null);
const fps = Number(arg('fps', 24));
const width = Number(arg('w', 720));
const height = Number(arg('h', 1280));
const base = arg('url', 'http://127.0.0.1:5173');
const chromePath = process.env.CHROME_PATH || '/usr/bin/chromium';

const url = `${base}/render/index.html?episode=${encodeURIComponent(episode)}${framesArg ? `&frames=${framesArg}` : ''}&fps=${fps}&w=${width}&h=${height}`;

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--disable-gpu',
  ],
});

try {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  page.on('pageerror', (err) => console.error('PAGEERROR', err.message));
  page.on('console', (msg) => msg.type() === 'error' && console.error('CONSOLE', msg.text()));
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__ready !== undefined, { timeout: 30000 });
  await page.evaluate(() => window.__ready);

  const meta = await page.evaluate(() => window.__meta || {});
  const total = Number(meta.frames || framesArg || 240);

  async function snap(f, folder, label = String(f).padStart(4, '0')) {
    await page.evaluate((frame) => window.__frame(frame), f);
    const outPath = `${folder}/f${label}.png`;
    await page.screenshot({ path: outPath });
    return outPath;
  }

  if (mode === 'stills') {
    await mkdir('stills/determinism', { recursive: true });
    const seen = new Set();
    const sampleList = [];
    const hookF = Math.min(total - 1, Math.round(1.2 * fps));
    sampleList.push({ f: hookF, label: '01-hook' });
    seen.add(hookF);
    for (const b of meta.beats || []) {
      const f = Math.min(total - 1, Math.max(0, b.midFrame));
      if (!seen.has(f)) {
        sampleList.push({ f, label: b.id });
        seen.add(f);
      }
    }

    const captured = [];
    for (const item of sampleList) {
      const file = await snap(item.f, 'stills');
      captured.push({ ...item, file });
    }

    // Determinism gate (A/B + mid-after-last)
    const mid = Math.floor(total / 2);
    await snap(mid, 'stills/determinism', 'mida');
    await snap(mid, 'stills/determinism', 'midb');
    await snap(total - 1, 'stills/determinism', 'last');
    await snap(mid, 'stills/determinism', 'midafterlast');

    // Compose labeled 4-column contact sheet PNG
    const tiles = [];
    for (const c of captured) {
      const buf = await readFile(c.file);
      tiles.push({
        label: `${c.label} (f${c.f} / ${(c.f / fps).toFixed(1)}s)`,
        dataUrl: `data:image/png;base64,${buf.toString('base64')}`,
      });
    }
    const sheetDataUrl = await page.evaluate(
      async ({ tiles, tileW, tileH }) => {
        const cols = Math.min(4, tiles.length);
        const rows = Math.ceil(tiles.length / cols);
        const pad = 14;
        const labelH = 26;
        const canvas = document.createElement('canvas');
        canvas.width = cols * tileW + (cols + 1) * pad;
        canvas.height = rows * (tileH + labelH) + (rows + 1) * pad;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#0f131c';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < tiles.length; i++) {
          const img = new Image();
          img.src = tiles[i].dataUrl;
          await img.decode();
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = pad + col * (tileW + pad);
          const y = pad + row * (tileH + labelH + pad);
          ctx.drawImage(img, x, y, tileW, tileH);
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, tileW, tileH);
          ctx.fillStyle = '#e2e8f0';
          ctx.font = '700 13px monospace';
          ctx.fillText(tiles[i].label, x + 4, y + tileH + 18, tileW - 8);
        }
        return canvas.toDataURL('image/png');
      },
      { tiles, tileW: Math.round(width * 0.5), tileH: Math.round(height * 0.5) }
    );
    await writeFile('stills/contact-sheet.png', Buffer.from(sheetDataUrl.replace(/^data:image\/png;base64,/, ''), 'base64'));
    console.log(`stills: ${captured.map((c) => c.f).join(',')} (contact sheet: stills/contact-sheet.png)`);
  } else if (mode === 'full') {
    await mkdir('frames', { recursive: true });
    for (let f = 0; f < total; f++) {
      await snap(f, 'frames');
      if (f % 60 === 59 || f === total - 1) console.log(`captured ${f + 1}/${total}`);
    }
  } else {
    throw new Error('Expected stills or full');
  }
} finally {
  await browser.close();
}
