$ErrorActionPreference = "Continue"

$workspace = Split-Path -Parent $PSScriptRoot
$aiStarter = Join-Path $PSScriptRoot "start-ai-stack.ps1"

if (Test-Path -LiteralPath $aiStarter) {
    & $aiStarter
}

$studioRunning = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue

if (-not $studioRunning) {
    Start-Process `
        -FilePath "npm.cmd" `
        -ArgumentList "run", "dev" `
        -WorkingDirectory $workspace `
        -WindowStyle Hidden
}
