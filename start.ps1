# if node modules didn't exist then run install scripts
# otherwise just start the app
if (!(Test-Path -Path ".\node_modules")) {
    powershell -File install.ps1
}
Write-Host "[INFO]: Running Application in Development mode..." -ForegroundColor Cyan
powershell -File run.ps1