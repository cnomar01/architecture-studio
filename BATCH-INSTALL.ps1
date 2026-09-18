$ErrorActionPreference='Stop'
$Root='C:\Users\cnoma\architecture-studio'
$Overlay=Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host 'Installing Mason & Arc final batch...'
Copy-Item "$Overlay\lib\core\*.ts" "$Root\lib\core\" -Force
Copy-Item "$Overlay\scripts\batch-final-migration.mjs" "$Root\scripts\" -Force
Copy-Item "$Overlay\public\manifest.webmanifest" "$Root\public\" -Force
$dirs=@('approvals','clients','documents','procurement','notifications','reports')
foreach($d in $dirs){New-Item -ItemType Directory -Force -Path "$Root\app\app\admin\$d" | Out-Null; Copy-Item "$Overlay\app\app\admin\$d\page.tsx" "$Root\app\app\admin\$d\page.tsx" -Force}
Write-Host 'Files installed. Run: node --env-file=.env.local scripts/batch-final-migration.mjs'
Write-Host 'Then run: npm run build'
