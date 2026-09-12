$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$EnvFile = Join-Path $Root ".env.router"
$Example = Join-Path $Root "config/litellm/.env.router.example"

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw "Docker Desktop / Docker Engine is required."
}

if (-not (Test-Path $EnvFile)) {
  $master = "sk-v05-" + [guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
  $groq = if ($env:GROQ_API_KEY) { $env:GROQ_API_KEY } else { "" }
  $openrouter = if ($env:OPENROUTER_API_KEY) { $env:OPENROUTER_API_KEY } else { "" }
  @"
LITELLM_MASTER_KEY=$master
GROQ_API_KEY=$groq
OPENROUTER_API_KEY=$openrouter
"@ | Set-Content -Path $EnvFile -Encoding UTF8
  Write-Host "[v0.5] Created local-only .env.router"
}

Push-Location $Root
try {
  docker compose -f docker-compose.router.yml --env-file .env.router up -d
  if ($LASTEXITCODE -ne 0) { throw "LiteLLM router failed to start" }
  docker compose -f docker-compose.router.yml ps
}
finally {
  Pop-Location
}

Write-Host ""
Write-Host "LiteLLM router: http://localhost:4000"
Write-Host "OpenAI-compatible base: http://localhost:4000/v1"
Write-Host ""
Write-Host "Routes are provider wildcards: groq/<model-id> and openrouter/<model-id>."
Write-Host "Concrete model IDs are runtime choices and are intentionally not hardcoded."
Write-Host "If provider keys were blank, the router can boot but real calls will fail until keys are added to .env.router."
