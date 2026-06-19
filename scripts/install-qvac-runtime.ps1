param(
  [string]$RuntimeDir = "C:\qvac-runtime",
  [string]$Registry = "https://registry.npmjs.org"
)

$ErrorActionPreference = "Stop"

New-Item -ItemType Directory -Force -Path $RuntimeDir | Out-Null
Set-Location $RuntimeDir

if (-not (Test-Path "package.json")) {
  npm init -y | Out-Null
}

$packageJson = @{
  name = "qvac-privacy-desk-runtime"
  version = "0.1.0"
  private = $true
  type = "module"
  dependencies = @{
    "@qvac/bare-sdk" = "0.13.5"
    "b4a" = "1.8.1"
    "@qvac/llm-llamacpp" = "0.24.0"
    "@qvac/embed-llamacpp" = "0.19.1"
  }
}

$packageJson | ConvertTo-Json -Depth 4 | Set-Content -Encoding UTF8 "package.json"

npm install `
  --registry=$Registry `
  --fetch-retries=5 `
  --fetch-retry-maxtimeout=120000 `
  --no-audit `
  --no-fund

if ($LASTEXITCODE -ne 0) {
  throw "npm install failed with exit code $LASTEXITCODE"
}

Write-Host "QVAC runtime installed at $RuntimeDir"
Write-Host "Set QVAC_RUNTIME_NODE_MODULES=$RuntimeDir\node_modules before starting the app."
