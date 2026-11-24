# Stickman 3D Kit — Agent Guide

- First-time setup: `npm install` (requires Node.js 20+, Chromium at `/usr/bin/chromium` or `CHROME_PATH`, and `ffmpeg`/`ffprobe`).
- To install the agent skill globally into `~/.claude`, `~/.codex`, `~/.agents`, or `~/.gemini`: run `bash scripts/install_skill.sh`.
- Before creating or editing an episode or 3D stage, read **`skills/stickman-3d-video/SKILL.md`** and only the reference file(s) you need under `skills/stickman-3d-video/references/`.
- Core rules:
  1. **2.5D Flat Vector Stickmen + Real-3D Worlds:** Characters stay crisp flat 2.5D Canvas2D vector planes (`src/characters/stickman-25d.js`); environments, lighting, shadows, and props stay 100% real Three.js 3D (`src/stages/`).
  2. **Determinism is sacred:** Never use `Math.random()`, `Date.now()`, or stateful frame timers. Always pass `bash make.sh <slug> stills` (determinism bit-check + visual inspection of `stills/contact-sheet.png`) before running a full MP4 render.
  3. **VO-first sync:** Generate `episodes/<slug>/voice.mp3`, measure speech pauses via `ffmpeg silencedetect`, and align captions, expressions, camera moves, and SFX to real speech boundaries.
  4. Never commit API keys, tokens, `.env` files, or large rendered MP4/WAV artifacts.
