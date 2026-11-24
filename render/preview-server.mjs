import express from 'express';
import fs from 'node:fs';
import path from 'node:path';

const app = express();
const root = process.cwd();
const port = Number(process.env.PREVIEW_PORT || 8080);

app.get('/', (_req, res) => {
  const outDir = path.join(root, 'out');
  const mp4s = fs.existsSync(outDir)
    ? fs
        .readdirSync(outDir)
        .filter((f) => f.endsWith('.mp4'))
        .sort((a, b) => fs.statSync(path.join(outDir, b)).mtimeMs - fs.statSync(path.join(outDir, a)).mtimeMs)
    : [];
  const featured = mp4s[0] || '';
  const slug = featured.replace(/\.mp4$/, '');

  const listHtml = mp4s
    .map((f) => {
      const mb = (fs.statSync(path.join(outDir, f)).size / (1024 * 1024)).toFixed(1);
      return `<a class="btn sec" href="/out/${encodeURIComponent(f)}" download="${f}">${f} (${mb} MB)</a>`;
    })
    .join('\n');

  res.type('html').send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Stickman 3D Kit — ${slug || 'Preview'}</title>
<style>
  body { margin:0; font-family: system-ui, sans-serif; background:#0b101b; color:#f1f5f9; display:flex; flex-direction:column; align-items:center; padding:24px 16px; gap:18px; }
  h1 { font-size:20px; margin:0; text-align:center; }
  .sub { color:#94a3b8; font-size:13px; text-align:center; }
  video { width:100%; max-width:380px; border-radius:16px; border:2px solid #334155; background:#000; box-shadow:0 16px 40px rgba(0,0,0,.55); }
  .btns { display:flex; flex-wrap:wrap; gap:10px; justify-content:center; max-width:720px; }
  a.btn { background:#facc15; color:#0f172a; text-decoration:none; font-weight:800; padding:10px 16px; border-radius:10px; font-size:14px; }
  a.btn.sec { background:#1e293b; color:#e2e8f0; border:1px solid #334155; font-weight:600; }
  img { width:100%; max-width:920px; border-radius:12px; border:1px solid #334155; }
</style>
</head>
<body>
  <h1>Stickman 3D Kit: ${slug || 'No MP4 rendered yet'}</h1>
  <div class="sub">2.5D Flat Vector Stickmen + Real-3D Environment · Vertical 9:16</div>
  ${featured ? `<video controls playsinline preload="metadata" src="/out/${encodeURIComponent(featured)}"></video>` : ''}
  <div class="btns">${listHtml}</div>
  <img src="/stills/contact-sheet.png" alt="Contact Sheet">
</body>
</html>`);
});

app.use('/out', express.static(path.join(root, 'out')));
app.use('/stills', express.static(path.join(root, 'stills')));
app.use('/episodes', express.static(path.join(root, 'episodes')));

app.listen(port, '0.0.0.0', () => console.log(`Stickman 3D Kit preview server listening on :${port}`));
