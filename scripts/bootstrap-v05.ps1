param(
  [switch]$Update
)

$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$LockPath = Join-Path $Root "upstream/UPSTREAM_COMPONENTS.lock.json"
$Lock = Get-Content $LockPath -Raw | ConvertFrom-Json

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "git is required but was not found in PATH."
}

foreach ($component in $Lock.components) {
  $target = Join-Path $Root ($component.target_path -replace '/', [IO.Path]::DirectorySeparatorChar)
  $parent = Split-Path $target -Parent
  New-Item -ItemType Directory -Force -Path $parent | Out-Null

  if (-not (Test-Path (Join-Path $target ".git"))) {
    Write-Host "[v0.5] Cloning $($component.name) -> $($component.target_path)"
    git clone --filter=blob:none $component.repository $target
    if ($LASTEXITCODE -ne 0) { throw "Clone failed for $($component.name)" }
  }
  elseif ($Update) {
    Write-Host "[v0.5] Refreshing refs for $($component.name)"
    git -C $target fetch --all --tags --prune
    if ($LASTEXITCODE -ne 0) { throw "Fetch failed for $($component.name)" }
  }

  # Always enforce the immutable pinned ref. Upstream main is never followed implicitly.
  git -C $target checkout --detach $component.ref
  if ($LASTEXITCODE -ne 0) {
    git -C $target fetch --all --tags --prune
    git -C $target checkout --detach $component.ref
  }
  if ($LASTEXITCODE -ne 0) { throw "Could not checkout pinned ref for $($component.name)" }

  $actual = (git -C $target rev-parse HEAD).Trim()
  if ($actual -ne $component.ref) {
    throw "$($component.name) checkout mismatch. expected=$($component.ref) actual=$actual"
  }

  Write-Host "[v0.5] $($component.name) pinned at $actual"
}

$ForgeDir = Join-Path $Root "vendor/forge"
$ForgePatch = Join-Path $Root "patches/forge/0001-playground-hitl-run-reattach.patch"
if ((Test-Path (Join-Path $ForgeDir ".git")) -and (Test-Path $ForgePatch)) {
  git -C $ForgeDir apply --reverse --check $ForgePatch 2>$null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "[v0.5] Forge governed patch already applied"
  }
  else {
    git -C $ForgeDir apply --check $ForgePatch
    if ($LASTEXITCODE -ne 0) { throw "Forge governed patch does not apply cleanly to the pinned upstream" }
    git -C $ForgeDir apply $ForgePatch
    if ($LASTEXITCODE -ne 0) { throw "Failed to apply Forge governed patch" }
    git -C $ForgeDir diff --check
    if ($LASTEXITCODE -ne 0) { throw "Forge governed patch introduced whitespace errors" }
    Write-Host "[v0.5] Applied Forge HITL refresh reattach patch"
  }
}

Write-Host ""
Write-Host "v0.5 upstream bootstrap PASS"
Write-Host "Next: ./scripts/run-v05.ps1"
