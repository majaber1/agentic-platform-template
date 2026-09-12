$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Forge = Join-Path $Root "vendor/forge"

if (-not (Test-Path (Join-Path $Forge ".git"))) {
  & (Join-Path $PSScriptRoot "bootstrap-v05.ps1")
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw "Docker Desktop / Docker Engine is required for the production-shaped v0.5 test stack."
}

$envPath = Join-Path $Forge ".env"
$generatedPassword = $null
if (-not (Test-Path $envPath)) {
  $dbPassword = "db-" + [guid]::NewGuid().ToString("N")
  $jwt = [guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
  $generatedPassword = "Forge-" + [guid]::NewGuid().ToString("N").Substring(0,16) + "!"
  @"
FORGE_ENVIRONMENT=development
POSTGRES_PASSWORD=$dbPassword
FORGE_JWT_SECRET=$jwt
FORGE_BOOTSTRAP_ADMIN_EMAIL=admin@forge.local
FORGE_BOOTSTRAP_ADMIN_PASSWORD=$generatedPassword
FORGE_DEFAULT_MODEL=fake:echo
FORGE_MCP_OAUTH_ENABLED=false
FORGE_SERVICE_API_TOKEN=
FORGE_EGRESS_ALLOW_PRIVATE_HOSTS=[]
"@ | Set-Content -Path $envPath -Encoding UTF8
  Write-Host "[v0.5] Created local-only vendor/forge/.env"
}

Push-Location $Forge
try {
  docker compose up --build -d
  if ($LASTEXITCODE -ne 0) { throw "docker compose failed" }
  docker compose ps
}
finally {
  Pop-Location
}

Write-Host ""
Write-Host "Forge v0.5 local stack is starting:"
Write-Host "  Console: http://localhost:3000"
Write-Host "  API:     http://localhost:8000/docs"
Write-Host "  Health:  http://localhost:8000/readyz"
if ($generatedPassword) {
  Write-Host "  Login:   admin@forge.local"
  Write-Host "  Password (generated for this local checkout): $generatedPassword"
  Write-Host "  Save it locally; it is not committed to Git."
}
Write-Host ""
Write-Host "Initial model: fake:echo (offline). Model-router validation is a separate gate."
