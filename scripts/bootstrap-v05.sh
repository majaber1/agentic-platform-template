#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCK="$ROOT/upstream/UPSTREAM_COMPONENTS.lock.json"

command -v git >/dev/null 2>&1 || { echo "git is required" >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "python3 is required to read the lock manifest" >&2; exit 1; }

python3 - "$LOCK" <<'PY' | while IFS=$'\t' read -r name repo ref target; do
import json, sys
with open(sys.argv[1], encoding="utf-8") as f:
    data = json.load(f)
for c in data["components"]:
    print(f'{c["name"]}\t{c["repository"]}\t{c["ref"]}\t{c["target_path"]}')
PY
  abs="$ROOT/$target"
  mkdir -p "$(dirname "$abs")"
  if [[ ! -d "$abs/.git" ]]; then
    echo "[v0.5] Cloning $name -> $target"
    git clone --filter=blob:none "$repo" "$abs"
  fi
  git -C "$abs" fetch --all --tags --prune >/dev/null 2>&1 || true
  git -C "$abs" checkout --detach "$ref"
  actual="$(git -C "$abs" rev-parse HEAD)"
  [[ "$actual" == "$ref" ]] || { echo "$name checkout mismatch: expected=$ref actual=$actual" >&2; exit 1; }
  echo "[v0.5] $name pinned at $actual"
done

FORGE_DIR="$ROOT/vendor/forge"
if [[ -d "$FORGE_DIR/.git" ]]; then
  python3 "$ROOT/scripts/apply-v05-forge-customizations.py" "$FORGE_DIR"
  git -C "$FORGE_DIR" diff --check
  echo "[v0.5] Governed Forge customizations verified"
fi

echo
echo "v0.5 upstream bootstrap PASS"
echo "Next: ./scripts/run-v05.sh"
