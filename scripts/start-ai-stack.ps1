$ErrorActionPreference = "Continue"

$comfyPath = "C:\Users\cnoma\ComfyUI_windows_portable"
$comfyBat = Join-Path $comfyPath "run_nvidia_gpu.bat"

function Test-Port($port) {
    try {
        $connection = Test-NetConnection -ComputerName "127.0.0.1" -Port $port -WarningAction SilentlyContinue
        return $connection.TcpTestSucceeded
    }
    catch {
        return $false
    }
}

Write-Host ""
Write-Host "========================================="
Write-Host "      Mason & Arc AI Stack"
Write-Host "========================================="
Write-Host ""

# Start ComfyUI if it is not already running
if (Test-Port 8188) {
    Write-Host "[OK] ComfyUI is already running on port 8188."
}
else {
    Write-Host "[START] Starting ComfyUI..."

    if (Test-Path $comfyBat) {
        Start-Process `
            -FilePath "cmd.exe" `
            -ArgumentList "/c `"$comfyBat`"" `
        -WorkingDirectory $comfyPath `
        -WindowStyle Hidden

        Write-Host "[WAIT] Waiting for ComfyUI..."

        for ($i = 1; $i -le 30; $i++) {
            Start-Sleep -Seconds 1

            if (Test-Port 8188) {
                Write-Host "[OK] ComfyUI is ready."
                break
            }
        }
    }
    else {
        Write-Host "[ERROR] ComfyUI launcher not found:"
        Write-Host $comfyBat
    }
}

Write-Host ""
Write-Host "[CHECK] FFmpeg..."

try {
    $ffmpeg = Get-Command ffmpeg -ErrorAction Stop
    Write-Host "[OK] FFmpeg: $($ffmpeg.Source)"
}
catch {
    $ffmpegPath = "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\Gyan.FFmpeg.Shared_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.1-full_build-shared\bin"

    if (Test-Path (Join-Path $ffmpegPath "ffmpeg.exe")) {
        $env:Path += ";$ffmpegPath"
        Write-Host "[OK] FFmpeg path loaded."
    }
    else {
        Write-Host "[WARNING] FFmpeg was not found."
    }
}

Write-Host ""
Write-Host "[CHECK] Ollama..."

if (Test-Port 11434) {
    Write-Host "[OK] Ollama is running on port 11434."
}
else {
    Write-Host "[START] Starting Ollama..."
    $ollamaCommand = Get-Command "ollama" -ErrorAction SilentlyContinue
    if ($ollamaCommand) {
        Start-Process -FilePath $ollamaCommand.Source -ArgumentList "serve" -WindowStyle Hidden
        for ($i = 1; $i -le 15; $i++) {
            Start-Sleep -Seconds 1
            if (Test-Port 11434) {
                Write-Host "[OK] Ollama is ready."
                break
            }
        }
    }
    else {
        Write-Host "[ERROR] Ollama was not found in PATH."
    }
}

Write-Host ""
Write-Host "========================================="
Write-Host "       AI Stack check completed"
Write-Host "========================================="
Write-Host ""
