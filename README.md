# Stickman 3D Kit

**Deterministic 2.5D Flat Vector Stickman + Real-3D Environment Storytelling Video Template Kit** built on Three.js, Headless Chromium, Procedural Web Audio SFX, and FFmpeg.

Designed for vertical 9:16 storytelling videos (YouTube Shorts, TikTok, Instagram Reels) where **crisp 2D/2.5D cartoon stickman characters** act inside **real-3D shadowed sets** with continuous 3D camera choreography, kinetic outlined captions, and voice-over synced sound design.

---

## Visual Style & Architecture

- **Characters (`src/characters/stickman-25d.js`):** Crisp `512×512` procedural vector-art 2.5D cutout stickmen (uniform thick ink outlines, subtle 2-tone cel shading, 6 headwear presets `cap`/`hijab`/`peci`/`bowl`/`caping`/`none`, capsule torso or hijabi dress, 11 instant facial expressions, articulated stick arms & legs, floating reaction sprites `?`/`!`/`sweat`, soft Y-axis camera billboarding, and real 3D shadow casting).
- **3D Worlds & Props (`src/stages/`):** Real Three.js 3D stages with `PCFSoftShadowMap` shadows, textured roofs/plaster, instanced 3D grass & wildflowers, dynamic CanvasTexture hero surfaces (paintable walls, projected screens, 3D-perspective dimension overlays), day↔night lighting transitions, and volumetric light cones.
- **3D Camera Director (`src/camera/camera-director.js`):** Multi-keyframe continuous 3D camera moves (pull-out wide → isometric crane-up orbit → low-angle tilt-up, whip-pans, slow push-ins, bird's-eye establishing shots) with subtle deterministic handheld drift.
- **Overlays & Audio (`src/overlay/`, `src/audio/`):** Bold kinetic outlined captions with `*golden highlight*` keywords, upper-headroom HUD math callouts (`50 × Rp10.000 = Rp500 RB`), and 77 built-in deterministic procedural SFX & ambience presets.
- **AI Agent Skill Included (`skills/stickman-3d-video/`):** Self-contained `SKILL.md` + 4 modular reference docs so Claude Code, Codex, Antigravity, or OpenCode can scaffold, choreograph, QA, and render new episodes end-to-end.

---

## Quick Start

**Requirements:** Node.js 20+, Chromium (`/usr/bin/chromium` or set `CHROME_PATH`), and `ffmpeg` / `ffprobe`.

```bash
# 1. Install dependencies
npm install

# 2. Run unit & determinism tests
npm test

# 3. Render beat stills + contact-sheet.png + determinism bit-check
bash make.sh tembok-putih-nobar stills 2371 24 720x1280

# 4. Render full 9:16 MP4 (muxes episodes/<slug>/voice.mp3 + optional bgm.mp3 + procedural SFX)
bash make.sh tembok-putih-nobar full 2371 24 720x1280

# 5. (Optional) Start local preview & download server on port 8080
npm run preview:server
```

### Create a New Episode

```bash
node scripts/new-episode.mjs cerita-baru --title "Judul Cerita Baru"
# 1. Edit episodes/cerita-baru/script.txt and add episodes/cerita-baru/voice.mp3
# 2. Choreograph beats, captions, and SFX in episodes/cerita-baru/episode.js
# 3. Run stills QA -> inspect stills/contact-sheet.png -> render full MP4
bash make.sh cerita-baru stills
bash make.sh cerita-baru full
```

### Install the Agent Skill

```bash
bash scripts/install_skill.sh
```

Links `skills/stickman-3d-video/` into `~/.claude/skills`, `~/.codex/skills`, `~/.agents/skills`, and `~/.gemini/skills` (whichever agent directories exist).

---

## Project Structure

```text
Stickman/
├── make.sh                                # Deterministic CLI render & ffmpeg mux pipeline
├── render/
│   ├── index.html                         # 9:16 portrait render stage
│   ├── episode-frame.js                   # Deterministic frame evaluator (__meta, __ready, __frame)
│   ├── capture.mjs                        # Headless Chromium stills, contact sheet & frame capture
│   ├── render-sfx.mjs                     # Procedural SFX + ambience WAV synthesizer
│   └── preview-server.mjs                 # Express preview & download server (:8080)
├── src/
│   ├── index.js                           # Public API exports
│   ├── utils/math.js                      # Pure deterministic math, easing & seeded hash
│   ├── characters/stickman-25d.js         # Reusable 2.5D flat vector stickman rig
│   ├── camera/camera-director.js          # Continuous 3D camera choreography
│   ├── overlay/caption-hud-renderer.js    # Bold kinetic captions + HUD math callouts
│   ├── audio/                             # 77 deterministic SFX presets + WAV engine
│   └── stages/
│       ├── registry.js                    # Plug-and-play stage registry
│       ├── base-stage.js                  # Shared 3D textures, lighting, grass, hills, trees
│       └── village-nobar-stage.js         # Flagship 3D Village Nobar stage
├── episodes/
│   ├── _starter/                          # Minimal 3-beat starter episode
│   └── tembok-putih-nobar/                # Flagship 20-beat reference episode (98.8s)
├── skills/stickman-3d-video/              # Agent SKILL.md + 4 focused reference guides
├── scripts/
│   ├── new-episode.mjs                    # Episode scaffolder
│   └── install_skill.sh                   # Agent skill linker
└── tests/determinism.test.mjs             # Automated Node unit & SFX determinism tests
```
