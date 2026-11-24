#!/usr/bin/env bash
# Link skills/stickman-3d-video into detected AI coding agent skill directories.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

targets=()
for home in "$HOME/.claude" "$HOME/.codex" "$HOME/.agents" "$HOME/.gemini"; do
  [ -d "$home" ] && targets+=("$home/skills")
done
[ ${#targets[@]} -eq 0 ] && targets=("$HOME/.claude/skills")

for dir in "${targets[@]}"; do
  mkdir -p "$dir"
  dest="$dir/stickman-3d-video"
  if [ -e "$dest" ] && [ ! -L "$dest" ]; then
    echo "Skipping $dest (existing non-symlink directory)" >&2
    continue
  fi
  ln -sfn "$ROOT/skills/stickman-3d-video" "$dest"
  echo "Linked $dest -> $ROOT/skills/stickman-3d-video"
done
echo "Done. Read skills/stickman-3d-video/SKILL.md to start creating episodes."
