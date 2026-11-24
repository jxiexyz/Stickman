---
name: stickman-3d-video
description: >-
  Create deterministic vertical 9:16 storytelling videos combining crisp 2.5D Flat Vector
  Stickman characters with real Three.js 3D environments, dynamic PCFSoftShadowMap lighting
  (day/night), continuous 3D camera choreography, kinetic outlined captions, HUD math callouts,
  and voice-over synced procedural SFX. Use when the user asks to create a stickman story video,
  build a new 3D stage/set, scaffold an episode, or render MP4 Shorts/Reels/TikTok with this kit.
---

# Stickman 3D Kit — Agent Production Skill

This skill powers **2.5D Flat Vector Stickman + Real-3D World** vertical storytelling videos (9:16 Shorts / TikTok / Reels), modeled on high-retention viral 3D-set cartoon storytelling.

## Visual Architecture (Non-Negotiable)

1. **Characters = Crisp 2.5D Flat Vector Stickmen (`src/characters/stickman-25d.js`)**
   - Rendered from `512×512` procedural Canvas2D vector art with uniform thick ink strokes (`#10141c`), clean 2-tone cel shading, slender capsule torso (+3 buttons) or hijabi dress silhouette, thin articulated stick arms & legs, and instant stepped facial expression swaps (`11` expressions + floating `?`, `!`, `sweat`, comic text sprites).
   - Never use puffy 3D sphere/capsule geometry for character heads/bodies; keep characters flat 2.5D cutout planes that gently billboard on the Y-axis toward the active camera while casting real 3D shadows (`castShadow: true`, `alphaTest: 0.45`).
2. **Environment & Props = 100% Real 3D (`src/stages/`)**
   - Single-hero 3D sets with `PCFSoftShadowMap` shadows, textured roofs/stucco, instanced 3D grass & wildflowers, dynamic canvas surfaces (e.g. paintable/projected walls), sculpted 3D props, and day↔night lighting transitions.
3. **Camera = Continuous 3D Choreography (`src/camera/camera-director.js`)**
   - Avoid dead static frames. Combine slow push-ins, multi-keyframe continuous reveals (pull-out → isometric crane-up orbit → low-angle tilt-up), whip-pans across the 3D set, and bird's-eye establishing shots.
4. **Determinism is Sacred**
   - **Zero** `Math.random()`, `Date.now()`, or stateful frame counters inside evaluators. Every frame `f` must render bit-identically regardless of seek order (`DETERMINISM OK` gate).

---

## Reference Map (Read Only What You Need)

| Goal | Reference File | Contents |
|---|---|---|
| **Characters & Expressions** | [01-stickman-25d-rig.md](./references/01-stickman-25d-rig.md) | `createStickman25D` API, 6 headwear types, 11 expressions, arm/leg kinematics, adding custom headwear/faces |
| **3D Stages & Props** | [02-world-3d-sets.md](./references/02-world-3d-sets.md) | `base-stage.js` helpers, building & registering a new 3D stage, dynamic canvas props, day/night lighting |
| **Camera & Storytelling** | [03-camera-and-story.md](./references/03-camera-and-story.md) | 5 signature camera moves, keyframe syntax, 5-act storytelling rhythm, VO→action rules |
| **Captions, SFX & Render** | [04-captions-sfx-render.md](./references/04-captions-sfx-render.md) | Bold `*highlighted*` captions, HUD math counters, 77 SFX presets, VO pause sync, `make.sh` & QA checklist |

---

## Standard End-to-End Episode Workflow

1. **Scaffold Episode:**
   ```bash
   node scripts/new-episode.mjs <slug> --title "Judul Cerita"
   ```
2. **VO-First (Write Punchy Casual Script → Generate Audio → Measure Pauses):**
   - Write short, staccato, conversational sentences (3–7 words per line; zero corporate/AI-slop phrasing) in `episodes/<slug>/script.txt`.
   - Generate `episodes/<slug>/voice.mp3` first.
   - Measure exact speech pauses & total duration:
     ```bash
     ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 episodes/<slug>/voice.mp3
     ffmpeg -i episodes/<slug>/voice.mp3 -af "silencedetect=noise=-32dB:d=0.18" -f null - 2>&1 | grep silence_
     ```
3. **Design Beats & Sync Every Spoken Line (`episodes/<slug>/episode.js`):**
   - Set `duration` to `voiceDuration + 0.8s` and map every spoken phrase to concrete visible action (prop state change, expression swap, camera move, HUD counter, or caption highlight `*keyword*`).
   - Add synchronized SFX events (`src/audio/sfx-presets.js`) + day/night ambience tracks.
4. **Stills & Determinism QA Gate (MANDATORY before full render):**
   ```bash
   bash make.sh <slug> stills
   ```
   - Visually inspect `stills/contact-sheet.png` (framing, character headroom, arm angles, readability of captions & HUD, lighting contrast).
   - Confirm `DETERMINISM OK (bit-identical A/B + mid-after-last)`.
5. **Full MP4 Render & Post-Render Verification:**
   ```bash
   bash make.sh <slug> full <frames> 24 720x1280
   ```
   - Verify output with `ffprobe`, `ffmpeg -af volumedetect`, and a sampled keyframe filmstrip before delivery.
   - Optional preview server: `npm run preview:server` (serves `out/` and `stills/` on port `8080`).
