#!/usr/bin/env node
// Scaffold a new episode folder from episodes/_starter.
// Usage: node scripts/new-episode.mjs <slug> [--title "My Story Title"]
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const slug = argv[0];
if (!slug || !/^[a-z0-9][a-z0-9-_]*$/.test(slug)) {
  console.error('Usage: node scripts/new-episode.mjs <slug> [--title "Episode Title"]');
  process.exit(1);
}

const titleIdx = argv.indexOf('--title');
const title = titleIdx !== -1 && argv[titleIdx + 1] ? argv[titleIdx + 1] : slug;

const root = process.cwd();
const srcDir = path.join(root, 'episodes', '_starter');
const dstDir = path.join(root, 'episodes', slug);

if (existsSync(dstDir)) {
  console.error(`Episode already exists: episodes/${slug}`);
  process.exit(1);
}

await mkdir(dstDir, { recursive: true });
await cp(srcDir, dstDir, { recursive: true });

const epPath = path.join(dstDir, 'episode.js');
let code = await readFile(epPath, 'utf8');
code = code.replace("id: '_starter'", `id: '${slug}'`).replace("title: 'Starter 2.5D Stickman Story'", `title: ${JSON.stringify(title)}`);
await writeFile(epPath, code, 'utf8');

console.log(`Created episodes/${slug}/`);
console.log(`Next steps:`);
console.log(`  1. Edit episodes/${slug}/script.txt and generate episodes/${slug}/voice.mp3`);
console.log(`  2. Sync beats & captions in episodes/${slug}/episode.js`);
console.log(`  3. Run: bash make.sh ${slug} stills`);
console.log(`  4. Inspect stills/contact-sheet.png, then run: bash make.sh ${slug} full`);
