$ErrorActionPreference = "Stop"

# Per-user, non-admin startup: starting Windows starts the local AI stack.
# The public website can never start a process on this computer by itself.
$taskName = "MasonArc-AI-Autostart"
$scriptPath = Join-Path $PSScriptRoot "start-local-studio.ps1"
if (-not (Test-Path -LiteralPath $scriptPath)) { throw "AI start script was not found: $scriptPath" }

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -NonInteractive -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$scriptPath`""
$trigger = New-ScheduledTaskTrigger -AtLogOn -User "$env:USERDOMAIN\$env:USERNAME"
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 10) -MultipleInstances IgnoreNew
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Force | Out-Null
Write-Host "Registered $taskName for $env:USERNAME. The local studio, Ollama and ComfyUI will start when this Windows account signs in."
