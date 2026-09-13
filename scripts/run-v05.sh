#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FORGE="$ROOT/vendor/forge"

if [[ ! -d "$FORGE/.git" ]]; then
  "$ROOT/scripts/bootstrap-v05.sh"
fi

command -v docker >/dev/null 2>&1 || { echo "Docker is required for the v0.5 test stack" >&2; exit 1; }

ENV_FILE="$FORGE/.env"
GENERATED_PASSWORD=""
if [[ ! -f "$ENV_FILE" ]]; then
  DB_PASSWORD="db-$(python3 - <<'PY'
import secrets
print(secrets.token_hex(16))
PY
)"
  JWT_SECRET="$(python3 - <<'PY'
import secrets
print(secrets.token_urlsafe(48))
PY
)"
  GENERATED_PASSWORD="Forge-$(python3 - <<'PY'
import secrets
print(secrets.token_urlsafe(14))
PY
)!"
  cat > "$ENV_FILE" <<EOF
FORGE_ENVIRONMENT=development
POSTGRES_PASSWORD=$DB_PASSWORD
FORGE_JWT_SECRET=$JWT_SECRET
FORGE_BOOTSTRAP_ADMIN_EMAIL=admin@forge.local
FORGE_BOOTSTRAP_ADMIN_PASSWORD=$GENERATED_PASSWORD
FORGE_DEFAULT_MODEL=fake:echo
FORGE_MCP_OAUTH_ENABLED=false
FORGE_SERVICE_API_TOKEN=
FORGE_EGRESS_ALLOW_PRIVATE_HOSTS=[]
EOF
  echo "[v0.5] Created local-only vendor/forge/.env"
fi

(
  cd "$FORGE"
  docker compose up --build -d
  docker compose ps
)

echo
echo "Forge v0.5 local stack is starting:"
echo "  Console: http://localhost:3000"
echo "  API:     http://localhost:8000/docs"
echo "  Health:  http://localhost:8000/readyz"
if [[ -n "$GENERATED_PASSWORD" ]]; then
  echo "  Login:   admin@forge.local"
  echo "  Password (generated for this local checkout): $GENERATED_PASSWORD"
  echo "  Save it locally; it is not committed to Git."
fi
echo
echo "Initial model: fake:echo (offline). Model-router validation is a separate gate."
