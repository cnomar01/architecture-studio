$ErrorActionPreference = "Stop"

$workspace = Split-Path -Parent $PSScriptRoot
$bridgePort = if ($env:OFFICE_AI_BRIDGE_PORT) { [int]$env:OFFICE_AI_BRIDGE_PORT } else { 8787 }

function Test-Port($port) {
    try {
        $connection = Test-NetConnection -ComputerName "127.0.0.1" -Port $port -WarningAction SilentlyContinue
        return $connection.TcpTestSucceeded
    }
    catch {
        return $false
    }
}

if (-not $env:OFFICE_AI_BRIDGE_TOKEN) { throw "OFFICE_AI_BRIDGE_TOKEN is required." }
if ($env:OFFICE_AI_BRIDGE_TOKEN.Length -lt 32) { throw "OFFICE_AI_BRIDGE_TOKEN must be at least 32 characters." }

if (-not (Test-Port $bridgePort)) {
    Write-Host "[START] Starting Mason & Arc Office AI bridge..."
    Start-Process -FilePath "node.exe" -ArgumentList (Join-Path $workspace "scripts\office-ai-bridge.mjs") -WorkingDirectory $workspace -WindowStyle Hidden
    for ($i = 1; $i -le 15; $i++) {
        Start-Sleep -Seconds 1
        if (Test-Port $bridgePort) {
            Write-Host "[OK] Office AI bridge is ready on 127.0.0.1:$bridgePort."
            break
        }
    }
}

if (-not (Test-Port $bridgePort)) { throw "Office AI bridge did not start on port $bridgePort." }

$cloudflared = Get-Command "cloudflared" -ErrorAction SilentlyContinue
if (-not $cloudflared) { throw "cloudflared is not installed or not in PATH. Install Cloudflare Tunnel first." }
if (-not $env:OFFICE_AI_TUNNEL_TOKEN) { throw "OFFICE_AI_TUNNEL_TOKEN is required for the named Cloudflare Tunnel." }

$running = Get-Process "cloudflared" -ErrorAction SilentlyContinue
if ($running) {
    Write-Host "[OK] cloudflared is already running."
    exit 0
}

Write-Host "[START] Starting Cloudflare Tunnel for Office AI..."
Start-Process -FilePath $cloudflared.Source -ArgumentList @("tunnel","--no-autoupdate","run","--token",$env:OFFICE_AI_TUNNEL_TOKEN) -WorkingDirectory $workspace -WindowStyle Hidden
Start-Sleep -Seconds 3

if (Get-Process "cloudflared" -ErrorAction SilentlyContinue) {
    Write-Host "[OK] Cloudflare Tunnel process started."
    Write-Host "[INFO] Set hosted OFFICE_AI_BRIDGE_URL to the tunnel hostname."
}
else {
    throw "cloudflared did not stay running. Check the tunnel token and Cloudflare configuration."
}
