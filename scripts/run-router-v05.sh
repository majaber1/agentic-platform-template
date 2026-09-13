#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT/.env.router"

command -v docker >/dev/null 2>&1 || { echo "Docker is required" >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "python3 is required" >&2; exit 1; }

if [[ ! -f "$ENV_FILE" ]]; then
  MASTER="sk-v05-$(python3 - <<'PY'
import secrets
print(secrets.token_urlsafe(48))
PY
)"
  cat > "$ENV_FILE" <<EOF
LITELLM_MASTER_KEY=$MASTER
GROQ_API_KEY=${GROQ_API_KEY:-}
OPENROUTER_API_KEY=${OPENROUTER_API_KEY:-}
EOF
  echo "[v0.5] Created local-only .env.router"
fi

(
  cd "$ROOT"
  docker compose -f docker-compose.router.yml --env-file .env.router up -d
  docker compose -f docker-compose.router.yml ps
)

echo
echo "LiteLLM router: http://localhost:4000"
echo "OpenAI-compatible base: http://localhost:4000/v1"
echo "Routes: groq/<model-id> and openrouter/<model-id>"
echo "If provider keys are blank, real provider calls remain intentionally unavailable."
