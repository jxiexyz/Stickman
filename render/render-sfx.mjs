// Synthesize deterministic procedural SFX + ambience WAV for an episode.
// Usage: node render/render-sfx.mjs --episode tembok-putih-nobar --out out/tembok-putih-nobar-sfx.wav
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { SFXPresetRegistry } from '../src/audio/sfx-presets.js';
import { SFXBusManager, renderSFXTimelineToWav } from '../src/audio/sfx-engine.js';

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

const slug = arg('episode', 'tembok-putih-nobar');
const outPath = arg('out', `out/${slug}-sfx.wav`);
const sampleRate = Number(arg('rate', 44100));

const epPath = path.resolve(process.cwd(), `episodes/${slug}/episode.js`);
const mod = await import(pathToFileURL(epPath).href);
const episode = mod.default || mod.episode;
if (!episode) {
  throw new Error(`Episode module "${epPath}" did not export default or episode.`);
}

const registry = new SFXPresetRegistry();
const busManager = new SFXBusManager();
busManager.masterVolume = episode.audio?.masterVolume ?? 0.86;
if (episode.audio?.busVolumes) {
  for (const [busId, volume] of Object.entries(episode.audio.busVolumes)) {
    busManager.setBus(busId, { volume });
  }
}

const audioResult = renderSFXTimelineToWav({
  events: episode.audio?.events || [],
  ambienceTracks: episode.audio?.ambienceTracks || [],
  silenceCues: episode.audio?.silenceCues || [],
  totalDuration: episode.duration || 30,
  registry,
  busManager,
  sampleRate,
  voiceActive: episode.audio?.voiceActive ?? true,
});

await mkdir(path.dirname(path.resolve(outPath)), { recursive: true });
await writeFile(outPath, Buffer.from(audioResult.wavBuffer));

console.log(
  `SFX WAV rendered: ${outPath} (${audioResult.duration.toFixed(2)}s, ${audioResult.sampleRate}Hz, peak=${audioResult.peakAmplitude}, clipped=${audioResult.clipped})`
);
