import * as THREE from 'three';
import { clamp, smoothstep, createStage, OverlayRenderer } from '../src/index.js';

const q = new URLSearchParams(location.search);
const slug = q.get('episode') || 'tembok-putih-nobar';
const fps = Number(q.get('fps') || 24);
const W = Number(q.get('w') || 720);
const H = Number(q.get('h') || 1280);

const epMod = await import(`../episodes/${slug}/episode.js`);
const episode = epMod.default || epMod.episode;
const duration = Number(episode.duration || 10);
const frames = Number(q.get('frames') || Math.round(duration * fps));

window.__meta = {
  episode: slug,
  title: episode.title || slug,
  stageId: episode.stageId || 'village-nobar',
  frames,
  fps,
  width: W,
  height: H,
  beats: (episode.beats || []).map((b) => ({
    id: b.id,
    label: b.label || b.id,
    start: b.start,
    end: b.end,
    midFrame: Math.min(frames - 1, Math.max(0, Math.round(((b.start + b.end) * 0.5) * fps))),
  })),
};

window.__ready = (async () => {
  Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });

  const viewport = document.querySelector('#viewport');
  const stageEl = document.querySelector('#stage');
  const overlayCanvas = document.querySelector('#overlay');
  viewport.style.width = `${W}px`;
  viewport.style.height = `${H}px`;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(episode.background ?? 0x8bc2ed);

  const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 120);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  stageEl.appendChild(renderer.domElement);

  const stage = createStage(episode.stageId || 'village-nobar', scene, renderer, camera);
  const overlay = new OverlayRenderer(overlayCanvas);
  overlay.resize(W, H);

  const beats = episode.beats || [];

  window.__frame = (f) => {
    if (!Number.isInteger(f) || f < 0 || f >= frames) {
      throw new RangeError(`Expected frame 0-${frames - 1}, got ${f}`);
    }
    const t = clamp(f / fps, 0, Math.max(0, duration - 1e-4));

    let idx = beats.findIndex((b) => t >= b.start && t < b.end);
    if (idx === -1) idx = Math.max(0, beats.length - 1);
    const beat = beats[idx];
    const beatDur = Math.max(0.1, (beat.end ?? duration) - (beat.start ?? 0));
    const localTime = clamp(t - (beat.start ?? 0), 0, beatDur);

    // Deterministic crossfade envelope
    let fadeAlpha = 0;
    const fadeIn = beat.fadeIn ?? (idx === 0 ? 0.25 : 0);
    const fadeOut = beat.fadeOut ?? (idx === beats.length - 1 ? 0.65 : 0);
    if (fadeIn > 0.001 && localTime < fadeIn) {
      fadeAlpha = Math.max(fadeAlpha, 1 - smoothstep(localTime / fadeIn));
    }
    if (fadeOut > 0.001 && localTime > beatDur - fadeOut) {
      fadeAlpha = Math.max(fadeAlpha, smoothstep((localTime - (beatDur - fadeOut)) / fadeOut));
    }

    // Active caption cue
    let caption = null;
    let captionLocalTime = 1.0;
    if (Array.isArray(beat.captions)) {
      for (const cue of beat.captions) {
        const cs = cue.start ?? 0;
        const ce = cue.end ?? beatDur;
        if (localTime >= cs && localTime < ce) {
          caption = cue.text;
          captionLocalTime = Math.max(0, localTime - cs);
          break;
        }
      }
    }

    // Active HUD math/callout overlay
    let hudOverlay = null;
    if (Array.isArray(beat.hudTimeline)) {
      for (const h of beat.hudTimeline) {
        const hs = h.start ?? 0;
        const he = h.end ?? beatDur;
        if (localTime >= hs && localTime < he) {
          hudOverlay = { ...h, localTime: Math.max(0, localTime - hs) };
          break;
        }
      }
    }

    stage.evaluateBeat(beat, localTime, t);
    renderer.render(scene, camera);
    overlay.render({
      caption,
      captionLocalTime,
      hudOverlay,
      vignette: beat.vignette ?? 0.14,
      fadeAlpha,
    });
  };

  window.__frame(0);
  return true;
})();
