# A-Y → Netlify deploy (Windows PowerShell)
# اجرا: .\deploy.ps1

$ErrorActionPreference = "Stop"

# --- پراکسی محلی ---
$env:HTTP_PROXY  = "http://127.0.0.1:10808"
$env:HTTPS_PROXY = "http://127.0.0.1:10808"
$env:GLOBAL_AGENT_HTTP_PROXY  = "http://127.0.0.1:10808"
$env:GLOBAL_AGENT_HTTPS_PROXY = "http://127.0.0.1:10808"

# --- Netlify ---
if (-not $env:NETLIFY_AUTH_TOKEN) {
  Write-Error "NETLIFY_AUTH_TOKEN env var not set. Export it before running this script."
  exit 1
}

# --- Node preload (undici ProxyAgent + global-agent) ---
$preload = Join-Path $PSScriptRoot "proxy-preload.js"
$env:NODE_OPTIONS = "--require `"$preload`""

# --- Node binary path ---
$env:PATH = "C:\Users\m.khorshidsavar\Desktop\node-v24.11.1-win-x64;" + $env:PATH

Write-Host "→ Running: netlify deploy --build --prod" -ForegroundColor Cyan
netlify deploy --build --prod
