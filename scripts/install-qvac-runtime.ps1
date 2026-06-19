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

npm install `
  "@qvac/sdk@0.13.5" `
  "b4a@1.8.1" `
  "@qvac/llm-llamacpp@0.24.0" `
  "@qvac/embed-llamacpp@0.19.1" `
  --registry=$Registry `
  --fetch-retries=5 `
  --fetch-retry-maxtimeout=120000 `
  --no-audit `
  --no-fund

Write-Host "QVAC runtime installed at $RuntimeDir"
Write-Host "Set QVAC_RUNTIME_NODE_MODULES=$RuntimeDir\node_modules before starting the app."
