Write-Host "[INFO]: running tests for both client and server..." -ForegroundColor Cyan
Write-Host ""

$filepath = ".\env.txt"

if (Test-Path -Path $filepath) {
    $Env:ENV_TXT = Get-Content -Path $filepath -Raw
}
else {
    Write-Host "[WARN]: env.txt was not found, using env.sample.txt instead." -ForegroundColor Yellow
    $filepath = ".\env.sample.txt"
    $Env:ENV_TXT = Get-Content -Path $filepath -Raw
}

Write-Host "[INFO]: running server tests..." -ForegroundColor Cyan

Push-Location -Path ".\server"
npm run server:ci
Pop-Location

Write-Host "[INFO]: running client tests..." -ForegroundColor Cyan

Push-Location -Path ".\client"
npm run test:ci
Pop-Location