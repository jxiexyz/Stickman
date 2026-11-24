# 04 — Kinetic Captions, HUD Overlays, Procedural SFX & Render Pipeline

Modules: `src/overlay/caption-hud-renderer.js`, `src/audio/sfx-presets.js`, `src/audio/sfx-engine.js`, `make.sh`

## Kinetic Outlined Captions (`beat.captions`)

Keep cues **1–4 words** per chunk, timed directly to `voice.mp3` speech segments. Wrap punchline keywords in `*asterisks*` to highlight them in golden yellow (`#facc15`):

```js
captions: [
  { start: 0.00, end: 1.25, text: 'Tiap minggu pagi,' },
  { start: 1.32, end: 2.38, text: 'dia ngecat tembok' },
  { start: 2.38, end: 3.50, text: 'pakai *cat putih*.' },
]
```

## Upper-Headroom HUD Counters (`beat.hudTimeline`)

Rendered in the top safe zone (`yFrac: 0.22`) so characters & lower captions remain unobstructed:

```js
hudTimeline: [
  { start: 5.35, end: 7.15, value: '50 ORANG', color: '#facc15', yFrac: 0.24, large: true },
  { start: 9.35, end: 11.15, formula: '50 × Rp10.000', value: 'Rp500 RB', color: '#4ade80', yFrac: 0.22 },
  { start: 12.95, end: 14.55, formula: 'Rp500 RB × 2', value: 'Rp1 JT', color: '#4ade80', yFrac: 0.22, large: true },
]
```

## Procedural SFX & Ambience (`episode.audio`)

77 built-in deterministic presets across 8 categories (`src/audio/sfx-presets.js`). High-value storytelling favorites:
- **Ambience:** `env_outdoor_birds_foley`, `env_wind_ambience`, `env_room_tone`, `env_rain_ambience`, `env_city_ambience`
- **Camera / Transitions:** `cam_whoosh_soft`, `cam_whip_pan`, `cam_zoom_out`, `cam_cinematic_sweep`, `cam_scene_transition`
- **Reactions & Comedy:** `char_confused_reaction`, `char_surprise_reaction`, `char_sigh_foley`, `com_pop`, `com_boing`, `com_spring_bounce`, `com_tiny_fail`
- **Drama & Reveals:** `emo_dramatic_reveal`, `emo_shock_accent`, `emo_unexpected_twist`, `emo_triumph_cue`, `emo_gentle_ending`, `obj_door_open_foley`
- **Finance / Counters:** `ui_notification_ping`, `ui_number_count_up`, `ui_chart_reveal`, `fin_cash_subtle`, `fin_profit_reveal`, `fin_milestone_achieved`

> Note: Always use `startTime` (seconds from episode start) and `bus` (`'ambience' | 'sfx_primary' | 'sfx_secondary' | 'transition'`).

## Render Commands & QA Checklist

```bash
# 1. Unit tests (pure logic + SFX determinism)
npm test

# 2. Capture beat stills + contact-sheet.png + determinism bit-check
bash make.sh <slug> stills [frames] [fps] [WxH]

# 3. Full MP4 render (automatically muxes episodes/<slug>/voice.mp3 + optional bgm.mp3 + procedural SFX)
bash make.sh <slug> full [frames] [fps] [WxH]

# 4. Verify exported MP4 before delivery
ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,r_frame_rate,nb_read_frames,duration -count_frames -of default=nw=1 out/<slug>.mp4
ffmpeg -v info -i out/<slug>.mp4 -af volumedetect -vn -f null - 2>&1 | grep -E "mean_volume|max_volume"
```
