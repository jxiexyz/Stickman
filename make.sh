#!/usr/bin/env bash
# Stickman 2.5D-in-3D Video Render CLI
#
# Usage:
#   bash make.sh <episode-slug> stills [frames] [fps] [WxH]
#   bash make.sh <episode-slug> full   [frames] [fps] [WxH]
#
# Examples:
#   bash make.sh tembok-putih-nobar stills 2371 24 720x1280
#   bash make.sh tembok-putih-nobar full   2371 24 720x1280
#   bash make.sh _starter stills
set -euo pipefail
cd "$(dirname "$0")"

EPISODE="${1:?Usage: bash make.sh <episode-slug> [stills|full] [frames] [fps] [WxH]}"
MODE="${2:-stills}"
FRAMES="${3:-}"
FPS="${4:-24}"
SIZE="${5:-720x1280}"

W="${SIZE%x*}"
H="${SIZE#*x}"
PORT="${PORT:-5173}"

if curl -sf -o /dev/null "http://127.0.0.1:$PORT/render/"; then
  if ! curl -sf "http://127.0.0.1:$PORT/render/episode-frame.js" | grep -q '__meta'; then
    echo "Port $PORT is occupied by another server. Set PORT=<free port> and retry." >&2
    exit 1
  fi
else
  nohup npx vite --host 127.0.0.1 --port "$PORT" --strictPort > vite.log 2>&1 &
  for _ in $(seq 1 40); do
    curl -sf -o /dev/null "http://127.0.0.1:$PORT/render/" && break
    sleep 0.5
  done
fi

[ "$MODE" = "full" ] && rm -rf frames
[ "$MODE" = "stills" ] && rm -rf stills

FRAME_ARGS=()
if [ -n "$FRAMES" ]; then
  FRAME_ARGS=(--frames "$FRAMES")
fi

node render/capture.mjs "$MODE" \
  --episode "$EPISODE" \
  "${FRAME_ARGS[@]}" \
  --fps "$FPS" \
  --w "$W" \
  --h "$H" \
  --url "http://127.0.0.1:$PORT"

if [ "$MODE" = "stills" ]; then
  cmp -s stills/determinism/fmida.png stills/determinism/fmidb.png &&
  cmp -s stills/determinism/fmida.png stills/determinism/fmidafterlast.png &&
  echo "DETERMINISM OK (bit-identical A/B + mid-after-last)" ||
  { echo "DETERMINISM CHECK FAILED!" >&2; exit 1; }
fi

if [ "$MODE" = "full" ]; then
  mkdir -p out
  SFX_WAV="out/${EPISODE}-sfx.wav"
  OUT_MP4="out/${EPISODE}.mp4"
  VOICE_FILE="episodes/${EPISODE}/voice.mp3"
  BGM_FILE="episodes/${EPISODE}/bgm.mp3"

  node render/render-sfx.mjs --episode "$EPISODE" --out "$SFX_WAV"

  if [ -f "$VOICE_FILE" ] && [ -f "$BGM_FILE" ]; then
    echo "Muxing VO ($VOICE_FILE) + BGM ($BGM_FILE) + SFX ($SFX_WAV)..."
    ffmpeg -y -v error \
      -framerate "$FPS" -i frames/f%04d.png \
      -i "$VOICE_FILE" \
      -i "$SFX_WAV" \
      -stream_loop -1 -i "$BGM_FILE" \
      -filter_complex "[1:a]aresample=44100,volume=1.08[vo];[2:a]aresample=44100,volume=0.52[sfx];[3:a]aresample=44100,volume=0.14[bgm];[vo][sfx][bgm]amix=inputs=3:duration=first:dropout_transition=2,alimiter=limit=0.95[aout]" \
      -map 0:v:0 -map "[aout]" \
      -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p \
      -c:a aac -b:a 192k -shortest \
      -movflags +faststart "$OUT_MP4"
  elif [ -f "$VOICE_FILE" ]; then
    echo "Muxing VO ($VOICE_FILE) + SFX ($SFX_WAV)..."
    ffmpeg -y -v error \
      -framerate "$FPS" -i frames/f%04d.png \
      -i "$VOICE_FILE" \
      -i "$SFX_WAV" \
      -filter_complex "[1:a]aresample=44100,volume=1.08[vo];[2:a]aresample=44100,volume=0.52[sfx];[vo][sfx]amix=inputs=2:duration=longest:dropout_transition=2,alimiter=limit=0.95[aout]" \
      -map 0:v:0 -map "[aout]" \
      -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p \
      -c:a aac -b:a 192k -shortest \
      -movflags +faststart "$OUT_MP4"
  else
    echo "Muxing SFX-only ($SFX_WAV) (no voice.mp3 found)..."
    ffmpeg -y -v error \
      -framerate "$FPS" -i frames/f%04d.png \
      -i "$SFX_WAV" \
      -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p \
      -c:a aac -b:a 160k -shortest \
      -movflags +faststart "$OUT_MP4"
  fi

  ffprobe -v error -show_entries stream=codec_type,width,height,r_frame_rate,nb_read_frames,duration \
    -count_frames -of default=nw=1 "$OUT_MP4"
fi
